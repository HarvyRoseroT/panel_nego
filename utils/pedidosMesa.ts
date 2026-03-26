import {
  PEDIDO_MESA_ESTADOS,
  type PedidoMesa,
  type PedidoMesaEstado,
} from "@/services/pedidoService";

export const PEDIDO_MESA_ESTADO_LABELS: Record<PedidoMesaEstado, string> = {
  nuevo: "Nuevo",
  confirmado: "Confirmado",
  preparando: "Preparando",
  listo: "Listo",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

export const PEDIDO_MESA_ESTADO_OPTIONS = PEDIDO_MESA_ESTADOS.map((estado) => ({
  value: estado,
  label: PEDIDO_MESA_ESTADO_LABELS[estado],
}));

export function formatPedidoMesaPrice(value: number | null) {
  if (value === null) return "Sin total";

  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPedidoMesaDate(value: string | null) {
  if (!value) return "Sin fecha";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
}

export function getPedidoMesaEstadoClasses(estado: PedidoMesaEstado) {
  switch (estado) {
    case "confirmado":
      return "border-sky-200 bg-sky-50 text-sky-700";
    case "preparando":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "listo":
      return "border-violet-200 bg-violet-50 text-violet-700";
    case "entregado":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "cancelado":
      return "border-red-200 bg-red-50 text-red-700";
    case "nuevo":
    default:
      return "border-[#cae3bb] bg-[#72eb15]/10 text-[#2f7a08]";
  }
}

export function getPedidoMesaCountByEstado(
  pedidos: PedidoMesa[],
  estado: PedidoMesaEstado
) {
  return pedidos.filter((pedido) => pedido.estado === estado).length;
}
