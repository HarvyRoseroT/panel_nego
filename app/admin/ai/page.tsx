"use client";

import type { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import {
  AIServiceStatus,
  getAIServiceStatus,
  updateAIServiceStatus,
} from "@/services/aiService";

export default function AdminAIPage() {
  const [status, setStatus] = useState<AIServiceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStatus = useCallback(async () => {
    try {
      setError(null);
      const data = await getAIServiceStatus();
      setStatus(data);
    } catch (error) {
      setError(getErrorMessage(error, "No se pudo cargar el estado del servicio de IA"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  async function handleToggle() {
    if (!status || updating) return;

    const nextEnabled = !status.enabled;

    try {
      setUpdating(true);
      setError(null);

      const updated = await updateAIServiceStatus({
        enabled: nextEnabled,
      });

      setStatus(updated);
    } catch (error) {
      setError(
        getErrorMessage(error, "No se pudo actualizar el estado del servicio de IA")
      );
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
          Superadmin
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white">Servicio IA</h1>
        <p className="mt-3 max-w-3xl text-sm text-neutral-400">
          Controla si el servicio de generacion de imagenes con IA esta
          disponible para la aplicacion.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      )}

      <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
        {loading ? (
          <p className="text-sm text-neutral-500">
            Cargando estado del servicio...
          </p>
        ) : !status ? (
          <p className="text-sm text-neutral-500">
            No hay informacion disponible del servicio.
          </p>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-white">
                    {formatServiceName(status.service)}
                  </h2>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      status.enabled
                        ? "bg-green-500/15 text-green-400"
                        : "bg-red-500/15 text-red-400"
                    }`}
                  >
                    {status.enabled ? "Activo" : "Inactivo"}
                  </span>
                </div>

                <p className="text-sm text-neutral-400">
                  {status.enabled
                    ? "La generacion de imagenes con IA esta habilitada."
                    : "La generacion de imagenes con IA esta deshabilitada."}
                </p>
              </div>

              <button
                type="button"
                onClick={handleToggle}
                disabled={updating}
                aria-pressed={status.enabled}
                className={`inline-flex min-w-48 items-center justify-center rounded-lg px-4 py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  status.enabled
                    ? "bg-red-500 text-white hover:bg-red-400"
                    : "bg-green-500 text-black hover:bg-green-400"
                }`}
              >
                {updating
                  ? "Guardando..."
                  : status.enabled
                    ? "Desactivar servicio"
                    : "Activar servicio"}
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <InfoCard label="Servicio" value={formatServiceName(status.service)} />
              <InfoCard
                label="Actualizado por"
                value={
                  status.updated_by !== null ? String(status.updated_by) : "Sin registro"
                }
              />
              <InfoCard
                label="Ultima actualizacion"
                value={formatDateTime(status.updatedAt)}
              />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
        {label}
      </p>
      <p className="mt-3 text-sm font-medium text-neutral-100">{value}</p>
    </div>
  );
}

function formatServiceName(service: string) {
  return service === "tryon" ? "Try-On" : service;
}

function formatDateTime(value: string | null) {
  if (!value) return "Sin registro";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getErrorMessage(error: unknown, fallback: string) {
  const message = (error as AxiosError<{ message?: string }>)?.response?.data
    ?.message;

  return message || fallback;
}
