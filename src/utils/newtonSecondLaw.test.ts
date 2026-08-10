import { describe, expect, it } from 'vitest'
import {
  calculateAcceleration,
  calculateMotion,
  forceGraphPoints,
  massGraphPoints,
} from './newtonSecondLaw'

describe('Newton’s Second Law model', () => {
  it('calculates acceleration from resultant force and mass', () => {
    expect(calculateAcceleration(20, 5)).toBe(4)
    expect(calculateAcceleration(-12, 4)).toBe(-3)
    expect(calculateAcceleration(0, 8)).toBe(0)
  })

  it('rejects non-physical mass values', () => {
    expect(() => calculateAcceleration(10, 0)).toThrow('Mass must be greater than zero.')
    expect(() => calculateAcceleration(10, -2)).toThrow('Mass must be greater than zero.')
  })

  it('keeps position and velocity synchronized for constant acceleration', () => {
    expect(calculateMotion(20, 5, 3)).toEqual({
      acceleration: 4,
      position: 18,
      velocity: 12,
    })
  })

  it('builds the expected direct and inverse graph relationships', () => {
    const forcePoints = forceGraphPoints(5)
    const massPoints = massGraphPoints(20)

    expect(forcePoints[0].y).toBe(-12)
    expect(forcePoints.at(-1)?.y).toBe(12)
    expect(massPoints[0].y).toBe(20)
    expect(massPoints.at(-1)?.y).toBe(1)
  })
})
