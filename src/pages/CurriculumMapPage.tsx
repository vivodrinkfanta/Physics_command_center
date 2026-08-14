import { ArrowRight, BookOpenCheck, RotateCcw, ShieldCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ResetProgressConfirmation } from '../components/progress/ResetProgressConfirmation'
import { ibPhysicsThemes } from '../data/ibPhysicsCurriculum'
import { ibPracticeQuestions } from '../data/ibPracticeQuestions'
import { filterCurriculumTopics, formatAvailability, getTopicsForTheme, type CurriculumLevelFilter } from '../utils/curriculum'
import { createEmptyStudentProgress, loadStudentProgress, saveStudentProgress } from '../utils/studentProgress'

const levelOptions: Array<{ label: string; value: CurriculumLevelFilter }> = [
  { label: 'All', value: 'all' }, { label: 'SL', value: 'sl' }, { label: 'HL', value: 'hl' },
]

export function CurriculumMapPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedLevel = searchParams.get('level')
  const level: CurriculumLevelFilter = requestedLevel === 'sl' || requestedLevel === 'hl' ? requestedLevel : 'all'
  const [progress, setProgress] = useState(loadStudentProgress)
  const [confirmReset, setConfirmReset] = useState(false)
  const visibleTopics = useMemo(() => filterCurriculumTopics(level), [level])
  const lastTopic = visibleTopics.find((topic) => topic.code === progress.lastVisitedModule)

  const selectLevel = (nextLevel: CurriculumLevelFilter) => {
    const next = new URLSearchParams(searchParams)
    if (nextLevel === 'all') next.delete('level')
    else next.set('level', nextLevel)
    setSearchParams(next, { replace: true })
  }

  const resetProgress = () => {
    const empty = createEmptyStudentProgress()
    saveStudentProgress(empty)
    setProgress(empty)
    setConfirmReset(false)
  }

  return (
    <div className="curriculum-map">
      <header className="curriculum-hero">
        <div>
          <p className="eyebrow"><BookOpenCheck aria-hidden="true" size={14} /> IB-aligned study pathway</p>
          <h1>Study the current IB Physics course by syllabus module.</h1>
          <p>Choose a level, open an official topic code, and move directly between explanations, formulae, simulations, worked examples, and original assessment-style practice.</p>
          <small>Organized around the IB Physics syllabus for first assessment 2025. This independent learning tool is not endorsed, licensed, or certified by the IB.</small>
        </div>
        <dl aria-label="Curriculum coverage summary">
          <div><dt>Official themes</dt><dd>05</dd></div>
          <div><dt>Topics mapped</dt><dd>{String(visibleTopics.length).padStart(2, '0')}</dd></div>
          <div><dt>Released pathway</dt><dd>A–E</dd></div>
        </dl>
      </header>

      <section className="curriculum-controls" aria-label="Study map controls">
        <div>
          <span>Show syllabus level</span>
          <div className="segmented-control">
            {levelOptions.map((option) => (
              <button aria-pressed={level === option.value} className={level === option.value ? 'is-active' : ''} key={option.value} onClick={() => selectLevel(option.value)} type="button">{option.label}</button>
            ))}
          </div>
        </div>
        {lastTopic ? (
          <Link className="continue-study" to={`/curriculum/${lastTopic.slug}`}>
            <span>Continue studying</span><strong>{lastTopic.code} {lastTopic.title}</strong><ArrowRight aria-hidden="true" size={16} />
          </Link>
        ) : (
          <Link className="continue-study" to="/curriculum/a-1">
            <span>Recommended start</span><strong>A.1 Kinematics</strong><ArrowRight aria-hidden="true" size={16} />
          </Link>
        )}
        <button className="reset-progress-trigger" onClick={() => setConfirmReset(true)} type="button"><RotateCcw aria-hidden="true" size={14} /> Reset progress</button>
      </section>

      {confirmReset && (
        <ResetProgressConfirmation
          confirmLabel="Reset progress"
          description="This removes attempts, scores, hints, module completion, and your last visited module on this device."
          id="curriculum-reset"
          onCancel={() => setConfirmReset(false)}
          onConfirm={resetProgress}
          title="Reset local study progress?"
        />
      )}

      <div className="curriculum-themes">
        {ibPhysicsThemes.map((theme) => {
          const topics = getTopicsForTheme(theme.code, level)
          if (!topics.length) return null
          return (
            <section className="curriculum-theme" key={theme.code} aria-labelledby={`theme-${theme.code}`}>
              <header><span>{theme.code}</span><div><h2 id={`theme-${theme.code}`}>{theme.title}</h2><p>{theme.summary}</p></div></header>
              <div className="curriculum-topic-grid">
                {topics.map((topic) => {
                  const completion = progress.moduleCompletion[topic.code] ?? 0
                  const questionCount = ibPracticeQuestions.filter((question) => question.topicCode === topic.code).length
                  const relationshipCount = topic.formulaIds.length + topic.relationshipIds.length
                  const content = (
                    <>
                      <div className="curriculum-topic__topline">
                        <strong>{topic.code}</strong>
                        <span className={`coverage-badge coverage-badge--${topic.coverage}`}>{topic.coverage}</span>
                      </div>
                      <h3>{topic.title}</h3><p>{topic.summary}</p>
                      <div className="curriculum-topic__meta"><span>{formatAvailability(topic.availability)}</span><span>{relationshipCount} relationships</span><span>{questionCount} questions</span></div>
                      <div className="module-progress"><span><span>Question mastery</span><strong>{completion}%</strong></span><progress aria-label={`${topic.code} question mastery`} max="100" value={completion} /></div>
                      <small>{topic.coverageNote}</small>
                    </>
                  )
                  return <Link className="curriculum-topic" key={topic.code} to={`/curriculum/${topic.slug}`}>{content}<ArrowRight className="curriculum-topic__arrow" aria-hidden="true" size={16} /></Link>
                })}
              </div>
            </section>
          )
        })}
      </div>

      <footer className="curriculum-source-note">
        <ShieldCheck aria-hidden="true" size={18} />
        <p><strong>Release contract enforced.</strong> Every visible module has guided study notes, documented relationships, an interactive evidence inquiry, and functional original practice. Unfinished modules are excluded from this map and its routes.</p>
        <a href="https://www.ibo.org/programmes/diploma-programme/curriculum/sciences/physics/" rel="noreferrer" target="_blank">Official IB Physics overview <ArrowRight aria-hidden="true" size={13} /></a>
      </footer>
    </div>
  )
}
