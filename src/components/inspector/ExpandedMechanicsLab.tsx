import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react'
import type { FormulaRecord, PhysicsVariableId } from '../../types/formula'
import {
  calculateExpandedFormula,
  type ExpandedFormulaId,
  type FormulaValueState,
} from '../../utils/expandedMechanics'
import { formatMeasurement } from '../../utils/newtonSecondLaw'
import { getVariableDefinition } from '../../data/variables'
import { InstrumentControl, instrumentLinkedClass } from './InstrumentControls'

interface ExpandedMechanicsLabProps {
  formula: FormulaRecord & { id: ExpandedFormulaId }
  highlightedVariable: PhysicsVariableId | null
  onHighlightVariable: (variableId: PhysicsVariableId | null) => void
  setState: Dispatch<SetStateAction<FormulaValueState>>
  state: FormulaValueState
}

const get = (state: FormulaValueState, id: PhysicsVariableId) => state[id] ?? 0

function MotionVisual({ formulaId, progress, result, state }: { formulaId: ExpandedFormulaId; progress: number; result: number; state: FormulaValueState }) {
  const time = get(state, 'time')
  const initialVelocity = get(state, 'initial-velocity')
  const acceleration = formulaId === 'average-acceleration'
    ? result
    : get(state, 'acceleration')
  const sampleTime = time * progress
  const terminalDistance = formulaId === 'average-speed'
    ? get(state, 'distance')
    : formulaId === 'mean-velocity-displacement'
      ? result
      : formulaId === 'velocity-displacement'
        ? get(state, 'displacement')
        : result
  const samplePosition = formulaId === 'average-speed'
    ? terminalDistance * progress
    : formulaId === 'velocity-displacement'
      ? terminalDistance * progress
      : formulaId === 'mean-velocity-displacement'
        ? initialVelocity * sampleTime + 0.5 * ((get(state, 'final-velocity') - initialVelocity) / Math.max(time, 0.01)) * sampleTime ** 2
        : initialVelocity * sampleTime + 0.5 * acceleration * sampleTime ** 2
  const sampleVelocity = formulaId === 'average-speed'
    ? result
    : formulaId === 'velocity-displacement'
      ? Math.sqrt(Math.max(0, initialVelocity ** 2 + 2 * acceleration * terminalDistance * progress))
      : formulaId === 'average-acceleration'
        ? get(state, 'change-velocity') * progress
        : initialVelocity + acceleration * sampleTime
  const cartX = 300 + 205 * Math.tanh(samplePosition / Math.max(Math.abs(terminalDistance) * 0.75, 25))
  const vectorLength = Math.min(Math.abs(sampleVelocity) / 30, 1) * 90
  const direction = sampleVelocity < 0 ? -1 : 1
  return (
    <>
      <line className="workbench-track" x1="34" x2="566" y1="222" y2="222" />
      <line className="workbench-origin" x1="300" x2="300" y1="205" y2="239" />
      <text className="newton-stage__origin-label" textAnchor="middle" x="300" y="257">reference position</text>
      <path className="workbench-motion-path" d={`M 300 202 Q ${cartX} 178 ${cartX} 202`} />
      {Math.abs(sampleVelocity) > 0.01 && <g className="workbench-velocity"><line markerEnd="url(#workbench-blue-head)" x1={cartX} x2={cartX + direction * vectorLength} y1="98" y2="98" /><text x={Math.max(32, Math.min(510, cartX + direction * 10))} y="86">v = {formatMeasurement(sampleVelocity)} m/s</text></g>}
      <g className="workbench-cart" transform={`translate(${cartX - 40} 174)`}><rect height="40" rx="7" width="80" /><text textAnchor="middle" x="40" y="25">motion probe</text><circle cx="17" cy="48" r="8" /><circle cx="63" cy="48" r="8" /></g>
      <text className="workbench-readout" x="36" y="46">x = {formatMeasurement(samplePosition)} m</text>
      <text className="newton-stage__scale-label" x="34" y="288">SIGNED MOTION COMPRESSED TO FIT · NUMERICAL OUTPUT REMAINS EXACT</text>
    </>
  )
}

