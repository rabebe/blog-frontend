const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

interface ApiErrorResponse {
  errors?: string[]
  error?: string
}

export async function apiFetch(
  path: string,
  options: RequestInit = {}
) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })
  
  // 1. Handle Authentication failures
  if (res.status === 401 || res.status === 403) {
    if (typeof window !== "undefined") {
      // Clear the session because the token is dead
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      
      // Force a redirect to login
      window.location.href = "/login?error=session_expired"
    }
    return
  }

  // 2. Handle other errors, including Rails validation errors
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
      // Generic error
      if (data.error) {
        throw new Error(data.error)
      }
    }

    throw new Error("API error")
  }

  // 3. Handle empty responses (204 No Content)
  if (res.status === 204) return {}

  return res.json()
}

