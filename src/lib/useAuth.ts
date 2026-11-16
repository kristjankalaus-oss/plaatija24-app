'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export type UserRole = 'client' | 'tiler' | 'admin'

export interface AuthState {
  user: User | null
  role: UserRole | null
  fullName: string
  loading: boolean
  signOut: () => Promise<void>
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
  let role: UserRole | null = null
  if (user) {
    if (adminEmail && user.email?.toLowerCase() === adminEmail.toLowerCase()) {
      role = 'admin'
    } else {
      const metaRole = user.user_metadata?.role
      if (metaRole === 'tiler' || metaRole === 'admin' || metaRole === 'client') {
        role = metaRole
      } else {
        role = 'client'
      }
    }
  }

  const fullName =
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    ''

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return { user, role, fullName, loading, signOut }
}
