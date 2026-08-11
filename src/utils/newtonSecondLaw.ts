export interface NewtonState {
  force: number
  mass: number
  time: number
}

export interface GraphPoint {
  x: number
  y: number
}

export interface MotionSample {
  acceleration: number
  position: number
  time: number
  velocity: number
}

export const NEWTON_TIME_LIMIT = 4
export const NEWTON_FORCE_RANGE = { min: -60, max: 60, step: 1 }
export const NEWTON_MASS_RANGE = { min: 1, max: 20, step: 0.5 }

export function calculateAcceleration(force: number, mass: number) {
  if (!Number.isFinite(force)) throw new Error('Force must be a finite number.')
  if (!Number.isFinite(mass) || mass <= 0) throw new Error('Mass must be greater than zero.')
  return force / mass
}

export function calculateMotion(force: number, mass: number, time: number) {
  if (!Number.isFinite(time) || time < 0) {
    throw new Error('Time must be a non-negative finite number.')
  }
  const acceleration = calculateAcceleration(force, mass)
  return {
    acceleration,
    position: 0.5 * acceleration * time ** 2,
    velocity: acceleration * time,
  }
}

export function motionSeries(
  force: number,
  mass: number,
  duration = NEWTON_TIME_LIMIT,
  pointCount = 81,
): MotionSample[] {
  if (!Number.isFinite(duration) || duration < 0) {
    throw new Error('Duration must be a non-negative finite number.')
  }
  if (!Number.isInteger(pointCount) || pointCount < 2) {
    throw new Error('Motion series requires at least two points.')
  }

  return Array.from({ length: pointCount }, (_, index) => {
    const time = (index / (pointCount - 1)) * duration
    return { time, ...calculateMotion(force, mass, time) }
  })
}

export function forceGraphPoints(mass: number, pointCount = 31): GraphPoint[] {
  if (!Number.isInteger(pointCount) || pointCount < 2) {
    throw new Error('Force graph requires at least two points.')
  }
  return Array.from({ length: pointCount }, (_, index) => {
    const force =
      NEWTON_FORCE_RANGE.min +
      (index / (pointCount - 1)) * (NEWTON_FORCE_RANGE.max - NEWTON_FORCE_RANGE.min)
    return { x: force, y: calculateAcceleration(force, mass) }
  })
}

export function massGraphPoints(force: number, pointCount = 31): GraphPoint[] {
  if (!Number.isInteger(pointCount) || pointCount < 2) {
    throw new Error('Mass graph requires at least two points.')
  }
  return Array.from({ length: pointCount }, (_, index) => {
    const mass =
      NEWTON_MASS_RANGE.min +
      (index / (pointCount - 1)) * (NEWTON_MASS_RANGE.max - NEWTON_MASS_RANGE.min)
    return { x: mass, y: calculateAcceleration(force, mass) }
  })
}

export function formatMeasurement(value: number, maximumFractionDigits = 2) {
  const normalized = Math.abs(value) < 0.005 ? 0 : value
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits,
    minimumFractionDigits: maximumFractionDigits,
  }).format(normalized)
}
