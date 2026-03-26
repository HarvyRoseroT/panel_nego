"use client";

import { FiClock, FiUser } from "react-icons/fi";
import type { PedidoMesa, PedidoMesaEstado } from "@/services/pedidoService";
import PedidoMesaEstadoBadge from "./PedidoMesaEstadoBadge";
import {
  formatPedidoMesaDate,
  formatPedidoMesaPrice,
  PEDIDO_MESA_ESTADO_LABELS,
  PEDIDO_MESA_ESTADO_OPTIONS,
} from "@/utils/pedidosMesa";

export default function PedidosMesaList({
  pedidos,
  selectedPedidoId,
  estadoFilter,
  onSelectPedido,
  onEstadoFilterChange,
}: {
  pedidos: PedidoMesa[];
  selectedPedidoId: number | null;
  estadoFilter: "todos" | PedidoMesaEstado;
  onSelectPedido: (pedidoId: number) => void;
  onEstadoFilterChange: (estado: "todos" | PedidoMesaEstado) => void;
}) {
  return (
    <section className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Pedidos recibidos
          </h2>
          <p className="text-sm text-gray-500">
            Se muestran primero los mas recientes y la mesa se resalta para
            ubicar rapido el origen del pedido.
          </p>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-600">
          <span>Estado</span>
          <select
            value={estadoFilter}
            onChange={(event) =>
              onEstadoFilterChange(
                event.target.value as "todos" | PedidoMesaEstado
              )
            }
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700"
          >
            <option value="todos">Todos</option>
            {PEDIDO_MESA_ESTADO_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5 hidden overflow-hidden rounded-2xl border border-gray-200 lg:block">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-5 py-4 text-left font-medium">Pedido</th>
              <th className="px-5 py-4 text-left font-medium">Mesa</th>
              <th className="px-5 py-4 text-left font-medium">Cliente</th>
              <th className="px-5 py-4 text-left font-medium">Total</th>
              <th className="px-5 py-4 text-left font-medium">Estado</th>
              <th className="px-5 py-4 text-left font-medium">Fecha</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {pedidos.map((pedido) => {
              const selected = pedido.id === selectedPedidoId;

              return (
                <tr
                  key={pedido.id}
                  onClick={() => onSelectPedido(pedido.id)}
                  className={`cursor-pointer transition ${
                    selected ? "bg-[#72eb15]/10" : "hover:bg-gray-50"
                  }`}
                >
                  <td className="px-5 py-4 font-semibold text-gray-900">
                    #{pedido.id}
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full bg-[#3fa10a] px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
                      {pedido.mesa_nombre ?? "Mesa sin nombre"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-700">
                    {pedido.cliente_nombre ?? "Cliente sin nombre"}
                  </td>
                  <td className="px-5 py-4 font-medium text-gray-900">
                    {formatPedidoMesaPrice(pedido.total)}
                  </td>
                  <td className="px-5 py-4">
                    <PedidoMesaEstadoBadge estado={pedido.estado} />
                  </td>
                  <td className="px-5 py-4 text-gray-500">
                    {formatPedidoMesaDate(pedido.createdAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-5 space-y-3 lg:hidden">
        {pedidos.map((pedido) => {
          const selected = pedido.id === selectedPedidoId;

          return (
            <button
              key={pedido.id}
              type="button"
              onClick={() => onSelectPedido(pedido.id)}
              className={`w-full rounded-2xl border p-4 text-left transition ${
                selected
                  ? "border-[#3fa10a] bg-[#72eb15]/10"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Pedido #{pedido.id}
                  </p>
                  <p className="mt-1 inline-flex rounded-full bg-[#3fa10a] px-3 py-1 text-xs font-semibold text-white">
                    {pedido.mesa_nombre ?? "Mesa sin nombre"}
                  </p>
                </div>

                <PedidoMesaEstadoBadge estado={pedido.estado} />
              </div>

              <div className="mt-3 space-y-2 text-sm text-gray-600">
                <p className="inline-flex items-center gap-2">
                  <FiUser />
                  {pedido.cliente_nombre ?? "Cliente sin nombre"}
                </p>
                <p className="inline-flex items-center gap-2">
                  <FiClock />
                  {formatPedidoMesaDate(pedido.createdAt)}
                </p>
              </div>

              <p className="mt-3 text-sm font-semibold text-gray-900">
                {formatPedidoMesaPrice(pedido.total)}
              </p>
            </button>
          );
        })}
      </div>

      {!pedidos.length && (
        <div className="mt-5 rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center">
          <p className="text-base font-semibold text-gray-900">
            No hay pedidos para {estadoFilter === "todos" ? "mostrar" : PEDIDO_MESA_ESTADO_LABELS[estadoFilter].toLowerCase()}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Cuando llegue un pedido desde el QR de una mesa aparecera aqui con
            su mesa, cliente, total y estado actual.
          </p>
        </div>
      )}
    </section>
  );
}