function ForceVisual({ formulaId, inclined, result, state }: { formulaId: ExpandedFormulaId; inclined: boolean; result: number; state: FormulaValueState }) {
  const isWeight = formulaId === 'weight'
  const slopeAngle = inclined && !isWeight ? -25 : 0
  const radians = (slopeAngle * Math.PI) / 180
  const weight = isWeight ? result : get(state, 'normal-force') / Math.cos(radians)
  const normal = isWeight ? result : get(state, 'normal-force')
  const friction = isWeight ? 0 : result
  const verticalLength = 30 + 72 * Math.tanh(normal / 180)
  const frictionLength = 25 + 85 * Math.tanh(friction / 140)
  const along = { x: Math.cos(radians), y: Math.sin(radians) }
  const outward = { x: Math.sin(radians), y: -Math.cos(radians) }
  return (
    <>
      <line className="workbench-track" x1={70} x2={530} y1={220 - along.y * 150} y2={220 + along.y * 150} />
      <g className="workbench-cart" transform={`rotate(${slopeAngle} 300 192) translate(255 165)`}><rect height="55" rx="8" width="90" /><text textAnchor="middle" x="45" y="32">test block</text></g>
      <g className="workbench-force workbench-force--down"><line markerEnd="url(#workbench-warm-head)" x1="300" x2="300" y1="190" y2={190 + verticalLength} /><text x="312" y={215 + verticalLength * 0.45}>W {formatMeasurement(weight)} N</text></g>
      <g className="workbench-force workbench-force--up"><line markerEnd="url(#workbench-blue-head)" x1="300" x2={300 + outward.x * verticalLength} y1="165" y2={165 + outward.y * verticalLength} /><text x={310 + outward.x * verticalLength} y={155 + outward.y * verticalLength}>N {formatMeasurement(normal)} N</text></g>
      {!isWeight && <><g className="workbench-force workbench-force--left"><line markerEnd="url(#workbench-warm-head)" x1="258" x2={258 - along.x * frictionLength} y1="190" y2={190 - along.y * frictionLength} /><text textAnchor="end" x={250 - along.x * frictionLength} y={180 - along.y * frictionLength}>friction</text></g><g className="workbench-force workbench-force--right"><line markerEnd="url(#workbench-blue-head)" x1="342" x2={342 + along.x * frictionLength} y1="190" y2={190 + along.y * frictionLength} /><text x={350 + along.x * frictionLength} y={180 + along.y * frictionLength}>tension / applied</text></g></>}
      <text className="workbench-readout" x="36" y="46">{isWeight ? 'SUPPORTED BODY · VERTICAL EQUILIBRIUM' : `LIMITING FRICTION · ${inclined ? '25° INCLINE' : 'LEVEL SURFACE'} FBD`}</text>
      <text className="newton-stage__scale-label" x="34" y="288">ARROWS SHOW DIRECTION AND RELATIVE MAGNITUDE · NORMAL IS PERPENDICULAR TO CONTACT</text>
    </>
  )
}

function EnergyVisual({ formulaId, result, state }: { formulaId: ExpandedFormulaId; result: number; state: FormulaValueState }) {
  if (formulaId === 'mechanical-energy-conservation') {
    const finalEnergy = get(state, 'final-mechanical-energy')
    const dissipated = get(state, 'energy-dissipated')
    const total = Math.max(result, 1)
    return <><text className="workbench-readout" x="36" y="46">CLOSED ENERGY ACCOUNT</text><g className="energy-account"><rect height="150" rx="8" width="72" x="92" y="90" /><rect height={150 * (finalEnergy / total)} width="72" x="300" y={240 - 150 * (finalEnergy / total)} /><rect className="is-dissipated" height={150 * (dissipated / total)} width="72" x="430" y={240 - 150 * (dissipated / total)} /><path d="M 170 165 H 280" /><path d="M 378 165 H 415" /><text textAnchor="middle" x="128" y="263">initial · {formatMeasurement(result)} J</text><text textAnchor="middle" x="336" y="263">mechanical · {formatMeasurement(finalEnergy)} J</text><text textAnchor="middle" x="466" y="263">other stores · {formatMeasurement(dissipated)} J</text></g></>
  }
  if (formulaId === 'power') {
    const power = result
    const gauge = 170 * Math.tanh(Math.abs(power) / 500)
    return <><text className="workbench-readout" x="36" y="46">ENERGY TRANSFER RATE</text><line className="power-rail" x1="95" x2="505" y1="190" y2="190" /><rect className="power-pulse" height="70" rx="9" width={Math.max(gauge, 3)} x="95" y="155" /><circle className="power-load" cx="505" cy="190" r="42" /><text textAnchor="middle" x="505" y="195">load</text><text x="95" y="132">{formatMeasurement(get(state, 'work'))} J transferred in {formatMeasurement(get(state, 'time'))} s</text><text className="newton-stage__scale-label" x="34" y="288">LONGER RATE BAR = GREATER ENERGY TRANSFER PER SECOND</text></>
  }
  const angle = get(state, 'force-angle')
  const forceLength = 40 + 90 * Math.tanh(get(state, 'applied-force') / 140)
  const endX = 245 + Math.cos(angle) * forceLength
  const endY = 178 - Math.sin(angle) * forceLength
  const displacementX = 260 + 230 * Math.tanh(get(state, 'displacement') / 24)
  return <><line className="workbench-track" x1="70" x2="540" y1="220" y2="220" /><g className="workbench-cart" transform="translate(205 170)"><rect height="50" rx="8" width="80" /><text textAnchor="middle" x="40" y="30">load</text></g><g className="workbench-force workbench-force--up"><line markerEnd="url(#workbench-blue-head)" x1="245" x2={endX} y1="178" y2={endY} /><line className="workbench-component" x1="245" x2={endX} y1="178" y2="178" /><text x={endX + 8} y={endY - 6}>F</text></g><line className="workbench-displacement" markerEnd="url(#workbench-warm-head)" x1="260" x2={displacementX} y1="250" y2="250" /><text textAnchor="middle" x={(260 + displacementX) / 2} y="270">s</text><text className="workbench-readout" x="36" y="46">WORK TRANSFER · θ = {formatMeasurement(angle, 2)} rad</text><text className="newton-stage__scale-label" x="34" y="288">DASHED COMPONENT ALONG DISPLACEMENT DOES THE WORK</text></>
}

