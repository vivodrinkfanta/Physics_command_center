import {
  BookOpen,
  Boxes,
  ChevronRight,
  FlaskConical,
  Orbit,
  House,
} from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
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

export function Sidebar() {
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
    <div className="sidebar">
      <NavLink className="brand" to="/" aria-label="Physics Lab workspace">
        <LabMark />
        <span className="brand__copy">
          <strong>Physics Lab</strong>
          <small>Command Center</small>
        </span>
      </NavLink>

      <nav className="primary-nav" aria-label="Workspace sections">
        <p className="nav-label">Laboratory</p>
        <ul>
          {navigation.map(({ end, icon: Icon, label, path }) => (
            <li key={path}>
              <NavLink
                className={({ isActive }) => `nav-item${isActive ? ' nav-item--active' : ''}`}
                end={end}
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
                  className={`unit-nav__item${isActive ? ' unit-nav__item--active' : ''}`}
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

      <section className="system-card" aria-labelledby="system-card-title">
        <div className="system-card__heading">
          <Orbit aria-hidden="true" size={16} strokeWidth={1.7} />
          <span id="system-card-title">System</span>
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

      <p className="build-label">Build 16 · Core system</p>
    </div>
  )
}
