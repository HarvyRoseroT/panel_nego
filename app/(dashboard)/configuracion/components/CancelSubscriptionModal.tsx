"use client";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  currentPeriodEnd?: string | null;
}

export default function CancelSubscriptionModal({
  open,
  onClose,
  onConfirm,
  loading,
  currentPeriodEnd,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white max-w-sm w-full rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          ¿Cancelar suscripción?
        </h3>

        <p className="text-sm text-gray-600">
          Podrás seguir usando el sistema hasta el{" "}
          {currentPeriodEnd
            ? new Date(currentPeriodEnd).toLocaleDateString()
            : "fin del periodo actual"}.
        </p>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-sm"
            disabled={loading}
          >
            Volver
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm disabled:opacity-60"
          >
            {loading ? "Cancelando…" : "Confirmar cancelación"}
          </button>
        </div>
      </div>
    </div>
  );
}
