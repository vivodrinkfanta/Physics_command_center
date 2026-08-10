import { ArrowRight, Check, Crosshair, FlaskConical, Network, Ruler } from 'lucide-react'
import { topicIcons } from './topicIcons'
import { FormulaExpression } from '../math/FormulaExpression'
import { getFormulaById } from '../../data/formulas'
import type { MechanicsTopic, TopicIconName } from '../../types/topic'

interface TopicDetailProps {
  onSelect: (topicId: TopicIconName) => void
  relatedTopics: MechanicsTopic[]
  topic: MechanicsTopic
}

export function TopicDetail({ onSelect, relatedTopics, topic }: TopicDetailProps) {
  const Icon = topicIcons[topic.icon]
  const featuredFormula = getFormulaById(topic.featuredFormulaId)

  return (
    <article className={`topic-detail topic-detail--${topic.id}`} aria-labelledby="topic-detail-title">
      <header className="topic-detail__header">
        <div className="topic-detail__identity">
          <span className="topic-detail__icon">
            <Icon aria-hidden="true" size={24} strokeWidth={1.5} />
          </span>
          <div>
            <p>MEC-{String(topic.sequence).padStart(2, '0')} · Concept field</p>
            <h2 id="topic-detail-title">{topic.name}</h2>
          </div>
        </div>
        <span className="topic-detail__status">
          <span aria-hidden="true" />
          Map ready
        </span>
      </header>

      <p className="topic-detail__summary">{topic.summary}</p>

      <section className="equation-observatory" aria-labelledby="equation-heading">
        <div className="equation-observatory__main">
          <span className="equation-observatory__label" id="equation-heading">
            Reference relationship
          </span>
          <FormulaExpression
            className="equation-observatory__formula"
            expression={featuredFormula.expression}
          />
          <p>{featuredFormula.name}</p>
        </div>
        <div className="equation-observatory__dimension">
          <span>
            <Ruler aria-hidden="true" size={13} />
            Dimensional check
          </span>
          <code>{featuredFormula.dimensionalAnalysis}</code>
        </div>
      </section>

      <section className="topic-concepts" aria-labelledby="concept-heading">
        <div className="detail-section-heading">
          <div>
            <span>Inside the system</span>
            <h3 id="concept-heading">Core concepts</h3>
          </div>
          <span>{String(topic.concepts.length).padStart(2, '0')} nodes</span>
        </div>

        <div className="concept-grid">
          {topic.concepts.map((concept) => (
            <article className="concept-node" key={concept.name}>
              <code>{concept.symbol}</code>
              <h4>{concept.name}</h4>
              <p>{concept.description}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="topic-detail__lower-grid">
        <section className="insight-panel" aria-labelledby="insight-heading">
          <span className="insight-panel__icon">
            <Crosshair aria-hidden="true" size={17} />
          </span>
          <div>
            <p>Relationship insight</p>
            <h3 id="insight-heading">What changes what?</h3>
            <blockquote>{topic.insight}</blockquote>
            <ul>
              {featuredFormula.assumptions.map((assumption) => (
                <li key={assumption}>
                  <Check aria-hidden="true" size={12} />
                  {assumption}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="investigation-panel" aria-labelledby="investigation-heading">
          <div className="investigation-panel__topline">
            <span>
              <FlaskConical aria-hidden="true" size={14} />
              Suggested investigation
            </span>
            <span>Predict first</span>
          </div>
          <h3 id="investigation-heading">{topic.investigation.title}</h3>
          <p>{topic.investigation.prompt}</p>
          <div className="investigation-panel__variables">
            {topic.investigation.variables.map((variable) => (
              <span key={variable}>{variable}</span>
            ))}
          </div>
        </section>
      </div>

      <section className="topic-connections" aria-labelledby="connections-heading">
        <div>
          <Network aria-hidden="true" size={15} />
          <span id="connections-heading">Continue through the network</span>
        </div>
        <nav aria-label={`Topics related to ${topic.name}`}>
          {relatedTopics.map((relatedTopic) => (
            <button key={relatedTopic.id} onClick={() => onSelect(relatedTopic.id)} type="button">
              {relatedTopic.name}
              <ArrowRight aria-hidden="true" size={13} />
            </button>
          ))}
        </nav>
      </section>
    </article>
  )
}
