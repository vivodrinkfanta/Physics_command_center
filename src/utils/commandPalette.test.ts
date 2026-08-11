import { describe, expect, it } from 'vitest'
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
    expect(searchCommandPalette('projectile topic')[0]?.href).toBe('/explore?topic=projectiles')
    expect(searchCommandPalette('practice hooke')[0]?.href).toBe(
      '/formulas/hookes-law?tab=practice',
    )
  })

  it('finds every completed benchmark simulation', () => {
    expect(searchCommandPalette('constant acceleration cart')[0]?.id).toBe('simulate-kinematics')
    expect(searchCommandPalette('2d projectile field')[0]?.id).toBe('simulate-projectile')
    expect(searchCommandPalette('two cart collision')[0]?.id).toBe('simulate-momentum')
    expect(searchCommandPalette('potential energy tower')[0]?.id).toBe(
      'simulate-potential-energy',
    )
  })

  it('returns a concise suggested set for an empty query', () => {
    const suggestions = searchCommandPalette('')
    expect(suggestions).toHaveLength(6)
    expect(suggestions[0]?.id).toBe('simulate-newton')
  })
})
