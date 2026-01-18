import api from "@/services/api";

interface CreateSubscriptionResponse {
  clientSecret: string;
}

export async function createSubscription(
  planId: number
): Promise<CreateSubscriptionResponse> {
  const { data } = await api.post("/api/stripe/create-subscription", {
    planId,
  });

  return data;
}
