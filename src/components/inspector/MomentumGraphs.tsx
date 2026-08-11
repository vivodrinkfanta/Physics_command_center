import type { PhysicsVariableId } from '../../types/formula'
import {
  calculateMomentum,
  momentumMassGraphPoints,
  momentumVelocityGraphPoints,
  MOMENTUM_MASS_RANGE,
  type MomentumState,
} from '../../utils/momentum'
import { RelationshipGraph } from './RelationshipGraph'

interface MomentumGraphsProps {
  highlightedVariable: PhysicsVariableId | null
  state: MomentumState
}

export function MomentumGraphs({ highlightedVariable, state }: MomentumGraphsProps) {
  const momentum = calculateMomentum(state.mass, state.velocity)
  const velocityExtent = Math.max(20 * state.mass, 1)
  const massExtent = Math.max(Math.abs(state.velocity) * MOMENTUM_MASS_RANGE.max, 1)
  return (
    <div className="newton-graphs">
      <RelationshipGraph activeX={highlightedVariable === 'velocity'} activeY={highlightedVariable === 'momentum'} description="Momentum changes linearly with signed velocity when mass remains constant." marker={{ x: state.velocity, y: momentum }} points={momentumVelocityGraphPoints(state.mass)} title="Momentum vs velocity" xDomain={[-20, 20]} xLabel="Velocity, v (m/s)" yDomain={[-velocityExtent, velocityExtent]} yLabel="Momentum, p (kg·m/s)" />
      <RelationshipGraph activeX={highlightedVariable === 'mass'} activeY={highlightedVariable === 'momentum'} description="Momentum changes linearly with mass when signed velocity remains constant." marker={{ x: state.mass, y: momentum }} points={momentumMassGraphPoints(state.velocity)} title="Momentum vs mass" xDomain={[MOMENTUM_MASS_RANGE.min, MOMENTUM_MASS_RANGE.max]} xLabel="Mass, m (kg)" yDomain={[-massExtent, massExtent]} yLabel="Momentum, p (kg·m/s)" />
    </div>
  )
}
