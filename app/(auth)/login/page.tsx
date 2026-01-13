"use client"

import { login, StoredUser } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useState } from "react"

// Type returned by login
type LoginResult =
  | (StoredUser & { token: string })
  | { emailNotVerified: true; message?: string }

// Type guard
function isLoginSuccess(
  result: LoginResult
): result is StoredUser & { token: string } {
  return !("emailNotVerified" in result)
}

// Detailed API error types
interface LoginError {
  message: string
  type?: "unauthorized" | "forbidden" | "email_verification" | "other"
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setLoading(true)

    try {
      const data: LoginResult = await login(email, password)

      // Email not verified
      if ("emailNotVerified" in data && data.emailNotVerified) {
        setInfo(
          data.message || "Please verify your email before logging in."
        )
        return
      }

      if (isLoginSuccess(data)) {
        // Success
        localStorage.setItem("token", data.token)
        localStorage.setItem(
          "user",
          JSON.stringify({
            username: data.username,
            role: data.role,
            emailVerified: data.emailVerified,
          })
        )
        localStorage.setItem("loginDate", Date.now().toString())
        window.dispatchEvent(new Event("authChange"))

        router.push(data.role === "admin" ? "/admin" : "/blog")
      }
    } catch (err: unknown) {
      // Type-safe error handling
      const loginError: LoginError =
        err instanceof Error
          ? { message: err.message, type: "other" }
          : { message: "An unexpected error occurred", type: "other" }

      if (loginError.message.toLowerCase().includes("unauthorized")) {
        loginError.type = "unauthorized"
        setError("Invalid email or password. Please try again.")
      } else if (loginError.message.toLowerCase().includes("forbidden")) {
        loginError.type = "forbidden"
        setError(
          "You do not have permission to access this resource. Contact support if needed."
        )
      } else if (loginError.message.toLowerCase().includes("not verified")) {
        loginError.type = "email_verification"
        setInfo(
          loginError.message || "Please verify your email before logging in."
        )
      } else {
        setError(loginError.message)
      }
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
        <p className="text-sm text-gray-500 mb-6">Log in to your account</p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {info && (
          <div className="mb-4 rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-2 text-sm text-yellow-800">
            {info}
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
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
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
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black text-white py-2.5 text-sm font-medium hover:bg-gray-900 transition disabled:opacity-60"
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
