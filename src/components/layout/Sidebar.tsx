import {
  BookOpen,
  Boxes,
  ChevronRight,
  FlaskConical,
  Orbit,
  House,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { useId } from 'react'
import { LabMark } from '../brand/LabMark'
import { topicIcons } from '../explore/topicIcons'
import { findFormulaById } from '../../data/formulas'
import { mechanicsTopics } from '../../data/topics'

const navigation = [
  { label: 'Home', path: '/', icon: House, end: true },
  { label: 'Explore', path: '/explore', icon: Orbit },
  { label: 'Formula Library', path: '/formulas', icon: BookOpen },
  { label: 'Simulations', path: '/simulations', icon: Boxes },
  { label: 'Practice', path: '/practice', icon: FlaskConical },
]

interface SidebarProps {
  collapsed?: boolean
  onToggleCollapsed?: () => void
}

export function Sidebar({ collapsed = false, onToggleCollapsed }: SidebarProps) {
  const systemCardTitleId = useId()
  const location = useLocation()
  const selectedTopicId = new URLSearchParams(location.search).get('topic')
  const selectedFormula = location.pathname.startsWith('/formulas/')
    ? findFormulaById(location.pathname.slice('/formulas/'.length))
    : undefined
  const activeTopicId =
    (location.pathname === '/explore' && selectedTopicId) ||
    mechanicsTopics.find((topic) =>
      selectedFormula ? topic.formulaIds.includes(selectedFormula.id) : false,
    )?.id

  return (
    <div className={`sidebar${collapsed ? ' sidebar--collapsed' : ''}`}>
      <NavLink
        className="brand"
        title={collapsed ? 'Physics Lab home' : undefined}
        to="/"
        aria-label="Physics Lab workspace"
      >
        <LabMark />
        <span className="brand__copy">
          <strong>Physics Lab</strong>
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

      <nav className="unit-nav" aria-label="Mechanics units">
        <p className="nav-label">Mechanics units</p>
        <ol>
          {mechanicsTopics.map((topic) => {
            const Icon = topicIcons[topic.icon]
            const isActive = activeTopicId === topic.id
            return (
              <li key={topic.id}>
                <NavLink
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={`Unit ${topic.sequence}: ${topic.name}`}
                  className={`unit-nav__item${isActive ? ' unit-nav__item--active' : ''}`}
                  title={collapsed ? `Unit ${topic.sequence}: ${topic.name}` : undefined}
                  to={`/explore?topic=${topic.id}`}
                >
                  <span>{String(topic.sequence).padStart(2, '0')}</span>
                  <Icon aria-hidden="true" size={14} strokeWidth={1.7} />
                  <strong>{topic.name}</strong>
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
          <strong>Mechanics</strong>
        </div>
        <div className="system-card__reading">
          <span>Status</span>
          <strong className="status-online">Shell online</strong>
        </div>
      </section>

      <p className="build-label">Build 17 · Complete mechanics shell</p>
    </div>
  )
}
