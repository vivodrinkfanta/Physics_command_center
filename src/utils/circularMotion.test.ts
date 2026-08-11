import { describe, expect, it } from 'vitest'
import {
  calculateCircularMotion,
  circularAccelerationRadiusPoints,
  circularAccelerationSpeedPoints,
  circularForceMassPoints,
} from './circularMotion'

describe('circular motion calculations', () => {
  it('calculates inward acceleration, force, angular speed, and period', () => {
    expect(calculateCircularMotion(2, 6, 3, 1)).toMatchObject({
      acceleration: 12,
      angularSpeed: 2,
      force: 24,
      period: Math.PI,
    })
  })

  it('tracks angular position from the same simulation time', () => {
    expect(calculateCircularMotion(1, 4, 2, Math.PI / 2).angle).toBeCloseTo(Math.PI)
  })

  it('supports the stationary limiting case without inventing a period', () => {
    expect(calculateCircularMotion(4, 0, 8)).toMatchObject({
      acceleration: 0,
      force: 0,
      period: null,
    })
  })

  it('builds the quadratic, inverse, and linear graph relationships', () => {
    const speedPoints = circularAccelerationSpeedPoints(5)
    const radiusPoints = circularAccelerationRadiusPoints(10)
    const massPoints = circularForceMassPoints(10, 5)
    expect(speedPoints.at(-1)?.y).toBeCloseTo(180)
    expect(radiusPoints[0].y).toBeCloseTo(100)
    expect(radiusPoints.at(-1)?.y).toBeCloseTo(5)
    expect(massPoints.at(-1)?.y).toBeCloseTo(200)
  })

  it('rejects non-physical inputs', () => {
    expect(() => calculateCircularMotion(0, 5, 2)).toThrow()
    expect(() => calculateCircularMotion(1, -1, 2)).toThrow()
    expect(() => calculateCircularMotion(1, 5, 0)).toThrow()
    expect(() => calculateCircularMotion(1, 5, 2, -1)).toThrow()
  })
})
