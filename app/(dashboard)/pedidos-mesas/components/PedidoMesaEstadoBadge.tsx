"use client";

import {
  type PedidoMesaEstado,
} from "@/services/pedidoService";
import {
  getPedidoMesaEstadoClasses,
  PEDIDO_MESA_ESTADO_LABELS,
} from "@/utils/pedidosMesa";

export default function PedidoMesaEstadoBadge({
  estado,
  className = "",
}: {
  estado: PedidoMesaEstado;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getPedidoMesaEstadoClasses(
        estado
      )} ${className}`.trim()}
    >
      {PEDIDO_MESA_ESTADO_LABELS[estado]}
    </span>
  );
}
