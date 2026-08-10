import { getVariableDefinition, variableCatalog } from '../data/variables'
import type { AcceptedUnit, PhysicsVariableId, UnitDefinition } from '../types/formula'

export type UnitAssessment =
  | {
      inputUnit: AcceptedUnit
      siValue: number
      status: 'ready'
    }
  | {
      inputUnit: AcceptedUnit
      siValue: number
      status: 'converted'
    }
  | {
      detectedUnit: AcceptedUnit
      status: 'incompatible'
    }
  | {
      detectedUnit: AcceptedUnit
      status: 'unsupported'
    }
  | { status: 'unknown' }
  | { status: 'invalid-value' }

const normalizeUnitSymbol = (symbol: string) =>
  symbol
    .trim()
    .replaceAll(' ', '')
    .replaceAll('*', '·')
    .replaceAll('^2', '²')
    .replace(/(?<=[A-Za-z)])2$/u, '²')

const knownUnits = Array.from(
  new Map(
    Object.values(variableCatalog)
      .flatMap((variable) => variable.acceptedUnits)
      .map((acceptedUnit) => [normalizeUnitSymbol(acceptedUnit.symbol), acceptedUnit]),
  ).values(),
)

export function convertToSI(value: number, unit: AcceptedUnit) {
  return (value + (unit.offsetToSI ?? 0)) * unit.scaleToSI
}

export function convertFromSI(value: number, unit: AcceptedUnit) {
  return value / unit.scaleToSI - (unit.offsetToSI ?? 0)
}

export function assessUnitInput(
  variableId: PhysicsVariableId,
  value: number,
  unitSymbol: string,
): UnitAssessment {
  if (!Number.isFinite(value)) return { status: 'invalid-value' }

  const variable = getVariableDefinition(variableId)
  const normalizedSymbol = normalizeUnitSymbol(unitSymbol)
  const inputUnit = variable.acceptedUnits.find(
    (acceptedUnit) => normalizeUnitSymbol(acceptedUnit.symbol) === normalizedSymbol,
  )

  if (inputUnit) {
    const siValue = convertToSI(value, inputUnit)
    const isSI = normalizeUnitSymbol(inputUnit.symbol) === normalizeUnitSymbol(variable.siUnit.symbol)
    return { inputUnit, siValue, status: isSI ? 'ready' : 'converted' }
  }

  const detectedUnit = knownUnits.find(
    (acceptedUnit) => normalizeUnitSymbol(acceptedUnit.symbol) === normalizedSymbol,
  )
  if (!detectedUnit) return { status: 'unknown' }
  if (detectedUnit.dimension !== variable.siUnit.dimension) {
    return { detectedUnit, status: 'incompatible' }
  }
  return { detectedUnit, status: 'unsupported' }
}

export function formatPhysicsValue(value: number) {
  if (value === 0) return '0'
  const magnitude = Math.abs(value)
  if (magnitude >= 100_000 || magnitude < 0.001) return value.toExponential(4)
  return Number(value.toPrecision(6)).toString()
}

export function describeConversionRule(unit: AcceptedUnit, siUnit: UnitDefinition) {
  const offset = unit.offsetToSI ?? 0
  if (unit.symbol === siUnit.symbol) return `1 ${unit.symbol} = 1 ${siUnit.symbol}`
  if (offset === 0) {
    return `1 ${unit.symbol} = ${formatPhysicsValue(unit.scaleToSI)} ${siUnit.symbol}`
  }
  const signedOffset = offset < 0 ? `− ${Math.abs(offset)}` : `+ ${offset}`
  return `${siUnit.symbol} = (${unit.symbol} ${signedOffset}) × ${unit.scaleToSI}`
}
