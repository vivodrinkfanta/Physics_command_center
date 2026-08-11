import { describe, expect, it } from 'vitest'
import { isPhysicsSearchShortcut } from './shortcuts'

describe('physics search shortcuts', () => {
  it('accepts Command or Control with K or F', () => {
    expect(isPhysicsSearchShortcut({ ctrlKey: false, key: 'k', metaKey: true })).toBe(true)
    expect(isPhysicsSearchShortcut({ ctrlKey: true, key: 'K', metaKey: false })).toBe(true)
    expect(isPhysicsSearchShortcut({ ctrlKey: false, key: 'f', metaKey: true })).toBe(true)
    expect(isPhysicsSearchShortcut({ ctrlKey: true, key: 'F', metaKey: false })).toBe(true)
  })

  it('leaves unrelated and unmodified keys alone', () => {
    expect(isPhysicsSearchShortcut({ ctrlKey: false, key: 'f', metaKey: false })).toBe(false)
    expect(isPhysicsSearchShortcut({ ctrlKey: true, key: 'g', metaKey: false })).toBe(false)
  })
})
