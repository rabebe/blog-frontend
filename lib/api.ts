const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

// Type from your Rails API responses
interface ApiErrorResponse {
  errors?: string[]
  error?: string
}

// Custom error type for runtime usage
export interface ApiError extends Error {
  type?: "email_verification" | "unauthorized" | "forbidden"
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  // Handle authentication failures
  if (res.status === 401 || res.status === 403) {
    const error: ApiError = new Error(
      res.status === 401
        ? "Unauthorized: Please log in"
        : "Forbidden: You do not have access"
    )
    error.type = res.status === 401 ? "unauthorized" : "forbidden"

    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.dispatchEvent(new Event("authChange"))
    }

    throw error
  }

  // Handle other errors
  if (!res.ok) {
    let data: ApiErrorResponse = {}
    try {
      data = await res.json()
    } catch {}

    if (data && typeof data === "object") {
      // Rails validation errors
      if (Array.isArray(data.errors)) {
        throw new Error(data.errors.join(", "))
      }

      // Email not verified special case
      if (data.error?.toLowerCase().includes("not verified")) {
        const error: ApiError = new Error(data.error)
        error.type = "email_verification"
        throw error
      }

      // Generic API error
      if (data.error) {
        throw new Error(data.error)
      }
    }

    throw new Error("API error")
  }

  // Handle empty responses (204 No Content)
  if (res.status === 204) return {}

  return res.json()
}
