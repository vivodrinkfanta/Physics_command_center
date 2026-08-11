import { describe, expect, it } from 'vitest'
import { calculateFittedFontSize } from './FittedFormulaExpression'

describe('formula display fitting', () => {
  it('keeps the preferred size when the equation already fits', () => {
    expect(calculateFittedFontSize(700, 620, 18, 92)).toBe(92)
  })

  it('scales an equation proportionally into the available panel width', () => {
    expect(calculateFittedFontSize(400, 800, 18, 92)).toBe(46)
  })

  it('preserves a readable minimum for exceptionally narrow panels', () => {
    expect(calculateFittedFontSize(80, 800, 18, 92)).toBe(18)
  })
})
