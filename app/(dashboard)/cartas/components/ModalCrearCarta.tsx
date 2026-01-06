"use client";

import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { createCarta, updateCarta } from "@/services/cartaService";
import { getStoredToken } from "@/services/authService";
import type { Carta } from "@/services/cartaService";

interface ModalCrearCartaProps {
  open: boolean;
  onClose: () => void;
  establecimientoId: number;
  carta: Carta | null;
  onCreated: (carta: Carta) => void;
  onUpdated: (carta: Carta) => void;
}

export default function ModalCrearCarta({
  open,
  onClose,
  establecimientoId,
  carta,
  onCreated,
  onUpdated,
}: ModalCrearCartaProps) {
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setNombre(carta?.nombre ?? "");
  }, [carta, open]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!nombre.trim()) return;

    const token = getStoredToken();
    if (!token) return;

    try {
      setLoading(true);

      if (carta) {
        const updated = await updateCarta(
          carta.id,
          { nombre },
          token
        );
        onUpdated(updated);
      } else {
        const created = await createCarta(
          { nombre, establecimiento_id: establecimientoId },
          token
        );
        onCreated(created);
      }

      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <FiX className="text-xl" />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-1">
          {carta ? "Editar carta" : "Nueva carta"}
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          {carta
            ? "Modifica el nombre de la carta"
            : "Crea una nueva carta para tu establecimiento"}
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Nombre de la carta
            </label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#72eb15]/40"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-[#72eb15]/20 text-[#3fa10a] font-semibold text-sm hover:bg-[#72eb15]/30 disabled:opacity-50"
            >
              {loading
                ? "Guardando…"
                : carta
                ? "Guardar cambios"
                : "Crear carta"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
