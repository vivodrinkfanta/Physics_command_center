export interface ProjectilePoint {
  time: number
  x: number
  y: number
}
export interface ProjectileMotion {
  flightTime: number
  horizontalVelocity: number
  maximumHeight: number
  points: ProjectilePoint[]
  range: number
  verticalVelocity: number
}

export interface ProjectileSample extends ProjectilePoint {
  horizontalVelocity: number
  speed: number
  verticalVelocity: number
}

export interface ProjectileLabState {
  angleDegrees: number
  gravity: number
  launchHeight: number
  speed: number
  time: number
}

export const PROJECTILE_SPEED_RANGE = { min: 5, max: 40, step: 0.5 }
export const PROJECTILE_ANGLE_RANGE = { min: 5, max: 85, step: 1 }
export const PROJECTILE_HEIGHT_RANGE = { min: 0, max: 20, step: 0.5 }
export const PROJECTILE_GRAVITY_RANGE = { min: 1.62, max: 24.79, step: 0.01 }

interface ProjectileInput {
  angleDegrees: number
  gravity?: number
  launchHeight?: number
  sampleCount?: number
  speed: number
}

export function calculateProjectileSample({
  angleDegrees,
  gravity,
  launchHeight,
  speed,
  time,
}: Required<Pick<ProjectileInput, 'angleDegrees' | 'gravity' | 'launchHeight' | 'speed'>> & {
  time: number
}): ProjectileSample {
  if (!Number.isFinite(speed) || speed <= 0) {
    throw new RangeError('Launch speed must be a positive finite number.')
  }
  if (!Number.isFinite(angleDegrees) || angleDegrees <= 0 || angleDegrees >= 90) {
    throw new RangeError('Launch angle must be between 0 and 90 degrees.')
  }
  if (!Number.isFinite(gravity) || gravity <= 0) {
    throw new RangeError('Gravity must be a positive finite number.')
  }
  if (!Number.isFinite(launchHeight) || launchHeight < 0) {
    throw new RangeError('Launch height must be a non-negative finite number.')
  }
  if (!Number.isFinite(time) || time < 0) throw new RangeError('Time must be non-negative.')
  const angleRadians = (angleDegrees * Math.PI) / 180
  const horizontalVelocity = speed * Math.cos(angleRadians)
  const initialVerticalVelocity = speed * Math.sin(angleRadians)
  const verticalVelocity = initialVerticalVelocity - gravity * time
  return {
    horizontalVelocity,
    speed: Math.hypot(horizontalVelocity, verticalVelocity),
    time,
    verticalVelocity,
    x: horizontalVelocity * time,
    y: Math.max(0, launchHeight + initialVerticalVelocity * time - 0.5 * gravity * time ** 2),
  }
}

export function calculateProjectileMotion({
  angleDegrees,
  gravity = 9.81,
  launchHeight = 0,
  sampleCount = 40,
  speed,
}: ProjectileInput): ProjectileMotion {
  if (!Number.isFinite(speed) || speed <= 0) {
    throw new RangeError('Launch speed must be a positive finite number.')
  }
  if (!Number.isFinite(angleDegrees) || angleDegrees <= 0 || angleDegrees >= 90) {
    throw new RangeError('Launch angle must be between 0 and 90 degrees.')
  }
  if (!Number.isFinite(gravity) || gravity <= 0) {
    throw new RangeError('Gravity must be a positive finite number.')
  }
  if (!Number.isFinite(launchHeight) || launchHeight < 0) {
    throw new RangeError('Launch height must be a non-negative finite number.')
  }
  if (!Number.isInteger(sampleCount) || sampleCount < 2) {
    throw new RangeError('Sample count must be an integer of at least two.')
  }

  const angleRadians = (angleDegrees * Math.PI) / 180
  const horizontalVelocity = speed * Math.cos(angleRadians)
  const verticalVelocity = speed * Math.sin(angleRadians)
  const flightTime =
    (verticalVelocity + Math.sqrt(verticalVelocity ** 2 + 2 * gravity * launchHeight)) / gravity
  const range = horizontalVelocity * flightTime
  const maximumHeight = launchHeight + (verticalVelocity * verticalVelocity) / (2 * gravity)
  const points = Array.from({ length: sampleCount + 1 }, (_, index) => {
    const time = (flightTime * index) / sampleCount
    const sample = calculateProjectileSample({ angleDegrees, gravity, launchHeight, speed, time })
    return {
      time,
      x: sample.x,
      y: index === sampleCount ? 0 : sample.y,
    }
  })

  return { flightTime, horizontalVelocity, maximumHeight, points, range, verticalVelocity }
}
