export interface PotentialEnergyState {
  gravity: number
  height: number
  mass: number
}

export const POTENTIAL_MASS_RANGE = { min: 1, max: 20, step: 0.5 }
export const POTENTIAL_HEIGHT_RANGE = { min: -10, max: 20, step: 0.5 }
export const GRAVITY_RANGE = { min: 1.62, max: 24.79, step: 0.01 }

export function calculatePotentialEnergy(mass: number, gravity: number, height: number) {
  if (!Number.isFinite(mass) || mass <= 0) throw new Error('Mass must be greater than zero.')
  if (!Number.isFinite(gravity) || gravity <= 0) throw new Error('Gravity must be greater than zero.')
  if (!Number.isFinite(height)) throw new Error('Height must be finite.')
  return mass * gravity * height
}

export function potentialHeightGraphPoints(mass: number, gravity: number, pointCount = 41) {
  if (!Number.isInteger(pointCount) || pointCount < 2) throw new Error('Graph requires two points.')
  return Array.from({ length: pointCount }, (_, index) => {
    const height =
      POTENTIAL_HEIGHT_RANGE.min +
      ((POTENTIAL_HEIGHT_RANGE.max - POTENTIAL_HEIGHT_RANGE.min) * index) / (pointCount - 1)
    return { x: height, y: calculatePotentialEnergy(mass, gravity, height) }
  })
}

export function potentialMassGraphPoints(height: number, gravity: number, pointCount = 31) {
  if (!Number.isInteger(pointCount) || pointCount < 2) throw new Error('Graph requires two points.')
  return Array.from({ length: pointCount }, (_, index) => {
    const mass =
      POTENTIAL_MASS_RANGE.min +
      ((POTENTIAL_MASS_RANGE.max - POTENTIAL_MASS_RANGE.min) * index) / (pointCount - 1)
    return { x: mass, y: calculatePotentialEnergy(mass, gravity, height) }
  })
}
