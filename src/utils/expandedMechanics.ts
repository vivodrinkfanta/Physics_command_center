import type { FormulaId, FormulaRecord, PhysicsVariableId } from '../types/formula'

export type FormulaValueState = Partial<Record<PhysicsVariableId, number>>
export type FormulaInputStates = Partial<Record<FormulaId, FormulaValueState>>

export const expandedFormulaIds = [
  'average-speed',
  'average-acceleration',
  'constant-acceleration-displacement',
  'velocity-displacement',
  'mean-velocity-displacement',
  'weight',
  'friction-force',
  'work',
  'power',
  'mechanical-energy-conservation',
  'impulse',
] as const satisfies readonly FormulaId[]

export type ExpandedFormulaId = (typeof expandedFormulaIds)[number]

const value = (values: FormulaValueState, id: PhysicsVariableId) => {
  const result = values[id]
  if (!Number.isFinite(result)) throw new Error(`Missing finite value for ${id}.`)
  return result as number
}

export function calculateExpandedFormula(formulaId: ExpandedFormulaId, values: FormulaValueState) {
  switch (formulaId) {
    case 'average-speed':
      return value(values, 'distance') / value(values, 'time')
    case 'average-acceleration':
      return value(values, 'change-velocity') / value(values, 'time')
    case 'constant-acceleration-displacement': {
      const time = value(values, 'time')
      return value(values, 'initial-velocity') * time + 0.5 * value(values, 'acceleration') * time ** 2
    }
    case 'velocity-displacement': {
      const radicand =
        value(values, 'initial-velocity') ** 2 +
        2 * value(values, 'acceleration') * value(values, 'displacement')
      return radicand < 0 ? Number.NaN : Math.sqrt(radicand)
    }
    case 'mean-velocity-displacement':
      return (
        0.5 *
        (value(values, 'initial-velocity') + value(values, 'final-velocity')) *
        value(values, 'time')
      )
    case 'weight':
      return value(values, 'mass') * value(values, 'gravitational-field-strength')
    case 'friction-force':
      return value(values, 'friction-coefficient') * value(values, 'normal-force')
    case 'work':
      return (
        value(values, 'applied-force') *
        value(values, 'displacement') *
        Math.cos(value(values, 'force-angle'))
      )
    case 'power':
      return value(values, 'work') / value(values, 'time')
    case 'mechanical-energy-conservation':
      return value(values, 'final-mechanical-energy') + value(values, 'energy-dissipated')
    case 'impulse':
      return value(values, 'resultant-force') * value(values, 'time')
  }
}

export function createFormulaInputStates(formulas: readonly FormulaRecord[]): FormulaInputStates {
  return Object.fromEntries(
    formulas.map((formula) => [
      formula.id,
      Object.fromEntries(
        formula.variables.flatMap((reference) =>
          reference.control ? [[reference.id, reference.control.defaultValue]] : [],
        ),
      ),
    ]),
  ) as FormulaInputStates
}

export function expandedGraphPoints(
  formulaId: ExpandedFormulaId,
  values: FormulaValueState,
  variableId: PhysicsVariableId,
  min: number,
  max: number,
  pointCount = 61,
) {
  if (!Number.isInteger(pointCount) || pointCount < 2) throw new Error('Graph requires two points.')
  return Array.from({ length: pointCount }, (_, index) => {
    const x = min + ((max - min) * index) / (pointCount - 1)
    return { x, y: calculateExpandedFormula(formulaId, { ...values, [variableId]: x }) }
  }).filter(({ y }) => Number.isFinite(y))
}

export function isExpandedFormulaId(formulaId: FormulaId): formulaId is ExpandedFormulaId {
  return (expandedFormulaIds as readonly FormulaId[]).includes(formulaId)
}
