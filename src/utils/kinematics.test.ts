import { describe, expect, it } from 'vitest'
import { calculateKinematics, kinematicsSeries } from './kinematics'

describe('constant-acceleration kinematics', () => {
  it('keeps position and velocity synchronized', () => {
    expect(calculateKinematics(3, 2, 4)).toEqual({
      acceleration: 2,
      position: 28,
      time: 4,
      velocity: 11,
    })
  })

  it('supports signed motion and turning points', () => {
    const turningPoint = calculateKinematics(10, -2, 5)
    expect(turningPoint.velocity).toBe(0)
    expect(turningPoint.position).toBe(25)
    expect(calculateKinematics(10, -2, 8).velocity).toBe(-6)
  })

  it('generates aligned position, velocity, and acceleration histories', () => {
    const series = kinematicsSeries(0, 2, 10, 6)
    expect(series[0]).toEqual({ acceleration: 2, position: 0, time: 0, velocity: 0 })
    expect(series.at(-1)).toEqual({ acceleration: 2, position: 100, time: 10, velocity: 20 })
  })

  it('rejects invalid inputs', () => {
    expect(() => calculateKinematics(0, 2, -1)).toThrow('Time must be non-negative.')
    expect(() => calculateKinematics(Number.NaN, 2, 1)).toThrow(
      'Initial velocity must be finite.',
    )
    expect(() => kinematicsSeries(0, 2, 0)).toThrow('Duration must be positive.')
    expect(() => kinematicsSeries(0, 2, 10, 1)).toThrow(
      'Kinematics series requires at least two points.',
    )
  })
})
