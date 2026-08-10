import type { FormulaRecord } from '../../types/formula'
import { expression, grouping, number, operator, variable } from './expression'

export const kinematicsFormulas: FormulaRecord[] = [
  {
    id: 'constant-acceleration-velocity',
    name: 'Constant-acceleration velocity',
    category: 'Mechanics',
    subtopic: 'Kinematics',
    expression: expression('v = u + at', [
      variable('v', 'final-velocity'),
      operator('='),
      variable('u', 'initial-velocity'),
      operator('+'),
      variable('a', 'acceleration'),
      variable('t', 'time'),
    ]),
    description:
      'Relates initial and final velocity over a time interval when acceleration remains constant.',
    variables: [
      { id: 'final-velocity', role: 'output' },
      {
        id: 'initial-velocity',
        role: 'input',
        control: { defaultValue: 0, min: -30, max: 30, step: 0.5 },
      },
      {
        id: 'acceleration',
        role: 'input',
        control: { defaultValue: 2, min: -12, max: 12, step: 0.1 },
      },
      {
        id: 'time',
        role: 'input',
        control: { defaultValue: 4, min: 0, max: 20, step: 0.1 },
      },
    ],
    constants: [],
    rearrangements: [
      {
        solveFor: 'initial-velocity',
        expression: expression('u = v − at', [
          variable('u', 'initial-velocity'),
          operator('='),
          variable('v', 'final-velocity'),
          operator('−'),
          variable('a', 'acceleration'),
          variable('t', 'time'),
        ]),
      },
      {
        solveFor: 'acceleration',
        expression: expression('a = (v − u)/t', [
          variable('a', 'acceleration'),
          operator('='),
          grouping('('),
          variable('v', 'final-velocity'),
          operator('−'),
          variable('u', 'initial-velocity'),
          grouping(')'),
          operator('/'),
          variable('t', 'time'),
        ]),
      },
      {
        solveFor: 'time',
        expression: expression('t = (v − u)/a', [
          variable('t', 'time'),
          operator('='),
          grouping('('),
          variable('v', 'final-velocity'),
          operator('−'),
          variable('u', 'initial-velocity'),
          grouping(')'),
          operator('/'),
          variable('a', 'acceleration'),
        ]),
      },
    ],
    assumptions: ['Acceleration is constant', 'All velocities and acceleration use one signed axis'],
    commonMistakes: [
      'Using speed when the direction sign matters',
      'Mixing milliseconds and seconds',
      'Using this relation when acceleration changes with time',
    ],
    relatedFormulaIds: ['projectile-vertical-position', 'newton-second-law'],
    simulationType: 'kinematics-cart',
    graphTypes: ['velocity-time', 'acceleration-time'],
    workedExamples: [
      {
        prompt: 'A cart starts at 3 m/s and accelerates at 2 m/s² for 4 s. Find its final velocity.',
        knownValues: [
          { variableId: 'initial-velocity', value: 3, unit: 'm/s' },
          { variableId: 'acceleration', value: 2, unit: 'm/s²' },
          { variableId: 'time', value: 4, unit: 's' },
        ],
        steps: ['v = u + at', 'v = 3 + (2)(4)', 'v = 11 m/s'],
        answer: '11 m/s',
      },
    ],
    practiceTemplates: [
      {
        promptTemplate: 'An object begins at {u} m/s and accelerates at {a} m/s² for {t} s. Find v.',
        solveFor: 'final-velocity',
        variableRanges: [
          { variableId: 'initial-velocity', min: -10, max: 20, step: 1 },
          { variableId: 'acceleration', min: -5, max: 8, step: 0.5 },
          { variableId: 'time', min: 1, max: 12, step: 1 },
        ],
      },
    ],
    dimensionalAnalysis: 'm·s⁻¹ = m·s⁻¹ + (m·s⁻²)(s)',
    difficulty: 1,
    tags: ['velocity', 'acceleration', 'time', 'suvat', 'motion'],
  },
  {
    id: 'projectile-vertical-position',
    name: 'Vertical projectile position',
    category: 'Mechanics',
    subtopic: 'Projectiles',
    expression: expression('y = y₀ + v₀ᵧt − ½gt²', [
      variable('y', 'vertical-position'),
      operator('='),
      variable('y₀', 'initial-vertical-position'),
      operator('+'),
      variable('v₀ᵧ', 'initial-vertical-velocity'),
      variable('t', 'time'),
      operator('−'),
      number('½'),
      variable('g', 'gravitational-field-strength'),
      variable('t²', 'time'),
    ]),
    description:
      'Gives vertical position during ideal projectile motion using upward as the positive direction.',
    variables: [
      { id: 'vertical-position', role: 'output' },
      {
        id: 'initial-vertical-position',
        role: 'input',
        control: { defaultValue: 0, min: 0, max: 30, step: 0.5 },
      },
      {
        id: 'initial-vertical-velocity',
        role: 'input',
        control: { defaultValue: 15, min: -20, max: 40, step: 0.5 },
      },
      {
        id: 'time',
        role: 'input',
        control: { defaultValue: 1, min: 0, max: 10, step: 0.05 },
      },
      {
        id: 'gravitational-field-strength',
        role: 'parameter',
        control: { defaultValue: 9.81, min: 1.62, max: 24.79, step: 0.01 },
      },
    ],
    constants: [],
    rearrangements: [
      {
        solveFor: 'initial-vertical-position',
        expression: expression('y₀ = y − v₀ᵧt + ½gt²', [
          variable('y₀', 'initial-vertical-position'),
          operator('='),
          variable('y', 'vertical-position'),
          operator('−'),
          variable('v₀ᵧ', 'initial-vertical-velocity'),
          variable('t', 'time'),
          operator('+'),
          number('½'),
          variable('g', 'gravitational-field-strength'),
          variable('t²', 'time'),
        ]),
      },
    ],
    assumptions: ['Air resistance is ignored', 'Gravitational acceleration is uniform and downward'],
    commonMistakes: [
      'Using total launch speed instead of its vertical component',
      'Changing the sign of g without defining a coordinate direction',
      'Assuming vertical velocity is zero for the entire flight at maximum height',
    ],
    relatedFormulaIds: ['constant-acceleration-velocity'],
    simulationType: 'projectile-field',
    graphTypes: ['trajectory', 'vertical-position-time', 'vertical-velocity-time'],
    workedExamples: [
      {
        prompt: 'A ball is launched upward from ground level at 20 m/s. Find its height after 1.5 s.',
        knownValues: [
          { variableId: 'initial-vertical-position', value: 0, unit: 'm' },
          { variableId: 'initial-vertical-velocity', value: 20, unit: 'm/s' },
          { variableId: 'time', value: 1.5, unit: 's' },
          { variableId: 'gravitational-field-strength', value: 9.81, unit: 'm/s²' },
        ],
        steps: ['y = y₀ + v₀ᵧt − ½gt²', 'y = 0 + (20)(1.5) − ½(9.81)(1.5²)', 'y = 18.96 m'],
        answer: '19.0 m (3 s.f.)',
      },
    ],
    practiceTemplates: [
      {
        promptTemplate: 'A projectile begins at {y0} m with vertical velocity {v0y} m/s. Find y after {t} s.',
        solveFor: 'vertical-position',
        variableRanges: [
          { variableId: 'initial-vertical-position', min: 0, max: 20, step: 1 },
          { variableId: 'initial-vertical-velocity', min: 5, max: 30, step: 1 },
          { variableId: 'time', min: 0.5, max: 3, step: 0.5 },
        ],
      },
    ],
    dimensionalAnalysis: 'm = m + (m·s⁻¹)(s) − (m·s⁻²)(s²)',
    difficulty: 3,
    tags: ['projectile', 'vertical motion', 'gravity', 'trajectory', 'position'],
  },
]
