import { ibPracticeQuestions } from '../data/ibPracticeQuestions'
import { ibPhysicsTopics } from '../data/ibPhysicsCurriculum'
import type { CurriculumTopicCode } from '../types/curriculum'
import type { StudentProgress } from '../types/progress'

export const studentProgressStorageKey = 'physics-lab-student-progress-v1'
const validQuestionIds = new Set(ibPracticeQuestions.map((question) => question.id))
const validTopicCodes = new Set(ibPhysicsTopics.map((topic) => topic.code))

export function createEmptyStudentProgress(): StudentProgress {
  return { version: 1, questions: {}, moduleCompletion: {}, lastVisitedModule: null }
}

export function parseStudentProgress(raw: string | null): StudentProgress {
  if (!raw) return createEmptyStudentProgress()
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || !('version' in parsed) || parsed.version !== 1) {
      return createEmptyStudentProgress()
    }
    const candidate = parsed as Partial<StudentProgress>
    const questions = candidate.questions && typeof candidate.questions === 'object'
      ? Object.fromEntries(Object.entries(candidate.questions).filter(([id, value]) => {
          if (!validQuestionIds.has(id)) return false
          if (!value || typeof value !== 'object') return false
          const item = value as unknown as Record<string, unknown>
          return typeof item.attempts === 'number' && Number.isFinite(item.attempts) && item.attempts >= 0 &&
            typeof item.completed === 'boolean' && typeof item.bestScore === 'number' &&
            Number.isFinite(item.bestScore) && item.bestScore >= 0 && typeof item.hintsUsed === 'number' &&
            Number.isFinite(item.hintsUsed) && item.hintsUsed >= 0
        })) as StudentProgress['questions']
      : {}
    const moduleCompletion = candidate.moduleCompletion && typeof candidate.moduleCompletion === 'object'
      ? Object.fromEntries(Object.entries(candidate.moduleCompletion).filter(([code, value]) =>
          validTopicCodes.has(code as CurriculumTopicCode) && typeof value === 'number' &&
          Number.isFinite(value) && value >= 0 && value <= 100,
        ))
      : {}
    return {
      version: 1,
      questions,
      moduleCompletion,
      lastVisitedModule: typeof candidate.lastVisitedModule === 'string' && validTopicCodes.has(candidate.lastVisitedModule as CurriculumTopicCode)
        ? candidate.lastVisitedModule as CurriculumTopicCode
        : null,
    }
  } catch {
    return createEmptyStudentProgress()
  }
}

export function loadStudentProgress(storage?: Pick<Storage, 'getItem'>): StudentProgress {
  try {
    const target = storage ?? window.localStorage
    return parseStudentProgress(target.getItem(studentProgressStorageKey))
  } catch {
    return createEmptyStudentProgress()
  }
}

export function saveStudentProgress(
  progress: StudentProgress,
  storage?: Pick<Storage, 'setItem'>,
) {
  try {
    const target = storage ?? window.localStorage
    target.setItem(studentProgressStorageKey, JSON.stringify(progress))
    return true
  } catch {
    return false
  }
}

export function recordModuleVisit(progress: StudentProgress, topicCode: CurriculumTopicCode) {
  return { ...progress, lastVisitedModule: topicCode }
}

function calculateModuleCompletion(progress: StudentProgress, topicCode: CurriculumTopicCode) {
  const questions = ibPracticeQuestions.filter((question) => question.topicCode === topicCode)
  if (!questions.length) return 0
  const completed = questions.filter((question) => progress.questions[question.id]?.completed).length
  return Math.round((completed / questions.length) * 100)
}

export function recordQuestionResult(
  progress: StudentProgress,
  questionId: string,
  topicCode: CurriculumTopicCode,
  score: number,
  maxScore: number,
  hintsUsed: number,
) {
  const previous = progress.questions[questionId]
  const next: StudentProgress = {
    ...progress,
    lastVisitedModule: topicCode,
    questions: {
      ...progress.questions,
      [questionId]: {
        attempts: (previous?.attempts ?? 0) + 1,
        completed: (previous?.completed ?? false) || score === maxScore,
        bestScore: Math.max(previous?.bestScore ?? 0, score),
        hintsUsed: Math.max(previous?.hintsUsed ?? 0, hintsUsed),
      },
    },
  }
  return {
    ...next,
    moduleCompletion: {
      ...next.moduleCompletion,
      [topicCode]: calculateModuleCompletion(next, topicCode),
    },
  }
}
