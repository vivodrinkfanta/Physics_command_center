import { describe, expect, it } from 'vitest'
import { mechanicsFormulas } from './formulas'
import { ibPhysicsThemes, ibPhysicsTopics } from './ibPhysicsCurriculum'
import { filterCurriculumTopics, getTopicsForTheme } from '../utils/curriculum'

describe('IB Physics curriculum registry', () => {
  it('contains unique official codes and valid theme relationships', () => {
    const codes = ibPhysicsTopics.map((topic) => topic.code)
    const themeCodes = new Set(ibPhysicsThemes.map((theme) => theme.code))
    expect(new Set(codes).size).toBe(codes.length)
    expect(codes).toHaveLength(24)
    expect(ibPhysicsTopics.every((topic) => themeCodes.has(topic.theme))).toBe(true)
  })

  it('uses only valid availability metadata and prerequisite codes', () => {
    const validAvailability = new Set(['shared', 'shared-hl-extension', 'hl-only'])
    const codes = new Set(ibPhysicsTopics.map((topic) => topic.code))
    expect(ibPhysicsTopics.every((topic) => validAvailability.has(topic.availability))).toBe(true)
    expect(ibPhysicsTopics.every((topic) => topic.prerequisites.every((code) => codes.has(code)))).toBe(true)
  })

  it('references existing formulas and valid application routes', () => {
    const formulaIds = new Set(mechanicsFormulas.map((formula) => formula.id))
    for (const topic of ibPhysicsTopics) {
      expect(topic.formulaIds.every((id) => formulaIds.has(id))).toBe(true)
      expect(topic.simulations.every((item) => item.href.startsWith('/formulas/'))).toBe(true)
      expect(topic.simulations.every((item) => !item.formulaId || formulaIds.has(item.formulaId))).toBe(true)
    }
  })

  it('never presents an empty topic as complete', () => {
    const complete = ibPhysicsTopics.filter((topic) => topic.coverage === 'complete')
    expect(complete.length).toBeGreaterThan(0)
    expect(complete.every((topic) => topic.formulaIds.length > 0 && topic.simulations.length > 0)).toBe(true)
    expect(ibPhysicsTopics.filter((topic) => topic.coverage === 'planned').every((topic) => !topic.practiceAvailable)).toBe(true)
  })

  it('filters SL, HL, and themes correctly', () => {
    expect(filterCurriculumTopics('sl').some((topic) => topic.code === 'A.4')).toBe(false)
    expect(filterCurriculumTopics('hl')).toHaveLength(24)
    expect(getTopicsForTheme('A', 'sl').map((topic) => topic.code)).toEqual(['A.1', 'A.2', 'A.3'])
  })
})
