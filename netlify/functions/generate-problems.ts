import { Handler, HandlerEvent, HandlerResponse } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'
import type {
  GenerateRequest,
  GenerateResponse,
  ErrorResponse,
  Problem,
  Difficulty
} from './types'

// ─── Constants ──────────────────────────────────────────────────────────────

const CACHE_MIN_SIZE = 5      // Only use cache if >= this many problems exist
const MAX_COUNT = 10          // Maximum problems per request
const MODEL = 'claude-sonnet-4-6'

// Content types that provide the most useful context for generation
const CONTEXT_TYPES = ['concept', 'worked_example', 'equation', 'definition']
const MAX_CONTEXT_ROWS = 3

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

  const { skill_ref, difficulty, count } = req

  if (!skill_ref || typeof skill_ref !== 'string') {
    return jsonResponse({ error: 'skill_ref is required' }, 400)
  }
  if (!['foundation', 'standard', 'stretch'].includes(difficulty)) {
    return jsonResponse({ error: 'difficulty must be foundation, standard, or stretch' }, 400)
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

  // ── 4. Fetch the skill ───────────────────────────────────────────────────
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
