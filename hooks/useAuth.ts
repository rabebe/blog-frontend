"use client"

import { useState, useEffect, useCallback } from "react"
import { logout as doLogout } from "../lib/auth"

export type User = {
  username: string
  role: "admin" | "user"
  emailVerified?: boolean
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [hydrated, setHydrated] = useState(false)

  const hydrateUser = useCallback(() => {
    if (typeof window === "undefined") return

    const raw = localStorage.getItem("user")
    const storedUser: User | null = raw ? JSON.parse(raw) : null

    // Defer state update to avoid synchronous setState in effect
    setTimeout(() => {
      setUser(storedUser)
      setHydrated(true)
    }, 0)
  }, [])

  const logout = useCallback(() => {
    doLogout()
    setUser(null)
    window.dispatchEvent(new Event("authChange"))
  }, [])

  useEffect(() => {
    hydrateUser()
    window.addEventListener("authChange", hydrateUser)
    return () => window.removeEventListener("authChange", hydrateUser)
  }, [hydrateUser])

  const isAdmin = user?.role === "admin"

  return { user, hydrated, isAdmin, logout }
}
