interface SubjectSelectorProps {
  onSelect: (subject: 'chemistry' | 'maths') => void
  reviewCount: number
  onReviewTap: () => void
}

const SUBJECTS = [
  {
    key: 'chemistry' as const,
    icon: '⚗️',
    title: 'Chemistry',
    subtitle: '43 skills · 5 topics',
    colour: 'bg-blue-500',
  },
  {
    key: 'maths' as const,
    icon: '🧮',
    title: 'Maths',
    subtitle: '38 skills · 6 terms',
    colour: 'bg-indigo-600',
  },
]

export function SubjectSelector({ onSelect, reviewCount, onReviewTap }: SubjectSelectorProps) {
  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">What are you revising?</h2>
        <p className="text-sm text-gray-500 mt-1">Choose a subject to get started</p>
      </div>

      {reviewCount > 0 && (
        <button
          onClick={onReviewTap}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 mb-5
                     bg-amber-50 border border-amber-300 rounded-xl
                     hover:bg-amber-100 active:scale-95 transition-all"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">📋</span>
            <span className="text-sm font-semibold text-amber-800">
              {reviewCount} skill{reviewCount === 1 ? '' : 's'} due for review
            </span>
          </div>
          <span className="text-amber-500 text-lg leading-none">›</span>
        </button>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
        {SUBJECTS.map(s => (
          <button
            key={s.key}
            onClick={() => onSelect(s.key)}
            className="flex flex-col items-center justify-center gap-3 p-6 min-h-[160px]
                       bg-white rounded-2xl shadow-sm border border-gray-100
                       hover:shadow-md active:scale-95 transition-all"
          >
            <div className={`w-16 h-16 ${s.colour} rounded-2xl flex items-center
                            justify-center text-3xl flex-shrink-0`}>
              {s.icon}
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-900 text-base">{s.title}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.subtitle}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
