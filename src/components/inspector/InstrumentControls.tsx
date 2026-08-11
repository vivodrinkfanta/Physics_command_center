import { Pause, Play, RotateCcw } from 'lucide-react'
import type { CSSProperties } from 'react'
import type { PhysicsVariableId } from '../../types/formula'
import { formatMeasurement } from '../../utils/newtonSecondLaw'

export const instrumentLinkedClass = (
  highlightedVariable: PhysicsVariableId | null,
  variableId?: PhysicsVariableId,
) =>
  highlightedVariable && variableId
    ? highlightedVariable === variableId
      ? ' is-linked'
      : ' is-dimmed'
    : ''

interface InstrumentControlProps {
  highlightedVariable: PhysicsVariableId | null
  label: string
  max: number
  min: number
  onChange: (value: number) => void
  onHighlightVariable: (variableId: PhysicsVariableId | null) => void
  step: number
  symbol: string
  unit: string
  value: number
  variableId?: PhysicsVariableId
}

export function InstrumentControl({
  highlightedVariable,
  label,
  max,
  min,
  onChange,
  onHighlightVariable,
  step,
  symbol,
  unit,
  value,
  variableId,
}: InstrumentControlProps) {
  const progress = ((value - min) / (max - min)) * 100
  const highlight = () => variableId && onHighlightVariable(variableId)
  return (
    <label
      className={`newton-control${instrumentLinkedClass(highlightedVariable, variableId)}`}
      data-variable-id={variableId}
      onBlur={() => onHighlightVariable(null)}
      onFocus={highlight}
      onMouseEnter={highlight}
      onMouseLeave={() => onHighlightVariable(null)}
    >
      <span className="newton-control__heading">
        <span><var>{symbol}</var><strong>{label}</strong></span>
        <output>{formatMeasurement(value, step < 0.1 ? 2 : 1)} <small>{unit}</small></output>
      </span>
      <input
        aria-label={`${label} in ${unit}`}
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        step={step}
        style={{ '--range-progress': `${progress}%` } as CSSProperties}
        type="range"
        value={value}
      />
      <span className="newton-control__range" aria-hidden="true"><small>{min}</small><small>{max}</small></span>
    </label>
  )
}

interface InstrumentTransportProps {
  highlightedVariable?: PhysicsVariableId | null
  isPlaying: boolean
  onHighlightVariable?: (variableId: PhysicsVariableId | null) => void
  onPlay: () => void
  onReset: () => void
  onScrub: (time: number) => void
  onSetPlaying: (playing: boolean) => void
  time: number
  timeLimit: number
}

export function InstrumentTransport({
  highlightedVariable = null,
  isPlaying,
  onHighlightVariable,
  onPlay,
  onReset,
  onScrub,
  onSetPlaying,
  time,
  timeLimit,
}: InstrumentTransportProps) {
  const timeLinked = onHighlightVariable
    ? instrumentLinkedClass(highlightedVariable, 'time')
    : ''
  return (
    <div
      className={`transport-controls${timeLinked}`}
      data-variable-id={onHighlightVariable ? 'time' : undefined}
      onBlur={() => onHighlightVariable?.(null)}
      onFocus={() => onHighlightVariable?.('time')}
      onMouseEnter={() => onHighlightVariable?.('time')}
      onMouseLeave={() => onHighlightVariable?.(null)}
    >
      <button onClick={() => (isPlaying ? onSetPlaying(false) : onPlay())} type="button">
        {isPlaying ? <Pause aria-hidden="true" size={15} /> : <Play aria-hidden="true" size={15} />}
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <button onClick={onReset} type="button"><RotateCcw aria-hidden="true" size={14} /> Reset</button>
      <label>
        <span className="sr-only">Simulation time</span>
        <input
          aria-label="Simulation time in seconds"
          max={timeLimit}
          min="0"
          onChange={(event) => onScrub(Number(event.target.value))}
          step="0.01"
          style={{ '--range-progress': `${(time / timeLimit) * 100}%` } as CSSProperties}
          type="range"
          value={time}
        />
      </label>
      <output>{formatMeasurement(time)} / {formatMeasurement(timeLimit)} s</output>
    </div>
  )
}
