import { useState } from 'react'

export type Confidence = 'red' | 'amber' | 'green'

interface Props {
  question: string
  hint: string
  answer: string
  index: number
  total: number
  onRate: (confidence: Confidence) => void
  saving: boolean
}

export function ProblemCard({
  question, hint, answer, index, total, onRate, saving
}: Props) {
  const [showHint, setShowHint] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [rated, setRated] = useState(false)

  const handleRate = (confidence: Confidence) => {
    if (rated || saving) return
    setRated(true)
    onRate(confidence)
  }

  return (
    <div className="p-4 max-w-lg mx-auto">

      {/* Progress indicator */}
      <div className="flex items-center gap-2 mb-5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1.5 rounded-full transition-all
              ${i < index ? 'bg-gray-800' : i === index ? 'bg-gray-400' : 'bg-gray-200'}`}
          />
        ))}
      </div>

      {/* Question */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-4">
        <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">
          Question {index + 1} of {total}
        </p>
        <p className="text-base text-gray-900 leading-relaxed font-medium">
          {question}
        </p>
      </div>

      {/* Hint */}
      {!showHint ? (
        <button
          onClick={() => setShowHint(true)}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl
                     text-sm text-gray-500 hover:border-gray-400 hover:text-gray-600
                     transition-all mb-3"
        >
          Show hint
        </button>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-3">
          <p className="text-xs font-semibold text-yellow-700 mb-1 uppercase tracking-wide">
            Hint
          </p>
          <p className="text-sm text-yellow-900 leading-relaxed">{hint}</p>
        </div>
      )}

      {/* Answer */}
      {!showAnswer ? (
        <button
          onClick={() => setShowAnswer(true)}
          className="w-full py-3 bg-gray-900 text-white rounded-xl text-sm
                     font-semibold hover:bg-gray-700 active:scale-95 transition-all mb-6"
        >
          Reveal answer
        </button>
      ) : (
        <>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <p className="text-xs font-semibold text-green-700 mb-1 uppercase tracking-wide">
              Answer
            </p>
            <p className="text-sm text-green-900 leading-relaxed">{answer}</p>
          </div>

          {/* Confidence rating */}
          {!rated ? (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3 text-center">
                How did you find that?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleRate('red')}
                  className="flex-1 py-4 bg-red-500 hover:bg-red-600 active:scale-95
                             text-white rounded-xl font-bold text-lg transition-all"
                >
                  🔴
                  <div className="text-xs font-normal mt-1">No idea</div>
                </button>
                <button
                  onClick={() => handleRate('amber')}
                  className="flex-1 py-4 bg-amber-400 hover:bg-amber-500 active:scale-95
                             text-white rounded-xl font-bold text-lg transition-all"
                >
                  🟡
                  <div className="text-xs font-normal mt-1">Nearly</div>
                </button>
                <button
                  onClick={() => handleRate('green')}
                  className="flex-1 py-4 bg-green-500 hover:bg-green-600 active:scale-95
                             text-white rounded-xl font-bold text-lg transition-all"
                >
                  🟢
                  <div className="text-xs font-normal mt-1">Got it</div>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              {saving ? (
                <p className="text-sm text-gray-400">Saving…</p>
              ) : (
                <p className="text-sm text-gray-400">Saved ✓</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
