import type { CurriculumLevelAvailability, CurriculumTopicCode } from './curriculum'

export interface CurriculumRelationship {
  id: string
  topicCode: CurriculumTopicCode
  name: string
  expression: string
  meaning: string
  unitTrace: string
  assumption: string
  availability: CurriculumLevelAvailability
}
