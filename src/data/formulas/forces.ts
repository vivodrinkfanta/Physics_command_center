import type { FormulaRecord } from '../../types/formula'
import { expression, operator, variable } from './expression'

export const forceFormulas: FormulaRecord[] = [
  {
    id: 'newton-second-law',
    name: 'Newton’s Second Law',
    category: 'Mechanics',
    subtopic: 'Forces',
    expression: expression('ΣF = ma', [
      operator('Σ'),
      variable('F', 'resultant-force'),
      operator('='),
      variable('m', 'mass'),
      variable('a', 'acceleration'),
    ]),
    description:
      'Connects the resultant external force on a constant-mass system to its acceleration.',
    variables: [
      { id: 'resultant-force', role: 'output' },
      {
        id: 'mass',
        role: 'input',
        control: { defaultValue: 4, min: 0.1, max: 50, step: 0.1 },
      },
      {
        id: 'acceleration',
        role: 'input',
        control: { defaultValue: 3, min: -15, max: 15, step: 0.1 },
      },
    ],
    constants: [],
    rearrangements: [
      {
        solveFor: 'acceleration',
        operation: 'Divide both sides by mass.',
        expression: expression('a = ΣF/m', [
          variable('a', 'acceleration'),
          operator('='),
          operator('Σ'),
          variable('F', 'resultant-force'),
          operator('/'),
          variable('m', 'mass'),
        ]),
      },
      {
        solveFor: 'mass',
        operation: 'Divide by acceleration, then exchange the two sides.',
        expression: expression('m = ΣF/a', [
          variable('m', 'mass'),
          operator('='),
          operator('Σ'),
          variable('F', 'resultant-force'),
          operator('/'),
          variable('a', 'acceleration'),
        ]),
      },
    ],
    assumptions: ['Mass is constant', 'The system is observed from an inertial reference frame'],
    commonMistakes: [
      'Using one force instead of the vector sum of all external forces',
      'Treating mass in grams as kilograms',
      'Assuming a moving object must have a forward resultant force',
    ],
    relatedFormulaIds: ['constant-acceleration-velocity', 'centripetal-acceleration'],
    simulationType: 'force-cart',
    graphTypes: ['acceleration-force', 'acceleration-mass'],
    workedExamples: [
      {
        prompt: 'A 5 kg cart experiences a resultant force of 20 N. Find its acceleration.',
        knownValues: [
          { variableId: 'mass', value: 5, unit: 'kg' },
          { variableId: 'resultant-force', value: 20, unit: 'N' },
        ],
        steps: ['a = ΣF/m', 'a = 20/5', 'a = 4 m/s²'],
        answer: '4 m/s²',
      },
    ],
    practiceTemplates: [
      {
        promptTemplate: 'A {m} kg object experiences a resultant force of {F} N. Find its acceleration.',
        solveFor: 'acceleration',
        variableRanges: [
          { variableId: 'mass', min: 1, max: 20, step: 1 },
          { variableId: 'resultant-force', min: -100, max: 100, step: 5 },
        ],
      },
    ],
    dimensionalAnalysis: {
      siSubstitution: 'N = kg × m/s²',
      baseSubstitution: 'M·L·T⁻² = M × L·T⁻²',
      leftDimensions: 'M·L·T⁻²',
      rightDimensions: 'M·L·T⁻²',
    },
    difficulty: 1,
    tags: ['force', 'mass', 'acceleration', 'newton', 'f=ma', 'resultant'],
  },
]
