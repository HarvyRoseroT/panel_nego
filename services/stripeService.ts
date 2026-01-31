import api from "@/services/api";

export async function createSubscription(planId: number): Promise<string> {
  const { data } = await api.post("/api/stripe/create-subscription", {
    planId
  });
  return data.url;
}

export async function openBillingPortal(): Promise<string> {
  const { data } = await api.post("/api/stripe/billing-portal");
  return data.url;
}
