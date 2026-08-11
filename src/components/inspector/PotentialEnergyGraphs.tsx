import type { PhysicsVariableId } from '../../types/formula'
import {
  calculatePotentialEnergy,
  potentialHeightGraphPoints,
  potentialMassGraphPoints,
  POTENTIAL_HEIGHT_RANGE,
  POTENTIAL_MASS_RANGE,
  type PotentialEnergyState,
} from '../../utils/potentialEnergy'
import { RelationshipGraph } from './RelationshipGraph'

interface PotentialEnergyGraphsProps {
  highlightedVariable: PhysicsVariableId | null
  state: PotentialEnergyState
}

function energyDomain(values: number[]): [number, number] {
  const extent = Math.max(...values.map(Math.abs), 1)
  return [-extent * 1.08, extent * 1.08]
}

export function PotentialEnergyGraphs({ highlightedVariable, state }: PotentialEnergyGraphsProps) {
  const energy = calculatePotentialEnergy(state.mass, state.gravity, state.height)
  const heightPoints = potentialHeightGraphPoints(state.mass, state.gravity)
  const massPoints = potentialMassGraphPoints(state.height, state.gravity)
  return (
    <div className="newton-graphs">
      <RelationshipGraph activeX={highlightedVariable === 'height'} activeY={highlightedVariable === 'gravitational-potential-energy'} description="Potential energy change is directly proportional to signed height change for fixed mass and gravity." marker={{ x: state.height, y: energy }} points={heightPoints} title="Potential energy vs height" xDomain={[POTENTIAL_HEIGHT_RANGE.min, POTENTIAL_HEIGHT_RANGE.max]} xLabel="Height change, Δh (m)" yDomain={energyDomain(heightPoints.map(({ y }) => y))} yLabel="Potential energy change, ΔEₚ (J)" />
      <RelationshipGraph activeX={highlightedVariable === 'mass'} activeY={highlightedVariable === 'gravitational-potential-energy'} description="Potential energy change is directly proportional to mass for fixed gravity and height change." marker={{ x: state.mass, y: energy }} points={massPoints} title="Potential energy vs mass" xDomain={[POTENTIAL_MASS_RANGE.min, POTENTIAL_MASS_RANGE.max]} xLabel="Mass, m (kg)" yDomain={energyDomain(massPoints.map(({ y }) => y))} yLabel="Potential energy change, ΔEₚ (J)" />
    </div>
  )
}
