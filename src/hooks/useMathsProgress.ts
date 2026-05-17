import { useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Confidence } from './useProgress'

interface SaveProgressArgs {
  skill_id: string
  confidence: Confidence
}

export function useMathsProgress() {
  const [saving, setSaving] = useState(false)

  const saveAttempt = async ({
    skill_id,
    confidence,
  }: SaveProgressArgs): Promise<Date | null> => {
    setSaving(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setSaving(false)
      return null
    }

    const { data: existing } = await supabase
      .from('maths_progress')
      .select('attempt_num')
      .eq('user_id', user.id)
      .eq('skill_id', skill_id)
      .order('attempt_num', { ascending: false })
      .limit(1)

    const nextAttempt = existing && existing.length > 0
      ? Math.min((existing[0].attempt_num as number) + 1, 4)
      : 1

    const daysMap: Record<Confidence, number> = {
      red: 1,
      amber: 3,
      green: nextAttempt >= 2 ? 14 : 7,
    }
    const nextReview = new Date()
    nextReview.setDate(nextReview.getDate() + daysMap[confidence])

    const { error } = await supabase
      .from('maths_progress')
      .upsert(
        {
          user_id: user.id,
          skill_id,
          attempt_num: nextAttempt,
          confidence,
          next_review: nextReview.toISOString().split('T')[0],
        },
        { onConflict: 'user_id,skill_id,attempt_num' }
      )

    setSaving(false)

    if (error) {
      console.error('Failed to save maths progress:', error.message)
      return null
    }

    return nextReview
  }

  return { saveAttempt, saving }
}
