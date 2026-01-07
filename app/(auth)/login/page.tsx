"use client"

import { login } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const data = await login(email, password)

      if (!data.user || !data.token) {
        setError("Login failed: invalid response from server")
        return
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: data.user.username,
          role: data.user.is_admin ? "admin" : "user",
        })
      )
      localStorage.setItem("loginDate", Date.now().toString())

      window.dispatchEvent(new Event("authChange"))

      router.push(data.user.is_admin ? "/admin" : "/blog")
    } catch {
      setError("Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Welcome back
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Log in to your account
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black text-white py-2.5 text-sm font-medium
              hover:bg-gray-900 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <a href="/signup" className="text-black font-medium hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}
