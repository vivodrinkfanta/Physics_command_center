import { Pause, Play, RotateCcw } from 'lucide-react'
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type Dispatch,
  type SetStateAction,
} from 'react'
import type { FormulaPredictionChallenge, PhysicsVariableId } from '../../types/formula'
import { NewtonMotionTelemetry } from './NewtonMotionTelemetry'
import { NewtonPredictionPanel } from './NewtonPredictionPanel'
import {
  calculateMotion,
  formatMeasurement,
  NEWTON_FORCE_RANGE,
  NEWTON_MASS_RANGE,
  NEWTON_TIME_LIMIT,
  type NewtonState,
} from '../../utils/newtonSecondLaw'

interface NewtonSecondLawLabProps {
  highlightedVariable: PhysicsVariableId | null
  onHighlightVariable: (variableId: PhysicsVariableId | null) => void
  predictionChallenges: FormulaPredictionChallenge[]
  setState: Dispatch<SetStateAction<NewtonState>>
  state: NewtonState
}

interface LinkedControlProps {
  label: string
  max: number
  min: number
  onChange: (value: number) => void
  onHighlightVariable: (variableId: PhysicsVariableId | null) => void
  step: number
  symbol: string
  unit: string
  value: number
  variableId: PhysicsVariableId
}

const linkedClassName = (
  highlightedVariable: PhysicsVariableId | null,
  variableId: PhysicsVariableId,
) =>
  highlightedVariable
    ? highlightedVariable === variableId
      ? ' is-linked'
      : ' is-dimmed'
    : ''

function LinkedControl({
  label,
  max,
  min,
  onChange,
  onHighlightVariable,
  step,
  symbol,
  unit,
  value,
  variableId,
}: LinkedControlProps) {
  const progress = ((value - min) / (max - min)) * 100

  return (
    <label
      className="newton-control"
      data-variable-id={variableId}
      onBlur={() => onHighlightVariable(null)}
      onFocus={() => onHighlightVariable(variableId)}
      onMouseEnter={() => onHighlightVariable(variableId)}
      onMouseLeave={() => onHighlightVariable(null)}
    >
      <span className="newton-control__heading">
        <span>
          <var>{symbol}</var>
          <strong>{label}</strong>
        </span>
        <output>
          {formatMeasurement(value, 1)} <small>{unit}</small>
        </output>
      </span>
      <input
        aria-label={`${label} in ${unit}`}
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        step={step}
        style={{ '--range-progress': `${progress}%` } as CSSProperties}
        type="range"
        value={value}
      />
      <span className="newton-control__range" aria-hidden="true">
        <small>{min}</small>
        <small>{max}</small>
      </span>
    </label>
  )
}

