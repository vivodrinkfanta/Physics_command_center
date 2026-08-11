import { describe, expect, it } from 'vitest'
import {
  calculateCollision,
  calculateMomentum,
  momentumMassGraphPoints,
  momentumVelocityGraphPoints,
} from './momentum'

describe('momentum and collision model', () => {
  it('calculates signed linear momentum', () => {
    expect(calculateMomentum(4, 6)).toBe(24)
    expect(calculateMomentum(4, -6)).toBe(-24)
  })

  it('conserves momentum and kinetic energy in an elastic collision', () => {
    const result = calculateCollision(2, 6, 3, -2, 1)
    expect(result.finalMomentum).toBeCloseTo(result.initialMomentum, 10)
    expect(result.finalKineticEnergy).toBeCloseTo(result.initialKineticEnergy, 10)
  })

  it('produces a common velocity in a perfectly inelastic collision', () => {
    const result = calculateCollision(2, 6, 3, -2, 0)
    expect(result.finalVelocity1).toBeCloseTo(result.finalVelocity2, 10)
    expect(result.finalMomentum).toBeCloseTo(result.initialMomentum, 10)
    expect(result.finalKineticEnergy).toBeLessThan(result.initialKineticEnergy)
  })

  it('builds both registered momentum relationships', () => {
    expect(momentumVelocityGraphPoints(2)[0]).toEqual({ x: -20, y: -40 })
    expect(momentumVelocityGraphPoints(2).at(-1)).toEqual({ x: 20, y: 40 })
    expect(momentumMassGraphPoints(-3)[0]).toEqual({ x: 1, y: -3 })
    expect(momentumMassGraphPoints(-3).at(-1)).toEqual({ x: 10, y: -30 })
  })

  it('rejects invalid physical inputs', () => {
    expect(() => calculateMomentum(0, 4)).toThrow('Mass must be greater than zero.')
    expect(() => calculateCollision(1, 2, 1, -2, 1.2)).toThrow(
      'Restitution must be between zero and one.',
    )
    expect(() => momentumVelocityGraphPoints(2, 1)).toThrow('Graph requires two points.')
  })
})
