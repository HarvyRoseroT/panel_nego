import api from "@/services/api";

export interface Plan {
  id: number;
  name: string;
  price: number;
}

export interface Subscription {
  id: number;
  status:
    | "trial"
    | "pending"
    | "active"
    | "past_due"
    | "expired"
    | "canceled";

  ends_at?: string | null;

  Plan?: Plan | null;
}


export interface AuthUser {
  id: number;
  name: string;
  email: string;
  stripe_customer_id?: string | null;
  subscription?: Subscription | null;
}


interface LoginResponse {
  token: string;
  user: AuthUser;
}

interface RegisterResponse {
  message: string;
}

interface VerifyEmailResponse {
  message: string;
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

export async function getMe(): Promise<AuthUser> {
  const { data } = await api.get("/auth/me");
  return data;
}


export async function registerRequest(
  name: string,
  email: string,
  password: string
): Promise<RegisterResponse> {
  const { data } = await api.post("/auth/register", {
    name,
    email,
    password,
  });

  return data;
}

export async function verifyEmailRequest(
  token: string
): Promise<VerifyEmailResponse> {
  const { data } = await api.get("/auth/verify-email", {
    params: { token },
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
