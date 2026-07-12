"use client";

import type { AxiosError } from "axios";
import { useState } from "react";
import { useBillingMode } from "@/contexts/BillingModeContext";

export default function BillingModeControl() {
  const {
    billingMode,
    loading,
    error,
    refreshBillingMode,
    setFreeModeEnabled,
  } = useBillingMode();
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const freeModeEnabled = billingMode?.free_mode_enabled === true;

  async function handleToggle() {
    if (!billingMode || updating) return;

    try {
      setUpdating(true);
      setUpdateError(null);
      await setFreeModeEnabled(!freeModeEnabled);
      await refreshBillingMode();
    } catch (error) {
      setUpdateError(
        getErrorMessage(error, "No se pudo actualizar el modo de facturacion")
      );
    } finally {
      setUpdating(false);
    }
  }

  return (
    <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-neutral-400">Facturacion global</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-bold text-white">Modo gratuito</h2>
            {billingMode && (
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  freeModeEnabled
                    ? "bg-green-500/15 text-green-400"
                    : "bg-blue-500/15 text-blue-400"
                }`}
              >
                {freeModeEnabled
                  ? "Modo gratuito activo"
                  : "Pagos activos"}
              </span>
            )}
          </div>
          <p className="mt-2 max-w-2xl text-sm text-neutral-400">
            {freeModeEnabled
              ? "Estado ON: modo gratuito activo, pagos desactivados."
              : "Estado OFF: pagos activos, validacion normal de suscripciones."}
          </p>
        </div>

        <button
          type="button"
          onClick={handleToggle}
          disabled={loading || updating || !billingMode}
          role="switch"
          aria-checked={freeModeEnabled}
          className={`relative h-8 w-16 rounded-full transition disabled:cursor-not-allowed disabled:opacity-60 ${
            freeModeEnabled ? "bg-green-500" : "bg-neutral-700"
          }`}
        >
          <span
            className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${
              freeModeEnabled ? "left-9" : "left-1"
            }`}
          />
        </button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <InfoCard
          label="Pagos"
          value={
            billingMode?.payments_enabled
              ? "Activos"
              : billingMode
                ? "Desactivados"
                : "Sin informacion"
          }
        />
        <InfoCard
          label="Actualizado por"
          value={
            billingMode?.updated_by !== null && billingMode?.updated_by !== undefined
              ? String(billingMode.updated_by)
              : "Sin registro"
          }
        />
        <InfoCard
          label="Ultima actualizacion"
          value={formatDateTime(billingMode?.updatedAt ?? null)}
        />
      </div>

      {(error || updateError) && (
        <div className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          {updateError || error}
        </div>
      )}

      {loading && (
        <p className="mt-5 text-sm text-neutral-500">
          Cargando modo de facturacion...
        </p>
      )}
    </section>
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
