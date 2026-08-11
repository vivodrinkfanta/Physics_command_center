import type { PhysicsVariableId } from '../../types/formula'
import {
  calculateKineticEnergy,
  KINETIC_MASS_RANGE,
  KINETIC_SPEED_RANGE,
  kineticEnergyMassGraphPoints,
  kineticEnergySpeedGraphPoints,
  type KineticEnergyState,
} from '../../utils/kineticEnergy'
import { RelationshipGraph } from './RelationshipGraph'

interface KineticEnergyGraphsProps {
  highlightedVariable: PhysicsVariableId | null
  state: KineticEnergyState
}

export function KineticEnergyGraphs({ highlightedVariable, state }: KineticEnergyGraphsProps) {
  const energy = calculateKineticEnergy(state.mass, state.speed)
  const speedGraphMaximum = Math.max(
    calculateKineticEnergy(state.mass, KINETIC_SPEED_RANGE.max),
    1,
  )
  const massGraphMaximum = Math.max(
    calculateKineticEnergy(KINETIC_MASS_RANGE.max, state.speed),
    1,
  )

  return (
    <div className="newton-graphs">
      <RelationshipGraph
        activeX={highlightedVariable === 'speed'}
        activeY={highlightedVariable === 'kinetic-energy'}
        description="Kinetic energy rises with the square of speed when mass remains constant."
        marker={{ x: state.speed, y: energy }}
        points={kineticEnergySpeedGraphPoints(state.mass)}
        title="Kinetic energy vs speed"
        xDomain={[KINETIC_SPEED_RANGE.min, KINETIC_SPEED_RANGE.max]}
        xLabel="Speed, v (m/s)"
        yDomain={[0, speedGraphMaximum]}
        yLabel="Kinetic energy, Eₖ (J)"
      />
      <RelationshipGraph
        activeX={highlightedVariable === 'mass'}
        activeY={highlightedVariable === 'kinetic-energy'}
        description="Kinetic energy rises linearly with mass when speed remains constant."
        marker={{ x: state.mass, y: energy }}
        points={kineticEnergyMassGraphPoints(state.speed)}
        title="Kinetic energy vs mass"
        xDomain={[KINETIC_MASS_RANGE.min, KINETIC_MASS_RANGE.max]}
        xLabel="Mass, m (kg)"
        yDomain={[0, massGraphMaximum]}
        yLabel="Kinetic energy, Eₖ (J)"
      />
    </div>
  )
}
