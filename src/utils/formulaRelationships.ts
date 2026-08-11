import type { FormulaRelationshipEdge } from '../data/formulas'
import type { FormulaId, FormulaRecord } from '../types/formula'

export interface FormulaRelationshipPosition {
  formulaId: FormulaId
  x: number
  y: number
}

export interface FormulaRelationshipLayout {
  height: number
  positions: FormulaRelationshipPosition[]
  width: number
}

const COLUMN_WIDTH = 260
const MINIMUM_HEIGHT = 420
const ROW_HEIGHT = 120

export function createFormulaRelationshipLayout(
  formulas: readonly FormulaRecord[],
  edges: readonly FormulaRelationshipEdge[],
): FormulaRelationshipLayout {
  if (formulas.length === 0) {
    return { height: MINIMUM_HEIGHT, positions: [], width: COLUMN_WIDTH }
  }

  const neighbors = new Map<FormulaId, Set<FormulaId>>(
    formulas.map((formula) => [formula.id, new Set<FormulaId>()]),
  )
  edges.forEach(({ from, to }) => {
    neighbors.get(from)?.add(to)
    neighbors.get(to)?.add(from)
  })

  const root = formulas.reduce((best, formula) =>
    (neighbors.get(formula.id)?.size ?? 0) > (neighbors.get(best.id)?.size ?? 0)
      ? formula
      : best,
  )
  const levels = new Map<FormulaId, number>([[root.id, 0]])
  const queue: FormulaId[] = [root.id]

  while (queue.length > 0) {
    const current = queue.shift()
    if (!current) continue
    const nextLevel = (levels.get(current) ?? 0) + 1
    neighbors.get(current)?.forEach((neighbor) => {
      if (levels.has(neighbor)) return
      levels.set(neighbor, nextLevel)
      queue.push(neighbor)
    })
  }

  const furthestLevel = Math.max(...levels.values(), 0)
  formulas.forEach((formula) => {
    if (!levels.has(formula.id)) levels.set(formula.id, furthestLevel + 1)
  })

  const levelGroups = Array.from({ length: Math.max(...levels.values()) + 1 }, () => [] as FormulaId[])
  formulas.forEach((formula) => levelGroups[levels.get(formula.id) ?? 0].push(formula.id))
  const height = Math.max(
    MINIMUM_HEIGHT,
    Math.max(...levelGroups.map((group) => group.length)) * ROW_HEIGHT + ROW_HEIGHT,
  )

  return {
    height,
    positions: levelGroups.flatMap((group, levelIndex) =>
      group.map((formulaId, rowIndex) => ({
        formulaId,
        x: COLUMN_WIDTH / 2 + levelIndex * COLUMN_WIDTH,
        y: ((rowIndex + 1) * height) / (group.length + 1),
      })),
    ),
    width: Math.max(COLUMN_WIDTH, levelGroups.length * COLUMN_WIDTH),
  }
}
