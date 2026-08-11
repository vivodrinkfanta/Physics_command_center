import { Activity } from 'lucide-react'
import type { PhysicsVariableId } from '../../types/formula'
import {
  calculateMotion,
  formatMeasurement,
  motionSeries,
  NEWTON_TIME_LIMIT,
  type MotionSample,
  type NewtonState,
} from '../../utils/newtonSecondLaw'

interface NewtonMotionTelemetryProps {
  highlightedVariable: PhysicsVariableId | null
  state: NewtonState
}

type MotionKey = 'acceleration' | 'velocity' | 'position'

const width = 760
const height = 330
const plotLeft = 98
const plotRight = 24
const laneHeight = 72
const laneGap = 14
const laneTop = 24

const lanes: Array<{
  key: MotionKey
  label: string
  shortLabel: string
  unit: string
}> = [
  { key: 'acceleration', label: 'Acceleration', shortLabel: 'a', unit: 'm/s²' },
  { key: 'velocity', label: 'Velocity', shortLabel: 'v', unit: 'm/s' },
  { key: 'position', label: 'Displacement', shortLabel: 'x', unit: 'm' },
]

export function NewtonMotionTelemetry({
  highlightedVariable,
  state,
}: NewtonMotionTelemetryProps) {
  const samples = motionSeries(state.force, state.mass)
  const current = calculateMotion(state.force, state.mass, state.time)
  const plotWidth = width - plotLeft - plotRight
  const scaleX = (time: number) => plotLeft + (time / NEWTON_TIME_LIMIT) * plotWidth
  const cursorX = scaleX(state.time)

  const valueAt = (sample: MotionSample, key: MotionKey) => sample[key]
  const currentValue = (key: MotionKey) => current[key]
  const domainFor = (key: MotionKey) =>
    Math.max(...samples.map((sample) => Math.abs(valueAt(sample, key))), 1)
  const scaleY = (value: number, key: MotionKey, index: number) => {
    const center = laneTop + index * (laneHeight + laneGap) + laneHeight / 2
    return center - (value / domainFor(key)) * (laneHeight * 0.4)
  }

  return (
    <section className="newton-telemetry" aria-labelledby="motion-telemetry-title">
      <header>
        <div>
          <span><Activity aria-hidden="true" size={14} /> Synchronized time history</span>
          <h3 id="motion-telemetry-title">Motion telemetry</h3>
        </div>
        <output>Shared cursor · t = {formatMeasurement(state.time)} s</output>
      </header>

      <svg role="img" viewBox={`0 0 ${width} ${height}`}>
        <title>Acceleration, velocity, and displacement synchronized over time</title>
        <desc>
          Three motion graphs share the simulation clock. The cursor and current markers move with
          playback and time-scrubber changes.
        </desc>

        {lanes.map((lane, laneIndex) => {
          const center = laneTop + laneIndex * (laneHeight + laneGap) + laneHeight / 2
          const path = samples
            .map((sample, sampleIndex) => {
              const command = sampleIndex === 0 ? 'M' : 'L'
              return `${command} ${scaleX(sample.time).toFixed(2)} ${scaleY(
                valueAt(sample, lane.key),
                lane.key,
                laneIndex,
              ).toFixed(2)}`
            })
            .join(' ')
          const isAccelerationLinked =
            lane.key === 'acceleration' && highlightedVariable === 'acceleration'

          return (
            <g className={`telemetry-lane telemetry-lane--${lane.key}`} key={lane.key}>
              <rect
                className="telemetry-lane__frame"
                height={laneHeight}
                width={plotWidth}
                x={plotLeft}
                y={laneTop + laneIndex * (laneHeight + laneGap)}
              />
              <line
                className="telemetry-lane__zero"
                x1={plotLeft}
                x2={width - plotRight}
                y1={center}
                y2={center}
              />
              <text className="telemetry-lane__symbol" x="22" y={center - 6}>
                {lane.shortLabel}
              </text>
              <text className="telemetry-lane__label" x="22" y={center + 13}>
                {lane.unit}
              </text>
              <path
                className={`telemetry-lane__path${isAccelerationLinked ? ' is-linked' : ''}`}
                d={path}
              />
              <circle
                className={`telemetry-lane__marker${isAccelerationLinked ? ' is-linked' : ''}`}
                cx={cursorX}
                cy={scaleY(currentValue(lane.key), lane.key, laneIndex)}
                r="4.5"
              />
              <text
                className="telemetry-lane__value"
                textAnchor="end"
                x={width - plotRight - 8}
                y={laneTop + laneIndex * (laneHeight + laneGap) + 16}
              >
                {formatMeasurement(currentValue(lane.key))} {lane.unit}
              </text>
            </g>
          )
        })}

        <line
          className="telemetry-cursor"
          x1={cursorX}
          x2={cursorX}
          y1={laneTop}
          y2={laneTop + lanes.length * laneHeight + (lanes.length - 1) * laneGap}
        />
        {[0, 1, 2, 3, 4].map((tick) => (
          <g className="telemetry-time-tick" key={tick}>
            <line x1={scaleX(tick)} x2={scaleX(tick)} y1="292" y2="298" />
            <text textAnchor="middle" x={scaleX(tick)} y="317">{tick} s</text>
          </g>
        ))}
      </svg>

      <footer>
        <span><var>a</var> = ΣF/m</span>
        <span><var>v</var> = at</span>
        <span><var>x</var> = ½at²</span>
        <small>Constant resultant force · starts from rest</small>
      </footer>
    </section>
  )
}
