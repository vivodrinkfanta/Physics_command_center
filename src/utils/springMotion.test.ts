import { describe, expect, it } from 'vitest'
import {
  calculateSpringMotion,
  springEnergyDisplacementPoints,
  springForceDisplacementPoints,
  springPositionTimePoints,
} from './springMotion'

describe('ideal mass-spring calculations', () => {
  it('starts at the release displacement with a restoring force', () => {
    const sample = calculateSpringMotion(50, 2, 0.2, 0)
    expect(sample.displacement).toBeCloseTo(0.2)
    expect(sample.elasticEnergy).toBeCloseTo(1)
    expect(sample.force).toBeCloseTo(-10)
    expect(sample.kineticEnergy).toBeCloseTo(0)
    expect(sample.totalEnergy).toBeCloseTo(1)
    expect(sample.velocity).toBeCloseTo(0)
  })

  it('conserves mechanical energy throughout the ideal oscillation', () => {
    for (const time of [0, 0.15, 0.4, 0.9, 1.7]) {
      const sample = calculateSpringMotion(80, 4, -0.3, time)
      expect(sample.elasticEnergy + sample.kineticEnergy).toBeCloseTo(sample.totalEnergy, 10)
    }
  })

  it('keeps both energy stores at zero when released from equilibrium', () => {
    expect(calculateSpringMotion(80, 4, 0, 2)).toMatchObject({
      elasticEnergy: 0,
      kineticEnergy: 0,
      totalEnergy: 0,
    })
  })

  it('slows when mass increases and speeds up when stiffness increases', () => {
    const baseline = calculateSpringMotion(40, 2, 0.2, 0)
    expect(calculateSpringMotion(40, 8, 0.2, 0).period).toBeCloseTo(baseline.period * 2)
    expect(calculateSpringMotion(160, 2, 0.2, 0).period).toBeCloseTo(baseline.period / 2)
  })

  it('builds synchronized position, restoring-force, and elastic-energy relationships', () => {
    const position = springPositionTimePoints(50, 2, 0.2)
    const force = springForceDisplacementPoints(50)
    const energy = springEnergyDisplacementPoints(50)
    expect(position[0].y).toBeCloseTo(0.2)
    expect(force[0].y).toBeGreaterThan(0)
    expect(force.at(-1)?.y).toBeLessThan(0)
    expect(energy[0].y).toBeCloseTo(energy.at(-1)?.y ?? 0)
  })

  it('rejects non-physical inputs', () => {
    expect(() => calculateSpringMotion(0, 1, 0.2, 0)).toThrow()
    expect(() => calculateSpringMotion(10, 0, 0.2, 0)).toThrow()
    expect(() => calculateSpringMotion(10, 1, 0.2, -1)).toThrow()
  })
})
