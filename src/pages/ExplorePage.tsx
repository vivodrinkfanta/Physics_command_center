import { useMemo, useState } from 'react'
import { ArrowRight, GitBranch, Route, ScanLine } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { TopicAtlasNav } from '../components/explore/TopicAtlasNav'
import { TopicDetail } from '../components/explore/TopicDetail'
import { findMechanicsTopic, getRelatedTopics, mechanicsTopics } from '../data/topics'
import type { TopicIconName } from '../types/topic'
import '../styles/explore.css'

export function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const activeTopic = findMechanicsTopic(searchParams.get('topic'))

  const filteredTopics = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return mechanicsTopics

    return mechanicsTopics.filter((topic) =>
      [
        topic.name,
        topic.summary,
        topic.equation,
        ...topic.aliases,
        ...topic.concepts.flatMap((concept) => [concept.name, concept.symbol]),
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery),
    )
  }, [query])

  const selectTopic = (topicId: TopicIconName) => {
    setSearchParams({ topic: topicId })
    if (window.innerWidth < 900) {
      window.requestAnimationFrame(() => {
        document.getElementById('selected-topic')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  }

  return (
    <div className="explore-view">
      <header className="explore-hero">
        <div className="explore-hero__copy">
          <p>
            <ScanLine aria-hidden="true" size={14} />
            Mechanics concept atlas
          </p>
          <h1>
            See how the system
            <br />
            <span>connects.</span>
          </h1>
          <p className="explore-hero__intro">
            Physics is easier to navigate when equations are treated as connected models rather than
            isolated facts. Select a field to inspect its quantities, assumptions, and neighbouring ideas.
          </p>
        </div>

        <dl className="atlas-readout" aria-label="Mechanics atlas summary">
          <div>
            <dt>Domain</dt>
            <dd>Mechanics</dd>
          </div>
          <div>
            <dt>Mapped fields</dt>
            <dd>07</dd>
          </div>
          <div>
            <dt>Concept nodes</dt>
            <dd>28</dd>
          </div>
          <div>
            <dt>Model</dt>
            <dd>Classical · V1</dd>
          </div>
        </dl>
      </header>

      <section className="atlas-workspace" aria-label="Interactive mechanics atlas">
        <TopicAtlasNav
          activeTopicId={activeTopic.id}
          onQueryChange={setQuery}
          onSelect={selectTopic}
          query={query}
          topics={filteredTopics}
        />
        <div id="selected-topic">
          <TopicDetail
            key={activeTopic.id}
            onSelect={selectTopic}
            relatedTopics={getRelatedTopics(activeTopic)}
            topic={activeTopic}
          />
        </div>
      </section>

      <section className="learning-vector" aria-labelledby="learning-vector-title">
        <header>
          <div>
            <p>
              <Route aria-hidden="true" size={14} />
              Recommended learning vector
            </p>
            <h2 id="learning-vector-title">Build the model in layers.</h2>
          </div>
          <span>Follow the sequence or enter anywhere</span>
        </header>

        <ol>
          {mechanicsTopics.map((topic, index) => (
            <li key={topic.id}>
              <button onClick={() => selectTopic(topic.id)} type="button">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{topic.name}</strong>
                <small>{topic.equation}</small>
                <ArrowRight aria-hidden="true" size={14} />
              </button>
            </li>
          ))}
        </ol>

        <footer>
          <GitBranch aria-hidden="true" size={15} />
          <span>
            Projectiles branches from kinematics. Circular motion and oscillations combine motion,
            forces, and energy.
          </span>
        </footer>
      </section>
    </div>
  )
}
