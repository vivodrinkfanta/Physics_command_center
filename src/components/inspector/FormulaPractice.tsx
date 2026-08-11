import { Check, Lightbulb, RefreshCw, Trophy } from 'lucide-react'
import { useMemo, useState } from 'react'
import { getVariableDefinition } from '../../data/variables'
import type { FormulaRecord } from '../../types/formula'
import {
  formatPracticeValue,
  generatePracticeProblem,
  isPracticeAnswerCorrect,
} from '../../utils/practice'
import { FormulaExpression } from '../math/FormulaExpression'

interface FormulaPracticeProps {
  formula: FormulaRecord
}

type PracticeFeedback = 'correct' | 'incorrect' | null

export function FormulaPractice({ formula }: FormulaPracticeProps) {
  const [variant, setVariant] = useState(0)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState<PracticeFeedback>(null)
  const [hintLevel, setHintLevel] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const problem = useMemo(() => generatePracticeProblem(formula, variant), [formula, variant])
  const unknown = getVariableDefinition(problem.solveFor)

  const checkAnswer = () => {
    const isCorrect = isPracticeAnswerCorrect(Number(answer), problem.expectedAnswer)
    if (isCorrect && feedback !== 'correct') setCorrectCount((current) => current + 1)
    setFeedback(isCorrect ? 'correct' : 'incorrect')
  }

  const nextProblem = () => {
    setVariant((current) => current + 1)
    setAnswer('')
    setFeedback(null)
    setHintLevel(0)
  }

  return (
    <section className="practice-instrument" aria-labelledby="practice-title">
      <header>
        <div>
          <span>Recall mode · {formula.subtopic}</span>
          <h2 id="practice-title">Solve first. Reveal only what you need.</h2>
        </div>
        <div className="practice-session" aria-label="Practice session progress">
          <Trophy aria-hidden="true" size={15} />
          <span>Confirmed</span>
          <strong>{String(correctCount).padStart(2, '0')}</strong>
        </div>
      </header>

      <div className="practice-instrument__problem">
        <div className="practice-instrument__problem-label">
          <span>Problem {String(variant + 1).padStart(2, '0')}</span>
          <small>SI units · numerical response</small>
        </div>
        <p>{problem.prompt}</p>
        <dl>
          {problem.knownValues.map((known) => {
            const variable = getVariableDefinition(known.variableId)
            return (
              <div key={known.variableId}>
                <dt>Known · {variable.name}</dt>
                <dd><var>{variable.symbol}</var> = {formatPracticeValue(known.value)} {known.unit}</dd>
              </div>
            )
          })}
          <div className="is-unknown">
            <dt>Unknown · {unknown.name}</dt>
            <dd><var>{unknown.symbol}</var> = ?</dd>
          </div>
        </dl>
      </div>

      <div className="practice-answer">
        <label htmlFor={`${formula.id}-practice-answer`}>Your answer</label>
        <div>
          <input
            autoComplete="off"
            id={`${formula.id}-practice-answer`}
            inputMode="decimal"
            onChange={(event) => {
              setAnswer(event.target.value)
              setFeedback(null)
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && answer) checkAnswer()
            }}
            placeholder="Enter a signed value"
            step="any"
            type="number"
            value={answer}
          />
          <span>{problem.answerUnit}</span>
          <button disabled={!answer} onClick={checkAnswer} type="button">
            <Check aria-hidden="true" size={15} /> Check
          </button>
        </div>
        <small>Answers within 0.5% are accepted.</small>
        {feedback && (
          <p className={`practice-feedback practice-feedback--${feedback}`} role="status">
            {feedback === 'correct'
              ? `Confirmed. ${unknown.symbol} = ${formatPracticeValue(problem.expectedAnswer)} ${problem.answerUnit}.`
              : 'Not confirmed yet. Check signs, powers, and the order of operations—or reveal one hint.'}
          </p>
        )}
      </div>

      <div className="practice-hints">
        <div className="practice-hints__actions">
          <button
            disabled={hintLevel >= 4}
            onClick={() => setHintLevel((current) => Math.min(4, current + 1))}
            type="button"
          >
            <Lightbulb aria-hidden="true" size={14} />
            {hintLevel === 0
              ? 'Reveal a hint'
              : hintLevel < 3
                ? 'Next hint'
                : hintLevel === 3
                  ? 'Reveal solution'
                  : 'Solution shown'}
          </button>
          <button onClick={nextProblem} type="button">
            <RefreshCw aria-hidden="true" size={14} /> New problem
          </button>
        </div>

        <div className="practice-hints__stack" aria-live="polite">
          {hintLevel >= 1 && (
            <article><span>01 · Select</span><p>Use the {formula.name} relationship.</p></article>
          )}
          {hintLevel >= 2 && (
            <article>
              <span>02 · Equation</span>
              <FormulaExpression expression={formula.expression} />
            </article>
          )}
          {hintLevel >= 3 && (
            <article><span>03 · Substitute</span><code>{problem.substitution}</code></article>
          )}
          {hintLevel >= 4 && (
            <article className="is-solution">
              <span>04 · Full solution</span>
              <code>
                {problem.substitution} = {formatPracticeValue(problem.expectedAnswer)} {problem.answerUnit}
              </code>
              <strong>{unknown.symbol} = {formatPracticeValue(problem.expectedAnswer)} {problem.answerUnit}</strong>
            </article>
          )}
        </div>
      </div>
    </section>
  )
}
