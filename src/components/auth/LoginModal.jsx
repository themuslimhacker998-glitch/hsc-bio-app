/**
 * LoginModal — renders login form via React Portal to document.body.
 * Visibility is controlled by parent: if !isOpen → null (not mounted),
 * if isOpen → mounted and always visible (no CSS hidden state needed).
 */
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useAuth } from '../../hooks/useAuth.js'
import './AuthModal.css'

export default function LoginModal({ isOpen, onClose, onSwitchToSignup }) {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      setEmail('')
      setPassword('')
      setFieldErrors({})
      setServerError('')
      setLoading(false)
      setShowPassword(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  const validate = () => {
    const errors = {}
    if (!email.trim()) errors.email = 'সঠিক ইমেইল লেখো'
    if (password.length < 6) errors.password = 'পাসওয়র্ড অন্তত ৬ অক্ষর হতে হবে'
    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    const errors = validate()
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setLoading(true)
    const { error: authError } = await signIn({ email: email.trim(), password })
    setLoading(false)

    if (authError) {
      const msg = authError.message
      if (msg.includes('Invalid login credentials') || msg.includes('invalid')) {
        setServerError('ইমেইল বা পাসওয়র্ড সঠিক নয়। আবার চেষ্টা করো।')
      } else if (msg.includes('Email not confirmed')) {
        setServerError('ইমেইল নিশ্চিত হয়নি। ইনবক্সে চেক করো।')
      } else {
        setServerError(msg || 'কিছু সমস্যা হয়েছে। পরে চেষ্টা করো।')
      }
    } else {
      setEmail('')
      setPassword('')
      onClose()
    }
  }

  return createPortal(
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-card" onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
        <button className="auth-card__close" onClick={onClose} aria-label="Close" type="button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <div className="auth-card__header">
          <div className="auth-card__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </div>
          <h2 className="auth-card__title">লগইন</h2>
          <p className="auth-card__subtitle">তোমার অ্যাকাউন্টে প্রবেশ করো</p>
        </div>

        {serverError && <div className="auth-error">{serverError}</div>}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label className="auth-field__label" htmlFor="login-email">ইমেইল</label>
            <input
              id="login-email"
              type="email"
              className={`auth-field__input${fieldErrors.email ? ' has-error' : ''}`}
              placeholder="ইমেইল"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setFieldErrors(prev => ({ ...prev, email: '' })) }}
              autoComplete="email"
              autoFocus
            />
            {fieldErrors.email && <span className="auth-field__error">{fieldErrors.email}</span>}
          </div>
          <div className="auth-field">
            <label className="auth-field__label" htmlFor="login-password">পাসওয়র্ড</label>
            <div className="auth-field__input-wrap">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className={`auth-field__input${fieldErrors.password ? ' has-error' : ''}`}
                placeholder="পাসওয়র্ড"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setFieldErrors(prev => ({ ...prev, password: '' })) }}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="auth-field__toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'পাসওয়র্ড লুকাও' : 'পাসওয়র্ড দেখাও'}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {fieldErrors.password && <span className="auth-field__error">{fieldErrors.password}</span>}
          </div>
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? <span className="auth-submit__spinner" /> : 'লগইন'}
          </button>
        </form>

        <div className="auth-switch">
          অ্যাকাউন্ট নেই?{' '}
          <button type="button" onClick={onSwitchToSignup}>এখানে তৈরি করো</button>
        </div>
      </div>
    </div>,
    document.body
  )
}
