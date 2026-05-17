import type { TopicGroup, ChemSkill } from '../hooks/useChemSkills'
import { TOPIC_META } from '../lib/topics'

interface Props {
  topic: TopicGroup
  subject: 'chemistry' | 'maths'
  onSelect: (skill: ChemSkill) => void
  onBack: () => void
}

const TYPE_LABEL: Record<string, string> = {
  recall:       'Recall',
  describe:     'Describe',
  explain:      'Explain',
  calculate:    'Calculate',
  balance:      'Balance',
  diagram:      'Diagram',
}

export function SkillSelector({ topic, subject, onSelect, onBack }: Props) {
  const meta = TOPIC_META[topic.topic_num]
  return (
    <div className="p-4 max-w-lg mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-gray-500
                   hover:text-gray-700 mb-4"
      >
        ‹ Topics
      </button>
      <div className={`${meta.colour} rounded-xl p-4 mb-5 flex items-center gap-3`}>
        <span className="text-3xl">{meta.icon}</span>
        <div>
          {subject === 'chemistry' && (
            <div className="font-bold text-white text-base">
              Topic {topic.topic_num}
            </div>
          )}
          <div className="font-bold text-white text-base">{topic.topic_name}</div>
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-3">Choose a skill</p>
      <div className="space-y-2">
        {topic.skills.map(skill => (
          <button
            key={skill.skill_ref}
            onClick={() => onSelect(skill)}
            className="w-full flex items-start gap-3 p-3 bg-white rounded-lg
                       border border-gray-100 shadow-sm hover:shadow-md
                       active:scale-95 transition-all text-left"
          >
            <span className="text-xs font-mono bg-gray-100 text-gray-500
                             px-2 py-1 rounded mt-0.5 flex-shrink-0">
              {skill.skill_ref}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-800 leading-snug">
                {skill.skill_text}
              </p>
              <span className="inline-block mt-1 text-xs bg-gray-50 text-gray-400
                               border border-gray-200 rounded px-1.5 py-0.5">
                {TYPE_LABEL[skill.question_type] ?? skill.question_type}
                {skill.diagram_req && ' · diagram'}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
