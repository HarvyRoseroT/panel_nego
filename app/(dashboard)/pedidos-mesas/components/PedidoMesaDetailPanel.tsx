"use client";

import type { ComponentType } from "react";
import {
  FiClipboard,
  FiClock,
  FiMessageSquare,
  FiPhone,
  FiShoppingBag,
  FiUser,
} from "react-icons/fi";
import {
  type PedidoMesa,
  type PedidoMesaEstado,
} from "@/services/pedidoService";
import PedidoMesaEstadoBadge from "./PedidoMesaEstadoBadge";
import {
  formatPedidoMesaDate,
  formatPedidoMesaPrice,
  PEDIDO_MESA_ESTADO_OPTIONS,
} from "@/utils/pedidosMesa";

export default function PedidoMesaDetailPanel({
  pedido,
  loading,
  updatingEstado,
  onChangeEstado,
}: {
  pedido: PedidoMesa | null;
  loading: boolean;
  updatingEstado: boolean;
  onChangeEstado: (estado: PedidoMesaEstado) => void;
}) {
  return (
    <aside className="space-y-6">
      <section className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-gray-900">
            {pedido ? `Pedido #${pedido.id}` : "Detalle del pedido"}
          </h2>
          <p className="text-sm text-gray-500">
            {pedido
              ? "Consulta rapidamente desde que mesa llego el pedido y actualiza su estado."
              : "Selecciona un pedido para ver sus productos y datos del cliente."}
          </p>
        </div>

        {!pedido && !loading && (
          <div className="mt-5 rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-5 py-10 text-sm text-gray-500">
            No hay un pedido seleccionado.
          </div>
        )}

        {loading && (
          <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 px-5 py-10 text-sm text-gray-500">
            Cargando detalle del pedido...
          </div>
        )}

        {pedido && !loading && (
          <div className="mt-5 space-y-5">
            <div className="rounded-[24px] border border-[#cae3bb] bg-[#72eb15]/10 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3fa10a]">
                Mesa de origen
              </p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {pedido.mesa_nombre ?? "Mesa sin nombre"}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <PedidoMesaEstadoBadge estado={pedido.estado} />
                <span className="text-xs text-gray-500">
                  Recibido {formatPedidoMesaDate(pedido.createdAt)}
                </span>
              </div>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700">
                Cambiar estado
              </span>
              <select
                value={pedido.estado}
                onChange={(event) =>
                  onChangeEstado(event.target.value as PedidoMesaEstado)
                }
                disabled={updatingEstado}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 disabled:cursor-not-allowed disabled:bg-gray-50"
              >
                {PEDIDO_MESA_ESTADO_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCard
                icon={FiUser}
                label="Cliente"
                value={pedido.cliente_nombre ?? "Cliente sin nombre"}
              />
              <InfoCard
                icon={FiPhone}
                label="Telefono"
                value={pedido.cliente_telefono ?? "Sin telefono"}
              />
              <InfoCard
                icon={FiClock}
                label="Fecha"
                value={formatPedidoMesaDate(pedido.createdAt)}
              />
              <InfoCard
                icon={FiClipboard}
                label="Total"
                value={formatPedidoMesaPrice(pedido.total)}
              />
            </div>

            <div className="rounded-2xl border border-gray-200 p-4">
              <div className="mb-3 flex items-center gap-2">
                <FiShoppingBag className="text-[#3fa10a]" />
                <h3 className="text-sm font-semibold text-gray-900">
                  Productos del pedido
                </h3>
              </div>

              <div className="space-y-3">
                {pedido.items.length === 0 && (
                  <div className="rounded-xl bg-gray-50 px-4 py-4 text-sm text-gray-500">
                    Este pedido no trae items detallados todavia.
                  </div>
                )}

                {pedido.items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl bg-gray-50 px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {item.nombre_producto}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {item.cantidad} x {formatPedidoMesaPrice(item.precio_unitario)}
                        </p>
                        {item.notas && (
                          <p className="mt-2 text-xs text-gray-500">
                            Nota: {item.notas}
                          </p>
                        )}
                      </div>

                      <p className="text-sm font-semibold text-gray-900">
                        {formatPedidoMesaPrice(item.subtotal)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 p-4">
              <div className="mb-2 flex items-center gap-2">
                <FiMessageSquare className="text-[#3fa10a]" />
                <h3 className="text-sm font-semibold text-gray-900">Notas</h3>
              </div>
              <p className="text-sm text-gray-600">
                {pedido.notas ?? "Este pedido no tiene notas adicionales."}
              </p>
            </div>
          </div>
        )}
      </section>
    </aside>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-gray-50 p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
        <Icon className="text-sm" />
        {label}
      </div>
      <p className="mt-2 text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}
