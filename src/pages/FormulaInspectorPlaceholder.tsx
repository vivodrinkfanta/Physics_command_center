import { ArrowLeft, ArrowRight, FlaskConical } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { FormulaExpression } from '../components/math/FormulaExpression'
import { mechanicsFormulas } from '../data/formulas'
import { getVariableDefinition } from '../data/variables'

export function FormulaInspectorPlaceholder() {
  const { formulaId } = useParams()
  const formula = mechanicsFormulas.find((candidate) => candidate.id === formulaId)

  if (!formula) return <Navigate replace to="/formulas" />

  return (
    <section className="inspector-preview" aria-labelledby="inspector-preview-title">
      <Link className="inspector-preview__back" to="/formulas">
        <ArrowLeft aria-hidden="true" size={15} /> Back to Formula Library
      </Link>

      <div className="inspector-preview__workspace">
        <div className="inspector-preview__main">
          <p className="eyebrow">
            <FlaskConical aria-hidden="true" size={14} />
            {formula.subtopic} · Inspector staging
          </p>
          <FormulaExpression
            className="inspector-preview__equation"
            expression={formula.expression}
          />
          <h1 id="inspector-preview-title">{formula.name}</h1>
          <p>{formula.description}</p>

          <div className="inspector-preview__variables" aria-label="Formula variables">
            {formula.variables.map(({ id, role }) => {
              const variable = getVariableDefinition(id)
              return (
                <div key={id}>
                  <var>{variable.symbol}</var>
                  <span>
                    <strong>{variable.name}</strong>
                    <small>{role} · {variable.siUnit.symbol}</small>
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <aside className="inspector-preview__status">
          <span>Next build · Step 06</span>
          <h2>Formula Inspector</h2>
          <p>
            This formula is selected and ready. Step 6 will connect live controls,
            rearrangements, graphs, examples, practice, and related models here.
          </p>
          <dl>
            <div><dt>Rearrangements</dt><dd>{formula.rearrangements.length}</dd></div>
            <div><dt>Graph models</dt><dd>{formula.graphTypes.length}</dd></div>
            <div><dt>Worked examples</dt><dd>{formula.workedExamples.length}</dd></div>
          </dl>
          <Link to={`/formulas?q=${encodeURIComponent(formula.subtopic)}`}>
            Browse related topic <ArrowRight aria-hidden="true" size={15} />
          </Link>
        </aside>
      </div>
    </section>
  )
}
