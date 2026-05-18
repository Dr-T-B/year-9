import { Handler, HandlerEvent, HandlerResponse } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'
import type { SkillTipResponse, ErrorResponse } from './types'

function jsonResponse(
  body: SkillTipResponse | ErrorResponse,
  statusCode = 200
): HandlerResponse {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }
}

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'GET') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  const skill_ref = event.queryStringParameters?.skill_ref
  const subject = event.queryStringParameters?.subject ?? 'chemistry'

  if (!skill_ref) {
    return jsonResponse({ error: 'skill_ref is required' }, 400)
  }
  if (!['chemistry', 'maths'].includes(subject)) {
    return jsonResponse({ error: 'subject must be chemistry or maths' }, 400)
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    return jsonResponse({ error: 'Supabase environment variables not set' }, 500)
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  if (subject === 'maths') {
    const { data: skill, error: skillError } = await supabase
      .from('maths_skills')
      .select('id')
      .eq('skill_ref', skill_ref)
      .single()

    if (skillError || !skill) {
      return jsonResponse({ error: `Maths skill not found: ${skill_ref}` }, 404)
    }

    const { data: rows } = await supabase
      .from('maths_content')
      .select('content_type, content_text')
      .eq('skill_id', skill.id)
      .in('content_type', ['common_error', 'concept'])

    const common_error = rows?.find(r => r.content_type === 'common_error')?.content_text ?? ''
    const concept = rows?.find(r => r.content_type === 'concept')?.content_text ?? ''

    return jsonResponse({ common_error, concept })
  }

  // Chemistry
  const { data: skill, error: skillError } = await supabase
    .from('chem_skills')
    .select('id')
    .eq('skill_ref', skill_ref)
    .single()

  if (skillError || !skill) {
    return jsonResponse({ error: `Skill not found: ${skill_ref}` }, 404)
  }

  const { data: rows } = await supabase
    .from('chem_content')
    .select('type, content')
    .eq('skill_id', skill.id)
    .in('type', ['common_error', 'concept'])

  const common_error = rows?.find(r => r.type === 'common_error')?.content ?? ''
  const concept = rows?.find(r => r.type === 'concept')?.content ?? ''

  return jsonResponse({ common_error, concept })
}
