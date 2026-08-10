import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  Boxes,
  Calculator,
  FlaskConical,
  GraduationCap,
  Network,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import { NewtonGraphs } from '../components/inspector/NewtonGraphs'
import { NewtonPractice } from '../components/inspector/NewtonPractice'
import { NewtonSecondLawLab } from '../components/inspector/NewtonSecondLawLab'
import { FormulaExpression } from '../components/math/FormulaExpression'
import { mechanicsFormulas } from '../data/formulas'
import { getVariableDefinition } from '../data/variables'
import type { FormulaRecord, PhysicsVariableId } from '../types/formula'
import type { NewtonState } from '../utils/newtonSecondLaw'

const inspectorTabs = [
  { id: 'simulate', label: 'Simulate', icon: Boxes },
  { id: 'explain', label: 'Explain', icon: BookOpen },
  { id: 'rearrange', label: 'Rearrange', icon: Calculator },
  { id: 'graph', label: 'Graph', icon: BarChart3 },
  { id: 'example', label: 'Example', icon: GraduationCap },
  { id: 'practice', label: 'Practice', icon: FlaskConical },
  { id: 'related', label: 'Related', icon: Network },
] as const

type InspectorTabId = (typeof inspectorTabs)[number]['id']

function ExplainPanel({ formula }: { formula: FormulaRecord }) {
  return (
    <div className="inspector-learning-grid">
      <section className="learning-panel learning-panel--wide">
        <span>Physical meaning</span>
        <h2>{formula.description}</h2>
        <p>
          The equation describes a relationship between measured quantities, not a rule tied to
          one specific object. Its sign and direction depend on the coordinate system you choose.
        </p>
      </section>
      <section className="learning-panel">
        <span>Valid when</span>
        <ul>{formula.assumptions.map((assumption) => <li key={assumption}>{assumption}</li>)}</ul>
      </section>
      <section className="learning-panel learning-panel--warning">
        <span>Common mistakes</span>
        <ul>{formula.commonMistakes.map((mistake) => <li key={mistake}>{mistake}</li>)}</ul>
      </section>
      <section className="learning-panel learning-panel--wide dimension-readout">
        <span>Dimensional check</span>
        <code>{formula.dimensionalAnalysis}</code>
        <strong>Dimensionally consistent</strong>
      </section>
    </div>
  )
}

