import api from "@/services/api";

export const PEDIDO_MESA_ESTADOS = [
  "nuevo",
  "confirmado",
  "preparando",
  "listo",
  "entregado",
  "cancelado",
] as const;

export type PedidoMesaEstado = (typeof PEDIDO_MESA_ESTADOS)[number];

export interface PedidoMesaItem {
  id: string;
  producto_id: number | null;
  nombre_producto: string;
  precio_unitario: number | null;
  cantidad: number;
  subtotal: number | null;
  notas: string | null;
}

export interface PedidoMesa {
  id: number;
  establecimiento_id: number | null;
  plano_id: number | null;
  mesa_id: number | null;
  usuario_app_id: number | null;
  mesa_nombre: string | null;
  cliente_nombre: string | null;
  cliente_telefono: string | null;
  notas: string | null;
  estado: PedidoMesaEstado;
  total: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  items: PedidoMesaItem[];
}

type ApiRecord = Record<string, unknown>;

const MOCK_STORAGE_KEY = "nego_mock_pedidos_mesa";

function toRecord(value: unknown): ApiRecord | null {
  return value && typeof value === "object" ? (value as ApiRecord) : null;
}

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function toStringValue(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const parsed = String(value).trim();
  return parsed.length > 0 ? parsed : null;
}

function normalizeEstado(value: unknown): PedidoMesaEstado {
  const normalized = toStringValue(value)?.toLowerCase().replace(/\s+/g, "_");

  switch (normalized) {
    case "confirmado":
    case "preparando":
    case "listo":
    case "entregado":
    case "cancelado":
      return normalized;
    case "nuevo":
    case "pendiente":
      return "nuevo";
    default:
      return "nuevo";
  }
}

function normalizePedidoMesaItem(
  raw: ApiRecord,
  index: number
): PedidoMesaItem {
  const cantidad = toNumber(raw.cantidad ?? raw.quantity) ?? 1;
  const precioUnitario = toNumber(
    raw.precio_unitario ?? raw.precioUnitario ?? raw.precio ?? raw.price
  );
  const subtotal =
    toNumber(raw.subtotal ?? raw.total) ??
    (precioUnitario !== null ? precioUnitario * cantidad : null);

  return {
    id: String(raw.id ?? raw.producto_id ?? raw.productoId ?? index),
    producto_id: toNumber(raw.producto_id ?? raw.productoId),
    nombre_producto:
      toStringValue(
        raw.nombre_producto ??
          raw.nombre ??
          raw.producto_nombre ??
          raw.productoNombre ??
          toRecord(raw.producto)?.nombre
      ) ?? `Producto ${index + 1}`,
    precio_unitario: precioUnitario,
    cantidad,
    subtotal,
    notas: toStringValue(raw.notas ?? raw.observaciones),
  };
}

function normalizePedidoMesa(raw: ApiRecord): PedidoMesa {
  const mesaRecord = toRecord(raw.mesa);
  const clienteRecord = toRecord(raw.cliente);
  const itemsRaw =
    raw.items ??
    raw.pedido_mesa_items ??
    raw.productos ??
    raw.detalles ??
    raw.detalle ??
    [];

  return {
    id: Number(raw.id ?? raw.pedido_id ?? 0),
    establecimiento_id: toNumber(
      raw.establecimiento_id ?? raw.establecimientoId
    ),
    plano_id: toNumber(raw.plano_id ?? raw.planoId),
    mesa_id: toNumber(raw.mesa_id ?? raw.mesaId ?? mesaRecord?.id),
    usuario_app_id: toNumber(raw.usuario_app_id ?? raw.usuarioAppId),
    mesa_nombre: toStringValue(
      raw.mesa_nombre ??
        raw.mesaNombre ??
        raw.mesa ??
        raw.table_name ??
        mesaRecord?.nombre ??
        mesaRecord?.name
    ),
    cliente_nombre: toStringValue(
      raw.cliente_nombre ??
        raw.clienteNombre ??
        raw.nombre_cliente ??
        raw.customer_name ??
        clienteRecord?.nombre
    ),
    cliente_telefono: toStringValue(
      raw.cliente_telefono ??
        raw.clienteTelefono ??
        raw.telefono_cliente ??
        raw.customer_phone ??
        clienteRecord?.telefono
    ),
    notas: toStringValue(raw.notas ?? raw.observaciones ?? raw.comment),
    estado: normalizeEstado(raw.estado ?? raw.status ?? raw.estado_pedido),
    total: toNumber(raw.total ?? raw.monto_total ?? raw.total_amount),
    createdAt: toStringValue(
      raw.createdAt ?? raw.created_at ?? raw.creado_en ?? raw.fecha
    ),
    updatedAt: toStringValue(raw.updatedAt ?? raw.updated_at),
    items: Array.isArray(itemsRaw)
      ? itemsRaw.map((item, index) =>
          normalizePedidoMesaItem((item as ApiRecord) ?? {}, index)
        )
      : [],
  };
}

