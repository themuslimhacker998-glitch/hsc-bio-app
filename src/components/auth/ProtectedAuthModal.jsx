import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import './AuthModal.css'

export default function ProtectedAuthModal({ isOpen, onClose, onLogin, onSignup }) {
  // Escape key handler
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  // Body scroll lock
  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-card" onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
        <button className="auth-card__close" onClick={onClose} aria-label="Close" type="button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <div className="auth-card__header">
          <div className="auth-card__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2 className="auth-card__title">সাইন ইন দরকার</h2>
          <p className="auth-card__subtitle">এই ফিচারটি ব্যবহার করতে সাইন ইন বা অ্যাকাউন্ট তৈরি করো।</p>
        </div>

        <div className="auth-form" style={{ gap: '10px' }}>
          <button type="button" className="auth-submit" onClick={onLogin}>সাইন ইন</button>
          <button type="button" className="auth-submit" onClick={onSignup} style={{ background: 'var(--surface)', color: 'var(--accent-chlorophyll)', border: '1px solid var(--accent-chlorophyll)' }}>অ্যাকাউন্ট তৈরি করো</button>
          <button type="button" className="auth-submit" onClick={onClose} style={{ background: 'var(--surface)', color: 'var(--ink-faint)', border: '1px solid var(--line)' }}>বাতিল</button>
        </div>
      </div>
    </div>,
    document.body
  )
}
