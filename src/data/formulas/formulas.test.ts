import { describe, expect, it } from 'vitest'
import type { FormulaExpression, PhysicsVariableId } from '../../types/formula'
import { variableCatalog } from '../variables'
import { getFormulaById, mechanicsFormulas, searchFormulas } from './index'

const expressionVariableIds = (expression: FormulaExpression) =>
  expression.tokens
    .map((token) => token.variableId)
    .filter((variableId): variableId is PhysicsVariableId => Boolean(variableId))

describe('formula data architecture', () => {
  it('registers one complete benchmark formula for every mechanics topic plus GPE', () => {
    expect(mechanicsFormulas).toHaveLength(8)
    expect(new Set(mechanicsFormulas.map((formula) => formula.id)).size).toBe(mechanicsFormulas.length)
    expect(getFormulaById('newton-second-law').name).toBe('Newton’s Second Law')
  })

  it('keeps expression tokens and rearrangements linked to declared variables', () => {
    mechanicsFormulas.forEach((formula) => {
      const declaredVariables = new Set(formula.variables.map((variable) => variable.id))

      expressionVariableIds(formula.expression).forEach((variableId) =>
        expect(declaredVariables.has(variableId), `${formula.id}: ${variableId}`).toBe(true),
      )
      formula.rearrangements.forEach((rearrangement) => {
        expect(declaredVariables.has(rearrangement.solveFor)).toBe(true)
        expressionVariableIds(rearrangement.expression).forEach((variableId) =>
          expect(declaredVariables.has(variableId), `${formula.id}: ${variableId}`).toBe(true),
        )
      })
    })
  })

  it('resolves every variable and validates its SI conversion metadata', () => {
    mechanicsFormulas.forEach((formula) => {
      expect(new Set(formula.variables.map((variable) => variable.id)).size).toBe(
        formula.variables.length,
      )
      formula.variables.forEach((variableReference) => {
        const definition = variableCatalog[variableReference.id]
        expect(definition.siUnit.symbol.length).toBeGreaterThan(0)
        expect(definition.acceptedUnits.length).toBeGreaterThan(0)
        definition.acceptedUnits.forEach((acceptedUnit) =>
          expect(acceptedUnit.scaleToSI).toBeGreaterThan(0),
        )
        if (variableReference.control) {
          expect(variableReference.control.step).toBeGreaterThan(0)
          expect(variableReference.control.defaultValue).toBeGreaterThanOrEqual(
            variableReference.control.min,
          )
          expect(variableReference.control.defaultValue).toBeLessThanOrEqual(
            variableReference.control.max,
          )
        }
      })
    })
  })

  it('keeps relationships, examples, and practice templates internally valid', () => {
    const formulaIds = new Set(mechanicsFormulas.map((formula) => formula.id))

    mechanicsFormulas.forEach((formula) => {
      const variableIds = new Set(formula.variables.map((variable) => variable.id))
      formula.relatedFormulaIds.forEach((formulaId) => expect(formulaIds.has(formulaId)).toBe(true))
      formula.workedExamples.forEach((example) =>
        example.knownValues.forEach((value) => expect(variableIds.has(value.variableId)).toBe(true)),
      )
      formula.practiceTemplates.forEach((template) => {
        expect(variableIds.has(template.solveFor)).toBe(true)
        template.variableRanges.forEach((range) => expect(variableIds.has(range.variableId)).toBe(true))
      })
    })
  })

  it('supports exact, keyword, equation, and simple natural-language search', () => {
    expect(searchFormulas('kinetic energy')[0].id).toBe('kinetic-energy')
    expect(searchFormulas('ΣF = ma')[0].id).toBe('newton-second-law')
    expect(searchFormulas('centripetal')[0].id).toBe('centripetal-acceleration')
    expect(searchFormulas('formula connecting mass velocity and momentum')[0].id).toBe(
      'linear-momentum',
    )
    expect(searchFormulas('formula connecting mass, velocity, and momentum')[0].id).toBe(
      'linear-momentum',
    )
  })
})
