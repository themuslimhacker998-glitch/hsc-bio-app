import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle.jsx'
import './Header.css'

export default function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="site-header__brand" aria-label="হোম">
          <svg width="30" height="30" viewBox="0 0 64 64" aria-hidden="true">
            <rect width="64" height="64" rx="14" fill="var(--ink)" />
            <circle cx="32" cy="32" r="18" fill="none" stroke="var(--bg)" strokeWidth="2.5" />
            <circle cx="32" cy="32" r="6" fill="var(--accent-eosin)" />
            <circle cx="22" cy="24" r="2.6" fill="var(--bg)" />
            <circle cx="43" cy="27" r="2.2" fill="var(--bg)" />
            <circle cx="24" cy="42" r="2.2" fill="var(--bg)" />
          </svg>
          <span className="site-header__wordmark">
            জীববিজ্ঞান
            <span className="site-header__wordmark-sub">HSC • বাংলাদেশ</span>
          </span>
        </Link>
        <div className="site-header__actions">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
