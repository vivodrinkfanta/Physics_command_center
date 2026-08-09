export interface HomeSearchItem {
  description: string
  formula: string
  keywords: string[]
  name: string
  topic: string
}

export const homeSearchItems: HomeSearchItem[] = [
  {
    name: 'Newton’s Second Law',
    formula: 'ΣF = ma',
    topic: 'Forces',
    description: 'Connect resultant force, mass, and acceleration.',
    keywords: ['force', 'mass', 'acceleration', 'newton', 'f=ma'],
  },
  {
    name: 'Kinetic Energy',
    formula: 'Eₖ = ½mv²',
    topic: 'Energy',
    description: 'Energy stored by an object through its motion.',
    keywords: ['kinetic', 'energy', 'mass', 'velocity', 'speed'],
  },
  {
    name: 'Constant Acceleration',
    formula: 'v = u + at',
    topic: 'Motion',
    description: 'Relate velocity and time under constant acceleration.',
    keywords: ['kinematics', 'motion', 'velocity', 'time', 'suvat'],
  },
  {
    name: 'Linear Momentum',
    formula: 'p = mv',
    topic: 'Momentum',
    description: 'Connect the motion of an object to its mass.',
    keywords: ['momentum', 'mass', 'velocity', 'collision'],
  },
  {
    name: 'Centripetal Force',
    formula: 'F꜀ = mv²/r',
    topic: 'Circular Motion',
    description: 'Find the inward force required for circular motion.',
    keywords: ['centripetal', 'circular', 'radius', 'velocity', 'force'],
  },
  {
    name: 'Gravitational Potential Energy',
    formula: 'Eₚ = mgh',
    topic: 'Energy',
    description: 'Energy stored through height in a gravitational field.',
    keywords: ['potential', 'energy', 'height', 'gravity', 'mass'],
  },
]
