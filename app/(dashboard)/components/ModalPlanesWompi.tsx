"use client";

import { useEffect, useState } from "react";
import { FiX, FiCheck } from "react-icons/fi";
import {
  Plan,
  Subscription,
  getPlans,
  getMySubscription,
  getAcceptanceToken,
  getCheckoutData
} from "@/services/wompiService";
import { useUser } from "@/contexts/UserContext";
import { useBillingMode } from "@/contexts/BillingModeContext";
import { isFreeModeBillingConflict } from "@/services/billingModeService";

declare global {
  interface Window {
    WidgetCheckout?: new (options: WompiCheckoutOptions) => WompiCheckout;
  }
}

interface WompiCheckoutOptions {
  publicKey: string | undefined;
  currency: string;
  amountInCents: number;
  reference: string;
  signature: {
    integrity: string;
  };
}

interface WompiCheckoutResult {
  event?: string;
}

interface WompiCheckout {
  open: (callback: (result: WompiCheckoutResult) => void) => void;
}

const formatCOP = (amount: number) =>
  amount.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  });

export default function ModalPlanes({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { token, refreshUser } = useUser();
  const { billingMode, refreshBillingMode } = useBillingMode();

  const [planes, setPlanes] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [acceptanceToken, setAcceptanceToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [widgetReady, setWidgetReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [billingMessage, setBillingMessage] = useState<string | null>(null);

  const hasActivePlan = subscription?.status === "ACTIVE";
  const freeModeEnabled = billingMode?.free_mode_enabled === true;

  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof window !== "undefined" && window.WidgetCheckout) {
        setWidgetReady(true);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!open || !token) return;

    let mounted = true;

    setLoading(true);
    setBillingMessage(null);
    setAcceptanceToken(null);

    async function loadBillingData() {
      try {
        const currentMode = billingMode ?? (await refreshBillingMode());
        const [plans, sub] = await Promise.all([
          getPlans(token as string),
          getMySubscription(token as string),
        ]);

        if (!mounted) return;

        setPlanes(plans);
        setSubscription(sub);

        if (currentMode?.free_mode_enabled) {
          setBillingMessage("Los pagos estan desactivados temporalmente.");
          return;
        }

        const acceptance = await getAcceptanceToken(token as string);
        if (mounted) setAcceptanceToken(acceptance.acceptance_token);
      } catch (error) {
        if (isFreeModeBillingConflict(error)) {
          await refreshBillingMode();
          if (mounted) {
            setBillingMessage("Los pagos estan desactivados temporalmente.");
          }
          return;
        }

        console.error("Billing data error:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadBillingData();

    return () => {
      mounted = false;
    };
  }, [billingMode, open, refreshBillingMode, token]);

  const handleSubscribe = async (plan: Plan) => {
    if (!widgetReady || !window.WidgetCheckout || !token) return;
    if (processing || hasActivePlan || freeModeEnabled) return;

    try {
      setProcessing(true);
      setBillingMessage(null);

      const checkoutData = await getCheckoutData(plan.id, token);

      const checkout = new window.WidgetCheckout({
        publicKey: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY,
        currency: checkoutData.currency,
        amountInCents: checkoutData.amountInCents,
        reference: checkoutData.reference,
        signature: {
          integrity: checkoutData.signature,
        },
      });

      checkout.open((result) => {
        if (result?.event === "checkout.payment.success") {
          setTimeout(async () => {
            await refreshUser();
            onClose();
          }, 2000);
        }
      });

    } catch (error) {
      if (isFreeModeBillingConflict(error)) {
        await refreshBillingMode();
        setBillingMessage("Los pagos estan desactivados temporalmente.");
        return;
      }

      console.error("Checkout error:", error);
    } finally {
      setProcessing(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl p-5 sm:p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <FiX className="text-xl" />
        </button>

        <div className="mb-6 pr-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Planes disponibles
          </h2>
        </div>

        {hasActivePlan && (
          <div className="mb-6 p-4 rounded-xl bg-yellow-50 border border-yellow-200">
            <p className="text-sm text-yellow-800">
              Los pagos deben realizarse manualmente. Los botones se habilitarán
              cuando sea necesario realizar un nuevo pago. Si deseas actualizar
              tu plan, debes esperar a que tu plan actual expire.
            </p>
          </div>
        )}

        {freeModeEnabled && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200">
            <p className="text-sm font-semibold text-green-800">
              Modo gratuito activo
            </p>
            <p className="mt-1 text-sm text-green-700">
              Los pagos estan desactivados temporalmente.
            </p>
          </div>
        )}

        {billingMessage && !freeModeEnabled && (
          <div className="mb-6 p-4 rounded-xl bg-yellow-50 border border-yellow-200">
            <p className="text-sm text-yellow-800">{billingMessage}</p>
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-500">Cargando...</p>
        ) : (
          <div className="grid gap-4">
            {planes.map((plan) => {
              const isCurrent =
                subscription?.Plan?.id === plan.id &&
                subscription?.status === "ACTIVE";

              return (
                <div
                  key={plan.id}
                  className={`rounded-xl p-4 sm:p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border transition
                    ${
                      isCurrent
                        ? "bg-green-50 border-green-300"
                        : "bg-white border-gray-200"
                    }`}
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p
                        className={`text-lg font-semibold ${
                          isCurrent ? "text-green-700" : "text-gray-800"
                        }`}
                      >
                        {plan.name}
                      </p>

                      {isCurrent && (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-200 text-green-800 font-medium">
                          Tu plan actual
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-500">
                      {plan.interval === "month" ? "Mensual" : "Anual"}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p
                      className={`text-2xl font-bold ${
                        isCurrent ? "text-green-700" : "text-[#3fa10a]"
                      }`}
                    >
                      {formatCOP(plan.price / 100)}
                    </p>

                    {freeModeEnabled ? (
                      <span className="mt-3 inline-flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
                        Modo gratuito activo
                      </span>
                    ) : (
                      <button
                        disabled={
                          !widgetReady ||
                          !acceptanceToken ||
                          hasActivePlan ||
                          processing
                        }
                        onClick={() => handleSubscribe(plan)}
                        className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm bg-[#72eb15]/15 text-[#3fa10a] disabled:opacity-50"
                      >
                        <FiCheck />
                        {isCurrent
                          ? "Plan activo"
                          : hasActivePlan
                          ? "Plan activo"
                          : processing
                          ? "Procesando..."
                          : "Pagar"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
