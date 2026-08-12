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
  outputVariableId?: 'centripetal-acceleration' | 'centripetal-force'
}

export function CircularMotionGraphs({ highlightedVariable, outputVariableId = 'centripetal-acceleration', state }: CircularMotionGraphsProps) {
  const motion = calculateCircularMotion(state.mass, state.speed, state.radius, state.time)
  const isForceMode = outputVariableId === 'centripetal-force'
  const speedPoints = circularAccelerationSpeedPoints(state.radius).map((point) => ({
    ...point,
    y: isForceMode ? point.y * state.mass : point.y,
  }))
  const radiusPoints = circularAccelerationRadiusPoints(state.speed).map((point) => ({
    ...point,
    y: isForceMode ? point.y * state.mass : point.y,
  }))
  const massPoints = circularForceMassPoints(state.speed, state.radius)
  const outputLabel = isForceMode ? 'Inward force, F꜀ (N)' : 'Centripetal acceleration, a꜀ (m/s²)'
  const outputName = isForceMode ? 'Inward force' : 'Acceleration'
  const outputValue = isForceMode ? motion.force : motion.acceleration
  return (
    <div className="newton-graphs instrument-graphs--three">
      <RelationshipGraph activeX={highlightedVariable === 'speed'} activeY={highlightedVariable === outputVariableId} description={`At fixed radius, ${isForceMode ? 'centripetal force' : 'centripetal acceleration'} grows with the square of tangential speed.`} marker={{ x: state.speed, y: outputValue }} points={speedPoints} title={`${outputName} vs speed`} xDomain={[0, CIRCULAR_SPEED_RANGE.max]} xLabel="Speed, v (m/s)" yDomain={[0, Math.max(speedPoints.at(-1)?.y ?? 1, 1) * 1.06]} yLabel={outputLabel} />
      <RelationshipGraph activeX={highlightedVariable === 'radius'} activeY={highlightedVariable === outputVariableId} description={`At fixed speed, increasing radius reduces ${isForceMode ? 'centripetal force' : 'centripetal acceleration'} in an inverse relationship.`} marker={{ x: state.radius, y: outputValue }} points={radiusPoints} title={`${outputName} vs radius`} xDomain={[CIRCULAR_RADIUS_RANGE.min, CIRCULAR_RADIUS_RANGE.max]} xLabel="Radius, r (m)" yDomain={[0, Math.max(radiusPoints[0]?.y ?? 1, 1) * 1.06]} yLabel={outputLabel} />
      <RelationshipGraph activeX={isForceMode && highlightedVariable === 'mass'} activeY={isForceMode && highlightedVariable === 'centripetal-force'} description="For the same orbit and speed, the inward resultant force increases linearly with mass while acceleration remains unchanged." marker={{ x: state.mass, y: motion.force }} points={massPoints} title="Inward force vs mass" xDomain={[CIRCULAR_MASS_RANGE.min, CIRCULAR_MASS_RANGE.max]} xLabel="Mass, m (kg)" yDomain={[0, Math.max(massPoints.at(-1)?.y ?? 1, 1) * 1.06]} yLabel="Inward force, F꜀ (N)" />
    </div>
  )
}
