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

      // Ensure the API returned a valid user object
      if (!data.user || !data.token) {
        setError("Login failed: invalid response from server")
        setLoading(false)
        return
      }

      // Store token and user in localStorage
      localStorage.setItem("token", data.token)
      const userToStore = {
        username: data.user.username,
        role: data.user.is_admin ? "admin" : "user",
      }
      localStorage.setItem("user", JSON.stringify(userToStore))
      localStorage.setItem("loginDate", Date.now().toString())

      // Trigger Navbar / auth updates
      window.dispatchEvent(new Event("authChange"))

      // Redirect based on role
      if (data.user.is_admin) {
        router.push("/admin/")
      } else {
        router.push("/blog")
      }

    } catch (err) {
      console.error("Login failed", err)
      setError("Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && <p className="text-red-600">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  )
}
