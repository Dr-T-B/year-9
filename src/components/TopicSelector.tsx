import type { SubjectGroup } from '../lib/topics'

interface Props {
  groups: SubjectGroup[]
  heading?: string
  onSelect: (group: SubjectGroup) => void
}

export function TopicSelector({ groups, heading, onSelect }: Props) {
  return (
    <div className="p-4 max-w-lg mx-auto">
      {heading && (
        <h2 className="text-xl font-bold text-gray-800 mb-1">{heading}</h2>
      )}
      <p className="text-sm text-gray-500 mb-6">Choose a topic to revise</p>
      <div className="space-y-3">
        {groups.map(group => (
          <button
            key={group.id}
            onClick={() => onSelect(group)}
            className="w-full flex items-center gap-4 p-4 bg-white rounded-xl
                       shadow-sm border border-gray-100 hover:shadow-md
                       active:scale-95 transition-all text-left"
          >
            <div className={`w-12 h-12 ${group.colour} rounded-xl flex
                            items-center justify-center text-2xl flex-shrink-0`}>
              {group.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-800">{group.name}</div>
              <div className="text-sm text-gray-500 mt-0.5">
                {group.skillCount} skills
              </div>
            </div>
            <span className="text-gray-400 text-lg">›</span>
          </button>
        ))}
      </div>
    </div>
  )
}
