import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'

export default function ConfirmEmailPage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading') // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('')

  const handleConfirmation = useCallback(async () => {
    try {
      // Supabase sends the confirmation as hash fragment parameters:
      // #access_token=...&expires_at=...&expires_in=...&refresh_token=...&token_type=bearer&type=signup
      const hash = window.location.hash

      if (!hash || hash.length <= 1) {
        setStatus('error')
        setMessage('কোনো ভ্যালিড কনফার্মেশন টোকেন পাওয়া যায়নি।')
        return
      }

      const params = new URLSearchParams(hash.substring(1))
      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')
      const tokenType = params.get('token_type')
      const type = params.get('type')

      if (!accessToken || !refreshToken) {
        setStatus('error')
        setMessage('কনফার্মেশন টোকেন অসম্পূর্ণ।')
        return
      }

      if (type && type !== 'signup') {
        setStatus('error')
        setMessage('অবৈধ কনফার্মেশন ধরন।')
        return
      }

      // Exchange the tokens for a session — this confirms the email
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      })

      if (error) {
        console.error('[ConfirmEmail] setSession error:', error.message)
        setStatus('error')
        setMessage('ইমেইল কনফার্মেশন ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।')
        return
      }

      setStatus('success')
      setMessage('আপনার ইমেইল সফলভাবে কনফার্ম হয়েছে! এখন আপনি লগইন করতে পারবেন।')

      // Redirect to home after 3 seconds
      setTimeout(() => {
        navigate('/', { replace: true })
      }, 3000)
    } catch (err) {
      console.error('[ConfirmEmail] Unexpected error:', err)
      setStatus('error')
      setMessage('একটি অপ্রত্যাশিত ত্রুটি ঘটেছে।')
    }
  }, [navigate])

  useEffect(() => {
    handleConfirmation()
  }, [handleConfirmation])

  // Clear the hash fragment from the URL after processing for security
  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [])

  return (
    <div className="confirm-page">
      <div className="confirm-card">
        <div className="confirm-card__icon">
          {status === 'loading' && (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="confirm-spinner">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          )}
          {status === 'success' && (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          )}
          {status === 'error' && (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          )}
        </div>
        <h1 className="confirm-card__title">
          {status === 'loading' && 'ইমেইল যাচাই করা হচ্ছে...'}
          {status === 'success' && 'ইমেইল কনফার্ম হয়েছে!'}
          {status === 'error' && 'কনফার্মেশন ব্যর্থ'}
        </h1>
        <p className="confirm-card__message">
          {status === 'loading'
            ? 'অনুগ্রহ করে অপেক্ষা করুন...'
            : message
          }
        </p>
        <Link to="/" className="confirm-card__link">
          {status === 'success'
            ? '→ হোম পেজে যান'
            : '← লগইন পৃষ্ঠায় ফিরে যাও'
          }
        </Link>
      </div>
    </div>
  )
}
