"use client";

import { useEffect, useState } from "react";
import { getAdminPayments, PaymentItem } from "@/services/partnerService";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchPayments() {
    try {
      const data = await getAdminPayments();
      setPayments(data);
    } catch {
      setError("Error cargando pagos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">
        Pagos de Clientes
      </h1>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="p-4">Fecha</th>
                <th>Cliente</th>
                <th>Partner</th>
                <th>Plan</th>
                <th>Pago #</th>
                <th>Monto pagado</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-neutral-500">
                    Cargando pagos...
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-neutral-500">
                    No hay pagos registrados.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-neutral-800 hover:bg-neutral-800/40"
                  >
                    <td className="p-4 text-neutral-300">
                      {new Date(p.created_at).toLocaleDateString("es-CO")}
                    </td>

                    <td className="text-neutral-200">
                      {p.Referral?.client?.name}
                    </td>

                    <td className="text-neutral-300">
                      {p.Referral?.PartnerProfile?.User?.name}
                    </td>

                    <td className="text-neutral-300 capitalize">
                      {p.plan_type}
                    </td>

                    <td className="text-neutral-300">
                      {p.payment_cycle_number}
                    </td>

                    <td className="text-emerald-400 font-medium">
                      {formatMoney(p.payment_amount)}
                    </td>

                    <td>
                      <StatusBadge status={p.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: any = {
    pending: "bg-yellow-500/20 text-yellow-400",
    approved: "bg-blue-500/20 text-blue-400",
    paid: "bg-emerald-500/20 text-emerald-400",
    cancelled: "bg-red-500/20 text-red-400",
  };

  return (
    <span className={`px-3 py-1 text-xs rounded-full ${colors[status]}`}>
      {status}
    </span>
  );
}

function formatMoney(value: number) {
  return Number(value).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  });
}