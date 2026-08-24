import { createContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load profile from the profiles table
  const loadProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null)
      return
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url, created_at, updated_at')
      .eq('id', userId)
      .single()

    if (error) {
      console.warn('[Auth] Failed to load profile:', error.message)
      setProfile(null)
    } else {
      setProfile(data)
    }
  }, [])

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s)
      setUser(s?.user ?? null)
      if (s?.user) {
        loadProfile(s.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, s) => {
        setSession(s)
        setUser(s?.user ?? null)
        if (s?.user) {
          loadProfile(s.user.id)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [loadProfile])

  const signUp = useCallback(async ({ fullName, username, email, password }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          username: username,
        },
        emailRedirectTo: `${window.location.origin}/confirm-email`,
      },
    })
    return { data, error }
  }, [])

  const signIn = useCallback(async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }, [])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    setProfile(null)
    return { error }
  }, [])

  // Update profile in the profiles table
  const updateProfile = useCallback(async (updates) => {
    if (!user) return { error: new Error('Not authenticated') }
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, ...updates }, { onConflict: 'id' })
      .select()
      .single()

    if (!error && data) {
      setProfile(data)
    }
    return { data, error }
  }, [user])

  // Get display name — prefer profile table, fallback to metadata
  const getDisplayName = useCallback(() => {
    if (profile?.display_name) return profile.display_name
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name
    if (user?.user_metadata?.username) return user.user_metadata.username
    if (user?.email) return user.email.split('@')[0]
    return 'User'
  }, [profile, user])

  // Get username — prefer profile table, fallback to metadata
  const getUsername = useCallback(() => {
    if (profile?.username) return profile.username
    if (user?.user_metadata?.username) return user.user_metadata.username
    return null
  }, [profile, user])

  // Get avatar URL — from profile table
  const getAvatarUrl = useCallback(() => {
    return profile?.avatar_url || null
  }, [profile])

  const value = {
    session,
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    isAuthenticated: !!user,
    getDisplayName,
    getUsername,
    getAvatarUrl,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