export function NewtonSecondLawLab({
  highlightedVariable,
  onHighlightVariable,
  predictionChallenges,
  setState,
  state,
}: NewtonSecondLawLabProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const previousFrame = useRef<number | null>(null)
  const motion = calculateMotion(state.force, state.mass, state.time)
  const positionToCartCenter = (position: number) => 300 + 160 * Math.tanh(position / 90)
  const cartCenter = positionToCartCenter(motion.position)
  const cartWidth = 68 + ((state.mass - NEWTON_MASS_RANGE.min) / 19) * 34
  const cartHeight = 34 + ((state.mass - NEWTON_MASS_RANGE.min) / 19) * 16
  const forceArrowLength = (Math.abs(state.force) / NEWTON_FORCE_RANGE.max) * 116
  const accelerationArrowLength = Math.min(Math.abs(motion.acceleration) / 20, 1) * 92
  const velocityArrowLength = Math.min(Math.abs(motion.velocity) / 60, 1) * 104
  const forceDirection = state.force < 0 ? -1 : 1
  const accelerationDirection = motion.acceleration < 0 ? -1 : 1
  const velocityDirection = motion.velocity < 0 ? -1 : 1
  const forceArrowEnd = Math.max(
    18,
    Math.min(582, cartCenter + forceDirection * forceArrowLength),
  )
  const accelerationArrowEnd = Math.max(
    18,
    Math.min(582, cartCenter + accelerationDirection * accelerationArrowLength),
  )
  const velocityArrowEnd = Math.max(
    18,
    Math.min(582, cartCenter + velocityDirection * velocityArrowLength),
  )
  const trailPoints = Array.from({ length: 7 }, (_, index) => {
    const sampleTime = state.time * (index / 6)
    const sample = calculateMotion(state.force, state.mass, sampleTime)
    return positionToCartCenter(sample.position)
  })

  useEffect(() => {
    if (!isPlaying) {
      previousFrame.current = null
      return
    }

    let animationFrame = 0
    const updateTime = (timestamp: number) => {
      if (previousFrame.current === null) previousFrame.current = timestamp
      const elapsed = Math.min((timestamp - previousFrame.current) / 1000, 0.05)
      previousFrame.current = timestamp
      setState((current) => {
        const nextTime = Math.min(current.time + elapsed, NEWTON_TIME_LIMIT)
        return { ...current, time: nextTime }
      })
      animationFrame = requestAnimationFrame(updateTime)
    }

    animationFrame = requestAnimationFrame(updateTime)
    return () => cancelAnimationFrame(animationFrame)
  }, [isPlaying, setState])

  useEffect(() => {
    if (state.time >= NEWTON_TIME_LIMIT) setIsPlaying(false)
  }, [state.time])

  const play = () => {
    if (state.time >= NEWTON_TIME_LIMIT) {
      setState((current) => ({ ...current, time: 0 }))
    }
    setIsPlaying(true)
  }

  const reset = () => {
    setIsPlaying(false)
    setState((current) => ({ ...current, time: 0 }))
  }

  const forceLinked = linkedClassName(highlightedVariable, 'resultant-force')
  const massLinked = linkedClassName(highlightedVariable, 'mass')
  const accelerationLinked = linkedClassName(highlightedVariable, 'acceleration')

  return (
    <div className="newton-lab">
      <section
        aria-describedby="newton-model-contract"
        aria-label="Newton’s Second Law force cart simulation"
        className="newton-stage"
      >
        <p className="sr-only" id="newton-model-contract">
          One-dimensional constant resultant force model in an inertial frame. Mass remains
          constant and the cart starts from rest. The position display compresses large
          displacements while numerical readings remain in metres.
        </p>
        <header className="newton-stage__header">
          <div>
            <span>1D inertial frame</span>
            <strong>Force cart · starts from rest at x = 0</strong>
          </div>
          <div className="newton-stage__clock">
            <span>Elapsed time</span>
            <output>{formatMeasurement(state.time)} s</output>
          </div>
        </header>

        <svg
          className="newton-stage__canvas"
          role="img"
          viewBox="0 0 600 290"
        >
          <title>Cart responding to a resultant force</title>
          <desc>
            The cart position, sampled motion trail, force, acceleration, and velocity arrows,
            size, and wheel rotation reflect the current force, mass, acceleration, and time.
          </desc>
          <defs>
            <marker id="force-arrowhead" markerHeight="7" markerWidth="8" orient="auto" refX="7" refY="3.5">
              <polygon points="0 0, 8 3.5, 0 7" />
            </marker>
            <marker id="acceleration-arrowhead" markerHeight="7" markerWidth="8" orient="auto" refX="7" refY="3.5">
              <polygon points="0 0, 8 3.5, 0 7" />
            </marker>
            <marker id="velocity-arrowhead" markerHeight="7" markerWidth="8" orient="auto" refX="7" refY="3.5">
              <polygon points="0 0, 8 3.5, 0 7" />
            </marker>
            <linearGradient id="cart-surface" x1="0" x2="1">
              <stop offset="0" stopColor="#31444a" />
              <stop offset="1" stopColor="#1b292e" />
            </linearGradient>
          </defs>

          <g className="newton-stage__grid" aria-hidden="true">
            {Array.from({ length: 13 }, (_, index) => (
              <line key={index} x1={index * 50} x2={index * 50} y1="35" y2="250" />
            ))}
          </g>
          <line className="newton-stage__track" x1="24" x2="576" y1="220" y2="220" />
          {state.time > 0.02 && (
            <g className="newton-motion-trail" aria-hidden="true">
              <polyline points={trailPoints.map((point) => `${point},216`).join(' ')} />
              {trailPoints.slice(0, -1).map((point, index) => (
                <circle cx={point} cy="216" key={`${point}-${index}`} r={1.5 + index * 0.18} />
              ))}
            </g>
          )}
          <line className="newton-stage__origin" x1="300" x2="300" y1="205" y2="238" />
          <text className="newton-stage__origin-label" textAnchor="middle" x="300" y="259">
            x = 0
          </text>
          <text className="newton-stage__scale-label" x="24" y="278">
            POSITION DISPLAY · LARGE DISPLACEMENTS COMPRESSED
          </text>

          <g
            className={`newton-vector newton-vector--force${forceLinked}`}
            data-variable-id="resultant-force"
          >
            {Math.abs(state.force) > 0.05 && (
              <>
                <line
                  markerEnd="url(#force-arrowhead)"
                  x1={cartCenter}
                  x2={forceArrowEnd}
                  y1="72"
                  y2="72"
                />
                <text
                  textAnchor={forceDirection > 0 ? 'start' : 'end'}
                  x={Math.max(12, Math.min(588, forceArrowEnd + forceDirection * 8))}
                  y="66"
                >
                  ΣF = {formatMeasurement(state.force, 1)} N
                </text>
              </>
            )}
          </g>

          <g className="newton-vector newton-vector--velocity">
            {Math.abs(motion.velocity) > 0.01 && (
              <>
                <line
                  markerEnd="url(#velocity-arrowhead)"
                  x1={cartCenter}
                  x2={velocityArrowEnd}
                  y1="150"
                  y2="150"
                />
                <text
                  textAnchor={velocityDirection > 0 ? 'start' : 'end'}
                  x={Math.max(12, Math.min(588, velocityArrowEnd + velocityDirection * 8))}
                  y="144"
                >
                  v = {formatMeasurement(motion.velocity, 1)} m/s
                </text>
              </>
            )}
          </g>

          <g
            className={`newton-vector newton-vector--acceleration${accelerationLinked}`}
            data-variable-id="acceleration"
          >
            {Math.abs(motion.acceleration) > 0.01 && (
              <>
                <line
                  markerEnd="url(#acceleration-arrowhead)"
                  x1={cartCenter}
                  x2={accelerationArrowEnd}
                  y1="112"
                  y2="112"
                />
                <text
                  textAnchor={accelerationDirection > 0 ? 'start' : 'end'}
                  x={Math.max(12, Math.min(588, accelerationArrowEnd + accelerationDirection * 8))}
                  y="106"
                >
                  a = {formatMeasurement(motion.acceleration, 1)} m/s²
                </text>
              </>
            )}
          </g>

          <g
            className={`newton-cart${massLinked}`}
            data-variable-id="mass"
            transform={`translate(${cartCenter - cartWidth / 2} ${196 - cartHeight})`}
          >
            <rect fill="url(#cart-surface)" height={cartHeight} rx="7" width={cartWidth} />
            <line x1="12" x2={cartWidth - 12} y1="10" y2="10" />
            <text textAnchor="middle" x={cartWidth / 2} y={cartHeight / 2 + 5}>
              {formatMeasurement(state.mass, 1)} kg
            </text>
            <g transform={`rotate(${motion.position * 28} 17 ${cartHeight + 8})`}>
              <circle cx="17" cy={cartHeight + 8} r="9" />
              <line x1="17" x2="17" y1={cartHeight + 1} y2={cartHeight + 15} />
            </g>
            <g transform={`rotate(${motion.position * 28} ${cartWidth - 17} ${cartHeight + 8})`}>
              <circle cx={cartWidth - 17} cy={cartHeight + 8} r="9" />
              <line
                x1={cartWidth - 17}
                x2={cartWidth - 17}
                y1={cartHeight + 1}
                y2={cartHeight + 15}
              />
            </g>
          </g>
        </svg>

        <div className="newton-stage__readouts">
          <div className={accelerationLinked} data-variable-id="acceleration">
            <span>Acceleration</span>
            <strong>{formatMeasurement(motion.acceleration)} <small>m/s²</small></strong>
          </div>
          <div>
            <span>Velocity</span>
            <strong>{formatMeasurement(motion.velocity)} <small>m/s</small></strong>
          </div>
          <div>
            <span>Displacement</span>
            <strong>{formatMeasurement(motion.position)} <small>m</small></strong>
          </div>
        </div>

        <div className="transport-controls">
          <button
            aria-label={isPlaying ? 'Pause simulation' : 'Play simulation'}
            onClick={() => (isPlaying ? setIsPlaying(false) : play())}
            type="button"
          >
            {isPlaying ? <Pause aria-hidden="true" size={15} /> : <Play aria-hidden="true" size={15} />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button aria-label="Reset simulation time" onClick={reset} type="button">
            <RotateCcw aria-hidden="true" size={14} /> Reset
          </button>
          <label>
            <span className="sr-only">Simulation time</span>
            <input
              aria-label="Simulation time in seconds"
              max={NEWTON_TIME_LIMIT}
              min="0"
              onChange={(event) => {
                setIsPlaying(false)
                setState((current) => ({ ...current, time: Number(event.target.value) }))
              }}
              step="0.01"
              style={{
                '--range-progress': `${(state.time / NEWTON_TIME_LIMIT) * 100}%`,
              } as CSSProperties}
              type="range"
              value={state.time}
            />
          </label>
          <output>{formatMeasurement(state.time)} / {NEWTON_TIME_LIMIT.toFixed(2)} s</output>
        </div>
      </section>

      <aside className="newton-console" aria-label="Simulation controls">
        <header>
          <span>Input console</span>
          <strong>Live · SI units</strong>
        </header>
        <LinkedControl
          label="Resultant force"
          max={NEWTON_FORCE_RANGE.max}
          min={NEWTON_FORCE_RANGE.min}
          onChange={(force) => {
            setIsPlaying(false)
            setState((current) => ({ ...current, force, time: 0 }))
          }}
          onHighlightVariable={onHighlightVariable}
          step={NEWTON_FORCE_RANGE.step}
          symbol="ΣF"
          unit="N"
          value={state.force}
          variableId="resultant-force"
        />
        <LinkedControl
          label="Mass"
          max={NEWTON_MASS_RANGE.max}
          min={NEWTON_MASS_RANGE.min}
          onChange={(mass) => {
            setIsPlaying(false)
            setState((current) => ({ ...current, mass, time: 0 }))
          }}
          onHighlightVariable={onHighlightVariable}
          step={NEWTON_MASS_RANGE.step}
          symbol="m"
          unit="kg"
          value={state.mass}
          variableId="mass"
        />

        <div
          className={`newton-result${accelerationLinked}`}
          data-variable-id="acceleration"
          onBlur={() => onHighlightVariable(null)}
          onFocus={() => onHighlightVariable('acceleration')}
          onMouseEnter={() => onHighlightVariable('acceleration')}
          onMouseLeave={() => onHighlightVariable(null)}
          tabIndex={0}
        >
          <span>Calculated acceleration</span>
          <output>
            <var>a</var> = {formatMeasurement(motion.acceleration)} <small>m/s²</small>
          </output>
          <code>
            {formatMeasurement(state.force, 1)} N ÷ {formatMeasurement(state.mass, 1)} kg
          </code>
        </div>

        <p className="newton-console__note">
          Negative force points left. Changing either input resets the synchronized timeline so
          the constant-force model remains physically valid.
        </p>
      </aside>

      <NewtonPredictionPanel
        challenges={predictionChallenges}
        onDemonstrate={({ force, mass }) => {
          setState({ force, mass, time: 0 })
          setIsPlaying(true)
        }}
        onStageBaseline={({ force, mass }) => {
          setIsPlaying(false)
          setState({ force, mass, time: 0 })
        }}
      />
      <NewtonMotionTelemetry highlightedVariable={highlightedVariable} state={state} />
    </div>
  )
}
