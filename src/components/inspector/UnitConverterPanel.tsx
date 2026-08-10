import { AlertTriangle, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { getVariableDefinition } from '../../data/variables'
import type { FormulaRecord, PhysicsVariableId } from '../../types/formula'
import {
  assessUnitInput,
  describeConversionRule,
  formatPhysicsValue,
} from '../../utils/units'

interface UnitConverterPanelProps {
  formula: FormulaRecord
  onHighlightVariable: (variableId: PhysicsVariableId | null) => void
}

const getSuggestedValue = (unitSymbol: string, scaleToSI: number, fallback: number) => {
  if (unitSymbol === 'g') return 500
  if (unitSymbol === 'km/h') return 72
  if (scaleToSI < 1) return 100
  if (scaleToSI > 1) return 1
  return fallback
}

export function UnitConverterPanel({
  formula,
  onHighlightVariable,
}: UnitConverterPanelProps) {
  const defaultReference =
    formula.variables.find((variable) => variable.id === 'mass') ??
    formula.variables.find(
      (variable) => getVariableDefinition(variable.id).acceptedUnits.length > 1,
    ) ??
    formula.variables[0]
  const defaultVariable = getVariableDefinition(defaultReference.id)
  const defaultUnit = defaultVariable.acceptedUnits[1] ?? defaultVariable.acceptedUnits[0]
  const [selectedVariableId, setSelectedVariableId] = useState(defaultVariable.id)
  const [inputValue, setInputValue] = useState(
    getSuggestedValue(
      defaultUnit.symbol,
      defaultUnit.scaleToSI,
      defaultReference.control?.defaultValue ?? 1,
    ),
  )
  const [unitSymbol, setUnitSymbol] = useState(defaultUnit.symbol)
  const variableReference = formula.variables.find(
    (candidate) => candidate.id === selectedVariableId,
  ) ?? formula.variables[0]
  const variable = getVariableDefinition(variableReference.id)
  const assessment = useMemo(
    () => assessUnitInput(variable.id, inputValue, unitSymbol),
    [inputValue, unitSymbol, variable.id],
  )
  const datalistId = `accepted-units-${formula.id}-${variable.id}`

  const selectVariable = (variableId: PhysicsVariableId) => {
    const nextReference = formula.variables.find((candidate) => candidate.id === variableId)
    if (!nextReference) return
    const nextVariable = getVariableDefinition(variableId)
    const nextUnit = nextVariable.acceptedUnits[1] ?? nextVariable.acceptedUnits[0]
    setSelectedVariableId(variableId)
    setUnitSymbol(nextUnit.symbol)
    setInputValue(
      getSuggestedValue(
        nextUnit.symbol,
        nextUnit.scaleToSI,
        nextReference.control?.defaultValue ?? 1,
      ),
    )
  }

  return (
    <section className="unit-instrument" aria-labelledby="units-title">
      <header className="instrument-heading">
        <div>
          <span>SI conversion console</span>
          <h2 id="units-title">Check a value before it enters the equation.</h2>
        </div>
        <small>All calculations remain in SI internally</small>
      </header>

      <div className="unit-instrument__variables" aria-label="Choose a formula variable">
        {formula.variables.map(({ id }) => {
          const candidate = getVariableDefinition(id)
          return (
            <button
              aria-pressed={candidate.id === variable.id}
              className={candidate.id === variable.id ? 'is-active' : ''}
              key={candidate.id}
              onBlur={() => onHighlightVariable(null)}
              onClick={() => selectVariable(candidate.id)}
              onFocus={() => onHighlightVariable(candidate.id)}
              onMouseEnter={() => onHighlightVariable(candidate.id)}
              onMouseLeave={() => onHighlightVariable(null)}
              type="button"
            >
              <var>{candidate.symbol}</var>
              <span>{candidate.name}</span>
              <small>{candidate.siUnit.symbol}</small>
            </button>
          )
        })}
      </div>

      <div className="unit-instrument__workspace">
        <section className="unit-input-panel">
          <span>Input reading</span>
          <div className="unit-input-row">
            <label>
              <span>Numerical value</span>
              <input
                inputMode="decimal"
                onChange={(event) => setInputValue(event.currentTarget.valueAsNumber)}
                step="any"
                type="number"
                value={Number.isNaN(inputValue) ? '' : inputValue}
              />
            </label>
            <label>
              <span>Unit symbol</span>
              <input
                autoComplete="off"
                list={datalistId}
                onChange={(event) => setUnitSymbol(event.currentTarget.value)}
                spellCheck="false"
                type="text"
                value={unitSymbol}
              />
              <datalist id={datalistId}>
                {variable.acceptedUnits.map((unit) => (
                  <option key={unit.symbol} value={unit.symbol}>{unit.name}</option>
                ))}
              </datalist>
            </label>
          </div>
          <p>
            Expected dimension <code>{variable.siUnit.dimension}</code> for {variable.name}.
            Type another known symbol to test compatibility.
          </p>
        </section>

        <section
          className={`unit-monitor unit-monitor--${assessment.status}`}
          role={
            assessment.status === 'incompatible' || assessment.status === 'unknown'
              ? 'alert'
              : 'status'
          }
        >
          {(assessment.status === 'ready' || assessment.status === 'converted') && (
            <>
              <CheckCircle2 aria-hidden="true" size={20} />
              <span>
                {assessment.status === 'ready' ? 'SI value ready' : 'Converted to SI'}
              </span>
              <output>
                {formatPhysicsValue(inputValue)} {assessment.inputUnit.symbol}
                <ArrowRight aria-hidden="true" size={18} />
                <strong>{formatPhysicsValue(assessment.siValue)} {variable.siUnit.symbol}</strong>
              </output>
              <code>
                {describeConversionRule(assessment.inputUnit, variable.siUnit)}
              </code>
              <small>The right-hand value is the one used by physics calculations.</small>
            </>
          )}
          {assessment.status === 'incompatible' && (
            <>
              <AlertTriangle aria-hidden="true" size={20} />
              <span>Dimension mismatch detected</span>
              <strong>
                {assessment.detectedUnit.symbol} measures {assessment.detectedUnit.dimension}
              </strong>
              <p>
                {variable.symbol} requires {variable.siUnit.dimension}. Choose one of its accepted
                units.
              </p>
            </>
          )}
          {assessment.status === 'unsupported' && (
            <>
              <AlertTriangle aria-hidden="true" size={20} />
              <span>Unit not accepted for this quantity</span>
              <strong>{assessment.detectedUnit.symbol} has compatible dimensions</strong>
              <p>
                Use an explicitly accepted {variable.name} unit so the physical meaning stays
                clear.
              </p>
            </>
          )}
          {(assessment.status === 'unknown' || assessment.status === 'invalid-value') && (
            <>
              <AlertTriangle aria-hidden="true" size={20} />
              <span>
                {assessment.status === 'unknown'
                  ? 'Unknown unit symbol'
                  : 'Enter a numerical value'}
              </span>
              <strong>No conversion was applied</strong>
              <p>Use one of the accepted symbols listed below.</p>
            </>
          )}
        </section>
      </div>

      <section className="accepted-units" aria-labelledby="accepted-units-title">
        <header>
          <span id="accepted-units-title">Accepted units for {variable.symbol}</span>
          <small>{variable.acceptedUnits.length} registered conversion rules</small>
        </header>
        <div>
          {variable.acceptedUnits.map((unit) => (
            <button
              className={unit.symbol === unitSymbol ? 'is-active' : ''}
              key={unit.symbol}
              onClick={() => {
                setUnitSymbol(unit.symbol)
                setInputValue(
                  getSuggestedValue(
                    unit.symbol,
                    unit.scaleToSI,
                    variableReference.control?.defaultValue ?? 1,
                  ),
                )
              }}
              type="button"
            >
              <RefreshCw aria-hidden="true" size={14} />
              <span>
                <strong>{unit.symbol}</strong>
                <small>{unit.name}</small>
              </span>
              <code>{describeConversionRule(unit, variable.siUnit)}</code>
            </button>
          ))}
        </div>
      </section>
    </section>
  )
}
