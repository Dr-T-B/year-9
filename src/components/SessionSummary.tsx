import type { Confidence } from '../hooks/useProgress'

interface SessionResult {
  confidence: Confidence
  nextReview: Date | null
}

interface Props {
  results: SessionResult[]
  skillName: string
  subject: 'chemistry' | 'maths'
  onRepeat: () => void
  onTopics: () => void
}

const CONF_EMOJI: Record<Confidence, string> = {
  red: '🔴',
  amber: '🟡',
  green: '🟢',
}

const CONF_LABEL: Record<Confidence, string> = {
  red: 'Need more practice',
  amber: 'Getting there',
  green: 'Confident',
}

export function SessionSummary({ results, skillName, subject: _subject, onRepeat, onTopics }: Props) {
  const counts = results.reduce(
    (acc, r) => { acc[r.confidence]++; return acc },
    { red: 0, amber: 0, green: 0 } as Record<Confidence, number>
  )

  const latestReview = results
    .map(r => r.nextReview)
    .filter(Boolean)
    .sort((a, b) => (a?.getTime() ?? 0) - (b?.getTime() ?? 0))
    .at(-1)

  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">
          {counts.green >= results.length / 2 ? '🎉' : '💪'}
        </div>
        <h2 className="text-xl font-bold text-gray-900">Session complete</h2>
        <p className="text-sm text-gray-500 mt-1 leading-snug px-4">{skillName}</p>
      </div>

      {/* Results breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Results
        </p>
        <div className="space-y-2">
          {(['green', 'amber', 'red'] as Confidence[]).map(c =>
            counts[c] > 0 ? (
              <div key={c} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{CONF_EMOJI[c]}</span>
                  <span className="text-sm text-gray-700">{CONF_LABEL[c]}</span>
                </div>
                <span className="text-sm font-bold text-gray-800">
                  {counts[c]} / {results.length}
                </span>
              </div>
            ) : null
          )}
        </div>
      </div>

      {/* Next review date */}
      {latestReview && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
            Review this skill
          </p>
          <p className="text-sm text-blue-900 font-medium">
            {formatDate(latestReview)}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={onRepeat}
          className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold
                     text-sm hover:bg-gray-700 active:scale-95 transition-all"
        >
          Practice again
        </button>
        <button
          onClick={onTopics}
          className="w-full py-3 border-2 border-gray-200 text-gray-700
                     rounded-xl font-semibold text-sm hover:border-gray-300
                     active:scale-95 transition-all"
        >
          Choose another topic
        </button>
      </div>
    </div>
  )
}
