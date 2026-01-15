import api from "@/services/api";

export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string | null;
  precio?: number | null;
  orden: number;
  activo: boolean;
  seccion_id: number;
  establecimiento_id: number;
  imagen_url?: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function createProducto(
  payload: {
    nombre: string;
    descripcion?: string;
    precio?: number;
    seccion_id: number;
    activo?: boolean;
  },
  token: string
): Promise<Producto> {
  const { data } = await api.post("/api/productos", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

export async function getProductosBySeccion(
  seccionId: number,
  token: string
): Promise<Producto[]> {
  const { data } = await api.get(`/api/productos/seccion/${seccionId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

export async function getProductosByEstablecimiento(
  establecimientoId: number,
  token: string
): Promise<Producto[]> {
  const { data } = await api.get(
    `/api/productos/establecimiento/${establecimientoId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
}


export async function getProductoById(
  id: number,
  token: string
): Promise<Producto> {
  const { data } = await api.get(`/api/productos/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

export async function updateProducto(
  id: number,
  payload: {
    nombre?: string;
    descripcion?: string;
    precio?: number;
    activo?: boolean;
  },
  token: string
): Promise<Producto> {
  const { data } = await api.put(`/api/productos/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

export async function deleteProducto(
  id: number,
  token: string
): Promise<void> {
  await api.delete(`/api/productos/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function reordenarProductos(
  ordenes: { id: number; orden: number }[],
  token: string
): Promise<{ message: string }> {
  const { data } = await api.put(
    "/api/productos/reordenar/orden",
    ordenes,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
}

export async function subirImagenProducto(
  id: number,
  file: File,
  token: string
): Promise<{ success: boolean; imagen_url: string }> {
  const formData = new FormData();
  formData.append("image", file);

  const { data } = await api.put(
    `/api/productos/${id}/imagen`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
}

export async function borrarImagenProducto(
  id: number,
  token: string
): Promise<{ success: boolean; message: string }> {
  const { data } = await api.delete(
    `/api/productos/${id}/imagen`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
}
