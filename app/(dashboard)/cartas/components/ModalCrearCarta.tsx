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
  tipoEstablecimiento: string | null;
  carta: Carta | null;
  onCreated: (carta: Carta) => void;
  onUpdated: (carta: Carta) => void;
}

export default function ModalCrearCarta({
  open,
  onClose,
  establecimientoId,
  tipoEstablecimiento,
  carta,
  onCreated,
  onUpdated,
}: ModalCrearCartaProps) {
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);

  const esTienda = tipoEstablecimiento === "clothing_store";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-5 sm:p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <FiX className="text-xl" />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-1 pr-8">
          {carta
            ? `Editar ${esTienda ? "categoría" : "carta"}`
            : `Nueva ${esTienda ? "categoría" : "carta"}`}
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          {carta
            ? `Modifica el nombre de la ${
                esTienda ? "categoría" : "carta"
              }`
            : `Crea una nueva ${
                esTienda ? "categoría" : "carta"
              } para tu establecimiento`}
        </p>

        <div className="space-y-4">
          <div>
            <label className="label-ui">
              Nombre de la {esTienda ? "categoría" : "carta"}
            </label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              autoFocus
              className="input-ui"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-2">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Cancelar
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary"
            >
              {loading
                ? "Guardando…"
                : carta
                ? "Guardar cambios"
                : `Crear ${esTienda ? "categoría" : "carta"}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}