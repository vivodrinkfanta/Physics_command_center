import { describe, expect, it } from 'vitest'
import { variableCatalog } from '../data/variables'
import {
  assessUnitInput,
  convertFromSI,
  convertToSI,
  describeConversionRule,
  formatPhysicsValue,
} from './units'

describe('unit conversion system', () => {
  it('converts accepted alternative units into SI values', () => {
    expect(assessUnitInput('mass', 500, 'g')).toMatchObject({
      siValue: 0.5,
      status: 'converted',
    })
    expect(assessUnitInput('velocity', 72, 'km/h')).toMatchObject({
      siValue: 20,
      status: 'converted',
    })
    expect(assessUnitInput('spring-constant', 0.5, 'N/cm')).toMatchObject({
      siValue: 50,
      status: 'converted',
    })
  })

  it('accepts helpful ASCII notation for squared units', () => {
    expect(assessUnitInput('acceleration', 3, 'm/s^2')).toMatchObject({
      siValue: 3,
      status: 'ready',
    })
    expect(assessUnitInput('acceleration', 3, 'm/s2')).toMatchObject({
      siValue: 3,
      status: 'ready',
    })
  })

  it('distinguishes incompatible, unsupported, and unknown units', () => {
    expect(assessUnitInput('mass', 5, 'N').status).toBe('incompatible')
    expect(assessUnitInput('acceleration', 9.81, 'N/kg').status).toBe('unsupported')
    expect(assessUnitInput('mass', 5, 'bananas').status).toBe('unknown')
    expect(assessUnitInput('mass', Number.NaN, 'kg').status).toBe('invalid-value')
  })

  it('round-trips every registered accepted unit', () => {
    Object.values(variableCatalog).forEach((variable) => {
      variable.acceptedUnits.forEach((unit) => {
        expect(convertFromSI(convertToSI(12.5, unit), unit)).toBeCloseTo(12.5)
      })
    })
  })

  it('describes conversion rules and formats scientific values', () => {
    const mass = variableCatalog.mass
    expect(describeConversionRule(mass.acceptedUnits[1], mass.acceptedUnits[0])).toBe(
      '1 g = 0.001 kg',
    )
    expect(formatPhysicsValue(0.00002)).toBe('2.0000e-5')
  })
})
