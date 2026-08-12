import { getVariableDefinition } from '../../data/variables'
import type { FormulaRecord, PhysicsVariableId } from '../../types/formula'
import {
  calculateExpandedFormula,
  expandedGraphPoints,
  type ExpandedFormulaId,
  type FormulaValueState,
} from '../../utils/expandedMechanics'
import { RelationshipGraph } from './RelationshipGraph'

interface ExpandedMechanicsGraphsProps {
  formula: FormulaRecord & { id: ExpandedFormulaId }
  highlightedVariable: PhysicsVariableId | null
  state: FormulaValueState
}

function domain(values: number[]): [number, number] {
  const minimum = Math.min(0, ...values)
  const maximum = Math.max(0, ...values)
  const padding = Math.max((maximum - minimum) * 0.07, 1)
  return [minimum - padding, maximum + padding]
}

export function ExpandedMechanicsGraphs({ formula, highlightedVariable, state }: ExpandedMechanicsGraphsProps) {
  const result = calculateExpandedFormula(formula.id, state)
  const outputReference = formula.variables.find(({ role }) => role === 'output')!
  const outputVariable = getVariableDefinition(outputReference.id)
  const controls = formula.variables.filter((reference) => reference.control).slice(0, 3)
  if (!Number.isFinite(result)) {
    return <section className="learning-panel"><span>Signed-state check</span><h2>No real graph marker exists for the current values.</h2><p>The selected braking acceleration and displacement would require a negative value of v². Return to Simulate and choose a reachable state.</p></section>
  }
  return (
    <div className={`newton-graphs${controls.length === 3 ? ' instrument-graphs--three' : ''}`}>
      {controls.map((reference) => {
        const control = reference.control!
        const inputVariable = getVariableDefinition(reference.id)
        const points = expandedGraphPoints(formula.id, state, reference.id, control.min, control.max)
        return <RelationshipGraph activeX={highlightedVariable === reference.id} activeY={highlightedVariable === outputReference.id} description={`${outputVariable.name} responds to ${inputVariable.name} while every other input remains fixed at the current inspector value.`} key={reference.id} marker={{ x: state[reference.id] ?? control.defaultValue, y: result }} points={points} title={`${outputVariable.name} vs ${inputVariable.name}`} xDomain={[control.min, control.max]} xLabel={`${inputVariable.name}, ${inputVariable.symbol} (${inputVariable.siUnit.symbol})`} yDomain={domain(points.map(({ y }) => y))} yLabel={`${outputVariable.name}, ${outputVariable.symbol} (${outputVariable.siUnit.symbol})`} />
      })}
    </div>
  )
}
