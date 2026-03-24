import api from "@/services/api";

export type PlanoElementoTipo = "mesa" | "objeto_cuadrado";

export interface PlanoElemento {
  id: number;
  plano_establecimiento_id: number;
  tipo: PlanoElementoTipo;
  nombre: string;
  capacidad: number | null;
  posicion_x: number;
  posicion_y: number;
  ancho: number;
  alto: number;
}

export interface PlanoEstablecimiento {
  id: number;
  establecimiento_id: number;
  nombre: string;
  ancho: number;
  alto: number;
  elementos: PlanoElemento[];
}

export interface CreatePlanoEstablecimientoPayload {
  establecimiento_id: number;
  nombre: string;
  ancho: number;
  alto: number;
}

export interface UpdatePlanoEstablecimientoPayload {
  nombre: string;
  ancho: number;
  alto: number;
}

export interface CreateMesaPayload {
  tipo: "mesa";
  nombre: string;
  capacidad: number;
  posicion_x: number;
  posicion_y: number;
  ancho: number;
  alto: number;
}

export interface CreateObjetoPayload {
  tipo: "objeto_cuadrado";
  nombre: string;
  posicion_x: number;
  posicion_y: number;
  ancho: number;
  alto: number;
}

export type CreatePlanoElementoPayload =
  | CreateMesaPayload
  | CreateObjetoPayload;

export type UpdatePlanoElementoPayload = Partial<CreatePlanoElementoPayload>;

type ApiRecord = Record<string, unknown>;

function normalizeElemento(raw: ApiRecord): PlanoElemento {
  return {
    id: Number(raw.id),
    plano_establecimiento_id: Number(
      raw.plano_establecimiento_id ?? raw.planoId ?? raw.plano_id ?? 0
    ),
    tipo: raw.tipo,
    nombre: raw.nombre ?? "",
    capacidad:
      raw.capacidad === null || raw.capacidad === undefined
        ? null
        : Number(raw.capacidad),
    posicion_x: Number(raw.posicion_x ?? raw.x ?? 0),
    posicion_y: Number(raw.posicion_y ?? raw.y ?? 0),
    ancho: Number(raw.ancho ?? 0),
    alto: Number(raw.alto ?? 0),
  };
}

function normalizePlano(raw: ApiRecord): PlanoEstablecimiento {
  const elementosRaw = raw.elementos ?? raw.Elementos ?? raw.items ?? [];

  return {
    id: Number(raw.id),
    establecimiento_id: Number(raw.establecimiento_id),
    nombre: raw.nombre ?? "",
    ancho: Number(raw.ancho ?? 0),
    alto: Number(raw.alto ?? 0),
    elementos: Array.isArray(elementosRaw)
      ? elementosRaw.map(normalizeElemento)
      : [],
  };
}

export async function createPlanoEstablecimiento(
  payload: CreatePlanoEstablecimientoPayload,
  token: string
): Promise<PlanoEstablecimiento> {
  const { data } = await api.post("/api/planos-establecimiento", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return normalizePlano(data);
}

export async function getPlanoByEstablecimiento(
  establecimientoId: number,
  token: string
): Promise<PlanoEstablecimiento | null> {
  try {
    const { data } = await api.get(
      `/api/planos-establecimiento/establecimiento/${establecimientoId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return normalizePlano(data);
  } catch (error: unknown) {
    const status = (error as { response?: { status?: number } })?.response
      ?.status;
    if (status === 404) return null;
    throw error;
  }
}

export async function getPlanoById(
  id: number,
  token: string
): Promise<PlanoEstablecimiento> {
  const { data } = await api.get(`/api/planos-establecimiento/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return normalizePlano(data);
}

export async function updatePlanoEstablecimiento(
  id: number,
  payload: UpdatePlanoEstablecimientoPayload,
  token: string
): Promise<PlanoEstablecimiento> {
  const { data } = await api.put(`/api/planos-establecimiento/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return normalizePlano(data);
}

export async function deletePlanoEstablecimiento(
  id: number,
  token: string
): Promise<void> {
  await api.delete(`/api/planos-establecimiento/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function createPlanoElemento(
  planoId: number,
  payload: CreatePlanoElementoPayload,
  token: string
): Promise<PlanoElemento> {
  const { data } = await api.post(
    `/api/planos-establecimiento/${planoId}/elementos`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return normalizeElemento(data);
}

export async function updatePlanoElemento(
  planoId: number,
  elementoId: number,
  payload: UpdatePlanoElementoPayload,
  token: string
): Promise<PlanoElemento> {
  const { data } = await api.put(
    `/api/planos-establecimiento/${planoId}/elementos/${elementoId}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return normalizeElemento(data);
}

export async function deletePlanoElemento(
  planoId: number,
  elementoId: number,
  token: string
): Promise<void> {
  await api.delete(
    `/api/planos-establecimiento/${planoId}/elementos/${elementoId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
