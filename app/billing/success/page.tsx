"use client";

import { useRouter } from "next/navigation";

export default function BillingSuccessPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Pago completado correctamente
        </h1>

        <p className="text-gray-500 mt-2">
          Tu suscripción ha sido activada. Ya puedes usar todas las funciones del plan.
        </p>

        <button
          onClick={() => router.push("/dashboard")}
          className="mt-6 w-full rounded-lg bg-[#72eb15] text-[#365314] font-semibold py-2 transition hover:bg-[#72eb15]/90 focus:outline-none focus:ring-2 focus:ring-[#72eb15]/40"
        >
          Ir al dashboard
        </button>
      </div>
    </div>
  );
}
