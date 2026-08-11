import type { PhysicsVariableId } from '../../types/formula'
import {
  calculateProjectileMotion,
  calculateProjectileSample,
  type ProjectileLabState,
} from '../../utils/projectile'
import { RelationshipGraph } from './RelationshipGraph'

interface ProjectileGraphsProps {
  highlightedVariable: PhysicsVariableId | null
  state: ProjectileLabState
}

export function ProjectileGraphs({ highlightedVariable, state }: ProjectileGraphsProps) {
  const input = {
    angleDegrees: state.angleDegrees,
    gravity: state.gravity,
    launchHeight: state.launchHeight,
    speed: state.speed,
  }
  const motion = calculateProjectileMotion({ ...input, sampleCount: 70 })
  const time = Math.min(state.time, motion.flightTime)
  const current = calculateProjectileSample({ ...input, time })
  const samples = motion.points.map((point) => ({
    ...point,
    verticalVelocity: motion.verticalVelocity - state.gravity * point.time,
  }))
  const velocityExtent = Math.max(Math.abs(motion.verticalVelocity), Math.abs(motion.verticalVelocity - state.gravity * motion.flightTime), 1)

  return (
    <div className="newton-graphs instrument-graphs--three">
      <RelationshipGraph
        activeX={false}
        activeY={highlightedVariable === 'vertical-position'}
        description="The x-y trajectory is parabolic because horizontal velocity is constant while vertical velocity changes under gravity."
        marker={{ x: current.x, y: current.y }}
        points={motion.points}
        title="Projectile trajectory"
        xDomain={[0, Math.max(motion.range, 1)]}
        xLabel="Horizontal position, x (m)"
        yDomain={[0, Math.max(motion.maximumHeight * 1.08, 1)]}
        yLabel="Vertical position, y (m)"
      />
      <RelationshipGraph
        activeX={highlightedVariable === 'time'}
        activeY={highlightedVariable === 'vertical-position'}
        description="Vertical position follows y = y₀ + v₀ᵧt − ½gt² until the projectile reaches the ground."
        marker={{ x: time, y: current.y }}
        points={samples.map(({ time: sampleTime, y }) => ({ x: sampleTime, y }))}
        title="Vertical position vs time"
        xDomain={[0, motion.flightTime]}
        xLabel="Time, t (s)"
        yDomain={[0, Math.max(motion.maximumHeight * 1.08, 1)]}
        yLabel="Vertical position, y (m)"
      />
      <RelationshipGraph
        activeX={highlightedVariable === 'time'}
        activeY={highlightedVariable === 'initial-vertical-velocity'}
        description="Vertical velocity decreases linearly with slope −g, crossing zero at maximum height."
        marker={{ x: time, y: current.verticalVelocity }}
        points={samples.map(({ time: sampleTime, verticalVelocity }) => ({ x: sampleTime, y: verticalVelocity }))}
        title="Vertical velocity vs time"
        xDomain={[0, motion.flightTime]}
        xLabel="Time, t (s)"
        yDomain={[-velocityExtent * 1.08, velocityExtent * 1.08]}
        yLabel="Vertical velocity, vᵧ (m/s)"
      />
    </div>
  )
}
