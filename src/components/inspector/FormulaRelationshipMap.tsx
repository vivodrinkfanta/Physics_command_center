import { useEffect, useRef, type CSSProperties } from 'react'
import { ArrowUpRight, Network } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  getFormulaRelationshipEdges,
  getRelatedFormulas,
  mechanicsFormulas,
} from '../../data/formulas'
import type { FormulaRecord } from '../../types/formula'
import { createFormulaRelationshipLayout } from '../../utils/formulaRelationships'
import { FormulaExpression } from '../math/FormulaExpression'

interface FormulaRelationshipMapProps {
  formula: FormulaRecord
}

const relationshipEdges = getFormulaRelationshipEdges()
const relationshipLayout = createFormulaRelationshipLayout(mechanicsFormulas, relationshipEdges)
const mapPositions = new Map(
  relationshipLayout.positions.map(({ formulaId, x, y }) => [formulaId, { x, y }]),
)

export function FormulaRelationshipMap({ formula }: FormulaRelationshipMapProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const directlyConnectedIds = new Set(getRelatedFormulas(formula.id).map(({ id }) => id))

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    const currentX = mapPositions.get(formula.id)?.x ?? 0
    viewport.scrollLeft = Math.max(0, currentX - viewport.clientWidth / 2)
  }, [formula.id])

  return (
    <section className="formula-map" aria-labelledby="formula-map-title">
      <header>
        <div>
          <span><Network aria-hidden="true" size={14} /> Mechanics relationship map</span>
          <h2 id="formula-map-title">Follow the quantities between models.</h2>
        </div>
        <div className="formula-map__legend" aria-label="Map legend">
          <span><i className="is-current" /> Current</span>
          <span><i className="is-connected" /> Direct link</span>
          <span><i /> Wider system</span>
        </div>
      </header>

      <div className="formula-map__viewport" ref={viewportRef} tabIndex={0}>
        <div
          className="formula-map__canvas"
          role="group"
          aria-label="Clickable mechanics formulas"
          style={{ height: relationshipLayout.height, width: relationshipLayout.width }}
        >
          <svg
            aria-hidden="true"
            height={relationshipLayout.height}
            viewBox={`0 0 ${relationshipLayout.width} ${relationshipLayout.height}`}
            width={relationshipLayout.width}
          >
            <defs>
              <filter id="formula-map-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur result="blur" stdDeviation="3" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            {relationshipEdges.map((edge) => {
              const from = mapPositions.get(edge.from)
              const to = mapPositions.get(edge.to)
              if (!from || !to) return null
              const isActive = edge.from === formula.id || edge.to === formula.id
              return (
                <g className={`formula-map__edge${isActive ? ' is-active' : ''}`} key={`${edge.from}-${edge.to}`}>
                  <line x1={from.x} x2={to.x} y1={from.y} y2={to.y} />
                  <circle cx={from.x} cy={from.y} r="3" />
                  <circle cx={to.x} cy={to.y} r="3" />
                </g>
              )
            })}
          </svg>

          {mechanicsFormulas.map((candidate) => {
            const position = mapPositions.get(candidate.id)
            if (!position) return null
            const state =
              candidate.id === formula.id
                ? ' is-current'
                : directlyConnectedIds.has(candidate.id)
                  ? ' is-connected'
                  : ' is-context'
            return (
              <Link
                aria-current={candidate.id === formula.id ? 'page' : undefined}
                aria-label={`${candidate.name}, ${candidate.subtopic}. Open formula.`}
                className={`formula-map__node${state}`}
                key={candidate.id}
                style={{ '--map-x': `${position.x}px`, '--map-y': `${position.y}px` } as CSSProperties}
                to={`/formulas/${candidate.id}?tab=related`}
              >
                <span>{candidate.subtopic}</span>
                <FormulaExpression expression={candidate.expression} />
                <strong>{candidate.name}</strong>
                <ArrowUpRight aria-hidden="true" size={14} />
              </Link>
            )
          })}
        </div>
      </div>

      <footer>
        <span>{mechanicsFormulas.length} formulas · {relationshipEdges.length} validated connections</span>
        <small>Choose any node to make it the new center of attention.</small>
      </footer>
    </section>
  )
}
