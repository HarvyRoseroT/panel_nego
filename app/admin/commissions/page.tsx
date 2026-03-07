"use client";

import { useEffect, useState } from "react";
import {
  getAdminCommissions,
  payCommissions,
  CommissionItem,
} from "@/services/partnerService";

export default function AdminCommissionsPage() {

  const [commissions, setCommissions] = useState<CommissionItem[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    const data = await getAdminCommissions();
    setCommissions(data);
  }

  useEffect(() => {
    load();
  }, []);

  function toggle(id: number) {
    if (selected.includes(id)) {
      setSelected(selected.filter((i) => i !== id));
    } else {
      setSelected([...selected, id]);
    }
  }

  async function handlePay() {

    if (!selected.length) return;

    setLoading(true);

    await payCommissions({
      commissionIds: selected,
    });

    setSelected([]);
    await load();

    setLoading(false);
  }

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold text-white">
        Comisiones
      </h1>

      <button
        onClick={handlePay}
        disabled={loading || selected.length === 0}
        className="bg-green-500 px-4 py-2 rounded-lg text-black font-semibold disabled:opacity-40"
      >
        Pagar seleccionadas
      </button>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-neutral-800 text-neutral-400">
            <tr>
              <th className="p-4"></th>
              <th>Partner</th>
              <th>Cliente</th>
              <th>Monto</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>

            {commissions.map((c) => (

              <tr
                key={c.id}
                className="border-t border-neutral-800 hover:bg-neutral-800/40"
              >

                <td className="p-4">
                  {c.status === "approved" && (
                    <input
                      type="checkbox"
                      checked={selected.includes(c.id)}
                      onChange={() => toggle(c.id)}
                    />
                  )}
                </td>

                <td>
                  {c.Referral?.PartnerProfile?.User?.name}
                </td>

                <td>
                  {c.Referral?.client?.email}
                </td>

                <td className="text-green-400">
                  {formatMoney(c.commission_amount)}
                </td>

                <td>
                  {c.status}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

function formatMoney(value: number) {
  return Number(value).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  });
}