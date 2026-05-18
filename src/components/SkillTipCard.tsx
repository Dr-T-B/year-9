interface TipData {
  common_error: string
  concept: string
}

interface Props {
  tipData: TipData
  subject: 'chemistry' | 'maths' | 'physics'
  onDismiss: () => void
}

const SUBJECT_ACCENT: Record<
  'chemistry' | 'maths' | 'physics',
  { headerBg: string; border: string; bg: string; label: string; button: string; icon: string }
> = {
  chemistry: {
    headerBg: 'bg-blue-500',
    border: 'border-blue-200',
    bg: 'bg-blue-50',
    label: 'text-blue-700',
    button: 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700',
    icon: '⚗️',
  },
  maths: {
    headerBg: 'bg-green-500',
    border: 'border-green-200',
    bg: 'bg-green-50',
    label: 'text-green-700',
    button: 'bg-green-500 hover:bg-green-600 active:bg-green-700',
    icon: '🧮',
  },
  physics: {
    headerBg: 'bg-amber-500',
    border: 'border-amber-200',
    bg: 'bg-amber-50',
    label: 'text-amber-700',
    button: 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700',
    icon: '⚡',
  },
}

export function SkillTipCard({ tipData, subject, onDismiss }: Props) {
  const accent = SUBJECT_ACCENT[subject] ?? SUBJECT_ACCENT.chemistry

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className={`bg-white rounded-xl shadow-sm border ${accent.border} overflow-hidden`}>
        {/* Subject colour header strip */}
        <div className={`${accent.headerBg} px-5 py-4 flex items-center gap-3`}>
          <span className="text-2xl">{accent.icon}</span>
          <div>
            <p className="text-white font-bold text-base leading-tight">Let's review a key concept</p>
            <p className="text-white/80 text-xs mt-0.5">You've missed a few — here's what to focus on</p>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Common mistake */}
          {tipData.common_error && (
            <div className={`${accent.bg} border ${accent.border} rounded-lg p-4`}>
              <p className={`text-xs font-semibold ${accent.label} uppercase tracking-wide mb-1.5`}>
                Common mistake
              </p>
              <p className="text-sm text-gray-800 leading-relaxed">{tipData.common_error}</p>
            </div>
          )}

          {/* Key concept */}
          {tipData.concept && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Key concept
              </p>
              <p className="text-sm text-gray-800 leading-relaxed">{tipData.concept}</p>
            </div>
          )}
        </div>

        {/* Large tap-target button */}
        <div className="px-5 pb-5">
          <button
            onClick={onDismiss}
            className={`w-full py-4 ${accent.button} text-white rounded-xl
                       font-semibold text-base active:scale-95 transition-all`}
          >
            Try the next problem →
          </button>
        </div>
      </div>
    </div>
  )
}
