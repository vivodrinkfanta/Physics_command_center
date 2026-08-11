import { getVariableDefinition } from '../data/variables'
import type {
  FormulaId,
  FormulaRecord,
  PhysicsVariableId,
  PracticeTemplate,
} from '../types/formula'

export interface PracticeKnownValue {
  unit: string
  value: number
  variableId: PhysicsVariableId
}

export interface GeneratedPracticeProblem {
  answerUnit: string
  expectedAnswer: number
  knownValues: PracticeKnownValue[]
  prompt: string
  solveFor: PhysicsVariableId
  substitution: string
}

type PracticeValues = Partial<Record<PhysicsVariableId, number>>

const valueFor = (values: PracticeValues, variableId: PhysicsVariableId) => {
  const value = values[variableId]
  if (value === undefined) throw new Error(`Missing practice value: ${variableId}`)
  return value
}

const evaluators: Record<FormulaId, (values: PracticeValues) => number> = {
  'constant-acceleration-velocity': (values) =>
    valueFor(values, 'initial-velocity') +
    valueFor(values, 'acceleration') * valueFor(values, 'time'),
  'newton-second-law': (values) =>
    valueFor(values, 'resultant-force') / valueFor(values, 'mass'),
  'kinetic-energy': (values) =>
    0.5 * valueFor(values, 'mass') * valueFor(values, 'speed') ** 2,
  'gravitational-potential-energy': (values) =>
    valueFor(values, 'mass') *
    valueFor(values, 'gravitational-field-strength') *
    valueFor(values, 'height'),
  'linear-momentum': (values) =>
    valueFor(values, 'mass') * valueFor(values, 'velocity'),
  'centripetal-acceleration': (values) =>
    valueFor(values, 'speed') ** 2 / valueFor(values, 'radius'),
  'projectile-vertical-position': (values) => {
    const time = valueFor(values, 'time')
    return (
      valueFor(values, 'initial-vertical-position') +
      valueFor(values, 'initial-vertical-velocity') * time -
      0.5 * valueFor(values, 'gravitational-field-strength') * time ** 2
    )
  },
  'hookes-law': (values) =>
    -valueFor(values, 'spring-constant') * valueFor(values, 'spring-displacement'),
}

const seedFor = (formulaId: FormulaId) =>
  [...formulaId].reduce((total, character) => total + character.charCodeAt(0), 0)

const sampleRange = (
  range: PracticeTemplate['variableRanges'][number],
  formulaId: FormulaId,
  variant: number,
  rangeIndex: number,
) => {
  const stepCount = Math.round((range.max - range.min) / range.step)
  const sampleIndex = (seedFor(formulaId) + variant * 7 + rangeIndex * 11) % (stepCount + 1)
  return Number((range.min + sampleIndex * range.step).toFixed(8))
}

const replacePlaceholders = (template: string, replacements: Record<string, number>) =>
  Object.entries(replacements).reduce(
    (result, [placeholder, value]) => result.replaceAll(`{${placeholder}}`, String(value)),
    template,
  )

export function generatePracticeProblem(
  formula: FormulaRecord,
  variant: number,
): GeneratedPracticeProblem {
  const template = formula.practiceTemplates[variant % formula.practiceTemplates.length]
  if (!template) throw new Error(`No practice template registered for ${formula.id}`)

  const values: PracticeValues = {}
  const replacements: Record<string, number> = {}

  template.variableRanges.forEach((range, rangeIndex) => {
    const value = sampleRange(range, formula.id, variant, rangeIndex)
    values[range.variableId] = value
    replacements[range.placeholder] = value
  })
  formula.constants.forEach(({ value, variableId }) => {
    values[variableId] = value
  })

  const knownValues = [...template.variableRanges.map(({ variableId }) => variableId)]
  formula.constants.forEach(({ variableId }) => knownValues.push(variableId))

  return {
    answerUnit: getVariableDefinition(template.solveFor).siUnit.symbol,
    expectedAnswer: evaluators[formula.id](values),
    knownValues: knownValues.map((variableId) => ({
      unit: getVariableDefinition(variableId).siUnit.symbol,
      value: valueFor(values, variableId),
      variableId,
    })),
    prompt: replacePlaceholders(template.promptTemplate, replacements),
    solveFor: template.solveFor,
    substitution: replacePlaceholders(template.substitutionTemplate, replacements),
  }
}

export function isPracticeAnswerCorrect(answer: number, expectedAnswer: number) {
  if (!Number.isFinite(answer)) return false
  const tolerance = Math.max(0.01, Math.abs(expectedAnswer) * 0.005)
  return Math.abs(answer - expectedAnswer) <= tolerance
}

export function formatPracticeValue(value: number, maximumFractionDigits = 3) {
  const normalized = Math.abs(value) < 0.0005 ? 0 : value
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits,
  }).format(normalized)
}
