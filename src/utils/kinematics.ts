export interface KinematicsState {
  acceleration: number
  initialVelocity: number
  time: number
}

export interface KinematicsSample {
  acceleration: number
  position: number
  time: number
  velocity: number
}

export const KINEMATICS_TIME_LIMIT = 10
export const KINEMATICS_VELOCITY_RANGE = { min: -20, max: 20, step: 0.5 }
export const KINEMATICS_ACCELERATION_RANGE = { min: -8, max: 8, step: 0.25 }

export function calculateKinematics(
  initialVelocity: number,
  acceleration: number,
  time: number,
): KinematicsSample {
  if (!Number.isFinite(initialVelocity)) throw new Error('Initial velocity must be finite.')
  if (!Number.isFinite(acceleration)) throw new Error('Acceleration must be finite.')
  if (!Number.isFinite(time) || time < 0) throw new Error('Time must be non-negative.')
  return {
    acceleration,
    position: initialVelocity * time + 0.5 * acceleration * time ** 2,
    time,
    velocity: initialVelocity + acceleration * time,
  }
}

export function kinematicsSeries(
  initialVelocity: number,
  acceleration: number,
  duration = KINEMATICS_TIME_LIMIT,
  pointCount = 81,
) {
  if (!Number.isFinite(duration) || duration <= 0) throw new Error('Duration must be positive.')
  if (!Number.isInteger(pointCount) || pointCount < 2) {
    throw new Error('Kinematics series requires at least two points.')
  }
  return Array.from({ length: pointCount }, (_, index) =>
    calculateKinematics(initialVelocity, acceleration, (duration * index) / (pointCount - 1)),
  )
}
