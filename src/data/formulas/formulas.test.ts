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
    expect(mechanicsFormulas).toHaveLength(21)
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
        expect(rearrangement.operation.length).toBeGreaterThan(12)
        expressionVariableIds(rearrangement.expression).forEach((variableId) =>
          expect(declaredVariables.has(variableId), `${formula.id}: ${variableId}`).toBe(true),
        )
      })

      const referenceVariable = formula.variables.find((variable) => variable.role === 'output')
      expect(referenceVariable, `${formula.id}: reference output`).toBeDefined()
      const solvableVariables = new Set([
        referenceVariable?.id,
        ...formula.rearrangements.map((rearrangement) => rearrangement.solveFor),
      ])
      expect(solvableVariables, `${formula.id}: every variable has an algebraic form`).toEqual(
        declaredVariables,
      )
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
        expect(definition.acceptedUnits[0].symbol).toBe(definition.siUnit.symbol)
        expect(definition.acceptedUnits[0].dimension).toBe(definition.siUnit.dimension)
        definition.acceptedUnits.forEach((acceptedUnit) =>
          expect(acceptedUnit.scaleToSI).toBeGreaterThan(0),
        )
        definition.acceptedUnits.forEach((acceptedUnit) =>
          expect(acceptedUnit.dimension).toBe(definition.siUnit.dimension),
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

  it('provides a complete and consistent dimensional trace for every formula', () => {
    mechanicsFormulas.forEach((formula) => {
      const analysis = formula.dimensionalAnalysis
      expect(analysis.siSubstitution, `${formula.id}: SI substitution`).toContain('=')
      expect(analysis.baseSubstitution, `${formula.id}: base substitution`).toContain('=')
      expect(analysis.leftDimensions.length).toBeGreaterThan(0)
      expect(analysis.rightDimensions).toBe(analysis.leftDimensions)
    })
  })

  it('publishes concise model assumptions and student-error guardrails for every formula', () => {
    mechanicsFormulas.forEach((formula) => {
      expect(formula.assumptions.length, `${formula.id}: assumptions`).toBeGreaterThanOrEqual(2)
      expect(formula.commonMistakes.length, `${formula.id}: common mistakes`).toBeGreaterThanOrEqual(3)
      expect(new Set(formula.assumptions).size).toBe(formula.assumptions.length)
      expect(new Set(formula.commonMistakes).size).toBe(formula.commonMistakes.length)
      formula.assumptions.forEach((assumption) => expect(assumption.length).toBeLessThan(120))
      formula.commonMistakes.forEach((mistake) => expect(mistake.length).toBeLessThan(140))
    })
  })

  it('registers a simulation and at least one live graph for every V1 formula', () => {
    mechanicsFormulas.forEach((formula) => {
      expect(formula.simulationType, `${formula.id}: simulation`).not.toBeNull()
      expect(formula.graphTypes.length, `${formula.id}: graphs`).toBeGreaterThan(0)
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
        const placeholders = new Set<string>()
        template.variableRanges.forEach((range) => {
          expect(variableIds.has(range.variableId)).toBe(true)
          expect(placeholders.has(range.placeholder)).toBe(false)
          placeholders.add(range.placeholder)
          expect(template.promptTemplate).toContain(`{${range.placeholder}}`)
          expect(template.substitutionTemplate).toContain(`{${range.placeholder}}`)
        })
      })
      formula.constants.forEach((constant) => {
        const definition = variableCatalog[constant.variableId]
        expect(variableIds.has(constant.variableId)).toBe(true)
        expect(Number.isFinite(constant.value)).toBe(true)
        expect(constant.unit).toBe(definition.siUnit.symbol)
      })
      formula.predictionChallenges?.forEach((challenge) => {
        expect(challenge.options.some((option) => option.id === challenge.correctOptionId)).toBe(true)
        expect(new Set(challenge.options.map((option) => option.id)).size).toBe(
          challenge.options.length,
        )
        for (const predictionValue of [...challenge.beforeValues, ...challenge.afterValues]) {
          expect(variableIds.has(predictionValue.variableId)).toBe(true)
          expect(Number.isFinite(predictionValue.value)).toBe(true)
        }
      })
    })
  })

  it('keeps Newton prediction answers consistent with the registered parameter changes', () => {
    const predictions = getFormulaById('newton-second-law').predictionChallenges ?? []
    const valueFor = (
      values: (typeof predictions)[number]['beforeValues'],
      variableId: PhysicsVariableId,
    ) => values.find((value) => value.variableId === variableId)?.value ?? 0

    predictions.forEach((challenge) => {
      const beforeAcceleration =
        valueFor(challenge.beforeValues, 'resultant-force') /
        valueFor(challenge.beforeValues, 'mass')
      const afterAcceleration =
        valueFor(challenge.afterValues, 'resultant-force') /
        valueFor(challenge.afterValues, 'mass')
      const expectedOutcome =
        afterAcceleration === -beforeAcceleration
          ? 'reverses'
          : afterAcceleration === beforeAcceleration * 2
            ? 'doubles'
            : afterAcceleration === beforeAcceleration / 2
              ? 'halves'
              : 'unchanged'

      expect(challenge.correctOptionId, challenge.id).toBe(expectedOutcome)
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
