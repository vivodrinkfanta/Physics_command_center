import type { FormulaId, FormulaRecord } from '../../types/formula'
import { circularMotionFormulas } from './circular'
import { energyFormulas } from './energy'
import { expandedMechanicsFormulas } from './expandedMechanics'
import { forceFormulas } from './forces'
import { kinematicsFormulas } from './kinematics'
import { momentumFormulas } from './momentum'
import { oscillationFormulas } from './oscillations'

export interface FormulaRelationshipEdge {
  readonly from: FormulaId
  readonly to: FormulaId
}

export const mechanicsFormulas: readonly FormulaRecord[] = [
  ...kinematicsFormulas,
  ...forceFormulas,
  ...energyFormulas,
  ...momentumFormulas,
  ...circularMotionFormulas,
  ...oscillationFormulas,
  ...expandedMechanicsFormulas,
]

const formulaRegistry = new Map(mechanicsFormulas.map((formula) => [formula.id, formula]))
const formulaRelationshipEdges: readonly FormulaRelationshipEdge[] = (() => {
  const seen = new Set<string>()
  return mechanicsFormulas.flatMap((formula) =>
    formula.relatedFormulaIds.flatMap((relatedId) => {
      const ids = [formula.id, relatedId].sort() as [FormulaId, FormulaId]
      const key = ids.join(':')
      if (seen.has(key)) return []
      seen.add(key)
      return [{ from: ids[0], to: ids[1] }]
    }),
  )
})()

export function findFormulaById(formulaId: string | undefined) {
  if (!formulaId) return undefined
  return formulaRegistry.get(formulaId as FormulaId)
}

export function getFormulaById(formulaId: FormulaId) {
  const formula = findFormulaById(formulaId)
  if (!formula) throw new Error(`Unknown formula: ${formulaId}`)
  return formula
}

export function getFormulaRelationshipEdges() {
  return formulaRelationshipEdges
}

export function getRelatedFormulas(formulaId: FormulaId) {
  const connectedIds = new Set<FormulaId>()
  getFormulaRelationshipEdges().forEach((edge) => {
    if (edge.from === formulaId) connectedIds.add(edge.to)
    if (edge.to === formulaId) connectedIds.add(edge.from)
  })
  return mechanicsFormulas.filter((formula) => connectedIds.has(formula.id))
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
