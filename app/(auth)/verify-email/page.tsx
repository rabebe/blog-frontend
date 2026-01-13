"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { apiFetch } from "@/lib/api"

type Status = "loading" | "success" | "error"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  const [status, setStatus] = useState<Status>(token ? "loading" : "error")
  const [message, setMessage] = useState(
    token
      ? "Verifying your email…"
      : "Verification token is missing or invalid."
  )

  useEffect(() => {
    if (!token) return

    let active = true

    const verify = async () => {
      try {
        // Use GET request for Rails route
        await apiFetch(`/verify-email?token=${encodeURIComponent(token)}`)

        if (!active) return

        setStatus("success")
        setMessage("Your email has been verified! Please log in.")

        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } catch (err: unknown) {
        if (!active) return

        setStatus("error")
        setMessage(
          err instanceof Error
            ? err.message
            : "Verification failed. The link may be expired."
        )
      }
    }

    verify()

    return () => {
      active = false
    }
  }, [token, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 text-center">
        <h1 className="text-2xl font-semibold mb-4">Email Verification</h1>

        {status === "loading" && <p className="text-gray-600">{message}</p>}

        {status === "success" && (
          <p className="text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
            {message}
          </p>
        )}

        {status === "error" && (
          <>
            <p className="text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2 mb-4">
              {message}
            </p>
            <button
              onClick={() => router.push("/resend-verification")}
              className="text-sm text-black underline hover:opacity-80"
            >
              Resend verification email
            </button>
          </>
        )}
      </div>
    </div>
  )
}
