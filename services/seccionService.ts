import api from "@/services/api";

export interface Seccion {
  id: number;
  nombre: string;
  orden: number;
  carta_id: number;
  createdAt: string;
  updatedAt: string;
}

export async function createSeccion(
  payload: {
    nombre: string;
    carta_id: number;
    orden?: number;
  },
  token: string
): Promise<Seccion> {
  const { data } = await api.post("/api/secciones", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

export async function getSeccionesByCarta(
  cartaId: number,
  token: string
): Promise<Seccion[]> {
  const { data } = await api.get(`/api/secciones/carta/${cartaId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

export async function getSeccionById(
  id: number,
  token: string
): Promise<Seccion> {
  const { data } = await api.get(`/api/secciones/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}


export async function updateSeccion(
  id: number,
  payload: Partial<Pick<Seccion, "nombre" | "orden">>,
  token: string
): Promise<Seccion> {
  const { data } = await api.put(`/api/secciones/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

export async function deleteSeccion(
  id: number,
  token: string
): Promise<void> {
  await api.delete(`/api/secciones/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function reordenarSecciones(
  ordenes: { id: number; orden: number }[],
  token: string
): Promise<void> {
  await api.put(
    "/api/secciones/reordenar/orden",
    ordenes,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
