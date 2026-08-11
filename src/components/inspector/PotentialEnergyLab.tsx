import type { Dispatch, SetStateAction } from 'react'
import type { PhysicsVariableId } from '../../types/formula'
import {
  calculatePotentialEnergy,
  GRAVITY_RANGE,
  POTENTIAL_HEIGHT_RANGE,
  POTENTIAL_MASS_RANGE,
  type PotentialEnergyState,
} from '../../utils/potentialEnergy'
import { formatMeasurement } from '../../utils/newtonSecondLaw'
import { InstrumentControl, instrumentLinkedClass } from './InstrumentControls'

interface PotentialEnergyLabProps {
  highlightedVariable: PhysicsVariableId | null
  onHighlightVariable: (variableId: PhysicsVariableId | null) => void
  setState: Dispatch<SetStateAction<PotentialEnergyState>>
  state: PotentialEnergyState
}

export function PotentialEnergyLab({ highlightedVariable, onHighlightVariable, setState, state }: PotentialEnergyLabProps) {
  const energy = calculatePotentialEnergy(state.mass, state.gravity, state.height)
  const energyBarHeight = 105 * Math.tanh(Math.abs(energy) / 1200)
  const objectY = 190 - state.height * 7
  const objectSize = 28 + ((state.mass - POTENTIAL_MASS_RANGE.min) / 19) * 18
  const energyLinked = instrumentLinkedClass(highlightedVariable, 'gravitational-potential-energy')
  const massLinked = instrumentLinkedClass(highlightedVariable, 'mass')
  const heightLinked = instrumentLinkedClass(highlightedVariable, 'height')
  const gravityLinked = instrumentLinkedClass(highlightedVariable, 'gravitational-field-strength')

  return (
    <div className="newton-lab potential-lab">
      <section className="newton-stage" aria-label="Gravitational potential energy raised-mass simulation">
        <header className="newton-stage__header"><div><span>Uniform gravitational field</span><strong>Signed energy change · selectable zero level</strong></div><div className="newton-stage__clock"><span>Field strength</span><output>{formatMeasurement(state.gravity)} m/s²</output></div></header>
        <svg className="newton-stage__canvas potential-stage" role="img" viewBox="0 0 600 320">
          <title>Mass positioned relative to a gravitational reference height</title>
          <desc>Object size shows mass, vertical position shows signed height change, and the energy column shows gravitational potential energy change.</desc>
          <defs><marker id="height-arrow" markerHeight="7" markerWidth="8" orient="auto" refX="7" refY="3.5"><polygon points="0 0, 8 3.5, 0 7" /></marker></defs>
          <g className="newton-stage__grid" aria-hidden="true">{Array.from({ length: 13 }, (_, index) => <line key={index} x1={index * 50} x2={index * 50} y1="20" y2="290" />)}</g>
          <line className="potential-reference" x1="70" x2="530" y1="190" y2="190" />
          <text className="newton-stage__origin-label" x="76" y="181">REFERENCE · Δh = 0</text>
          <line className={`potential-height${heightLinked}`} markerEnd="url(#height-arrow)" x1="180" x2="180" y1="190" y2={objectY} />
          <text className={`potential-height-label${heightLinked}`} x="192" y={(190 + objectY) / 2}>Δh {formatMeasurement(state.height, 1)} m</text>
          <g className={`potential-mass${massLinked}`} transform={`translate(${300 - objectSize / 2} ${objectY - objectSize / 2})`}><rect height={objectSize} rx="8" width={objectSize} /><text textAnchor="middle" x={objectSize / 2} y={objectSize / 2 + 4}>{formatMeasurement(state.mass, 1)} kg</text></g>
          <g className={`potential-field${gravityLinked}`} aria-hidden="true">{Array.from({ length: 5 }, (_, index) => <path d="M 420 74 v 32 l -5 -8 m 5 8 l 5 -8" key={index} transform={`translate(${index * 22} ${index % 2 ? 12 : 0})`} />)}</g>
          <g className={`potential-energy-column${energy < 0 ? ' is-negative' : ''}${energyLinked}`}><rect height="210" rx="7" width="34" x="500" y="50" /><rect height={energyBarHeight} width="34" x="500" y={energy >= 0 ? 155 - energyBarHeight : 155} /><line x1="494" x2="540" y1="155" y2="155" /><text textAnchor="middle" x="517" y="282">ΔEₚ</text></g>
        </svg>
        <div className="newton-stage__readouts">
          <div className={energyLinked}><span>Energy change</span><strong>{formatMeasurement(energy)} <small>J</small></strong></div>
          <div className={heightLinked}><span>Height change</span><strong>{formatMeasurement(state.height)} <small>m</small></strong></div>
          <div className={gravityLinked}><span>Field</span><strong>{formatMeasurement(state.gravity)} <small>m/s²</small></strong></div>
        </div>
        <p className="potential-reference-note">The dashed plane defines zero. Negative Δh gives a negative energy change, not “negative absolute energy.” The column compresses large magnitudes while the numerical value and graphs remain exact.</p>
      </section>
      <aside className="newton-console" aria-label="Potential energy controls">
        <header><span>Position console</span><strong>Live · SI units</strong></header>
        <InstrumentControl highlightedVariable={highlightedVariable} label="Mass" max={POTENTIAL_MASS_RANGE.max} min={POTENTIAL_MASS_RANGE.min} onChange={(mass) => setState((current) => ({ ...current, mass }))} onHighlightVariable={onHighlightVariable} step={POTENTIAL_MASS_RANGE.step} symbol="m" unit="kg" value={state.mass} variableId="mass" />
        <InstrumentControl highlightedVariable={highlightedVariable} label="Gravity" max={GRAVITY_RANGE.max} min={GRAVITY_RANGE.min} onChange={(gravity) => setState((current) => ({ ...current, gravity }))} onHighlightVariable={onHighlightVariable} step={GRAVITY_RANGE.step} symbol="g" unit="m/s²" value={state.gravity} variableId="gravitational-field-strength" />
        <InstrumentControl highlightedVariable={highlightedVariable} label="Height change" max={POTENTIAL_HEIGHT_RANGE.max} min={POTENTIAL_HEIGHT_RANGE.min} onChange={(height) => setState((current) => ({ ...current, height }))} onHighlightVariable={onHighlightVariable} step={POTENTIAL_HEIGHT_RANGE.step} symbol="Δh" unit="m" value={state.height} variableId="height" />
        <div className={`newton-result${energyLinked}`}><span>Calculated energy change</span><output><var>ΔEₚ</var> = {formatMeasurement(energy)} <small>J</small></output><code>{formatMeasurement(state.mass, 1)} × {formatMeasurement(state.gravity, 2)} × {formatMeasurement(state.height, 1)}</code></div>
        <p className="newton-console__note">The field is uniform over the modeled height interval. Change gravity to compare Earth, Moon, and stronger planetary fields.</p>
      </aside>
    </div>
  )
}
