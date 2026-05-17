import { Handler, HandlerEvent, HandlerResponse } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'
import type {
  GenerateRequest,
  GenerateResponse,
  ErrorResponse,
  Problem,
  Difficulty,
  MathsDifficulty
} from './types'

// ─── Constants ──────────────────────────────────────────────────────────────

const CACHE_MIN_SIZE = 5      // Only use cache if >= this many problems exist
const MAX_COUNT = 10          // Maximum problems per request
const MODEL = 'claude-sonnet-4-6'

// Chemistry: content types that provide the most useful context for generation
const CONTEXT_TYPES = ['concept', 'worked_example', 'equation', 'definition']
// Maths: equivalent context types (uses different column names in maths_content)
const MATHS_CONTEXT_TYPES = ['concept', 'worked_example', 'formula', 'definition']
const MAX_CONTEXT_ROWS = 3

const CHEM_DIFFICULTIES: Difficulty[] = ['foundation', 'standard', 'stretch']
const MATHS_DIFFICULTIES: MathsDifficulty[] = ['easy', 'medium', 'hard']

// ─── Helpers ────────────────────────────────────────────────────────────────

function jsonResponse(
  body: GenerateResponse | ErrorResponse,
  statusCode = 200
): HandlerResponse {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ─── Main handler ───────────────────────────────────────────────────────────

export const handler: Handler = async (event: HandlerEvent) => {

  // ── 1. Only accept POST ──────────────────────────────────────────────────
  if (event.httpMethod !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  // ── 2. Parse and validate request body ──────────────────────────────────
  let req: GenerateRequest
  try {
    req = JSON.parse(event.body ?? '{}')
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400)
  }

  const { skill_ref, difficulty, count, subject = 'chemistry' } = req

  if (!skill_ref || typeof skill_ref !== 'string') {
    return jsonResponse({ error: 'skill_ref is required' }, 400)
  }
  if (!['chemistry', 'maths'].includes(subject)) {
    return jsonResponse({ error: 'subject must be chemistry or maths' }, 400)
  }
  const validDifficulties = subject === 'maths' ? MATHS_DIFFICULTIES : CHEM_DIFFICULTIES
  if (!(validDifficulties as string[]).includes(difficulty)) {
    return jsonResponse({ error: `difficulty must be ${validDifficulties.join(', ')} for ${subject}` }, 400)
  }
  if (!count || count < 1 || count > MAX_COUNT) {
    return jsonResponse({ error: `count must be between 1 and ${MAX_COUNT}` }, 400)
  }

  // ── 3. Initialise Supabase (service role — server side only) ────────────
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    return jsonResponse({ error: 'Supabase environment variables not set' }, 500)
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  // ── 4. Route to Maths path if subject === 'maths' ────────────────────────
  if (subject === 'maths') {
    return handleMaths(supabase, skill_ref, difficulty as MathsDifficulty, count)
  }

  // ── 4. Fetch the skill (Chemistry) ──────────────────────────────────────
  const { data: skill, error: skillError } = await supabase
    .from('chem_skills')
    .select('id, skill_ref, skill_text, question_type, ao_tag')
    .eq('skill_ref', skill_ref)
    .single()

  if (skillError || !skill) {
    return jsonResponse({ error: `Skill not found: ${skill_ref}` }, 404)
  }

  // ── 5. Check the cache ───────────────────────────────────────────────────
  const { data: cached, error: cacheError } = await supabase
    .from('chem_problems')
    .select('id, question, hint, answer')
    .eq('skill_id', skill.id)
    .eq('difficulty', difficulty)

  if (!cacheError && cached && cached.length >= CACHE_MIN_SIZE) {
    // Enough cached problems — shuffle and return `count` of them
    const selected = shuffleArray(cached).slice(0, count)

    // Fire-and-forget atomic increment — does not block the response
    const selectedIds = selected.map(p => p.id)
    selectedIds.forEach(id => {
      supabase.rpc('increment_times_served', { problem_id: id }).catch(() => {})
    })

    return jsonResponse({
      problems: selected.map(p => ({
        question: p.question,
        hint: p.hint,
        answer: p.answer,
      })),
      source: 'cache',
      skill_ref,
      difficulty,
    })
  }

  // ── 6. Fetch reference content for this skill ────────────────────────────
  const { data: content, error: contentError } = await supabase
    .from('chem_content')
    .select('type, content')
    .eq('skill_id', skill.id)
    .in('type', CONTEXT_TYPES)
    .limit(MAX_CONTEXT_ROWS)

  if (contentError || !content || content.length === 0) {
    return jsonResponse({
      error: `No reference content found for skill: ${skill_ref}`,
    }, 500)
  }

  // Also fetch the common_error for this skill — always include it
  const { data: errorRow } = await supabase
    .from('chem_content')
    .select('content')
    .eq('skill_id', skill.id)
    .eq('type', 'common_error')
    .limit(1)
    .single()

  // ── 7. Build the prompt ──────────────────────────────────────────────────
  const difficultyGuide: Record<Difficulty, string> = {
    foundation:
      'Straightforward recall or single-step application. '
      + 'The answer can be found directly from the reference content. '
      + 'Suitable for a student who is still learning the topic.',
    standard:
      'Requires understanding and application to a slightly unfamiliar context. '
      + 'May involve two steps or require the student to explain reasoning. '
      + 'Suitable for a student who knows the basics.',
    stretch:
      'Requires extended reasoning, multi-step working, evaluation, or '
      + 'application to a novel context not directly stated in the reference. '
      + 'May ask the student to compare, evaluate, or explain why. '
      + 'Suitable for a student aiming for top marks.',
  }

  const contextText = content
    .map(row => `[${row.type.toUpperCase()}]\n${row.content}`)
    .join('\n\n')

  const commonErrorText = errorRow?.content
    ? `\n\n[COMMON ERROR TO PROBE]\n${errorRow.content}`
    : ''

  const systemPrompt = `You are a Year 9 Chemistry exam question generator for a UK secondary school.
You generate questions based ONLY on the reference content provided.
Do not introduce topics, substances, or concepts not present in the reference content.

Return a JSON array of exactly ${count} question object(s). Each object must have:
- "question": the exam question (clear, unambiguous, appropriate for Year 9)
- "hint": a brief clue that reveals the method or starting point without giving the answer
- "answer": the complete correct answer, including units or state symbols where appropriate

Rules:
- Do not repeat the same question with only surface changes
- Vary the question format where possible (e.g. define, calculate, describe, explain, complete)
- For 'balance' type: provide a partial or unbalanced equation for the student to complete
- For 'describe' or 'explain' type: give a scenario and ask the student to respond
- The hint must help a stuck student without making the answer trivial
- Return ONLY the JSON array. No markdown, no preamble, no explanation outside the array.`

  const userMessage = `Skill: ${skill.skill_text}
Question type: ${skill.question_type}
Assessment objective: ${skill.ao_tag}
Difficulty level: ${difficulty}

Difficulty guidance: ${difficultyGuide[difficulty as Difficulty]}

Reference content:
${contextText}${commonErrorText}

Generate ${count} ${difficulty}-level question(s) of type "${skill.question_type}" for this skill.`

  // ── 8. Call the Anthropic API ────────────────────────────────────────────
  const anthropicKey = process.env.ANTHROPIC_API_KEY
  if (!anthropicKey) {
    return jsonResponse({ error: 'Anthropic API key not set' }, 500)
  }

  const anthropic = new Anthropic({ apiKey: anthropicKey })

  let rawText: string
  try {
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    })

    rawText = message.content
      .filter(block => block.type === 'text')
      .map(block => (block as { type: 'text'; text: string }).text)
      .join('')
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err)
    return jsonResponse({ error: 'Anthropic API call failed', detail }, 502)
  }

  // ── 9. Parse the response ────────────────────────────────────────────────
  let problems: Problem[]
  try {
    // Strip any accidental markdown fences
    const clean = rawText.replace(/```json|```/g, '').trim()
    problems = JSON.parse(clean)

    if (!Array.isArray(problems)) throw new Error('Response is not an array')

    // Validate structure
    problems = problems.map((p, i) => {
      if (!p.question || !p.hint || !p.answer) {
        throw new Error(`Problem at index ${i} is missing required fields`)
      }
      return {
        question: String(p.question).trim(),
        hint: String(p.hint).trim(),
        answer: String(p.answer).trim(),
      }
    })
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err)
    return jsonResponse({
      error: 'Failed to parse API response as valid problems array',
      detail,
    }, 502)
  }

  // ── 10. Write generated problems to cache ────────────────────────────────
  const insertRows = problems.map(p => ({
    skill_id: skill.id,
    difficulty,
    question: p.question,
    hint: p.hint,
    answer: p.answer,
    times_served: 0,
  }))

  const { error: insertError } = await supabase
    .from('chem_problems')
    .insert(insertRows)

  if (insertError) {
    // Non-fatal — log but still return the problems to the client
    console.error('Failed to cache problems:', insertError.message)
  }

  // ── 11. Return to client ─────────────────────────────────────────────────
  return jsonResponse({
    problems,
    source: 'generated',
    skill_ref,
    difficulty,
  })
}

