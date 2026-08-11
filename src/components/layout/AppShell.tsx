import { useEffect, useRef, useState } from 'react'
import { Menu, Search, X } from 'lucide-react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { findFormulaById } from '../../data/formulas'
import { useModalDialog } from '../../hooks/useModalDialog'
import { isPhysicsSearchShortcut } from '../../utils/shortcuts'
import { CommandPalette } from './CommandPalette'
import { ScopeMenu } from './ScopeMenu'
import { Sidebar } from './Sidebar'

const pageNames: Record<string, string> = {
  '/': 'Home',
  '/explore': 'Explore',
  '/formulas': 'Formula Library',
  '/simulations': 'Simulations',
  '/practice': 'Practice',
}

export function AppShell() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [isNavigationOpen, setIsNavigationOpen] = useState(false)
  const hasMounted = useRef(false)
  const mobileNavigationCloseRef = useRef<HTMLButtonElement>(null)
  const {
    handleDialogKeyDown: handleNavigationKeyDown,
    rootRef: mobileNavigationRef,
  } = useModalDialog<HTMLDivElement>(
    isNavigationOpen,
    () => setIsNavigationOpen(false),
    () => mobileNavigationCloseRef.current,
  )
  const location = useLocation()
  const navigate = useNavigate()
  const selectedFormula = location.pathname.startsWith('/formulas/')
    ? findFormulaById(location.pathname.slice('/formulas/'.length))
    : undefined
  const pageName =
    pageNames[location.pathname] ??
    selectedFormula?.name ??
    (location.pathname.startsWith('/formulas/') ? 'Formula Inspector' : 'Workspace')

  useEffect(() => {
    setIsNavigationOpen(false)
    document.title =
      location.pathname === '/'
        ? 'Physics Lab · Interactive Mechanics'
        : `${pageName} · Physics Lab`

    if (hasMounted.current) document.getElementById('main-content')?.focus()
    else hasMounted.current = true
  }, [location.pathname, pageName])

  useEffect(() => {
    const handleSearchShortcut = (event: KeyboardEvent) => {
      if (isPhysicsSearchShortcut(event)) {
        event.preventDefault()
        setIsNavigationOpen(false)
        setIsCommandPaletteOpen(true)
      }
    }

    window.addEventListener('keydown', handleSearchShortcut)
    return () => window.removeEventListener('keydown', handleSearchShortcut)
  }, [])

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <aside className="desktop-sidebar" aria-label="Primary navigation">
        <Sidebar />
      </aside>

      <header className="topbar">
        <div className="topbar__leading">
          <button
            aria-expanded={isNavigationOpen}
            aria-label="Open navigation"
            className="icon-button mobile-menu-button"
            onClick={() => setIsNavigationOpen(true)}
            type="button"
          >
            <Menu size={19} strokeWidth={1.8} />
          </button>

          <div className="breadcrumb" aria-label="Current location">
            <span>Physics Lab</span>
            <span className="breadcrumb__separator" aria-hidden="true">
              /
            </span>
            <strong>{pageName}</strong>
          </div>
        </div>

        <div className="topbar__actions">
          <button
            className="search-trigger"
            type="button"
            aria-expanded={isCommandPaletteOpen}
            aria-haspopup="dialog"
            aria-label="Open command palette. Keyboard shortcuts Command or Control K and F."
            onClick={() => {
              setIsNavigationOpen(false)
              setIsCommandPaletteOpen(true)
            }}
          >
            <Search aria-hidden="true" size={16} strokeWidth={1.8} />
            <span>Search physics</span>
            <kbd>⌘ K / F</kbd>
          </button>
          <ScopeMenu />
        </div>
      </header>

      <main className="main-workspace" id="main-content" tabIndex={-1}>
        <p aria-live="polite" className="route-announcer">
          {pageName}
        </p>
        <Outlet />
      </main>

      {isNavigationOpen && (
        <div
          aria-label="Navigation"
          aria-modal="true"
          className="mobile-navigation"
          onKeyDown={handleNavigationKeyDown}
          ref={mobileNavigationRef}
          role="dialog"
        >
          <button
            className="mobile-navigation__backdrop"
            aria-label="Close navigation"
            onClick={() => setIsNavigationOpen(false)}
            tabIndex={-1}
            type="button"
          />
          <aside className="mobile-navigation__panel">
            <button
              aria-label="Close navigation"
              className="icon-button mobile-navigation__close"
              onClick={() => setIsNavigationOpen(false)}
              ref={mobileNavigationCloseRef}
              type="button"
            >
              <X size={19} strokeWidth={1.8} />
            </button>
            <Sidebar />
          </aside>
        </div>
      )}

      <CommandPalette
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={navigate}
        open={isCommandPaletteOpen}
      />
    </div>
  )
}
