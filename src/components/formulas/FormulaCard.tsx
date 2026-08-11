import { ArrowUpRight, BarChart3, Box, Gauge } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getVariableDefinition } from '../../data/variables'
import type { FormulaRecord, PhysicsVariableId } from '../../types/formula'
import { FormulaExpression } from '../math/FormulaExpression'

interface FormulaCardProps {
  formula: FormulaRecord
}

const difficultyLabels = ['Foundation', 'Developing', 'Advanced', 'Advanced', 'Advanced']

export function FormulaCard({ formula }: FormulaCardProps) {
  const [highlightedVariable, setHighlightedVariable] = useState<PhysicsVariableId | null>(null)
  const variables = formula.variables.map(({ id }) => getVariableDefinition(id))

  return (
    <article className="formula-card" onMouseLeave={() => setHighlightedVariable(null)}>
      <div className="formula-card__topline">
        <span>{formula.subtopic}</span>
        <span className={`difficulty difficulty--${formula.difficulty}`}>
          {difficultyLabels[formula.difficulty - 1]}
        </span>
      </div>

      <Link
        aria-label={`Open ${formula.name} in Formula Inspector`}
        className="formula-card__equation-link"
        to={`/formulas/${formula.id}`}
      >
        <FormulaExpression
          className="formula-card__equation"
          expression={formula.expression}
          highlightVariableId={highlightedVariable}
        />
      </Link>

      <div className="formula-card__copy">
        <h2>
          <Link to={`/formulas/${formula.id}`}>{formula.name}</Link>
        </h2>
        <p>{formula.description}</p>
      </div>

      <div className="formula-card__variables" aria-label={`Variables in ${formula.name}`}>
        {variables.map((variable) => (
          <button
            aria-label={`${variable.symbol}: ${variable.name}, SI unit ${variable.siUnit.symbol}`}
            aria-pressed={highlightedVariable === variable.id}
            className={`variable-chip${
              highlightedVariable === variable.id ? ' variable-chip--active' : ''
            }`}
            key={variable.id}
            onBlur={() => setHighlightedVariable(null)}
            onClick={() =>
              setHighlightedVariable((current) => (current === variable.id ? null : variable.id))
            }
            onFocus={() => setHighlightedVariable(variable.id)}
            onMouseEnter={() => setHighlightedVariable(variable.id)}
            type="button"
          >
            <var>{variable.symbol}</var>
            <span>{variable.name}</span>
            <small>{variable.siUnit.symbol}</small>
          </button>
        ))}
      </div>

      <footer className="formula-card__footer">
        <div className="formula-card__capabilities" aria-label="Available formula data">
          {formula.simulationType && (
            <span title={`Registered simulation model: ${formula.simulationType}`}>
              <Box aria-hidden="true" size={14} /> Model
            </span>
          )}
          {formula.graphTypes.length > 0 && (
            <span title={`${formula.graphTypes.length} graph model(s)`}>
              <BarChart3 aria-hidden="true" size={14} /> {formula.graphTypes.length} graph
              {formula.graphTypes.length === 1 ? '' : 's'}
            </span>
          )}
          <span title={`${formula.rearrangements.length} stored rearrangement(s)`}>
            <Gauge aria-hidden="true" size={14} /> {formula.rearrangements.length} forms
          </span>
        </div>
        <Link className="formula-card__open" to={`/formulas/${formula.id}`}>
          Open Inspector
          <ArrowUpRight aria-hidden="true" size={15} />
        </Link>
      </footer>
    </article>
  )
}
