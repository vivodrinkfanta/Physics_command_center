import type { Dispatch, SetStateAction } from 'react'
import { useTimelinePlayback } from '../../hooks/useTimelinePlayback'
import type { PhysicsVariableId } from '../../types/formula'
import {
  calculateKinematics,
  KINEMATICS_ACCELERATION_RANGE,
  KINEMATICS_TIME_LIMIT,
  KINEMATICS_VELOCITY_RANGE,
  type KinematicsState,
} from '../../utils/kinematics'
import { formatMeasurement } from '../../utils/newtonSecondLaw'
import {
  InstrumentControl,
  InstrumentTransport,
  instrumentLinkedClass,
} from './InstrumentControls'

interface KinematicsLabProps {
  highlightedVariable: PhysicsVariableId | null
  onHighlightVariable: (variableId: PhysicsVariableId | null) => void
  setState: Dispatch<SetStateAction<KinematicsState>>
  state: KinematicsState
}

export function KinematicsLab({
  highlightedVariable,
  onHighlightVariable,
  setState,
  state,
}: KinematicsLabProps) {
  const playback = useTimelinePlayback(state, setState, KINEMATICS_TIME_LIMIT)
  const motion = calculateKinematics(state.initialVelocity, state.acceleration, state.time)
  const cartCenter = 300 + 190 * Math.tanh(motion.position / 110)
  const velocityLength = Math.min(Math.abs(motion.velocity) / 40, 1) * 110
  const accelerationLength = Math.min(Math.abs(state.acceleration) / 8, 1) * 90
  const velocityDirection = motion.velocity < 0 ? -1 : 1
  const accelerationDirection = state.acceleration < 0 ? -1 : 1
  const velocityLinked = instrumentLinkedClass(highlightedVariable, 'final-velocity')
  const accelerationLinked = instrumentLinkedClass(highlightedVariable, 'acceleration')

  const change = (patch: Partial<KinematicsState>) => {
    playback.setIsPlaying(false)
    setState((current) => ({ ...current, ...patch, time: 0 }))
  }

  return (
    <div className="newton-lab kinematics-lab">
      <section className="newton-stage" aria-label="Constant-acceleration cart simulation">
        <header className="newton-stage__header">
          <div><span>1D constant acceleration</span><strong>Signed motion · x₀ = 0</strong></div>
          <div className="newton-stage__clock"><span>Elapsed time</span><output>{formatMeasurement(state.time)} s</output></div>
        </header>
        <svg className="newton-stage__canvas" role="img" viewBox="0 0 600 290">
          <title>Cart moving with constant acceleration</title>
          <desc>Cart position, velocity vector, and acceleration vector update from the shared timeline.</desc>
          <defs>
            <marker id="kinematics-v-head" markerHeight="7" markerWidth="8" orient="auto" refX="7" refY="3.5"><polygon points="0 0, 8 3.5, 0 7" /></marker>
            <marker id="kinematics-a-head" markerHeight="7" markerWidth="8" orient="auto" refX="7" refY="3.5"><polygon points="0 0, 8 3.5, 0 7" /></marker>
          </defs>
          <g className="newton-stage__grid" aria-hidden="true">{Array.from({ length: 13 }, (_, index) => <line key={index} x1={index * 50} x2={index * 50} y1="35" y2="250" />)}</g>
          <line className="newton-stage__track" x1="24" x2="576" y1="220" y2="220" />
          <line className="newton-stage__origin" x1="300" x2="300" y1="205" y2="238" />
          <text className="newton-stage__origin-label" textAnchor="middle" x="300" y="258">x = 0</text>
          {Math.abs(motion.velocity) > 0.01 && <g className={`kinematics-vector kinematics-vector--velocity${velocityLinked}`}>
            <line markerEnd="url(#kinematics-v-head)" x1={cartCenter} x2={cartCenter + velocityDirection * velocityLength} y1="86" y2="86" />
            <text x={Math.max(18, Math.min(500, cartCenter + velocityDirection * 8))} y="76">v = {formatMeasurement(motion.velocity, 1)} m/s</text>
          </g>}
          {Math.abs(state.acceleration) > 0.01 && <g className={`kinematics-vector kinematics-vector--acceleration${accelerationLinked}`}>
            <line markerEnd="url(#kinematics-a-head)" x1={cartCenter} x2={cartCenter + accelerationDirection * accelerationLength} y1="126" y2="126" />
            <text x={Math.max(18, Math.min(500, cartCenter + accelerationDirection * 8))} y="116">a = {formatMeasurement(state.acceleration, 1)} m/s²</text>
          </g>}
          <g className="kinematics-cart" transform={`translate(${cartCenter - 42} 174)`}>
            <rect height="38" rx="7" width="84" /><text textAnchor="middle" x="42" y="24">motion cart</text>
            <circle cx="18" cy="46" r="9" /><circle cx="66" cy="46" r="9" />
          </g>
        </svg>
        <div className="newton-stage__readouts">
          <div><span>Position</span><strong>{formatMeasurement(motion.position)} <small>m</small></strong></div>
          <div className={velocityLinked}><span>Velocity</span><strong>{formatMeasurement(motion.velocity)} <small>m/s</small></strong></div>
          <div className={accelerationLinked}><span>Acceleration</span><strong>{formatMeasurement(motion.acceleration)} <small>m/s²</small></strong></div>
        </div>
        <InstrumentTransport highlightedVariable={highlightedVariable} isPlaying={playback.isPlaying} onHighlightVariable={onHighlightVariable} onPlay={playback.play} onReset={playback.reset} onScrub={playback.scrub} onSetPlaying={playback.setIsPlaying} time={state.time} timeLimit={KINEMATICS_TIME_LIMIT} />
      </section>
      <aside className="newton-console" aria-label="Kinematics controls">
        <header><span>Initial conditions</span><strong>Live · SI units</strong></header>
        <InstrumentControl highlightedVariable={highlightedVariable} label="Initial velocity" max={KINEMATICS_VELOCITY_RANGE.max} min={KINEMATICS_VELOCITY_RANGE.min} onChange={(initialVelocity) => change({ initialVelocity })} onHighlightVariable={onHighlightVariable} step={KINEMATICS_VELOCITY_RANGE.step} symbol="u" unit="m/s" value={state.initialVelocity} variableId="initial-velocity" />
        <InstrumentControl highlightedVariable={highlightedVariable} label="Acceleration" max={KINEMATICS_ACCELERATION_RANGE.max} min={KINEMATICS_ACCELERATION_RANGE.min} onChange={(acceleration) => change({ acceleration })} onHighlightVariable={onHighlightVariable} step={KINEMATICS_ACCELERATION_RANGE.step} symbol="a" unit="m/s²" value={state.acceleration} variableId="acceleration" />
        <div className={`newton-result${velocityLinked}`} tabIndex={0}><span>Calculated final velocity</span><output><var>v</var> = {formatMeasurement(motion.velocity)} <small>m/s</small></output><code>{formatMeasurement(state.initialVelocity, 1)} + ({formatMeasurement(state.acceleration, 1)})({formatMeasurement(state.time, 1)})</code></div>
        <p className="newton-console__note">Acceleration is constant on one signed axis. The display compresses large positions; numerical readings and graphs remain exact.</p>
      </aside>
    </div>
  )
}
