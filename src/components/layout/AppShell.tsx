import { useCallback, useEffect, useRef, useState } from 'react'
import { Menu, Search, X } from 'lucide-react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { mechanicsFormulas } from '../../data/formulas'
import { Sidebar } from './Sidebar'

const pageNames: Record<string, string> = {
  '/': 'Home',
  '/explore': 'Explore',
  '/formulas': 'Formula Library',
  '/simulations': 'Simulations',
  '/practice': 'Practice',
}

export function AppShell() {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false)
  const hasMounted = useRef(false)
  const location = useLocation()
  const navigate = useNavigate()
  const selectedFormula = mechanicsFormulas.find(
    (formula) => `/formulas/${formula.id}` === location.pathname,
  )
  const pageName =
    pageNames[location.pathname] ??
    selectedFormula?.name ??
    (location.pathname.startsWith('/formulas/') ? 'Formula Inspector' : 'Workspace')

  const openHomepageSearch = useCallback(() => {
    if (location.pathname === '/') {
      window.dispatchEvent(new Event('physics-lab:focus-search'))
      return
    }

    navigate('/?focus=search')
  }, [location.pathname, navigate])

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
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        openHomepageSearch()
      }
    }

    window.addEventListener('keydown', handleSearchShortcut)
    return () => window.removeEventListener('keydown', handleSearchShortcut)
  }, [openHomepageSearch])

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
            aria-label="Open homepage physics search"
            onClick={openHomepageSearch}
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
        <p aria-live="polite" className="route-announcer">
          {pageName}
        </p>
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
