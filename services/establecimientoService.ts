import api from "@/services/api";

export interface Establecimiento {
  id: number;
  nombre: string;
  descripcion: string | null;
  pais: string;
  ciudad: string;
  direccion: string;
  telefono_contacto: string | null;
  lat: number | null;
  lng: number | null;
  logo_url: string | null;
  imagen_ubicacion_url: string | null;
  activo: boolean;
  domicilio_activo: boolean;
  user_id: number;
  createdAt: string;
  updatedAt: string;
}

export type EstablecimientoPayload = {
  nombre: string;
  descripcion: string | null;
  pais: string;
  ciudad: string;
  direccion: string;
  telefono_contacto: string | null;
  lat: number | null;
  lng: number | null;
  activo: boolean;
  domicilio_activo: boolean;
};

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

export async function subirLogoEstablecimiento(
  id: number,
  file: File,
  token: string
): Promise<{ success: boolean; logo_url: string }> {
  const formData = new FormData();
  formData.append("image", file);

  const { data } = await api.put(
    `/establecimientos/${id}/logo`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
}

export async function borrarLogoEstablecimiento(
  id: number,
  token: string
): Promise<{ success: boolean }> {
  const { data } = await api.delete(
    `/establecimientos/${id}/logo`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
}

export async function subirImagenUbicacionEstablecimiento(
  id: number,
  file: File,
  token: string
): Promise<{ success: boolean; imagen_ubicacion_url: string }> {
  const formData = new FormData();
  formData.append("image", file);

  const { data } = await api.put(
    `/establecimientos/${id}/imagen-ubicacion`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
}

export async function borrarImagenUbicacionEstablecimiento(
  id: number,
  token: string
): Promise<{ success: boolean }> {
  const { data } = await api.delete(
    `/establecimientos/${id}/imagen-ubicacion`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
}
