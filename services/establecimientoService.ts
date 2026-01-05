import api from "@/services/api";

export interface Establecimiento {
  id: number;
  nombre: string;
  tipo: string;
  descripcion: string | null;
  pais: string;
  ciudad: string;
  direccion: string;
  lat: number | null;
  lng: number | null;
  logo: string | null;
  activo: boolean;
  user_id: number;
  createdAt: string;
  updatedAt: string;
}

export type EstablecimientoPayload = Omit<
  Establecimiento,
  "id" | "user_id" | "createdAt" | "updatedAt"
>;

export async function createEstablecimiento(
  payload: EstablecimientoPayload,
  token: string
): Promise<Establecimiento> {
  const { data } = await api.post("/establecimientos", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

export async function getMyEstablecimiento(
  token: string
): Promise<Establecimiento> {
  const { data } = await api.get("/establecimientos", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

export async function updateEstablecimiento(
  id: number,
  payload: Partial<EstablecimientoPayload>,
  token: string
): Promise<Establecimiento> {
  const { data } = await api.put(`/establecimientos/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

export async function deleteEstablecimiento(
  id: number,
  token: string
): Promise<void> {
  await api.delete(`/establecimientos/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
