import {
  BookOpen,
  Boxes,
  ChevronRight,
  FlaskConical,
  Orbit,
  House,
  Map,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { useId } from 'react'
import { LabMark } from '../brand/LabMark'
import { findFormulaById } from '../../data/formulas'
import { activeCurriculumTopics } from '../../utils/curriculum'

const navigation = [
  { label: 'Home', path: '/', icon: House, end: true },
  { label: 'IB Study Map', path: '/curriculum', icon: Map },
  { label: 'Formula Library', path: '/formulas', icon: BookOpen },
  { label: 'Simulations', path: '/simulations', icon: Boxes },
  { label: 'Practice', path: '/practice', icon: FlaskConical },
  { label: 'Mechanics Atlas', path: '/explore', icon: Orbit },
]

interface SidebarProps {
  collapsed?: boolean
  onToggleCollapsed?: () => void
}

export function Sidebar({ collapsed = false, onToggleCollapsed }: SidebarProps) {
  const systemCardTitleId = useId()
  const location = useLocation()
  const selectedFormula = location.pathname.startsWith('/formulas/')
    ? findFormulaById(location.pathname.slice('/formulas/'.length))
    : undefined
  const activeTopic = activeCurriculumTopics.find((topic) =>
    location.pathname === `/curriculum/${topic.slug}` ||
    (selectedFormula ? topic.formulaIds.includes(selectedFormula.id) : false),
  )

  return (
    <div className={`sidebar${collapsed ? ' sidebar--collapsed' : ''}`}>
      <NavLink
        className="brand"
        title={collapsed ? 'Physics Center home' : undefined}
        to="/"
        aria-label="Physics Center workspace"
      >
        <LabMark />
        <span className="brand__copy">
          <strong>Physics Center</strong>
          <small>Command Center</small>
        </span>
      </NavLink>

      {onToggleCollapsed && (
        <button
          aria-controls="desktop-primary-sidebar"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-pressed={collapsed}
          className="sidebar-toggle"
          onClick={onToggleCollapsed}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          type="button"
        >
          {collapsed ? (
            <PanelLeftOpen aria-hidden="true" size={16} />
          ) : (
            <PanelLeftClose aria-hidden="true" size={16} />
          )}
          <span>{collapsed ? 'Expand' : 'Collapse sidebar'}</span>
        </button>
      )}

      <nav className="primary-nav" aria-label="Workspace sections">
        <p className="nav-label">Laboratory</p>
        <ul>
          {navigation.map(({ end, icon: Icon, label, path }) => (
            <li key={path}>
              <NavLink
                aria-label={label}
                className={({ isActive }) => `nav-item${isActive ? ' nav-item--active' : ''}`}
                end={end}
                title={collapsed ? label : undefined}
                to={path}
              >
                <Icon aria-hidden="true" size={18} strokeWidth={1.7} />
                <span>{label}</span>
                <ChevronRight className="nav-item__chevron" aria-hidden="true" size={14} />
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <nav className="unit-nav" aria-label="IB modules with current coverage">
        <p className="nav-label">IB modules online</p>
        <ol>
          {activeCurriculumTopics.map((topic) => {
            const isActive = activeTopic?.code === topic.code
            return (
              <li key={topic.code}>
                <NavLink
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={`${topic.code}: ${topic.title}`}
                  className={`unit-nav__item${isActive ? ' unit-nav__item--active' : ''}`}
                  title={collapsed ? `${topic.code}: ${topic.title}` : undefined}
                  to={`/curriculum/${topic.slug}`}
                >
                  <span>{topic.code}</span>
                  <BookOpen aria-hidden="true" size={14} strokeWidth={1.7} />
                  <strong>{topic.title}</strong>
                </NavLink>
              </li>
            )
          })}
        </ol>
      </nav>

      <div className="sidebar__spacer" />

      <section className="system-card" aria-labelledby={systemCardTitleId}>
        <div className="system-card__heading">
          <Orbit aria-hidden="true" size={16} strokeWidth={1.7} />
          <span id={systemCardTitleId}>System</span>
        </div>
        <div className="system-card__reading">
          <span>Environment</span>
          <strong>IB aligned</strong>
        </div>
        <div className="system-card__reading">
          <span>Status</span>
          <strong className="status-online">Shell online</strong>
        </div>
      </section>

      <p className="build-label">Build 18 · IB syllabus pathway</p>
    </div>
  )
}
