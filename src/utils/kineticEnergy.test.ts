import { describe, expect, it } from 'vitest'
import {
  calculateKineticEnergy,
  calculateUniformMotion,
  kineticEnergyMassGraphPoints,
  kineticEnergySpeedGraphPoints,
} from './kineticEnergy'

describe('Kinetic energy model', () => {
  it('calculates translational kinetic energy', () => {
    expect(calculateKineticEnergy(5, 8)).toBe(160)
    expect(calculateKineticEnergy(4, 0)).toBe(0)
  })

  it('preserves the linear mass and quadratic speed relationships', () => {
    const baseline = calculateKineticEnergy(4, 6)
    expect(calculateKineticEnergy(8, 6)).toBe(baseline * 2)
    expect(calculateKineticEnergy(4, 12)).toBe(baseline * 4)
  })

  it('keeps constant-speed playback synchronized', () => {
    expect(calculateUniformMotion(8, 2.5)).toEqual({ displacement: 20, speed: 8 })
  })

  it('builds the expected quadratic and linear graph domains', () => {
    const speedPoints = kineticEnergySpeedGraphPoints(4)
    const massPoints = kineticEnergyMassGraphPoints(8)

    expect(speedPoints[0]).toEqual({ x: 0, y: 0 })
    expect(speedPoints.at(-1)).toEqual({ x: 15, y: 450 })
    expect(massPoints[0]).toEqual({ x: 1, y: 32 })
    expect(massPoints.at(-1)).toEqual({ x: 10, y: 320 })
  })

  it('rejects non-physical input and invalid graph requests', () => {
    expect(() => calculateKineticEnergy(0, 5)).toThrow('Mass must be greater than zero.')
    expect(() => calculateKineticEnergy(2, -1)).toThrow(
      'Speed must be a non-negative finite number.',
    )
    expect(() => calculateUniformMotion(2, -1)).toThrow(
      'Time must be a non-negative finite number.',
    )
    expect(() => kineticEnergySpeedGraphPoints(4, 1)).toThrow(
      'Speed graph requires at least two points.',
    )
    expect(() => kineticEnergyMassGraphPoints(8, 1)).toThrow(
      'Mass graph requires at least two points.',
    )
  })
})
