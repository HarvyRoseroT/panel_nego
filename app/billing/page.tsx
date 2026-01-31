"use client";

import { useRouter } from "next/navigation";
import { FiCheckCircle } from "react-icons/fi";

export default function BillingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8 text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-[#72eb15]/20 text-[#3fa10a]">
          <FiCheckCircle className="text-3xl" />
        </div>

        <h1 className="mt-6 text-2xl font-bold text-gray-800">
          Gestión de facturación completada
        </h1>

        <p className="mt-3 text-sm text-gray-600">
          Los cambios en tu suscripción se han procesado correctamente.
          Puedes continuar usando el panel con normalidad.
        </p>

        <button
          onClick={() => router.push("/")}
          className="mt-8 w-full py-3 rounded-xl bg-[#72eb15] text-[#365314] font-semibold hover:bg-[#64d413] transition"
        >
          Volver al panel
        </button>
      </div>
    </div>
  );
}
