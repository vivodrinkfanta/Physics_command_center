import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  Atom,
  BookOpen,
  Boxes,
  FlaskConical,
  LayoutGrid,
  Search,
  X,
} from 'lucide-react'
import {
  searchCommandPalette,
  type CommandPaletteItem,
  type CommandSection,
} from '../../utils/commandPalette'

interface CommandPaletteProps {
  onClose: () => void
  onNavigate: (href: string) => void
  open: boolean
}

const sectionIcons = {
  Navigate: LayoutGrid,
  Simulate: Boxes,
  Formula: Atom,
  Topic: BookOpen,
  Practice: FlaskConical,
} satisfies Record<CommandSection, typeof Atom>

function groupCommands(commands: CommandPaletteItem[]) {
  const encounteredSections = commands.reduce<CommandSection[]>((sections, command) => {
    if (!sections.includes(command.section)) sections.push(command.section)
    return sections
  }, [])

  return encounteredSections
    .map((section) => ({
      commands: commands.filter((command) => command.section === section),
      section,
    }))
    .filter((group) => group.commands.length > 0)
}

export function CommandPalette({ onClose, onNavigate, open }: CommandPaletteProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const previouslyFocusedElement = useRef<HTMLElement | null>(null)
  const results = useMemo(() => searchCommandPalette(query), [query])
  const groups = useMemo(() => groupCommands(results), [results])
  const displayedResults = useMemo(() => groups.flatMap((group) => group.commands), [groups])

  useEffect(() => {
    if (!open) return

    previouslyFocusedElement.current = document.activeElement as HTMLElement | null
    setQuery('')
    setActiveIndex(0)
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus())
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.cancelAnimationFrame(frame)
      document.body.style.overflow = previousOverflow
      previouslyFocusedElement.current?.focus()
    }
  }, [open])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  useEffect(() => {
    if (!open) return
    const activeCommand = displayedResults[activeIndex]
    if (!activeCommand) return
    document
      .getElementById(`command-result-${activeCommand.id}`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, displayedResults, open])

  if (!open) return null

  const chooseCommand = (command: CommandPaletteItem | undefined) => {
    if (!command) return
    onNavigate(command.href)
    onClose()
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (!displayedResults.length) return
      setActiveIndex((index) => (index + 1) % displayedResults.length)
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (!displayedResults.length) return
      setActiveIndex((index) => (index - 1 + displayedResults.length) % displayedResults.length)
      return
    }

    if (event.key === 'Enter' && document.activeElement === inputRef.current) {
      event.preventDefault()
      chooseCommand(displayedResults[activeIndex])
      return
    }

    if (event.key === 'Tab') {
      const focusableElements = panelRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), a[href]',
      )
      if (!focusableElements?.length) return

      const first = focusableElements[0]
      const last = focusableElements[focusableElements.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
  }

  let resultIndex = -1

  return (
    <div
      aria-label="Physics command palette"
      aria-modal="true"
      className="command-palette"
      onKeyDown={handleKeyDown}
      role="dialog"
    >
      <button
        aria-label="Close command palette"
        className="command-palette__backdrop"
        onClick={onClose}
        type="button"
      />

      <div className="command-palette__panel" ref={panelRef}>
        <header className="command-palette__header">
          <div>
            <p>Physics command center</p>
            <h2>Go anywhere. Find anything.</h2>
          </div>
          <button
            aria-label="Close command palette"
            className="command-palette__close"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" size={18} />
          </button>
        </header>

        <div className="command-palette__search">
          <Search aria-hidden="true" size={20} strokeWidth={1.7} />
          <label className="sr-only" htmlFor="command-palette-input">
            Search formulas, topics, simulations, and practice
          </label>
          <input
            aria-activedescendant={
              displayedResults[activeIndex]
                ? `command-result-${displayedResults[activeIndex].id}`
                : undefined
            }
            aria-controls="command-palette-results"
            aria-expanded="true"
            aria-autocomplete="list"
            autoComplete="off"
            id="command-palette-input"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try ‘kinetic energy’, ‘projectile’, or ‘F = ma’…"
            ref={inputRef}
            role="combobox"
            type="search"
            value={query}
          />
          <kbd>ESC</kbd>
        </div>

        <div
          aria-label={query.trim() ? 'Search results' : 'Suggested commands'}
          className="command-palette__results"
          id="command-palette-results"
          role="listbox"
        >
          {groups.length > 0 ? (
            groups.map((group) => {
              const Icon = sectionIcons[group.section]
              return (
                <section
                  aria-label={`${group.section} commands`}
                  className="command-group"
                  key={group.section}
                  role="group"
                >
                  <h3>
                    <Icon aria-hidden="true" size={13} />
                    {group.section}
                  </h3>
                  <div>
                    {group.commands.map((command) => {
                      resultIndex += 1
                      const commandIndex = resultIndex
                      return (
                        <button
                          aria-selected={commandIndex === activeIndex}
                          className={
                            commandIndex === activeIndex ? 'command-result is-active' : 'command-result'
                          }
                          id={`command-result-${command.id}`}
                          key={command.id}
                          onClick={() => chooseCommand(command)}
                          onMouseEnter={() => setActiveIndex(commandIndex)}
                          role="option"
                          type="button"
                        >
                          <span className="command-result__copy">
                            <strong>{command.label}</strong>
                            <small>{command.description}</small>
                          </span>
                          {command.meta && <code>{command.meta}</code>}
                          <ArrowRight aria-hidden="true" size={16} />
                        </button>
                      )
                    })}
                  </div>
                </section>
              )
            })
          ) : (
            <div className="command-palette__empty">
              <Atom aria-hidden="true" size={25} strokeWidth={1.5} />
              <strong>No matching physics command</strong>
              <span>Try a variable, equation, topic, or activity.</span>
            </div>
          )}
        </div>

        <footer className="command-palette__footer">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd>
            Navigate
          </span>
          <span>
            <kbd>↵</kbd>
            Open
          </span>
          <span className="command-palette__count">
            {displayedResults.length} {query.trim() ? 'matches' : 'shortcuts'}
          </span>
        </footer>
      </div>
    </div>
  )
}
