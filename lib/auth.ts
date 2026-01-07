import { apiFetch } from "./api";

type StoredUser = {
  username: string;
  role: "admin" | "user";
};

export async function login(email: string, password: string) {
  const data = await apiFetch("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (data && data.token) {
    localStorage.setItem("token", data.token);

    const userToStore: StoredUser = {
      username: data.username,
      role: data.is_admin || data.admin ? "admin" : "user",
    };

    localStorage.setItem("user", JSON.stringify(userToStore));
    localStorage.setItem("loginDate", Date.now().toString());

    // notify app of auth change
    window.dispatchEvent(new Event("authChange"));
  }

  return data;
}

export async function signup(
  username: string,
  email: string,
  password: string
) {
  const data = await apiFetch("/signup", {
    method: "POST",
    body: JSON.stringify({ user: { username, email, password } }),
  });

  if (data && data.token) {
    localStorage.setItem("token", data.token);

    const userToStore: StoredUser = {
      username: data.username,
      role: "user",
    };

    localStorage.setItem("user", JSON.stringify(userToStore));
    localStorage.setItem("loginDate", Date.now().toString());

    // notify app of auth change
    window.dispatchEvent(new Event("authChange"));
  }

  return data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("loginDate");

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("authChange"));
  }
}
