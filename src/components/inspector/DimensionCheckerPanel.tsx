import { CheckCircle2, ChevronRight, Scale } from 'lucide-react'
import { useState } from 'react'
import { getVariableDefinition } from '../../data/variables'
import type { FormulaRecord, PhysicsVariableId } from '../../types/formula'
import { FormulaExpression } from '../math/FormulaExpression'

type DimensionLens = 'units' | 'base' | 'reduced'

interface DimensionCheckerPanelProps {
  formula: FormulaRecord
  highlightedVariable: PhysicsVariableId | null
  onHighlightVariable: (variableId: PhysicsVariableId | null) => void
}

const lensLabels: Array<{ id: DimensionLens; label: string; step: string }> = [
  { id: 'units', label: 'Substitute SI units', step: '01' },
  { id: 'base', label: 'Replace with dimensions', step: '02' },
  { id: 'reduced', label: 'Reduce both sides', step: '03' },
]

export function DimensionCheckerPanel({
  formula,
  highlightedVariable,
  onHighlightVariable,
}: DimensionCheckerPanelProps) {
  const [activeLens, setActiveLens] = useState<DimensionLens>('units')
  const analysis = formula.dimensionalAnalysis
  const activeExpression =
    activeLens === 'units'
      ? analysis.siSubstitution
      : activeLens === 'base'
        ? analysis.baseSubstitution
        : `${analysis.leftDimensions} = ${analysis.rightDimensions}`
  const activeExplanation =
    activeLens === 'units'
      ? 'Replace each symbol with its registered SI unit. Numerical constants have no dimensions.'
      : activeLens === 'base'
        ? 'Rewrite every unit using mass M, length L, and time T before simplifying powers.'
        : 'Like dimensions match on both sides, so the relationship passes this consistency test.'

  return (
    <section className="dimension-checker" aria-labelledby="dimension-checker-title">
      <header className="instrument-heading">
        <div>
          <span>Dimensional analysis console</span>
          <h2 id="dimension-checker-title">Trace the equation down to base dimensions.</h2>
        </div>
        <small><CheckCircle2 aria-hidden="true" size={13} /> Registry validated</small>
      </header>

      <div className="dimension-checker__reference">
        <span>Reference relationship</span>
        <FormulaExpression
          expression={formula.expression}
          highlightVariableId={highlightedVariable}
          onVariableHighlight={onHighlightVariable}
        />
        <small>Focus any variable to locate its unit and dimensional signature below.</small>
      </div>

      <div className="dimension-checker__variables" aria-label="Variable dimensional register">
        {formula.variables.map(({ id, role }) => {
          const variable = getVariableDefinition(id)
          return (
            <button
              aria-pressed={highlightedVariable === id}
              className={highlightedVariable === id ? 'is-active' : ''}
              key={id}
              onBlur={() => onHighlightVariable(null)}
              onFocus={() => onHighlightVariable(id)}
              onMouseEnter={() => onHighlightVariable(id)}
              onMouseLeave={() => onHighlightVariable(null)}
              type="button"
            >
              <var>{variable.symbol}</var>
              <span><strong>{variable.name}</strong><small>{role}</small></span>
              <code>{variable.siUnit.symbol}</code>
              <code>{variable.siUnit.dimension}</code>
            </button>
          )
        })}
      </div>

      <div className="dimension-checker__workspace">
        <nav aria-label="Dimensional analysis stages" className="dimension-lenses">
          {lensLabels.map((lens, index) => (
            <div key={lens.id}>
              <button
                aria-pressed={activeLens === lens.id}
                className={activeLens === lens.id ? 'is-active' : ''}
                onClick={() => setActiveLens(lens.id)}
                type="button"
              >
                <span>{lens.step}</span>
                <strong>{lens.label}</strong>
              </button>
              {index < lensLabels.length - 1 && <ChevronRight aria-hidden="true" size={15} />}
            </div>
          ))}
        </nav>

        <section aria-live="polite" className="dimension-stage" key={activeLens}>
          <span>{lensLabels.find((lens) => lens.id === activeLens)?.label}</span>
          <code>{activeExpression}</code>
          <p>{activeExplanation}</p>
        </section>

        <section className="dimension-verdict">
          <div>
            <span>Left-hand side</span>
            <code>{analysis.leftDimensions}</code>
          </div>
          <Scale aria-hidden="true" size={25} />
          <div>
            <span>Right-hand side</span>
            <code>{analysis.rightDimensions}</code>
          </div>
          <strong><CheckCircle2 aria-hidden="true" size={15} /> Dimensionally consistent</strong>
        </section>
      </div>
    </section>
  )
}
