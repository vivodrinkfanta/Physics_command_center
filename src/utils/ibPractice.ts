import { ibPracticeQuestions } from '../data/ibPracticeQuestions'
import type { CurriculumLevel } from '../types/curriculum'
import type {
  IbPracticeQuestion,
  PracticeAssessmentStyle,
  PracticeDifficulty,
  PracticeEvaluation,
  PracticeSkillFocus,
} from '../types/ibPractice'
import type { StudentProgress } from '../types/progress'

export type PracticeStatusFilter = 'all' | 'unanswered' | 'attempted' | 'completed'

export interface PracticeFilters {
  query: string
  topicCode: string
  level: 'all' | CurriculumLevel
  style: 'all' | PracticeAssessmentStyle
  difficulty: 'all' | PracticeDifficulty
  skill: 'all' | PracticeSkillFocus
  status: PracticeStatusFilter
}

const normalizeText = (value: string) =>
  value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, ' ').trim()

export function evaluateIbPracticeAnswer(
  question: IbPracticeQuestion,
  response: string,
): PracticeEvaluation {
  const { answer, marks } = question
  if (!response.trim()) return { correct: false, score: 0, maxScore: marks, feedback: 'Enter a response before checking.' }

  if (answer.kind === 'choice') {
    const correct = response === answer.correctChoiceId
    return {
      correct,
      score: correct ? marks : 0,
      maxScore: marks,
      feedback: correct ? 'Correct model selected.' : 'That model is not supported by the evidence given.',
    }
  }

  if (answer.kind === 'numeric') {
    const numericResponse = Number(response.replaceAll(',', '').trim())
    const correct = Number.isFinite(numericResponse) && Math.abs(numericResponse - answer.expected) <= answer.tolerance
    return {
      correct,
      score: correct ? marks : 0,
      maxScore: marks,
      feedback: correct
        ? `Confirmed within the accepted tolerance${answer.unit ? ` (${answer.unit})` : ''}.`
        : 'Not confirmed. Check the model, signs, units, and significant figures.',
    }
  }

  const normalizedResponse = normalizeText(response)
  const score = answer.requiredGroups.reduce(
    (total, alternatives) =>
      total + (alternatives.some((term) => normalizedResponse.includes(normalizeText(term))) ? 1 : 0),
    0,
  )
  return {
    correct: score === marks,
    score,
    maxScore: marks,
    feedback: score === marks
      ? 'Your explanation contains every required physics idea.'
      : `${score} of ${marks} required ideas detected. Compare your reasoning with the guidance.`,
  }
}

export function questionProgressStatus(questionId: string, progress: StudentProgress) {
  const entry = progress.questions[questionId]
  if (!entry) return 'unanswered' as const
  return entry.completed ? 'completed' as const : 'attempted' as const
}

export function filterIbPracticeQuestions(filters: PracticeFilters, progress: StudentProgress) {
  const query = normalizeText(filters.query)
  return ibPracticeQuestions.filter((question) => {
    if (filters.topicCode !== 'all' && question.topicCode !== filters.topicCode) return false
    if (filters.level === 'sl' && question.level !== 'sl') return false
    if (filters.style !== 'all' && question.style !== filters.style) return false
    if (filters.difficulty !== 'all' && question.difficulty !== filters.difficulty) return false
    if (filters.skill !== 'all' && !question.skillFocus.includes(filters.skill)) return false
    if (filters.status !== 'all' && questionProgressStatus(question.id, progress) !== filters.status) return false
    if (!query) return true
    const searchable = normalizeText([
      question.title,
      question.scenario,
      question.prompt,
      question.topicCode,
      ...question.tags,
    ].join(' '))
    return query.split(' ').every((term) => searchable.includes(term))
  })
}

export const practiceStyleLabels: Record<PracticeAssessmentStyle, string> = {
  'paper-1a': 'Paper 1A-style multiple choice',
  'paper-1b': 'Paper 1B-style data analysis',
  'paper-2-short': 'Paper 2-style short response',
  'paper-2-extended': 'Paper 2-style extended response',
  numerical: 'Numerical formula practice',
}

export const practiceSkillLabels: Record<PracticeSkillFocus, string> = {
  assumptions: 'Assumptions',
  conceptual: 'Conceptual understanding',
  'data-analysis': 'Data analysis',
  experimental: 'Experimental reasoning',
  evaluation: 'Evaluation',
  'graph-interpretation': 'Graph interpretation',
  'model-selection': 'Model selection',
  multistep: 'Multistep reasoning',
  'units-uncertainty': 'Units and uncertainty',
}
