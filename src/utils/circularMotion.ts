export interface CircularMotionState {
  mass: number
  radius: number
  speed: number
  time: number
}

export interface CircularMotionSample {
  acceleration: number
  angle: number
  angularSpeed: number
  force: number
  period: number | null
}

export const CIRCULAR_TIME_LIMIT = 12
export const CIRCULAR_MASS_RANGE = { min: 0.5, max: 10, step: 0.5 }
export const CIRCULAR_SPEED_RANGE = { min: 1, max: 30, step: 0.5 }
export const CIRCULAR_RADIUS_RANGE = { min: 1, max: 20, step: 0.5 }

export function calculateCircularMotion(
  mass: number,
  speed: number,
  radius: number,
  time = 0,
): CircularMotionSample {
  if (!Number.isFinite(mass) || mass <= 0) throw new Error('Mass must be greater than zero.')
  if (!Number.isFinite(speed) || speed < 0) throw new Error('Speed must be non-negative.')
  if (!Number.isFinite(radius) || radius <= 0) throw new Error('Radius must be greater than zero.')
  if (!Number.isFinite(time) || time < 0) throw new Error('Time must be non-negative.')

  const acceleration = speed ** 2 / radius
  const angularSpeed = speed / radius
  return {
    acceleration,
    angle: (angularSpeed * time) % (Math.PI * 2),
    angularSpeed,
    force: mass * acceleration,
    period: speed === 0 ? null : (Math.PI * 2 * radius) / speed,
  }
}

export function circularAccelerationSpeedPoints(radius: number, pointCount = 61) {
  if (!Number.isInteger(pointCount) || pointCount < 2) throw new Error('Graph requires two points.')
  return Array.from({ length: pointCount }, (_, index) => {
    const speed = (CIRCULAR_SPEED_RANGE.max * index) / (pointCount - 1)
    return { x: speed, y: calculateCircularMotion(1, speed, radius).acceleration }
  })
}

export function circularAccelerationRadiusPoints(speed: number, pointCount = 61) {
  if (!Number.isInteger(pointCount) || pointCount < 2) throw new Error('Graph requires two points.')
  return Array.from({ length: pointCount }, (_, index) => {
    const radius =
      CIRCULAR_RADIUS_RANGE.min +
      ((CIRCULAR_RADIUS_RANGE.max - CIRCULAR_RADIUS_RANGE.min) * index) / (pointCount - 1)
    return { x: radius, y: calculateCircularMotion(1, speed, radius).acceleration }
  })
}

export function circularForceMassPoints(speed: number, radius: number, pointCount = 39) {
  if (!Number.isInteger(pointCount) || pointCount < 2) throw new Error('Graph requires two points.')
  return Array.from({ length: pointCount }, (_, index) => {
    const mass =
      CIRCULAR_MASS_RANGE.min +
      ((CIRCULAR_MASS_RANGE.max - CIRCULAR_MASS_RANGE.min) * index) / (pointCount - 1)
    return { x: mass, y: calculateCircularMotion(mass, speed, radius).force }
  })
}
