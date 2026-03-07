import api from "@/services/api";

export interface ValidateReferralResponse {
  valid: boolean;
}

export interface CreatePartnerPayload {
  name: string;
  email: string;
  password: string;
}

export interface CreatePartnerResponse {
  id: number;
  name: string;
  email: string;
  referralCode: string;
  active: boolean;
}

export interface PartnerListItem {
  id: number;
  name: string;
  email: string;
  active: boolean;
  referralCode: string | null;
  profileActive: boolean;
}

export interface CommissionClient {
  id: number;
  name: string;
  email: string;
}

export interface CommissionPartnerUser {
  id: number;
  name: string;
  email: string;
}

export interface CommissionPartnerProfile {
  id: number;
  referral_code: string;
  User: CommissionPartnerUser;
}

export interface CommissionReferral {
  id: number;
  client: CommissionClient;
  PartnerProfile: CommissionPartnerProfile;
}

export interface CommissionItem {
  id: number;
  payment_cycle_number: number;
  plan_type: "monthly" | "yearly";
  commission_amount: number;
  commission_percentage: number;
  status: "pending" | "approved" | "paid" | "cancelled";
  created_at: string;
  available_at: string;
  paid_at: string | null;
  Referral: CommissionReferral;
}

export interface PayCommissionsPayload {
  commissionIds: number[];
}

export interface PayCommissionsResponse {
  message: string;
}

export interface PaymentItem {
  id: number;
  payment_cycle_number: number;
  plan_type: "monthly" | "yearly";
  payment_amount: number;
  commission_percentage: number;
  commission_amount: number;
  status: "pending" | "approved" | "paid" | "cancelled";
  created_at: string;
  available_at: string;
  paid_at: string | null;

  Referral: {
    client: {
      id: number;
      name: string;
      email: string;
    };
    PartnerProfile: {
      referral_code: string;
      User: {
        id: number;
        name: string;
        email: string;
      };
    };
  };
}

export async function validateReferralCode(
  code: string
): Promise<ValidateReferralResponse> {
  const { data } = await api.get(`/api/partner/validate/${code}`);
  return data;
}

export async function createPartner(
  payload: CreatePartnerPayload
): Promise<CreatePartnerResponse> {
  const { data } = await api.post("/api/partner/create", payload);
  return data;
}

export async function getPartners(): Promise<PartnerListItem[]> {
  const { data } = await api.get("/api/partner");
  return data;
}

export async function updatePartnerStatus(
  id: number,
  active: boolean
) {
  const { data } = await api.patch(`/api/partner/${id}/status`, { active });
  return data;
}

export async function deletePartner(
  id: number
): Promise<{ message: string }> {
  const { data } = await api.delete(`/api/partner/${id}`);
  return data;
}

export async function getAdminCommissions(): Promise<CommissionItem[]> {
  const { data } = await api.get("/api/partner/commissions");
  return data;
}

export async function payCommissions(
  payload: PayCommissionsPayload
): Promise<PayCommissionsResponse> {
  const { data } = await api.post("/api/partner/commissions/pay", payload);
  return data;
}

export async function getAdminPayments(): Promise<PaymentItem[]> {
  const { data } = await api.get("/api/partner/payments");
  return data;
}