/**
 * LoginModal — Heart-Themed Login Animation.
 * Fully functional Supabase authentication with a beating heart image
 * (heart-login.png) backdrop, interactive heartbeat acceleration on
 * focus/typing, and surge on submit.
 */
import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useAuth } from '../../hooks/useAuth.js'
import './AuthModal.css'

/* ------------------------------------------------------------------
   Beating Heart Image (heart-login.png) — Animated Backdrop
------------------------------------------------------------------ */
function AnatomicalHeartGraphic({ heartState }) {
  const beatClass =
    heartState === 'submitting'
      ? 'heart-beat--surge'
      : heartState === 'focused'
      ? 'heart-beat--fast'
      : 'heart-beat--idle'

  return (
    <div className="heart-svg-background" aria-hidden="true">
      <img
        src="/heart-login.png"
        alt=""
        className={`heart-anatomy-img ${beatClass}`}
      />
    </div>
  )
}

/* ------------------------------------------------------------------
   Main LoginModal Component
------------------------------------------------------------------ */
export default function LoginModal({ isOpen, onClose, onSwitchToSignup }) {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  // Cardiac pulse speed: 'idle' | 'focused' | 'submitting'
  const [heartState, setHeartState] = useState('idle')

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  // Body scroll lock with guaranteed restoration
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = ''
      return
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev || ''
    }
  }, [isOpen])

  // Reset state when closing
  useEffect(() => {
    if (!isOpen) {
      setEmail('')
      setPassword('')
      setFieldErrors({})
      setServerError('')
      setLoading(false)
      setShowPassword(false)
      setHeartState('idle')
    }
  }, [isOpen])

  // Validation
  const validate = () => {
    const errors = {}
    if (!email.trim()) errors.email = 'সঠিক ইমেইল ঠিকানা দিন'
    if (password.length < 6) errors.password = 'পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে'
    return errors
  }

  // Handle Form Submit with cardiac pulse surge
  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    const errors = validate()
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setHeartState('submitting')
    setLoading(true)

    const { error: authError } = await signIn({ email: email.trim(), password })
    setLoading(false)

    if (authError) {
      setHeartState('focused')
      const msg = authError.message || ''
      if (msg.includes('Invalid login credentials') || msg.includes('invalid')) {
        setServerError('ইমেইল বা পাসওয়ার্ড সঠিক নয়। আবার চেষ্টা করুন।')
      } else if (msg.includes('Email not confirmed')) {
        setServerError('ইমেইল নিশ্চিত করা হয়নি। ইনবক্স চেক করুন।')
      } else {
        setServerError(msg || 'লগইন করতে সমস্যা হয়েছে। কিছুক্ষণ পর চেষ্টা করুন।')
      }
    } else {
      setHeartState('idle')
      setEmail('')
      setPassword('')
      onClose()
    }
  }

  const handleFocus = useCallback(() => {
    if (heartState !== 'submitting') setHeartState('focused')
  }, [heartState])

  const handleBlur = useCallback(() => {
    if (heartState === 'focused' && !email && !password) setHeartState('idle')
  }, [heartState, email, password])

  if (!isOpen) return null

  return createPortal(
    <div className="heart-login-overlay" onClick={onClose}>
      <div className="heart-login-scene" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          className="heart-close-btn"
          onClick={onClose}
          aria-label="লগইন বন্ধ করুন"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Beating Heart Image (Backdrop Layer) */}
        <AnatomicalHeartGraphic heartState={heartState} />

        {/* Login Form Panel (Document Flow Layer inside the Heart) */}
        <div className="heart-form-panel">
          {/* Badge */}
          <div className="heart-form-badge">
            <span className="heart-ecg-dot" />
            <span>HSC BIOLOGY • মানব হৃদপিণ্ড</span>
          </div>

          {/* Title */}
          <h2 className="heart-form-title">
            <span className="heart-form-title__bn">লগইন করুন</span>
            <span className="heart-form-title__en">Sign In</span>
          </h2>

          {/* Server Error Alert */}
          {serverError && (
            <div className="heart-error-msg" role="alert">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{serverError}</span>
            </div>
          )}

          {/* Form */}
          <form className="heart-form" onSubmit={handleSubmit} noValidate>
            {/* Email Field */}
            <div className="heart-field">
              <label className="heart-field__label" htmlFor="login-email">
                ইমেইল (Email)
              </label>
              <div className="heart-field__input-wrap">
                <svg className="heart-field__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  id="login-email"
                  type="email"
                  className={`heart-field__input${fieldErrors.email ? ' has-error' : ''}`}
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setFieldErrors((prev) => ({ ...prev, email: '' }))
                    if (heartState === 'idle') setHeartState('focused')
                  }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  autoComplete="email"
                  autoFocus
                />
              </div>
              {fieldErrors.email && <span className="heart-field__error">{fieldErrors.email}</span>}
            </div>

            {/* Password Field */}
            <div className="heart-field">
              <label className="heart-field__label" htmlFor="login-password">
                পাসওয়ার্ড (Password)
              </label>
              <div className="heart-field__input-wrap">
                <svg className="heart-field__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className={`heart-field__input${fieldErrors.password ? ' has-error' : ''}`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setFieldErrors((prev) => ({ ...prev, password: '' }))
                    if (heartState === 'idle') setHeartState('focused')
                  }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="heart-field__toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'পাসওয়ার্ড লুকাও' : 'পাসওয়ার্ড দেখাও'}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {fieldErrors.password && <span className="heart-field__error">{fieldErrors.password}</span>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`heart-submit${loading ? ' heart-submit--loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="heart-submit__spinner" />
                  <span>যাচাই করা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <img
                    src="/heart-login.png"
                    alt="হৃদপিণ্ড"
                    className="heart-submit__icon"
                  />
                  <span>লগইন করুন • Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Switch to Signup */}
          <div className="heart-switch">
            অ্যাকাউন্ট নেই?{' '}
            <button type="button" onClick={onSwitchToSignup}>
              এখানে অ্যাকাউন্ট তৈরি করো
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
