import { FormEvent, useMemo, useRef, useState } from 'react'
import { ArrowRight, Atom, BookOpenCheck, Gauge, MoveUpRight, Orbit, RefreshCcw, Search, Zap } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { ProjectilePreview } from '../components/home/ProjectilePreview'
import { FormulaExpression } from '../components/math/FormulaExpression'
import { getFormulaById, searchFormulas } from '../data/formulas'
import { findCurriculumTopic } from '../data/ibPhysicsCurriculum'
import { activeCurriculumTopics } from '../utils/curriculum'
import { loadStudentProgress } from '../utils/studentProgress'
import '../styles/home.css'

const topicIcons = { 'A.1': Gauge, 'A.2': MoveUpRight, 'A.3': Zap, 'C.1': RefreshCcw, 'D.1': Orbit } as const

export function HomePage() {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const lastTopic = findCurriculumTopic(loadStudentProgress().lastVisitedModule ?? undefined)
  const results = useMemo(() => query.trim() ? searchFormulas(query.trim().toLowerCase()).slice(0, 4) : [], [query])

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedQuery = query.trim()
    if (!trimmedQuery) return inputRef.current?.focus()
    navigate(`/formulas?q=${encodeURIComponent(trimmedQuery)}`)
  }

  return (
    <div className="home-view">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero__copy">
          <p className="home-kicker"><Atom aria-hidden="true" size={14} /> IB-aligned interactive mechanics</p>
          <h1 id="home-title">Explore physical<br /><span>relationships.</span></h1>
          <p className="home-hero__intro">Move beyond memorising equations. Choose an IB syllabus module, change the variables, observe the system, and see the mathematics respond.</p>
          <form className="physics-search" onSubmit={submitSearch} role="search">
            <Search aria-hidden="true" className="physics-search__icon" size={20} strokeWidth={1.7} />
            <label className="sr-only" htmlFor="physics-search-input">Search equations, concepts, or variables</label>
            <input autoComplete="off" id="physics-search-input" onChange={(event) => setQuery(event.target.value)} placeholder="Search equations, concepts or variables…" ref={inputRef} type="search" value={query} />
            <kbd>Enter</kbd>
            {query.trim() && <div className="search-results" aria-label="Search suggestions">{results.length ? results.map((result) => <button key={result.name} onClick={() => navigate(`/formulas?q=${encodeURIComponent(result.name)}`)} type="button"><FormulaExpression className="search-results__formula" expression={result.expression} /><span className="search-results__copy"><strong>{result.name}</strong><small>{result.description}</small></span><span className="search-results__topic">{result.subtopic}</span><ArrowRight aria-hidden="true" size={15} /></button>) : <p>No matching mechanics concepts yet.</p>}</div>}
          </form>
          <div className="search-examples" aria-label="Example searches"><span>Try</span>{['force', 'kinetic energy', 'v = u + at'].map((example) => <button key={example} onClick={() => setQuery(example)} type="button">{example}</button>)}</div>
          <Link className="home-study-cta" to={lastTopic && lastTopic.coverage !== 'planned' ? `/curriculum/${lastTopic.slug}` : '/curriculum'}><BookOpenCheck aria-hidden="true" size={17} /><span><strong>{lastTopic && lastTopic.coverage !== 'planned' ? `Continue ${lastTopic.code} ${lastTopic.title}` : 'Open the IB Study Map'}</strong><small>{lastTopic && lastTopic.coverage !== 'planned' ? 'Resume from your last visited syllabus module.' : 'Choose SL, HL, or All and start with an official module code.'}</small></span><ArrowRight aria-hidden="true" size={16} /></Link>
        </div>
        <ProjectilePreview />
      </section>

      <section className="learning-loop" aria-labelledby="learning-loop-heading">
        <header className="learning-loop__intro"><p>Recommended first run</p><h2 id="learning-loop-heading">Complete the learning loop.</h2><span>Move from the syllabus map to a module, a live model, and functional practice.</span></header>
        <div className="learning-loop__steps">
          <Link to="/curriculum"><span>01</span><strong>Choose</strong><small>Select your level and official syllabus module.</small><ArrowRight aria-hidden="true" size={15} /></Link>
          <Link to="/curriculum/a-2"><span>02</span><strong>Study</strong><small>Follow A.2 concepts, formulae, examples, and prerequisites.</small><ArrowRight aria-hidden="true" size={15} /></Link>
          <Link to="/formulas/newton-second-law"><span>03</span><strong>Simulate</strong><small>Predict, then manipulate force, mass, and time.</small><ArrowRight aria-hidden="true" size={15} /></Link>
          <Link to="/practice?topic=A.2"><span>04</span><strong>Solve</strong><small>Answer original assessment-style questions and retain progress.</small><ArrowRight aria-hidden="true" size={15} /></Link>
        </div>
      </section>

      <section className="topic-section" aria-labelledby="topic-heading">
        <header className="section-heading"><div><p>Organized by syllabus</p><h2 id="topic-heading">Current IB module pathways</h2></div><Link to="/curriculum">Open full Study Map <ArrowRight aria-hidden="true" size={16} /></Link></header>
        <div className="topic-grid">
          {activeCurriculumTopics.map((topic) => {
            const Icon = topicIcons[topic.code as keyof typeof topicIcons] ?? BookOpenCheck
            const formula = topic.formulaIds[0] ? getFormulaById(topic.formulaIds[0]) : undefined
            return <Link className="topic-card" key={topic.code} to={`/curriculum/${topic.slug}`}><div className="topic-card__topline"><span className="topic-card__icon"><Icon aria-hidden="true" size={19} strokeWidth={1.6} /></span><span className="home-topic-code">{topic.code}</span></div><div><h3>{topic.title}</h3><p>{topic.summary}</p></div>{formula && <FormulaExpression className="topic-card__formula" expression={formula.expression} />}</Link>
          })}
        </div>
      </section>
    </div>
  )
}
