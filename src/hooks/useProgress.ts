import { useState } from 'react'
import { supabase } from '../lib/supabase'

export type Confidence = 'red' | 'amber' | 'green'

interface SaveProgressArgs {
  skill_id: string
  problem_id?: string
  confidence: Confidence
}

export function useProgress() {
  const [saving, setSaving] = useState(false)

  const saveAttempt = async ({
    skill_id,
    problem_id,
    confidence,
  }: SaveProgressArgs): Promise<Date | null> => {
    setSaving(true)

    // Determine next attempt number for this skill
    const { data: existing } = await supabase
      .from('chem_progress')
      .select('attempt_num')
      .eq('skill_id', skill_id)
      .order('attempt_num', { ascending: false })
      .limit(1)

    const nextAttempt = existing && existing.length > 0
      ? Math.min((existing[0].attempt_num as number) + 1, 4)
      : 1

    // Calculate next review date
    const daysMap: Record<Confidence, number> = {
      red: 1,
      amber: 3,
      green: nextAttempt >= 2 ? 14 : 7,
    }
    const nextReview = new Date()
    nextReview.setDate(nextReview.getDate() + daysMap[confidence])

    const { error } = await supabase
      .from('chem_progress')
      .upsert(
        {
          skill_id,
          problem_id: problem_id ?? null,
          attempt_num: nextAttempt,
          attempted_at: new Date().toISOString().split('T')[0],
          confidence,
          next_review: nextReview.toISOString().split('T')[0],
        },
        { onConflict: 'skill_id,attempt_num' }
      )

    setSaving(false)

    if (error) {
      console.error('Failed to save progress:', error.message)
      return null
    }

    return nextReview
  }

  return { saveAttempt, saving }
}
