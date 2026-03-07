"use client";

import { useEffect, useState } from "react";
import { getPartnerReferrals } from "@/services/partnerPanelService";

export default function PartnerReferralsPage() {
  const [referrals, setReferrals] = useState<any[]>([]);

  useEffect(() => {
    getPartnerReferrals().then(setReferrals);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">
        Referidos
      </h1>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="py-3">Nombre</th>
                <th>Email</th>
                <th>Días Trial</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-neutral-800 hover:bg-neutral-800/40"
                >
                  <td className="py-3 text-neutral-200">
                    {r.client?.name}
                  </td>
                  <td className="text-neutral-300">
                    {r.client?.email}
                  </td>
                  <td className="text-emerald-400">
                    {r.trial_days_assigned}
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