import { ArrowLeft, ArrowRight, BookOpen, Boxes, CheckCircle2, FlaskConical, Route } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { FormulaExpression } from '../components/math/FormulaExpression'
import { CurriculumInquiryPanel } from '../components/curriculum/CurriculumInquiryPanel'
import { findCurriculumTopic } from '../data/ibPhysicsCurriculum'
import { ibPracticeQuestions } from '../data/ibPracticeQuestions'
import { getCurriculumRelationships } from '../data/curriculumRelationships'
import { isCurriculumTopicReleased } from '../data/ibPhysicsRelease'
import { getFormulaById } from '../data/formulas'
import { formatAvailability, getAdjacentActiveTopics, getThemeForTopic } from '../utils/curriculum'
import { loadStudentProgress, recordModuleVisit, saveStudentProgress } from '../utils/studentProgress'

export function CurriculumTopicPage() {
  const { topicCode } = useParams()
  const topic = findCurriculumTopic(topicCode)
  const [progress, setProgress] = useState(loadStudentProgress)

  useEffect(() => {
    if (!topic || !isCurriculumTopicReleased(topic.code)) return
    setProgress((current) => {
      const next = recordModuleVisit(current, topic.code)
      saveStudentProgress(next)
      return next
    })
  }, [topic])

  if (!topic || !isCurriculumTopicReleased(topic.code)) return <Navigate replace to="/curriculum" />
  const theme = getThemeForTopic(topic)
  const adjacent = getAdjacentActiveTopics(topic.code)
  const questions = ibPracticeQuestions.filter((question) => question.topicCode === topic.code)
  const completion = progress.moduleCompletion[topic.code] ?? 0
  const relationships = getCurriculumRelationships(topic.relationshipIds)

  return (
    <div className="curriculum-module">
      <nav className="page-breadcrumbs" aria-label="Breadcrumb"><Link to="/curriculum">IB Study Map</Link><span>/</span><span>{topic.code}</span></nav>
      <header className="curriculum-module__hero">
        <div className="curriculum-module__code"><span>{topic.theme}</span><strong>{topic.code}</strong></div>
        <div><p className="eyebrow">{theme?.title} · {formatAvailability(topic.availability)}</p><h1>{topic.title}</h1><p>{topic.summary}</p><div className="module-badges"><span className={`coverage-badge coverage-badge--${topic.coverage}`}>{topic.coverage} coverage</span><span>{topic.practiceAvailable ? `${questions.length} original questions` : 'Practice planned'}</span></div></div>
        <div className="module-mastery"><span>Question mastery</span><strong>{completion}%</strong><progress aria-label={`${topic.code} question mastery`} max="100" value={completion} /><small>Stored locally on this device</small></div>
      </header>

      <section className="module-objectives" aria-labelledby="module-objectives-title">
        <header><CheckCircle2 aria-hidden="true" size={18} /><div><span>Learning objectives</span><h2 id="module-objectives-title">What you should be able to do</h2></div></header>
        <ol>{topic.objectives.map((objective, index) => <li key={objective}><span>{String(index + 1).padStart(2, '0')}</span>{objective}</li>)}</ol>
      </section>

      <div className="module-learning-grid">
        <section><header><BookOpen aria-hidden="true" size={17} /><div><span>Required concepts</span><h2>Build the model</h2></div></header><ul>{topic.concepts.map((concept) => <li key={concept}>{concept}</li>)}</ul></section>
        <section><header><Route aria-hidden="true" size={17} /><div><span>Physics skills</span><h2>Use the evidence</h2></div></header><ul>{topic.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul></section>
        <section><header><ArrowLeft aria-hidden="true" size={17} /><div><span>Prerequisites</span><h2>Prepare first</h2></div></header>{topic.prerequisites.length ? <ul>{topic.prerequisites.map((code) => { const prerequisite = findCurriculumTopic(code); return <li key={code}>{prerequisite && isCurriculumTopicReleased(prerequisite.code) ? <Link to={`/curriculum/${prerequisite.slug}`}>{code} {prerequisite.title}</Link> : `${code} ${prerequisite?.title ?? ''}`}</li> })}</ul> : <p>No syllabus-module prerequisite.</p>}</section>
      </div>

      <section className="module-study-notes" aria-labelledby="module-study-notes-title">
        <header><BookOpen aria-hidden="true" size={18} /><div><span>Guided study notes</span><h2 id="module-study-notes-title">Build, test, and communicate the model.</h2></div></header>
        <div>{topic.studySections.map((section) => <article key={section.title}><span>{section.title}</span><p>{section.summary}</p><ul>{section.takeaways.map((takeaway) => <li key={takeaway}>{takeaway}</li>)}</ul></article>)}</div>
        <aside><strong>Exam focus</strong>{topic.examFocus.map((item) => <span key={item}>{item}</span>)}</aside>
        <article className="module-worked-example"><span>Worked model example</span><h3>{topic.workedExample.title}</h3><dl><div><dt>Given</dt><dd>{topic.workedExample.given}</dd></div><div><dt>Reasoning</dt><dd>{topic.workedExample.reasoning}</dd></div><div><dt>Conclusion</dt><dd>{topic.workedExample.conclusion}</dd></div></dl></article>
      </section>

      <section className="module-resources" aria-labelledby="module-formulae-title">
        <header><div><span>Formulae and explanations</span><h2 id="module-formulae-title">Relationships, units, and assumptions.</h2></div><small>{topic.formulaIds.length} full inspectors · {relationships.length} course relationships</small></header>
        {topic.formulaIds.length > 0 && <div className="module-resource-links">{topic.formulaIds.map((formulaId) => { const formula = getFormulaById(formulaId); return <Link key={formula.id} to={`/formulas/${formula.id}?tab=explain&from=${encodeURIComponent(topic.code)}`}><FormulaExpression expression={formula.expression} /><strong>{formula.name}</strong><span>Explanation, units, example, and practice</span><ArrowRight aria-hidden="true" size={15} /></Link> })}</div>}
        {relationships.length > 0 && <div className="module-relationship-grid">{relationships.map((relationship) => <article key={relationship.id}><span className="relationship-expression">{relationship.expression}</span><strong>{relationship.name}</strong><p>{relationship.meaning}</p><dl><div><dt>Unit trace</dt><dd>{relationship.unitTrace}</dd></div><div><dt>Assumption</dt><dd>{relationship.assumption}</dd></div></dl></article>)}</div>}
        {topic.formulaIds.length > 0 && <nav className="module-example-links" aria-label="Worked examples"><span>Worked examples</span>{topic.formulaIds.slice(0, 4).map((formulaId) => { const formula = getFormulaById(formulaId); return <Link key={formulaId} to={`/formulas/${formulaId}?tab=example&from=${encodeURIComponent(topic.code)}`}>{formula.name}<ArrowRight aria-hidden="true" size={12} /></Link> })}</nav>}
      </section>

      <CurriculumInquiryPanel inquiry={topic.inquiry} />

      {topic.simulations.length > 0 && <section className="module-destinations" aria-labelledby="module-simulations-title">
        <header><Boxes aria-hidden="true" size={18} /><div><span>Interactive models</span><h2 id="module-simulations-title">Test the assumptions.</h2></div></header>
        <div>{topic.simulations.map((simulation) => <Link key={simulation.href} to={`${simulation.href}${simulation.href.includes('?') ? '&' : '?'}from=${encodeURIComponent(topic.code)}`}><strong>{simulation.label}</strong><span>Open live simulation</span><ArrowRight aria-hidden="true" size={15} /></Link>)}</div>
      </section>}

      <section className="module-practice-entry">
        <div><FlaskConical aria-hidden="true" size={20} /><span>Original IB-style practice</span><h2>{questions.length ? `Apply ${topic.code} through ${questions.length} functional questions.` : 'Practice is still planned for this module.'}</h2><p>Filter by assessment style and difficulty, use staged hints, then compare your work with markscheme-style guidance.</p></div>
        {questions.length > 0 && <Link to={`/practice?topic=${encodeURIComponent(topic.code)}`}>Open {topic.code} practice <ArrowRight aria-hidden="true" size={16} /></Link>}
      </section>

      <nav className="module-sequence" aria-label="Module sequence">
        {adjacent.previous ? <Link to={`/curriculum/${adjacent.previous.slug}`}><ArrowLeft aria-hidden="true" size={15} /><span>Previous module<strong>{adjacent.previous.code} {adjacent.previous.title}</strong></span></Link> : <span />}
        {adjacent.next && <Link to={`/curriculum/${adjacent.next.slug}`}><span>Next module<strong>{adjacent.next.code} {adjacent.next.title}</strong></span><ArrowRight aria-hidden="true" size={15} /></Link>}
      </nav>
    </div>
  )
}
