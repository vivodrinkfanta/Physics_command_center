export interface NewtonState {
  force: number
  mass: number
  time: number
}

export interface GraphPoint {
  x: number
  y: number
}

export const NEWTON_TIME_LIMIT = 4
export const NEWTON_FORCE_RANGE = { min: -60, max: 60, step: 1 }
export const NEWTON_MASS_RANGE = { min: 1, max: 20, step: 0.5 }

export function calculateAcceleration(force: number, mass: number) {
  if (!Number.isFinite(mass) || mass <= 0) throw new Error('Mass must be greater than zero.')
  return force / mass
}

export function calculateMotion(force: number, mass: number, time: number) {
  const acceleration = calculateAcceleration(force, mass)
  const safeTime = Math.max(0, time)
  return {
    acceleration,
    position: 0.5 * acceleration * safeTime ** 2,
    velocity: acceleration * safeTime,
  }
}

export function forceGraphPoints(mass: number, pointCount = 31): GraphPoint[] {
  return Array.from({ length: pointCount }, (_, index) => {
    const force =
      NEWTON_FORCE_RANGE.min +
      (index / (pointCount - 1)) * (NEWTON_FORCE_RANGE.max - NEWTON_FORCE_RANGE.min)
    return { x: force, y: calculateAcceleration(force, mass) }
  })
}

export function massGraphPoints(force: number, pointCount = 31): GraphPoint[] {
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
