import { describe, expect, it } from 'vitest'
import { findFormulaById, mechanicsFormulas } from './formulas'
import { curriculumTopicBySlug, ibPhysicsTopics } from './ibPhysicsCurriculum'
import { inspectorModes } from './inspectorModes'
import { findIbPracticeQuestion, ibPracticeQuestions } from './ibPracticeQuestions'
import { productionRouteCounts, productionRouteManifest } from './productionRouteManifest'

describe('production route manifest', () => {
  it('covers every curriculum module, practice question, and Formula Inspector mode', () => {
    expect(productionRouteCounts).toEqual({
      curriculum: ibPhysicsTopics.length,
      formulasAndModes: mechanicsFormulas.length * inspectorModes.length,
      practice: ibPracticeQuestions.length,
      static: 6,
      total: 483,
    })
    expect(productionRouteManifest).toHaveLength(productionRouteCounts.total)
    expect(new Set(productionRouteManifest).size).toBe(productionRouteManifest.length)
  })

  it('resolves every generated deep link against its source registry', () => {
    for (const route of productionRouteManifest) {
      const url = new URL(route, 'https://physics-lab.example')
      if (url.pathname.startsWith('/curriculum/')) {
        expect(curriculumTopicBySlug.has(url.pathname.slice('/curriculum/'.length))).toBe(true)
      }
      if (url.pathname.startsWith('/practice/')) {
        expect(findIbPracticeQuestion(url.pathname.slice('/practice/'.length))).toBeDefined()
      }
      if (url.pathname.startsWith('/formulas/')) {
        expect(findFormulaById(url.pathname.slice('/formulas/'.length))).toBeDefined()
        const tab = url.searchParams.get('tab') ?? 'simulate'
        expect(inspectorModes.some((mode) => mode.id === tab)).toBe(true)
      }
    }
  })
})
