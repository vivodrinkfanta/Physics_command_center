import type { Dispatch, SetStateAction } from 'react'
import { useTimelinePlayback } from '../../hooks/useTimelinePlayback'
import type { PhysicsVariableId } from '../../types/formula'
import { formatMeasurement } from '../../utils/newtonSecondLaw'
import {
  calculateSpringMotion,
  SPRING_CONSTANT_RANGE,
  SPRING_DISPLACEMENT_RANGE,
  SPRING_MASS_RANGE,
  SPRING_TIME_LIMIT,
  type SpringMotionState,
} from '../../utils/springMotion'
import { InstrumentControl, InstrumentTransport, instrumentLinkedClass } from './InstrumentControls'

interface SpringMotionLabProps {
  highlightedVariable: PhysicsVariableId | null
  onHighlightVariable: (variableId: PhysicsVariableId | null) => void
  setState: Dispatch<SetStateAction<SpringMotionState>>
  state: SpringMotionState
  outputVariableId?: 'spring-force' | 'elastic-potential-energy'
}

const clamp = (value: number) => Math.max(28, Math.min(548, value))

export function SpringMotionLab({
  highlightedVariable,
  onHighlightVariable,
  setState,
  state,
  outputVariableId = 'spring-force',
}: SpringMotionLabProps) {
  const playback = useTimelinePlayback(state, setState, SPRING_TIME_LIMIT)
  const motion = calculateSpringMotion(
    state.springConstant,
    state.mass,
    state.displacement,
    state.time,
  )
  const equilibriumX = 350
  const massSize = 42 + ((state.mass - SPRING_MASS_RANGE.min) / 9.5) * 16
  const massCenter = equilibriumX + motion.displacement * 245
  const springEnd = massCenter - massSize / 2
  const springPoints = [
    '92,160',
    '122,160',
    ...Array.from({ length: 13 }, (_, index) => {
      const ratio = index / 12
      const x = 122 + (springEnd - 122) * ratio
      const y = index === 0 || index === 12 ? 160 : index % 2 === 0 ? 137 : 183
      return `${x},${y}`
    }),
    `${springEnd},160`,
  ].join(' ')
  const forceLength = 24 + 76 * Math.tanh(Math.abs(motion.force) / 45)
  const velocityLength = 78 * Math.tanh(Math.abs(motion.velocity) / 1.8)
  const forceDirection = motion.force < 0 ? -1 : 1
  const velocityDirection = motion.velocity < 0 ? -1 : 1
  const elasticFraction = motion.totalEnergy > 0 ? motion.elasticEnergy / motion.totalEnergy : 0
  const kineticFraction = motion.totalEnergy > 0 ? motion.kineticEnergy / motion.totalEnergy : 0
  const displacementLinked = instrumentLinkedClass(highlightedVariable, 'spring-displacement')
  const forceLinked = instrumentLinkedClass(highlightedVariable, outputVariableId)
  const stiffnessLinked = instrumentLinkedClass(highlightedVariable, 'spring-constant')
  const massLinked = instrumentLinkedClass(highlightedVariable, 'mass')

  const change = (patch: Partial<SpringMotionState>) => {
    playback.setIsPlaying(false)
    setState((current) => ({ ...current, ...patch, time: 0 }))
  }

  return (
    <div className="newton-lab spring-lab">
      <section className="newton-stage" aria-label="Ideal horizontal mass-spring simulation">
        <header className="newton-stage__header">
          <div><span>Ideal mass-spring oscillator</span><strong>Frictionless surface · Hooke’s-law range</strong></div>
          <div className="newton-stage__clock"><span>Elapsed time</span><output>{formatMeasurement(state.time)} s</output></div>
        </header>
        <svg className="newton-stage__canvas spring-stage" role="img" viewBox="0 0 600 320">
          <title>Mass oscillating on a horizontal spring</title>
          <desc>Spring extension, mass position, restoring force, velocity, and energy update from one ideal harmonic-motion timeline.</desc>
          <defs>
            <marker id="spring-force-head" markerHeight="7" markerWidth="8" orient="auto" refX="7" refY="3.5"><polygon points="0 0, 8 3.5, 0 7" /></marker>
            <marker id="spring-velocity-head" markerHeight="7" markerWidth="8" orient="auto" refX="7" refY="3.5"><polygon points="0 0, 8 3.5, 0 7" /></marker>
          </defs>
          <g className="newton-stage__grid" aria-hidden="true">{Array.from({ length: 13 }, (_, index) => <line key={index} x1={index * 50} x2={index * 50} y1="25" y2="275" />)}</g>
          <path className="spring-wall" d="M 76 80 v 160 m -18 -146 l 18 -14 m -18 44 l 18 -14 m -18 44 l 18 -14 m -18 44 l 18 -14 m -18 44 l 18 -14" />
          <line className="newton-stage__track" x1="76" x2="550" y1="210" y2="210" />
          <line className="spring-equilibrium" x1={equilibriumX} x2={equilibriumX} y1="86" y2="226" />
          <text className="newton-stage__origin-label" textAnchor="middle" x={equilibriumX} y="244">equilibrium · x = 0</text>
          <polyline className={`spring-coil${stiffnessLinked}`} data-variable-id="spring-constant" points={springPoints} />
          <g className={`spring-displacement${displacementLinked}`} data-variable-id="spring-displacement">
            <line x1={equilibriumX} x2={massCenter} y1="258" y2="258" />
            <text textAnchor="middle" x={(equilibriumX + massCenter) / 2} y="278">x = {formatMeasurement(motion.displacement, 2)} m</text>
          </g>
          {Math.abs(motion.force) > 0.05 && <g className={`spring-force${forceLinked}`} data-variable-id="spring-force">
            <line markerEnd="url(#spring-force-head)" x1={massCenter} x2={massCenter + forceDirection * forceLength} y1="82" y2="82" />
            <text x={clamp(massCenter + forceDirection * forceLength * 0.55)} y="70">F = {formatMeasurement(motion.force, 1)} N</text>
          </g>}
          {Math.abs(motion.velocity) > 0.01 && <g className="spring-velocity">
            <line markerEnd="url(#spring-velocity-head)" x1={massCenter} x2={massCenter + velocityDirection * velocityLength} y1="112" y2="112" />
            <text x={clamp(massCenter + velocityDirection * velocityLength * 0.55)} y="102">v</text>
          </g>}
          <g className={`spring-mass${massLinked}`} data-variable-id="mass" transform={`translate(${massCenter - massSize / 2} ${160 - massSize / 2})`}>
            <rect height={massSize} rx="9" width={massSize} /><text textAnchor="middle" x={massSize / 2} y={massSize / 2 + 4}>{formatMeasurement(state.mass, 1)} kg</text><circle cx="13" cy={massSize + 8} r="8" /><circle cx={massSize - 13} cy={massSize + 8} r="8" />
          </g>
          <text className="newton-stage__scale-label" x="34" y="302">DISPLACEMENT TO SCALE WITHIN LAB RANGE · IDEAL ENERGY CONSERVATION</text>
        </svg>
        <div className="spring-energy-meter" aria-label="Mechanical energy distribution">
          <div><span>Elastic energy</span><strong>{formatMeasurement(motion.elasticEnergy)} J</strong></div>
          <span aria-hidden="true"><i style={{ width: `${elasticFraction * 100}%` }} /></span>
          <div><span>Kinetic energy</span><strong>{formatMeasurement(motion.kineticEnergy)} J</strong></div>
          <span aria-hidden="true"><i style={{ width: `${kineticFraction * 100}%` }} /></span>
          <small>Total energy · {formatMeasurement(motion.totalEnergy)} J</small>
        </div>
        <div className="newton-stage__readouts">
          <div className={forceLinked}><span>Restoring force</span><strong>{formatMeasurement(motion.force)} <small>N</small></strong></div>
          <div className={displacementLinked}><span>Current displacement</span><strong>{formatMeasurement(motion.displacement)} <small>m</small></strong></div>
          <div><span>Oscillation period</span><strong>{formatMeasurement(motion.period)} <small>s</small></strong></div>
        </div>
        <InstrumentTransport isPlaying={playback.isPlaying} onPlay={playback.play} onReset={playback.reset} onScrub={playback.scrub} onSetPlaying={playback.setIsPlaying} time={state.time} timeLimit={SPRING_TIME_LIMIT} />
      </section>
      <aside className="newton-console" aria-label="Spring controls">
        <header><span>Oscillator console</span><strong>Live · SI units</strong></header>
        <InstrumentControl highlightedVariable={highlightedVariable} label="Spring constant" max={SPRING_CONSTANT_RANGE.max} min={SPRING_CONSTANT_RANGE.min} onChange={(springConstant) => change({ springConstant })} onHighlightVariable={onHighlightVariable} step={SPRING_CONSTANT_RANGE.step} symbol="k" unit="N/m" value={state.springConstant} variableId="spring-constant" />
        <InstrumentControl highlightedVariable={highlightedVariable} label="Release displacement" max={SPRING_DISPLACEMENT_RANGE.max} min={SPRING_DISPLACEMENT_RANGE.min} onChange={(displacement) => change({ displacement })} onHighlightVariable={onHighlightVariable} step={SPRING_DISPLACEMENT_RANGE.step} symbol="A" unit="m" value={state.displacement} variableId="spring-displacement" />
        {outputVariableId === 'spring-force' && <InstrumentControl highlightedVariable={highlightedVariable} label="Attached mass" max={SPRING_MASS_RANGE.max} min={SPRING_MASS_RANGE.min} onChange={(mass) => change({ mass })} onHighlightVariable={onHighlightVariable} step={SPRING_MASS_RANGE.step} symbol="m" unit="kg" value={state.mass} variableId="mass" />}
        <div className={`newton-result${forceLinked}`}><span>{outputVariableId === 'elastic-potential-energy' ? 'Instantaneous elastic energy' : 'Instantaneous restoring force'}</span><output><var>{outputVariableId === 'elastic-potential-energy' ? 'Eₑ' : 'F'}</var> = {formatMeasurement(outputVariableId === 'elastic-potential-energy' ? motion.elasticEnergy : motion.force)} <small>{outputVariableId === 'elastic-potential-energy' ? 'J' : 'N'}</small></output><code>{outputVariableId === 'elastic-potential-energy' ? `½ × ${formatMeasurement(state.springConstant, 1)} × (${formatMeasurement(motion.displacement, 2)})²` : `−${formatMeasurement(state.springConstant, 1)} × (${formatMeasurement(motion.displacement, 2)})`}</code></div>
        <p className="newton-console__note">The release displacement sets the amplitude. A stiffer spring shortens the period; a heavier attached mass lengthens it. Damping and non-linear stretching are neglected.</p>
      </aside>
    </div>
  )
}
