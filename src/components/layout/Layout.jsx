import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import Sidebar from './Sidebar.jsx'
import './Layout.css'

export default function Layout({ children }) {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-shell">
      <button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen((open) => !open)}
        aria-label={sidebarOpen ? 'ড্যাশবোর্ড বন্ধ করুন' : 'ড্যাশবোর্ড খুলুন'}
        aria-expanded={sidebarOpen}
      >
        <span></span><span></span><span></span>
      </button>
      <div className={`sidebar-backdrop${sidebarOpen ? ' is-visible' : ''}`} onClick={() => setSidebarOpen(false)} />
      <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
      <div className="app-content">
        <Header />
        <main className="app-main fade-in" key={location.pathname}>
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}
