import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Atom, BookOpen, Boxes, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { mechanicsFormulas } from '../../data/formulas'
import { mechanicsTopics } from '../../data/topics'

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
        aria-label="Open mechanics curriculum scope"
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
        <span>Mechanics · V1</span>
        <ChevronDown aria-hidden="true" className={open ? 'is-open' : ''} size={14} />
      </button>

      {open && (
        <section aria-label="Mechanics curriculum scope" className="scope-panel" id={panelId}>
          <header>
            <span>Active curriculum</span>
            <strong>Mechanics · Version 1</strong>
            <p>Explore validated models without mixing in unfinished subject areas.</p>
          </header>

          <dl>
            <div>
              <dt>Mapped topics</dt>
              <dd>{String(mechanicsTopics.length).padStart(2, '0')}</dd>
            </div>
            <div>
              <dt>Formula models</dt>
              <dd>{String(mechanicsFormulas.length).padStart(2, '0')}</dd>
            </div>
            <div>
              <dt>Benchmark labs</dt>
              <dd>{String(mechanicsFormulas.length).padStart(2, '0')}</dd>
            </div>
          </dl>

          <nav aria-label="Mechanics scope destinations">
            <Link onClick={close} to="/explore">
              <BookOpen aria-hidden="true" size={16} />
              <span>
                <strong>Open topic atlas</strong>
                <small>Seven connected mechanics domains</small>
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
                <small>Eight complete mechanics instruments</small>
              </span>
              <ArrowRight aria-hidden="true" size={14} />
            </Link>
          </nav>

          <footer>Waves and electricity remain planned, not presented as completed modules.</footer>
        </section>
      )}
    </div>
  )
}
