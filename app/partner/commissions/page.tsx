"use client";

import { useEffect, useState } from "react";
import { getPartnerCommissions, CommissionItem } from "@/services/partnerPanelService";

export default function PartnerCommissionsPage() {
  const [commissions, setCommissions] = useState<CommissionItem[]>([]);

  useEffect(() => {
    getPartnerCommissions().then(setCommissions);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">
        Comisiones
      </h1>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="py-3">Fecha</th>
                <th>Plan</th>
                <th>Pago #</th>
                <th>%</th>
                <th>Monto</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {commissions.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-neutral-800 hover:bg-neutral-800/40"
                >
                  <td className="py-3 text-neutral-200">
                    {new Date(c.created_at).toLocaleDateString("es-CO")}
                  </td>

                  <td className="text-neutral-300">
                    {c.plan_type}
                  </td>

                  <td className="text-neutral-300">
                    {c.payment_cycle_number}
                  </td>

                  <td className="text-neutral-300">
                    {c.commission_percentage}%
                  </td>

                  <td className="text-emerald-400">
                    {formatMoney(c.commission_amount)}
                  </td>

                  <td>
                    <StatusBadge status={c.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: CommissionItem["status"] }) {
  const colors: Record<string, string> = {
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