import { useState } from 'react'
import type { ChemSkill } from '../hooks/useChemSkills'

type Difficulty = 'foundation' | 'standard' | 'stretch'

interface Props {
  skill: ChemSkill
  onStart: (difficulty: Difficulty, count: number) => void
  onBack: () => void
}

const DIFFICULTIES: { value: Difficulty; label: string; desc: string; colour: string }[] = [
  {
    value: 'foundation',
    label: 'Foundation',
    desc: 'Straightforward recall and application',
    colour: 'border-green-400 bg-green-50 text-green-800',
  },
  {
    value: 'standard',
    label: 'Standard',
    desc: 'Apply understanding to new contexts',
    colour: 'border-yellow-400 bg-yellow-50 text-yellow-800',
  },
  {
    value: 'stretch',
    label: 'Stretch',
    desc: 'Evaluate, reason, and explain deeply',
    colour: 'border-red-400 bg-red-50 text-red-800',
  },
]

const COUNTS = [3, 5, 10]

export function SessionConfig({ skill, onStart, onBack }: Props) {
  const [difficulty, setDifficulty] = useState<Difficulty>('standard')
  const [count, setCount] = useState(5)

  return (
    <div className="p-4 max-w-lg mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-gray-500
                   hover:text-gray-700 mb-4"
      >
        ‹ Skills
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-5">
        <span className="text-xs font-mono text-gray-400">{skill.skill_ref}</span>
        <p className="text-sm font-medium text-gray-800 mt-1 leading-snug">
          {skill.skill_text}
        </p>
      </div>

      <p className="text-sm font-semibold text-gray-600 mb-2">Difficulty</p>
      <div className="space-y-2 mb-6">
        {DIFFICULTIES.map(d => (
          <button
            key={d.value}
            onClick={() => setDifficulty(d.value)}
            className={`w-full text-left p-3 rounded-lg border-2 transition-all
              ${difficulty === d.value ? d.colour : 'border-gray-200 bg-white text-gray-700'}`}
          >
            <div className="font-semibold text-sm">{d.label}</div>
            <div className="text-xs mt-0.5 opacity-75">{d.desc}</div>
          </button>
        ))}
      </div>

      <p className="text-sm font-semibold text-gray-600 mb-2">Questions</p>
      <div className="flex gap-2 mb-8">
        {COUNTS.map(n => (
          <button
            key={n}
            onClick={() => setCount(n)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold border-2 transition-all
              ${count === n
                ? 'bg-gray-800 border-gray-800 text-white'
                : 'border-gray-200 bg-white text-gray-700'}`}
          >
            {n}
          </button>
        ))}
      </div>

      <button
        onClick={() => onStart(difficulty, count)}
        className="w-full py-4 bg-gray-900 text-white rounded-xl font-semibold
                   text-base hover:bg-gray-700 active:scale-95 transition-all"
      >
        Start session
      </button>
    </div>
  )
}
