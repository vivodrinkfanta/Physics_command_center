import { describe, expect, it } from 'vitest'
import { mechanicsFormulas } from './formulas'
import { ibPhysicsThemes, ibPhysicsTopics } from './ibPhysicsCurriculum'
import { curriculumRelationshipById, curriculumRelationships } from './curriculumRelationships'
import { ibPhysicsCoverageMatrix, officialFirstAssessment2025Topics, officialPhysicsSources } from './ibPhysicsCoverage'
import { ibPracticeQuestions } from './ibPracticeQuestions'
import { releasedCurriculumTopicCodes } from './ibPhysicsRelease'
import { filterCurriculumTopics, getTopicsForTheme } from '../utils/curriculum'

describe('IB Physics curriculum registry', () => {
  it('contains unique official codes and valid theme relationships', () => {
    const codes = ibPhysicsTopics.map((topic) => topic.code)
    const themeCodes = new Set(ibPhysicsThemes.map((theme) => theme.code))
    expect(new Set(codes).size).toBe(codes.length)
    expect(codes).toHaveLength(24)
    expect(codes).toEqual(Object.keys(officialFirstAssessment2025Topics))
    expect(ibPhysicsTopics.every((topic) => themeCodes.has(topic.theme))).toBe(true)
  })

  it('uses only valid availability metadata and prerequisite codes', () => {
    const validAvailability = new Set(['shared', 'shared-hl-extension', 'hl-only'])
    const codes = new Set(ibPhysicsTopics.map((topic) => topic.code))
    expect(ibPhysicsTopics.every((topic) => validAvailability.has(topic.availability))).toBe(true)
    expect(ibPhysicsTopics.every((topic) => officialFirstAssessment2025Topics[topic.code] === topic.availability)).toBe(true)
    expect(ibPhysicsTopics.every((topic) => topic.prerequisites.every((code) => codes.has(code)))).toBe(true)
  })

  it('references existing formulas and valid application routes', () => {
    const formulaIds = new Set(mechanicsFormulas.map((formula) => formula.id))
    for (const topic of ibPhysicsTopics) {
      expect(topic.formulaIds.every((id) => formulaIds.has(id))).toBe(true)
      expect(topic.simulations.every((item) => item.href.startsWith('/formulas/'))).toBe(true)
      expect(topic.simulations.every((item) => !item.formulaId || formulaIds.has(item.formulaId))).toBe(true)
    }
  })

  it('releases only topics that pass the course-content contract', () => {
    const complete = ibPhysicsTopics.filter((topic) => topic.coverage === 'complete')
    expect(complete).toHaveLength(24)
    expect(ibPhysicsCoverageMatrix).toHaveLength(24)
    expect(ibPhysicsCoverageMatrix.filter((row) => !row.releaseReady)).toEqual([])
    expect(releasedCurriculumTopicCodes).toEqual(ibPhysicsCoverageMatrix.filter((row) => row.releaseReady).map((row) => row.code))
    expect(complete.every((topic) => topic.practiceAvailable)).toBe(true)
    expect(officialPhysicsSources.every((source) => source.href.startsWith('https://www.ibo.org/'))).toBe(true)
  })

  it('resolves every course relationship and supplies practice for every module', () => {
    expect(new Set(curriculumRelationships.map((relationship) => relationship.id)).size).toBe(curriculumRelationships.length)
    for (const topic of ibPhysicsTopics) {
      expect(topic.relationshipIds.every((id) => curriculumRelationshipById.has(id))).toBe(true)
      expect(topic.relationshipIds.every((id) => curriculumRelationshipById.get(id)?.topicCode === topic.code)).toBe(true)
      const questionCount = ibPracticeQuestions.filter((question) => question.topicCode === topic.code).length
      expect(questionCount).toBeGreaterThanOrEqual(8)
      expect(questionCount).toBeLessThanOrEqual(12)
      expect(ibPracticeQuestions.some((question) => question.topicCode === topic.code && question.answer.kind === 'numeric' && question.data?.length)).toBe(true)
    }
    expect(ibPracticeQuestions).toHaveLength(264)
  })

  it('filters SL, HL, and themes correctly', () => {
    expect(filterCurriculumTopics('sl').some((topic) => topic.code === 'A.4')).toBe(false)
    expect(filterCurriculumTopics('hl')).toHaveLength(24)
    expect(getTopicsForTheme('A', 'sl').map((topic) => topic.code)).toEqual(['A.1', 'A.2', 'A.3'])
  })

  it('keeps the original mechanics instruments inside their official syllabus modules', () => {
    const topic = (code: string) => ibPhysicsTopics.find((item) => item.code === code)!
    expect(topic('A.1').formulaIds).toEqual(expect.arrayContaining(['constant-acceleration-velocity', 'projectile-vertical-position']))
    expect(topic('A.2').formulaIds).toEqual(expect.arrayContaining(['newton-second-law', 'linear-momentum', 'centripetal-force']))
    expect(topic('A.3').formulaIds).toEqual(expect.arrayContaining(['kinetic-energy', 'elastic-potential-energy', 'mechanical-energy-conservation']))
    expect(topic('C.1').formulaIds).toEqual(expect.arrayContaining(['hookes-law', 'elastic-potential-energy']))
    expect(topic('D.1').formulaIds).toEqual(expect.arrayContaining(['weight', 'gravitational-potential-energy']))
  })
})
