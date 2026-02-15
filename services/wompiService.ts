import api from "@/services/api";

export interface Plan {
  id: number;
  name: string;
  price: number;
  currency: string;
  interval: "month" | "year";
  duration_days: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: number;
  user_id: number;
  status:
    | "TRIAL"
    | "ACTIVE"
    | "EXPIRED";
  plan_price: number;
  currency: string;
  current_period_start: string | null;
  current_period_end: string | null;
  next_billing_date: string | null;
  created_at: string;
  updated_at: string;
  Plan?: {
    id: number;
    name: string;
    price: number;
    interval: "month" | "year";
    currency: string;
  };
}

export interface Invoice {
  id: number;
  reference: string;
  amount: number;
  currency: string;
  status: string;
  paid_at: string | null;
  created_at: string;
}

export interface AcceptanceTokenResponse {
  acceptance_token: string;
}

export async function getPlans(token: string): Promise<Plan[]> {
  const { data } = await api.get("/planes", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function getAcceptanceToken(
  token: string
): Promise<AcceptanceTokenResponse> {
  const { data } = await api.get("/api/billing/acceptance-token", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function getMySubscription(
  token: string
): Promise<Subscription | null> {
  const { data } = await api.get("/api/billing/subscription", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function getCheckoutData(
  plan_id: number,
  token: string
) {
  const { data } = await api.post(
    "/api/billing/checkout-data",
    { plan_id },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
}

export async function getMyInvoices(
  token: string
): Promise<Invoice[]> {
  const { data } = await api.get("/api/billing/invoices", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}
