import type { FormulaId, FormulaRecord } from '../../types/formula'
import { circularMotionFormulas } from './circular'
import { energyFormulas } from './energy'
import { forceFormulas } from './forces'
import { kinematicsFormulas } from './kinematics'
import { momentumFormulas } from './momentum'
import { oscillationFormulas } from './oscillations'

export const mechanicsFormulas: FormulaRecord[] = [
  ...kinematicsFormulas,
  ...forceFormulas,
  ...energyFormulas,
  ...momentumFormulas,
  ...circularMotionFormulas,
  ...oscillationFormulas,
]

const formulaRegistry = new Map(mechanicsFormulas.map((formula) => [formula.id, formula]))

export function getFormulaById(formulaId: FormulaId) {
  const formula = formulaRegistry.get(formulaId)
  if (!formula) throw new Error(`Unknown formula: ${formulaId}`)
  return formula
}

export function searchFormulas(query: string) {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) return mechanicsFormulas

  const ignoredTerms = new Set(['and', 'connecting', 'formula', 'the', 'to', 'with'])
  const queryTerms = normalizedQuery
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .split(/\s+/)
    .filter((term) => term.length > 1 && !ignoredTerms.has(term))

  return mechanicsFormulas
    .map((formula) => {
      const searchableFields = [
        formula.name,
        formula.subtopic,
        formula.expression.plainText,
        formula.description,
        ...formula.tags,
      ].map((value) => value.toLowerCase())
      const exactScore = searchableFields.reduce((total, value, index) => {
        if (value === normalizedQuery) return total + (index < 3 ? 10 : 6)
        if (value.startsWith(normalizedQuery)) return total + (index < 3 ? 6 : 3)
        if (value.includes(normalizedQuery)) return total + 2
        return total
      }, 0)
      const termScore = queryTerms.reduce(
        (total, term) =>
          total +
          searchableFields.reduce((fieldTotal, value, index) => {
            if (value === term) return fieldTotal + (index < 3 ? 5 : 3)
            if (value.includes(term)) return fieldTotal + 1
            return fieldTotal
          }, 0),
        0,
      )
      const score = exactScore + termScore

      return { formula, score }
    })
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score || left.formula.name.localeCompare(right.formula.name))
    .map(({ formula }) => formula)
}
