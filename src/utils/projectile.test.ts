import { describe, expect, it } from 'vitest'
import { calculateProjectileMotion } from './projectile'

describe('calculateProjectileMotion', () => {
  it('calculates an ideal 45-degree launch in SI units', () => {
    const motion = calculateProjectileMotion({ angleDegrees: 45, speed: 20 })

    expect(motion.range).toBeCloseTo(40.775, 3)
    expect(motion.maximumHeight).toBeCloseTo(10.194, 3)
    expect(motion.flightTime).toBeCloseTo(2.883, 3)
  })

  it('starts and lands at ground level at the calculated range', () => {
    const motion = calculateProjectileMotion({ angleDegrees: 35, sampleCount: 20, speed: 18 })
    const firstPoint = motion.points[0]
    const finalPoint = motion.points.at(-1)

    expect(firstPoint).toEqual({ time: 0, x: 0, y: 0 })
    expect(finalPoint?.x).toBeCloseTo(motion.range, 10)
    expect(finalPoint?.y).toBe(0)
  })

  it('rejects physically invalid inputs', () => {
    expect(() => calculateProjectileMotion({ angleDegrees: 45, speed: 0 })).toThrow(RangeError)
    expect(() => calculateProjectileMotion({ angleDegrees: 90, speed: 20 })).toThrow(RangeError)
    expect(() => calculateProjectileMotion({ angleDegrees: 45, gravity: -9.81, speed: 20 })).toThrow(
      RangeError,
    )
  })
})
