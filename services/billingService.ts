import api from "@/services/api";

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: "paid" | "open" | "void" | "uncollectible";
  invoice_pdf: string | null;
  hosted_invoice_url: string | null;
}

export async function getInvoices(token: string): Promise<Invoice[]> {
  const { data } = await api.get("/api/billing/invoices", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}