function ImpulseVisual({ progress, result, state }: { progress: number; result: number; state: FormulaValueState }) {
  const force = get(state, 'resultant-force')
  const direction = force < 0 ? -1 : 1
  const forceLength = 30 + 90 * Math.tanh(Math.abs(force) / 180)
  const cartX = 300 + direction * progress * 150 * Math.tanh(Math.abs(result) / 100)
  return <><line className="workbench-track" x1="45" x2="555" y1="220" y2="220" /><g className="workbench-cart" transform={`translate(${cartX - 45} 170)`}><rect height="50" rx="8" width="90" /><text textAnchor="middle" x="45" y="30">impulse cart</text><circle cx="18" cy="58" r="8" /><circle cx="72" cy="58" r="8" /></g><g className="workbench-force workbench-force--right"><line markerEnd="url(#workbench-blue-head)" x1={cartX} x2={cartX + direction * forceLength} y1="110" y2="110" /><text x={Math.max(32, Math.min(510, cartX + direction * 12))} y="98">F = {formatMeasurement(force)} N</text></g><rect className="impulse-area" height={65 * progress} width="150" x="60" y={72 + 65 * (1 - progress)} /><line className="impulse-axis" x1="60" x2="220" y1="137" y2="137" /><text x="60" y="60">force–time area = {formatMeasurement(result * progress)} N·s</text><text className="newton-stage__scale-label" x="34" y="288">IMPULSE BUILDS AS FORCE ACTS · CART MOTION IS A 5 KG REFERENCE VISUAL</text></>
}

