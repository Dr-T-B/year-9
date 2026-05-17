import { useAuth } from './hooks/useAuth'
import { useChemSkills } from './hooks/useChemSkills'
import { TopicSelector } from './components/TopicSelector'
import { SkillSelector } from './components/SkillSelector'
import { SessionConfig } from './components/SessionConfig'
import { ProblemSession } from './components/ProblemSession'
import { SessionSummary } from './components/SessionSummary'
import type { TopicGroup, ChemSkill } from './hooks/useChemSkills'
import { useState } from 'react'

type Difficulty = 'foundation' | 'standard' | 'stretch'

interface SessionResult {
  confidence: 'red' | 'amber' | 'green'
  nextReview: Date | null
}

type Screen =
  | { name: 'topics' }
  | { name: 'skills'; topic: TopicGroup }
  | { name: 'config'; topic: TopicGroup; skill: ChemSkill }
  | { name: 'session'; topic: TopicGroup; skill: ChemSkill; difficulty: Difficulty; count: number }
  | { name: 'summary'; skill: ChemSkill; results: SessionResult[]; difficulty: Difficulty; count: number }

export default function App() {
  const { session, loading: authLoading } = useAuth()
  const { topics, loading: skillsLoading, error } = useChemSkills()
  const [screen, setScreen] = useState<Screen>({ name: 'topics' })

  if (authLoading || skillsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">⚗️</div>
          <p className="text-gray-400 text-sm">Loading…</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Sign-in failed</h2>
          <p className="text-sm text-gray-500">
            Check that VITE_FAMILY_EMAIL and VITE_FAMILY_PASSWORD are set in .env.local
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center max-w-sm">
          <p className="text-red-700 font-medium">Failed to load skills</p>
          <p className="text-red-500 text-sm mt-1">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <span className="text-2xl">⚗️</span>
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-none">
              Year 9 Chemistry
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Revision</p>
          </div>
        </div>
      </div>

      {/* Screens */}
      <div className="py-4">
        {screen.name === 'topics' && (
          <TopicSelector
            topics={topics}
            onSelect={topic => setScreen({ name: 'skills', topic })}
          />
        )}

        {screen.name === 'skills' && (
          <SkillSelector
            topic={screen.topic}
            onSelect={skill =>
              setScreen({ name: 'config', topic: screen.topic, skill })
            }
            onBack={() => setScreen({ name: 'topics' })}
          />
        )}

        {screen.name === 'config' && (
          <SessionConfig
            skill={screen.skill}
            onStart={(difficulty, count) =>
              setScreen({
                name: 'session',
                topic: screen.topic,
                skill: screen.skill,
                difficulty,
                count,
              })
            }
            onBack={() =>
              setScreen({ name: 'skills', topic: screen.topic })
            }
          />
        )}

        {screen.name === 'session' && (
          <ProblemSession
            skill={screen.skill}
            difficulty={screen.difficulty}
            count={screen.count}
            onDone={results =>
              setScreen({
                name: 'summary',
                skill: screen.skill,
                results,
                difficulty: screen.difficulty,
                count: screen.count,
              })
            }
            onBack={() =>
              setScreen({
                name: 'config',
                topic: screen.topic,
                skill: screen.skill,
              })
            }
          />
        )}

        {screen.name === 'summary' && (
          <SessionSummary
            results={screen.results}
            skillName={screen.skill.skill_text}
            onRepeat={() => {
              // Re-run same skill — find the topic
              const topic = topics.find(t =>
                t.skills.some(s => s.id === screen.skill.id)
              )!
              setScreen({
                name: 'session',
                topic,
                skill: screen.skill,
                difficulty: screen.difficulty,
                count: screen.count,
              })
            }}
            onTopics={() => setScreen({ name: 'topics' })}
          />
        )}
      </div>
    </div>
  )
}
