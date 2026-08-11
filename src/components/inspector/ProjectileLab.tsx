import type { Dispatch, SetStateAction } from 'react'
import { useTimelinePlayback } from '../../hooks/useTimelinePlayback'
import type { PhysicsVariableId } from '../../types/formula'
import {
  calculateProjectileMotion,
  calculateProjectileSample,
  PROJECTILE_ANGLE_RANGE,
  PROJECTILE_GRAVITY_RANGE,
  PROJECTILE_HEIGHT_RANGE,
  PROJECTILE_SPEED_RANGE,
  type ProjectileLabState,
} from '../../utils/projectile'
import { formatMeasurement } from '../../utils/newtonSecondLaw'
import { InstrumentControl, InstrumentTransport, instrumentLinkedClass } from './InstrumentControls'

interface ProjectileLabProps {
  highlightedVariable: PhysicsVariableId | null
  onHighlightVariable: (variableId: PhysicsVariableId | null) => void
  setState: Dispatch<SetStateAction<ProjectileLabState>>
  state: ProjectileLabState
}

export function ProjectileLab({ highlightedVariable, onHighlightVariable, setState, state }: ProjectileLabProps) {
  const input = { angleDegrees: state.angleDegrees, gravity: state.gravity, launchHeight: state.launchHeight, speed: state.speed }
  const motion = calculateProjectileMotion({ ...input, sampleCount: 70 })
  const time = Math.min(state.time, motion.flightTime)
  const sample = calculateProjectileSample({ ...input, time })
  const playback = useTimelinePlayback(state, setState, motion.flightTime, Math.max(1, motion.flightTime / 8))
  const xScale = 490 / Math.max(motion.range, 1)
  const yScale = 178 / Math.max(motion.maximumHeight, 1)
  const ballX = 64 + sample.x * xScale
  const ballY = 230 - sample.y * yScale
  const peakTime = motion.verticalVelocity / state.gravity
  const peakX = 64 + motion.horizontalVelocity * peakTime * xScale
  const peakY = 230 - motion.maximumHeight * yScale
  const path = motion.points.map(({ x, y }) => `${64 + x * xScale},${230 - y * yScale}`).join(' ')
  const vectorScale = 64 / Math.max(sample.speed, 1)
  const verticalPositionLinked = instrumentLinkedClass(highlightedVariable, 'vertical-position')
  const verticalVelocityLinked = instrumentLinkedClass(highlightedVariable, 'initial-vertical-velocity')

  const change = (patch: Partial<ProjectileLabState>) => {
    playback.setIsPlaying(false)
    setState((current) => ({ ...current, ...patch, time: 0 }))
  }

  return (
    <div className="newton-lab projectile-lab">
      <section className="newton-stage" aria-label="Two-dimensional projectile simulation">
        <header className="newton-stage__header">
          <div><span>2D ideal projectile</span><strong>Air resistance ignored · level ground</strong></div>
          <div className="newton-stage__clock"><span>Simulated time</span><output>{formatMeasurement(time)} s</output></div>
        </header>
        <svg className="newton-stage__canvas projectile-stage" role="img" viewBox="0 0 600 290">
          <title>Projectile trajectory and velocity vector</title>
          <desc>The trajectory, position, and velocity vector use the current launch speed, angle, height, gravity, and time.</desc>
          <defs><marker id="projectile-v-head" markerHeight="7" markerWidth="8" orient="auto" refX="7" refY="3.5"><polygon points="0 0, 8 3.5, 0 7" /></marker></defs>
          <g className="newton-stage__grid" aria-hidden="true">{Array.from({ length: 13 }, (_, index) => <line key={index} x1={index * 50} x2={index * 50} y1="25" y2="230" />)}</g>
          <line className="projectile-ground" x1="34" x2="574" y1="230" y2="230" />
          <line className="projectile-platform" x1="64" x2="64" y1={230 - state.launchHeight * yScale} y2="230" />
          <polyline className="projectile-path" points={path} />
          <g className="projectile-guides" aria-hidden="true"><line x1={peakX} x2={peakX} y1={peakY} y2="230" /><line x1="64" x2={peakX} y1={peakY} y2={peakY} /><text x={peakX + 6} y={peakY - 7}>Hmax</text><line x1="554" x2="554" y1="220" y2="240" /><text textAnchor="end" x="550" y="255">range</text></g>
          <g className={`projectile-ball${verticalPositionLinked}`} data-variable-id="vertical-position"><circle cx={ballX} cy={ballY} r="9" /><circle cx={ballX} cy={ballY} r="16" /></g>
          <g className={`projectile-velocity${verticalVelocityLinked}`} data-variable-id="initial-vertical-velocity">
            <line className="projectile-velocity__component" x1={ballX} x2={ballX + sample.horizontalVelocity * vectorScale} y1={ballY} y2={ballY} />
            <line className="projectile-velocity__component" x1={ballX + sample.horizontalVelocity * vectorScale} x2={ballX + sample.horizontalVelocity * vectorScale} y1={ballY} y2={ballY - sample.verticalVelocity * vectorScale} />
            <line markerEnd="url(#projectile-v-head)" x1={ballX} x2={ballX + sample.horizontalVelocity * vectorScale} y1={ballY} y2={ballY - sample.verticalVelocity * vectorScale} />
          </g>
          <text className="newton-stage__scale-label" x="34" y="270">TRAJECTORY AUTO-SCALED · NUMERIC READINGS REMAIN SI</text>
        </svg>
        <div className="projectile-metrics">
          <div><span>Horizontal velocity</span><strong>{formatMeasurement(sample.horizontalVelocity)} m/s</strong></div>
          <div className={verticalVelocityLinked}><span>Vertical velocity</span><strong>{formatMeasurement(sample.verticalVelocity)} m/s</strong></div>
          <div><span>Maximum height</span><strong>{formatMeasurement(motion.maximumHeight)} m</strong></div>
          <div><span>Range</span><strong>{formatMeasurement(motion.range)} m</strong></div>
          <div><span>Flight time</span><strong>{formatMeasurement(motion.flightTime)} s</strong></div>
          <div className={verticalPositionLinked}><span>Current position</span><strong>({formatMeasurement(sample.x)}, {formatMeasurement(sample.y)}) m</strong></div>
        </div>
        <InstrumentTransport highlightedVariable={highlightedVariable} isPlaying={playback.isPlaying} onHighlightVariable={onHighlightVariable} onPlay={playback.play} onReset={playback.reset} onScrub={playback.scrub} onSetPlaying={playback.setIsPlaying} time={time} timeLimit={motion.flightTime} />
      </section>
      <aside className="newton-console" aria-label="Projectile controls">
        <header><span>Launch console</span><strong>Live · SI units</strong></header>
        <InstrumentControl highlightedVariable={highlightedVariable} label="Launch speed" max={PROJECTILE_SPEED_RANGE.max} min={PROJECTILE_SPEED_RANGE.min} onChange={(speed) => change({ speed })} onHighlightVariable={onHighlightVariable} step={PROJECTILE_SPEED_RANGE.step} symbol="v₀" unit="m/s" value={state.speed} />
        <InstrumentControl highlightedVariable={highlightedVariable} label="Launch angle" max={PROJECTILE_ANGLE_RANGE.max} min={PROJECTILE_ANGLE_RANGE.min} onChange={(angleDegrees) => change({ angleDegrees })} onHighlightVariable={onHighlightVariable} step={PROJECTILE_ANGLE_RANGE.step} symbol="θ" unit="°" value={state.angleDegrees} />
        <InstrumentControl highlightedVariable={highlightedVariable} label="Launch height" max={PROJECTILE_HEIGHT_RANGE.max} min={PROJECTILE_HEIGHT_RANGE.min} onChange={(launchHeight) => change({ launchHeight })} onHighlightVariable={onHighlightVariable} step={PROJECTILE_HEIGHT_RANGE.step} symbol="y₀" unit="m" value={state.launchHeight} variableId="initial-vertical-position" />
        <InstrumentControl highlightedVariable={highlightedVariable} label="Gravity" max={PROJECTILE_GRAVITY_RANGE.max} min={PROJECTILE_GRAVITY_RANGE.min} onChange={(gravity) => change({ gravity })} onHighlightVariable={onHighlightVariable} step={PROJECTILE_GRAVITY_RANGE.step} symbol="g" unit="m/s²" value={state.gravity} variableId="gravitational-field-strength" />
        <div className={`newton-result${verticalVelocityLinked}`}><span>Initial velocity components</span><output><var>v₀ₓ</var> = {formatMeasurement(motion.horizontalVelocity)} · <var>v₀ᵧ</var> = {formatMeasurement(motion.verticalVelocity)}</output><code>v₀cosθ · v₀sinθ</code></div>
        <p className="newton-console__note">The model uses constant downward gravity, a flat landing surface, and no drag. Playback may accelerate simulated time for long low-gravity flights.</p>
      </aside>
    </div>
  )
}
