import type { FormulaRecord } from '../../types/formula'
import { expression, operator, variable } from './expression'

export const momentumFormulas: FormulaRecord[] = [
  {
    id: 'linear-momentum',
    name: 'Linear momentum',
    category: 'Mechanics',
    subtopic: 'Momentum',
    expression: expression('p = mv', [
      variable('p', 'momentum'),
      operator('='),
      variable('m', 'mass'),
      variable('v', 'velocity'),
    ]),
    description: 'Calculates an object’s linear momentum from its mass and velocity.',
    variables: [
      { id: 'momentum', role: 'output' },
      {
        id: 'mass',
        role: 'input',
        control: { defaultValue: 2, min: 0.1, max: 50, step: 0.1 },
      },
      {
        id: 'velocity',
        role: 'input',
        control: { defaultValue: 5, min: -30, max: 30, step: 0.1 },
      },
    ],
    constants: [],
    rearrangements: [
      {
        solveFor: 'mass',
        expression: expression('m = p/v', [
          variable('m', 'mass'),
          operator('='),
          variable('p', 'momentum'),
          operator('/'),
          variable('v', 'velocity'),
        ]),
      },
      {
        solveFor: 'velocity',
        expression: expression('v = p/m', [
          variable('v', 'velocity'),
          operator('='),
          variable('p', 'momentum'),
          operator('/'),
          variable('m', 'mass'),
        ]),
      },
    ],
    assumptions: ['Motion is classical and non-relativistic', 'Mass is constant'],
    commonMistakes: [
      'Ignoring the direction sign of velocity',
      'Confusing momentum with kinetic energy',
      'Using grams instead of kilograms',
    ],
    relatedFormulaIds: ['kinetic-energy', 'newton-second-law'],
    simulationType: 'momentum-cart',
    graphTypes: ['momentum-velocity', 'momentum-mass'],
    workedExamples: [
      {
        prompt: 'A 1200 kg car moves east at 15 m/s. Find its momentum.',
        knownValues: [
          { variableId: 'mass', value: 1200, unit: 'kg' },
          { variableId: 'velocity', value: 15, unit: 'm/s east' },
        ],
        steps: ['p = mv', 'p = (1200)(15)', 'p = 18 000 kg·m/s east'],
        answer: '18 000 kg·m/s east',
      },
    ],
    practiceTemplates: [
      {
        promptTemplate: 'A {m} kg cart travels at {v} m/s. Calculate its momentum.',
        solveFor: 'momentum',
        variableRanges: [
          { variableId: 'mass', min: 1, max: 20, step: 1 },
          { variableId: 'velocity', min: -15, max: 15, step: 1 },
        ],
      },
    ],
    dimensionalAnalysis: 'kg·m·s⁻¹ = kg(m·s⁻¹)',
    difficulty: 1,
    tags: ['momentum', 'mass', 'velocity', 'collision', 'p=mv'],
  },
]
