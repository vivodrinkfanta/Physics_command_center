import { describe, expect, it } from 'vitest'
import { mechanicsFormulas } from '../data/formulas'
import {
  calculateExpandedFormula,
  createFormulaInputStates,
  expandedFormulaIds,
  expandedGraphPoints,
} from './expandedMechanics'

describe('expanded mechanics calculations', () => {
  it('calculates the five remaining kinematics relationships', () => {
    expect(calculateExpandedFormula('average-speed', { distance: 120, time: 15 })).toBe(8)
    expect(calculateExpandedFormula('average-acceleration', { 'change-velocity': -18, time: 6 })).toBe(-3)
    expect(calculateExpandedFormula('constant-acceleration-displacement', { 'initial-velocity': 2, acceleration: 3, time: 4 })).toBe(32)
    expect(calculateExpandedFormula('velocity-displacement', { 'initial-velocity': 5, acceleration: 2, displacement: 30 })).toBeCloseTo(Math.sqrt(145))
    expect(calculateExpandedFormula('mean-velocity-displacement', { 'initial-velocity': 4, 'final-velocity': 12, time: 5 })).toBe(40)
  })

  it('calculates force, energy-transfer, and impulse relationships', () => {
    expect(calculateExpandedFormula('weight', { mass: 12, 'gravitational-field-strength': 9.81 })).toBeCloseTo(117.72)
    expect(calculateExpandedFormula('friction-force', { 'friction-coefficient': 0.4, 'normal-force': 150 })).toBe(60)
    expect(calculateExpandedFormula('work', { 'applied-force': 40, displacement: 6, 'force-angle': Math.PI / 3 })).toBeCloseTo(120)
    expect(calculateExpandedFormula('power', { work: 1800, time: 15 })).toBe(120)
    expect(calculateExpandedFormula('mechanical-energy-conservation', { 'final-mechanical-energy': 750, 'energy-dissipated': 250 })).toBe(1000)
    expect(calculateExpandedFormula('impulse', { 'resultant-force': -120, time: 0.25 })).toBe(-30)
  })

  it('marks impossible velocity-displacement states instead of inventing a speed', () => {
    expect(calculateExpandedFormula('velocity-displacement', { 'initial-velocity': 2, acceleration: -5, displacement: 20 })).toBeNaN()
  })

  it('derives input defaults from central registry controls', () => {
    const states = createFormulaInputStates(mechanicsFormulas)
    expect(states['average-speed']?.distance).toBe(100)
    expect(states['friction-force']?.['friction-coefficient']).toBe(0.35)
    expect(states['mechanical-energy-conservation']?.['energy-dissipated']).toBe(300)
    mechanicsFormulas.forEach((formula) =>
      formula.variables.forEach((reference) => {
        const state = states[formula.id] ?? {}
        if (!reference.control || state[reference.id] === undefined) return
        expect(state[reference.id], `${formula.id}: ${reference.id}`).toBeGreaterThanOrEqual(
          reference.control.min,
        )
        expect(state[reference.id], `${formula.id}: ${reference.id}`).toBeLessThanOrEqual(
          reference.control.max,
        )
      }),
    )
  })

  it('builds live relationship points and removes non-real states', () => {
    const points = expandedGraphPoints('work', { 'applied-force': 10, displacement: 5, 'force-angle': 0 }, 'force-angle', 0, Math.PI)
    expect(points[0].y).toBeCloseTo(50)
    expect(points.at(-1)?.y).toBeCloseTo(-50)
    const velocityPoints = expandedGraphPoints('velocity-displacement', { 'initial-velocity': 2, acceleration: -1, displacement: 0 }, 'displacement', 0, 10)
    expect(velocityPoints.length).toBeLessThan(61)
  })

  it('keeps every shared workbench graph linked to a registered input control', () => {
    expandedFormulaIds.forEach((formulaId) => {
      const formula = mechanicsFormulas.find((candidate) => candidate.id === formulaId)
      const controlledInputs = formula?.variables.filter((variable) => variable.control) ?? []
      expect(formula?.graphTypes, formulaId).toHaveLength(controlledInputs.length)
    })
  })
})
