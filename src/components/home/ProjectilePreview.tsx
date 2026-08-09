import { useMemo, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { calculateProjectileMotion } from '../../utils/projectile'

const GRAVITY = 9.81
const GROUND_Y = 50
const ORIGIN_X = 5
const METRES_TO_VIEWBOX = 0.9
const SAMPLE_COUNT = 40

function usePrefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function ProjectilePreview() {
  const [speed, setSpeed] = useState(22)
  const [angle, setAngle] = useState(42)
  const prefersReducedMotion = usePrefersReducedMotion()

  const trajectory = useMemo(() => {
    const motion = calculateProjectileMotion({
      angleDegrees: angle,
      gravity: GRAVITY,
      sampleCount: SAMPLE_COUNT,
      speed,
    })
    const points = motion.points.map(({ x, y }) => {
      return {
        x: ORIGIN_X + x * METRES_TO_VIEWBOX,
        y: GROUND_Y - y * METRES_TO_VIEWBOX,
      }
    })
    const path = points
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
      .join(' ')

    const segmentLengths = points.slice(1).map((point, index) => {
      const previous = points[index]
      return Math.hypot(point.x - previous.x, point.y - previous.y)
    })
    const totalLength = segmentLengths.reduce((sum, length) => sum + length, 0)
    let travelled = 0
    const keyPoints = [0]
    segmentLengths.forEach((length) => {
      travelled += length
      keyPoints.push(travelled / totalLength)
    })

    return {
      flightTime: motion.flightTime,
      keyPoints: keyPoints.join(';'),
      keyTimes: points.map((_, index) => index / SAMPLE_COUNT).join(';'),
      maximumHeight: motion.maximumHeight,
      path,
      range: motion.range,
      restingPoint: points[Math.floor(points.length / 2)],
    }
  }, [angle, speed])

  const reset = () => {
    setSpeed(22)
    setAngle(42)
  }

  return (
    <section className="projectile-preview" aria-labelledby="projectile-title">
      <header className="projectile-preview__header">
        <div>
          <p>Live instrument · 01</p>
          <h2 id="projectile-title">Projectile field</h2>
        </div>
        <button className="instrument-reset" onClick={reset} type="button">
          <RotateCcw aria-hidden="true" size={14} />
          Reset
        </button>
      </header>

      <div className="trajectory-stage">
        <svg
          aria-label={`Projectile trajectory with a range of ${trajectory.range.toFixed(1)} metres`}
          role="img"
          viewBox="0 0 100 56"
        >
          <defs>
            <pattern id="trajectory-grid" height="9" patternUnits="userSpaceOnUse" width="9">
              <path d="M 9 0 L 0 0 0 9" fill="none" stroke="currentColor" strokeWidth="0.16" />
            </pattern>
            <linearGradient id="trajectory-fade" x1="0" x2="1">
              <stop offset="0" stopColor="#78d6bd" stopOpacity="0.9" />
              <stop offset="1" stopColor="#78d6bd" stopOpacity="0.34" />
            </linearGradient>
          </defs>
          <rect className="trajectory-stage__grid" fill="url(#trajectory-grid)" height="50" width="100" />
          <line className="trajectory-stage__ground" x1="0" x2="100" y1={GROUND_Y} y2={GROUND_Y} />
          <path className="trajectory-stage__path-shadow" d={trajectory.path} />
          <path className="trajectory-stage__path" d={trajectory.path} />
          <line
            className="trajectory-stage__vector"
            x1={ORIGIN_X}
            y1={GROUND_Y}
            x2={ORIGIN_X + 8 * Math.cos((angle * Math.PI) / 180)}
            y2={GROUND_Y - 8 * Math.sin((angle * Math.PI) / 180)}
          />
          <circle className="trajectory-stage__origin" cx={ORIGIN_X} cy={GROUND_Y} r="1.3" />
          <circle
            className="trajectory-stage__projectile"
            cx={prefersReducedMotion ? trajectory.restingPoint.x : undefined}
            cy={prefersReducedMotion ? trajectory.restingPoint.y : undefined}
            r="1.25"
          >
            {!prefersReducedMotion && (
              <animateMotion
                calcMode="linear"
                dur={`${Math.max(trajectory.flightTime, 0.8).toFixed(2)}s`}
                key={trajectory.path}
                keyPoints={trajectory.keyPoints}
                keyTimes={trajectory.keyTimes}
                path={trajectory.path}
                repeatCount="indefinite"
              />
            )}
          </circle>
          <text className="trajectory-stage__label" x="3" y="54.5">
            0 m
          </text>
          <text className="trajectory-stage__label" textAnchor="end" x="97" y="54.5">
            100 m
          </text>
        </svg>
        <span className="assumption-label">Air resistance ignored · g = 9.81 m/s²</span>
      </div>

      <div className="instrument-controls">
        <label>
          <span>
            Launch speed
            <output>{speed.toFixed(0)} m/s</output>
          </span>
          <input
            aria-label="Launch speed in metres per second"
            max="30"
            min="8"
            onChange={(event) => setSpeed(Number(event.target.value))}
            type="range"
            value={speed}
          />
        </label>
        <label>
          <span>
            Launch angle
            <output>{angle.toFixed(0)}°</output>
          </span>
          <input
            aria-label="Launch angle in degrees"
            max="70"
            min="20"
            onChange={(event) => setAngle(Number(event.target.value))}
            type="range"
            value={angle}
          />
        </label>
      </div>

      <dl className="instrument-metrics">
        <div>
          <dt>Range</dt>
          <dd>{trajectory.range.toFixed(1)} m</dd>
        </div>
        <div>
          <dt>Max height</dt>
          <dd>{trajectory.maximumHeight.toFixed(1)} m</dd>
        </div>
        <div>
          <dt>Flight time</dt>
          <dd>{trajectory.flightTime.toFixed(2)} s</dd>
        </div>
      </dl>
    </section>
  )
}
