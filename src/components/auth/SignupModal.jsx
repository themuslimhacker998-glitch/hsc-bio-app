import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useAuth } from '../../hooks/useAuth.js'
import './AuthModal.css'

export default function SignupModal({ isOpen, onClose, onSwitchToLogin }) {
  const { signUp } = useAuth()
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  // Body scroll lock when open
  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [isOpen])

  // Reset state when closing
  useEffect(() => {
    if (!isOpen) {
      setFullName('')
      setUsername('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setFieldErrors({})
      setServerError('')
      setSuccess(false)
      setLoading(false)
      setShowPassword(false)
      setShowConfirm(false)
    }
  }, [isOpen])

  const validate = () => {
    const errors = {}
    if (!fullName.trim()) errors.fullName = 'নাম লেখো'
    if (!username.trim()) errors.username = 'ইউজারনেম লেখো'
    else if (username.trim().length < 3) errors.username = 'ইউজারনেম কমপক্ষে ৩ অক্ষর হতে হবে'
    else if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) errors.username = 'ইউজারনেমে শুধু a-z, 0-9, _ থাকতে পারে'
    if (!email.trim()) errors.email = 'সঠিক ইমেইল লেখো'
    if (password.length < 6) errors.password = 'পাসওয়র্ড কমপক্ষে ৬ অক্ষর হতে হবে'
    if (password !== confirmPassword) errors.confirmPassword = 'পাসওয়র্ড মিলছে না'
    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    setSuccess(false)

    const errors = validate()
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setLoading(true)
    const { error: authError } = await signUp({
      fullName: fullName.trim(),
      username: username.trim(),
      email: email.trim(),
      password,
    })
    setLoading(false)

    if (authError) {
      const msg = authError.message
      if (msg.includes('already registered') || msg.includes('already been registered')) {
        setServerError('এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট আছে। লগইন করো।')
      } else if (msg.includes('valid email')) {
        setServerError('সঠিক ইমেইল লেখো')
      } else {
        setServerError(msg || 'কিছু সমস্যা হয়েছে। আবার চেষ্টা করো।')
      }
    } else {
      setSuccess(true)
      setFullName('')
      setUsername('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
    }
  }

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
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
          </div>
          <h2 className="auth-card__title">অ্যাকাউন্ট তৈরি করো</h2>
          <p className="auth-card__subtitle">নতুন অ্যাকাউন্ট তৈরি করো</p>
        </div>

        {serverError && <div className="auth-error">{serverError}</div>}
        {success && (
          <div className="auth-success">
            <div className="auth-success__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <p>অ্যাকাউন্ট তৈরি হয়েছে! ইমেইলে কনফার্মেশন লিংক পাঠানো হয়েছে।</p>
          </div>
        )}

        {!success && (
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label className="auth-field__label" htmlFor="signup-fullname">পুরো নাম</label>
              <input
                id="signup-fullname"
                type="text"
                className={`auth-field__input${fieldErrors.fullName ? ' has-error' : ''}`}
                placeholder="নাম লেখো"
                value={fullName}
                onChange={(e) => { setFullName(e.target.value); setFieldErrors(prev => ({ ...prev, fullName: '' })) }}
                autoComplete="name"
                autoFocus
              />
              {fieldErrors.fullName && <span className="auth-field__error">{fieldErrors.fullName}</span>}
            </div>

            <div className="auth-field">
              <label className="auth-field__label" htmlFor="signup-username">ইউজারনেম</label>
              <input
                id="signup-username"
                type="text"
                className={`auth-field__input${fieldErrors.username ? ' has-error' : ''}`}
                placeholder="একটি ইউজারনেম বাছাই করো"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setFieldErrors(prev => ({ ...prev, username: '' })) }}
                autoComplete="username"
              />
              {fieldErrors.username && <span className="auth-field__error">{fieldErrors.username}</span>}
            </div>

            <div className="auth-field">
              <label className="auth-field__label" htmlFor="signup-email">ইমেইল</label>
              <input
                id="signup-email"
                type="email"
                className={`auth-field__input${fieldErrors.email ? ' has-error' : ''}`}
                placeholder="ইমেইল"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setFieldErrors(prev => ({ ...prev, email: '' })) }}
                autoComplete="email"
              />
              {fieldErrors.email && <span className="auth-field__error">{fieldErrors.email}</span>}
            </div>

            <div className="auth-field-row">
              <div className="auth-field">
                <label className="auth-field__label" htmlFor="signup-password">পাসওয়র্ড</label>
                <div className="auth-field__input-wrap">
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    className={`auth-field__input${fieldErrors.password ? ' has-error' : ''}`}
                    placeholder="পাসওয়র্ড"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setFieldErrors(prev => ({ ...prev, password: '' })) }}
                    autoComplete="new-password"
                  />
                  <button type="button" className="auth-field__toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'লুকাও' : 'দেখাও'} tabIndex={-1}>
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    )}
                  </button>
                </div>
                {fieldErrors.password && <span className="auth-field__error">{fieldErrors.password}</span>}
              </div>

              <div className="auth-field">
                <label className="auth-field__label" htmlFor="signup-confirm">পাসওয়র্ড কনফার্ম</label>
                <div className="auth-field__input-wrap">
                  <input
                    id="signup-confirm"
                    type={showConfirm ? 'text' : 'password'}
                    className={`auth-field__input${fieldErrors.confirmPassword ? ' has-error' : ''}`}
                    placeholder="পাসওয়র্ড আবার লেখো"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setFieldErrors(prev => ({ ...prev, confirmPassword: '' })) }}
                    autoComplete="new-password"
                  />
                  <button type="button" className="auth-field__toggle" onClick={() => setShowConfirm(!showConfirm)} aria-label={showConfirm ? 'লুকাও' : 'দেখাও'} tabIndex={-1}>
                    {showConfirm ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    )}
                  </button>
                </div>
                {fieldErrors.confirmPassword && <span className="auth-field__error">{fieldErrors.confirmPassword}</span>}
              </div>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? <span className="auth-submit__spinner" /> : 'অ্যাকাউন্ট তৈরি করো'}
            </button>
          </form>
        )}

        <div className="auth-switch">
          ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
          <button type="button" onClick={onSwitchToLogin}>লগইন করো</button>
        </div>
      </div>
    </div>,
    document.body
  )
}
