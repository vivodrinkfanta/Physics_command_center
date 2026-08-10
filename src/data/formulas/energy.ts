import type { FormulaRecord } from '../../types/formula'
import { expression, number, operator, variable } from './expression'

export const energyFormulas: FormulaRecord[] = [
  {
    id: 'kinetic-energy',
    name: 'Kinetic energy',
    category: 'Mechanics',
    subtopic: 'Energy',
    expression: expression('Eₖ = ½mv²', [
      variable('Eₖ', 'kinetic-energy'),
      operator('='),
      number('½'),
      variable('m', 'mass'),
      variable('v²', 'speed'),
    ]),
    description: 'Calculates the energy associated with translational motion.',
    variables: [
      { id: 'kinetic-energy', role: 'output' },
      {
        id: 'mass',
        role: 'input',
        control: { defaultValue: 4, min: 0.1, max: 50, step: 0.1 },
      },
      {
        id: 'speed',
        role: 'input',
        control: { defaultValue: 6, min: 0, max: 40, step: 0.1 },
      },
    ],
    constants: [],
    rearrangements: [
      {
        solveFor: 'mass',
        expression: expression('m = 2Eₖ/v²', [
          variable('m', 'mass'),
          operator('='),
          number('2'),
          variable('Eₖ', 'kinetic-energy'),
          operator('/'),
          variable('v²', 'speed'),
        ]),
      },
      {
        solveFor: 'speed',
        expression: expression('v = √(2Eₖ/m)', [
          variable('v', 'speed'),
          operator('='),
          operator('√'),
          operator('('),
          number('2'),
          variable('Eₖ', 'kinetic-energy'),
          operator('/'),
          variable('m', 'mass'),
          operator(')'),
        ]),
      },
    ],
    assumptions: ['Speed is non-relativistic', 'The modeled energy is translational kinetic energy'],
    commonMistakes: [
      'Forgetting that speed is squared',
      'Using mass in grams without converting to kilograms',
      'Giving kinetic energy a negative sign when velocity is negative',
    ],
    relatedFormulaIds: ['gravitational-potential-energy', 'linear-momentum'],
    simulationType: 'moving-mass',
    graphTypes: ['kinetic-energy-speed', 'kinetic-energy-mass'],
    workedExamples: [
      {
        prompt: 'A 5 kg object travels at 8 m/s. Calculate its kinetic energy.',
        knownValues: [
          { variableId: 'mass', value: 5, unit: 'kg' },
          { variableId: 'speed', value: 8, unit: 'm/s' },
        ],
        steps: ['Eₖ = ½mv²', 'Eₖ = ½(5)(8²)', 'Eₖ = 160 J'],
        answer: '160 J',
      },
    ],
    practiceTemplates: [
      {
        promptTemplate: 'A {m} kg object moves at {v} m/s. Calculate its kinetic energy.',
        solveFor: 'kinetic-energy',
        variableRanges: [
          { variableId: 'mass', min: 1, max: 20, step: 1 },
          { variableId: 'speed', min: 1, max: 25, step: 1 },
        ],
      },
    ],
    dimensionalAnalysis: 'J = kg·(m·s⁻¹)² = kg·m²·s⁻²',
    difficulty: 1,
    tags: ['kinetic', 'energy', 'speed', 'mass', 'motion'],
  },
  {
    id: 'gravitational-potential-energy',
    name: 'Gravitational potential energy',
    category: 'Mechanics',
    subtopic: 'Energy',
    expression: expression('ΔEₚ = mgΔh', [
      operator('Δ'),
      variable('Eₚ', 'gravitational-potential-energy'),
      operator('='),
      variable('m', 'mass'),
      variable('g', 'gravitational-field-strength'),
      operator('Δ'),
      variable('h', 'height'),
    ]),
    description:
      'Calculates the change in gravitational potential energy near a planetary surface.',
    variables: [
      { id: 'gravitational-potential-energy', role: 'output' },
      {
        id: 'mass',
        role: 'input',
        control: { defaultValue: 3, min: 0.1, max: 50, step: 0.1 },
      },
      {
        id: 'gravitational-field-strength',
        role: 'parameter',
        control: { defaultValue: 9.81, min: 1.62, max: 24.79, step: 0.01 },
      },
      {
        id: 'height',
        role: 'input',
        control: { defaultValue: 5, min: -20, max: 50, step: 0.1 },
      },
    ],
    constants: [],
    rearrangements: [
      {
        solveFor: 'height',
        expression: expression('Δh = ΔEₚ/(mg)', [
          operator('Δ'),
          variable('h', 'height'),
          operator('='),
          operator('Δ'),
          variable('Eₚ', 'gravitational-potential-energy'),
          operator('/'),
          operator('('),
          variable('m', 'mass'),
          variable('g', 'gravitational-field-strength'),
          operator(')'),
        ]),
      },
    ],
    assumptions: ['Gravitational field strength is uniform over the height change', 'A reference height is chosen'],
    commonMistakes: [
      'Treating potential energy as absolute without defining a zero level',
      'Using height in centimetres without conversion',
      'Using 9.81 N rather than 9.81 N/kg or m/s² for g',
    ],
    relatedFormulaIds: ['kinetic-energy'],
    simulationType: 'raised-mass',
    graphTypes: ['potential-energy-height', 'potential-energy-mass'],
    workedExamples: [
      {
        prompt: 'A 2 kg object is lifted vertically by 5 m on Earth. Find its potential energy change.',
        knownValues: [
          { variableId: 'mass', value: 2, unit: 'kg' },
          { variableId: 'height', value: 5, unit: 'm' },
          { variableId: 'gravitational-field-strength', value: 9.81, unit: 'm/s²' },
        ],
        steps: ['ΔEₚ = mgΔh', 'ΔEₚ = (2)(9.81)(5)', 'ΔEₚ = 98.1 J'],
        answer: '98.1 J',
      },
    ],
    practiceTemplates: [
      {
        promptTemplate: 'A {m} kg object rises by {h} m. Find its change in GPE using g = 9.81 m/s².',
        solveFor: 'gravitational-potential-energy',
        variableRanges: [
          { variableId: 'mass', min: 1, max: 20, step: 1 },
          { variableId: 'height', min: 1, max: 30, step: 1 },
        ],
      },
    ],
    dimensionalAnalysis: 'J = kg·(m·s⁻²)·m = kg·m²·s⁻²',
    difficulty: 1,
    tags: ['potential energy', 'height', 'gravity', 'mass', 'gpe'],
  },
]
