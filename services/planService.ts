import api from "@/services/api";

export interface Plan {
  id: number;
  name: string;
  price: string;
  interval: "month" | "year";
  duration_days: number;
}

export async function getPlanes(): Promise<Plan[]> {
  const { data } = await api.get("/planes");
  return data;
}
