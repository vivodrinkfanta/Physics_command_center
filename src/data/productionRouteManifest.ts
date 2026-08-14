import { mechanicsFormulas } from './formulas'
import { ibPhysicsTopics } from './ibPhysicsCurriculum'
import { inspectorModes } from './inspectorModes'
import { ibPracticeQuestions } from './ibPracticeQuestions'

const staticRoutes = ['/', '/explore', '/curriculum', '/formulas', '/simulations', '/practice'] as const
const curriculumRoutes = ibPhysicsTopics.map((topic) => `/curriculum/${topic.slug}`)
const formulaRoutes = mechanicsFormulas.flatMap((formula) => inspectorModes.map((mode) => (
  mode.id === 'simulate' ? `/formulas/${formula.id}` : `/formulas/${formula.id}?tab=${mode.id}`
)))
const practiceRoutes = ibPracticeQuestions.map((question) => `/practice/${question.id}`)

export const productionRouteManifest = [
  ...staticRoutes,
  ...curriculumRoutes,
  ...formulaRoutes,
  ...practiceRoutes,
] as const

export const productionRouteCounts = {
  curriculum: curriculumRoutes.length,
  formulasAndModes: formulaRoutes.length,
  practice: practiceRoutes.length,
  static: staticRoutes.length,
  total: staticRoutes.length + curriculumRoutes.length + formulaRoutes.length + practiceRoutes.length,
} as const
