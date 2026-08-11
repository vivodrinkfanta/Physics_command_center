import { describe, expect, it } from 'vitest'
import { mechanicsFormulas } from '../data/formulas'
import {
  generatePracticeProblem,
  isPracticeAnswerCorrect,
} from './practice'

describe('formula practice generator', () => {
  it('generates finite, fully substituted problems for every registered formula', () => {
    mechanicsFormulas.forEach((formula) => {
      for (let variant = 0; variant < 5; variant += 1) {
        const problem = generatePracticeProblem(formula, variant)

        expect(Number.isFinite(problem.expectedAnswer), formula.id).toBe(true)
        expect(problem.prompt, formula.id).not.toMatch(/[{}]/)
        expect(problem.substitution, formula.id).not.toMatch(/[{}]/)
        expect(problem.knownValues.length, formula.id).toBeGreaterThan(0)
        expect(problem.answerUnit, formula.id).not.toBe('')
      }
    })
  })

  it('keeps generated values inside their registered ranges', () => {
    mechanicsFormulas.forEach((formula) => {
      const problem = generatePracticeProblem(formula, 6)
      const template = formula.practiceTemplates[0]

      template.variableRanges.forEach((range) => {
        const generated = problem.knownValues.find(
          (value) => value.variableId === range.variableId,
        )
        expect(generated?.value).toBeGreaterThanOrEqual(range.min)
        expect(generated?.value).toBeLessThanOrEqual(range.max)
      })
    })
  })

  it('checks answers with a small scale-aware numerical tolerance', () => {
    expect(isPracticeAnswerCorrect(4, 4)).toBe(true)
    expect(isPracticeAnswerCorrect(100.4, 100)).toBe(true)
    expect(isPracticeAnswerCorrect(101, 100)).toBe(false)
    expect(isPracticeAnswerCorrect(Number.NaN, 4)).toBe(false)
  })
})
