"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { User, Session } from "@supabase/supabase-js"
import { supabase } from "./supabaseClient"
import { StorageCtx, type StorageMode } from "./storage-context"
import {
  setStorageContext,
  ensureSeedData,
  ensureCloudSeedData,
  revalidateAll,
} from "./storage"

interface AuthContextType {
  user: User | null
  session: Session | null
  storageMode: StorageMode | null // null = user hasn't chosen yet
  setStorageMode: (mode: StorageMode) => void
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string) => Promise<{ error: Error | null; needsConfirmation: boolean }>
  signOut: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [storageMode, setStorageModeState] = useState<StorageMode | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Restore session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session) {
        setStorageModeState("cloud")
        setStorageContext("cloud", session.user.id)
      } else {
        const saved =
          typeof window !== "undefined"
            ? (localStorage.getItem("storageMode") as StorageMode | null)
            : null
        if (saved) {
          setStorageModeState(saved)
          setStorageContext(saved, undefined)
          if (saved === "local") {
            ensureSeedData()
            revalidateAll()
          }
        }
      }
      setLoading(false)
    })

    // Listen for auth changes (sign in, sign out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session) {
        setStorageModeState("cloud")
        setStorageContext("cloud", session.user.id)
        localStorage.setItem("storageMode", "cloud")
        // Seed default data for new users, then revalidate SWR caches
        ;(async () => {
          await ensureCloudSeedData(session.user.id)
          revalidateAll()
        })()
      } else {
        // Session ended (sign out, expiry, or another tab signed out)
        setStorageModeState("local")
        setStorageContext("local", undefined)
        localStorage.setItem("storageMode", "local")
        ensureSeedData()
        revalidateAll()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const setStorageMode = (mode: StorageMode) => {
    setStorageModeState(mode)
    localStorage.setItem("storageMode", mode)
    setStorageContext(mode, user?.id)
    if (mode === "local") {
      ensureSeedData()
      revalidateAll()
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error as Error | null }
  }

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    // needsConfirmation = signup succeeded but email confirmation is required
    const needsConfirmation = !error && !!data.user && !data.session
    return { error: error as Error | null, needsConfirmation }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    // onAuthStateChange else-branch handles clearing user/session + switching to local mode
  }

  return (
    <AuthContext.Provider
      value={{ user, session, storageMode, setStorageMode, signIn, signUp, signOut, loading }}
    >
      <StorageCtx.Provider value={{ mode: storageMode ?? "local", userId: user?.id }}>
        {children}
      </StorageCtx.Provider>
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
