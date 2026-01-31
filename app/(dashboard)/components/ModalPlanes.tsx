"use client";

import { useEffect, useState } from "react";
import { FiX, FiCheck } from "react-icons/fi";
import { getPlanes } from "@/services/planService";
import {
  createSubscription,
  openBillingPortal,
} from "@/services/stripeService";
import { useUser } from "@/contexts/UserContext";

interface Plan {
  id: number;
  name: string;
  price: number;
  interval: "month" | "year";
  duration_days: number;
}

interface CurrentSubscription {
  status:
    | "trial"
    | "pending"
    | "active"
    | "past_due"
    | "expired"
    | "canceled";
  Plan?: {
    id: number;
    name: string;
  } | null;
}

export default function ModalPlanes({
  open,
  onClose,
  currentSubscription,
}: {
  open: boolean;
  onClose: () => void;
  currentSubscription?: CurrentSubscription | null;
}) {
  const { user } = useUser();

  const [planes, setPlanes] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [payingPlanId, setPayingPlanId] = useState<number | null>(null);
  const [confirmPlan, setConfirmPlan] = useState<Plan | null>(null);

  const subscription = currentSubscription ?? user?.subscription;
  const currentPlanId = subscription?.Plan?.id;

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    getPlanes().then(setPlanes).finally(() => setLoading(false));
  }, [open]);

  const handleConfirmPlan = async () => {
    if (!confirmPlan) return;

    try {
      setPayingPlanId(confirmPlan.id);

      if (
        subscription?.status === "active" ||
        subscription?.status === "past_due"
      ) {
        const url = await openBillingPortal();
        window.location.href = url;
      } else {
        const url = await createSubscription(confirmPlan.id);
        console.log("URL STRIPE:", url);
        if (!url) {
          alert("Stripe no devolvió URL");
          return;
        }
        window.location.href = url;

      }
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

          {subscription?.Plan && (
            <div className="mb-5 rounded-xl border border-[#72eb15]/40 bg-[#72eb15]/10 px-5 py-4">
              <p className="text-sm font-semibold text-[#3fa10a]">
                Plan actual
              </p>
              <p className="mt-1 text-base font-bold text-gray-800">
                {subscription.Plan.name}
              </p>
            </div>
          )}

          <div className="grid gap-4">
            {planes.map((plan) => {
              const isCurrentPlan = plan.id === currentPlanId;

              return (
                <div
                  key={plan.id}
                  className="border border-gray-200 rounded-xl p-5 flex items-center justify-between"
                >
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      {plan.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {plan.interval === "month" ? "Mensual" : "Anual"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#3fa10a]">
                      ${Number(plan.price).toLocaleString("es-CO")}
                    </p>

                    <button
                      disabled={isCurrentPlan}
                      onClick={() => setConfirmPlan(plan)}
                      className={`mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm ${
                        isCurrentPlan
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-[#72eb15]/15 text-[#3fa10a] hover:bg-[#72eb15]/25"
                      }`}
                    >
                      <FiCheck />
                      {isCurrentPlan ? "Plan actual" : "Seleccionar"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {confirmPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white max-w-md w-full rounded-3xl shadow-xl overflow-hidden">
            <div className="px-6 py-5">
              <h3 className="text-lg font-bold text-gray-800">
                Confirmar plan
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Serás redirigido a Stripe para continuar
              </p>
            </div>

            <div className="px-6 pb-6 space-y-4">
              <div className="rounded-2xl bg-gray-50 px-4 py-4 space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span className="font-medium">Plan</span>
                  <span>{confirmPlan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Precio</span>
                  <span>
                    ${Number(confirmPlan.price).toLocaleString("es-CO")} /{" "}
                    {confirmPlan.interval === "month" ? "mes" : "año"}
                  </span>
                </div>
              </div>

              {(subscription?.status === "active" ||
                subscription?.status === "past_due") && (
                <div className="rounded-2xl bg-[#72eb15]/10 px-4 py-3">
                  <p className="text-sm font-semibold text-[#3fa10a]">
                    Información importante
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Stripe ajustará automáticamente el precio de tu plan.
                    Cualquier diferencia se cobrará o acreditará según
                    corresponda.
                  </p>
                </div>
              )}
            </div>

            <div className="px-6 py-5 flex gap-3">
              <button
                onClick={() => setConfirmPlan(null)}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmPlan}
                disabled={payingPlanId === confirmPlan.id}
                className="flex-1 py-2.5 rounded-xl bg-[#72eb15] text-[#365314] font-semibold hover:bg-[#64d413] transition disabled:opacity-60"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
