"use client";

import { useEffect, useState } from "react";
import { FiX, FiEdit2, FiPlus } from "react-icons/fi";
import {
  createSeccion,
  updateSeccion,
  type Seccion,
} from "@/services/seccionService";
import { getStoredToken } from "@/services/authService";

interface Props {
  open: boolean;
  cartaId: number;
  seccion?: Seccion | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ModalCrearSeccion({
  open,
  cartaId,
  seccion,
  onClose,
  onSuccess,
}: Props) {
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = Boolean(seccion);

  useEffect(() => {
    setNombre(seccion?.nombre ?? "");
    setError(null);
  }, [seccion, open]);

  if (!open) return null;

  const handleSubmit = async () => {
    const token = getStoredToken();
    if (!token) return;

    if (!nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (isEdit && seccion) {
        await updateSeccion(
          seccion.id,
          { nombre: nombre.trim() },
          token
        );
      } else {
        await createSeccion(
          {
            nombre: nombre.trim(),
            carta_id: cartaId,
          },
          token
        );
      }

      onSuccess?.();
      onClose();
    } catch {
      setError(
        isEdit
          ? "Error actualizando la sección"
          : "Error creando la sección"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#72eb15]/20 text-[#3fa10a]">
              {isEdit ? <FiEdit2 /> : <FiPlus />}
            </div>
            <h2 className="text-lg font-semibold text-gray-800 truncate">
              {isEdit ? "Editar sección" : "Nueva sección"}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition shrink-0"
          >
            <FiX />
          </button>
        </div>

        <div className="px-4 sm:px-6 py-5 space-y-5">
          <div>
            <label className="label-ui">
              Nombre de la sección
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Entradas"
              autoFocus
              className="input-ui"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-2">
              <p className="text-sm text-red-600">
                {error}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-3 px-4 sm:px-6 py-4 bg-gray-50 rounded-b-2xl">
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
              ? isEdit
                ? "Guardando…"
                : "Creando…"
              : isEdit
              ? "Guardar cambios"
              : "Crear sección"}
          </button>
        </div>
      </div>
    </div>
  );
}
