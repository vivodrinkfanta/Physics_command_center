import { Pause, Play, RotateCcw, Sparkles } from 'lucide-react'
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type Dispatch,
  type SetStateAction,
} from 'react'
import type { PhysicsVariableId } from '../../types/formula'
import {
  calculateKineticEnergy,
  calculateUniformMotion,
  KINETIC_MASS_RANGE,
  KINETIC_SPEED_RANGE,
  KINETIC_TIME_LIMIT,
  type KineticEnergyState,
} from '../../utils/kineticEnergy'
import { formatMeasurement } from '../../utils/newtonSecondLaw'

interface KineticEnergyLabProps {
  highlightedVariable: PhysicsVariableId | null
  onHighlightVariable: (variableId: PhysicsVariableId | null) => void
  setState: Dispatch<SetStateAction<KineticEnergyState>>
  state: KineticEnergyState
}

interface EnergyControlProps {
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

function EnergyControl({
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
}: EnergyControlProps) {
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
        <output>{formatMeasurement(value, 1)} <small>{unit}</small></output>
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

export function KineticEnergyLab({
  highlightedVariable,
  onHighlightVariable,
  setState,
  state,
}: KineticEnergyLabProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const previousFrame = useRef<number | null>(null)
  const energy = calculateKineticEnergy(state.mass, state.speed)
  const motion = calculateUniformMotion(state.speed, state.time)
  const maximumEnergy = calculateKineticEnergy(
    KINETIC_MASS_RANGE.max,
    KINETIC_SPEED_RANGE.max,
  )
  const energyProgress = (energy / maximumEnergy) * 100
  const objectCenter = 74 + motion.displacement * 7.5
  const objectRadius = 18 + ((state.mass - KINETIC_MASS_RANGE.min) / 9) * 14
  const arrowLength = (state.speed / KINETIC_SPEED_RANGE.max) * 118
  const energyLinked = linkedClassName(highlightedVariable, 'kinetic-energy')
  const massLinked = linkedClassName(highlightedVariable, 'mass')
  const speedLinked = linkedClassName(highlightedVariable, 'speed')
  const trailPoints = Array.from({ length: 8 }, (_, index) => {
    const sampleTime = state.time * (index / 7)
    return 74 + calculateUniformMotion(state.speed, sampleTime).displacement * 7.5
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
      setState((current) => ({
        ...current,
        time: Math.min(current.time + elapsed, KINETIC_TIME_LIMIT),
      }))
      animationFrame = requestAnimationFrame(updateTime)
    }

    animationFrame = requestAnimationFrame(updateTime)
    return () => cancelAnimationFrame(animationFrame)
  }, [isPlaying, setState])

  useEffect(() => {
    if (state.time >= KINETIC_TIME_LIMIT) setIsPlaying(false)
  }, [state.time])

  const play = () => {
    if (state.time >= KINETIC_TIME_LIMIT) {
      setState((current) => ({ ...current, time: 0 }))
    }
    setIsPlaying(true)
  }

  const reset = () => {
    setIsPlaying(false)
    setState((current) => ({ ...current, time: 0 }))
  }

  return (
    <div className="newton-lab kinetic-lab">
      <section
        aria-describedby="kinetic-model-contract"
        aria-label="Kinetic energy runway simulation"
        className="newton-stage kinetic-stage"
      >
        <p className="sr-only" id="kinetic-model-contract">
          One-dimensional constant-speed model for translational kinetic energy. Mass and speed
          stay constant during playback. Friction, rotation, and relativistic effects are not
          modeled.
        </p>
        <header className="newton-stage__header">
          <div>
            <span>Translational model</span>
            <strong>Energy runway · constant speed</strong>
          </div>
          <div className="newton-stage__clock">
            <span>Elapsed time</span>
            <output>{formatMeasurement(state.time)} s</output>
          </div>
        </header>

        <svg className="newton-stage__canvas" role="img" viewBox="0 0 600 290">
          <title>Object moving with kinetic energy</title>
          <desc>
            The object size reflects mass, its motion and arrow reflect speed, and the luminous
            energy ring reflects the calculated translational kinetic energy.
          </desc>
          <defs>
            <marker
              id="kinetic-speed-arrowhead"
              markerHeight="7"
              markerWidth="8"
              orient="auto"
              refX="7"
              refY="3.5"
            >
              <polygon points="0 0, 8 3.5, 0 7" />
            </marker>
            <radialGradient id="kinetic-body" cx="35%" cy="30%">
              <stop offset="0" stopColor="#d3fff3" />
              <stop offset="0.26" stopColor="#78b7ab" />
              <stop offset="1" stopColor="#263c46" />
            </radialGradient>
          </defs>
          <g className="newton-stage__grid" aria-hidden="true">
            {Array.from({ length: 13 }, (_, index) => (
              <line key={index} x1={index * 50} x2={index * 50} y1="35" y2="250" />
            ))}
          </g>
          <line className="newton-stage__track" x1="42" x2="558" y1="216" y2="216" />
          <line className="newton-stage__origin" x1="74" x2="74" y1="202" y2="235" />
          <text className="newton-stage__origin-label" textAnchor="middle" x="74" y="254">
            x = 0
          </text>
          <text className="newton-stage__scale-label" x="42" y="277">
            UNIFORM MOTION · POSITION SCALE 7.5 PX/M
          </text>

          {state.time > 0.02 && (
            <g className="newton-motion-trail" aria-hidden="true">
              <polyline points={trailPoints.map((point) => `${point},216`).join(' ')} />
              {trailPoints.slice(0, -1).map((point, index) => (
                <circle cx={point} cy="216" key={`${point}-${index}`} r={1.4 + index * 0.18} />
              ))}
            </g>
          )}

          <g className={`kinetic-speed-vector${speedLinked}`} data-variable-id="speed">
            {state.speed > 0.01 && (
              <>
                <line
                  markerEnd="url(#kinetic-speed-arrowhead)"
                  x1={objectCenter}
                  x2={Math.min(574, objectCenter + arrowLength)}
                  y1="80"
                  y2="80"
                />
                <text x={Math.min(510, objectCenter + 8)} y="70">
                  v = {formatMeasurement(state.speed, 1)} m/s
                </text>
              </>
            )}
          </g>

          <circle
            className={`kinetic-object__energy${energyLinked}`}
            cx={objectCenter}
            cy={195 - objectRadius}
            data-variable-id="kinetic-energy"
            r={objectRadius + 9 + energyProgress * 0.05}
            style={{
              '--kinetic-energy-opacity': 0.15 + energyProgress * 0.0055,
            } as CSSProperties}
          />
          <g className={`kinetic-object${massLinked}`} data-variable-id="mass">
            <circle
              cx={objectCenter}
              cy={195 - objectRadius}
              fill="url(#kinetic-body)"
              r={objectRadius}
            />
            <text textAnchor="middle" x={objectCenter} y={199 - objectRadius}>
              {formatMeasurement(state.mass, 1)} kg
            </text>
          </g>
        </svg>

        <div
          aria-label={`Energy scale ${formatMeasurement(energy)} joules`}
          className={`kinetic-energy-meter${energyLinked}`}
          data-variable-id="kinetic-energy"
        >
          <div>
            <span>Energy magnitude</span>
            <strong>{formatMeasurement(energy)} J</strong>
          </div>
          <span aria-hidden="true">
            <i style={{ width: `${energyProgress}%` }} />
          </span>
          <small>0 J</small>
          <small>{formatMeasurement(maximumEnergy, 0)} J model maximum</small>
        </div>

        <div className="newton-stage__readouts">
          <div className={energyLinked} data-variable-id="kinetic-energy">
            <span>Kinetic energy</span>
            <strong>{formatMeasurement(energy)} <small>J</small></strong>
          </div>
          <div className={speedLinked} data-variable-id="speed">
            <span>Speed</span>
            <strong>{formatMeasurement(motion.speed)} <small>m/s</small></strong>
          </div>
          <div>
            <span>Displacement</span>
            <strong>{formatMeasurement(motion.displacement)} <small>m</small></strong>
          </div>
        </div>

        <div className="transport-controls">
          <button
            aria-label={isPlaying ? 'Pause simulation' : 'Play simulation'}
            onClick={() => (isPlaying ? setIsPlaying(false) : play())}
            type="button"
          >
            {isPlaying ? (
              <Pause aria-hidden="true" size={15} />
            ) : (
              <Play aria-hidden="true" size={15} />
            )}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button aria-label="Reset simulation time" onClick={reset} type="button">
            <RotateCcw aria-hidden="true" size={14} /> Reset
          </button>
          <label>
            <span className="sr-only">Simulation time</span>
            <input
              aria-label="Simulation time in seconds"
              max={KINETIC_TIME_LIMIT}
              min="0"
              onChange={(event) => {
                setIsPlaying(false)
                setState((current) => ({ ...current, time: Number(event.target.value) }))
              }}
              step="0.01"
              style={{
                '--range-progress': `${(state.time / KINETIC_TIME_LIMIT) * 100}%`,
              } as CSSProperties}
              type="range"
              value={state.time}
            />
          </label>
          <output>{formatMeasurement(state.time)} / {KINETIC_TIME_LIMIT.toFixed(2)} s</output>
        </div>
      </section>

      <aside className="newton-console" aria-label="Kinetic energy controls">
        <header>
          <span>Input console</span>
          <strong>Live · SI units</strong>
        </header>
        <EnergyControl
          label="Mass"
          max={KINETIC_MASS_RANGE.max}
          min={KINETIC_MASS_RANGE.min}
          onChange={(mass) => {
            setIsPlaying(false)
            setState((current) => ({ ...current, mass, time: 0 }))
          }}
          onHighlightVariable={onHighlightVariable}
          step={KINETIC_MASS_RANGE.step}
          symbol="m"
          unit="kg"
          value={state.mass}
          variableId="mass"
        />
        <EnergyControl
          label="Speed"
          max={KINETIC_SPEED_RANGE.max}
          min={KINETIC_SPEED_RANGE.min}
          onChange={(speed) => {
            setIsPlaying(false)
            setState((current) => ({ ...current, speed, time: 0 }))
          }}
          onHighlightVariable={onHighlightVariable}
          step={KINETIC_SPEED_RANGE.step}
          symbol="v"
          unit="m/s"
          value={state.speed}
          variableId="speed"
        />
        <div
          className={`newton-result${energyLinked}`}
          data-variable-id="kinetic-energy"
          onBlur={() => onHighlightVariable(null)}
          onFocus={() => onHighlightVariable('kinetic-energy')}
          onMouseEnter={() => onHighlightVariable('kinetic-energy')}
          onMouseLeave={() => onHighlightVariable(null)}
          tabIndex={0}
        >
          <span>Calculated kinetic energy</span>
          <output>
            <var>Eₖ</var> = {formatMeasurement(energy)} <small>J</small>
          </output>
          <code>
            ½ × {formatMeasurement(state.mass, 1)} kg × ({formatMeasurement(state.speed, 1)} m/s)²
          </code>
        </div>
        <p className="newton-console__note">
          Speed is squared: doubling speed quadruples kinetic energy. Playback holds both inputs
          constant so the object shows uniform motion, not an unexplained acceleration.
        </p>
      </aside>

      <section className="kinetic-model-notes" aria-labelledby="kinetic-model-notes-title">
        <header>
          <Sparkles aria-hidden="true" size={15} />
          <span>Model boundary</span>
          <h3 id="kinetic-model-notes-title">What this instrument includes</h3>
        </header>
        <div>
          <p>
            <strong>Included</strong> Translational kinetic energy, non-negative speed, and
            constant-speed position.
          </p>
          <p>
            <strong>Held outside</strong> Rotation, friction, deformation, heat, and relativistic
            effects.
          </p>
          <p>
            <strong>Compare</strong> Change mass and speed separately, then open Graph to see linear
            versus quadratic growth.
          </p>
        </div>
      </section>
    </div>
  )
}
