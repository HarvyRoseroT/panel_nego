"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";

export default function BillingSuccessPage() {
  const router = useRouter();
  const { refreshUser } = useUser();

  const ran = useRef(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const sync = async () => {
      try {
        await refreshUser();
      } finally {
        setTimeout(() => setLoading(false), 700);
      }
    };

    sync();
  }, [refreshUser]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-linear-to-br from-[#f6fff2] via-white to-[#ecfdf5] px-4">
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)] bg-size-[20px_20px]" />

      <div className="relative z-10 w-full max-w-lg rounded-3xl bg-white border border-gray-100 shadow-xl p-8 md:p-10 text-center animate-fade-in">
        {loading ? (
          <>
            <div className="mx-auto mb-6 h-16 w-16 rounded-full border-4 border-[#72eb15]/30 border-t-[#72eb15] animate-spin" />

            <h1 className="text-xl font-semibold text-gray-800">
              Activando tu suscripción
            </h1>

            <p className="mt-2 text-gray-500 text-sm">
              Estamos sincronizando tu plan con el sistema.
            </p>
          </>
        ) : (
          <>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#72eb15] shadow-lg">
              <svg
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-gray-800">
              Pago confirmado
            </h1>

            <p className="mt-3 text-gray-600 leading-relaxed">
              Tu suscripción ha sido activada correctamente.
              <br />
              Ya tienes acceso completo a todas las funciones de tu plan.
            </p>

            <div className="mt-6 rounded-xl bg-[#f7ffe9] border border-[#d9f99d] p-4 text-sm text-[#365314]">
              💡 Ahora puedes personalizar tu QR, gestionar cartas y ver
              estadísticas desde tu panel.
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full rounded-xl bg-[#72eb15] px-6 py-3 font-semibold text-[#365314] transition hover:bg-[#72eb15]/90 focus:outline-none focus:ring-2 focus:ring-[#72eb15]/40"
              >
                Ir al dashboard
              </button>

              <button
                onClick={() => router.push("/configuracion")}
                className="w-full rounded-xl border border-gray-200 px-6 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Configurar mi cuenta
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
