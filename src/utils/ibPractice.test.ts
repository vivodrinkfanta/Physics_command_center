import { describe, expect, it } from 'vitest'
import { ibPhysicsTopics } from '../data/ibPhysicsCurriculum'
import { ibPracticeQuestions } from '../data/ibPracticeQuestions'
import { mechanicsFormulas } from '../data/formulas'
import { createEmptyStudentProgress } from './studentProgress'
import { evaluateIbPracticeAnswer, filterIbPracticeQuestions } from './ibPractice'

describe('IB-aligned practice registry', () => {
  it('has unique identifiers and valid metadata', () => {
    const ids = ibPracticeQuestions.map((question) => question.id)
    const topicCodes = new Set(ibPhysicsTopics.map((topic) => topic.code))
    expect(new Set(ids).size).toBe(ids.length)
    expect(ibPracticeQuestions.every((question) => topicCodes.has(question.topicCode))).toBe(true)
    expect(ibPracticeQuestions.every((question) => question.hints.length > 0 && question.marks > 0 && question.markscheme.length > 0)).toBe(true)
    const formulaIds = new Set(mechanicsFormulas.map((formula) => formula.id))
    expect(ibPracticeQuestions.every((question) => question.formulaIds.every((id) => formulaIds.has(id)))).toBe(true)
    expect(ibPracticeQuestions.every((question) => !question.simulationHref || question.simulationHref.startsWith('/formulas/'))).toBe(true)
  })

  it('implements every visible assessment-style evaluator', () => {
    expect(new Set(ibPracticeQuestions.map((question) => question.style))).toEqual(
      new Set(['paper-1a', 'paper-1b', 'paper-2-short', 'paper-2-extended', 'numerical']),
    )
    const choice = ibPracticeQuestions.find((question) => question.id === 'a1-velocity-area')!
    const numeric = ibPracticeQuestions.find((question) => question.id === 'a1-trolley-data')!
    const text = ibPracticeQuestions.find((question) => question.id === 'a2-falling-model')!
    expect(evaluateIbPracticeAnswer(choice, 'b').correct).toBe(true)
    expect(evaluateIbPracticeAnswer(numeric, '2.01').correct).toBe(true)
    expect(evaluateIbPracticeAnswer(text, 'Weight and inertia both double, so both have the same acceleration g.').score).toBe(3)
  })

  it('filters by topic, level, style, difficulty, status, and search', () => {
    const progress = createEmptyStudentProgress()
    const results = filterIbPracticeQuestions({
      query: 'collision', topicCode: 'A.2', level: 'sl', style: 'numerical', difficulty: 'standard', status: 'unanswered',
    }, progress)
    expect(results.map((question) => question.id)).toEqual(['a2-inelastic-collision'])
  })
})
