import api from "@/services/api";

export interface Carta {
  id: number;
  nombre: string;
  activa: boolean;
  orden: number;
  establecimiento_id: number;
  createdAt: string;
  updatedAt: string;
}

export async function createCarta(
  payload: { nombre: string; establecimiento_id: number },
  token: string
): Promise<Carta> {
  const { data } = await api.post("/api/cartas", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

export async function getCartasByEstablecimiento(
  establecimientoId: number,
  token: string
): Promise<Carta[]> {
  const { data } = await api.get(
    `/api/cartas/establecimiento/${establecimientoId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
}

export async function getCartaById(
  id: number,
  token: string
): Promise<Carta> {
  const { data } = await api.get(`/api/cartas/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

export async function updateCarta(
  id: number,
  payload: Partial<Pick<Carta, "nombre" | "activa">>,
  token: string
): Promise<Carta> {
  const { data } = await api.put(`/api/cartas/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

export async function deleteCarta(
  id: number,
  token: string
): Promise<void> {
  try {
    await api.delete(`/api/cartas/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    if (error.response?.status === 409) {
      throw new Error(
        "No puedes eliminar una carta que tiene secciones o productos"
      );
    }
    throw error;
  }
}

export async function deactivateCarta(
  id: number,
  token: string
): Promise<void> {
  await api.patch(
    `/api/cartas/${id}/deactivate`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export async function updateCartasOrden(
  establecimientoId: number,
  ordenes: { id: number; orden: number }[],
  token: string
): Promise<void> {
  await api.put(
    "/api/cartas/orden",
    {
      establecimiento_id: establecimientoId,
      ordenes,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
