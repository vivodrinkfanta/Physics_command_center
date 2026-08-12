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
import { useMemo, useState, type Dispatch, type SetStateAction } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import { CircularMotionGraphs } from '../components/inspector/CircularMotionGraphs'
import { CircularMotionLab } from '../components/inspector/CircularMotionLab'
import { EquationRearranger } from '../components/inspector/EquationRearranger'
import { ExpandedMechanicsGraphs } from '../components/inspector/ExpandedMechanicsGraphs'
import { ExpandedMechanicsLab } from '../components/inspector/ExpandedMechanicsLab'
import { DimensionCheckerPanel } from '../components/inspector/DimensionCheckerPanel'
import { FormulaPractice } from '../components/inspector/FormulaPractice'
import { FormulaIntegrityBar } from '../components/inspector/FormulaIntegrityBar'
import { FormulaRelationshipMap } from '../components/inspector/FormulaRelationshipMap'
import { KineticEnergyGraphs } from '../components/inspector/KineticEnergyGraphs'
import { KineticEnergyLab } from '../components/inspector/KineticEnergyLab'
import { KinematicsGraphs } from '../components/inspector/KinematicsGraphs'
import { KinematicsLab } from '../components/inspector/KinematicsLab'
import { MomentumGraphs } from '../components/inspector/MomentumGraphs'
import { MomentumLab } from '../components/inspector/MomentumLab'
import { NewtonGraphs } from '../components/inspector/NewtonGraphs'
import { NewtonSecondLawLab } from '../components/inspector/NewtonSecondLawLab'
import { PotentialEnergyGraphs } from '../components/inspector/PotentialEnergyGraphs'
import { PotentialEnergyLab } from '../components/inspector/PotentialEnergyLab'
import { ProjectileGraphs } from '../components/inspector/ProjectileGraphs'
import { ProjectileLab } from '../components/inspector/ProjectileLab'
import { SpringMotionGraphs } from '../components/inspector/SpringMotionGraphs'
import { SpringMotionLab } from '../components/inspector/SpringMotionLab'
import { UnitConverterPanel } from '../components/inspector/UnitConverterPanel'
import { FittedFormulaExpression } from '../components/math/FittedFormulaExpression'
import { findFormulaById, mechanicsFormulas } from '../data/formulas'
import { getVariableDefinition } from '../data/variables'
import type { FormulaRecord, PhysicsVariableId } from '../types/formula'
import type { CircularMotionState } from '../utils/circularMotion'
import {
  createFormulaInputStates,
  isExpandedFormulaId,
  type ExpandedFormulaId,
  type FormulaInputStates,
  type FormulaValueState,
} from '../utils/expandedMechanics'
import type { KinematicsState } from '../utils/kinematics'
import type { KineticEnergyState } from '../utils/kineticEnergy'
import type { MomentumState } from '../utils/momentum'
import type { NewtonState } from '../utils/newtonSecondLaw'
import type { PotentialEnergyState } from '../utils/potentialEnergy'
import type { ProjectileLabState } from '../utils/projectile'
import type { SpringMotionState } from '../utils/springMotion'

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
  const [kineticState, setKineticState] = useState<KineticEnergyState>({
    mass: 4,
    speed: 8,
    time: 0,
  })
  const [kinematicsState, setKinematicsState] = useState<KinematicsState>({
    acceleration: 2,
    initialVelocity: 3,
    time: 0,
  })
  const [projectileState, setProjectileState] = useState<ProjectileLabState>({
    angleDegrees: 45,
    gravity: 9.81,
    launchHeight: 2,
    speed: 22,
    time: 0,
  })
  const [momentumState, setMomentumState] = useState<MomentumState>({
    mass: 4,
    restitution: 1,
    secondMass: 6,
    secondVelocity: -2,
    time: 0,
    velocity: 7,
  })
  const [potentialState, setPotentialState] = useState<PotentialEnergyState>({
    gravity: 9.81,
    height: 5,
    mass: 3,
  })
  const [circularState, setCircularState] = useState<CircularMotionState>({
    mass: 2,
    radius: 4,
    speed: 8,
    time: 0,
  })
  const [springState, setSpringState] = useState<SpringMotionState>({
    displacement: 0.25,
    mass: 2,
    springConstant: 40,
    time: 0,
  })
  const [expandedStates, setExpandedStates] = useState<FormulaInputStates>(() =>
    createFormulaInputStates(mechanicsFormulas),
  )
  const variableDefinitions = useMemo(
    () => formula?.variables.map(({ id }) => getVariableDefinition(id)) ?? [],
    [formula],
  )

  if (!formula) return <Navigate replace to="/formulas" />

  const isNewtonBenchmark = formula.id === 'newton-second-law'
  const isKineticBenchmark = formula.id === 'kinetic-energy'
  const isKinematicsBenchmark = formula.id === 'constant-acceleration-velocity'
  const isProjectileBenchmark = formula.id === 'projectile-vertical-position'
  const isMomentumBenchmark = formula.id === 'linear-momentum'
  const isPotentialBenchmark = formula.id === 'gravitational-potential-energy'
  const isCircularBenchmark =
    formula.id === 'centripetal-acceleration' || formula.id === 'centripetal-force'
  const isSpringBenchmark =
    formula.id === 'hookes-law' || formula.id === 'elastic-potential-energy'
  const isExpandedBenchmark = isExpandedFormulaId(formula.id)
  const expandedFormula = formula as FormulaRecord & { id: ExpandedFormulaId }
  const expandedState = expandedStates[formula.id] ?? {}
  const setExpandedState: Dispatch<SetStateAction<FormulaValueState>> = (update) =>
    setExpandedStates((current) => {
      const previous = current[formula.id] ?? {}
      const next = typeof update === 'function' ? update(previous) : update
      return { ...current, [formula.id]: next }
    })
  const hasLiveSimulation =
    isNewtonBenchmark ||
    isKineticBenchmark ||
    isKinematicsBenchmark ||
    isProjectileBenchmark ||
    isMomentumBenchmark ||
    isPotentialBenchmark ||
    isCircularBenchmark ||
    isSpringBenchmark ||
    isExpandedBenchmark
  const selectTab = (tab: InspectorTabId) => {
    const next = new URLSearchParams(searchParams)
    if (tab === 'simulate') next.delete('tab')
    else next.set('tab', tab)
    setSearchParams(next, { replace: true })
  }
  const tabHref = (tab: InspectorTabId) => {
    const next = new URLSearchParams(searchParams)
    if (tab === 'simulate') next.delete('tab')
    else next.set('tab', tab)
    const query = next.toString()
    return `/formulas/${formula.id}${query ? `?${query}` : ''}`
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
              <FittedFormulaExpression
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
          <Link
            aria-controls="formula-inspector-panel"
            aria-selected={activeTab === id}
            className={activeTab === id ? 'is-active' : ''}
            id={`inspector-tab-${id}`}
            key={id}
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
            to={tabHref(id)}
          >
            <Icon aria-hidden="true" size={15} /> {label}
            {id === 'simulate' && hasLiveSimulation && <small>Live</small>}
          </Link>
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
          ) : isKineticBenchmark ? (
            <KineticEnergyLab
              highlightedVariable={highlightedVariable}
              onHighlightVariable={setHighlightedVariable}
              setState={setKineticState}
              state={kineticState}
            />
          ) : isKinematicsBenchmark ? (
            <KinematicsLab
              highlightedVariable={highlightedVariable}
              onHighlightVariable={setHighlightedVariable}
              setState={setKinematicsState}
              state={kinematicsState}
            />
          ) : isProjectileBenchmark ? (
            <ProjectileLab
              highlightedVariable={highlightedVariable}
              onHighlightVariable={setHighlightedVariable}
              setState={setProjectileState}
              state={projectileState}
            />
          ) : isMomentumBenchmark ? (
            <MomentumLab
              highlightedVariable={highlightedVariable}
              onHighlightVariable={setHighlightedVariable}
              setState={setMomentumState}
              state={momentumState}
            />
          ) : isPotentialBenchmark ? (
            <PotentialEnergyLab
              highlightedVariable={highlightedVariable}
              onHighlightVariable={setHighlightedVariable}
              setState={setPotentialState}
              state={potentialState}
            />
          ) : isCircularBenchmark ? (
            <CircularMotionLab
              highlightedVariable={highlightedVariable}
              onHighlightVariable={setHighlightedVariable}
              setState={setCircularState}
              state={circularState}
              outputVariableId={formula.id === 'centripetal-force' ? 'centripetal-force' : 'centripetal-acceleration'}
            />
          ) : isSpringBenchmark ? (
            <SpringMotionLab
              highlightedVariable={highlightedVariable}
              onHighlightVariable={setHighlightedVariable}
              setState={setSpringState}
              state={springState}
              outputVariableId={formula.id === 'elastic-potential-energy' ? 'elastic-potential-energy' : 'spring-force'}
            />
          ) : isExpandedBenchmark ? (
            <ExpandedMechanicsLab
              formula={expandedFormula}
              highlightedVariable={highlightedVariable}
              onHighlightVariable={setHighlightedVariable}
              setState={setExpandedState}
              state={expandedState}
            />
          ) : (
            null
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
          ) : isKineticBenchmark ? (
            <KineticEnergyGraphs highlightedVariable={highlightedVariable} state={kineticState} />
          ) : isKinematicsBenchmark ? (
            <KinematicsGraphs highlightedVariable={highlightedVariable} state={kinematicsState} />
          ) : isProjectileBenchmark ? (
            <ProjectileGraphs highlightedVariable={highlightedVariable} state={projectileState} />
          ) : isMomentumBenchmark ? (
            <MomentumGraphs highlightedVariable={highlightedVariable} state={momentumState} />
          ) : isPotentialBenchmark ? (
            <PotentialEnergyGraphs highlightedVariable={highlightedVariable} state={potentialState} />
          ) : isCircularBenchmark ? (
            <CircularMotionGraphs highlightedVariable={highlightedVariable} outputVariableId={formula.id === 'centripetal-force' ? 'centripetal-force' : 'centripetal-acceleration'} state={circularState} />
          ) : isSpringBenchmark ? (
            <SpringMotionGraphs highlightedVariable={highlightedVariable} outputVariableId={formula.id === 'elastic-potential-energy' ? 'elastic-potential-energy' : 'spring-force'} state={springState} />
          ) : isExpandedBenchmark ? (
            <ExpandedMechanicsGraphs
              formula={expandedFormula}
              highlightedVariable={highlightedVariable}
              state={expandedState}
            />
          ) : (
            null
          ))}
        {activeTab === 'example' && <ExamplePanel formula={formula} />}
        {activeTab === 'practice' && <FormulaPractice key={formula.id} formula={formula} />}
        {activeTab === 'related' && <FormulaRelationshipMap formula={formula} />}
      </section>
    </div>
  )
}
