import api from "@/services/api";

export interface PartnerDashboardTotals {
  total_generated: string;
  available: string;
  pending: string;
  paid: string;
}

export interface PartnerDashboardResponse {
  referrals: number;
  totals: PartnerDashboardTotals;
}

export interface CommissionItem {
  id: number;
  payment_cycle_number: number;
  plan_type: "monthly" | "yearly";
  commission_amount: number;
  commission_percentage: number;
  status: "pending" | "approved" | "paid" | "cancelled";
  payout_id: number | null;
  paid_at: string | null;
  created_at: string;
  available_at: string;
  Referral: {
    client: {
      id: number;
      name: string;
      email: string;
    };
  };
}

export interface ReferralItem {
  id: number;
  trial_days_assigned: number;
  client: {
    id: number;
    name: string;
    email: string;
  };
}

export async function getPartnerDashboard(): Promise<PartnerDashboardResponse> {
  const { data } = await api.get("/api/partner/panel/dashboard");
  return data;
}

export async function getPartnerCommissions(): Promise<CommissionItem[]> {
  const { data } = await api.get("/api/partner/panel/commissions");
  return data;
}

export async function getPartnerReferrals(): Promise<ReferralItem[]> {
  const { data } = await api.get("/api/partner/panel/referrals");
  return data;
}