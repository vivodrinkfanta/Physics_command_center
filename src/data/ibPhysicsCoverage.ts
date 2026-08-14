import { curriculumRelationshipById } from './curriculumRelationships'
import { ibPhysicsTopics } from './ibPhysicsCurriculum'
import { ibPracticeQuestions } from './ibPracticeQuestions'
import type { CurriculumLevelAvailability, CurriculumTopicCode } from '../types/curriculum'

export const officialFirstAssessment2025Topics: Readonly<Record<CurriculumTopicCode, CurriculumLevelAvailability>> = {
  'A.1': 'shared', 'A.2': 'shared', 'A.3': 'shared', 'A.4': 'hl-only', 'A.5': 'hl-only',
  'B.1': 'shared', 'B.2': 'shared', 'B.3': 'shared', 'B.4': 'hl-only', 'B.5': 'shared',
  'C.1': 'shared-hl-extension', 'C.2': 'shared', 'C.3': 'shared-hl-extension', 'C.4': 'shared', 'C.5': 'shared-hl-extension',
  'D.1': 'shared-hl-extension', 'D.2': 'shared-hl-extension', 'D.3': 'shared', 'D.4': 'hl-only',
  'E.1': 'shared-hl-extension', 'E.2': 'hl-only', 'E.3': 'shared-hl-extension', 'E.4': 'shared', 'E.5': 'shared',
}

export const officialPhysicsSources = [
  {
    label: 'IB Physics subject brief — first assessment 2025',
    href: 'https://www.ibo.org/globalassets/new-structure/recognition/pdfs/dp_sciences_physics_subject-brief_jan_2022_e.pdf',
  },
  {
    label: 'IB Physics subject page',
    href: 'https://www.ibo.org/programmes/diploma-programme/curriculum/sciences/physics/',
  },
] as const

export const curriculumReleaseRequirements = [
  'The topic belongs to the official first-assessment-2025 A–E structure and has correct SL/HL availability metadata.',
  'At least three objectives, four core concepts, three skills, and three substantive study sections are present.',
  'At least one registered formula inspector or course relationship documents meaning, units, and assumptions.',
  'An interactive evidence inquiry contains at least three physically distinct scenarios.',
  'Between eight and twelve original, functional assessment-style questions are linked to the topic.',
] as const

export interface CurriculumCoverageRow {
  code: CurriculumTopicCode
  title: string
  objectiveCount: number
  studySectionCount: number
  relationshipCount: number
  interactiveScenarioCount: number
  questionCount: number
  releaseReady: boolean
}

export const ibPhysicsCoverageMatrix: readonly CurriculumCoverageRow[] = ibPhysicsTopics.map((topic) => {
  const relationshipCount = topic.relationshipIds.filter((id) => curriculumRelationshipById.has(id)).length
  const questionCount = ibPracticeQuestions.filter((question) => question.topicCode === topic.code).length
  const releaseReady = topic.objectives.length >= 3
    && topic.concepts.length >= 4
    && topic.skills.length >= 3
    && topic.studySections.length >= 3
    && topic.studySections.every((section) => section.summary.length >= 80 && section.takeaways.length >= 3)
    && topic.inquiry.scenarios.length >= 3
    && topic.inquiry.scenarios.every((scenario) => scenario.setup.length > 20 && scenario.observation.length > 20)
    && topic.formulaIds.length + relationshipCount > 0
    && topic.workedExample.given.length > 20
    && topic.workedExample.reasoning.length > 100
    && topic.workedExample.conclusion.length > 20
    && questionCount >= 8
    && questionCount <= 12

  return {
    code: topic.code,
    title: topic.title,
    objectiveCount: topic.objectives.length,
    studySectionCount: topic.studySections.length,
    relationshipCount: topic.formulaIds.length + relationshipCount,
    interactiveScenarioCount: topic.inquiry.scenarios.length,
    questionCount,
    releaseReady,
  }
})
