"use client";

import type { ReactNode } from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClipboard,
  FiRefreshCw,
  FiShoppingBag,
} from "react-icons/fi";
import PedidoMesaDetailPanel from "./components/PedidoMesaDetailPanel";
import PedidosMesaList from "./components/PedidosMesaList";
import { usePedidosMesaPanel } from "@/hooks/usePedidosMesaPanel";
import {
  PEDIDO_MESA_ESTADOS,
} from "@/services/pedidoService";
import {
  getPedidoMesaCountByEstado,
} from "@/utils/pedidosMesa";

export default function PedidosMesasPage() {
  const {
    establecimiento,
    pedidos,
    filteredPedidos,
    selectedPedidoId,
    selectedPedido,
    estadoFilter,
    loading,
    refreshing,
    detailLoading,
    updatingEstado,
    error,
    setEstadoFilter,
    setSelectedPedidoId,
    refreshPedidos,
    changePedidoEstado,
  } = usePedidosMesaPanel();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-gray-500">
        Cargando pedidos por mesa...
      </div>
    );
  }

  if (!establecimiento?.id) {
    return (
      <div className="flex items-center justify-center min-h-[65vh] px-4">
        <div className="w-full max-w-lg rounded-[28px] border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#72eb15]/15 text-[#3fa10a]">
            <FiClipboard className="text-2xl" />
          </div>

          <h1 className="mt-5 text-xl font-semibold text-gray-900">
            Primero crea tu establecimiento
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            La bandeja de pedidos por mesa necesita un establecimiento activo
            para listar los pedidos recibidos desde QR.
          </p>
        </div>
      </div>
    );
  }

  if (establecimiento.tipo_establecimiento === "clothing_store") {
    return (
      <div className="flex items-center justify-center min-h-[65vh] px-4">
        <div className="w-full max-w-xl rounded-[28px] border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
            <FiAlertCircle className="text-2xl" />
          </div>

          <h1 className="mt-5 text-xl font-semibold text-gray-900">
            Esta seccion no aplica para tu tipo de negocio
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            Los pedidos por mesa estan pensados para negocios que reciben
            ordenes desde QR en mesas fisicas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 pb-8 pt-8 lg:px-0">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-[28px] border border-gray-200 bg-white px-5 py-5 shadow-sm lg:flex-row lg:items-center lg:justify-between lg:px-7">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#72eb15]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#3fa10a]">
              <FiClipboard />
              Pedidos por mesa
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Pedidos QR en {establecimiento.nombre}
              </h1>
              <p className="text-sm text-gray-500">
                Lista operativa para cocina y sala con mesa visible, detalle del
                pedido y cambio de estado.
              </p>
            </div>
          </div>

          <button
            onClick={() => void refreshPedidos()}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Actualizando..." : "Actualizar"}
          </button>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Pedidos cargados"
            value={String(pedidos.length)}
            icon={<FiShoppingBag className="text-xl text-[#3fa10a]" />}
          />
          <SummaryCard
            label="Pedidos nuevos"
            value={String(getPedidoMesaCountByEstado(pedidos, "nuevo"))}
            icon={<FiAlertCircle className="text-xl text-amber-600" />}
          />
          <SummaryCard
            label="Pedidos listos"
            value={String(getPedidoMesaCountByEstado(pedidos, "listo"))}
            icon={<FiCheckCircle className="text-xl text-violet-600" />}
          />
          <SummaryCard
            label="Estados activos"
            value={String(
              PEDIDO_MESA_ESTADOS.filter((estado) =>
                pedidos.some((pedido) => pedido.estado === estado)
              ).length
            )}
            icon={<FiClipboard className="text-xl text-sky-600" />}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <PedidosMesaList
            pedidos={filteredPedidos}
            selectedPedidoId={selectedPedidoId}
            estadoFilter={estadoFilter}
            onSelectPedido={setSelectedPedidoId}
            onEstadoFilterChange={setEstadoFilter}
          />

          <PedidoMesaDetailPanel
            pedido={selectedPedido}
            loading={detailLoading}
            updatingEstado={updatingEstado}
            onChangeEstado={(estado) => void changePedidoEstado(estado)}
          />
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50">
          {icon}
        </div>
      </div>
    </div>
  );
}
