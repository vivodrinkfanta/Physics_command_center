import { Search } from 'lucide-react'
import { topicIcons } from './topicIcons'
import type { MechanicsTopic, TopicIconName } from '../../types/topic'

interface TopicAtlasNavProps {
  activeTopicId: TopicIconName
  onQueryChange: (query: string) => void
  onSelect: (topicId: TopicIconName) => void
  query: string
  topics: MechanicsTopic[]
}

export function TopicAtlasNav({
  activeTopicId,
  onQueryChange,
  onSelect,
  query,
  topics,
}: TopicAtlasNavProps) {
  return (
    <aside className="atlas-nav" aria-label="Mechanics topics">
      <header className="atlas-nav__header">
        <div>
          <span>System map</span>
          <strong>Mechanics / V1</strong>
        </div>
        <span className="atlas-nav__count">07</span>
      </header>

      <label className="atlas-filter">
        <span className="sr-only">Filter mechanics topics</span>
        <Search aria-hidden="true" size={15} strokeWidth={1.8} />
        <input
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Filter topics or concepts"
          type="search"
          value={query}
        />
      </label>

      <nav aria-label="Topic atlas">
        <ol className="atlas-topic-list">
          {topics.map((topic) => {
            const Icon = topicIcons[topic.icon]
            const isActive = topic.id === activeTopicId

            return (
              <li key={topic.id}>
                <button
                  aria-current={isActive ? 'page' : undefined}
                  className={`atlas-topic${isActive ? ' atlas-topic--active' : ''}`}
                  onClick={() => onSelect(topic.id)}
                  type="button"
                >
                  <span className="atlas-topic__sequence">{String(topic.sequence).padStart(2, '0')}</span>
                  <span className="atlas-topic__icon">
                    <Icon aria-hidden="true" size={17} strokeWidth={1.65} />
                  </span>
                  <span className="atlas-topic__copy">
                    <strong>{topic.name}</strong>
                    <small>{topic.equation}</small>
                  </span>
                  <span className="atlas-topic__node" aria-hidden="true" />
                </button>
              </li>
            )
          })}
        </ol>
      </nav>

      {topics.length === 0 && <p className="atlas-nav__empty">No mechanics topic matches that search.</p>}

      <footer className="atlas-nav__footer">
        <span className="status-dot" aria-hidden="true" />
        <span>Concept network online</span>
      </footer>
    </aside>
  )
}
