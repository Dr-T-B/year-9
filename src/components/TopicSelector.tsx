import type { TopicGroup } from '../hooks/useChemSkills'
import { TOPIC_META } from '../lib/topics'

interface Props {
  topics: TopicGroup[]
  onSelect: (topic: TopicGroup) => void
}

export function TopicSelector({ topics, onSelect }: Props) {
  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-1">Chemistry</h2>
      <p className="text-sm text-gray-500 mb-6">Choose a topic to revise</p>
      <div className="space-y-3">
        {topics.map(topic => {
          const meta = TOPIC_META[topic.topic_num]
          return (
            <button
              key={topic.topic_num}
              onClick={() => onSelect(topic)}
              className="w-full flex items-center gap-4 p-4 bg-white rounded-xl
                         shadow-sm border border-gray-100 hover:shadow-md
                         active:scale-95 transition-all text-left"
            >
              <div className={`w-12 h-12 ${meta.colour} rounded-xl flex
                              items-center justify-center text-2xl flex-shrink-0`}>
                {meta.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800">
                  Topic {topic.topic_num}: {topic.topic_name}
                </div>
                <div className="text-sm text-gray-500 mt-0.5">
                  {topic.skills.length} skills
                </div>
              </div>
              <span className="text-gray-400 text-lg">›</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
