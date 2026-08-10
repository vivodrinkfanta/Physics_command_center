export type FormulaId =
  | 'constant-acceleration-velocity'
  | 'newton-second-law'
  | 'kinetic-energy'
  | 'gravitational-potential-energy'
  | 'linear-momentum'
  | 'centripetal-acceleration'
  | 'projectile-vertical-position'
  | 'hookes-law'

export type PhysicsVariableId =
  | 'final-velocity'
  | 'initial-velocity'
  | 'acceleration'
  | 'time'
  | 'resultant-force'
  | 'mass'
  | 'kinetic-energy'
  | 'gravitational-potential-energy'
  | 'gravitational-field-strength'
  | 'height'
  | 'speed'
  | 'momentum'
  | 'velocity'
  | 'centripetal-acceleration'
  | 'radius'
  | 'vertical-position'
  | 'initial-vertical-position'
  | 'initial-vertical-velocity'
  | 'spring-force'
  | 'spring-constant'
  | 'spring-displacement'

export type ExpressionTokenKind =
  | 'variable'
  | 'operator'
  | 'number'
  | 'grouping'
  | 'function'

export interface FormulaExpressionToken {
  kind: ExpressionTokenKind
  text: string
  variableId?: PhysicsVariableId
}

export interface FormulaExpression {
  plainText: string
  tokens: FormulaExpressionToken[]
}

export interface UnitDefinition {
  dimension: string
  name: string
  symbol: string
}

export interface AcceptedUnit extends UnitDefinition {
  offsetToSI?: number
  scaleToSI: number
}

export interface PhysicsVariableDefinition {
  acceptedUnits: AcceptedUnit[]
  description: string
  id: PhysicsVariableId
  name: string
  nature: 'scalar' | 'vector' | 'component'
  siUnit: UnitDefinition
  symbol: string
}

export interface VariableControlRange {
  defaultValue: number
  max: number
  min: number
  step: number
}

export interface FormulaVariableReference {
  control?: VariableControlRange
  id: PhysicsVariableId
  role: 'input' | 'output' | 'parameter'
}

export interface FormulaRearrangement {
  expression: FormulaExpression
  operation: string
  solveFor: PhysicsVariableId
}

export interface WorkedExampleValue {
  unit: string
  value: number
  variableId: PhysicsVariableId
}

export interface WorkedExample {
  answer: string
  knownValues: WorkedExampleValue[]
  prompt: string
  steps: string[]
}

export interface PracticeVariableRange {
  max: number
  min: number
  step: number
  variableId: PhysicsVariableId
}

export interface PracticeTemplate {
  promptTemplate: string
  solveFor: PhysicsVariableId
  variableRanges: PracticeVariableRange[]
}

export interface FormulaRecord {
  assumptions: string[]
  category: 'Mechanics'
  commonMistakes: string[]
  constants: Array<{
    name: string
    symbol: string
    unit: string
    value: number
  }>
  description: string
  difficulty: 1 | 2 | 3 | 4 | 5
  dimensionalAnalysis: string
  expression: FormulaExpression
  graphTypes: string[]
  id: FormulaId
  name: string
  practiceTemplates: PracticeTemplate[]
  rearrangements: FormulaRearrangement[]
  relatedFormulaIds: FormulaId[]
  simulationType: string | null
  subtopic: string
  tags: string[]
  variables: FormulaVariableReference[]
  workedExamples: WorkedExample[]
}
