import type { PhysicsVariableId } from '../../types/formula'
import {
  calculateSpringMotion,
  springEnergyDisplacementPoints,
  springForceDisplacementPoints,
  springPositionTimePoints,
  SPRING_DISPLACEMENT_RANGE,
  SPRING_TIME_LIMIT,
  type SpringMotionState,
} from '../../utils/springMotion'
import { RelationshipGraph } from './RelationshipGraph'

interface SpringMotionGraphsProps {
  highlightedVariable: PhysicsVariableId | null
  state: SpringMotionState
  outputVariableId?: 'spring-force' | 'elastic-potential-energy'
}

export function SpringMotionGraphs({ highlightedVariable, outputVariableId = 'spring-force', state }: SpringMotionGraphsProps) {
  const motion = calculateSpringMotion(
    state.springConstant,
    state.mass,
    state.displacement,
    state.time,
  )
  const positionPoints = springPositionTimePoints(
    state.springConstant,
    state.mass,
    state.displacement,
  )
  const forcePoints = springForceDisplacementPoints(state.springConstant)
  const energyPoints = springEnergyDisplacementPoints(state.springConstant)
  const displacementExtent = Math.max(Math.abs(state.displacement) * 1.15, 0.05)
  const forceExtent = Math.max(Math.abs(forcePoints[0]?.y ?? 1), 1)
  const energyExtent = Math.max(energyPoints[0]?.y ?? 1, 1)
  return (
    <div className="newton-graphs instrument-graphs--three">
      <RelationshipGraph activeX={false} activeY={highlightedVariable === 'spring-displacement'} description="The mass follows sinusoidal simple harmonic motion because the ideal restoring force is proportional to displacement." marker={{ x: state.time, y: motion.displacement }} points={positionPoints} title="Displacement vs time" xDomain={[0, SPRING_TIME_LIMIT]} xLabel="Time, t (s)" yDomain={[-displacementExtent, displacementExtent]} yLabel="Displacement, x (m)" />
      <RelationshipGraph activeX={highlightedVariable === 'spring-displacement'} activeY={outputVariableId === 'spring-force' && highlightedVariable === 'spring-force'} description="The negative slope shows that the spring force always points opposite to displacement." marker={{ x: motion.displacement, y: motion.force }} points={forcePoints} title="Restoring force vs displacement" xDomain={[SPRING_DISPLACEMENT_RANGE.min, SPRING_DISPLACEMENT_RANGE.max]} xLabel="Displacement, x (m)" yDomain={[-forceExtent * 1.06, forceExtent * 1.06]} yLabel="Restoring force, F (N)" />
      <RelationshipGraph activeX={highlightedVariable === 'spring-displacement'} activeY={outputVariableId === 'elastic-potential-energy' && highlightedVariable === 'elastic-potential-energy'} description="Elastic potential energy is zero at equilibrium and increases quadratically with the magnitude of displacement." marker={{ x: motion.displacement, y: motion.elasticEnergy }} points={energyPoints} title="Elastic energy vs displacement" xDomain={[SPRING_DISPLACEMENT_RANGE.min, SPRING_DISPLACEMENT_RANGE.max]} xLabel="Displacement, x (m)" yDomain={[0, energyExtent * 1.06]} yLabel="Elastic energy, Eₑ (J)" />
    </div>
  )
}
