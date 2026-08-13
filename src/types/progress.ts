import type { CurriculumTopicCode } from './curriculum'

export interface QuestionProgress {
  attempts: number
  completed: boolean
  bestScore: number
  hintsUsed: number
}

export interface StudentProgress {
  version: 1
  questions: Record<string, QuestionProgress>
  moduleCompletion: Partial<Record<CurriculumTopicCode, number>>
  lastVisitedModule: CurriculumTopicCode | null
}
