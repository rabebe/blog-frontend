"use client"

import { ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  username: string
  is_admin: boolean
}

export default function AdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter()

  let user: User | null = null

  if (typeof window !== "undefined") {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      user = JSON.parse(storedUser)
    }
  }

  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else if (!user.is_admin) {
      router.push("/")
    }
  }, [router, user])

  if (!user || !user.is_admin) {
    return null
  }

  return <>{children}</>
}
