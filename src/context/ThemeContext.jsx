import { createContext, useEffect, useMemo, useState, useCallback, useRef } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import { supabase } from '../lib/supabase.js'

const STORAGE_KEY = 'specimen-theme'

export const ThemeContext = createContext(null)

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const [theme, setTheme] = useState(getInitialTheme)
  const loadedFromDbRef = useRef(false)
  const savingRef = useRef(false)

  // Sync theme to Supabase user_preferences when authenticated
  const saveThemeToSupabase = useCallback(async (newTheme) => {
    if (!user || savingRef.current) return
    savingRef.current = true
    const { error } = await supabase
      .from('user_preferences')
      .upsert(
        { user_id: user.id, theme: newTheme, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      )
    if (error) {
      console.warn('[Theme] Failed to save to Supabase:', error.message)
    }
    savingRef.current = false
  }, [user])

  // Load theme from Supabase on auth state change
  useEffect(() => {
    if (authLoading || !isAuthenticated || !user) {
      if (!isAuthenticated) loadedFromDbRef.current = false
      return
    }

    // Only load from DB once per auth session
    if (loadedFromDbRef.current) return
    loadedFromDbRef.current = true

    async function loadPreferences() {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('theme')
        .eq('user_id', user.id)
        .single()

      if (error || !data) {
        // No preferences row yet — create one with current theme
        await supabase
          .from('user_preferences')
          .upsert(
            { user_id: user.id, theme: getInitialTheme() },
            { onConflict: 'user_id' }
          )
        return
      }

      // Apply DB theme if it differs from local
      if (data.theme && data.theme !== theme) {
        setTheme(data.theme)
      }
    }

    loadPreferences()
  }, [user, isAuthenticated, authLoading]) // intentionally NOT including `theme` to avoid loops

  // Apply theme to DOM and localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  // When theme changes AND user is authenticated, persist to Supabase
  useEffect(() => {
    if (isAuthenticated && user && loadedFromDbRef.current) {
      saveThemeToSupabase(theme)
    }
  }, [theme, isAuthenticated, user, saveThemeToSupabase])

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'))
  }, [])

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      setTheme,
    }),
    [theme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
