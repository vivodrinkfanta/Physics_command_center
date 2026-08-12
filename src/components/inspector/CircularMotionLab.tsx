import type { Dispatch, SetStateAction } from 'react'
import { useTimelinePlayback } from '../../hooks/useTimelinePlayback'
import type { PhysicsVariableId } from '../../types/formula'
import {
  calculateCircularMotion,
  CIRCULAR_MASS_RANGE,
  CIRCULAR_RADIUS_RANGE,
  CIRCULAR_SPEED_RANGE,
  CIRCULAR_TIME_LIMIT,
  type CircularMotionState,
} from '../../utils/circularMotion'
import { formatMeasurement } from '../../utils/newtonSecondLaw'
import { InstrumentControl, InstrumentTransport, instrumentLinkedClass } from './InstrumentControls'

interface CircularMotionLabProps {
  highlightedVariable: PhysicsVariableId | null
  onHighlightVariable: (variableId: PhysicsVariableId | null) => void
  setState: Dispatch<SetStateAction<CircularMotionState>>
  state: CircularMotionState
  outputVariableId?: 'centripetal-acceleration' | 'centripetal-force'
}

export function CircularMotionLab({
  highlightedVariable,
  onHighlightVariable,
  setState,
  state,
  outputVariableId = 'centripetal-acceleration',
}: CircularMotionLabProps) {
  const playback = useTimelinePlayback(state, setState, CIRCULAR_TIME_LIMIT)
  const motion = calculateCircularMotion(state.mass, state.speed, state.radius, state.time)
  const orbitRadius = 58 + ((state.radius - CIRCULAR_RADIUS_RANGE.min) / 19) * 70
  const center = { x: 300, y: 155 }
  const object = {
    x: center.x + orbitRadius * Math.cos(motion.angle),
    y: center.y - orbitRadius * Math.sin(motion.angle),
  }
  const tangent = { x: -Math.sin(motion.angle), y: -Math.cos(motion.angle) }
  const inward = { x: -Math.cos(motion.angle), y: Math.sin(motion.angle) }
  const speedLength = 30 + (state.speed / CIRCULAR_SPEED_RANGE.max) * 62
  const forceLength = 24 + 78 * Math.tanh(motion.force / 260)
  const objectRadius = 9 + ((state.mass - CIRCULAR_MASS_RANGE.min) / 9.5) * 5
  const accelerationLinked = instrumentLinkedClass(
    highlightedVariable,
    outputVariableId,
  )
  const speedLinked = instrumentLinkedClass(highlightedVariable, 'speed')
  const radiusLinked = instrumentLinkedClass(highlightedVariable, 'radius')
  const massLinked = instrumentLinkedClass(highlightedVariable, 'mass')
  const forceLinked = highlightedVariable
    ? highlightedVariable === outputVariableId || highlightedVariable === 'mass'
      ? ' is-linked'
      : ' is-dimmed'
    : ''

  const change = (patch: Partial<CircularMotionState>) => {
    playback.setIsPlaying(false)
    setState((current) => ({ ...current, ...patch, time: 0 }))
  }

  return (
    <div className="newton-lab circular-lab">
      <section className="newton-stage" aria-label="Uniform circular motion simulation">
        <header className="newton-stage__header">
          <div><span>Uniform circular motion</span><strong>Constant speed · inward resultant force</strong></div>
          <div className="newton-stage__clock"><span>Elapsed time</span><output>{formatMeasurement(state.time)} s</output></div>
        </header>
        <svg className="newton-stage__canvas circular-stage" role="img" viewBox="0 0 600 320">
          <title>Mass rotating in a circular path with tangent velocity and inward force vectors</title>
          <desc>Orbit radius, object size, rotation rate, and vector lengths respond to the current radius, mass, speed, acceleration, and force.</desc>
          <defs>
            <marker id="circular-velocity-head" markerHeight="7" markerWidth="8" orient="auto" refX="7" refY="3.5"><polygon points="0 0, 8 3.5, 0 7" /></marker>
            <marker id="circular-force-head" markerHeight="7" markerWidth="8" orient="auto" refX="7" refY="3.5"><polygon points="0 0, 8 3.5, 0 7" /></marker>
          </defs>
          <g className="newton-stage__grid" aria-hidden="true">{Array.from({ length: 13 }, (_, index) => <line key={index} x1={index * 50} x2={index * 50} y1="20" y2="290" />)}</g>
          <circle className="circular-orbit" cx={center.x} cy={center.y} r={orbitRadius} />
          <circle className="circular-center" cx={center.x} cy={center.y} r="5" />
          <g className={`circular-radius${radiusLinked}`} data-variable-id="radius">
            <line x1={center.x} x2={object.x} y1={center.y} y2={object.y} />
            <text x={(center.x + object.x) / 2 + 7} y={(center.y + object.y) / 2 - 7}>r = {formatMeasurement(state.radius, 1)} m</text>
          </g>
          <g className={`circular-velocity${speedLinked}`} data-variable-id="speed">
            <line markerEnd="url(#circular-velocity-head)" x1={object.x} x2={object.x + tangent.x * speedLength} y1={object.y} y2={object.y + tangent.y * speedLength} />
            <text x={object.x + tangent.x * speedLength * 0.58 + 8} y={object.y + tangent.y * speedLength * 0.58 - 8}>v</text>
          </g>
          <g className={`circular-force${forceLinked}`}>
            <line markerEnd="url(#circular-force-head)" x1={object.x} x2={object.x + inward.x * forceLength} y1={object.y} y2={object.y + inward.y * forceLength} />
            <text x={object.x + inward.x * forceLength * 0.55 + 8} y={object.y + inward.y * forceLength * 0.55 - 8}>F꜀</text>
          </g>
          <g className={`circular-object${massLinked}`} data-variable-id="mass">
            <circle cx={object.x} cy={object.y} r={objectRadius + 7} />
            <circle cx={object.x} cy={object.y} r={objectRadius} />
          </g>
          <text className="newton-stage__scale-label" x="34" y="300">ORBIT RADIUS SCALED TO FIT · VECTOR LENGTHS TRACK MAGNITUDE</text>
        </svg>
        <div className="newton-stage__readouts">
          <div className={accelerationLinked}><span>Centripetal acceleration</span><strong>{formatMeasurement(motion.acceleration)} <small>m/s²</small></strong></div>
          <div className={forceLinked}><span>Inward resultant force</span><strong>{formatMeasurement(motion.force)} <small>N</small></strong></div>
          <div><span>Orbital period</span><strong>{motion.period === null ? 'Stationary' : `${formatMeasurement(motion.period)} s`}</strong></div>
        </div>
        <InstrumentTransport isPlaying={playback.isPlaying} onPlay={playback.play} onReset={playback.reset} onScrub={playback.scrub} onSetPlaying={playback.setIsPlaying} time={state.time} timeLimit={CIRCULAR_TIME_LIMIT} />
      </section>
      <aside className="newton-console" aria-label="Circular motion controls">
        <header><span>Orbit console</span><strong>Live · SI units</strong></header>
        <InstrumentControl highlightedVariable={highlightedVariable} label="Object mass" max={CIRCULAR_MASS_RANGE.max} min={CIRCULAR_MASS_RANGE.min} onChange={(mass) => change({ mass })} onHighlightVariable={onHighlightVariable} step={CIRCULAR_MASS_RANGE.step} symbol="m" unit="kg" value={state.mass} variableId="mass" />
        <InstrumentControl highlightedVariable={highlightedVariable} label="Tangential speed" max={CIRCULAR_SPEED_RANGE.max} min={CIRCULAR_SPEED_RANGE.min} onChange={(speed) => change({ speed })} onHighlightVariable={onHighlightVariable} step={CIRCULAR_SPEED_RANGE.step} symbol="v" unit="m/s" value={state.speed} variableId="speed" />
        <InstrumentControl highlightedVariable={highlightedVariable} label="Orbit radius" max={CIRCULAR_RADIUS_RANGE.max} min={CIRCULAR_RADIUS_RANGE.min} onChange={(radius) => change({ radius })} onHighlightVariable={onHighlightVariable} step={CIRCULAR_RADIUS_RANGE.step} symbol="r" unit="m" value={state.radius} variableId="radius" />
        <div className={`newton-result${accelerationLinked}`}><span>{outputVariableId === 'centripetal-force' ? 'Calculated inward force' : 'Calculated inward acceleration'}</span><output><var>{outputVariableId === 'centripetal-force' ? 'F꜀' : 'a꜀'}</var> = {formatMeasurement(outputVariableId === 'centripetal-force' ? motion.force : motion.acceleration)} <small>{outputVariableId === 'centripetal-force' ? 'N' : 'm/s²'}</small></output><code>{outputVariableId === 'centripetal-force' ? `${formatMeasurement(state.mass, 1)} × ` : ''}{formatMeasurement(state.speed, 1)}² ÷ {formatMeasurement(state.radius, 1)}</code></div>
        <p className="newton-console__note">Speed is constant but velocity changes direction continuously. “Centripetal force” is the inward resultant supplied by real forces, not an additional force type.</p>
      </aside>
    </div>
  )
}
