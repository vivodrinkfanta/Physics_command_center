import { ArrowRight, Check, FlaskConical, Gauge, Orbit } from 'lucide-react'
import { Link } from 'react-router-dom'
import { FormulaExpression } from '../components/math/FormulaExpression'
import { getFormulaById, mechanicsFormulas } from '../data/formulas'

interface ModuleIndexPageProps {
  mode: 'practice' | 'simulations'
}

const modeContent = {
  simulations: {
    eyebrow: 'Calibrated instrument index',
    title: 'Choose a model. Change one cause at a time.',
    description:
      'Two complete mechanics instruments now share the same standard: faithful calculations, synchronized motion, variable linking, and live relationship graphs.',
  },
  practice: {
    eyebrow: 'Focused mechanics practice',
    title: 'Solve with the model nearby.',
    description:
      'Practice stays attached to the same validated formula data used by the inspector, keeping questions, units, hints, and worked reasoning consistent.',
    cardLabel: 'Live practice · foundation',
    cardTitle: 'Newton’s Second Law practice',
    cardDescription:
      'Calculate acceleration from resultant force and mass, check signed answers, and reveal hints one stage at a time.',
    features: ['Generated numerical prompts', 'Signed-force feedback', 'Three-stage hints'],
    cta: 'Start practice',
    destination: '/formulas/newton-second-law?tab=practice',
  },
} as const

const simulationModules = [
  {
    formulaId: 'newton-second-law',
    label: 'Forces · benchmark 01',
    title: 'Newton force cart',
    description:
      'Change resultant force and mass, then follow acceleration through the cart, vectors, motion readouts, and graphs.',
    features: [
      'Signed force and mass controls',
      'Accelerated motion timeline',
      'Direct and inverse graphs',
    ],
  },
  {
    formulaId: 'kinetic-energy',
    label: 'Energy · benchmark 02',
    title: 'Kinetic energy runway',
    description:
      'Change mass and speed, then compare uniform motion with the energy stored in the moving system.',
    features: [
      'Mass and speed controls',
      'Time-synchronized runway',
      'Linear and quadratic graphs',
    ],
  },
] as const

export function ModuleIndexPage({ mode }: ModuleIndexPageProps) {
  const content = modeContent[mode]

  return (
    <div className="module-index">
      <header className="module-index__hero">
        <div>
          <p className="eyebrow">
            {mode === 'simulations' ? <Orbit aria-hidden="true" size={14} /> : <FlaskConical aria-hidden="true" size={14} />}
            {content.eyebrow}
          </p>
          <h1>{content.title}</h1>
          <p>{content.description}</p>
        </div>
        <dl aria-label={`${mode} readiness`}>
          <div><dt>Modules online</dt><dd>{mode === 'practice' ? String(mechanicsFormulas.length).padStart(2, '0') : '02'}</dd></div>
          <div><dt>Physics checks</dt><dd>Verified</dd></div>
          <div><dt>{mode === 'practice' ? 'Hint policy' : 'Next instrument'}</dt><dd>{mode === 'practice' ? 'Optional' : 'Kinematics'}</dd></div>
        </dl>
      </header>

      {mode === 'practice' ? (
        <section className="practice-catalog" aria-labelledby="practice-catalog-title">
          <header>
            <div>
              <span>Registry-generated problem sets</span>
              <h2 id="practice-catalog-title">Choose a relationship to recall.</h2>
            </div>
            <small>Equations hidden until Hint 02</small>
          </header>
          <div className="practice-catalog__grid">
            {mechanicsFormulas.map((practiceFormula, index) => (
              <Link key={practiceFormula.id} to={`/formulas/${practiceFormula.id}?tab=practice`}>
                <span>{String(index + 1).padStart(2, '0')} · {practiceFormula.subtopic}</span>
                <FormulaExpression expression={practiceFormula.expression} />
                <strong>{practiceFormula.name}</strong>
                <small>Difficulty {practiceFormula.difficulty}/5 · staged solution</small>
                <ArrowRight aria-hidden="true" size={15} />
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <section className="module-index__workspace" aria-labelledby="module-index-card-title">
          <div className="module-index__catalog">
            {simulationModules.map((module, index) => {
              const simulationFormula = getFormulaById(module.formulaId)
              return (
                <article className="module-index__card" key={module.formulaId}>
                  <header>
                    <span>{module.label}</span>
                    <Gauge aria-hidden="true" size={16} />
                  </header>
                  <div className="module-index__equation">
                    <FormulaExpression expression={simulationFormula.expression} />
                  </div>
                  <div className="module-index__card-copy">
                    <h2 id={index === 0 ? 'module-index-card-title' : undefined}>{module.title}</h2>
                    <p>{module.description}</p>
                    <ul>
                      {module.features.map((feature) => (
                        <li key={feature}><Check aria-hidden="true" size={13} /> {feature}</li>
                      ))}
                    </ul>
                  </div>
                  <Link to={`/formulas/${module.formulaId}`}>
                    Launch simulation
                    <ArrowRight aria-hidden="true" size={16} />
                  </Link>
                </article>
              )
            })}
          </div>

          <aside className="module-index__standard">
            <span>Benchmark rule</span>
            <h2>Complete instruments, released one at a time.</h2>
            <p>
              Additional mechanics modules stay offline until their diagrams, calculations,
              controls, and graphs meet the same standard as these two instruments.
            </p>
            <div>
              <span>Current scope</span>
              <strong>Mechanics · V1</strong>
            </div>
          </aside>
        </section>
      )}
    </div>
  )
}
