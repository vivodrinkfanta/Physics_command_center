import { describe, expect, it } from 'vitest'
import { mechanicsFormulas } from '../data/formulas'
import { commandPaletteItems, searchCommandPalette } from './commandPalette'

describe('command palette registry', () => {
  it('keeps command identifiers unique', () => {
    const ids = commandPaletteItems.map((item) => item.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('finds formulas from names and symbolic notation', () => {
    expect(searchCommandPalette('kinetic energy')[0]?.href).toBe('/formulas/kinetic-energy')
    expect(searchCommandPalette('F=ma')[0]?.href).toBe('/formulas/newton-second-law')
  })

  it('finds topic and practice destinations', () => {
    expect(searchCommandPalette('A.2 forces momentum')[0]?.href).toBe('/curriculum/a-2')
    expect(searchCommandPalette('practice hooke')[0]?.href).toBe(
      '/formulas/hookes-law?tab=practice',
    )
    expect(searchCommandPalette('stopping distance')[0]?.href).toBe('/practice/a1-stopping-distance')
  })

  it('finds every completed benchmark simulation', () => {
    expect(searchCommandPalette('constant acceleration cart')[0]?.id).toBe('simulate-kinematics')
    expect(searchCommandPalette('2d projectile field')[0]?.id).toBe('simulate-projectile')
    expect(searchCommandPalette('two cart collision')[0]?.id).toBe('simulate-momentum')
    expect(searchCommandPalette('potential energy tower')[0]?.id).toBe(
      'simulate-potential-energy',
    )
    expect(searchCommandPalette('uniform orbit laboratory')[0]?.id).toBe(
      'simulate-circular-motion',
    )
    expect(searchCommandPalette('mass spring oscillator')[0]?.id).toBe(
      'simulate-hookes-law',
    )
  })

  it('provides a direct simulation command for every registered formula', () => {
    const simulationDestinations = new Set(
      commandPaletteItems
        .filter((item) => item.section === 'Simulate')
        .map((item) => item.href),
    )
    expect(simulationDestinations).toEqual(
      new Set(mechanicsFormulas.map((formula) => `/formulas/${formula.id}`)),
    )
  })

  it('returns a concise suggested set for an empty query', () => {
    const suggestions = searchCommandPalette('')
    expect(suggestions).toHaveLength(7)
    expect(suggestions[0]?.id).toBe('simulate-newton')
  })
})
