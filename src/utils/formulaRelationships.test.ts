import { describe, expect, it } from 'vitest'
import {
  getFormulaRelationshipEdges,
  getRelatedFormulas,
  mechanicsFormulas,
} from '../data/formulas'
import { createFormulaRelationshipLayout } from './formulaRelationships'

describe('formula relationship architecture', () => {
  it('deduplicates reciprocal connections and includes inbound relationships', () => {
    const edges = getFormulaRelationshipEdges()
    const keys = edges.map(({ from, to }) => [from, to].sort().join(':'))

    expect(new Set(keys).size).toBe(keys.length)
    expect(getRelatedFormulas('kinetic-energy').map(({ id }) => id)).toContain('hookes-law')
  })

  it('derives one stable map position for every registered formula', () => {
    const layout = createFormulaRelationshipLayout(
      mechanicsFormulas,
      getFormulaRelationshipEdges(),
    )
    const positionIds = layout.positions.map(({ formulaId }) => formulaId)

    expect(new Set(positionIds).size).toBe(mechanicsFormulas.length)
    expect(positionIds).toHaveLength(mechanicsFormulas.length)
    expect(layout.width).toBeGreaterThanOrEqual(260)
    expect(layout.height).toBeGreaterThanOrEqual(420)
  })
})
