export type TopicIconName =
  | 'kinematics'
  | 'forces'
  | 'energy'
  | 'momentum'
  | 'circular-motion'
  | 'projectiles'
  | 'oscillations'

export interface TopicConcept {
  description: string
  name: string
  symbol: string
}

export interface TopicInvestigation {
  prompt: string
  title: string
  variables: string[]
}

export interface MechanicsTopic {
  aliases: string[]
  assumptions: string[]
  concepts: TopicConcept[]
  connections: TopicIconName[]
  dimensionalLine: string
  equation: string
  equationName: string
  icon: TopicIconName
  id: TopicIconName
  insight: string
  investigation: TopicInvestigation
  name: string
  sequence: number
  summary: string
}
