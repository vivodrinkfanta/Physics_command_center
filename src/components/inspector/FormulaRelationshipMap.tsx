import { useEffect, useRef, type CSSProperties } from 'react'
import { ArrowUpRight, Network } from 'lucide-react'
import { Link } from 'react-router-dom'
import { mechanicsFormulas } from '../../data/formulas'
import type { FormulaId, FormulaRecord } from '../../types/formula'
import { FormulaExpression } from '../math/FormulaExpression'

interface FormulaRelationshipMapProps {
  formula: FormulaRecord
}

interface MapPosition {
  x: number
  y: number
}

const mapPositions: Record<FormulaId, MapPosition> = {
  'constant-acceleration-velocity': { x: 130, y: 100 },
  'projectile-vertical-position': { x: 130, y: 320 },
  'newton-second-law': { x: 390, y: 100 },
  'centripetal-acceleration': { x: 390, y: 320 },
  'linear-momentum': { x: 650, y: 100 },
  'hookes-law': { x: 650, y: 320 },
  'kinetic-energy': { x: 910, y: 100 },
  'gravitational-potential-energy': { x: 910, y: 320 },
}

const relationshipEdges = (() => {
  const seen = new Set<string>()
  return mechanicsFormulas.flatMap((formula) =>
    formula.relatedFormulaIds.flatMap((relatedId) => {
      const ids = [formula.id, relatedId].sort() as [FormulaId, FormulaId]
      const key = ids.join(':')
      if (seen.has(key)) return []
      seen.add(key)
      return [{ from: ids[0], to: ids[1] }]
    }),
  )
})()

export function FormulaRelationshipMap({ formula }: FormulaRelationshipMapProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const directlyConnectedIds = new Set<FormulaId>()
  relationshipEdges.forEach((edge) => {
    if (edge.from === formula.id) directlyConnectedIds.add(edge.to)
    if (edge.to === formula.id) directlyConnectedIds.add(edge.from)
  })

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    const currentX = mapPositions[formula.id].x
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
        <div className="formula-map__canvas" role="group" aria-label="Clickable mechanics formulas">
          <svg aria-hidden="true" height="420" viewBox="0 0 1040 420" width="1040">
            <defs>
              <filter id="formula-map-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur result="blur" stdDeviation="3" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            {relationshipEdges.map((edge) => {
              const from = mapPositions[edge.from]
              const to = mapPositions[edge.to]
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
            const position = mapPositions[candidate.id]
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
