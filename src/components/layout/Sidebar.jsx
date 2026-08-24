import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import './Sidebar.css'

function Icon({type}) {
  const icons = {
    home: ['M3 10.5 12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-5v-6h-5v6h-5A1.5 1.5 0 0 1 3 19.5z'],
    leaf: ['M19.5 4.5C12 4.8 6.1 7.5 5 12.5c-.8 3.8 2 6 5.1 5.7 5.2-.4 7.9-5.4 9.4-13.7Z'],
    cube: ['M21 16.5V7.5L12 2 3 7.5v9L12 22l9-5.5zM3 7.5L12 12m0 0v10m0-10l9-4.5'],
    play: ['M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z'],
    book1: [
      'M6 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6V3z',
      'M9 3v18',
      'M17 8h-4M17 12h-3',
      {d: 'M20.5 5.5a2 2 0 0 1-2 2 2 2 0 0 1-2-2 2 2 0 0 1 2-2 2 2 0 0 1 2 2z', fill: 'currentColor'},
      'M16.3 4.2l.7.8.7-.8'
    ],
    book2: [
      'M6 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6V3z',
      'M9 3v18',
      'M17 8h-4M17 12h-3',
      {d: 'M20.5 5.5a2 2 0 0 1-2 2 2 2 0 0 1-2-2 2 2 0 0 1 2-2 2 2 0 0 1 2 2z', fill: 'currentColor'},
      'M15.8 4.3c.4-.3 1.1-.5 1.7-.1.3.2.5.5.5.8.1.5-.3 1-1 1.2l-1.7.6M15 6l1.2 1.4'
    ]
  }
  const paths = icons[type]
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths.map((p, i) => {
        if (typeof p === 'object') {
          return <path key={i} d={p.d} fill={p.fill || 'none'} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        }
        return <path key={i} d={p} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      })}
    </svg>
  )
}

function Item({to, icon, children, end = false, onClick}) {
  return (
    <NavLink to={to} end={end} onClick={onClick} className={({isActive}) => `sidebar__nav-item${isActive ? ' is-active' : ''}`}>
      <Icon type={icon} />
      <span>{children}</span>
    </NavLink>
  )
}

export default function Sidebar({open = false, onNavigate = () => {}, onOpenLogin = () => {}, onOpenSignup = () => {}}) {
  const { user, signOut, isAuthenticated, getDisplayName, getUsername, getAvatarUrl } = useAuth()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleSignOut = async () => {
    setLoggingOut(true)
    await signOut()
    setLoggingOut(false)
  }

  const displayName = getDisplayName()
  const username = getUsername()

  const getInitial = () => {
    if (displayName) return displayName.charAt(0).toUpperCase()
    return '?'
  }

  return (
    <aside
      className={`sidebar${open ? ' is-open' : ''}`}
      aria-label="Dashboard"
    >
      {/* Brand / logo — top of sidebar */}
      <div className="sidebar__brand">
        <div className="sidebar__brand-mark">
          <img src="/logo.jpg" alt="জীববিজ্ঞান" style={{ width: '100%', height: '100%', borderRadius: 'inherit', objectFit: 'cover' }} />
        </div>
        <div className="sidebar__brand-text">
          <strong>জীববিজ্ঞান</strong>
          <span>HSC • বাংলাদেশ</span>
        </div>
      </div>

      <div className="sidebar__section-label">ড্যাশবোর্ড</div>

      <nav className="sidebar__nav">
        <Item to="/" end icon="home" onClick={onNavigate}>হোম</Item>
        <Item to="/paper/1" icon="book1" onClick={onNavigate}>জীববিজ্ঞান ১ম পত্র</Item>
        <Item to="/paper/2" icon="book2" onClick={onNavigate}>জীববিজ্ঞান ২য় পত্র</Item>
        <Item to="/explore-3d" icon="cube" onClick={onNavigate}>এক্সপ্লোর</Item>
        <Item to="/animations" icon="play" onClick={onNavigate}>অ্যানিমেশন</Item>
      </nav>

      {/* Account section — margin-top:auto pushes it (and footer below) to the bottom */}
      <div className="sidebar__account">
        {isAuthenticated ? (
          <>
            <div className="sidebar__account-avatar sidebar__account-avatar--authenticated">
              {getAvatarUrl() ? (
                <img src={getAvatarUrl()} alt="" style={{ width: '100%', height: '100%', borderRadius: 'inherit', objectFit: 'cover' }} />
              ) : (
                getInitial()
              )}
            </div>
            <div className="sidebar__account-info">
              <span className="sidebar__account-name">{displayName}</span>
              {username && <span className="sidebar__account-role">@{username}</span>}
              {!username && <span className="sidebar__account-role">{user?.email}</span>}
            </div>
            <div className="sidebar__account-actions">
              <button
                className="sidebar__account-action sidebar__account-action--settings"
                aria-label="Account Settings"
                title="Account Settings"
                type="button"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </button>
              <button
                className="sidebar__account-action"
                onClick={handleSignOut}
                disabled={loggingOut}
                aria-label="সাইন আউট করুন"
                type="button"
              >
                {loggingOut ? '...' : 'সাইন আউট'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="sidebar__account-avatar">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="1.7" />
                <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </div>
            <div className="sidebar__account-info">
              <span className="sidebar__account-name">অতিথি</span>
              <span className="sidebar__account-role">ব্যবহারকারী</span>
            </div>
            <button
              className="sidebar__account-action"
              onClick={() => onOpenLogin()}
              aria-label="সাইন ইন করুন"
              type="button"
            >
              সাইন ইন
            </button>
          </>
        )}
      </div>

      {/* Footer — always below account, at the absolute bottom */}
      <div className="sidebar__footer">প্রতিটি অধ্যায়ে থাকবে নোট • 3D • অ্যানিমেশন</div>
    </aside>
  )
}