export function ExpandedMechanicsLab({ formula, highlightedVariable, onHighlightVariable, setState, state }: ExpandedMechanicsLabProps) {
  const [progress, setProgress] = useState(1)
  const [playing, setPlaying] = useState(false)
  const [inclined, setInclined] = useState(false)
  const result = calculateExpandedFormula(formula.id, state)
  const outputReference = formula.variables.find(({ role }) => role === 'output')
  const outputVariable = outputReference ? getVariableDefinition(outputReference.id) : null
  const controls = formula.variables.filter((reference) => reference.control)
  const resultLinked = outputReference ? instrumentLinkedClass(highlightedVariable, outputReference.id) : ''
  const isTimed = formula.simulationType === 'motion-analyzer' || formula.simulationType === 'impulse-cart'

  useEffect(() => {
    if (!playing) return
    let frame = 0
    let previous: number | null = null
    const update = (timestamp: number) => {
      if (previous === null) previous = timestamp
      const elapsed = Math.min((timestamp - previous) / 1000, 0.05)
      previous = timestamp
      setProgress((current) => {
        return Math.min(current + elapsed / 4, 1)
      })
      frame = requestAnimationFrame(update)
    }
    frame = requestAnimationFrame(update)
    return () => cancelAnimationFrame(frame)
  }, [playing])

  useEffect(() => {
    if (progress >= 1) setPlaying(false)
  }, [progress])

  const change = (id: PhysicsVariableId, nextValue: number) => {
    setPlaying(false)
    setProgress(1)
    setState((current) => ({ ...current, [id]: nextValue }))
  }

  const visual = useMemo(() => {
    if (!Number.isFinite(result)) return <text className="workbench-invalid" textAnchor="middle" x="300" y="160">No real solution for this signed state. Reduce braking distance or acceleration.</text>
    if (formula.simulationType === 'motion-analyzer') return <MotionVisual formulaId={formula.id} progress={progress} result={result} state={state} />
    if (formula.simulationType === 'force-system') return <ForceVisual formulaId={formula.id} inclined={inclined} result={result} state={state} />
    if (formula.simulationType === 'energy-transfer') return <EnergyVisual formulaId={formula.id} result={result} state={state} />
    return <ImpulseVisual progress={progress} result={result} state={state} />
  }, [formula.id, formula.simulationType, inclined, progress, result, state])

  return (
    <div className="newton-lab expanded-lab">
      <section className="newton-stage" aria-label={`${formula.name} interactive model`}>
        <header className="newton-stage__header"><div><span>{formula.subtopic} systems workbench</span><strong>{formula.name} · live SI model</strong></div><div className="newton-stage__clock"><span>Model state</span><output>{Number.isFinite(result) ? 'Valid' : 'Check signs'}</output></div></header>
        <svg className="newton-stage__canvas expanded-stage" role="img" viewBox="0 0 600 310"><title>{formula.name} physical representation</title><desc>{formula.description} The drawing and vectors respond to the current numerical inputs.</desc><defs><marker id="workbench-blue-head" markerHeight="7" markerWidth="8" orient="auto" refX="7" refY="3.5"><polygon points="0 0, 8 3.5, 0 7" /></marker><marker id="workbench-warm-head" markerHeight="7" markerWidth="8" orient="auto" refX="7" refY="3.5"><polygon points="0 0, 8 3.5, 0 7" /></marker></defs><g className="newton-stage__grid" aria-hidden="true">{Array.from({ length: 13 }, (_, index) => <line key={index} x1={index * 50} x2={index * 50} y1="20" y2="285" />)}</g>{visual}</svg>
        <div className="newton-stage__readouts"><div className={resultLinked}><span>{outputVariable?.name ?? 'Calculated result'}</span><strong>{Number.isFinite(result) ? formatMeasurement(result) : 'No real value'} <small>{outputVariable?.siUnit.symbol}</small></strong></div><div className={formula.id === 'impulse' ? instrumentLinkedClass(highlightedVariable, 'momentum') : ''}><span>{formula.id === 'impulse' ? 'Momentum change' : 'Workbench'}</span><strong>{formula.id === 'impulse' ? `${formatMeasurement(result)} kg·m/s` : `${formula.subtopic} · idealized system`}</strong></div><div><span>Relationship form</span><strong>{formula.expression.plainText}</strong></div></div>
        {isTimed && <div className="workbench-transport"><button onClick={() => { if (progress >= 1) setProgress(0); setPlaying((current) => !current) }} type="button">{playing ? 'Pause' : 'Play demonstration'}</button><button onClick={() => { setPlaying(false); setProgress(0) }} type="button">Reset</button><label><span className="sr-only">Demonstration progress</span><input aria-label="Demonstration progress" max="1" min="0" onChange={(event) => { setPlaying(false); setProgress(Number(event.target.value)) }} step="0.01" type="range" value={progress} /></label><output>{formatMeasurement(progress * 100, 0)}%</output></div>}
      </section>
      <aside className="newton-console" aria-label={`${formula.name} controls`}><header><span>Input console</span><strong>Registry-driven</strong></header>{formula.id === 'constant-acceleration-displacement' && <div className="workbench-presets" role="group" aria-label="Free-fall presets"><button onClick={() => { change('initial-velocity', 0); setState((current) => ({ ...current, acceleration: -9.81 })) }} type="button">Earth free fall</button><button onClick={() => { change('initial-velocity', 0); setState((current) => ({ ...current, acceleration: -1.62 })) }} type="button">Moon free fall</button></div>}{formula.id === 'friction-force' && <div className="workbench-presets" role="group" aria-label="Contact orientation"><button aria-pressed={!inclined} className={!inclined ? 'is-active' : ''} onClick={() => setInclined(false)} type="button">Level surface</button><button aria-pressed={inclined} className={inclined ? 'is-active' : ''} onClick={() => setInclined(true)} type="button">25° incline</button></div>}{controls.map((reference) => { const control = reference.control!; const definition = getVariableDefinition(reference.id); return <InstrumentControl highlightedVariable={highlightedVariable} key={reference.id} label={definition.name} max={control.max} min={control.min} onChange={(nextValue) => change(reference.id, nextValue)} onHighlightVariable={onHighlightVariable} step={control.step} symbol={definition.symbol} unit={definition.siUnit.symbol} value={get(state, reference.id)} variableId={reference.id} /> })}<div className={`newton-result${resultLinked}`}><span>Calculated output</span><output><var>{outputVariable?.symbol}</var> = {Number.isFinite(result) ? formatMeasurement(result) : 'not real'} <small>{outputVariable?.siUnit.symbol}</small></output><code>{formula.expression.plainText}</code></div><p className="newton-console__note">{formula.assumptions.join('. ')}. {formula.commonMistakes[0]}.</p></aside>
    </div>
  )
}
