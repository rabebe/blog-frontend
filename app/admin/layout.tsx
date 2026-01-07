"use client"

import { isAdmin } from "@/lib/authGuard"
import { useRouter } from "next/navigation"
import { useEffect, ReactNode } from "react"

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()

  useEffect(() => {
    if (!isAdmin()) router.push("/blog")
  }, [router])

  return <div className="admin">{children}</div>
}
