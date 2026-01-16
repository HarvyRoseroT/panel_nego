import api from "@/services/api";

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
