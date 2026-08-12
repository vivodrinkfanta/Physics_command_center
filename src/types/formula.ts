export type FormulaId =
  | 'average-speed'
  | 'average-acceleration'
  | 'constant-acceleration-velocity'
  | 'constant-acceleration-displacement'
  | 'velocity-displacement'
  | 'mean-velocity-displacement'
  | 'newton-second-law'
  | 'weight'
  | 'friction-force'
  | 'kinetic-energy'
  | 'gravitational-potential-energy'
  | 'elastic-potential-energy'
  | 'work'
  | 'power'
  | 'mechanical-energy-conservation'
  | 'linear-momentum'
  | 'impulse'
  | 'centripetal-acceleration'
  | 'centripetal-force'
  | 'projectile-vertical-position'
  | 'hookes-law'

export type FormulaCategory = 'Mechanics'

export type FormulaSimulationType =
  | 'energy-transfer'
  | 'force-cart'
  | 'force-system'
  | 'impulse-cart'
  | 'kinematics-cart'
  | 'mass-spring'
  | 'motion-analyzer'
  | 'momentum-cart'
  | 'moving-mass'
  | 'projectile-field'
  | 'raised-mass'
  | 'rotating-mass'

export type FormulaGraphType =
  | 'acceleration-change-velocity'
  | 'acceleration-force'
  | 'acceleration-mass'
  | 'acceleration-radius'
  | 'acceleration-speed'
  | 'acceleration-time'
  | 'centripetal-force-mass'
  | 'distance-time'
  | 'displacement-acceleration'
  | 'displacement-final-velocity'
  | 'displacement-initial-velocity'
  | 'displacement-time'
  | 'energy-dissipated'
  | 'energy-final'
  | 'energy-conservation'
  | 'energy-work'
  | 'force-angle'
  | 'friction-coefficient'
  | 'force-normal'
  | 'impulse-force'
  | 'impulse-time'
  | 'force-displacement'
  | 'kinetic-energy-mass'
  | 'kinetic-energy-speed'
  | 'momentum-mass'
  | 'momentum-velocity'
  | 'potential-energy-height'
  | 'potential-energy-mass'
  | 'power-time'
  | 'power-work'
  | 'position-time'
  | 'spring-energy-displacement'
  | 'spring-position-time'
  | 'velocity-displacement'
  | 'velocity-acceleration'
  | 'velocity-initial-velocity'
  | 'speed-distance'
  | 'speed-time'
  | 'weight-gravity'
  | 'weight-mass'
  | 'work-displacement'
  | 'work-force'
  | 'centripetal-force-radius'
  | 'centripetal-force-speed'
  | 'trajectory'
  | 'velocity-time'
  | 'vertical-position-time'
  | 'vertical-velocity-time'

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
  | 'distance'
  | 'displacement'
  | 'change-velocity'
  | 'weight-force'
  | 'friction-force'
  | 'friction-coefficient'
  | 'normal-force'
  | 'elastic-potential-energy'
  | 'work'
  | 'applied-force'
  | 'force-angle'
  | 'power'
  | 'impulse'
  | 'centripetal-force'
  | 'initial-mechanical-energy'
  | 'final-mechanical-energy'
  | 'energy-dissipated'

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

export interface FormulaDimensionalAnalysis {
  baseSubstitution: string
  leftDimensions: string
  rightDimensions: string
  siSubstitution: string
}

export interface FormulaPredictionOption {
  id: string
  label: string
}

export interface FormulaPredictionValue {
  value: number
  variableId: PhysicsVariableId
}

export interface FormulaPredictionChallenge {
  afterValues: FormulaPredictionValue[]
  beforeValues: FormulaPredictionValue[]
  correctOptionId: string
  explanation: string
  id: string
  options: FormulaPredictionOption[]
  prompt: string
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
  placeholder: string
  step: number
  variableId: PhysicsVariableId
}

export interface PracticeTemplate {
  promptTemplate: string
  solveFor: PhysicsVariableId
  substitutionTemplate: string
  variableRanges: PracticeVariableRange[]
}

export interface FormulaRecord {
  assumptions: string[]
  category: FormulaCategory
  commonMistakes: string[]
  constants: Array<{
    name: string
    symbol: string
    unit: string
    value: number
    variableId: PhysicsVariableId
  }>
  description: string
  difficulty: 1 | 2 | 3 | 4 | 5
  dimensionalAnalysis: FormulaDimensionalAnalysis
  expression: FormulaExpression
  graphTypes: FormulaGraphType[]
  id: FormulaId
  name: string
  practiceTemplates: PracticeTemplate[]
  predictionChallenges?: FormulaPredictionChallenge[]
  rearrangements: FormulaRearrangement[]
  relatedFormulaIds: FormulaId[]
  simulationType: FormulaSimulationType | null
  subtopic: string
  tags: string[]
  variables: FormulaVariableReference[]
  workedExamples: WorkedExample[]
}
