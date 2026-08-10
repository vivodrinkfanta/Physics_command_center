import { Check, Lightbulb, RefreshCw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { calculateAcceleration, formatMeasurement } from '../../utils/newtonSecondLaw'

const practiceProblems = [
  { force: 32, mass: 8 },
  { force: 45, mass: 5 },
  { force: -24, mass: 6 },
  { force: 18, mass: 12 },
]

export function NewtonPractice() {
  const [problemIndex, setProblemIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [hintLevel, setHintLevel] = useState(0)
  const problem = practiceProblems[problemIndex]
  const expectedAnswer = useMemo(
    () => calculateAcceleration(problem.force, problem.mass),
    [problem],
  )

  const checkAnswer = () => {
    const numericAnswer = Number(answer)
    setFeedback(
      Number.isFinite(numericAnswer) && Math.abs(numericAnswer - expectedAnswer) < 0.01
        ? 'correct'
        : 'incorrect',
    )
  }

  const nextProblem = () => {
    setProblemIndex((current) => (current + 1) % practiceProblems.length)
    setAnswer('')
    setFeedback(null)
    setHintLevel(0)
  }

  return (
    <section className="practice-instrument" aria-labelledby="practice-title">
      <header>
        <div>
          <span>Generated practice · acceleration</span>
          <h2 id="practice-title">Solve without moving the simulation controls.</h2>
        </div>
        <button onClick={nextProblem} type="button">
          <RefreshCw aria-hidden="true" size={14} /> New problem
        </button>
      </header>

      <div className="practice-instrument__problem">
        <p>
          A {problem.mass} kg cart experiences a resultant force of {problem.force} N. Calculate
          its acceleration.
        </p>
        <dl>
          <div><dt>Known</dt><dd>m = {problem.mass} kg</dd></div>
          <div><dt>Known</dt><dd>ΣF = {problem.force} N</dd></div>
          <div><dt>Unknown</dt><dd>a = ?</dd></div>
        </dl>
      </div>

      <div className="practice-answer">
        <label htmlFor="newton-practice-answer">Your answer</label>
        <div>
          <input
            id="newton-practice-answer"
            inputMode="decimal"
            onChange={(event) => {
              setAnswer(event.target.value)
              setFeedback(null)
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') checkAnswer()
            }}
            placeholder="0.00"
            type="number"
            value={answer}
          />
          <span>m/s²</span>
          <button disabled={!answer} onClick={checkAnswer} type="button">
            <Check aria-hidden="true" size={15} /> Check
          </button>
        </div>
        {feedback && (
          <p className={`practice-feedback practice-feedback--${feedback}`} role="status">
            {feedback === 'correct'
              ? `Correct. The acceleration is ${formatMeasurement(expectedAnswer)} m/s².`
              : 'Not quite. Check the force direction and divide the resultant force by mass.'}
          </p>
        )}
      </div>

      <div className="practice-hints">
        <button
          disabled={hintLevel >= 3}
          onClick={() => setHintLevel((current) => Math.min(3, current + 1))}
          type="button"
        >
          <Lightbulb aria-hidden="true" size={14} />
          {hintLevel === 0 ? 'Reveal a hint' : hintLevel < 3 ? 'Next hint' : 'All hints shown'}
        </button>
        {hintLevel >= 1 && <p><span>01</span> Select Newton’s Second Law.</p>}
        {hintLevel >= 2 && <p><span>02</span> Rearrange to <var>a = ΣF/m</var>.</p>}
        {hintLevel >= 3 && (
          <p><span>03</span> Substitute: <var>a = {problem.force}/{problem.mass}</var>.</p>
        )}
      </div>
    </section>
  )
}
