import {
  Atom,
  BookOpen,
  Boxes,
  ChevronRight,
  FlaskConical,
  Orbit,
  House,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { LabMark } from '../brand/LabMark'

const navigation = [
  { label: 'Home', path: '/', icon: House, end: true },
  { label: 'Explore', path: '/explore', icon: Orbit },
  { label: 'Formula Library', path: '/formulas', icon: BookOpen },
  { label: 'Simulations', path: '/simulations', icon: Boxes },
  { label: 'Practice', path: '/practice', icon: FlaskConical },
]

export function Sidebar() {
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

      <div className="sidebar__spacer" />

      <section className="system-card" aria-labelledby="system-card-title">
        <div className="system-card__heading">
          <Atom aria-hidden="true" size={16} strokeWidth={1.7} />
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

      <p className="build-label">Build 14 · Learning systems</p>
    </div>
  )
}
