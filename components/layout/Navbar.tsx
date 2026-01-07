"use client"

import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"

export default function Navbar() {
  const { user, isAdmin, logout, hydrated } = useAuth()

  // Wait until hydration is done
  if (!hydrated) return null

  return (
    <header className="bg-white border-b border-gray-200 p-4 px-6 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      <Link href="/" className="font-bold text-xl text-blue-600 tracking-tight">
        Blog
      </Link>

      <nav className="flex items-center space-x-6 text-sm font-medium">
        {!user ? (
          <>
            <Link href="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            {isAdmin && (
              <Link
                href="/admin"
                className="text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-md hover:bg-amber-100 transition"
              >
                Admin Dashboard
              </Link>
            )}
            <div className="flex items-center gap-4">
              <span className="text-gray-500 italic">Hi, {user.username}</span>
              <button
                onClick={logout}
                className="text-red-500 hover:text-red-700 font-bold"
              >
                Logout
              </button>
            </div>
          </>
        )}
      </nav>
    </header>
  )
}
