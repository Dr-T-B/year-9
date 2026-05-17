import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Session } from '@supabase/supabase-js'

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Auto sign-in with family credentials
    const init = async () => {
      const { data: { session: existing } } = await supabase.auth.getSession()

      if (existing) {
        setSession(existing)
        setLoading(false)
        return
      }

      const email = import.meta.env.VITE_FAMILY_EMAIL
      const password = import.meta.env.VITE_FAMILY_PASSWORD

      if (!email || !password) {
        console.error('Family credentials not set in .env.local')
        setLoading(false)
        return
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Auto sign-in failed:', error.message)
      } else {
        setSession(data.session)
      }

      setLoading(false)
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    )

    return () => subscription.unsubscribe()
  }, [])

  return { session, loading }
}
