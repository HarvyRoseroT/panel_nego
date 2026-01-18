"use client";

import { useEffect, useState } from "react";
import { FiX, FiCheck } from "react-icons/fi";
import { getPlanes } from "@/services/planService";
import { createSubscription } from "@/services/stripeService";
import ModalPago from "./ModalPago";

interface Plan {
  id: number;
  name: string;
  price: number;
  interval: "month" | "year";
  duration_days: number;
}

export default function ModalPlanes({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [payingPlanId, setPayingPlanId] = useState<number | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setLoading(true);
    getPlanes()
      .then(setPlanes)
      .finally(() => setLoading(false));
  }, [open]);

  const handleSelectPlan = async (planId: number) => {
    try {
      setPayingPlanId(planId);
      const { clientSecret } = await createSubscription(planId);
      setClientSecret(clientSecret);
    } catch (error) {
      alert("Error al iniciar el pago");
    } finally {
      setPayingPlanId(null);
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          >
            <FiX className="text-xl" />
          </button>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Planes disponibles
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Elige el plan que mejor se adapte a tu negocio
            </p>
          </div>

          {loading && (
            <p className="text-center text-sm text-gray-500 py-10">
              Cargando planes...
            </p>
          )}

          {!loading && planes.length === 0 && (
            <p className="text-center text-sm text-gray-500 py-10">
              No hay planes disponibles
            </p>
          )}

          <div className="grid gap-4">
            {planes.map((plan) => (
              <div
                key={plan.id}
                className="border border-gray-200 rounded-xl p-5 flex items-center justify-between hover:border-[#72eb15] hover:shadow-md transition-all"
              >
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    {plan.name}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {plan.interval === "month" ? "Mensual" : "Anual"} ·{" "}
                    {plan.duration_days} días
                  </p>
                </div>

                <div className="text-right flex flex-col items-end">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-[#3fa10a]">
                      ${Number(plan.price).toLocaleString("es-CO")}
                    </span>
                    <span className="text-sm font-medium text-gray-500">
                      / {plan.interval === "month" ? "mes" : "año"}
                    </span>
                  </div>

                  <button
                    disabled={payingPlanId === plan.id}
                    onClick={() => handleSelectPlan(plan.id)}
                    className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#72eb15]/15 text-[#3fa10a] font-semibold text-sm hover:bg-[#72eb15]/25 transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#72eb15]/40"
                  >
                    <FiCheck className="text-base" />
                    {payingPlanId === plan.id
                      ? "Procesando..."
                      : "Elegir plan"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {clientSecret && (
        <ModalPago
          clientSecret={clientSecret}
          onClose={() => setClientSecret(null)}
        />
      )}
    </>
  );
}
