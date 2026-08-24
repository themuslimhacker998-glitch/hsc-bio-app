import ThemeToggle from './ThemeToggle.jsx'
import './Header.css'

export default function Header({ sidebarOpen, onToggleSidebar }) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        {/* Left: hamburger toggle — always visible */}
        <button
          type="button"
          className={`sidebar-toggle${sidebarOpen ? ' is-active' : ''}`}
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          aria-expanded={sidebarOpen}
        >
          <svg className="sidebar-toggle__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line className="sidebar-toggle__line sidebar-toggle__line--top" x1="4" y1="6" x2="20" y2="6" />
            <line className="sidebar-toggle__line sidebar-toggle__line--mid" x1="4" y1="12" x2="20" y2="12" />
            <line className="sidebar-toggle__line sidebar-toggle__line--bot" x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>

        {/* Spacer to keep hamburger left, actions right */}
        <div className="site-header__spacer" />

        {/* Right: theme only */}
        <div className="site-header__actions">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
