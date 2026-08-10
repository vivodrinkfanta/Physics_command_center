import type { FormulaRecord } from '../../types/formula'
import { expression, operator, variable } from './expression'

export const oscillationFormulas: FormulaRecord[] = [
  {
    id: 'hookes-law',
    name: 'Hooke’s law',
    category: 'Mechanics',
    subtopic: 'Oscillations',
    expression: expression('F = −kx', [
      variable('F', 'spring-force'),
      operator('='),
      operator('−'),
      variable('k', 'spring-constant'),
      variable('x', 'spring-displacement'),
    ]),
    description:
      'Models the restoring force from an ideal spring within its elastic limit.',
    variables: [
      { id: 'spring-force', role: 'output' },
      {
        id: 'spring-constant',
        role: 'input',
        control: { defaultValue: 40, min: 1, max: 200, step: 1 },
      },
      {
        id: 'spring-displacement',
        role: 'input',
        control: { defaultValue: 0.1, min: -0.5, max: 0.5, step: 0.01 },
      },
    ],
    constants: [],
    rearrangements: [
      {
        solveFor: 'spring-constant',
        operation: 'Divide both sides by negative displacement.',
        expression: expression('k = −F/x', [
          variable('k', 'spring-constant'),
          operator('='),
          operator('−'),
          variable('F', 'spring-force'),
          operator('/'),
          variable('x', 'spring-displacement'),
        ]),
      },
      {
        solveFor: 'spring-displacement',
        operation: 'Divide both sides by negative spring constant.',
        expression: expression('x = −F/k', [
          variable('x', 'spring-displacement'),
          operator('='),
          operator('−'),
          variable('F', 'spring-force'),
          operator('/'),
          variable('k', 'spring-constant'),
        ]),
      },
    ],
    assumptions: ['The spring obeys Hooke’s law', 'Displacement remains within the elastic limit'],
    commonMistakes: [
      'Dropping the minus sign and losing the restoring-force direction',
      'Using spring length instead of displacement from equilibrium',
      'Using centimetres without converting to metres',
    ],
    relatedFormulaIds: ['kinetic-energy'],
    simulationType: 'mass-spring',
    graphTypes: ['force-displacement'],
    workedExamples: [
      {
        prompt: 'A spring with k = 50 N/m is stretched 0.20 m. Find the restoring force.',
        knownValues: [
          { variableId: 'spring-constant', value: 50, unit: 'N/m' },
          { variableId: 'spring-displacement', value: 0.2, unit: 'm' },
        ],
        steps: ['F = −kx', 'F = −(50)(0.20)', 'F = −10 N'],
        answer: '−10 N (toward equilibrium)',
      },
    ],
    practiceTemplates: [
      {
        promptTemplate: 'A spring with stiffness {k} N/m is displaced by {x} m. Find its restoring force.',
        solveFor: 'spring-force',
        variableRanges: [
          { variableId: 'spring-constant', min: 10, max: 150, step: 10 },
          { variableId: 'spring-displacement', min: -0.4, max: 0.4, step: 0.05 },
        ],
      },
    ],
    dimensionalAnalysis: 'N = (N·m⁻¹)(m)',
    difficulty: 2,
    tags: ['spring', 'hooke', 'restoring force', 'stiffness', 'oscillation'],
  },
]
