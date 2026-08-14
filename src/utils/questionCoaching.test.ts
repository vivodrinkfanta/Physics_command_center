import { describe, expect, it } from 'vitest'
import { ibPracticeQuestions } from '../data/ibPracticeQuestions'
import { buildQuestionCoaching } from './questionCoaching'

describe('question coaching', () => {
  it('decodes numerical data questions without revealing the answer', () => {
    const question = ibPracticeQuestions.find((item) => item.id === 'a1-trolley-data')!
    const coaching = buildQuestionCoaching(question)
    expect(coaching.commandTerm).toBe('Calculate')
    expect(coaching.notices.join(' ')).toMatch(/data label|unit/i)
    expect(coaching.steps.map((step) => step.label)).toEqual(['Decode', 'Extract', 'Model', 'Execute', 'Check'])
    expect(JSON.stringify(coaching)).not.toContain(question.markscheme[0])
  })

  it('teaches prediction and elimination for multiple choice', () => {
    const question = ibPracticeQuestions.find((item) => item.id === 'a1-velocity-area')!
    const coaching = buildQuestionCoaching(question)
    expect(coaching.commandTerm).toBe('Select')
    expect(coaching.notices.join(' ')).toMatch(/predict/i)
    expect(coaching.steps.find((step) => step.label === 'Execute')?.instruction).toMatch(/eliminate/i)
  })

  it('teaches evidence and mark coverage for evaluation', () => {
    const question = ibPracticeQuestions.find((item) => item.id === 'a2-falling-model')!
    const coaching = buildQuestionCoaching(question)
    expect(coaching.commandTerm).toBe('Evaluate')
    expect(coaching.notices.join(' ')).toMatch(/marks|evidence/i)
  })

  it('provides complete coaching for every registered question', () => {
    for (const question of ibPracticeQuestions) {
      const coaching = buildQuestionCoaching(question)
      expect(coaching.commandTerm.length).toBeGreaterThan(0)
      expect(coaching.commandMeaning.length).toBeGreaterThan(0)
      expect(coaching.notices.length).toBeGreaterThan(0)
      expect(coaching.steps).toHaveLength(5)
      expect(coaching.steps.every((step) => step.label.length > 0 && step.instruction.length > 0)).toBe(true)
    }
  })
})
