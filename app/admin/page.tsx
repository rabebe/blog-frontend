"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import AdminPostList from "@/components/admin/AdminPostList"
import AdminCommentList from "@/components/admin/AdminCommentList"

export default function AdminPage() {
  const { hydrated, isAdmin } = useAuth()
  const router = useRouter()
  const [view, setView] = useState<"posts" | "comments">("posts")

  // Redirect non-admin users after hydration
  useEffect(() => {
    if (hydrated && !isAdmin) {
      router.push("/login")
    }
  }, [hydrated, isAdmin, router])

  // Wait until user is hydrated and admin
  if (!hydrated || !isAdmin) return null

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b pb-4">
        <button
          onClick={() => setView("posts")}
          className={`px-6 py-2 rounded-full font-medium transition-all ${
            view === "posts" 
              ? "bg-blue-600 text-white shadow-lg" 
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Manage Posts
        </button>

        <button
          onClick={() => setView("comments")}
          className={`px-6 py-2 rounded-full font-medium transition-all ${
            view === "comments" 
              ? "bg-blue-600 text-white shadow-lg" 
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Approve Comments
        </button>
      </div>

      {/* Content */}
      <div className="animate-in fade-in duration-500">
        {view === "posts" && <AdminPostList />}
        {view === "comments" && <AdminCommentList />}
      </div>
    </div>
  )
}
