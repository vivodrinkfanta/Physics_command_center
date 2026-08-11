import { describe, expect, it } from 'vitest'
import {
  calculatePotentialEnergy,
  potentialHeightGraphPoints,
  potentialMassGraphPoints,
} from './potentialEnergy'

describe('gravitational potential energy model', () => {
  it('calculates signed energy changes relative to a reference height', () => {
    expect(calculatePotentialEnergy(2, 9.81, 5)).toBeCloseTo(98.1)
    expect(calculatePotentialEnergy(2, 9.81, -5)).toBeCloseTo(-98.1)
  })

  it('builds linear height and mass relationships', () => {
    const heightPoints = potentialHeightGraphPoints(2, 10)
    const massPoints = potentialMassGraphPoints(5, 10)
    expect(heightPoints[0]).toEqual({ x: -10, y: -200 })
    expect(heightPoints.at(-1)).toEqual({ x: 20, y: 400 })
    expect(massPoints[0]).toEqual({ x: 1, y: 50 })
    expect(massPoints.at(-1)).toEqual({ x: 20, y: 1000 })
  })

  it('rejects invalid inputs', () => {
    expect(() => calculatePotentialEnergy(0, 9.81, 2)).toThrow('Mass must be greater than zero.')
    expect(() => calculatePotentialEnergy(2, 0, 2)).toThrow('Gravity must be greater than zero.')
    expect(() => potentialHeightGraphPoints(2, 9.81, 1)).toThrow('Graph requires two points.')
  })
})
