export interface MomentumState {
  mass: number
  restitution: 0 | 1
  secondMass: number
  secondVelocity: number
  time: number
  velocity: number
}

export interface CollisionResult {
  finalVelocity1: number
  finalVelocity2: number
  initialKineticEnergy: number
  initialMomentum: number
  finalKineticEnergy: number
  finalMomentum: number
}

export const COLLISION_TIME = 2
export const MOMENTUM_TIME_LIMIT = 4
export const MOMENTUM_MASS_RANGE = { min: 1, max: 10, step: 0.5 }
export const CART_ONE_VELOCITY_RANGE = { min: 2, max: 12, step: 0.5 }
export const CART_TWO_VELOCITY_RANGE = { min: -8, max: 1.5, step: 0.5 }

export function calculateMomentum(mass: number, velocity: number) {
  if (!Number.isFinite(mass) || mass <= 0) throw new Error('Mass must be greater than zero.')
  if (!Number.isFinite(velocity)) throw new Error('Velocity must be finite.')
  return mass * velocity
}

export function calculateCollision(
  mass1: number,
  velocity1: number,
  mass2: number,
  velocity2: number,
  restitution: number,
): CollisionResult {
  if (!Number.isFinite(mass1) || mass1 <= 0 || !Number.isFinite(mass2) || mass2 <= 0) {
    throw new Error('Both cart masses must be greater than zero.')
  }
  if (!Number.isFinite(velocity1) || !Number.isFinite(velocity2)) {
    throw new Error('Both cart velocities must be finite.')
  }
  if (!Number.isFinite(restitution) || restitution < 0 || restitution > 1) {
    throw new Error('Restitution must be between zero and one.')
  }
  const totalMass = mass1 + mass2
  const finalVelocity1 =
    (mass1 * velocity1 + mass2 * velocity2 - mass2 * restitution * (velocity1 - velocity2)) /
    totalMass
  const finalVelocity2 =
    (mass1 * velocity1 + mass2 * velocity2 + mass1 * restitution * (velocity1 - velocity2)) /
    totalMass
  const initialMomentum = calculateMomentum(mass1, velocity1) + calculateMomentum(mass2, velocity2)
  const finalMomentum =
    calculateMomentum(mass1, finalVelocity1) + calculateMomentum(mass2, finalVelocity2)
  const initialKineticEnergy = 0.5 * mass1 * velocity1 ** 2 + 0.5 * mass2 * velocity2 ** 2
  const finalKineticEnergy = 0.5 * mass1 * finalVelocity1 ** 2 + 0.5 * mass2 * finalVelocity2 ** 2
  return {
    finalVelocity1,
    finalVelocity2,
    initialKineticEnergy,
    initialMomentum,
    finalKineticEnergy,
    finalMomentum,
  }
}

export function momentumVelocityGraphPoints(mass: number, pointCount = 41) {
  if (!Number.isInteger(pointCount) || pointCount < 2) throw new Error('Graph requires two points.')
  return Array.from({ length: pointCount }, (_, index) => {
    const velocity = -20 + (40 * index) / (pointCount - 1)
    return { x: velocity, y: calculateMomentum(mass, velocity) }
  })
}

export function momentumMassGraphPoints(velocity: number, pointCount = 31) {
  if (!Number.isInteger(pointCount) || pointCount < 2) throw new Error('Graph requires two points.')
  return Array.from({ length: pointCount }, (_, index) => {
    const mass = 1 + (9 * index) / (pointCount - 1)
    return { x: mass, y: calculateMomentum(mass, velocity) }
  })
}
