import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Atom, BookOpenCheck, Boxes, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { mechanicsFormulas } from '../../data/formulas'
import { activeCurriculumTopics } from '../../utils/curriculum'

export function ScopeMenu() {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelId = 'curriculum-scope-panel'

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      triggerRef.current?.focus()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <div className="scope-control" ref={rootRef}>
      <button
        aria-controls={panelId}
        aria-expanded={open}
        aria-label="Open IB-aligned curriculum scope"
        className="scope-badge"
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key !== 'ArrowDown') return
          event.preventDefault()
          setOpen(true)
          window.requestAnimationFrame(() =>
            rootRef.current?.querySelector<HTMLAnchorElement>('.scope-panel a')?.focus(),
          )
        }}
        ref={triggerRef}
        type="button"
      >
        <span className="scope-badge__pulse" aria-hidden="true" />
        <span>IB Physics · Mechanics</span>
        <ChevronDown aria-hidden="true" className={open ? 'is-open' : ''} size={14} />
      </button>

      {open && (
        <section aria-label="IB-aligned curriculum scope" className="scope-panel" id={panelId}>
          <header>
            <span>Active curriculum</span>
            <strong>First assessment 2025 pathway</strong>
            <p>Official syllabus codes organize the current mechanics coverage without claiming full-course completion.</p>
          </header>

          <dl>
            <div>
              <dt>Mapped topics</dt>
              <dd>{String(activeCurriculumTopics.length).padStart(2, '0')}</dd>
            </div>
            <div>
              <dt>Formula models</dt>
              <dd>{String(mechanicsFormulas.length).padStart(2, '0')}</dd>
            </div>
            <div>
              <dt>Benchmark labs</dt>
              <dd>12</dd>
            </div>
          </dl>

          <nav aria-label="IB-aligned scope destinations">
            <Link onClick={close} to="/curriculum">
              <BookOpenCheck aria-hidden="true" size={16} />
              <span>
                <strong>Open IB Study Map</strong>
                <small>Five official themes · honest coverage status</small>
              </span>
              <ArrowRight aria-hidden="true" size={14} />
            </Link>
            <Link onClick={close} to="/formulas">
              <Atom aria-hidden="true" size={16} />
              <span>
                <strong>Browse formula library</strong>
                <small>Search equations, quantities, and units</small>
              </span>
              <ArrowRight aria-hidden="true" size={14} />
            </Link>
            <Link onClick={close} to="/simulations">
              <Boxes aria-hidden="true" size={16} />
              <span>
                <strong>Open simulation catalog</strong>
                <small>Twelve workbenches · 21 formula models</small>
              </span>
              <ArrowRight aria-hidden="true" size={14} />
            </Link>
          </nav>

          <footer>Independent IB-aligned tool. Partial and planned modules are never presented as complete.</footer>
        </section>
      )}
    </div>
  )
}
