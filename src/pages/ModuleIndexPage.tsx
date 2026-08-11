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
    title: 'Run the model, not just the equation.',
    description:
      'The Newton force cart is the quality benchmark for future mechanics simulations: numerically faithful, synchronized, and designed to expose cause and effect.',
    cardLabel: 'Live simulation · benchmark 01',
    cardTitle: 'Newton force cart',
    cardDescription:
      'Change resultant force and mass, then follow acceleration through the cart, vectors, motion readouts, and relationship graphs.',
    features: ['Force and mass controls', 'Time-synchronized motion', 'Live vectors and graphs'],
    cta: 'Launch simulation',
    destination: '/formulas/newton-second-law',
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

export function ModuleIndexPage({ mode }: ModuleIndexPageProps) {
  const content = modeContent[mode]
  const formula = getFormulaById('newton-second-law')

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
          <div><dt>Modules online</dt><dd>{mode === 'practice' ? String(mechanicsFormulas.length).padStart(2, '0') : '01'}</dd></div>
          <div><dt>Physics checks</dt><dd>Verified</dd></div>
          <div><dt>{mode === 'practice' ? 'Hint policy' : 'Next instrument'}</dt><dd>{mode === 'practice' ? 'Optional' : 'Kinetic energy'}</dd></div>
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
          <article className="module-index__card">
            <header>
              <span>{content.cardLabel}</span>
              <Gauge aria-hidden="true" size={16} />
            </header>
            <div className="module-index__equation">
              <FormulaExpression expression={formula.expression} />
            </div>
            <div className="module-index__card-copy">
              <h2 id="module-index-card-title">{content.cardTitle}</h2>
              <p>{content.cardDescription}</p>
              <ul>
                {content.features.map((feature) => (
                  <li key={feature}><Check aria-hidden="true" size={13} /> {feature}</li>
                ))}
              </ul>
            </div>
            <Link to={content.destination}>
              {content.cta}
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </article>

          <aside className="module-index__standard">
            <span>Benchmark rule</span>
            <h2>One excellent vertical slice first.</h2>
            <p>
              Additional mechanics modules stay offline until their diagrams, calculations,
              controls, and graphs meet the same standard as the Newton instrument.
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
