import type { DueSkill } from '../hooks/useReviewDue'

interface ReviewDashboardProps {
  dueSkills: DueSkill[]
  onPractice: (skillId: string, subject: 'chemistry' | 'maths') => void
  onBack: () => void
}

const RAG_DOT: Record<string, string> = {
  red: '🔴',
  amber: '🟡',
  green: '🟢',
}

const SUBJECT_PILL: Record<string, string> = {
  chemistry: 'bg-blue-100 text-blue-700',
  maths: 'bg-indigo-100 text-indigo-700',
}

const SUBJECT_LABEL: Record<string, string> = {
  chemistry: 'Chemistry',
  maths: 'Maths',
}

export function ReviewDashboard({ dueSkills, onPractice, onBack }: ReviewDashboardProps) {
  return (
    <div className="p-4 max-w-lg mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-5"
      >
        ‹ Back
      </button>

      <h2 className="text-xl font-bold text-gray-900 mb-1">📋 Due for review</h2>
      <p className="text-sm text-gray-500 mb-5">
        {dueSkills.length === 0
          ? ''
          : `${dueSkills.length} skill${dueSkills.length === 1 ? '' : 's'} to practise today`}
      </p>

      {dueSkills.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">🎉</div>
          <p className="font-semibold text-gray-800 text-base">Nothing due today!</p>
          <p className="text-sm text-gray-500 mt-1">Come back tomorrow.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {dueSkills.map(skill => (
            <div
              key={`${skill.subject}-${skill.skillId}`}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3"
            >
              <span className="text-xl flex-shrink-0">{RAG_DOT[skill.lastConfidence]}</span>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm leading-snug truncate">
                  {skill.skillName}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">{skill.groupName}</p>
              </div>

              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${SUBJECT_PILL[skill.subject]}`}
                >
                  {SUBJECT_LABEL[skill.subject]}
                </span>
                <button
                  onClick={() => onPractice(skill.skillId, skill.subject)}
                  className="text-xs font-semibold px-3 py-1.5 bg-gray-900 text-white
                             rounded-lg hover:bg-gray-700 active:scale-95 transition-all"
                >
                  Practice now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