function RearrangePanel({
  formula,
  highlightedVariable,
  onHighlightVariable,
}: {
  formula: FormulaRecord
  highlightedVariable: PhysicsVariableId | null
  onHighlightVariable: (variableId: PhysicsVariableId | null) => void
}) {
  return (
    <section className="rearrangement-panel" aria-labelledby="rearrangement-title">
      <header>
        <span>Stored algebraic forms</span>
        <h2 id="rearrangement-title">Choose the quantity you need to isolate.</h2>
      </header>
      <div>
        {formula.rearrangements.map((rearrangement) => {
          const variable = getVariableDefinition(rearrangement.solveFor)
          return (
            <article key={rearrangement.solveFor}>
              <span>Solve for {variable.name}</span>
              <FormulaExpression
                expression={rearrangement.expression}
                highlightVariableId={highlightedVariable}
                onVariableHighlight={onHighlightVariable}
              />
              <small>{variable.symbol} · {variable.siUnit.symbol}</small>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function ExamplePanel({ formula }: { formula: FormulaRecord }) {
  return (
    <div className="example-stack">
      {formula.workedExamples.map((example, index) => (
        <article className="worked-example" key={example.prompt}>
          <header><span>Worked example {String(index + 1).padStart(2, '0')}</span></header>
          <h2>{example.prompt}</h2>
          <div className="worked-example__knowns">
            {example.knownValues.map((known) => {
              const variable = getVariableDefinition(known.variableId)
              return <span key={known.variableId}><var>{variable.symbol}</var> = {known.value} {known.unit}</span>
            })}
          </div>
          <ol>{example.steps.map((step) => <li key={step}>{step}</li>)}</ol>
          <strong>Answer · {example.answer}</strong>
        </article>
      ))}
    </div>
  )
}

function RelatedPanel({ formula }: { formula: FormulaRecord }) {
  const related = mechanicsFormulas.filter((candidate) =>
    formula.relatedFormulaIds.includes(candidate.id),
  )

  return (
    <section className="related-panel" aria-labelledby="related-title">
      <header>
        <span>Continue the model</span>
        <h2 id="related-title">Related relationships</h2>
      </header>
      <div>
        {related.map((candidate) => (
          <Link key={candidate.id} to={`/formulas/${candidate.id}`}>
            <span>{candidate.subtopic}</span>
            <FormulaExpression expression={candidate.expression} />
            <strong>{candidate.name}</strong>
            <small>{candidate.description}</small>
          </Link>
        ))}
      </div>
    </section>
  )
}

function PendingInstrument({ formula, instrument }: { formula: FormulaRecord; instrument: string }) {
  return (
    <section className="pending-instrument">
      <FlaskConical aria-hidden="true" size={22} />
      <span>Registry connected</span>
      <h2>{instrument} for {formula.name}</h2>
      <p>
        Its formula data, variables, units, examples, and relationships are ready. The specialized
        interactive model will follow the Newton benchmark rather than using a generic animation.
      </p>
    </section>
  )
}

export function FormulaInspectorPage() {
  const { formulaId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const formula = mechanicsFormulas.find((candidate) => candidate.id === formulaId)
  const requestedTab = searchParams.get('tab')
  const activeTab: InspectorTabId = inspectorTabs.some((tab) => tab.id === requestedTab)
    ? (requestedTab as InspectorTabId)
    : 'simulate'
  const [highlightedVariable, setHighlightedVariable] = useState<PhysicsVariableId | null>(null)
  const [newtonState, setNewtonState] = useState<NewtonState>({ force: 20, mass: 5, time: 0 })
  const variableDefinitions = useMemo(
    () => formula?.variables.map(({ id }) => getVariableDefinition(id)) ?? [],
    [formula],
  )

  if (!formula) return <Navigate replace to="/formulas" />

  const isNewtonBenchmark = formula.id === 'newton-second-law'
  const selectTab = (tab: InspectorTabId) => {
    const next = new URLSearchParams(searchParams)
    if (tab === 'simulate') next.delete('tab')
    else next.set('tab', tab)
    setSearchParams(next, { replace: true })
  }

  return (
    <div className="formula-inspector">
      <Link className="formula-inspector__back" to="/formulas">
        <ArrowLeft aria-hidden="true" size={15} /> Formula Library
      </Link>

      <header className="formula-inspector__header">
        <div className="formula-inspector__identity">
          <p className="eyebrow">
            <FlaskConical aria-hidden="true" size={14} />
            {formula.category} · {formula.subtopic}
          </p>
          <h1>{formula.name}</h1>
          <p>{formula.description}</p>
        </div>
        <div className="formula-inspector__equation-panel">
          <span>Reference relationship</span>
          <FormulaExpression
            expression={formula.expression}
            highlightVariableId={highlightedVariable}
            onVariableHighlight={setHighlightedVariable}
          />
          <small>Focus a variable to trace it through the active instrument.</small>
        </div>
      </header>

      <div className="formula-inspector__variables" aria-label="Formula variable register">
        {variableDefinitions.map((variable) => (
          <button
            className={highlightedVariable === variable.id ? 'is-active' : ''}
            key={variable.id}
            onBlur={() => setHighlightedVariable(null)}
            onFocus={() => setHighlightedVariable(variable.id)}
            onMouseEnter={() => setHighlightedVariable(variable.id)}
            onMouseLeave={() => setHighlightedVariable(null)}
            type="button"
          >
            <var>{variable.symbol}</var>
            <span><strong>{variable.name}</strong><small>{variable.nature} · {variable.siUnit.symbol}</small></span>
          </button>
        ))}
      </div>

      <nav className="inspector-tabs" aria-label="Formula Inspector modes">
        {inspectorTabs.map(({ icon: Icon, id, label }) => (
          <button
            aria-current={activeTab === id ? 'page' : undefined}
            className={activeTab === id ? 'is-active' : ''}
            key={id}
            onClick={() => selectTab(id)}
            type="button"
          >
            <Icon aria-hidden="true" size={15} /> {label}
            {id === 'simulate' && isNewtonBenchmark && <small>Live</small>}
          </button>
        ))}
      </nav>

      <main className="formula-inspector__content">
        {activeTab === 'simulate' &&
          (isNewtonBenchmark ? (
            <NewtonSecondLawLab
              highlightedVariable={highlightedVariable}
              onHighlightVariable={setHighlightedVariable}
              setState={setNewtonState}
              state={newtonState}
            />
          ) : (
            <PendingInstrument formula={formula} instrument="Simulation" />
          ))}
        {activeTab === 'explain' && <ExplainPanel formula={formula} />}
        {activeTab === 'rearrange' && (
          <RearrangePanel
            formula={formula}
            highlightedVariable={highlightedVariable}
            onHighlightVariable={setHighlightedVariable}
          />
        )}
        {activeTab === 'graph' &&
          (isNewtonBenchmark ? (
            <NewtonGraphs highlightedVariable={highlightedVariable} state={newtonState} />
          ) : (
            <PendingInstrument formula={formula} instrument="Live graph" />
          ))}
        {activeTab === 'example' && <ExamplePanel formula={formula} />}
        {activeTab === 'practice' &&
          (isNewtonBenchmark ? (
            <NewtonPractice />
          ) : (
            <PendingInstrument formula={formula} instrument="Practice generator" />
          ))}
        {activeTab === 'related' && <RelatedPanel formula={formula} />}
      </main>
    </div>
  )
}