function normalizePedidoMesaCollection(raw: unknown): PedidoMesa[] {
  if (Array.isArray(raw)) {
    return raw
      .map((item) => normalizePedidoMesa((item as ApiRecord) ?? {}))
      .filter((pedido) => pedido.id > 0);
  }

  const record = toRecord(raw);
  if (!record) return [];

  const collection =
    record.pedidos ??
    record.pedidosMesa ??
    record.data ??
    record.items ??
    record.results ??
    record.orders ??
    [];

  if (Array.isArray(collection)) {
    return collection
      .map((item) => normalizePedidoMesa((item as ApiRecord) ?? {}))
      .filter((pedido) => pedido.id > 0);
  }

  if ("id" in record) {
    const pedido = normalizePedidoMesa(record);
    return pedido.id > 0 ? [pedido] : [];
  }

  return [];
}

function getMockPedidos(): PedidoMesa[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(MOCK_STORAGE_KEY);
    if (!stored) return [];

    return normalizePedidoMesaCollection(JSON.parse(stored));
  } catch {
    return [];
  }
}

function saveMockPedidos(pedidos: PedidoMesa[]) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(pedidos));
}

async function getWithFallback<T>(
  paths: string[],
  token: string
): Promise<{ data: T; usedMock: boolean }> {
  let lastError: unknown = null;

  for (const path of paths) {
    try {
      const response = await api.get<T>(path, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return { data: response.data, usedMock: false };
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } })?.response
        ?.status;

      if (status !== 404) {
        throw error;
      }

      lastError = error;
    }
  }

  if (lastError) {
    return {
      data: [] as T,
      usedMock: true,
    };
  }

  return {
    data: [] as T,
    usedMock: true,
  };
}

export async function getPedidosMesaByEstablecimiento(
  establecimientoId: number,
  token: string
): Promise<PedidoMesa[]> {
  const { data, usedMock } = await getWithFallback<unknown>(
    [
      `/api/pedidos-mesa/establecimiento/${establecimientoId}`,
      `/api/pedidos/establecimiento/${establecimientoId}`,
    ],
    token
  );

  if (usedMock) {
    return getMockPedidos()
      .filter((pedido) => pedido.establecimiento_id === establecimientoId)
      .sort(comparePedidosByDateDesc);
  }

  const pedidos = normalizePedidoMesaCollection(data);
  return pedidos.sort(comparePedidosByDateDesc);
}

export async function getPedidoMesaById(
  id: number,
  token: string
): Promise<PedidoMesa | null> {
  const { data, usedMock } = await getWithFallback<unknown>(
    [`/api/pedidos-mesa/${id}`, `/api/pedidos/${id}`],
    token
  );

  if (usedMock) {
    return getMockPedidos().find((pedido) => pedido.id === id) ?? null;
  }

  return normalizePedidoMesaCollection(data)[0] ?? null;
}

export async function updatePedidoMesaEstado(
  id: number,
  estado: PedidoMesaEstado,
  token: string
): Promise<PedidoMesa | null> {
  try {
    const { data } = await api.patch(
      `/api/pedidos-mesa/${id}/estado`,
      { estado },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const pedido = normalizePedidoMesaCollection(data)[0] ?? null;
    if (pedido) {
      const mockPedidos = getMockPedidos();
      const nextPedidos = mergePedidoCollection(mockPedidos, pedido);
      saveMockPedidos(nextPedidos);
    }
    return pedido;
  } catch (error: unknown) {
    const status = (error as { response?: { status?: number } })?.response
      ?.status;

    if (status !== 404) {
      throw error;
    }

    const pedidos = getMockPedidos();
    const pedido = pedidos.find((item) => item.id === id) ?? null;

    if (!pedido) return null;

    const updated: PedidoMesa = {
      ...pedido,
      estado,
      updatedAt: new Date().toISOString(),
    };

    saveMockPedidos(mergePedidoCollection(pedidos, updated));
    return updated;
  }
}

export function comparePedidosByDateDesc(a: PedidoMesa, b: PedidoMesa) {
  const left = parseDateValue(a.createdAt);
  const right = parseDateValue(b.createdAt);
  return right - left || b.id - a.id;
}

function parseDateValue(value: string | null) {
  if (!value) return 0;
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

function mergePedidoCollection(
  pedidos: PedidoMesa[],
  updated: PedidoMesa
): PedidoMesa[] {
  const next = pedidos.filter((pedido) => pedido.id !== updated.id);
  next.push(updated);
  return next.sort(comparePedidosByDateDesc);
}
