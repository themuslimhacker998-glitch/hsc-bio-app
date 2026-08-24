import { useState, useCallback, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import Sidebar from './Sidebar.jsx'
import LoginModal from '../auth/LoginModal.jsx'
import SignupModal from '../auth/SignupModal.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import './Layout.css'

const AUTO_PROMPT_KEY = 'hsc-biology-login-prompted'

export default function Layout({ children }) {
  const location = useLocation()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)

  const openLogin = useCallback(() => {
    setShowSignup(false)
    setShowLogin(true)
  }, [])

  const openSignup = useCallback(() => {
    setShowLogin(false)
    setShowSignup(true)
  }, [])

  const closeAuth = useCallback(() => {
    setShowLogin(false)
    setShowSignup(false)
  }, [])

  // Auto-popup login modal once after a few seconds of browsing, if not authenticated
  const promptedRef = useRef(false)
  useEffect(() => {
    if (authLoading || isAuthenticated || promptedRef.current) return

    // Check if already prompted this session
    try {
      if (sessionStorage.getItem(AUTO_PROMPT_KEY)) return
    } catch { /* ignore */ }

    const timer = setTimeout(() => {
      // Double-check: still not authenticated and not already showing a modal
      if (!isAuthenticated && !showLogin && !showSignup) {
        promptedRef.current = true
        try { sessionStorage.setItem(AUTO_PROMPT_KEY, '1') } catch { /* ignore */ }
        setShowLogin(true)
      }
    }, 5000)

    return () => clearTimeout(timer)
  }, [authLoading, isAuthenticated, showLogin, showSignup])

  return (
    <div className="app-shell">
      <div
        className={`sidebar-backdrop${sidebarOpen ? ' is-visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-label="Close sidebar"
      />

      <Sidebar
        open={sidebarOpen}
        onNavigate={() => setSidebarOpen(false)}
        onOpenLogin={openLogin}
        onOpenSignup={openSignup}
      />

      <div className={`app-content${sidebarOpen ? ' sidebar-push' : ''}`}>
        <Header
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((open) => !open)}
        />
        <main className="app-main fade-in" key={location.pathname}>
          {children}
        </main>
        <Footer />
      </div>

      <LoginModal
        isOpen={showLogin}
        onClose={closeAuth}
        onSwitchToSignup={openSignup}
      />
      <SignupModal
        isOpen={showSignup}
        onClose={closeAuth}
        onSwitchToLogin={openLogin}
      />
    </div>
  )
}
