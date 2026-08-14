import { describe, expect, it } from 'vitest'
import { ibPhysicsTopics } from '../data/ibPhysicsCurriculum'
import { ibPracticeQuestions } from '../data/ibPracticeQuestions'
import { mechanicsFormulas } from '../data/formulas'
import { curriculumRelationshipById } from '../data/curriculumRelationships'
import { createEmptyStudentProgress } from './studentProgress'
import { evaluateIbPracticeAnswer, filterIbPracticeQuestions, practiceSkillLabels } from './ibPractice'

describe('IB-aligned practice registry', () => {
  it('has unique identifiers and valid metadata', () => {
    const ids = ibPracticeQuestions.map((question) => question.id)
    const topicCodes = new Set(ibPhysicsTopics.map((topic) => topic.code))
    expect(new Set(ids).size).toBe(ids.length)
    expect(ibPracticeQuestions.every((question) => topicCodes.has(question.topicCode))).toBe(true)
    expect(ibPracticeQuestions.every((question) => question.hints.length > 0 && question.marks > 0 && question.markscheme.length > 0)).toBe(true)
    const formulaIds = new Set(mechanicsFormulas.map((formula) => formula.id))
    expect(ibPracticeQuestions.every((question) => question.formulaIds.every((id) => formulaIds.has(id)))).toBe(true)
    expect(ibPracticeQuestions.every((question) => (question.relationshipIds ?? []).every((id) => curriculumRelationshipById.has(id)))).toBe(true)
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

  it('keeps every generated answer specification internally consistent', () => {
    for (const question of ibPracticeQuestions) {
      if (question.answer.kind === 'choice') {
        const choiceIds = question.choices?.map((choice) => choice.id) ?? []
        const choiceLabels = question.choices?.map((choice) => choice.label) ?? []
        expect(choiceIds).toHaveLength(4)
        expect(new Set(choiceIds).size).toBe(choiceIds.length)
        expect(new Set(choiceLabels).size).toBe(choiceLabels.length)
        expect(choiceIds).toContain(question.answer.correctChoiceId)
      }
      if (question.answer.kind === 'text') {
        expect(question.answer.requiredGroups).toHaveLength(question.marks)
        expect(question.answer.requiredGroups.every((group) => group.length > 0)).toBe(true)
      }
      if (question.answer.kind === 'numeric') {
        expect(Number.isFinite(question.answer.expected)).toBe(true)
        expect(question.answer.tolerance).toBeGreaterThanOrEqual(0)
      }
      expect((question.relationshipIds ?? []).every((id) => curriculumRelationshipById.get(id)?.topicCode === question.topicCode)).toBe(true)
      expect(question.skillFocus.length).toBeGreaterThan(0)
      expect(new Set(question.skillFocus).size).toBe(question.skillFocus.length)
    }
  })

  it('scores the registered answer specification for every question', () => {
    for (const question of ibPracticeQuestions) {
      if (question.answer.kind === 'choice') {
        const correctChoiceId = question.answer.correctChoiceId
        expect(evaluateIbPracticeAnswer(question, correctChoiceId)).toEqual(expect.objectContaining({ correct: true, score: question.marks }))
        const wrongChoice = question.choices?.find((choice) => choice.id !== correctChoiceId)
        expect(evaluateIbPracticeAnswer(question, wrongChoice?.id ?? '')).toEqual(expect.objectContaining({ correct: false, score: 0 }))
      }
      if (question.answer.kind === 'numeric') {
        expect(evaluateIbPracticeAnswer(question, String(question.answer.expected))).toEqual(expect.objectContaining({ correct: true, score: question.marks }))
        const miss = question.answer.expected + Math.max(question.answer.tolerance * 2, Math.abs(question.answer.expected) * 0.1, 1)
        expect(evaluateIbPracticeAnswer(question, String(miss))).toEqual(expect.objectContaining({ correct: false, score: 0 }))
      }
      if (question.answer.kind === 'text') {
        const completeResponse = question.answer.requiredGroups.map((group) => group[0]).join('. ')
        expect(evaluateIbPracticeAnswer(question, completeResponse)).toEqual(expect.objectContaining({ correct: true, score: question.marks }))
      }
    }
  })

  it('covers and filters every promised physics skill', () => {
    const progress = createEmptyStudentProgress()
    const representedSkills = new Set(ibPracticeQuestions.flatMap((question) => question.skillFocus))
    expect(representedSkills).toEqual(new Set(Object.keys(practiceSkillLabels)))
    for (const skill of representedSkills) {
      const results = filterIbPracticeQuestions({
        query: '', topicCode: 'all', level: 'all', style: 'all', difficulty: 'all', skill, status: 'all',
      }, progress)
      expect(results.length).toBeGreaterThan(0)
      expect(results.every((question) => question.skillFocus.includes(skill))).toBe(true)
    }
  })

  it('filters by topic, level, style, difficulty, status, and search', () => {
    const progress = createEmptyStudentProgress()
    const results = filterIbPracticeQuestions({
      query: 'collision', topicCode: 'A.2', level: 'sl', style: 'numerical', difficulty: 'standard', skill: 'multistep', status: 'unanswered',
    }, progress)
    expect(results.map((question) => question.id)).toEqual(['a2-inelastic-collision'])
  })
})
