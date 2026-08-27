import ThemeToggle from './ThemeToggle.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import './Header.css'

export default function Header({ sidebarOpen, onToggleSidebar, onOpenLogin, onOpenSignup }) {
  const { isAuthenticated, getDisplayName, getAvatarUrl, signOut } = useAuth()
  const displayName = getDisplayName()

  const getInitial = () => {
    if (displayName) return displayName.charAt(0).toUpperCase()
    return 'U'
  }

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

        {/* Brand in Header */}
        <div className="site-header__brand">
          <span className="site-header__brand-title">জীববিজ্ঞান</span>
          <span className="site-header__brand-badge">HSC Bio</span>
        </div>

        {/* Spacer */}
        <div className="site-header__spacer" />

        {/* Right actions */}
        <div className="site-header__actions">
          {isAuthenticated ? (
            <div className="header-user">
              <div className="header-user__avatar">
                {getAvatarUrl() ? (
                  <img src={getAvatarUrl()} alt={displayName} />
                ) : (
                  getInitial()
                )}
              </div>
              <span className="header-user__name">{displayName}</span>
              <button
                type="button"
                className="header-auth-btn header-auth-btn--logout"
                onClick={() => signOut()}
                title="সাইন আউট"
              >
                সাইন আউট
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="header-auth-btn header-auth-btn--login"
              onClick={onOpenLogin}
              title="লগইন করুন"
            >
              <img
                src="/heart-login.png"
                alt="হৃদপিণ্ড"
                className="header-heart-icon"
              />
              <span>লগইন</span>
            </button>
          )}

          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

