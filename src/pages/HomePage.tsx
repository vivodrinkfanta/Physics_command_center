import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  Atom,
  Boxes,
  CircuitBoard,
  Gauge,
  MoveUpRight,
  Orbit,
  Search,
  Waves,
  Zap,
} from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ProjectilePreview } from '../components/home/ProjectilePreview'
import { homeSearchItems } from '../data/homeSearch'
import '../styles/home.css'

const topics = [
  {
    name: 'Motion',
    description: 'Position, velocity and acceleration through time.',
    equation: 'v = u + at',
    icon: Gauge,
    slug: 'kinematics',
    available: true,
  },
  {
    name: 'Forces',
    description: 'Understand how interactions change motion.',
    equation: 'ΣF = ma',
    icon: MoveUpRight,
    slug: 'forces',
    available: true,
  },
  {
    name: 'Energy',
    description: 'Track work, power and energy transfers.',
    equation: 'Eₖ = ½mv²',
    icon: Zap,
    slug: 'energy',
    available: true,
  },
  {
    name: 'Momentum',
    description: 'Investigate impulse and colliding systems.',
    equation: 'p = mv',
    icon: Boxes,
    slug: 'momentum',
    available: true,
  },
  {
    name: 'Circular Motion',
    description: 'Explore inward force and radial acceleration.',
    equation: 'a꜀ = v²/r',
    icon: Orbit,
    slug: 'circular-motion',
    available: true,
  },
  {
    name: 'Waves',
    description: 'Frequency, wavelength and wave behaviour.',
    equation: 'v = fλ',
    icon: Waves,
    slug: 'waves',
    available: false,
  },
  {
    name: 'Electricity',
    description: 'Charge, current and electric circuits.',
    equation: 'V = IR',
    icon: CircuitBoard,
    slug: 'electricity',
    available: false,
  },
]

export function HomePage() {
  const [query, setQuery] = useState('')
  const [searchParams] = useSearchParams()
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const focusSearch = () => inputRef.current?.focus()
    window.addEventListener('physics-lab:focus-search', focusSearch)
    if (searchParams.get('focus') === 'search') focusSearch()

    return () => window.removeEventListener('physics-lab:focus-search', focusSearch)
  }, [searchParams])

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return []

    return homeSearchItems
      .filter((item) =>
        [item.name, item.formula, item.topic, ...item.keywords]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery),
      )
      .slice(0, 4)
  }, [query])

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedQuery = query.trim()
    if (!trimmedQuery) {
      inputRef.current?.focus()
      return
    }

    navigate(`/formulas?q=${encodeURIComponent(trimmedQuery)}`)
  }

  return (
    <div className="home-view">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero__copy">
          <p className="home-kicker">
            <Atom aria-hidden="true" size={14} />
            Interactive mechanics laboratory
          </p>
          <h1 id="home-title">
            Explore physical
            <br />
            <span>relationships.</span>
          </h1>
          <p className="home-hero__intro">
            Move beyond memorising equations. Change the variables, observe the system, and see the
            mathematics respond.
          </p>

          <form className="physics-search" onSubmit={submitSearch} role="search">
            <Search aria-hidden="true" className="physics-search__icon" size={20} strokeWidth={1.7} />
            <label className="sr-only" htmlFor="physics-search-input">
              Search equations, concepts, or variables
            </label>
            <input
              autoComplete="off"
              id="physics-search-input"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search equations, concepts or variables…"
              ref={inputRef}
              type="search"
              value={query}
            />
            <kbd>Enter</kbd>

            {query.trim() && (
              <div className="search-results" aria-label="Search suggestions">
                {results.length > 0 ? (
                  results.map((result) => (
                    <button
                      key={result.name}
                      onClick={() => navigate(`/formulas?q=${encodeURIComponent(result.name)}`)}
                      type="button"
                    >
                      <span className="search-results__formula">{result.formula}</span>
                      <span className="search-results__copy">
                        <strong>{result.name}</strong>
                        <small>{result.description}</small>
                      </span>
                      <span className="search-results__topic">{result.topic}</span>
                      <ArrowRight aria-hidden="true" size={15} />
                    </button>
                  ))
                ) : (
                  <p>No matching mechanics concepts yet.</p>
                )}
              </div>
            )}
          </form>

          <div className="search-examples" aria-label="Example searches">
            <span>Try</span>
            {['force', 'kinetic energy', 'v = u + at'].map((example) => (
              <button key={example} onClick={() => setQuery(example)} type="button">
                {example}
              </button>
            ))}
          </div>
        </div>

        <ProjectilePreview />
      </section>

      <section className="topic-section" aria-labelledby="topic-heading">
        <header className="section-heading">
          <div>
            <p>Explore by system</p>
            <h2 id="topic-heading">Physics domains</h2>
          </div>
          <Link to="/explore">
            Open topic explorer
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </header>

        <div className="topic-grid">
          {topics.map(({ available, description, equation, icon: Icon, name, slug }) =>
            available ? (
              <Link className="topic-card" key={slug} to={`/explore?topic=${slug}`}>
                <div className="topic-card__topline">
                  <span className="topic-card__icon">
                    <Icon aria-hidden="true" size={19} strokeWidth={1.6} />
                  </span>
                  <ArrowRight aria-hidden="true" className="topic-card__arrow" size={16} />
                </div>
                <div>
                  <h3>{name}</h3>
                  <p>{description}</p>
                </div>
                <code>{equation}</code>
              </Link>
            ) : (
              <article aria-disabled="true" className="topic-card topic-card--planned" key={slug}>
                <div className="topic-card__topline">
                  <span className="topic-card__icon">
                    <Icon aria-hidden="true" size={19} strokeWidth={1.6} />
                  </span>
                  <span className="planned-label">Planned</span>
                </div>
                <div>
                  <h3>{name}</h3>
                  <p>{description}</p>
                </div>
                <code>{equation}</code>
              </article>
            ),
          )}
        </div>
      </section>
    </div>
  )
}
