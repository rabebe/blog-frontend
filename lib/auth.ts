import { apiFetch } from "./api";

// Export StoredUser so TS can see it in pages
export type StoredUser = {
  username: string
  role: "admin" | "user"
  emailVerified: boolean
}

export type LoginResult =
  | ({ token: string } & StoredUser) // success
  | { emailNotVerified: true; message?: string } // email not verified

export type SignupResponse =
  | ({ token: string } & StoredUser)
  | { emailNotVerified: true; message?: string }

export async function login(email: string, password: string): Promise<LoginResult> {
  try {
    const data = await apiFetch("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })

    if (data && data.token) {
      const user: StoredUser = {
        username: data.username,
        role: data.is_admin || data.admin ? "admin" : "user",
        emailVerified: data.email_verified ?? false,
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("loginDate", Date.now().toString())
      window.dispatchEvent(new Event("authChange"))

      return { ...user, token: data.token }
    }

    throw new Error("Invalid login response")
  } catch (err) {
    if (err instanceof Error && err.message.includes("not verified")) {
      return { emailNotVerified: true, message: err.message }
    }
    throw err
  }
}

export async function signup(
  username: string,
  email: string,
  password: string
): Promise<SignupResponse> {
  try {
    const data = await apiFetch("/signup", {
      method: "POST",
      body: JSON.stringify({ user: { username, email, password } }),
    })

    // If backend says email not verified
    if (data && "emailNotVerified" in data && data.emailNotVerified) {
      return data
    }

    // If backend sends a token (e.g., auto-login)
    if (data && data.token) {
      const user: StoredUser = {
        username: data.username,
        role: "user",
        emailVerified: data.email_verified ?? false,
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("loginDate", Date.now().toString())
      window.dispatchEvent(new Event("authChange"))

      return { ...user, token: data.token }
    }

    throw new Error("Invalid signup response")
  } catch (err) {
    // Optional: catch backend errors about not verified
    if (err instanceof Error && err.message.includes("not verified")) {
      return { emailNotVerified: true, message: err.message }
    }
    throw err
  }
}

export function logout() {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  localStorage.removeItem("loginDate")
  window.dispatchEvent(new Event("authChange"))
}
