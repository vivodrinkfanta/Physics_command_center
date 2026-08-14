import { ArrowLeft, ArrowRight, BookOpen, Check, Lightbulb, RotateCcw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { findIbPracticeQuestion, ibPracticeQuestions } from '../data/ibPracticeQuestions'
import { getFormulaById } from '../data/formulas'
import { getCurriculumRelationships } from '../data/curriculumRelationships'
import { evaluateIbPracticeAnswer, practiceSkillLabels, practiceStyleLabels } from '../utils/ibPractice'
import { loadStudentProgress, recordQuestionResult, saveStudentProgress } from '../utils/studentProgress'
import type { PracticeEvaluation } from '../types/ibPractice'

export function IbPracticeQuestionPage() {
  const { questionId } = useParams()
  const question = findIbPracticeQuestion(questionId)
  const [response, setResponse] = useState('')
  const [hintCount, setHintCount] = useState(0)
  const [evaluation, setEvaluation] = useState<PracticeEvaluation | null>(null)
  const [progress, setProgress] = useState(loadStudentProgress)
  const sameTopicQuestions = useMemo(() => question ? ibPracticeQuestions.filter((item) => item.topicCode === question.topicCode) : [], [question])

  if (!question) return <Navigate replace to="/practice" />
  const currentIndex = sameTopicQuestions.findIndex((item) => item.id === question.id)
  const nextQuestion = sameTopicQuestions[(currentIndex + 1) % sameTopicQuestions.length]
  const saved = progress.questions[question.id]
  const relationships = getCurriculumRelationships(question.relationshipIds ?? [])

  const checkAnswer = () => {
    const result = evaluateIbPracticeAnswer(question, response)
    setEvaluation(result)
    if (!response.trim()) return
    setProgress((current) => {
      const next = recordQuestionResult(current, question.id, question.topicCode, result.score, result.maxScore, hintCount)
      saveStudentProgress(next)
      return next
    })
  }

  return (
    <div className="practice-question">
      <nav className="page-breadcrumbs" aria-label="Breadcrumb"><Link to="/curriculum">IB Study Map</Link><span>/</span><Link to={`/curriculum/${question.topicCode.toLowerCase().replace('.', '-')}`}>{question.topicCode}</Link><span>/</span><Link to={`/practice?topic=${encodeURIComponent(question.topicCode)}`}>Practice</Link><span>/</span><span>Question</span></nav>
      <Link className="practice-question__back" to={`/practice?topic=${encodeURIComponent(question.topicCode)}`}><ArrowLeft aria-hidden="true" size={15} /> Back to {question.topicCode} practice</Link>
      <header className="practice-question__header">
        <div><p className="eyebrow">{question.topicCode} · {practiceStyleLabels[question.style]}</p><h1>{question.title}</h1><p>{question.scenario}</p></div>
        <dl><div><dt>Level</dt><dd>{question.level === 'sl' ? 'SL core' : 'HL only'}</dd></div><div><dt>Difficulty</dt><dd>{question.difficulty}</dd></div><div><dt>Focus</dt><dd>{practiceSkillLabels[question.skillFocus[0]]}</dd></div><div><dt>Marks</dt><dd>{question.marks}</dd></div>{saved && <div><dt>Best</dt><dd>{saved.bestScore}/{question.marks}</dd></div>}</dl>
      </header>

      <section className="question-workspace" aria-labelledby="question-prompt">
        <div className="question-prompt"><span>Question</span><h2 id="question-prompt">{question.prompt}</h2>{question.data && <dl className="question-data">{question.data.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>}</div>

        <div className="question-response">
          {question.answer.kind === 'choice' ? (
            <fieldset><legend>Select one answer</legend>{question.choices?.map((choice) => <label className={response === choice.id ? 'is-selected' : ''} key={choice.id}><input checked={response === choice.id} name="question-choice" onChange={() => { setResponse(choice.id); setEvaluation(null) }} type="radio" value={choice.id} /><span>{choice.id.toUpperCase()}</span><strong>{choice.label}</strong></label>)}</fieldset>
          ) : question.answer.kind === 'numeric' ? (
            <label className="numeric-response"><span>Your answer</span><div><input autoComplete="off" inputMode="decimal" onChange={(event) => { setResponse(event.target.value); setEvaluation(null) }} placeholder="Enter a signed value" type="text" value={response} />{question.answer.unit && <span>{question.answer.unit}</span>}</div></label>
          ) : (
            <label className="extended-response"><span>Your explanation</span><textarea onChange={(event) => { setResponse(event.target.value); setEvaluation(null) }} placeholder="State the model, connect the evidence, and evaluate the claim…" rows={7} value={response} /><small>Scoring checks for the required physics ideas, not exact wording.</small></label>
          )}
          <button className="check-response" disabled={!response.trim()} onClick={checkAnswer} type="button"><Check aria-hidden="true" size={15} /> Check response</button>
          {evaluation && <div className={`question-feedback${evaluation.correct ? ' is-correct' : ''}`} role="status"><strong>{evaluation.score}/{evaluation.maxScore} marks</strong><p>{evaluation.feedback}</p></div>}
        </div>
      </section>

      <section className="question-support" aria-label="Hints and guidance">
        <div className="question-hints"><header><Lightbulb aria-hidden="true" size={17} /><div><span>Staged hints</span><h2>Reveal only what you need.</h2></div></header><button disabled={hintCount >= question.hints.length} onClick={() => setHintCount((count) => Math.min(question.hints.length, count + 1))} type="button">{hintCount ? 'Reveal next hint' : 'Reveal a hint'}</button><ol aria-live="polite">{question.hints.slice(0, hintCount).map((hint, index) => <li key={hint}><span>{String(index + 1).padStart(2, '0')}</span>{hint}</li>)}</ol></div>
        <div className="question-guidance"><header><BookOpen aria-hidden="true" size={17} /><div><span>Markscheme-style guidance</span><h2>{evaluation ? 'Compare each awarded idea.' : 'Available after your first check.'}</h2></div></header>{evaluation ? <ol>{question.markscheme.map((point) => <li key={point}>{point}</li>)}</ol> : <p>Submit an attempt before revealing the worked guidance.</p>}</div>
      </section>

      <section className="question-connections"><div><span>Need to revisit the model?</span><h2>Move from question to its module, relationship, or simulation.</h2></div><div><Link to={`/curriculum/${question.topicCode.toLowerCase().replace('.', '-')}#module-formulae-title`}>Open {question.topicCode} study module <ArrowRight aria-hidden="true" size={14} /></Link>{question.formulaIds.map((formulaId) => { const formula = getFormulaById(formulaId); return <Link key={formulaId} to={`/formulas/${formulaId}?tab=explain&from=${encodeURIComponent(question.topicCode)}`}>{formula.name}<ArrowRight aria-hidden="true" size={14} /></Link> })}{relationships.map((relationship) => <Link key={relationship.id} to={`/curriculum/${question.topicCode.toLowerCase().replace('.', '-')}#module-formulae-title`}>{relationship.name}<ArrowRight aria-hidden="true" size={14} /></Link>)}{question.simulationHref && <Link to={`${question.simulationHref}${question.simulationHref.includes('?') ? '&' : '?'}from=${encodeURIComponent(question.topicCode)}`}>Open related simulation <ArrowRight aria-hidden="true" size={14} /></Link>}</div></section>

      <nav className="question-next" aria-label="Question navigation"><button onClick={() => { setResponse(''); setEvaluation(null); setHintCount(0) }} type="button"><RotateCcw aria-hidden="true" size={14} /> Try again</button>{nextQuestion && nextQuestion.id !== question.id && <Link to={`/practice/${nextQuestion.id}`}>Next {question.topicCode} question <ArrowRight aria-hidden="true" size={15} /></Link>}</nav>
    </div>
  )
}
