import type { CurriculumTheme, CurriculumTopic, CurriculumTopicCode } from '../types/curriculum'
import { ibTopicLearningContent } from './ibTopicLearningContent'

export const ibPhysicsThemes: readonly CurriculumTheme[] = [
  { code: 'A', title: 'Space, time and motion', summary: 'Describe motion and connect interactions to changes in energy and momentum.' },
  { code: 'B', title: 'The particulate nature of matter', summary: 'Use particle models to explain thermal, gas, and electrical behaviour.' },
  { code: 'C', title: 'Wave behaviour', summary: 'Model oscillations, travelling waves, resonance, and wave phenomena.' },
  { code: 'D', title: 'Fields', summary: 'Represent gravitational, electric, and magnetic interactions through fields.' },
  { code: 'E', title: 'Nuclear and quantum physics', summary: 'Investigate atomic structure, quantum behaviour, decay, fission, and stars.' },
]

type CurriculumTopicScaffold = Pick<
  CurriculumTopic,
  'availability' | 'code' | 'formulaIds' | 'prerequisites' | 'simulations' | 'slug' | 'summary' | 'theme' | 'title'
>

const ibPhysicsTopicScaffold: readonly CurriculumTopicScaffold[] = [
  {
    code: 'A.1', slug: 'a-1', title: 'Kinematics', theme: 'A', availability: 'shared',
    summary: 'Represent one- and two-dimensional motion with vectors, graphs, and constant-acceleration models.',
    prerequisites: [],
    formulaIds: ['average-speed', 'average-acceleration', 'constant-acceleration-velocity', 'constant-acceleration-displacement', 'velocity-displacement', 'mean-velocity-displacement', 'projectile-vertical-position'],
    simulations: [
      { label: 'Motion and free-fall analyzer', href: '/formulas/average-speed', formulaId: 'average-speed' },
      { label: 'Constant-acceleration cart', href: '/formulas/constant-acceleration-velocity', formulaId: 'constant-acceleration-velocity' },
      { label: '2D projectile field', href: '/formulas/projectile-vertical-position', formulaId: 'projectile-vertical-position' },
    ],
  },
  {
    code: 'A.2', slug: 'a-2', title: 'Forces and momentum', theme: 'A', availability: 'shared',
    summary: 'Connect force models to linear and circular motion, impulse, and momentum change.',
    prerequisites: ['A.1'],
    formulaIds: ['newton-second-law', 'weight', 'friction-force', 'linear-momentum', 'impulse', 'centripetal-acceleration', 'centripetal-force'],
    simulations: [
      { label: 'Newton force cart', href: '/formulas/newton-second-law', formulaId: 'newton-second-law' },
      { label: 'Force-system workbench', href: '/formulas/friction-force', formulaId: 'friction-force' },
      { label: 'Two-cart collision lab', href: '/formulas/linear-momentum', formulaId: 'linear-momentum' },
      { label: 'Impulse cart', href: '/formulas/impulse', formulaId: 'impulse' },
      { label: 'Uniform orbit laboratory', href: '/formulas/centripetal-acceleration', formulaId: 'centripetal-acceleration' },
    ],
  },
  {
    code: 'A.3', slug: 'a-3', title: 'Work, energy and power', theme: 'A', availability: 'shared',
    summary: 'Account for energy stores and transfers using work, power, and conservation models.',
    prerequisites: ['A.1', 'A.2'],
    formulaIds: ['kinetic-energy', 'gravitational-potential-energy', 'elastic-potential-energy', 'work', 'power', 'mechanical-energy-conservation'],
    simulations: [
      { label: 'Kinetic energy runway', href: '/formulas/kinetic-energy', formulaId: 'kinetic-energy' },
      { label: 'Potential energy tower', href: '/formulas/gravitational-potential-energy', formulaId: 'gravitational-potential-energy' },
      { label: 'Energy-transfer bench', href: '/formulas/work', formulaId: 'work' },
    ],
  },
  {
    code: 'A.4', slug: 'a-4', title: 'Rigid body mechanics', theme: 'A', availability: 'hl-only',
    summary: 'Extend mechanics to rotational motion, torque, angular momentum, and rigid-body energy.',
    prerequisites: ['A.2', 'A.3'], formulaIds: [], simulations: [],
  },
  {
    code: 'A.5', slug: 'a-5', title: 'Galilean and special relativity', theme: 'A', availability: 'hl-only',
    summary: 'Compare reference frames and develop the consequences of invariant light speed.',
    prerequisites: ['A.1'], formulaIds: [], simulations: [],
  },
  {
    code: 'B.1', slug: 'b-1', title: 'Thermal energy transfers', theme: 'B', availability: 'shared',
    summary: 'Relate particle behaviour to temperature, internal energy, and thermal transfer.', prerequisites: [], formulaIds: [], simulations: [],
  },
  {
    code: 'B.2', slug: 'b-2', title: 'Greenhouse effect', theme: 'B', availability: 'shared',
    summary: 'Use radiation balance models to examine atmospheric warming.', prerequisites: ['B.1'], formulaIds: [], simulations: [],
  },
  {
    code: 'B.3', slug: 'b-3', title: 'Gas laws', theme: 'B', availability: 'shared',
    summary: 'Connect macroscopic gas behaviour to microscopic particle models.', prerequisites: ['B.1'], formulaIds: [], simulations: [],
  },
  {
    code: 'B.4', slug: 'b-4', title: 'Thermodynamics', theme: 'B', availability: 'hl-only',
    summary: 'Apply thermodynamic laws to energy transfers and cyclic processes.', prerequisites: ['B.1', 'B.3'], formulaIds: [], simulations: [],
  },
  {
    code: 'B.5', slug: 'b-5', title: 'Current and circuits', theme: 'B', availability: 'shared',
    summary: 'Model charge flow, potential difference, resistance, and electrical energy.', prerequisites: [], formulaIds: [], simulations: [],
  },
  {
    code: 'C.1', slug: 'c-1', title: 'Simple harmonic motion', theme: 'C', availability: 'shared-hl-extension',
    summary: 'Connect restoring forces, periodic motion, and energy exchange in oscillators.',
    prerequisites: ['A.2', 'A.3'],
    formulaIds: ['hookes-law', 'elastic-potential-energy'],
    simulations: [{ label: 'Mass-spring oscillator', href: '/formulas/hookes-law', formulaId: 'hookes-law' }],
  },
  {
    code: 'C.2', slug: 'c-2', title: 'Wave model', theme: 'C', availability: 'shared',
    summary: 'Represent travelling waves with measurable spatial and temporal quantities.', prerequisites: ['C.1'], formulaIds: [], simulations: [],
  },
  {
    code: 'C.3', slug: 'c-3', title: 'Wave phenomena', theme: 'C', availability: 'shared-hl-extension',
    summary: 'Use superposition to explain reflection, refraction, diffraction, and interference.', prerequisites: ['C.2'], formulaIds: [], simulations: [],
  },
  {
    code: 'C.4', slug: 'c-4', title: 'Standing waves and resonance', theme: 'C', availability: 'shared',
    summary: 'Model standing-wave patterns, natural frequencies, and resonant response.', prerequisites: ['C.2', 'C.3'], formulaIds: [], simulations: [],
  },
  {
    code: 'C.5', slug: 'c-5', title: 'Doppler effect', theme: 'C', availability: 'shared-hl-extension',
    summary: 'Relate relative motion to observed frequency shifts.', prerequisites: ['C.2'], formulaIds: [], simulations: [],
  },
  {
    code: 'D.1', slug: 'd-1', title: 'Gravitational fields', theme: 'D', availability: 'shared-hl-extension',
    summary: 'Represent gravitational interaction using field strength, potential energy, and orbital ideas.',
    prerequisites: ['A.2', 'A.3'],
    formulaIds: ['weight', 'gravitational-potential-energy'],
    simulations: [{ label: 'Potential energy tower', href: '/formulas/gravitational-potential-energy', formulaId: 'gravitational-potential-energy' }],
  },
  {
    code: 'D.2', slug: 'd-2', title: 'Electric and magnetic fields', theme: 'D', availability: 'shared-hl-extension',
    summary: 'Represent electric and magnetic interactions through field models.', prerequisites: [], formulaIds: [], simulations: [],
  },
  {
    code: 'D.3', slug: 'd-3', title: 'Motion in electromagnetic fields', theme: 'D', availability: 'shared',
    summary: 'Predict charged-particle motion in electric and magnetic fields.', prerequisites: ['A.2', 'D.2'], formulaIds: [], simulations: [],
  },
  {
    code: 'D.4', slug: 'd-4', title: 'Induction', theme: 'D', availability: 'hl-only',
    summary: 'Relate changing magnetic flux to induced electromotive effects.', prerequisites: ['D.2'], formulaIds: [], simulations: [],
  },
  {
    code: 'E.1', slug: 'e-1', title: 'Structure of the atom', theme: 'E', availability: 'shared-hl-extension',
    summary: 'Use evidence and models to describe atomic and nuclear structure.', prerequisites: [], formulaIds: [], simulations: [],
  },
  {
    code: 'E.2', slug: 'e-2', title: 'Quantum physics', theme: 'E', availability: 'hl-only',
    summary: 'Develop quantum models for matter and radiation.', prerequisites: ['E.1'], formulaIds: [], simulations: [],
  },
  {
    code: 'E.3', slug: 'e-3', title: 'Radioactive decay', theme: 'E', availability: 'shared-hl-extension',
    summary: 'Model random nuclear decay and its measurable statistical behaviour.', prerequisites: ['E.1'], formulaIds: [], simulations: [],
  },
  {
    code: 'E.4', slug: 'e-4', title: 'Fission', theme: 'E', availability: 'shared',
    summary: 'Explain nuclear fission, chain reactions, and energy release.', prerequisites: ['E.1'], formulaIds: [], simulations: [],
  },
  {
    code: 'E.5', slug: 'e-5', title: 'Fusion and stars', theme: 'E', availability: 'shared',
    summary: 'Connect nuclear fusion to stellar structure and evolution.', prerequisites: ['E.1'], formulaIds: [], simulations: [],
  },
]

export const ibPhysicsTopics: readonly CurriculumTopic[] = ibPhysicsTopicScaffold.map((topic) => ({
  ...topic,
  ...ibTopicLearningContent[topic.code],
  coverage: 'complete',
  coverageNote: 'Released learning pathway with study notes, relationship guidance, an evidence inquiry, and original practice.',
  practiceAvailable: true,
}))

export const curriculumTopicByCode = new Map(ibPhysicsTopics.map((topic) => [topic.code, topic]))
export const curriculumTopicBySlug = new Map(ibPhysicsTopics.map((topic) => [topic.slug, topic]))

export function findCurriculumTopic(value: string | undefined) {
  if (!value) return undefined
  return curriculumTopicBySlug.get(value) ?? curriculumTopicByCode.get(value.toUpperCase() as CurriculumTopicCode)
}
