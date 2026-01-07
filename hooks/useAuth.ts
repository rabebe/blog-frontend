"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { logout as doLogout } from "../lib/auth" // Adjust path if needed

// User type
export type User = {
  username: string
  role: "admin" | "user"
}

export function useAuth() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [hydrated, setHydrated] = useState(false)

  // Logout function
  const logout = () => {
    doLogout()
    setUser(null)
    router.push("/login")
  }

  // Computed admin flag
  const isAdmin = user?.role === "admin"

  // Hydrate user from localStorage and listen for auth changes
  useEffect(() => {
    if (typeof window === "undefined") return

    const hydrateUser = () => {
      const raw = localStorage.getItem("user")
      if (raw) {
        try {
          setUser(JSON.parse(raw))
        } catch {
          setUser(null)
        }
      } else {
        setUser(null)
      }
      setHydrated(true)
    }

    // call asynchronously to satisfy ESLint
    setTimeout(hydrateUser, 0)

    // Listen for login/logout events
    window.addEventListener("authChange", hydrateUser)
    return () => window.removeEventListener("authChange", hydrateUser)
  }, [])

  return { user, hydrated, isAdmin, logout }
}
