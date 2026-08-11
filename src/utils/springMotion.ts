export interface SpringMotionState {
  displacement: number
  mass: number
  springConstant: number
  time: number
}

export interface SpringMotionSample {
  displacement: number
  elasticEnergy: number
  force: number
  kineticEnergy: number
  period: number
  time: number
  totalEnergy: number
  velocity: number
}

export const SPRING_TIME_LIMIT = 12
export const SPRING_CONSTANT_RANGE = { min: 10, max: 150, step: 5 }
export const SPRING_DISPLACEMENT_RANGE = { min: -0.45, max: 0.45, step: 0.01 }
export const SPRING_MASS_RANGE = { min: 0.5, max: 10, step: 0.5 }

export function calculateSpringMotion(
  springConstant: number,
  mass: number,
  amplitude: number,
  time: number,
): SpringMotionSample {
  if (!Number.isFinite(springConstant) || springConstant <= 0) {
    throw new Error('Spring constant must be greater than zero.')
  }
  if (!Number.isFinite(mass) || mass <= 0) throw new Error('Mass must be greater than zero.')
  if (!Number.isFinite(amplitude)) throw new Error('Displacement must be finite.')
  if (!Number.isFinite(time) || time < 0) throw new Error('Time must be non-negative.')

  const angularFrequency = Math.sqrt(springConstant / mass)
  const displacement = amplitude * Math.cos(angularFrequency * time)
  const velocity = -amplitude * angularFrequency * Math.sin(angularFrequency * time)
  const force = -springConstant * displacement
  const elasticEnergy = 0.5 * springConstant * displacement ** 2
  const kineticEnergy = 0.5 * mass * velocity ** 2
  return {
    displacement,
    elasticEnergy,
    force,
    kineticEnergy,
    period: (Math.PI * 2) / angularFrequency,
    time,
    totalEnergy: 0.5 * springConstant * amplitude ** 2,
    velocity,
  }
}

export function springPositionTimePoints(
  springConstant: number,
  mass: number,
  amplitude: number,
  pointCount = 121,
) {
  if (!Number.isInteger(pointCount) || pointCount < 2) throw new Error('Graph requires two points.')
  return Array.from({ length: pointCount }, (_, index) => {
    const time = (SPRING_TIME_LIMIT * index) / (pointCount - 1)
    return { x: time, y: calculateSpringMotion(springConstant, mass, amplitude, time).displacement }
  })
}

export function springForceDisplacementPoints(springConstant: number, pointCount = 61) {
  if (!Number.isInteger(pointCount) || pointCount < 2) throw new Error('Graph requires two points.')
  return Array.from({ length: pointCount }, (_, index) => {
    const displacement =
      SPRING_DISPLACEMENT_RANGE.min +
      ((SPRING_DISPLACEMENT_RANGE.max - SPRING_DISPLACEMENT_RANGE.min) * index) /
        (pointCount - 1)
    return { x: displacement, y: -springConstant * displacement }
  })
}

export function springEnergyDisplacementPoints(springConstant: number, pointCount = 61) {
  if (!Number.isInteger(pointCount) || pointCount < 2) throw new Error('Graph requires two points.')
  return springForceDisplacementPoints(springConstant, pointCount).map(({ x }) => ({
    x,
    y: 0.5 * springConstant * x ** 2,
  }))
}
