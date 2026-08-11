import type { Dispatch, SetStateAction } from 'react'
import { useTimelinePlayback } from '../../hooks/useTimelinePlayback'
import type { PhysicsVariableId } from '../../types/formula'
import {
  calculateCollision,
  calculateMomentum,
  CART_ONE_VELOCITY_RANGE,
  CART_TWO_VELOCITY_RANGE,
  COLLISION_TIME,
  MOMENTUM_MASS_RANGE,
  MOMENTUM_TIME_LIMIT,
  type MomentumState,
} from '../../utils/momentum'
import { formatMeasurement } from '../../utils/newtonSecondLaw'
import { InstrumentControl, InstrumentTransport, instrumentLinkedClass } from './InstrumentControls'

interface MomentumLabProps {
  highlightedVariable: PhysicsVariableId | null
  onHighlightVariable: (variableId: PhysicsVariableId | null) => void
  setState: Dispatch<SetStateAction<MomentumState>>
  state: MomentumState
}

const clamp = (value: number) => Math.max(28, Math.min(572, value))

export function MomentumLab({ highlightedVariable, onHighlightVariable, setState, state }: MomentumLabProps) {
  const playback = useTimelinePlayback(state, setState, MOMENTUM_TIME_LIMIT)
  const collision = calculateCollision(state.mass, state.velocity, state.secondMass, state.secondVelocity, state.restitution)
  const after = state.time >= COLLISION_TIME
  const cart1Radius = 24 + state.mass * 1.2
  const cart2Radius = 24 + state.secondMass * 1.2
  const elapsedFromCollision = state.time - COLLISION_TIME
  const cart1Center = clamp(after
    ? 300 - cart1Radius + collision.finalVelocity1 * elapsedFromCollision * 8
    : 300 - cart1Radius - state.velocity * -elapsedFromCollision * 8)
  const cart2Center = clamp(after
    ? 300 + cart2Radius + collision.finalVelocity2 * elapsedFromCollision * 8
    : 300 + cart2Radius - state.secondVelocity * -elapsedFromCollision * 8)
  const velocity1 = after ? collision.finalVelocity1 : state.velocity
  const velocity2 = after ? collision.finalVelocity2 : state.secondVelocity
  const momentumLinked = instrumentLinkedClass(highlightedVariable, 'momentum')
  const massLinked = instrumentLinkedClass(highlightedVariable, 'mass')
  const velocityLinked = instrumentLinkedClass(highlightedVariable, 'velocity')
  const retainedEnergy = (collision.finalKineticEnergy / collision.initialKineticEnergy) * 100

  const change = (patch: Partial<MomentumState>) => {
    playback.setIsPlaying(false)
    setState((current) => ({ ...current, ...patch, time: 0 }))
  }

  return (
    <div className="newton-lab momentum-lab">
      <section className="newton-stage" aria-label="Two-cart collision simulation">
        <header className="newton-stage__header">
          <div><span>1D isolated system</span><strong>{state.restitution === 1 ? 'Elastic collision' : 'Perfectly inelastic collision'} · impact at 2.00 s</strong></div>
          <div className="newton-stage__clock"><span>Elapsed time</span><output>{formatMeasurement(state.time)} s</output></div>
        </header>
        <svg className="newton-stage__canvas momentum-stage" role="img" viewBox="0 0 600 290">
          <title>Two carts colliding in one dimension</title>
          <desc>Cart sizes show mass, motion shows signed velocity, and the collision conserves total momentum.</desc>
          <defs><marker id="momentum-arrow" markerHeight="7" markerWidth="8" orient="auto" refX="7" refY="3.5"><polygon points="0 0, 8 3.5, 0 7" /></marker></defs>
          <g className="newton-stage__grid" aria-hidden="true">{Array.from({ length: 13 }, (_, index) => <line key={index} x1={index * 50} x2={index * 50} y1="35" y2="250" />)}</g>
          <line className="newton-stage__track" x1="24" x2="576" y1="220" y2="220" />
          <line className="momentum-impact-line" x1="300" x2="300" y1="52" y2="235" />
          <text className="newton-stage__origin-label" textAnchor="middle" x="300" y="255">impact plane</text>
          <g className={`momentum-cart momentum-cart--one${massLinked}`} transform={`translate(${cart1Center - cart1Radius} ${186 - cart1Radius})`}>
            <rect height={cart1Radius * 2} rx="7" width={cart1Radius * 2} /><text textAnchor="middle" x={cart1Radius} y={cart1Radius + 4}>A · {formatMeasurement(state.mass, 1)} kg</text><circle cx="13" cy={cart1Radius * 2 + 8} r="8" /><circle cx={cart1Radius * 2 - 13} cy={cart1Radius * 2 + 8} r="8" />
          </g>
          <g className="momentum-cart momentum-cart--two" transform={`translate(${cart2Center - cart2Radius} ${186 - cart2Radius})`}>
            <rect height={cart2Radius * 2} rx="7" width={cart2Radius * 2} /><text textAnchor="middle" x={cart2Radius} y={cart2Radius + 4}>B · {formatMeasurement(state.secondMass, 1)} kg</text><circle cx="13" cy={cart2Radius * 2 + 8} r="8" /><circle cx={cart2Radius * 2 - 13} cy={cart2Radius * 2 + 8} r="8" />
          </g>
          <g className={`momentum-velocity${velocityLinked}`}><line markerEnd="url(#momentum-arrow)" x1={cart1Center} x2={cart1Center + velocity1 * 7} y1="74" y2="74" /><text x={Math.max(15, Math.min(520, cart1Center))} y="64">vA {formatMeasurement(velocity1, 1)} m/s</text></g>
          <g className="momentum-velocity momentum-velocity--two"><line markerEnd="url(#momentum-arrow)" x1={cart2Center} x2={cart2Center + velocity2 * 7} y1="116" y2="116" /><text x={Math.max(15, Math.min(520, cart2Center))} y="106">vB {formatMeasurement(velocity2, 1)} m/s</text></g>
        </svg>
        <div className="collision-ledger">
          <div><span>Total momentum before</span><strong>{formatMeasurement(collision.initialMomentum)} kg·m/s</strong></div>
          <div className={momentumLinked}><span>Total momentum after</span><strong>{formatMeasurement(collision.finalMomentum)} kg·m/s</strong></div>
          <div><span>Kinetic energy before</span><strong>{formatMeasurement(collision.initialKineticEnergy)} J</strong></div>
          <div><span>Kinetic energy after</span><strong>{formatMeasurement(collision.finalKineticEnergy)} J</strong></div>
          <div><span>Kinetic energy retained</span><strong>{formatMeasurement(retainedEnergy, 1)}%</strong></div>
          <div><span>Final velocities</span><strong>{formatMeasurement(collision.finalVelocity1)} · {formatMeasurement(collision.finalVelocity2)} m/s</strong></div>
        </div>
        <InstrumentTransport isPlaying={playback.isPlaying} onPlay={playback.play} onReset={playback.reset} onScrub={playback.scrub} onSetPlaying={playback.setIsPlaying} time={state.time} timeLimit={MOMENTUM_TIME_LIMIT} />
      </section>
      <aside className="newton-console" aria-label="Collision controls">
        <header><span>Collision console</span><strong>Momentum conserved</strong></header>
        <div className="collision-type" role="group" aria-label="Collision type"><button className={state.restitution === 1 ? 'is-active' : ''} onClick={() => change({ restitution: 1 })} type="button">Elastic</button><button className={state.restitution === 0 ? 'is-active' : ''} onClick={() => change({ restitution: 0 })} type="button">Inelastic</button></div>
        <InstrumentControl highlightedVariable={highlightedVariable} label="Cart A mass" max={MOMENTUM_MASS_RANGE.max} min={MOMENTUM_MASS_RANGE.min} onChange={(mass) => change({ mass })} onHighlightVariable={onHighlightVariable} step={MOMENTUM_MASS_RANGE.step} symbol="mA" unit="kg" value={state.mass} variableId="mass" />
        <InstrumentControl highlightedVariable={highlightedVariable} label="Cart A velocity" max={CART_ONE_VELOCITY_RANGE.max} min={CART_ONE_VELOCITY_RANGE.min} onChange={(velocity) => change({ velocity })} onHighlightVariable={onHighlightVariable} step={CART_ONE_VELOCITY_RANGE.step} symbol="uA" unit="m/s" value={state.velocity} variableId="velocity" />
        <InstrumentControl highlightedVariable={highlightedVariable} label="Cart B mass" max={MOMENTUM_MASS_RANGE.max} min={MOMENTUM_MASS_RANGE.min} onChange={(secondMass) => change({ secondMass })} onHighlightVariable={onHighlightVariable} step={MOMENTUM_MASS_RANGE.step} symbol="mB" unit="kg" value={state.secondMass} />
        <InstrumentControl highlightedVariable={highlightedVariable} label="Cart B velocity" max={CART_TWO_VELOCITY_RANGE.max} min={CART_TWO_VELOCITY_RANGE.min} onChange={(secondVelocity) => change({ secondVelocity })} onHighlightVariable={onHighlightVariable} step={CART_TWO_VELOCITY_RANGE.step} symbol="uB" unit="m/s" value={state.secondVelocity} />
        <div className={`newton-result${momentumLinked}`}><span>Cart A initial momentum</span><output><var>pA</var> = {formatMeasurement(calculateMomentum(state.mass, state.velocity))} <small>kg·m/s</small></output><code>mA × uA</code></div>
        <p className="newton-console__note">External impulse is neglected. Elastic mode conserves kinetic energy; perfectly inelastic mode converts some kinetic energy while conserving momentum.</p>
      </aside>
    </div>
  )
}
