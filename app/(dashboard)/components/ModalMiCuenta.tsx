"use client";

import { useState } from "react";
import { FiX, FiShield } from "react-icons/fi";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";

export default function ModalMiCuenta({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { user } = useUser();
  const router = useRouter();
  const [name, setName] = useState(user?.name || "");

  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/25 backdrop-blur-md flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden">
        <div className="px-6 pt-6 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Mi cuenta
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Información básica de tu perfil
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <FiX className="text-lg text-gray-400" />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-medium text-gray-500 mb-1">
                Nombre
              </label>
              <input
                className="
                  w-full rounded-2xl px-4 py-3
                  bg-gray-100/70
                  text-gray-900
                  focus:bg-white
                  focus:outline-none
                  focus:ring-2 focus:ring-[#72eb15]/40
                  transition
                "
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-gray-500 mb-1">
                Email
              </label>
              <input
                className="
                  w-full rounded-2xl px-4 py-3
                  bg-gray-100/60
                  text-gray-400
                "
                value={user.email}
                disabled
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => router.push("/reset-password")}
              className="
                w-full flex items-center justify-center gap-2
                px-4 py-3 rounded-2xl
                bg-[#72eb15]/15
                text-[#3fa10a]
                font-semibold
                hover:bg-[#72eb15]/25
                transition
              "
            >
              <FiShield className="text-base" />
              Cambiar contraseña
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
