import { BookOpen, Search, SlidersHorizontal, X } from 'lucide-react'
import { useDeferredValue, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FormulaCard } from '../components/formulas/FormulaCard'
import { mechanicsFormulas } from '../data/formulas'
import type { FormulaDifficultyFilter, FormulaSort } from '../utils/formulaLibrary'
import { getFormulaLibraryResults } from '../utils/formulaLibrary'

const topicOrder = [
  'Kinematics',
  'Forces',
  'Energy',
  'Momentum',
  'Circular Motion',
  'Projectiles',
  'Oscillations',
]

const difficultyOptions: Array<{ label: string; value: FormulaDifficultyFilter }> = [
  { label: 'All levels', value: 'all' },
  { label: 'Foundation', value: 'foundation' },
  { label: 'Developing', value: 'developing' },
  { label: 'Advanced', value: 'advanced' },
]

const sortOptions: Array<{ label: string; value: FormulaSort }> = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Topic', value: 'topic' },
  { label: 'Name A–Z', value: 'name' },
  { label: 'Difficulty', value: 'difficulty' },
]

const exampleQueries = ['mass velocity momentum', 'centripetal', 'Eₖ = ½mv²']

export function FormulaLibraryPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const topics = topicOrder.filter((candidate) =>
    mechanicsFormulas.some((formula) => formula.subtopic === candidate),
  )
  const requestedTopic = searchParams.get('topic') ?? 'all'
  const topic = requestedTopic === 'all' || topics.includes(requestedTopic) ? requestedTopic : 'all'
  const requestedDifficulty = searchParams.get('level') ?? 'all'
  const difficulty = difficultyOptions.some((option) => option.value === requestedDifficulty)
    ? (requestedDifficulty as FormulaDifficultyFilter)
    : 'all'
  const sortParameter = searchParams.get('sort') ?? (query ? 'relevance' : 'topic')
  const requestedSort = sortOptions.some((option) => option.value === sortParameter)
    ? (sortParameter as FormulaSort)
    : query
      ? 'relevance'
      : 'topic'
  const deferredQuery = useDeferredValue(query)

  const updateParameter = (key: string, value: string, defaultValue = '') => {
    const next = new URLSearchParams(searchParams)
    if (!value || value === defaultValue) next.delete(key)
    else next.set(key, value)
    setSearchParams(next, { replace: true })
  }

  const resetFilters = () => setSearchParams({}, { replace: true })

  const results = useMemo(
    () =>
      getFormulaLibraryResults({
        query: deferredQuery,
        topic,
        difficulty,
        sort: requestedSort,
      }),
    [deferredQuery, difficulty, requestedSort, topic],
  )

  return (
    <div className="formula-library">
      <header className="formula-library__hero">
        <div>
          <p className="eyebrow">
            <BookOpen aria-hidden="true" size={14} />
            Mechanics reference system
          </p>
          <h1>Find the relationship you need.</h1>
          <p>
            Search by concept, equation, or a plain-language connection between variables. Every
            result is backed by the validated formula registry.
          </p>
        </div>
        <dl className="formula-library__telemetry" aria-label="Formula library summary">
          <div>
            <dt>Validated models</dt>
            <dd>{mechanicsFormulas.length.toString().padStart(2, '0')}</dd>
          </div>
          <div>
            <dt>Topics online</dt>
            <dd>{topics.length.toString().padStart(2, '0')}</dd>
          </div>
          <div>
            <dt>Unit system</dt>
            <dd>SI</dd>
          </div>
        </dl>
      </header>

      <section className="library-instrument" aria-label="Formula search and filters">
        <div className="library-search">
          <Search aria-hidden="true" size={20} />
          <label className="sr-only" htmlFor="formula-library-search">
            Search formula library
          </label>
          <input
            autoComplete="off"
            id="formula-library-search"
            onChange={(event) => updateParameter('q', event.target.value)}
            placeholder="Try ‘formula connecting mass, velocity and momentum’"
            type="search"
            value={query}
          />
          {query && (
            <button
              aria-label="Clear search"
              className="library-search__clear"
              onClick={() => updateParameter('q', '')}
              type="button"
            >
              <X aria-hidden="true" size={16} />
            </button>
          )}
        </div>

        <div className="library-examples" aria-label="Example formula searches">
          <span>Try a query</span>
          {exampleQueries.map((example) => (
            <button key={example} onClick={() => updateParameter('q', example)} type="button">
              {example}
            </button>
          ))}
        </div>

        <div className="library-controls">
          <div className="library-topics" aria-label="Filter by topic">
            <button
              aria-pressed={topic === 'all'}
              className={topic === 'all' ? 'is-active' : ''}
              onClick={() => updateParameter('topic', 'all', 'all')}
              type="button"
            >
              All topics
            </button>
            {topics.map((candidate) => (
              <button
                aria-pressed={topic === candidate}
                className={topic === candidate ? 'is-active' : ''}
                key={candidate}
                onClick={() => updateParameter('topic', candidate, 'all')}
                type="button"
              >
                {candidate}
              </button>
            ))}
          </div>

          <div className="library-selects">
            <label>
              <SlidersHorizontal aria-hidden="true" size={14} />
              <span className="sr-only">Difficulty</span>
              <select
                aria-label="Filter by difficulty"
                onChange={(event) => updateParameter('level', event.target.value, 'all')}
                value={difficulty}
              >
                {difficultyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Sort</span>
              <select
                aria-label="Sort formulas"
                onChange={(event) => updateParameter('sort', event.target.value)}
                value={requestedSort}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </section>

      <div className="library-results-heading" aria-live="polite">
        <p>
          <strong>{results.length}</strong> {results.length === 1 ? 'relationship' : 'relationships'}
          {deferredQuery && <span> matching “{deferredQuery}”</span>}
        </p>
        <span>Hover or focus a variable to trace it through the equation.</span>
      </div>

      {results.length > 0 ? (
        <section className="formula-grid" aria-label="Formula results">
          {results.map((formula) => (
            <FormulaCard formula={formula} key={formula.id} />
          ))}
        </section>
      ) : (
        <section className="library-empty" aria-labelledby="library-empty-title">
          <Search aria-hidden="true" size={24} />
          <h2 id="library-empty-title">No relationship matches this setup.</h2>
          <p>Try fewer keywords, another topic, or reset the filters to see every validated model.</p>
          <button onClick={resetFilters} type="button">
            Reset library
          </button>
        </section>
      )}
    </div>
  )
}
