import type { AxiosError } from "axios";
import api from "@/services/api";

export interface BillingMode {
  free_mode_enabled: boolean;
  payments_enabled: boolean;
  updated_by: number | null;
  updatedAt: string | null;
}

export interface UpdateBillingModePayload {
  free_mode_enabled: boolean;
}

export interface UpdateBillingModeResponse {
  message: string;
  billing_mode: BillingMode;
}

export interface BillingModeConflictResponse {
  message?: string;
  billing_mode?: Partial<BillingMode>;
}

export async function getBillingMode(): Promise<BillingMode> {
  const { data } = await api.get("/api/billing/mode");
  return data;
}

export async function updateBillingMode(
  payload: UpdateBillingModePayload
): Promise<UpdateBillingModeResponse> {
  const { data } = await api.patch("/api/billing/mode", payload);
  return data;
}

export function isFreeModeBillingConflict(error: unknown): boolean {
  const axiosError = error as AxiosError<BillingModeConflictResponse>;

  return (
    axiosError?.response?.status === 409 &&
    axiosError.response.data?.billing_mode?.free_mode_enabled === true
  );
}
