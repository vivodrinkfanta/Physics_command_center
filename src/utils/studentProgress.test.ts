import { describe, expect, it } from 'vitest'
import {
  createEmptyStudentProgress,
  loadStudentProgress,
  parseStudentProgress,
  recordModuleVisit,
  recordQuestionResult,
  saveStudentProgress,
  studentProgressStorageKey,
} from './studentProgress'
import type { StudentProgress } from '../types/progress'

describe('student progress', () => {
  it('recovers safely from malformed or unsupported storage', () => {
    expect(parseStudentProgress('{bad json')).toEqual(createEmptyStudentProgress())
    expect(parseStudentProgress(JSON.stringify({ version: 99 }))).toEqual(createEmptyStudentProgress())
    expect(parseStudentProgress(JSON.stringify({ version: 1, questions: { invented: { attempts: 1, completed: true, bestScore: 1, hintsUsed: 0 } }, moduleCompletion: { 'Z.9': 500 }, lastVisitedModule: 'Z.9' }))).toEqual(createEmptyStudentProgress())
  })

  it('serializes visits, attempts, completion, scores, and hints', () => {
    let progress: StudentProgress = recordModuleVisit(createEmptyStudentProgress(), 'A.1')
    progress = recordQuestionResult(progress, 'a1-velocity-area', 'A.1', 1, 1, 2)
    const values = new Map<string, string>()
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => { values.set(key, value) },
    }
    expect(saveStudentProgress(progress, storage)).toBe(true)
    expect(values.has(studentProgressStorageKey)).toBe(true)
    expect(loadStudentProgress(storage)).toEqual(progress)
    expect(progress.questions['a1-velocity-area']).toMatchObject({ attempts: 1, completed: true, bestScore: 1, hintsUsed: 2 })
    expect(progress.moduleCompletion['A.1']).toBeGreaterThan(0)
  })

  it('degrades gracefully when storage is unavailable', () => {
    const blocked = { getItem: () => { throw new Error('blocked') }, setItem: () => { throw new Error('blocked') } }
    expect(loadStudentProgress(blocked)).toEqual(createEmptyStudentProgress())
    expect(saveStudentProgress(createEmptyStudentProgress(), blocked)).toBe(false)
  })
})
