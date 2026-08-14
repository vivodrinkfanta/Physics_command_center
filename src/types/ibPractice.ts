import type { CurriculumLevel, CurriculumTopicCode } from './curriculum'
import type { FormulaId } from './formula'

export type PracticeAssessmentStyle =
  | 'paper-1a'
  | 'paper-1b'
  | 'paper-2-short'
  | 'paper-2-extended'
  | 'numerical'
export type PracticeDifficulty = 'foundation' | 'standard' | 'challenge'
export type PracticeSkillFocus =
  | 'assumptions'
  | 'conceptual'
  | 'data-analysis'
  | 'experimental'
  | 'evaluation'
  | 'graph-interpretation'
  | 'model-selection'
  | 'multistep'
  | 'units-uncertainty'

export interface PracticeChoice {
  id: string
  label: string
}

export type PracticeAnswerSpec =
  | { kind: 'choice'; correctChoiceId: string }
  | { kind: 'numeric'; expected: number; tolerance: number; unit?: string }
  | { kind: 'text'; requiredGroups: string[][] }

export interface IbPracticeQuestion {
  id: string
  topicCode: CurriculumTopicCode
  level: CurriculumLevel
  style: PracticeAssessmentStyle
  difficulty: PracticeDifficulty
  skillFocus: PracticeSkillFocus[]
  title: string
  scenario: string
  prompt: string
  data?: Array<{ label: string; value: string }>
  choices?: PracticeChoice[]
  answer: PracticeAnswerSpec
  marks: number
  hints: string[]
  markscheme: string[]
  formulaIds: FormulaId[]
  relationshipIds?: string[]
  simulationHref?: string
  tags: string[]
}

export interface PracticeEvaluation {
  correct: boolean
  score: number
  maxScore: number
  feedback: string
}
