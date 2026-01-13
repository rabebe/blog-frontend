"use client"

import { useState } from "react"
import { apiFetch } from "@/lib/api"

type Status = "idle" | "loading" | "success" | "error"

export default function ResendVerificationPage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setStatus("error")
      setMessage("Please enter your email address.")
      return
    }

    setStatus("loading")
    setMessage("Sending verification email…")

    try {
      // Send proper JSON with header
      await apiFetch("/resend-verification", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      setStatus("success")
      setMessage(
        "If an account with that email exists, a new verification link has been sent."
      )
    } catch (err: unknown) {
      setStatus("error")
      setMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      )
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Resend Verification Email
        </h1>

        {status === "success" ? (
          <p className="text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-center">
            {message}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="you@example.com"
                required
              />
            </div>

            {status === "error" && (
              <p className="text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-lg bg-black text-white py-2 font-medium hover:opacity-90 disabled:opacity-50"
            >
              {status === "loading" ? "Sending…" : "Send verification email"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
