"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { getInvoices, type Invoice } from "@/services/billingService";
import { FiDownload, FiExternalLink } from "react-icons/fi";

export default function FacturasPage() {
  const { token } = useUser();
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    if (!token) return;

    getInvoices(token)
      .then(setInvoices)
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Facturas
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Historial de facturación y pagos realizados
        </p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-sm text-gray-500">
            Cargando facturas…
          </div>
        ) : invoices.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-gray-500">
              Aún no tienes facturas generadas.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500">
                  <th className="px-6 py-4 text-left font-medium">
                    Fecha
                  </th>
                  <th className="px-6 py-4 text-left font-medium">
                    Monto
                  </th>
                  <th className="px-6 py-4 text-left font-medium">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-right font-medium">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 text-gray-700">
                      {new Date(inv.date).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 font-semibold text-gray-900">
                      ${inv.amount.toLocaleString()}{" "}
                      <span className="text-xs text-gray-500">
                        {inv.currency}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          inv.status === "paid"
                            ? "bg-[#72eb15]/20 text-[#3fa10a]"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {inv.status === "paid" ? "Pagada" : inv.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-4">
                        {inv.invoice_pdf && (
                          <a
                            href={inv.invoice_pdf}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-gray-600 hover:text-[#3fa10a] transition"
                          >
                            <FiDownload />
                            PDF
                          </a>
                        )}

                        {inv.hosted_invoice_url && (
                          <a
                            href={inv.hosted_invoice_url}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-gray-600 hover:text-[#3fa10a] transition"
                          >
                            <FiExternalLink />
                            Ver online
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
