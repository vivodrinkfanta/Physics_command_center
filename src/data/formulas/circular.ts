import type { FormulaRecord } from '../../types/formula'
import { expression, operator, variable } from './expression'

export const circularMotionFormulas: FormulaRecord[] = [
  {
    id: 'centripetal-acceleration',
    name: 'Centripetal acceleration',
    category: 'Mechanics',
    subtopic: 'Circular Motion',
    expression: expression('a꜀ = v²/r', [
      variable('a꜀', 'centripetal-acceleration'),
      operator('='),
      variable('v²', 'speed'),
      operator('/'),
      variable('r', 'radius'),
    ]),
    description:
      'Calculates the inward acceleration required to maintain uniform circular motion.',
    variables: [
      { id: 'centripetal-acceleration', role: 'output' },
      {
        id: 'speed',
        role: 'input',
        control: { defaultValue: 8, min: 0, max: 30, step: 0.1 },
      },
      {
        id: 'radius',
        role: 'input',
        control: { defaultValue: 4, min: 0.1, max: 30, step: 0.1 },
      },
    ],
    constants: [],
    rearrangements: [
      {
        solveFor: 'radius',
        operation: 'Multiply by radius, then divide by centripetal acceleration.',
        expression: expression('r = v²/a꜀', [
          variable('r', 'radius'),
          operator('='),
          variable('v²', 'speed'),
          operator('/'),
          variable('a꜀', 'centripetal-acceleration'),
        ]),
      },
      {
        solveFor: 'speed',
        operation: 'Multiply by radius, then take the positive square root for speed.',
        expression: expression('v = √(a꜀r)', [
          variable('v', 'speed'),
          operator('='),
          operator('√'),
          operator('('),
          variable('a꜀', 'centripetal-acceleration'),
          variable('r', 'radius'),
          operator(')'),
        ]),
      },
    ],
    assumptions: ['The path is circular', 'Speed is constant for the uniform-motion model'],
    commonMistakes: [
      'Calling centripetal force a new type of force rather than a resultant direction',
      'Forgetting that speed is squared',
      'Pointing acceleration tangent to the path instead of toward the center',
    ],
    relatedFormulaIds: ['newton-second-law'],
    simulationType: 'rotating-mass',
    graphTypes: ['acceleration-speed', 'acceleration-radius', 'centripetal-force-mass'],
    workedExamples: [
      {
        prompt: 'An object moves at 6 m/s around a circle of radius 3 m. Find its centripetal acceleration.',
        knownValues: [
          { variableId: 'speed', value: 6, unit: 'm/s' },
          { variableId: 'radius', value: 3, unit: 'm' },
        ],
        steps: ['a꜀ = v²/r', 'a꜀ = 6²/3', 'a꜀ = 12 m/s²'],
        answer: '12 m/s² inward',
      },
    ],
    practiceTemplates: [
      {
        promptTemplate: 'An object moves at {v} m/s in a circle of radius {r} m. Find a꜀.',
        solveFor: 'centripetal-acceleration',
        substitutionTemplate: 'a꜀ = v²/r = ({v})²/{r}',
        variableRanges: [
          { variableId: 'speed', placeholder: 'v', min: 2, max: 20, step: 1 },
          { variableId: 'radius', placeholder: 'r', min: 1, max: 15, step: 1 },
        ],
      },
    ],
    dimensionalAnalysis: {
      siSubstitution: 'm/s² = (m/s)² / m',
      baseSubstitution: 'L·T⁻² = (L·T⁻¹)² / L',
      leftDimensions: 'L·T⁻²',
      rightDimensions: 'L·T⁻²',
    },
    difficulty: 2,
    tags: ['centripetal', 'circular', 'radius', 'speed', 'inward acceleration'],
  },
]
