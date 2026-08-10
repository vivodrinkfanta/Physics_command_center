import { searchFormulas } from '../data/formulas'
import type { FormulaRecord } from '../types/formula'

export type FormulaDifficultyFilter = 'all' | 'foundation' | 'developing' | 'advanced'
export type FormulaSort = 'relevance' | 'topic' | 'name' | 'difficulty'

export interface FormulaLibraryOptions {
  difficulty: FormulaDifficultyFilter
  query: string
  sort: FormulaSort
  topic: string
}

const matchesDifficulty = (formula: FormulaRecord, filter: FormulaDifficultyFilter) => {
  if (filter === 'foundation') return formula.difficulty === 1
  if (filter === 'developing') return formula.difficulty === 2
  if (filter === 'advanced') return formula.difficulty >= 3
  return true
}

export function getFormulaLibraryResults({
  difficulty,
  query,
  sort,
  topic,
}: FormulaLibraryOptions) {
  const filtered = searchFormulas(query).filter(
    (formula) =>
      (topic === 'all' || formula.subtopic === topic) && matchesDifficulty(formula, difficulty),
  )

  if (sort === 'relevance') return filtered

  return [...filtered].sort((left, right) => {
    if (sort === 'name') return left.name.localeCompare(right.name)
    if (sort === 'difficulty') {
      return left.difficulty - right.difficulty || left.name.localeCompare(right.name)
    }
    return left.subtopic.localeCompare(right.subtopic) || left.name.localeCompare(right.name)
  })
}
