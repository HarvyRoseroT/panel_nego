"use client";

import { useEffect, useState } from "react";
import { FiX, FiCheck } from "react-icons/fi";
import { getPlanes } from "@/services/planService";

interface Plan {
  id: number;
  name: string;
  price: string;
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

  useEffect(() => {
    if (!open) return;

    setLoading(true);
    getPlanes()
      .then(setPlanes)
      .finally(() => setLoading(false));
  }, [open]);

  if (!open) return null;

  return (
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
              className="
                relative
                border border-gray-200 rounded-xl
                p-5
                flex items-center justify-between
                hover:border-[#72eb15]
                hover:shadow-md
                transition-all
              "
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
                    ${Number(plan.price).toFixed(2)}
                  </span>
                  <span className="text-sm font-medium text-gray-500">
                    / {plan.interval === "month" ? "mes" : "año"}
                  </span>
                </div>

                <button
                  className="
                    mt-3
                    inline-flex items-center gap-2
                    px-4 py-2
                    rounded-lg
                    bg-[#72eb15]/15 text-[#3fa10a]
                    font-semibold text-sm
                    hover:bg-[#72eb15]/25
                    transition-colors
                    focus:outline-none focus:ring-2 focus:ring-[#72eb15]/40
                  "
                >
                  <FiCheck className="text-base" />
                  Elegir plan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