// ─── Maths handler ──────────────────────────────────────────────────────────

async function handleMaths(
  supabase: ReturnType<typeof createClient>,
  skill_ref: string,
  difficulty: MathsDifficulty,
  count: number,
): Promise<HandlerResponse> {

  const mathsDifficultyGuide: Record<MathsDifficulty, string> = {
    easy:
      'Straightforward recall or single-step application. '
      + 'The answer follows directly from the definition or a single formula. '
      + 'Suitable for a student who is still learning the topic.',
    medium:
      'Requires understanding and application to a slightly unfamiliar context. '
      + 'May involve two steps or require the student to show clear working. '
      + 'Suitable for a student who knows the basics.',
    hard:
      'Requires multi-step working, extended reasoning, or application to a novel '
      + 'context not directly stated in the reference. May ask the student to prove, '
      + 'derive, compare, or evaluate. Suitable for a student aiming for top marks.',
  }

  // ── M1. Fetch the skill ──────────────────────────────────────────────────
  const { data: skill, error: skillError } = await supabase
    .from('maths_skills')
    .select('id, skill_ref, skill_name, term')
    .eq('skill_ref', skill_ref)
    .single()

  if (skillError || !skill) {
    return jsonResponse({ error: `Maths skill not found: ${skill_ref}` }, 404)
  }

  // ── M2. Check the cache ──────────────────────────────────────────────────
  const { data: cached, error: cacheError } = await supabase
    .from('maths_problems')
    .select('id, question_text, hint_text, answer_text')
    .eq('skill_id', skill.id)
    .eq('difficulty', difficulty)

  if (!cacheError && cached && cached.length >= CACHE_MIN_SIZE) {
    const selected = shuffleArray(cached).slice(0, count)

    // Fire-and-forget increment — does not block response
    selected.map(p => p.id).forEach(id => {
      supabase.rpc('increment_maths_times_served', { problem_id: id }).catch(() => {})
    })

    return jsonResponse({
      problems: selected.map(p => ({
        question: p.question_text,
        hint: p.hint_text,
        answer: p.answer_text,
      })),
      source: 'cache',
      skill_ref,
      difficulty,
    })
  }

  // ── M3. Fetch reference content ──────────────────────────────────────────
  const { data: content, error: contentError } = await supabase
    .from('maths_content')
    .select('content_type, content_text')
    .eq('skill_id', skill.id)
    .in('content_type', MATHS_CONTEXT_TYPES)
    .limit(MAX_CONTEXT_ROWS)

  if (contentError || !content || content.length === 0) {
    return jsonResponse({
      error: `No reference content found for maths skill: ${skill_ref}`,
    }, 500)
  }

  const { data: errorRow } = await supabase
    .from('maths_content')
    .select('content_text')
    .eq('skill_id', skill.id)
    .eq('content_type', 'common_error')
    .limit(1)
    .single()

  // ── M4. Build the prompt ─────────────────────────────────────────────────
  const contextText = content
    .map(row => `[${row.content_type.toUpperCase()}]\n${row.content_text}`)
    .join('\n\n')

  const commonErrorText = errorRow?.content_text
    ? `\n\n[COMMON ERROR TO PROBE]\n${errorRow.content_text}`
    : ''

  const systemPrompt = `You are a Year 9 GCSE Maths exam question generator for a UK secondary school.
You generate questions based ONLY on the reference content provided.
Do not introduce topics, methods, or contexts not present in the reference content.

Return a JSON array of exactly ${count} question object(s). Each object must have:
- "question": the exam question (clear, unambiguous, appropriate for GCSE Year 9)
- "hint": a one-sentence clue that reveals the method or starting formula without giving the answer
- "answer": the complete worked answer with all steps shown, including units where appropriate

Rules:
- Show your working clearly in the answer — not just the final value
- Give exact answers where possible (e.g. leave in surd or pi form unless rounding is asked for)
- State any formula used at the start of the working in the answer
- Do not repeat the same question with only surface changes
- Vary the question format where possible (find, calculate, prove, show, write down, sketch)
- The hint must help a stuck student identify the right method without making the answer trivial
- Return ONLY the JSON array. No markdown, no preamble, no explanation outside the array.`

  const userMessage = `Skill: ${skill.skill_name}
Term: ${skill.term}
Difficulty level: ${difficulty}

Difficulty guidance: ${mathsDifficultyGuide[difficulty]}

Reference content:
${contextText}${commonErrorText}

Generate ${count} ${difficulty}-level question(s) for this skill.`

  // ── M5. Call the Anthropic API ───────────────────────────────────────────
  const anthropicKey = process.env.ANTHROPIC_API_KEY
  if (!anthropicKey) {
    return jsonResponse({ error: 'Anthropic API key not set' }, 500)
  }

  const anthropic = new Anthropic({ apiKey: anthropicKey })

  let rawText: string
  try {
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    })

    rawText = message.content
      .filter(block => block.type === 'text')
      .map(block => (block as { type: 'text'; text: string }).text)
      .join('')
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err)
    return jsonResponse({ error: 'Anthropic API call failed', detail }, 502)
  }

  // ── M6. Parse the response ───────────────────────────────────────────────
  let problems: Problem[]
  try {
    const clean = rawText.replace(/```json|```/g, '').trim()
    problems = JSON.parse(clean)

    if (!Array.isArray(problems)) throw new Error('Response is not an array')

    problems = problems.map((p, i) => {
      if (!p.question || !p.hint || !p.answer) {
        throw new Error(`Problem at index ${i} is missing required fields`)
      }
      return {
        question: String(p.question).trim(),
        hint: String(p.hint).trim(),
        answer: String(p.answer).trim(),
      }
    })
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err)
    return jsonResponse({
      error: 'Failed to parse API response as valid problems array',
      detail,
    }, 502)
  }

  // ── M7. Write to cache ───────────────────────────────────────────────────
  const insertRows = problems.map(p => ({
    skill_id: skill.id,
    difficulty,
    question_text: p.question,
    answer_text: p.answer,
    hint_text: p.hint,
    times_served: 0,
  }))

  const { error: insertError } = await supabase
    .from('maths_problems')
    .insert(insertRows)

  if (insertError) {
    console.error('Failed to cache maths problems:', insertError.message)
  }

  // ── M8. Return to client ─────────────────────────────────────────────────
  return jsonResponse({
    problems,
    source: 'generated',
    skill_ref,
    difficulty,
  })
}
