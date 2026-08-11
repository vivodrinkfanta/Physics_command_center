import { Ruler, Scale, ShieldCheck, TriangleAlert } from 'lucide-react'
import type { FormulaRecord } from '../../types/formula'

interface FormulaIntegrityBarProps {
  formula: FormulaRecord
  onOpenDimensions: () => void
  onOpenExplanation: () => void
}

export function FormulaIntegrityBar({
  formula,
  onOpenDimensions,
  onOpenExplanation,
}: FormulaIntegrityBarProps) {
  return (
    <aside className="formula-integrity" aria-label="Model integrity summary">
      <div>
        <Ruler aria-hidden="true" size={16} />
        <span>
          <small>Calculation basis</small>
          <strong>SI internally</strong>
        </span>
      </div>
      <button aria-controls="formula-inspector-panel" onClick={onOpenExplanation} type="button">
        <ShieldCheck aria-hidden="true" size={16} />
        <span>
          <small>Model envelope</small>
          <strong>{formula.assumptions.length} stated assumptions</strong>
        </span>
      </button>
      <button aria-controls="formula-inspector-panel" onClick={onOpenExplanation} type="button">
        <TriangleAlert aria-hidden="true" size={16} />
        <span>
          <small>Error guardrails</small>
          <strong>{formula.commonMistakes.length} mistakes to avoid</strong>
        </span>
      </button>
      <button aria-controls="formula-inspector-panel" onClick={onOpenDimensions} type="button">
        <Scale aria-hidden="true" size={16} />
        <span>
          <small>Dimension status</small>
          <strong>Both sides match</strong>
        </span>
      </button>
    </aside>
  )
}
