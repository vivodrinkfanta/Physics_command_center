import { describe, expect, it } from 'vitest'
import { getFormulaLibraryResults } from './formulaLibrary'

describe('formula library controls', () => {
  it('preserves relevance for natural-language searches', () => {
    const [first] = getFormulaLibraryResults({
      query: 'formula connecting mass velocity and momentum',
      topic: 'all',
      difficulty: 'all',
      sort: 'relevance',
    })

    expect(first.id).toBe('linear-momentum')
    expect(getFormulaLibraryResults({ query: 'normal force friction', topic: 'all', difficulty: 'all', sort: 'relevance' })[0].id).toBe('friction-force')
    expect(getFormulaLibraryResults({ query: 'energy transfer rate', topic: 'all', difficulty: 'all', sort: 'relevance' })[0].id).toBe('power')
  })

  it('combines topic and difficulty filters', () => {
    const results = getFormulaLibraryResults({
      query: '',
      topic: 'Circular Motion',
      difficulty: 'developing',
      sort: 'name',
    })

    expect(results.map((formula) => formula.id)).toEqual([
      'centripetal-acceleration',
      'centripetal-force',
    ])
  })

  it('sorts the complete registry alphabetically', () => {
    const results = getFormulaLibraryResults({
      query: '',
      topic: 'all',
      difficulty: 'all',
      sort: 'name',
    })

    expect(results[0].name).toBe('Average acceleration')
    expect(results.at(-1)?.name).toBe('Work done by a force')
  })
})
