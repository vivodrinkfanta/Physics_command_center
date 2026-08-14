import type { FormulaId } from './formula'

export type CurriculumThemeCode = 'A' | 'B' | 'C' | 'D' | 'E'
export type CurriculumTopicCode = `${CurriculumThemeCode}.${number}`
export type CurriculumLevel = 'sl' | 'hl'
export type CurriculumLevelAvailability = 'shared' | 'shared-hl-extension' | 'hl-only'
export type CurriculumCoverage = 'complete' | 'partial' | 'planned'

export interface CurriculumTheme {
  code: CurriculumThemeCode
  title: string
  summary: string
}

export interface CurriculumDestination {
  label: string
  href: string
  formulaId?: FormulaId
}

export interface CurriculumStudySection {
  title: string
  summary: string
  takeaways: string[]
}

export interface CurriculumInquiryScenario {
  label: string
  setup: string
  observation: string
}

export interface CurriculumInquiry {
  title: string
  prompt: string
  analysisQuestion: string
  scenarios: CurriculumInquiryScenario[]
}

export interface CurriculumWorkedExample {
  title: string
  given: string
  reasoning: string
  conclusion: string
}

export interface CurriculumTopic {
  code: CurriculumTopicCode
  slug: string
  title: string
  theme: CurriculumThemeCode
  availability: CurriculumLevelAvailability
  summary: string
  objectives: string[]
  concepts: string[]
  skills: string[]
  prerequisites: CurriculumTopicCode[]
  formulaIds: FormulaId[]
  relationshipIds: string[]
  simulations: CurriculumDestination[]
  studySections: CurriculumStudySection[]
  inquiry: CurriculumInquiry
  workedExample: CurriculumWorkedExample
  examFocus: string[]
  coverage: CurriculumCoverage
  coverageNote: string
  practiceAvailable: boolean
}
