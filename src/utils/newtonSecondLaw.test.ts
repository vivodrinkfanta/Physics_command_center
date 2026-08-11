import { describe, expect, it } from 'vitest'
import {
  calculateAcceleration,
  calculateMotion,
  forceGraphPoints,
  massGraphPoints,
  motionSeries,
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

  it('builds synchronized signed motion histories over the shared time domain', () => {
    const positive = motionSeries(20, 5, 4, 5)
    const negative = motionSeries(-20, 5, 4, 5)

    expect(positive[0]).toEqual({ acceleration: 4, position: 0, time: 0, velocity: 0 })
    expect(positive.at(-1)).toEqual({ acceleration: 4, position: 32, time: 4, velocity: 16 })
    expect(negative.at(-1)).toEqual({ acceleration: -4, position: -32, time: 4, velocity: -16 })
  })

  it('rejects invalid motion history requests', () => {
    expect(() => motionSeries(20, 5, -1)).toThrow('Duration must be a non-negative finite number.')
    expect(() => motionSeries(20, 5, 4, 1)).toThrow('Motion series requires at least two points.')
  })
})
