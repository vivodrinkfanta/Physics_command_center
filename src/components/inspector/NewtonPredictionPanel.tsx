import { Brain, Check, ChevronRight, Play, RotateCw, X } from 'lucide-react'
import { useState } from 'react'
import type {
  FormulaPredictionChallenge,
  FormulaPredictionValue,
  PhysicsVariableId,
} from '../../types/formula'
import { calculateAcceleration, formatMeasurement } from '../../utils/newtonSecondLaw'

interface NewtonInputs {
  force: number
  mass: number
}

interface NewtonPredictionPanelProps {
  challenges: FormulaPredictionChallenge[]
  onDemonstrate: (inputs: NewtonInputs) => void
  onStageBaseline: (inputs: NewtonInputs) => void
}

type PredictionPhase = 'ready' | 'predicting' | 'answered' | 'demonstrated'

const getValue = (values: FormulaPredictionValue[], variableId: PhysicsVariableId) =>
  values.find((value) => value.variableId === variableId)?.value

const toNewtonInputs = (values: FormulaPredictionValue[]): NewtonInputs => ({
  force: getValue(values, 'resultant-force') ?? 0,
  mass: getValue(values, 'mass') ?? 1,
})

export function NewtonPredictionPanel({
  challenges,
  onDemonstrate,
  onStageBaseline,
}: NewtonPredictionPanelProps) {
  const [challengeIndex, setChallengeIndex] = useState(0)
  const [phase, setPhase] = useState<PredictionPhase>('ready')
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const challenge = challenges[challengeIndex]

  if (!challenge) return null

  const before = toNewtonInputs(challenge.beforeValues)
  const after = toNewtonInputs(challenge.afterValues)
  const beforeAcceleration = calculateAcceleration(before.force, before.mass)
  const afterAcceleration = calculateAcceleration(after.force, after.mass)
  const isCorrect = selectedOptionId === challenge.correctOptionId

  const stageBaseline = () => {
    onStageBaseline(before)
    setSelectedOptionId(null)
    setPhase('predicting')
  }

  const demonstrate = () => {
    onDemonstrate(after)
    setPhase('demonstrated')
  }

  const nextChallenge = () => {
    setChallengeIndex((current) => (current + 1) % challenges.length)
    setSelectedOptionId(null)
    setPhase('ready')
  }

  return (
    <section className="newton-prediction" aria-labelledby="newton-prediction-title">
      <header>
        <div>
          <span><Brain aria-hidden="true" size={15} /> Prediction mode</span>
          <h3 id="newton-prediction-title">Commit to an outcome before the lab changes.</h3>
        </div>
        <small>{String(challengeIndex + 1).padStart(2, '0')} / {String(challenges.length).padStart(2, '0')}</small>
      </header>

      <div className="prediction-question">
        <span>What do you think will happen?</span>
        <h4>{challenge.prompt}</h4>
        <div className="prediction-change" aria-label="Planned parameter change">
          <div>
            <span>Starting state</span>
            <strong>ΣF {formatMeasurement(before.force, 1)} N · m {formatMeasurement(before.mass, 1)} kg</strong>
            <small>a = {formatMeasurement(beforeAcceleration)} m/s²</small>
          </div>
          <ChevronRight aria-hidden="true" size={18} />
          <div>
            <span>Test state</span>
            <strong>ΣF {formatMeasurement(after.force, 1)} N · m {formatMeasurement(after.mass, 1)} kg</strong>
            <small className="prediction-change__hidden-reading">
              a = {phase === 'demonstrated' ? formatMeasurement(afterAcceleration) : '?'} m/s²
            </small>
          </div>
        </div>
      </div>

      <div className="prediction-options" aria-label="Prediction choices" role="group">
        {challenge.options.map((option, index) => {
          const isSelected = selectedOptionId === option.id
          const revealCorrect = phase === 'answered' || phase === 'demonstrated'
          const stateClass = revealCorrect
            ? option.id === challenge.correctOptionId
              ? ' is-correct'
              : isSelected
                ? ' is-incorrect'
                : ''
            : isSelected
              ? ' is-selected'
              : ''
          return (
            <button
              aria-pressed={isSelected}
              className={stateClass}
              disabled={phase !== 'predicting'}
              key={option.id}
              onClick={() => setSelectedOptionId(option.id)}
              type="button"
            >
              <span>{String.fromCharCode(65 + index)}</span>
              <strong>{option.label}</strong>
              {revealCorrect && option.id === challenge.correctOptionId && (
                <Check aria-hidden="true" size={15} />
              )}
              {revealCorrect && isSelected && option.id !== challenge.correctOptionId && (
                <X aria-hidden="true" size={15} />
              )}
            </button>
          )
        })}
      </div>

      {(phase === 'answered' || phase === 'demonstrated') && (
        <p className={`prediction-feedback ${isCorrect ? 'is-correct' : 'is-incorrect'}`} role="status">
          <strong>{isCorrect ? 'Prediction confirmed.' : 'Prediction revised.'}</strong>{' '}
          {challenge.explanation}
        </p>
      )}

      <div className="prediction-actions">
        {phase === 'ready' && (
          <button onClick={stageBaseline} type="button">
            <RotateCw aria-hidden="true" size={14} /> Stage starting state
          </button>
        )}
        {phase === 'predicting' && (
          <button
            disabled={!selectedOptionId}
            onClick={() => setPhase('answered')}
            type="button"
          >
            <Check aria-hidden="true" size={14} /> Lock prediction
          </button>
        )}
        {phase === 'answered' && (
          <button onClick={demonstrate} type="button">
            <Play aria-hidden="true" size={14} /> Demonstrate in lab
          </button>
        )}
        {phase === 'demonstrated' && (
          <button onClick={nextChallenge} type="button">
            Next prediction <ChevronRight aria-hidden="true" size={14} />
          </button>
        )}
        <small>
          {phase === 'ready' && 'Load a controlled baseline before answering.'}
          {phase === 'predicting' && 'Choose one outcome; the test state is still hidden.'}
          {phase === 'answered' && 'Now apply the change and watch every instrument respond.'}
          {phase === 'demonstrated' && 'Playback, vectors, readings, and telemetry now share the new state.'}
        </small>
      </div>
    </section>
  )
}
