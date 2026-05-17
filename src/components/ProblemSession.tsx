import { useState, useEffect, useCallback } from 'react'
import type { ChemSkill } from '../hooks/useChemSkills'
import { useProgress, type Confidence } from '../hooks/useProgress'
import { useMathsProgress } from '../hooks/useMathsProgress'
import { ProblemCard } from './ProblemCard'

interface Problem {
  question: string
  hint: string
  answer: string
  id?: string
}

interface SessionResult {
  confidence: Confidence
  nextReview: Date | null
}

interface Props {
  skill: ChemSkill
  difficulty: 'foundation' | 'standard' | 'stretch'
  count: number
  subject: 'chemistry' | 'maths'
  onDone: (results: SessionResult[]) => void
  onBack: () => void
}

const MATHS_DIFFICULTY_MAP: Record<string, string> = {
  foundation: 'easy',
  standard: 'medium',
  stretch: 'hard',
}

export function ProblemSession({ skill, difficulty, count, subject, onDone, onBack }: Props) {
  const [problems, setProblems] = useState<Problem[]>([])
  const [current, setCurrent] = useState(0)
  const [results, setResults] = useState<SessionResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { saveAttempt: saveChemAttempt, saving: chemSaving } = useProgress()
  const { saveAttempt: saveMathsAttempt, saving: mathsSaving } = useMathsProgress()
  const saveAttempt = subject === 'maths' ? saveMathsAttempt : saveChemAttempt
  const saving = subject === 'maths' ? mathsSaving : chemSaving

  useEffect(() => {
    const load = async () => {
      try {
        const apiDifficulty = subject === 'maths'
          ? (MATHS_DIFFICULTY_MAP[difficulty] ?? difficulty)
          : difficulty
        const res = await fetch('/api/generate-problems', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            skill_ref: skill.skill_ref,
            difficulty: apiDifficulty,
            count,
            subject,
          }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error ?? 'Unknown error')
        setProblems(data.problems)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load questions')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [skill.skill_ref, difficulty, count])

  const handleRate = useCallback(async (confidence: Confidence) => {
    const nextReview = await saveAttempt({
      skill_id: skill.id,
      confidence,
    })

    const newResult = { confidence, nextReview }
    const newResults = [...results, newResult]
    setResults(newResults)

    if (current + 1 >= problems.length) {
      // Short delay so the save confirmation shows
      setTimeout(() => onDone(newResults), 600)
    } else {
      setTimeout(() => setCurrent(c => c + 1), 400)
    }
  }, [current, problems.length, results, saveAttempt, skill.id, onDone])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">🧪</div>
          <p className="text-gray-500 text-sm">Generating questions…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 max-w-lg mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center">
          <p className="text-red-700 font-medium mb-1">Something went wrong</p>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm"
          >
            Go back
          </button>
        </div>
      </div>
    )
  }

  return (
    <ProblemCard
      key={current}
      question={problems[current].question}
      hint={problems[current].hint}
      answer={problems[current].answer}
      index={current}
      total={problems.length}
      onRate={handleRate}
      saving={saving}
    />
  )
}
