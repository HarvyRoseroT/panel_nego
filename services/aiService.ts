import api from "@/services/api";

export interface AIServiceStatus {
  success: boolean;
  service: string;
  enabled: boolean;
  updated_by: number | null;
  updatedAt: string | null;
}

export interface UpdateAIServiceStatusPayload {
  enabled: boolean;
}

export async function getAIServiceStatus(): Promise<AIServiceStatus> {
  const { data } = await api.get("/app/api/ai/status");
  return data;
}

export async function updateAIServiceStatus(
  payload: UpdateAIServiceStatusPayload
): Promise<AIServiceStatus> {
  const { data } = await api.patch("/app/api/ai/status", payload);
  return data;
}
