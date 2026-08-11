export interface ProjectilePoint {
  time: number
  x: number
  y: number
}
export interface ProjectileMotion {
  flightTime: number
  maximumHeight: number
  points: ProjectilePoint[]
  range: number
}

interface ProjectileInput {
  angleDegrees: number
  gravity?: number
  sampleCount?: number
  speed: number
}

export function calculateProjectileMotion({
  angleDegrees,
  gravity = 9.81,
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
  if (!Number.isInteger(sampleCount) || sampleCount < 2) {
    throw new RangeError('Sample count must be an integer of at least two.')
  }

  const angleRadians = (angleDegrees * Math.PI) / 180
  const horizontalVelocity = speed * Math.cos(angleRadians)
  const verticalVelocity = speed * Math.sin(angleRadians)
  const flightTime = (2 * verticalVelocity) / gravity
  const range = horizontalVelocity * flightTime
  const maximumHeight = (verticalVelocity * verticalVelocity) / (2 * gravity)
  const points = Array.from({ length: sampleCount + 1 }, (_, index) => {
    const time = (flightTime * index) / sampleCount

    return {
      time,
      x: horizontalVelocity * time,
      y: Math.max(0, verticalVelocity * time - 0.5 * gravity * time * time),
    }
  })

  return { flightTime, maximumHeight, points, range }
}
