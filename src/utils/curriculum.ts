import { ibPhysicsThemes, ibPhysicsTopics } from '../data/ibPhysicsCurriculum'
import { isCurriculumTopicReleased } from '../data/ibPhysicsRelease'
import type {
  CurriculumLevelAvailability,
  CurriculumTopic,
  CurriculumTopicCode,
} from '../types/curriculum'

export type CurriculumLevelFilter = 'all' | 'sl' | 'hl'

export const activeCurriculumTopics = ibPhysicsTopics.filter((topic) => isCurriculumTopicReleased(topic.code))

export function isTopicVisibleForLevel(
  availability: CurriculumLevelAvailability,
  level: CurriculumLevelFilter,
) {
  if (level === 'all' || level === 'hl') return true
  return availability !== 'hl-only'
}

export function filterCurriculumTopics(level: CurriculumLevelFilter) {
  return activeCurriculumTopics.filter((topic) => isTopicVisibleForLevel(topic.availability, level))
}

export function getTopicsForTheme(themeCode: string, level: CurriculumLevelFilter = 'all') {
  return filterCurriculumTopics(level).filter((topic) => topic.theme === themeCode)
}

export function getThemeForTopic(topic: CurriculumTopic) {
  return ibPhysicsThemes.find((theme) => theme.code === topic.theme)
}

export function formatAvailability(availability: CurriculumLevelAvailability) {
  if (availability === 'hl-only') return 'HL only'
  if (availability === 'shared-hl-extension') return 'SL + additional HL'
  return 'SL & HL'
}

export function getAdjacentActiveTopics(code: CurriculumTopicCode) {
  const index = activeCurriculumTopics.findIndex((topic) => topic.code === code)
  return {
    previous: index > 0 ? activeCurriculumTopics[index - 1] : undefined,
    next: index >= 0 && index < activeCurriculumTopics.length - 1
      ? activeCurriculumTopics[index + 1]
      : undefined,
  }
}
