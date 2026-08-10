import { ArrowRight, Equal } from 'lucide-react'
import { useMemo, useState } from 'react'
import { getVariableDefinition } from '../../data/variables'
import type {
  FormulaRearrangement,
  FormulaRecord,
  PhysicsVariableId,
} from '../../types/formula'
import { FormulaExpression } from '../math/FormulaExpression'

interface EquationRearrangerProps {
  formula: FormulaRecord
  highlightedVariable: PhysicsVariableId | null
  onHighlightVariable: (variableId: PhysicsVariableId | null) => void
}

export function EquationRearranger({
  formula,
  highlightedVariable,
  onHighlightVariable,
}: EquationRearrangerProps) {
  const referenceVariable =
    formula.variables.find((variable) => variable.role === 'output')?.id ?? formula.variables[0].id
  const options = useMemo<FormulaRearrangement[]>(
    () => [
      {
        solveFor: referenceVariable,
        operation: 'The reference relationship already has this quantity isolated.',
        expression: formula.expression,
      },
      ...formula.rearrangements.filter(
        (rearrangement) => rearrangement.solveFor !== referenceVariable,
      ),
    ],
    [formula, referenceVariable],
  )
  const [selectedVariableId, setSelectedVariableId] = useState(referenceVariable)
  const selected =
    options.find((rearrangement) => rearrangement.solveFor === selectedVariableId) ?? options[0]
  const selectedVariable = getVariableDefinition(selected.solveFor)

  return (
    <section className="equation-rearranger" aria-labelledby="rearrangement-title">
      <header className="instrument-heading">
        <div>
          <span>Algebra instrument</span>
          <h2 id="rearrangement-title">Choose the quantity to isolate.</h2>
        </div>
        <small>{options.length} valid forms · registry linked</small>
      </header>

      <div className="equation-rearranger__selector" aria-label="Solve equation for" role="group">
        {options.map((option) => {
          const variable = getVariableDefinition(option.solveFor)
          const isSelected = option.solveFor === selected.solveFor
          return (
            <button
              aria-pressed={isSelected}
              className={isSelected ? 'is-active' : ''}
              key={option.solveFor}
              onBlur={() => onHighlightVariable(null)}
              onClick={() => setSelectedVariableId(option.solveFor)}
              onFocus={() => onHighlightVariable(option.solveFor)}
              onMouseEnter={() => onHighlightVariable(option.solveFor)}
              onMouseLeave={() => onHighlightVariable(null)}
              type="button"
            >
              <var>{variable.symbol}</var>
              <span>Solve for <strong>{variable.name}</strong></span>
            </button>
          )
        })}
      </div>

      <div
        aria-live="polite"
        className="equation-rearranger__sequence"
        key={selected.solveFor}
      >
        <section className="algebra-step algebra-step--reference">
          <span>01 · Reference relationship</span>
          <FormulaExpression
            expression={formula.expression}
            highlightVariableId={highlightedVariable}
            onVariableHighlight={onHighlightVariable}
          />
        </section>

        <div className="algebra-operation">
          <ArrowRight aria-hidden="true" size={18} />
          <span>02 · Inverse operation</span>
          <strong>{selected.operation}</strong>
        </div>

        <section className="algebra-step algebra-step--result">
          <span>03 · Isolated quantity</span>
          <FormulaExpression
            expression={selected.expression}
            highlightVariableId={highlightedVariable}
            onVariableHighlight={onHighlightVariable}
          />
          <small>
            <Equal aria-hidden="true" size={13} /> {selectedVariable.name} ·{' '}
            {selectedVariable.siUnit.symbol}
          </small>
        </section>
      </div>
    </section>
  )
}
