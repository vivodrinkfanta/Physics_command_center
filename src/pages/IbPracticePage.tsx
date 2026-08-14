import { ArrowRight, CheckCircle2, CircleDashed, FlaskConical, RotateCcw, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { activeCurriculumTopics } from '../utils/curriculum'
import {
  filterIbPracticeQuestions,
  practiceStyleLabels,
  questionProgressStatus,
  type PracticeFilters,
  type PracticeStatusFilter,
} from '../utils/ibPractice'
import type { PracticeAssessmentStyle, PracticeDifficulty } from '../types/ibPractice'
import { createEmptyStudentProgress, loadStudentProgress, saveStudentProgress } from '../utils/studentProgress'

const styleOptions: Array<{ label: string; value: 'all' | PracticeAssessmentStyle }> = [
  { label: 'All assessment styles', value: 'all' },
  ...Object.entries(practiceStyleLabels).map(([value, label]) => ({ value: value as PracticeAssessmentStyle, label })),
]
const difficultyOptions: Array<{ label: string; value: 'all' | PracticeDifficulty }> = [
  { label: 'All difficulties', value: 'all' }, { label: 'Foundation', value: 'foundation' },
  { label: 'Standard', value: 'standard' }, { label: 'Challenge', value: 'challenge' },
]
const statusOptions: Array<{ label: string; value: PracticeStatusFilter }> = [
  { label: 'All progress', value: 'all' }, { label: 'Unanswered', value: 'unanswered' },
  { label: 'Attempted', value: 'attempted' }, { label: 'Completed', value: 'completed' },
]

export function IbPracticePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [progress, setProgress] = useState(loadStudentProgress)
  const [confirmReset, setConfirmReset] = useState(false)
  const value = (key: string, fallback = 'all') => searchParams.get(key) ?? fallback
  const query = value('q', '')
  const topicCode = value('topic')
  const requestedLevel = value('level')
  const level: PracticeFilters['level'] = requestedLevel === 'hl' || requestedLevel === 'sl' ? requestedLevel : 'all'
  const style = styleOptions.some((option) => option.value === value('style')) ? value('style') as 'all' | PracticeAssessmentStyle : 'all'
  const difficulty = difficultyOptions.some((option) => option.value === value('difficulty')) ? value('difficulty') as 'all' | PracticeDifficulty : 'all'
  const status = statusOptions.some((option) => option.value === value('status')) ? value('status') as PracticeStatusFilter : 'all'
  const filters = { query, topicCode, level, style, difficulty, status }
  const questions = useMemo(() => filterIbPracticeQuestions(filters, progress), [difficulty, level, progress, query, status, style, topicCode])

  const update = (key: string, nextValue: string, defaultValue = 'all') => {
    const next = new URLSearchParams(searchParams)
    if (!nextValue || nextValue === defaultValue) next.delete(key)
    else next.set(key, nextValue)
    setSearchParams(next, { replace: true })
  }
  const resetProgress = () => {
    const empty = createEmptyStudentProgress(); saveStudentProgress(empty); setProgress(empty); setConfirmReset(false)
  }

  return (
    <div className="ib-practice-index">
      <nav className="page-breadcrumbs" aria-label="Breadcrumb"><Link to="/curriculum">IB Study Map</Link><span>/</span><span>Practice</span></nav>
      <header className="practice-hero">
        <div><p className="eyebrow"><FlaskConical aria-hidden="true" size={14} /> Original IB-style practice</p><h1>Practise the skill the question actually tests.</h1><p>Filter by syllabus module, level, difficulty, assessment style, and local completion state. Every visible question has working answer logic, staged hints, and markscheme-style guidance.</p></div>
        <dl><div><dt>Question bank</dt><dd>{String(filterIbPracticeQuestions({ query: '', topicCode: 'all', level: 'all', style: 'all', difficulty: 'all', status: 'all' }, progress).length).padStart(2, '0')}</dd></div><div><dt>Modules live</dt><dd>{String(activeCurriculumTopics.length).padStart(2, '0')}</dd></div><div><dt>Source</dt><dd>Original</dd></div></dl>
      </header>

      <section className="practice-filters" aria-label="Practice filters">
        <label className="practice-search"><Search aria-hidden="true" size={17} /><span className="sr-only">Search questions</span><input type="search" value={query} onChange={(event) => update('q', event.target.value, '')} placeholder="Search scenarios, skills, or concepts" /></label>
        <div className="practice-filter-grid">
          <label><span>Syllabus module</span><select value={topicCode} onChange={(event) => update('topic', event.target.value)}><option value="all">All live modules</option>{activeCurriculumTopics.filter((topic) => topic.practiceAvailable).map((topic) => <option key={topic.code} value={topic.code}>{topic.code} {topic.title}</option>)}</select></label>
          <label><span>Level</span><select value={level} onChange={(event) => update('level', event.target.value)}><option value="all">SL & HL</option><option value="sl">SL</option><option value="hl">HL</option></select></label>
          <label><span>Difficulty</span><select value={difficulty} onChange={(event) => update('difficulty', event.target.value)}>{difficultyOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
          <label><span>Assessment style</span><select value={style} onChange={(event) => update('style', event.target.value)}>{styleOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
          <label><span>Progress</span><select value={status} onChange={(event) => update('status', event.target.value)}>{statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
        </div>
        <div className="practice-filter-actions"><span aria-live="polite"><strong>{questions.length}</strong> {questions.length === 1 ? 'question' : 'questions'} match this setup</span><button onClick={() => setConfirmReset(true)} type="button"><RotateCcw aria-hidden="true" size={14} /> Reset local progress</button></div>
      </section>

      {confirmReset && <section className="reset-confirmation" role="alertdialog" aria-labelledby="practice-reset-title"><div><strong id="practice-reset-title">Reset all practice progress?</strong><p>This cannot be undone on this device.</p></div><div><button onClick={() => setConfirmReset(false)} type="button">Cancel</button><button className="is-destructive" onClick={resetProgress} type="button">Reset progress</button></div></section>}

      {questions.length ? (
        <section className="question-catalog" aria-label="Practice questions">
          {questions.map((question) => {
            const itemStatus = questionProgressStatus(question.id, progress)
            const itemProgress = progress.questions[question.id]
            return <Link key={question.id} to={`/practice/${question.id}`}>
              <div className="question-card__topline"><span>{question.topicCode}</span><span>{practiceStyleLabels[question.style]}</span>{itemStatus === 'completed' ? <CheckCircle2 aria-label="Completed" size={16} /> : <CircleDashed aria-label={itemStatus === 'attempted' ? 'Attempted' : 'Unanswered'} size={16} />}</div>
              <h2>{question.title}</h2><p>{question.scenario}</p>
              <div className="question-card__meta"><span>{question.level === 'sl' ? 'SL core · HL relevant' : 'HL only'}</span><span>{question.difficulty}</span><span>{question.marks} {question.marks === 1 ? 'mark' : 'marks'}</span><span>{itemStatus}{itemProgress ? ` · best ${itemProgress.bestScore}/${question.marks}` : ''}</span></div>
              <ArrowRight className="question-card__arrow" aria-hidden="true" size={16} />
            </Link>
          })}
        </section>
      ) : <section className="practice-empty"><Search aria-hidden="true" size={22} /><h2>No questions match every filter.</h2><p>Broaden one filter or clear the search query.</p><button onClick={() => setSearchParams({}, { replace: true })} type="button">Reset filters</button></section>}
    </div>
  )
}
