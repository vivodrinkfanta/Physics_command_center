import type { MechanicsTopic, TopicIconName } from '../types/topic'

export const mechanicsTopics: MechanicsTopic[] = [
  {
    id: 'kinematics',
    icon: 'kinematics',
    name: 'Kinematics',
    sequence: 1,
    aliases: ['motion', 'movement', 'suvat'],
    summary:
      'Describe how position and velocity change through time, without yet asking what caused the motion.',
    equation: 'v = u + at',
    equationName: 'Constant-acceleration velocity',
    dimensionalLine: 'm·s⁻¹ = m·s⁻¹ + (m·s⁻²)(s)',
    insight:
      'Acceleration sets the slope of a velocity–time graph. The area beneath that graph accumulates displacement.',
    assumptions: ['Constant acceleration', 'One-dimensional motion for this relation'],
    concepts: [
      {
        name: 'Displacement',
        symbol: 'Δx',
        description: 'Directed change from an initial position to a final position.',
      },
      {
        name: 'Velocity',
        symbol: 'v',
        description: 'Rate of change of displacement, including direction.',
      },
      {
        name: 'Acceleration',
        symbol: 'a',
        description: 'Rate at which velocity changes through time.',
      },
      {
        name: 'Motion graphs',
        symbol: 'x(t)',
        description: 'Position, velocity, and acceleration shown as linked functions of time.',
      },
    ],
    investigation: {
      title: 'Read motion from a graph',
      prompt:
        'If acceleration stays positive while velocity crosses zero, what happens to the object before and after that instant?',
      variables: ['initial velocity', 'acceleration', 'time'],
    },
    connections: ['forces', 'projectiles'],
  },
  {
    id: 'forces',
    icon: 'forces',
    name: 'Forces',
    sequence: 2,
    aliases: ['newton', 'dynamics', 'f=ma', 'weight', 'friction'],
    summary:
      'Connect interactions to changes in motion using free-body diagrams and Newton’s laws.',
    equation: 'ΣF = ma',
    equationName: 'Newton’s Second Law',
    dimensionalLine: 'N = kg·m·s⁻²',
    insight:
      'Acceleration follows the resultant force, not any single force. Balanced forces can exist while an object is moving.',
    assumptions: ['Constant mass', 'Measured in an inertial reference frame'],
    concepts: [
      {
        name: 'Resultant force',
        symbol: 'ΣF',
        description: 'Vector sum of every external force acting on the system.',
      },
      {
        name: 'Inertia',
        symbol: 'm',
        description: 'Resistance to acceleration, represented by inertial mass.',
      },
      {
        name: 'Free-body diagrams',
        symbol: 'FBD',
        description: 'A system boundary with every external force represented as a vector.',
      },
      {
        name: 'Contact forces',
        symbol: 'N, f, T',
        description: 'Normal force, friction, and tension created through interactions.',
      },
    ],
    investigation: {
      title: 'Separate force from motion',
      prompt:
        'A cart moves right at constant velocity. What must be true about the horizontal forces even though it is moving?',
      variables: ['resultant force', 'mass', 'acceleration'],
    },
    connections: ['kinematics', 'energy', 'circular-motion'],
  },
  {
    id: 'energy',
    icon: 'energy',
    name: 'Energy',
    sequence: 3,
    aliases: ['work', 'power', 'kinetic', 'potential', 'energy conservation'],
    summary:
      'Track how physical systems store, transfer, and dissipate the capacity to cause change.',
    equation: 'Eₖ = ½mv²',
    equationName: 'Translational kinetic energy',
    dimensionalLine: 'J = kg·m²·s⁻²',
    insight:
      'Velocity is squared: doubling speed makes kinetic energy four times larger while doubling mass only doubles it.',
    assumptions: ['Non-relativistic speed', 'Translational motion of the chosen system'],
    concepts: [
      {
        name: 'Kinetic energy',
        symbol: 'Eₖ',
        description: 'Energy associated with the translational motion of a system.',
      },
      {
        name: 'Potential energy',
        symbol: 'Eₚ',
        description: 'Energy stored through position or configuration within an interaction.',
      },
      {
        name: 'Work',
        symbol: 'W',
        description: 'Energy transferred when a force acts through a displacement.',
      },
      {
        name: 'Power',
        symbol: 'P',
        description: 'Rate at which energy is transferred or work is done.',
      },
    ],
    investigation: {
      title: 'Predict a nonlinear change',
      prompt:
        'Keep mass fixed and double velocity. Predict the new kinetic energy before checking the equation.',
      variables: ['mass', 'velocity', 'kinetic energy'],
    },
    connections: ['forces', 'momentum', 'oscillations'],
  },
  {
    id: 'momentum',
    icon: 'momentum',
    name: 'Momentum',
    sequence: 4,
    aliases: ['impulse', 'collision', 'momentum conservation', 'p=mv'],
    summary:
      'Analyze interactions over time and predict motion before and after collisions.',
    equation: 'p = mv',
    equationName: 'Linear momentum',
    dimensionalLine: 'kg·m·s⁻¹ = kg(m·s⁻¹)',
    insight:
      'Momentum keeps the sign of velocity. Two objects can have equal kinetic energies but opposite momenta.',
    assumptions: ['Classical, non-relativistic motion', 'Closed system for momentum conservation'],
    concepts: [
      {
        name: 'Momentum',
        symbol: 'p',
        description: 'Vector quantity determined by mass and velocity.',
      },
      {
        name: 'Impulse',
        symbol: 'J',
        description: 'Change in momentum produced by force acting over time.',
      },
      {
        name: 'Conservation',
        symbol: 'Σp',
        description: 'Total momentum remains constant when external impulse is negligible.',
      },
      {
        name: 'Collisions',
        symbol: 'e',
        description: 'Interactions classified by how momentum and kinetic energy behave.',
      },
    ],
    investigation: {
      title: 'Design a safer collision',
      prompt:
        'For the same change in momentum, how does increasing collision time affect the average force?',
      variables: ['impulse', 'collision time', 'average force'],
    },
    connections: ['energy', 'forces'],
  },
  {
    id: 'circular-motion',
    icon: 'circular-motion',
    name: 'Circular Motion',
    sequence: 5,
    aliases: ['centripetal', 'orbit', 'rotation', 'radius'],
    summary:
      'Understand why continuous inward acceleration is required even when speed stays constant.',
    equation: 'a꜀ = v²/r',
    equationName: 'Centripetal acceleration',
    dimensionalLine: 'm·s⁻² = (m²·s⁻²)/m',
    insight:
      'The velocity vector is always tangent to the path while acceleration points toward the center, changing direction rather than speed.',
    assumptions: ['Uniform circular motion', 'Radius measured to the object’s center of mass'],
    concepts: [
      {
        name: 'Tangential velocity',
        symbol: 'v',
        description: 'Instantaneous velocity directed along the tangent to the circular path.',
      },
      {
        name: 'Radial acceleration',
        symbol: 'a꜀',
        description: 'Acceleration directed inward toward the center of the circle.',
      },
      {
        name: 'Centripetal force',
        symbol: 'F꜀',
        description: 'Name for the resultant inward force, not a separate type of force.',
      },
      {
        name: 'Period',
        symbol: 'T',
        description: 'Time required to complete one full revolution.',
      },
    ],
    investigation: {
      title: 'Hold the radius constant',
      prompt:
        'If orbital speed doubles, by what factor must the inward resultant force change?',
      variables: ['speed', 'radius', 'centripetal acceleration'],
    },
    connections: ['forces', 'kinematics'],
  },
  {
    id: 'projectiles',
    icon: 'projectiles',
    name: 'Projectiles',
    sequence: 6,
    aliases: ['projectile motion', 'trajectory', 'launch', 'free fall'],
    summary:
      'Resolve launch velocity into independent components and follow a two-dimensional trajectory.',
    equation: 'y = y₀ + v₀ᵧt − ½gt²',
    equationName: 'Vertical projectile position',
    dimensionalLine: 'm = m + (m·s⁻¹)(s) − (m·s⁻²)(s²)',
    insight:
      'Horizontal and vertical motion share the same clock. Gravity changes vertical velocity while horizontal velocity remains constant in the ideal model.',
    assumptions: ['Uniform gravitational field', 'Air resistance ignored'],
    concepts: [
      {
        name: 'Vector components',
        symbol: 'vₓ, vᵧ',
        description: 'Perpendicular velocity components evolved independently through time.',
      },
      {
        name: 'Trajectory',
        symbol: 'y(x)',
        description: 'Parabolic path produced by constant downward acceleration.',
      },
      {
        name: 'Maximum height',
        symbol: 'hₘₐₓ',
        description: 'Highest point, where the vertical velocity is instantaneously zero.',
      },
      {
        name: 'Range',
        symbol: 'R',
        description: 'Horizontal displacement between launch and landing positions.',
      },
    ],
    investigation: {
      title: 'Compare launch angles',
      prompt:
        'For equal launch and landing heights, which pair of launch angles produces the same range?',
      variables: ['launch speed', 'launch angle', 'gravity'],
    },
    connections: ['kinematics', 'forces'],
  },
  {
    id: 'oscillations',
    icon: 'oscillations',
    name: 'Oscillations',
    sequence: 7,
    aliases: ['springs', 'hooke', 'simple harmonic motion', 'shm'],
    summary:
      'Study repeating motion produced by restoring forces, beginning with an ideal mass–spring system.',
    equation: 'F = −kx',
    equationName: 'Hooke’s law',
    dimensionalLine: 'N = (N·m⁻¹)(m)',
    insight:
      'The minus sign carries physical meaning: the restoring force always points opposite to displacement from equilibrium.',
    assumptions: ['Ideal Hookean spring', 'Displacement remains within the elastic limit'],
    concepts: [
      {
        name: 'Equilibrium',
        symbol: 'x = 0',
        description: 'Position where the resultant force on the oscillator is zero.',
      },
      {
        name: 'Restoring force',
        symbol: '−kx',
        description: 'Force directed back toward the equilibrium position.',
      },
      {
        name: 'Amplitude',
        symbol: 'A',
        description: 'Maximum displacement from equilibrium during an oscillation.',
      },
      {
        name: 'Elastic energy',
        symbol: '½kx²',
        description: 'Energy stored when an ideal spring is stretched or compressed.',
      },
    ],
    investigation: {
      title: 'Change the oscillator',
      prompt:
        'What happens to the period if the attached mass increases while spring stiffness stays fixed?',
      variables: ['spring constant', 'attached mass', 'period'],
    },
    connections: ['energy', 'forces'],
  },
]

export function findMechanicsTopic(topicIdOrAlias: string | null) {
  if (!topicIdOrAlias) return mechanicsTopics[0]

  const normalizedValue = topicIdOrAlias.trim().toLowerCase()
  return (
    mechanicsTopics.find(
      (topic) => topic.id === normalizedValue || topic.aliases.includes(normalizedValue),
    ) ?? mechanicsTopics[0]
  )
}

export function getRelatedTopics(topic: MechanicsTopic) {
  return topic.connections
    .map((topicId: TopicIconName) => mechanicsTopics.find((topic) => topic.id === topicId))
    .filter((topic): topic is MechanicsTopic => Boolean(topic))
}
