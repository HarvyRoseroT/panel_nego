import api from "@/services/api";

export async function loginRequest(email: string, password: string) {
  const { data } = await api.post("/auth/login", {
    email,
    password,
  });

  return data;
}
