export function isAdmin(): boolean {
  const userStr = localStorage.getItem("user")
  if (!userStr) return false

  try {
    const user = JSON.parse(userStr)
    return user.role === "admin"
  } catch {
    return false
  }
}
