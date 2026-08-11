export interface KineticEnergyState {
  mass: number
  speed: number
  time: number
}

export interface KineticEnergyGraphPoint {
  x: number
  y: number
}

export const KINETIC_TIME_LIMIT = 4
export const KINETIC_MASS_RANGE = { min: 1, max: 10, step: 0.5 }
export const KINETIC_SPEED_RANGE = { min: 0, max: 15, step: 0.5 }

function validatePointCount(pointCount: number, graphName: string) {
  if (!Number.isInteger(pointCount) || pointCount < 2) {
    throw new Error(`${graphName} requires at least two points.`)
  }
}

export function calculateKineticEnergy(mass: number, speed: number) {
  if (!Number.isFinite(mass) || mass <= 0) {
    throw new Error('Mass must be greater than zero.')
  }
  if (!Number.isFinite(speed) || speed < 0) {
    throw new Error('Speed must be a non-negative finite number.')
  }
  return 0.5 * mass * speed ** 2
}

export function calculateUniformMotion(speed: number, time: number) {
  if (!Number.isFinite(speed) || speed < 0) {
    throw new Error('Speed must be a non-negative finite number.')
  }
  if (!Number.isFinite(time) || time < 0) {
    throw new Error('Time must be a non-negative finite number.')
  }
  return { displacement: speed * time, speed }
}

export function kineticEnergySpeedGraphPoints(
  mass: number,
  pointCount = 31,
): KineticEnergyGraphPoint[] {
  validatePointCount(pointCount, 'Speed graph')
  return Array.from({ length: pointCount }, (_, index) => {
    const speed =
      KINETIC_SPEED_RANGE.min +
      (index / (pointCount - 1)) * (KINETIC_SPEED_RANGE.max - KINETIC_SPEED_RANGE.min)
    return { x: speed, y: calculateKineticEnergy(mass, speed) }
  })
}

export function kineticEnergyMassGraphPoints(
  speed: number,
  pointCount = 31,
): KineticEnergyGraphPoint[] {
  validatePointCount(pointCount, 'Mass graph')
  return Array.from({ length: pointCount }, (_, index) => {
    const mass =
      KINETIC_MASS_RANGE.min +
      (index / (pointCount - 1)) * (KINETIC_MASS_RANGE.max - KINETIC_MASS_RANGE.min)
    return { x: mass, y: calculateKineticEnergy(mass, speed) }
  })
}
