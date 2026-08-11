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
        substitutionTemplate: 'a = ΣF/m = {F}/{m}',
        variableRanges: [
          { variableId: 'mass', placeholder: 'm', min: 1, max: 20, step: 1 },
          { variableId: 'resultant-force', placeholder: 'F', min: -100, max: 100, step: 5 },
        ],
      },
    ],
    predictionChallenges: [
      {
        id: 'double-resultant-force',
        prompt: 'If the resultant force doubles while mass stays constant, what happens to acceleration?',
        beforeValues: [
          { variableId: 'resultant-force', value: 20 },
          { variableId: 'mass', value: 5 },
        ],
        afterValues: [
          { variableId: 'resultant-force', value: 40 },
          { variableId: 'mass', value: 5 },
        ],
        options: [
          { id: 'doubles', label: 'It doubles' },
          { id: 'halves', label: 'It halves' },
          { id: 'unchanged', label: 'It stays unchanged' },
          { id: 'quadruples', label: 'It quadruples' },
        ],
        correctOptionId: 'doubles',
        explanation: 'With mass fixed, a = ΣF/m is directly proportional to resultant force.',
      },
      {
        id: 'double-mass',
        prompt: 'If mass doubles while the resultant force stays constant, what happens to acceleration?',
        beforeValues: [
          { variableId: 'resultant-force', value: 20 },
          { variableId: 'mass', value: 5 },
        ],
        afterValues: [
          { variableId: 'resultant-force', value: 20 },
          { variableId: 'mass', value: 10 },
        ],
        options: [
          { id: 'doubles', label: 'It doubles' },
          { id: 'halves', label: 'It halves' },
          { id: 'unchanged', label: 'It stays unchanged' },
          { id: 'reverses', label: 'It reverses direction' },
        ],
        correctOptionId: 'halves',
        explanation: 'With force fixed, acceleration is inversely proportional to mass.',
      },
      {
        id: 'reverse-resultant-force',
        prompt: 'If the resultant force reverses direction without changing magnitude, what happens to acceleration?',
        beforeValues: [
          { variableId: 'resultant-force', value: 20 },
          { variableId: 'mass', value: 5 },
        ],
        afterValues: [
          { variableId: 'resultant-force', value: -20 },
          { variableId: 'mass', value: 5 },
        ],
        options: [
          { id: 'reverses', label: 'It reverses with the same magnitude' },
          { id: 'zero', label: 'It becomes zero' },
          { id: 'unchanged', label: 'It stays unchanged' },
          { id: 'doubles', label: 'Its magnitude doubles' },
        ],
        correctOptionId: 'reverses',
        explanation: 'Acceleration follows the signed direction of the resultant force.',
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
