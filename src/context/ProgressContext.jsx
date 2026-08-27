import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import { supabase } from '../lib/supabase.js'

const LOCAL_STORAGE_KEY = 'hsc-biology-progress-v1'

const ProgressContext = createContext(null)

function readLocalProgress() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {}
  } catch {
    return {}
  }
}

function writeLocalProgress(map) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(map))
  } catch { /* ignore */ }
}

export function ProgressProvider({ children }) {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const [progress, setProgress] = useState({})
  const [loading, setLoading] = useState(true)
  const migratedRef = useRef(false)

  // Debounced save queue: collects updates and flushes to Supabase in batches
  const saveQueueRef = useRef({})
  const saveTimerRef = useRef(null)

  const flushSaveQueue = useCallback(async () => {
    const queue = saveQueueRef.current
    saveQueueRef.current = {}

    if (!user || Object.keys(queue).length === 0) return

    const upserts = Object.entries(queue).map(([slug, value]) => ({
      user_id: user.id,
      chapter_slug: slug,
      percentage: value,
      last_accessed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))

    const { error } = await supabase
      .from('chapter_progress')
      .upsert(upserts, { onConflict: 'user_id,chapter_slug' })

    if (error) {
      console.warn('[Progress] Failed to save to Supabase:', error.message)
    }
  }, [user])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [])

  // On logout: immediately cancel pending saves and clear progress state
  // This prevents User A's stale data from persisting if User B logs in next
  useEffect(() => {
    if (!isAuthenticated && !user) {
      // Cancel any pending debounced save
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
        saveTimerRef.current = null
      }
      // Discard unsaved queue — don't write User A's data to User B's session
      saveQueueRef.current = {}
      // Reset migration flag for the next user
      migratedRef.current = false
    }
  }, [isAuthenticated, user])

  // Load progress when auth state changes
  useEffect(() => {
    if (authLoading) return

    let cancelled = false

    async function load() {
      setLoading(true)

      if (isAuthenticated && user) {
        // Load from Supabase chapter_progress table
        const { data, error } = await supabase
          .from('chapter_progress')
          .select('chapter_slug, percentage')
          .eq('user_id', user.id)

        if (cancelled) return

        if (error) {
          console.warn('[Progress] Failed to load from Supabase:', error.message)
          // Fallback to localStorage
          setProgress(readLocalProgress())
        } else {
          // Convert array to map
          const map = {}
          for (const row of (data || [])) {
            map[row.chapter_slug] = row.percentage
          }
          setProgress(map)

          // One-time migration: localStorage → Supabase (take higher value)
          if (!migratedRef.current) {
            migratedRef.current = true
            const local = readLocalProgress()
            const localSlugs = Object.keys(local)
            if (localSlugs.length > 0) {
              const upserts = localSlugs.map(slug => ({
                user_id: user.id,
                chapter_slug: slug,
                percentage: Math.max(local[slug] || 0, map[slug] || 0),
                last_accessed_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }))
              await supabase.from('chapter_progress').upsert(upserts, {
                onConflict: 'user_id,chapter_slug',
              })
              // Rebuild merged map
              const merged = { ...map }
              for (const slug of localSlugs) {
                merged[slug] = Math.max(merged[slug] || 0, local[slug] || 0)
              }
              setProgress(merged)
            }
          }
        }
      } else {
        // Logged out or guest: clear progress immediately, then read from localStorage
        // AuthContext.signOut already cleared localStorage before calling supabase.auth.signOut,
        // so readLocalProgress() will return {} for the next user
        setProgress({})
        // Read localStorage as fallback (handles direct token expiry / tab reload while logged out)
        const local = readLocalProgress()
        if (Object.keys(local).length > 0) {
          setProgress(local)
        }
        migratedRef.current = false
      }

      setLoading(false)
    }

    load()

    return () => { cancelled = true }
  }, [user, isAuthenticated, authLoading])

  // Update progress for a single chapter (with debounced Supabase save)
  const updateProgress = useCallback(async (slug, value) => {
    // Optimistic update
    setProgress(prev => {
      const next = { ...prev, [slug]: value }
      writeLocalProgress(next)
      return next
    })

    // Queue Supabase save (debounced — batches updates within 1s)
    if (isAuthenticated && user) {
      saveQueueRef.current[slug] = value
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
      saveTimerRef.current = setTimeout(() => {
        flushSaveQueue()
      }, 1000)
    }
  }, [isAuthenticated, user, flushSaveQueue])

  // Get progress for a single chapter
  const getProgress = useCallback((slug) => {
    return progress[slug] || 0
  }, [progress])

  return (
    <ProgressContext.Provider value={{ progress, updateProgress, getProgress, loading }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgressContext() {
  const ctx = useContext(ProgressContext)
  if (!ctx) {
    throw new Error('useProgressContext must be used within a ProgressProvider')
  }
  return ctx
}
