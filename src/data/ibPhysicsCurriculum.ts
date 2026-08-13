import type { CurriculumTheme, CurriculumTopic, CurriculumTopicCode } from '../types/curriculum'

export const ibPhysicsThemes: readonly CurriculumTheme[] = [
  { code: 'A', title: 'Space, time and motion', summary: 'Describe motion and connect interactions to changes in energy and momentum.' },
  { code: 'B', title: 'The particulate nature of matter', summary: 'Use particle models to explain thermal, gas, and electrical behaviour.' },
  { code: 'C', title: 'Wave behaviour', summary: 'Model oscillations, travelling waves, resonance, and wave phenomena.' },
  { code: 'D', title: 'Fields', summary: 'Represent gravitational, electric, and magnetic interactions through fields.' },
  { code: 'E', title: 'Nuclear and quantum physics', summary: 'Investigate atomic structure, quantum behaviour, decay, fission, and stars.' },
]

export const ibPhysicsTopics: readonly CurriculumTopic[] = [
  {
    code: 'A.1', slug: 'a-1', title: 'Kinematics', theme: 'A', availability: 'shared',
    summary: 'Represent one- and two-dimensional motion with vectors, graphs, and constant-acceleration models.',
    objectives: ['Distinguish distance, displacement, speed, velocity, and acceleration.', 'Interpret motion graphs and connect their gradients and areas.', 'Model constant acceleration, free fall, and ideal projectile motion.'],
    concepts: ['Reference frames and vector components', 'Instantaneous and average rates', 'Motion graphs', 'Constant acceleration', 'Free fall and projectiles'],
    skills: ['Resolve vectors', 'Read gradients and areas', 'Select a constant-acceleration relationship', 'State model assumptions'],
    prerequisites: [],
    formulaIds: ['average-speed', 'average-acceleration', 'constant-acceleration-velocity', 'constant-acceleration-displacement', 'velocity-displacement', 'mean-velocity-displacement', 'projectile-vertical-position'],
    simulations: [
      { label: 'Motion and free-fall analyzer', href: '/formulas/average-speed', formulaId: 'average-speed' },
      { label: 'Constant-acceleration cart', href: '/formulas/constant-acceleration-velocity', formulaId: 'constant-acceleration-velocity' },
      { label: '2D projectile field', href: '/formulas/projectile-vertical-position', formulaId: 'projectile-vertical-position' },
    ],
    coverage: 'complete', coverageNote: 'Complete pathway for the A.1 motion models represented in this mechanics release.', practiceAvailable: true,
  },
  {
    code: 'A.2', slug: 'a-2', title: 'Forces and momentum', theme: 'A', availability: 'shared',
    summary: 'Connect force models to linear and circular motion, impulse, and momentum change.',
    objectives: ['Construct and interpret free-body diagrams.', 'Apply Newton’s laws to resultant-force models.', 'Use impulse and momentum conservation in collision reasoning.'],
    concepts: ['Resultant force and inertia', 'Contact and non-contact forces', 'Impulse and momentum', 'Conservation systems', 'Uniform circular motion'],
    skills: ['Draw force diagrams', 'Choose a system boundary', 'Track signs in collisions', 'Evaluate idealized force models'],
    prerequisites: ['A.1'],
    formulaIds: ['newton-second-law', 'weight', 'friction-force', 'linear-momentum', 'impulse', 'centripetal-acceleration', 'centripetal-force'],
    simulations: [
      { label: 'Newton force cart', href: '/formulas/newton-second-law', formulaId: 'newton-second-law' },
      { label: 'Force-system workbench', href: '/formulas/friction-force', formulaId: 'friction-force' },
      { label: 'Two-cart collision lab', href: '/formulas/linear-momentum', formulaId: 'linear-momentum' },
      { label: 'Impulse cart', href: '/formulas/impulse', formulaId: 'impulse' },
      { label: 'Uniform orbit laboratory', href: '/formulas/centripetal-acceleration', formulaId: 'centripetal-acceleration' },
    ],
    coverage: 'partial', coverageNote: 'Strong mechanics coverage; additional syllabus detail and experimental treatment remain to be added.', practiceAvailable: true,
  },
  {
    code: 'A.3', slug: 'a-3', title: 'Work, energy and power', theme: 'A', availability: 'shared',
    summary: 'Account for energy stores and transfers using work, power, and conservation models.',
    objectives: ['Calculate work done by a force and the rate of energy transfer.', 'Relate kinetic and potential energy changes.', 'Apply conservation while identifying dissipative transfers.'],
    concepts: ['Work as energy transfer', 'Kinetic and potential stores', 'Power', 'Conservation and dissipation'],
    skills: ['Choose an energy system', 'Build an energy ledger', 'Use scalar products in work', 'Explain efficiency and losses'],
    prerequisites: ['A.1', 'A.2'],
    formulaIds: ['kinetic-energy', 'gravitational-potential-energy', 'elastic-potential-energy', 'work', 'power', 'mechanical-energy-conservation'],
    simulations: [
      { label: 'Kinetic energy runway', href: '/formulas/kinetic-energy', formulaId: 'kinetic-energy' },
      { label: 'Potential energy tower', href: '/formulas/gravitational-potential-energy', formulaId: 'gravitational-potential-energy' },
      { label: 'Energy-transfer bench', href: '/formulas/work', formulaId: 'work' },
    ],
    coverage: 'partial', coverageNote: 'Core mechanical energy models are live; broader applications and efficiency practice are still expanding.', practiceAvailable: true,
  },
  {
    code: 'A.4', slug: 'a-4', title: 'Rigid body mechanics', theme: 'A', availability: 'hl-only',
    summary: 'Extend mechanics to rotational motion, torque, angular momentum, and rigid-body energy.',
    objectives: [], concepts: [], skills: [], prerequisites: ['A.2', 'A.3'], formulaIds: [], simulations: [],
    coverage: 'planned', coverageNote: 'HL-only module planned; no empty learning shell is presented as complete.', practiceAvailable: false,
  },
  {
    code: 'A.5', slug: 'a-5', title: 'Galilean and special relativity', theme: 'A', availability: 'hl-only',
    summary: 'Compare reference frames and develop the consequences of invariant light speed.',
    objectives: [], concepts: [], skills: [], prerequisites: ['A.1'], formulaIds: [], simulations: [],
    coverage: 'planned', coverageNote: 'HL-only module planned.', practiceAvailable: false,
  },
  {
    code: 'B.1', slug: 'b-1', title: 'Thermal energy transfers', theme: 'B', availability: 'shared',
    summary: 'Relate particle behaviour to temperature, internal energy, and thermal transfer.', objectives: [], concepts: [], skills: [], prerequisites: [], formulaIds: [], simulations: [], coverage: 'planned', coverageNote: 'Planned beyond the current mechanics release.', practiceAvailable: false,
  },
  {
    code: 'B.2', slug: 'b-2', title: 'Greenhouse effect', theme: 'B', availability: 'shared',
    summary: 'Use radiation balance models to examine atmospheric warming.', objectives: [], concepts: [], skills: [], prerequisites: ['B.1'], formulaIds: [], simulations: [], coverage: 'planned', coverageNote: 'Planned beyond the current mechanics release.', practiceAvailable: false,
  },
  {
    code: 'B.3', slug: 'b-3', title: 'Gas laws', theme: 'B', availability: 'shared',
    summary: 'Connect macroscopic gas behaviour to microscopic particle models.', objectives: [], concepts: [], skills: [], prerequisites: ['B.1'], formulaIds: [], simulations: [], coverage: 'planned', coverageNote: 'Planned beyond the current mechanics release.', practiceAvailable: false,
  },
  {
    code: 'B.4', slug: 'b-4', title: 'Thermodynamics', theme: 'B', availability: 'hl-only',
    summary: 'Apply thermodynamic laws to energy transfers and cyclic processes.', objectives: [], concepts: [], skills: [], prerequisites: ['B.1', 'B.3'], formulaIds: [], simulations: [], coverage: 'planned', coverageNote: 'HL-only module planned.', practiceAvailable: false,
  },
  {
    code: 'B.5', slug: 'b-5', title: 'Current and circuits', theme: 'B', availability: 'shared',
    summary: 'Model charge flow, potential difference, resistance, and electrical energy.', objectives: [], concepts: [], skills: [], prerequisites: [], formulaIds: [], simulations: [], coverage: 'planned', coverageNote: 'Planned beyond the current mechanics release.', practiceAvailable: false,
  },
  {
    code: 'C.1', slug: 'c-1', title: 'Simple harmonic motion', theme: 'C', availability: 'shared-hl-extension',
    summary: 'Connect restoring forces, periodic motion, and energy exchange in oscillators.',
    objectives: ['Recognize a restoring force proportional and opposite to displacement.', 'Connect displacement, force, and energy through a mass–spring cycle.'],
    concepts: ['Equilibrium and amplitude', 'Restoring force', 'Periodicity', 'Energy exchange'],
    skills: ['Interpret phase through a cycle', 'Read displacement-time graphs', 'State ideal oscillator assumptions'],
    prerequisites: ['A.2', 'A.3'],
    formulaIds: ['hookes-law', 'elastic-potential-energy'],
    simulations: [{ label: 'Mass-spring oscillator', href: '/formulas/hookes-law', formulaId: 'hookes-law' }],
    coverage: 'partial', coverageNote: 'The mass–spring model is complete; wider SHM relationships and HL extensions are planned.', practiceAvailable: false,
  },
  {
    code: 'C.2', slug: 'c-2', title: 'Wave model', theme: 'C', availability: 'shared',
    summary: 'Represent travelling waves with measurable spatial and temporal quantities.', objectives: [], concepts: [], skills: [], prerequisites: ['C.1'], formulaIds: [], simulations: [], coverage: 'planned', coverageNote: 'Planned beyond the current mechanics release.', practiceAvailable: false,
  },
  {
    code: 'C.3', slug: 'c-3', title: 'Wave phenomena', theme: 'C', availability: 'shared-hl-extension',
    summary: 'Use superposition to explain reflection, refraction, diffraction, and interference.', objectives: [], concepts: [], skills: [], prerequisites: ['C.2'], formulaIds: [], simulations: [], coverage: 'planned', coverageNote: 'Shared topic with additional HL content; planned.', practiceAvailable: false,
  },
  {
    code: 'C.4', slug: 'c-4', title: 'Standing waves and resonance', theme: 'C', availability: 'shared',
    summary: 'Model standing-wave patterns, natural frequencies, and resonant response.', objectives: [], concepts: [], skills: [], prerequisites: ['C.2', 'C.3'], formulaIds: [], simulations: [], coverage: 'planned', coverageNote: 'Planned beyond the current mechanics release.', practiceAvailable: false,
  },
  {
    code: 'C.5', slug: 'c-5', title: 'Doppler effect', theme: 'C', availability: 'shared-hl-extension',
    summary: 'Relate relative motion to observed frequency shifts.', objectives: [], concepts: [], skills: [], prerequisites: ['C.2'], formulaIds: [], simulations: [], coverage: 'planned', coverageNote: 'Shared topic with additional HL content; planned.', practiceAvailable: false,
  },
  {
    code: 'D.1', slug: 'd-1', title: 'Gravitational fields', theme: 'D', availability: 'shared-hl-extension',
    summary: 'Represent gravitational interaction using field strength, potential energy, and orbital ideas.',
    objectives: ['Relate weight to gravitational field strength.', 'Use near-surface gravitational potential energy with an explicit reference level.'],
    concepts: ['Field strength', 'Weight', 'Potential energy and reference levels', 'Near-surface approximation'],
    skills: ['Distinguish mass and weight', 'Choose a potential-energy reference', 'Identify limits of constant-g models'],
    prerequisites: ['A.2', 'A.3'],
    formulaIds: ['weight', 'gravitational-potential-energy'],
    simulations: [{ label: 'Potential energy tower', href: '/formulas/gravitational-potential-energy', formulaId: 'gravitational-potential-energy' }],
    coverage: 'partial', coverageNote: 'Near-surface gravity is live; inverse-square fields, potentials, orbits, and HL extensions are planned.', practiceAvailable: false,
  },
  {
    code: 'D.2', slug: 'd-2', title: 'Electric and magnetic fields', theme: 'D', availability: 'shared-hl-extension',
    summary: 'Represent electric and magnetic interactions through field models.', objectives: [], concepts: [], skills: [], prerequisites: [], formulaIds: [], simulations: [], coverage: 'planned', coverageNote: 'Shared topic with additional HL content; planned.', practiceAvailable: false,
  },
  {
    code: 'D.3', slug: 'd-3', title: 'Motion in electromagnetic fields', theme: 'D', availability: 'shared',
    summary: 'Predict charged-particle motion in electric and magnetic fields.', objectives: [], concepts: [], skills: [], prerequisites: ['A.2', 'D.2'], formulaIds: [], simulations: [], coverage: 'planned', coverageNote: 'Planned beyond the current mechanics release.', practiceAvailable: false,
  },
  {
    code: 'D.4', slug: 'd-4', title: 'Induction', theme: 'D', availability: 'hl-only',
    summary: 'Relate changing magnetic flux to induced electromotive effects.', objectives: [], concepts: [], skills: [], prerequisites: ['D.2'], formulaIds: [], simulations: [], coverage: 'planned', coverageNote: 'HL-only module planned.', practiceAvailable: false,
  },
  {
    code: 'E.1', slug: 'e-1', title: 'Structure of the atom', theme: 'E', availability: 'shared-hl-extension',
    summary: 'Use evidence and models to describe atomic and nuclear structure.', objectives: [], concepts: [], skills: [], prerequisites: [], formulaIds: [], simulations: [], coverage: 'planned', coverageNote: 'Shared topic with additional HL content; planned.', practiceAvailable: false,
  },
  {
    code: 'E.2', slug: 'e-2', title: 'Quantum physics', theme: 'E', availability: 'hl-only',
    summary: 'Develop quantum models for matter and radiation.', objectives: [], concepts: [], skills: [], prerequisites: ['E.1'], formulaIds: [], simulations: [], coverage: 'planned', coverageNote: 'HL-only module planned.', practiceAvailable: false,
  },
  {
    code: 'E.3', slug: 'e-3', title: 'Radioactive decay', theme: 'E', availability: 'shared-hl-extension',
    summary: 'Model random nuclear decay and its measurable statistical behaviour.', objectives: [], concepts: [], skills: [], prerequisites: ['E.1'], formulaIds: [], simulations: [], coverage: 'planned', coverageNote: 'Shared topic with additional HL content; planned.', practiceAvailable: false,
  },
  {
    code: 'E.4', slug: 'e-4', title: 'Fission', theme: 'E', availability: 'shared',
    summary: 'Explain nuclear fission, chain reactions, and energy release.', objectives: [], concepts: [], skills: [], prerequisites: ['E.1'], formulaIds: [], simulations: [], coverage: 'planned', coverageNote: 'Planned beyond the current mechanics release.', practiceAvailable: false,
  },
  {
    code: 'E.5', slug: 'e-5', title: 'Fusion and stars', theme: 'E', availability: 'shared',
    summary: 'Connect nuclear fusion to stellar structure and evolution.', objectives: [], concepts: [], skills: [], prerequisites: ['E.1'], formulaIds: [], simulations: [], coverage: 'planned', coverageNote: 'Planned beyond the current mechanics release.', practiceAvailable: false,
  },
]

export const curriculumTopicByCode = new Map(ibPhysicsTopics.map((topic) => [topic.code, topic]))
export const curriculumTopicBySlug = new Map(ibPhysicsTopics.map((topic) => [topic.slug, topic]))

export function findCurriculumTopic(value: string | undefined) {
  if (!value) return undefined
  return curriculumTopicBySlug.get(value) ?? curriculumTopicByCode.get(value.toUpperCase() as CurriculumTopicCode)
}
