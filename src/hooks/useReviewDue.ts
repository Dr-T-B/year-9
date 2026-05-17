import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export interface DueSkill {
  skillId: string
  skillName: string
  subject: 'chemistry' | 'maths'
  groupName: string
  lastConfidence: 'red' | 'amber' | 'green'
  nextReview: string
  attemptNum: number
}

export interface UseReviewDueReturn {
  dueSkills: DueSkill[]
  totalDue: number
  loading: boolean
  error: string | null
}

const CONFIDENCE_ORDER: Record<string, number> = { red: 0, amber: 1, green: 2 }

export function useReviewDue(): UseReviewDueReturn {
  const [dueSkills, setDueSkills] = useState<DueSkill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDue = async () => {
      const today = new Date().toISOString().split('T')[0]

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setDueSkills([])
        setLoading(false)
        return
      }

      const [chemResult, mathsResult] = await Promise.all([
        supabase
          .from('chem_progress')
          .select('skill_id, attempt_num, confidence, next_review, chem_skills(skill_text, topic_name)')
          .lte('next_review', today),
        supabase
          .from('maths_progress')
          .select('skill_id, attempt_num, confidence, next_review, maths_skills(skill_name, term)')
          .eq('user_id', user.id)
          .lte('next_review', today),
      ])

      if (chemResult.error) {
        setError(chemResult.error.message)
        setLoading(false)
        return
      }
      if (mathsResult.error) {
        setError(mathsResult.error.message)
        setLoading(false)
        return
      }

      // Keep only the row with the highest attempt_num per skill
      const bestChem = new Map<string, typeof chemResult.data[number]>()
      for (const row of chemResult.data ?? []) {
        const existing = bestChem.get(row.skill_id)
        if (!existing || row.attempt_num > existing.attempt_num) {
          bestChem.set(row.skill_id, row)
        }
      }

      const bestMaths = new Map<string, typeof mathsResult.data[number]>()
      for (const row of mathsResult.data ?? []) {
        const existing = bestMaths.get(row.skill_id)
        if (!existing || row.attempt_num > existing.attempt_num) {
          bestMaths.set(row.skill_id, row)
        }
      }

      const chemDue: DueSkill[] = [...bestChem.values()].map(row => {
        const joined = row.chem_skills as unknown as { skill_text: string; topic_name: string } | null
        return {
          skillId: row.skill_id,
          skillName: joined?.skill_text ?? row.skill_id,
          subject: 'chemistry',
          groupName: joined?.topic_name ?? '',
          lastConfidence: row.confidence as 'red' | 'amber' | 'green',
          nextReview: row.next_review ?? today,
          attemptNum: row.attempt_num,
        }
      })

      const mathsDue: DueSkill[] = [...bestMaths.values()].map(row => {
        const joined = (row as any).maths_skills as { skill_name: string; term: string } | null
        return {
          skillId: row.skill_id,
          skillName: joined?.skill_name ?? row.skill_id,
          subject: 'maths',
          groupName: joined?.term ?? '',
          lastConfidence: row.confidence as 'red' | 'amber' | 'green',
          nextReview: row.next_review ?? today,
          attemptNum: row.attempt_num,
        }
      })

      const combined = [...chemDue, ...mathsDue].sort((a, b) => {
        const confDiff = CONFIDENCE_ORDER[a.lastConfidence] - CONFIDENCE_ORDER[b.lastConfidence]
        if (confDiff !== 0) return confDiff
        return a.nextReview.localeCompare(b.nextReview)
      })

      setDueSkills(combined)
      setError(null)
      setLoading(false)
    }

    fetchDue()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchDue()
    })

    return () => subscription.unsubscribe()
  }, [])

  return { dueSkills, totalDue: dueSkills.length, loading, error }
}
