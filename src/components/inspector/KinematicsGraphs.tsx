import type { PhysicsVariableId } from '../../types/formula'
import {
  calculateKinematics,
  kinematicsSeries,
  KINEMATICS_TIME_LIMIT,
  type KinematicsState,
} from '../../utils/kinematics'
import { RelationshipGraph } from './RelationshipGraph'

interface KinematicsGraphsProps {
  highlightedVariable: PhysicsVariableId | null
  state: KinematicsState
}

function domain(values: number[]): [number, number] {
  const minimum = Math.min(0, ...values)
  const maximum = Math.max(0, ...values)
  const padding = Math.max((maximum - minimum) * 0.08, 1)
  return [minimum - padding, maximum + padding]
}

export function KinematicsGraphs({ highlightedVariable, state }: KinematicsGraphsProps) {
  const samples = kinematicsSeries(state.initialVelocity, state.acceleration)
  const current = calculateKinematics(state.initialVelocity, state.acceleration, state.time)
  const timeDomain: [number, number] = [0, KINEMATICS_TIME_LIMIT]
  return (
    <div className="newton-graphs instrument-graphs--three">
      <RelationshipGraph
        activeX={highlightedVariable === 'time'}
        activeY={false}
        description="Position is the accumulated area under the velocity-time graph."
        marker={{ x: state.time, y: current.position }}
        points={samples.map(({ position, time }) => ({ x: time, y: position }))}
        title="Position vs time"
        xDomain={timeDomain}
        xLabel="Time, t (s)"
        yDomain={domain(samples.map(({ position }) => position))}
        yLabel="Position, x (m)"
      />
      <RelationshipGraph
        activeX={highlightedVariable === 'time'}
        activeY={highlightedVariable === 'final-velocity' || highlightedVariable === 'initial-velocity'}
        description="Velocity changes linearly because acceleration remains constant."
        marker={{ x: state.time, y: current.velocity }}
        points={samples.map(({ time, velocity }) => ({ x: time, y: velocity }))}
        title="Velocity vs time"
        xDomain={timeDomain}
        xLabel="Time, t (s)"
        yDomain={domain(samples.map(({ velocity }) => velocity))}
        yLabel="Velocity, v (m/s)"
      />
      <RelationshipGraph
        activeX={highlightedVariable === 'time'}
        activeY={highlightedVariable === 'acceleration'}
        description="The horizontal line confirms the constant-acceleration assumption."
        marker={{ x: state.time, y: current.acceleration }}
        points={samples.map(({ acceleration, time }) => ({ x: time, y: acceleration }))}
        title="Acceleration vs time"
        xDomain={timeDomain}
        xLabel="Time, t (s)"
        yDomain={domain(samples.map(({ acceleration }) => acceleration))}
        yLabel="Acceleration, a (m/s²)"
      />
    </div>
  )
}
