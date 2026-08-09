import { useEffect, useState } from 'react'
import { Menu, Search, X } from 'lucide-react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'

const pageNames: Record<string, string> = {
  '/': 'Workspace',
  '/explore': 'Explore',
  '/formulas': 'Formula Library',
  '/simulations': 'Simulations',
  '/practice': 'Practice',
}

export function AppShell() {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false)
  const location = useLocation()
  const pageName = pageNames[location.pathname] ?? 'Workspace'

  useEffect(() => {
    setIsNavigationOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!isNavigationOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsNavigationOpen(false)
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isNavigationOpen])

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
            aria-label="Search is coming in the Formula Library build"
            title="Search arrives with the Formula Library"
          >
            <Search aria-hidden="true" size={16} strokeWidth={1.8} />
            <span>Search physics</span>
            <kbd>⌘ K</kbd>
          </button>
          <div className="scope-badge" aria-label="Current curriculum scope">
            <span className="scope-badge__pulse" aria-hidden="true" />
            Mechanics · V1
          </div>
        </div>
      </header>

      <main className="main-workspace" id="main-content" tabIndex={-1}>
        <Outlet />
      </main>

      {isNavigationOpen && (
        <div className="mobile-navigation" role="dialog" aria-modal="true" aria-label="Navigation">
          <button
            className="mobile-navigation__backdrop"
            aria-label="Close navigation"
            onClick={() => setIsNavigationOpen(false)}
            type="button"
          />
          <aside className="mobile-navigation__panel">
            <button
              aria-label="Close navigation"
              className="icon-button mobile-navigation__close"
              onClick={() => setIsNavigationOpen(false)}
              type="button"
            >
              <X size={19} strokeWidth={1.8} />
            </button>
            <Sidebar />
          </aside>
        </div>
      )}
    </div>
  )
}

