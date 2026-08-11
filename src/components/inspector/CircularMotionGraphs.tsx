import type { PhysicsVariableId } from '../../types/formula'
import {
  calculateCircularMotion,
  circularAccelerationRadiusPoints,
  circularAccelerationSpeedPoints,
  circularForceMassPoints,
  CIRCULAR_MASS_RANGE,
  CIRCULAR_RADIUS_RANGE,
  CIRCULAR_SPEED_RANGE,
  type CircularMotionState,
} from '../../utils/circularMotion'
import { RelationshipGraph } from './RelationshipGraph'

interface CircularMotionGraphsProps {
  highlightedVariable: PhysicsVariableId | null
  state: CircularMotionState
}

export function CircularMotionGraphs({ highlightedVariable, state }: CircularMotionGraphsProps) {
  const motion = calculateCircularMotion(state.mass, state.speed, state.radius, state.time)
  const speedPoints = circularAccelerationSpeedPoints(state.radius)
  const radiusPoints = circularAccelerationRadiusPoints(state.speed)
  const massPoints = circularForceMassPoints(state.speed, state.radius)
  return (
    <div className="newton-graphs instrument-graphs--three">
      <RelationshipGraph activeX={highlightedVariable === 'speed'} activeY={highlightedVariable === 'centripetal-acceleration'} description="At fixed radius, centripetal acceleration grows with the square of tangential speed." marker={{ x: state.speed, y: motion.acceleration }} points={speedPoints} title="Acceleration vs speed" xDomain={[0, CIRCULAR_SPEED_RANGE.max]} xLabel="Speed, v (m/s)" yDomain={[0, Math.max(speedPoints.at(-1)?.y ?? 1, 1) * 1.06]} yLabel="Centripetal acceleration, a꜀ (m/s²)" />
      <RelationshipGraph activeX={highlightedVariable === 'radius'} activeY={highlightedVariable === 'centripetal-acceleration'} description="At fixed speed, increasing radius reduces centripetal acceleration in an inverse relationship." marker={{ x: state.radius, y: motion.acceleration }} points={radiusPoints} title="Acceleration vs radius" xDomain={[CIRCULAR_RADIUS_RANGE.min, CIRCULAR_RADIUS_RANGE.max]} xLabel="Radius, r (m)" yDomain={[0, Math.max(radiusPoints[0]?.y ?? 1, 1) * 1.06]} yLabel="Centripetal acceleration, a꜀ (m/s²)" />
      <RelationshipGraph activeX={highlightedVariable === 'mass'} activeY={highlightedVariable === 'centripetal-acceleration'} description="For the same orbit and speed, the inward resultant force increases linearly with mass while acceleration remains unchanged." marker={{ x: state.mass, y: motion.force }} points={massPoints} title="Inward force vs mass" xDomain={[CIRCULAR_MASS_RANGE.min, CIRCULAR_MASS_RANGE.max]} xLabel="Mass, m (kg)" yDomain={[0, Math.max(massPoints.at(-1)?.y ?? 1, 1) * 1.06]} yLabel="Inward force, F꜀ (N)" />
    </div>
  )
}
