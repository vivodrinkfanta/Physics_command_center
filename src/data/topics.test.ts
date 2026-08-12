import { describe, expect, it } from 'vitest'
import { getFormulaById, mechanicsFormulas } from './formulas'
import { findMechanicsTopic, mechanicsTopics } from './topics'

describe('mechanicsTopics', () => {
  it('contains the seven Mechanics areas from the product scope', () => {
    expect(mechanicsTopics).toHaveLength(7)
    expect(mechanicsTopics.map((topic) => topic.id)).toEqual([
      'kinematics',
      'forces',
      'energy',
      'momentum',
      'circular-motion',
      'projectiles',
      'oscillations',
    ])
  })

  it('keeps identifiers, aliases, and relationship targets valid', () => {
    const identifiers = mechanicsTopics.flatMap((topic) => [topic.id, ...topic.aliases])
    const knownTopicIds = new Set(mechanicsTopics.map((topic) => topic.id))

    expect(new Set(identifiers).size).toBe(identifiers.length)
    mechanicsTopics.forEach((topic) => {
      expect(topic.concepts.length).toBeGreaterThanOrEqual(4)
      expect(topic.formulaIds).toContain(topic.featuredFormulaId)
      topic.formulaIds.forEach((formulaId) => expect(getFormulaById(formulaId).id).toBe(formulaId))
      topic.connections.forEach((connection) => expect(knownTopicIds.has(connection)).toBe(true))
    })
  })

  it('maps every V1 formula into at least one topic area', () => {
    const mappedFormulaIds = new Set(mechanicsTopics.flatMap((topic) => topic.formulaIds))
    expect(mappedFormulaIds).toEqual(new Set(mechanicsFormulas.map((formula) => formula.id)))
  })

  it('supports homepage aliases while falling back safely', () => {
    expect(findMechanicsTopic('motion').id).toBe('kinematics')
    expect(findMechanicsTopic('centripetal').id).toBe('circular-motion')
    expect(findMechanicsTopic('unknown-topic').id).toBe('kinematics')
  })
})
