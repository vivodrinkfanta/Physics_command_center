import { formatMeasurement } from '../../utils/newtonSecondLaw'

interface RelationshipGraphProps {
  activeX: boolean
  activeY: boolean
  description: string
  marker: { x: number; y: number }
  points: Array<{ x: number; y: number }>
  title: string
  xDomain: [number, number]
  xLabel: string
  yDomain: [number, number]
  yLabel: string
}

const width = 520
const height = 274
const padding = { top: 22, right: 22, bottom: 50, left: 68 }

export function RelationshipGraph({
  activeX,
  activeY,
  description,
  marker,
  points,
  title,
  xDomain,
  xLabel,
  yDomain,
  yLabel,
}: RelationshipGraphProps) {
  const plotWidth = width - padding.left - padding.right
  const plotHeight = height - padding.top - padding.bottom
  const scaleX = (value: number) =>
    padding.left + ((value - xDomain[0]) / (xDomain[1] - xDomain[0])) * plotWidth
  const scaleY = (value: number) =>
    padding.top + (1 - (value - yDomain[0]) / (yDomain[1] - yDomain[0])) * plotHeight
  const polyline = points.map((point) => `${scaleX(point.x)},${scaleY(point.y)}`).join(' ')
  const xTicks = Array.from({ length: 5 }, (_, index) =>
    xDomain[0] + (index / 4) * (xDomain[1] - xDomain[0]),
  )
  const yTicks = Array.from({ length: 5 }, (_, index) =>
    yDomain[0] + (index / 4) * (yDomain[1] - yDomain[0]),
  )

  return (
    <article
      className={`relationship-graph${activeX || activeY ? ' relationship-graph--linked' : ''}`}
    >
      <header>
        <div>
          <span>Live relationship</span>
          <h3>{title}</h3>
        </div>
        <output>
          {formatMeasurement(marker.x)} → {formatMeasurement(marker.y)}
        </output>
      </header>
      <svg role="img" viewBox={`0 0 ${width} ${height}`}>
        <title>{title}</title>
        <desc>{description}</desc>
        <rect
          className="relationship-graph__frame"
          height={plotHeight}
          width={plotWidth}
          x={padding.left}
          y={padding.top}
        />
        {yTicks.map((tick) => (
          <g className="relationship-graph__tick" key={`y-${tick}`}>
            <line
              x1={padding.left}
              x2={width - padding.right}
              y1={scaleY(tick)}
              y2={scaleY(tick)}
            />
            <text textAnchor="end" x={padding.left - 10} y={scaleY(tick) + 4}>
              {formatMeasurement(tick, 1)}
            </text>
          </g>
        ))}
        {xTicks.map((tick) => (
          <g className="relationship-graph__tick" key={`x-${tick}`}>
            <line
              x1={scaleX(tick)}
              x2={scaleX(tick)}
              y1={padding.top}
              y2={height - padding.bottom}
            />
            <text textAnchor="middle" x={scaleX(tick)} y={height - padding.bottom + 21}>
              {formatMeasurement(tick, 1)}
            </text>
          </g>
        ))}
        {yDomain[0] <= 0 && yDomain[1] >= 0 && (
          <line
            className="relationship-graph__zero"
            x1={padding.left}
            x2={width - padding.right}
            y1={scaleY(0)}
            y2={scaleY(0)}
          />
        )}
        <polyline className="relationship-graph__line" points={polyline} />
        <line
          className="relationship-graph__guide"
          x1={scaleX(marker.x)}
          x2={scaleX(marker.x)}
          y1={scaleY(marker.y)}
          y2={height - padding.bottom}
        />
        <circle
          className="relationship-graph__marker-halo"
          cx={scaleX(marker.x)}
          cy={scaleY(marker.y)}
          r="10"
        />
        <circle
          className="relationship-graph__marker"
          cx={scaleX(marker.x)}
          cy={scaleY(marker.y)}
          r="4"
        />
        <text
          className={`relationship-graph__axis-label${activeX ? ' is-highlighted' : ''}`}
          textAnchor="middle"
          x={padding.left + plotWidth / 2}
          y={height - 7}
        >
          {xLabel}
        </text>
        <text
          className={`relationship-graph__axis-label${activeY ? ' is-highlighted' : ''}`}
          textAnchor="middle"
          transform={`rotate(-90 16 ${padding.top + plotHeight / 2})`}
          x="16"
          y={padding.top + plotHeight / 2}
        >
          {yLabel}
        </text>
      </svg>
    </article>
  )
}
