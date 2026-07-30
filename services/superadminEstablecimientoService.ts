import api from "@/services/api";

export type SuperadminEstablecimientoTipo =
  | "restaurant"
  | "cafe"
  | "dark_kitchen"
  | "bar"
  | "clothing_store";

export interface SuperadminEstablecimientoOwner {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
}

export interface SuperadminEstablecimientoPlan {
  id: number;
  name: string;
  price: number;
  currency: string;
  interval: string;
}

export interface SuperadminEstablecimientoSubscription {
  id: number;
  status: string;
  plan_id: number | null;
  plan_price: number | null;
  currency: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  next_billing_date: string | null;
  cancel_at_period_end: boolean;
  plan: SuperadminEstablecimientoPlan | null;
}

export interface SuperadminEstablecimiento {
  id: number;
  user_id: number;
  slug: string;
  nombre: string;
  descripcion: string | null;
  direccion: string | null;
  ciudad: string | null;
  pais: string | null;
  telefono_contacto: string | null;
  lat: number | string | null;
  lng: number | string | null;
  logo_url: string | null;
  imagen_ubicacion_url: string | null;
  activo: boolean;
  verificado?: boolean;
  domicilio_activo: boolean;
  tipo_establecimiento: SuperadminEstablecimientoTipo | null;
  createdAt: string;
  updatedAt: string;
  owner: SuperadminEstablecimientoOwner | null;
  subscription: SuperadminEstablecimientoSubscription | null;
}

export interface SuperadminEstablecimientosPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SuperadminEstablecimientosResponse {
  data: SuperadminEstablecimiento[];
  pagination: SuperadminEstablecimientosPagination;
}

export interface GetSuperadminEstablecimientosParams {
  page?: number;
  limit?: number;
  search?: string;
  activo?: boolean | "";
  ciudad?: string;
  pais?: string;
  tipo_establecimiento?: SuperadminEstablecimientoTipo | "";
}

export async function getSuperadminEstablecimientos(
  params: GetSuperadminEstablecimientosParams = {}
): Promise<SuperadminEstablecimientosResponse> {
  const { data } = await api.get<SuperadminEstablecimientosResponse>(
    "/api/superadmin/establecimientos",
    { params: cleanParams(params) }
  );

  return data;
}

export async function getSuperadminEstablecimientoById(
  id: number
): Promise<SuperadminEstablecimiento> {
  const { data } = await api.get<SuperadminEstablecimiento>(
    `/api/superadmin/establecimientos/${id}`
  );

  return data;
}

export async function updateSuperadminEstablecimientoVerificado(
  id: number,
  verificado: boolean
): Promise<SuperadminEstablecimiento> {
  const { data } = await api.patch<SuperadminEstablecimiento>(
    `/api/superadmin/establecimientos/${id}/verificado`,
    { verificado }
  );

  return data;
}

function cleanParams(params: GetSuperadminEstablecimientosParams) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== "" && value != null)
  );
}
