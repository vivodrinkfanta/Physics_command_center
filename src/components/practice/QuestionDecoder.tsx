import { ScanSearch } from 'lucide-react'
import type { IbPracticeQuestion } from '../../types/ibPractice'
import { buildQuestionCoaching } from '../../utils/questionCoaching'

interface QuestionDecoderProps {
  question: IbPracticeQuestion
}

export function QuestionDecoder({ question }: QuestionDecoderProps) {
  const coaching = buildQuestionCoaching(question)

  return (
    <details className="question-decoder" open>
      <summary>
        <ScanSearch aria-hidden="true" size={17} />
        <span><strong>Question Decoder</strong> Split the prompt before you solve it.</span>
      </summary>
      <div className="question-decoder__body">
        <section aria-labelledby="decoder-notice-title">
          <p className="eyebrow">Command term · {coaching.commandTerm}</p>
          <h2 id="decoder-notice-title">What to notice first</h2>
          <p>{coaching.commandMeaning}</p>
          <ul>{coaching.notices.map((notice) => <li key={notice}>{notice}</li>)}</ul>
        </section>
        <section aria-labelledby="decoder-steps-title">
          <p className="eyebrow">Five-pass method</p>
          <h2 id="decoder-steps-title">Split the question into solvable moves</h2>
          <ol>{coaching.steps.map((step, index) => <li key={step.label}><span>{String(index + 1).padStart(2, '0')}</span><div><strong>{step.label}</strong><p>{step.instruction}</p></div></li>)}</ol>
        </section>
      </div>
      <p className="question-decoder__tip">Close this guide when you can reproduce the five passes independently.</p>
    </details>
  )
}
