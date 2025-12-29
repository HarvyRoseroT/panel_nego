import api from "@/services/api";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface LoginResponse {
  token: string;
  user: AuthUser;
}

export async function loginRequest(
  email: string,
  password: string
): Promise<LoginResponse> {
  const { data } = await api.post("/auth/login", {
    email,
    password,
  });

  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  return data;
}

export async function registerRequest(
  name: string,
  email: string,
  password: string
) {
  const { data } = await api.post("/auth/register", {
    name,
    email,
    password,
  });

  return data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function isAuthenticated(): boolean {
  return !!getStoredToken();
}
