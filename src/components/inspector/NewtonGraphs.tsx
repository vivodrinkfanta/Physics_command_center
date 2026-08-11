import type { PhysicsVariableId } from '../../types/formula'
import {
  calculateAcceleration,
  forceGraphPoints,
  massGraphPoints,
  NEWTON_FORCE_RANGE,
  NEWTON_MASS_RANGE,
  type NewtonState,
} from '../../utils/newtonSecondLaw'
import { RelationshipGraph } from './RelationshipGraph'

interface NewtonGraphsProps {
  highlightedVariable: PhysicsVariableId | null
  state: NewtonState
}

export function NewtonGraphs({ highlightedVariable, state }: NewtonGraphsProps) {
  const acceleration = calculateAcceleration(state.force, state.mass)
  const forceYMaximum = Math.max(60 / state.mass, 4)
  const massYMaximum = Math.max(Math.abs(state.force), 4)

  return (
    <div className="newton-graphs">
      <RelationshipGraph
        activeX={highlightedVariable === 'resultant-force'}
        activeY={highlightedVariable === 'acceleration'}
        description="Acceleration changes linearly with resultant force when mass remains constant."
        marker={{ x: state.force, y: acceleration }}
        points={forceGraphPoints(state.mass)}
        title="Acceleration vs resultant force"
        xDomain={[NEWTON_FORCE_RANGE.min, NEWTON_FORCE_RANGE.max]}
        xLabel="Resultant force, ΣF (N)"
        yDomain={[-forceYMaximum, forceYMaximum]}
        yLabel="Acceleration, a (m/s²)"
      />
      <RelationshipGraph
        activeX={highlightedVariable === 'mass'}
        activeY={highlightedVariable === 'acceleration'}
        description="Acceleration varies inversely with mass when resultant force remains constant."
        marker={{ x: state.mass, y: acceleration }}
        points={massGraphPoints(state.force)}
        title="Acceleration vs mass"
        xDomain={[NEWTON_MASS_RANGE.min, NEWTON_MASS_RANGE.max]}
        xLabel="Mass, m (kg)"
        yDomain={[-massYMaximum, massYMaximum]}
        yLabel="Acceleration, a (m/s²)"
      />
    </div>
  )
}
