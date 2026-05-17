import { useAuth } from './hooks/useAuth'
import { useChemSkills } from './hooks/useChemSkills'
import { useMathsSkills } from './hooks/useMathsSkills'
import { SubjectSelector } from './components/SubjectSelector'
import { TopicSelector } from './components/TopicSelector'
import { SkillSelector } from './components/SkillSelector'
import { SessionConfig } from './components/SessionConfig'
import { ProblemSession } from './components/ProblemSession'
import { SessionSummary } from './components/SessionSummary'
import type { TopicGroup, ChemSkill } from './hooks/useChemSkills'
import type { SubjectGroup } from './lib/topics'
import { TOPIC_META } from './lib/topics'
import { useState } from 'react'

type Subject = 'chemistry' | 'maths'
type Difficulty = 'foundation' | 'standard' | 'stretch'

interface SessionResult {
  confidence: 'red' | 'amber' | 'green'
  nextReview: Date | null
}

type Screen =
  | { name: 'subject-select' }
  | { name: 'topics' }
  | { name: 'skills'; topic: TopicGroup }
  | { name: 'config'; topic: TopicGroup; skill: ChemSkill }
  | { name: 'session'; topic: TopicGroup; skill: ChemSkill; difficulty: Difficulty; count: number }
  | { name: 'summary'; skill: ChemSkill; results: SessionResult[]; difficulty: Difficulty; count: number }

export default function App() {
  const { session, loading: authLoading } = useAuth()
  const { topics: chemTopics, loading: chemLoading, error: chemError } = useChemSkills()
  const { topics: mathsTopics, groups: mathsGroups, loading: mathsLoading, error: mathsError } = useMathsSkills()
  const [screen, setScreen] = useState<Screen>({ name: 'subject-select' })
  const [subject, setSubject] = useState<Subject | null>(null)

  const loading = authLoading || chemLoading || mathsLoading
  const error = chemError ?? mathsError

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">📚</div>
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

  // Convert chemistry TopicGroup[] → SubjectGroup[] for generic TopicSelector
  const chemGroups: SubjectGroup[] = chemTopics.map(t => ({
    id: String(t.topic_num),
    name: `Topic ${t.topic_num}: ${t.topic_name}`,
    colour: TOPIC_META[t.topic_num]?.colour ?? 'bg-gray-500',
    icon: TOPIC_META[t.topic_num]?.icon ?? '🔬',
    skillCount: t.skills.length,
  }))

  const activeGroups = subject === 'maths' ? mathsGroups : chemGroups
  const activeTopics = subject === 'maths' ? mathsTopics : chemTopics

  function handleSubjectSelect(s: Subject) {
    setSubject(s)
    setScreen({ name: 'topics' })
  }

  function handleTopicSelect(group: SubjectGroup) {
    const topic = activeTopics.find(t =>
      subject === 'maths'
        ? t.topic_name === group.id
        : String(t.topic_num) === group.id
    )
    if (topic) setScreen({ name: 'skills', topic })
  }

  const safeSubject = subject ?? 'chemistry'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <span className="text-2xl">
            {subject === 'maths' ? '🧮' : '⚗️'}
          </span>
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-none">
              {subject === 'maths' ? 'Year 9 Maths' : 'Year 9 Chemistry'}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Revision</p>
          </div>
        </div>
      </div>

      {/* Screens */}
      <div className="py-4">
        {screen.name === 'subject-select' && (
          <SubjectSelector onSelect={handleSubjectSelect} />
        )}

        {screen.name === 'topics' && (
          <TopicSelector
            groups={activeGroups}
            heading={subject === 'maths' ? 'Maths' : 'Chemistry'}
            onSelect={handleTopicSelect}
          />
        )}

        {screen.name === 'skills' && (
          <SkillSelector
            topic={screen.topic}
            subject={safeSubject}
            onSelect={skill =>
              setScreen({ name: 'config', topic: screen.topic, skill })
            }
            onBack={() => setScreen({ name: 'topics' })}
          />
        )}

        {screen.name === 'config' && (
          <SessionConfig
            skill={screen.skill}
            subject={safeSubject}
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
            subject={safeSubject}
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
            subject={safeSubject}
            onRepeat={() => {
              const topic = activeTopics.find(t =>
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
            onTopics={() => setScreen({ name: 'subject-select' })}
          />
        )}
      </div>
    </div>
  )
}
