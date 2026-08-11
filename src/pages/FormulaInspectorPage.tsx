import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  Boxes,
  Calculator,
  EyeOff,
  FlaskConical,
  GraduationCap,
  Network,
  Ruler,
  Scale,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import { EquationRearranger } from '../components/inspector/EquationRearranger'
import { DimensionCheckerPanel } from '../components/inspector/DimensionCheckerPanel'
import { FormulaPractice } from '../components/inspector/FormulaPractice'
import { FormulaIntegrityBar } from '../components/inspector/FormulaIntegrityBar'
import { FormulaRelationshipMap } from '../components/inspector/FormulaRelationshipMap'
import { NewtonGraphs } from '../components/inspector/NewtonGraphs'
import { NewtonSecondLawLab } from '../components/inspector/NewtonSecondLawLab'
import { UnitConverterPanel } from '../components/inspector/UnitConverterPanel'
import { FormulaExpression } from '../components/math/FormulaExpression'
import { findFormulaById } from '../data/formulas'
import { getVariableDefinition } from '../data/variables'
import type { FormulaRecord, PhysicsVariableId } from '../types/formula'
import type { NewtonState } from '../utils/newtonSecondLaw'

const inspectorTabs = [
  { id: 'simulate', label: 'Simulate', icon: Boxes },
  { id: 'explain', label: 'Explain', icon: BookOpen },
  { id: 'rearrange', label: 'Rearrange', icon: Calculator },
  { id: 'units', label: 'Units', icon: Ruler },
  { id: 'dimensions', label: 'Dimensions', icon: Scale },
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
          one specific object. Use each quantity with the scalar, vector, or component meaning and
          assumptions listed for this model.
        </p>
      </section>
      <section className="learning-panel">
        <span>Valid when</span>
        <ul>{formula.assumptions.map((assumption) => <li key={assumption}>{assumption}</li>)}</ul>
      </section>
      <section className="learning-panel learning-panel--warning">
        <span>Common mistakes</span>
        <ol>
          {formula.commonMistakes.map((mistake, index) => (
            <li key={mistake}>
              <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              {mistake}
            </li>
          ))}
        </ol>
      </section>
      <section className="learning-panel learning-panel--wide dimension-readout">
        <span>Dimensional check</span>
        <code>{formula.dimensionalAnalysis.siSubstitution}</code>
        <strong>Open Dimensions for the full trace</strong>
      </section>
    </div>
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
  const formula = findFormulaById(formulaId)
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
  const moveTabFocus = (currentIndex: number, offset: number) => {
    const nextIndex = (currentIndex + offset + inspectorTabs.length) % inspectorTabs.length
    const nextTab = inspectorTabs[nextIndex]
    selectTab(nextTab.id)
    window.requestAnimationFrame(() =>
      document.getElementById(`inspector-tab-${nextTab.id}`)?.focus(),
    )
  }

  return (
    <div className={`formula-inspector${activeTab === 'practice' ? ' formula-inspector--practice' : ''}`}>
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
          {activeTab === 'practice' ? (
            <div className="formula-inspector__recall-shield">
              <EyeOff aria-hidden="true" size={20} />
              <span>Recall mode</span>
              <strong>Equation held back</strong>
              <small>Reveal it only if you choose the second hint.</small>
            </div>
          ) : (
            <>
              <span>Reference relationship</span>
              <FormulaExpression
                expression={formula.expression}
                highlightVariableId={highlightedVariable}
                onVariableHighlight={setHighlightedVariable}
              />
              <small>Focus a variable to trace it through the active instrument.</small>
            </>
          )}
        </div>
      </header>

      <div className="formula-inspector__variables" aria-label="Formula variable register">
        {variableDefinitions.map((variable) => (
          <button
            aria-pressed={highlightedVariable === variable.id}
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

      <FormulaIntegrityBar
        formula={formula}
        onOpenDimensions={() => selectTab('dimensions')}
        onOpenExplanation={() => selectTab('explain')}
      />

      <nav className="inspector-tabs" aria-label="Formula Inspector modes" role="tablist">
        {inspectorTabs.map(({ icon: Icon, id, label }) => (
          <button
            aria-controls="formula-inspector-panel"
            aria-selected={activeTab === id}
            className={activeTab === id ? 'is-active' : ''}
            id={`inspector-tab-${id}`}
            key={id}
            onClick={() => selectTab(id)}
            onKeyDown={(event) => {
              const currentIndex = inspectorTabs.findIndex((tab) => tab.id === id)
              if (event.key === 'ArrowRight') {
                event.preventDefault()
                moveTabFocus(currentIndex, 1)
              }
              if (event.key === 'ArrowLeft') {
                event.preventDefault()
                moveTabFocus(currentIndex, -1)
              }
              if (event.key === 'Home' || event.key === 'End') {
                event.preventDefault()
                const targetIndex = event.key === 'Home' ? 0 : inspectorTabs.length - 1
                moveTabFocus(targetIndex, 0)
              }
            }}
            role="tab"
            tabIndex={activeTab === id ? 0 : -1}
            type="button"
          >
            <Icon aria-hidden="true" size={15} /> {label}
            {id === 'simulate' && isNewtonBenchmark && <small>Live</small>}
          </button>
        ))}
      </nav>

      <section
        aria-labelledby={`inspector-tab-${activeTab}`}
        className="formula-inspector__content"
        id="formula-inspector-panel"
        role="tabpanel"
        tabIndex={0}
      >
        {activeTab === 'simulate' &&
          (isNewtonBenchmark ? (
            <NewtonSecondLawLab
              highlightedVariable={highlightedVariable}
              onHighlightVariable={setHighlightedVariable}
              predictionChallenges={formula.predictionChallenges ?? []}
              setState={setNewtonState}
              state={newtonState}
            />
          ) : (
            <PendingInstrument formula={formula} instrument="Simulation" />
          ))}
        {activeTab === 'explain' && <ExplainPanel formula={formula} />}
        {activeTab === 'rearrange' && (
          <EquationRearranger
            key={formula.id}
            formula={formula}
            highlightedVariable={highlightedVariable}
            onHighlightVariable={setHighlightedVariable}
          />
        )}
        {activeTab === 'units' && (
          <UnitConverterPanel
            key={formula.id}
            formula={formula}
            onHighlightVariable={setHighlightedVariable}
          />
        )}
        {activeTab === 'dimensions' && (
          <DimensionCheckerPanel
            key={formula.id}
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
        {activeTab === 'practice' && <FormulaPractice key={formula.id} formula={formula} />}
        {activeTab === 'related' && <FormulaRelationshipMap formula={formula} />}
      </section>
    </div>
  )
}
