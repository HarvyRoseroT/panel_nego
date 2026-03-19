import api from "@/services/api";
import type { TipoProducto } from "@/services/productoService";

export interface AnalyticsResumen {
  visitas: number;
  visitasUnicas: number;
  visitasCartas: number;
  visitasHoy: number;
  visitasSemana: number;
  visitasMes: number;
  visitasUltimos7Dias: number;
  visitasUltimos30Dias: number;
  tasaInteraccionCartas: number;
  promedioVisitasPorUsuario: number;
  ultimaVisita: string | null;
}

export interface VisitasPorDia {
  fecha: string;
  total: number | string;
}

export interface OrigenVisitas {
  origen: string | null;
  total: number | string;
}

export interface CartaTop {
  carta_id: number;
  vistas: number | string;
}

export interface AnalyticsProducto {
  id: number;
  nombre: string;
  precio: number | string | null;
  imagen_url: string | null;
  marca: string | null;
  talla: string | null;
  tipo_producto: TipoProducto;
}

export interface ProductoTop {
  producto_id: number;
  total: number | string;
  producto: AnalyticsProducto | null;
}

export async function getAnalyticsResumen(
  establecimientoId: number
): Promise<AnalyticsResumen> {
  const { data } = await api.get(
    `/dashboard/analytics/establecimiento/${establecimientoId}/resumen`
  );
  return data;
}

export async function getVisitasPorDia(
  establecimientoId: number
): Promise<VisitasPorDia[]> {
  const { data } = await api.get(
    `/dashboard/analytics/establecimiento/${establecimientoId}/visitas`
  );
  return data;
}

export async function getOrigenVisitas(
  establecimientoId: number
): Promise<OrigenVisitas[]> {
  const { data } = await api.get(
    `/dashboard/analytics/establecimiento/${establecimientoId}/origen`
  );
  return data;
}

export async function getCartasTop(
  establecimientoId: number
): Promise<CartaTop[]> {
  const { data } = await api.get(
    `/dashboard/analytics/establecimiento/${establecimientoId}/cartas-top`
  );
  return data;
}

export async function getProductosTop(
  establecimientoId: number
): Promise<ProductoTop[]> {
  const { data } = await api.get(
    `/dashboard/analytics/establecimiento/${establecimientoId}/productos-top`
  );
  return data;
}

export async function getProductosDomicilioTop(
  establecimientoId: number
): Promise<ProductoTop[]> {
  const { data } = await api.get(
    `/dashboard/analytics/establecimiento/${establecimientoId}/productos-domicilio-top`
  );
  return data;
}
