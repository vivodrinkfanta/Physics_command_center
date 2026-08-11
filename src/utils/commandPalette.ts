import { mechanicsFormulas } from '../data/formulas'
import { mechanicsTopics } from '../data/topics'

export type CommandSection = 'Navigate' | 'Simulate' | 'Formula' | 'Topic' | 'Practice'

export interface CommandPaletteItem {
  description: string
  href: string
  id: string
  keywords: string[]
  label: string
  meta?: string
  section: CommandSection
}

const navigationCommands: CommandPaletteItem[] = [
  {
    id: 'navigate-home',
    label: 'Home laboratory',
    description: 'Return to the projectile instrument and mechanics overview.',
    href: '/',
    section: 'Navigate',
    keywords: ['start', 'homepage', 'projectile preview'],
  },
  {
    id: 'navigate-explore',
    label: 'Topic atlas',
    description: 'Trace the ideas and connections across mechanics.',
    href: '/explore',
    section: 'Navigate',
    keywords: ['explore', 'concepts', 'mechanics'],
  },
  {
    id: 'navigate-formulas',
    label: 'Formula library',
    description: 'Search every equation, variable, unit, and relationship.',
    href: '/formulas',
    section: 'Navigate',
    keywords: ['equations', 'relationships', 'units'],
  },
  {
    id: 'navigate-simulations',
    label: 'Simulation instruments',
    description: 'Open the simulation index and calibrated Newton lab.',
    href: '/simulations',
    section: 'Navigate',
    keywords: ['labs', 'experiments', 'interactive'],
  },
  {
    id: 'navigate-practice',
    label: 'Practice catalog',
    description: 'Choose a registry-generated numerical problem set.',
    href: '/practice',
    section: 'Navigate',
    keywords: ['questions', 'problems', 'quiz', 'test'],
  },
  {
    id: 'simulate-newton',
    label: 'Run the Newton force cart',
    description: 'Manipulate resultant force and mass in the benchmark simulation.',
    href: '/formulas/newton-second-law',
    section: 'Simulate',
    keywords: ['newton', 'force cart', 'f=ma', 'f ma', 'acceleration', 'mass'],
    meta: 'ΣF = ma',
  },
  {
    id: 'simulate-kinetic-energy',
    label: 'Run the kinetic energy runway',
    description: 'Manipulate mass and speed in the translational energy simulation.',
    href: '/formulas/kinetic-energy',
    section: 'Simulate',
    keywords: ['kinetic energy', 'energy runway', 'mass', 'speed', 'velocity squared'],
    meta: 'Eₖ = ½mv²',
  },
]

const formulaCommands: CommandPaletteItem[] = mechanicsFormulas.map((formula) => ({
  id: `formula-${formula.id}`,
  label: formula.name,
  description: formula.description,
  href: `/formulas/${formula.id}`,
  section: 'Formula',
  keywords: [formula.subtopic, formula.expression.plainText, ...formula.tags],
  meta: formula.expression.plainText,
}))

const topicCommands: CommandPaletteItem[] = mechanicsTopics.map((topic) => ({
  id: `topic-${topic.id}`,
  label: topic.name,
  description: topic.summary,
  href: `/explore?topic=${topic.id}`,
  section: 'Topic',
  keywords: [...topic.aliases, ...topic.concepts.map((concept) => concept.name)],
  meta: `Topic ${String(topic.sequence).padStart(2, '0')}`,
}))

const practiceCommands: CommandPaletteItem[] = mechanicsFormulas.map((formula) => ({
  id: `practice-${formula.id}`,
  label: `Practice ${formula.name}`,
  description: `Solve a numerical ${formula.subtopic.toLowerCase()} problem with staged hints.`,
  href: `/formulas/${formula.id}?tab=practice`,
  section: 'Practice',
  keywords: ['question', 'problem', 'quiz', formula.expression.plainText, ...formula.tags],
  meta: formula.expression.plainText,
}))

export const commandPaletteItems: readonly CommandPaletteItem[] = [
  ...navigationCommands,
  ...formulaCommands,
  ...topicCommands,
  ...practiceCommands,
]

const suggestedCommandIds = [
  'simulate-newton',
  'simulate-kinetic-energy',
  'navigate-formulas',
  'navigate-explore',
  'navigate-practice',
  'topic-projectiles',
]

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[Σ∑]/g, 'sum')
    .replace(/²/g, '2')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
}

export function searchCommandPalette(query: string, limit = 12) {
  const normalizedQuery = normalize(query)
  if (!normalizedQuery) {
    return suggestedCommandIds
      .map((id) => commandPaletteItems.find((item) => item.id === id))
      .filter((item): item is CommandPaletteItem => Boolean(item))
      .slice(0, limit)
  }

  const queryTerms = normalizedQuery.split(/\s+/)

  return commandPaletteItems
    .map((item) => {
      const label = normalize(item.label)
      const meta = normalize(item.meta ?? '')
      const searchableValues = [
        label,
        normalize(item.description),
        meta,
        ...item.keywords.map(normalize),
      ]
      const joined = searchableValues.join(' ')

      if (!queryTerms.every((term) => joined.includes(term))) return { item, score: 0 }

      let score = 10
      if (label === normalizedQuery) score += 100
      else if (label.startsWith(normalizedQuery)) score += 65
      else if (label.includes(normalizedQuery)) score += 40
      if (meta === normalizedQuery) score += 80
      else if (meta.includes(normalizedQuery)) score += 25
      score += queryTerms.reduce(
        (total, term) => total + (label.includes(term) ? 12 : 0) + (meta.includes(term) ? 8 : 0),
        0,
      )

      return { item, score }
    })
    .filter(({ score }) => score > 0)
    .sort(
      (left, right) =>
        right.score - left.score || left.item.label.localeCompare(right.item.label),
    )
    .slice(0, limit)
    .map(({ item }) => item)
}
