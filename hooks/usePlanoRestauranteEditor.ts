"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getStoredToken } from "@/services/authService";
import {
  type PlanoElemento,
  type PlanoElementoTipo,
  type PlanoEstablecimiento,
  createPlanoElemento,
  createPlanoEstablecimiento,
  deletePlanoElemento,
  getPlanoByEstablecimiento,
  getPlanoById,
  updatePlanoElemento,
  updatePlanoEstablecimiento,
} from "@/services/planoEstablecimientoService";
import {
  getMyEstablecimiento,
  type Establecimiento,
} from "@/services/establecimientoService";

export const MIN_PLANO_SIZE = 240;
export const MAX_PLANO_WIDTH = 600;
export const MAX_PLANO_HEIGHT = 550;
const MIN_ELEMENT_SIZE = 40;
export type PlanoOrientacion = "horizontal" | "vertical";

const ORIENTATION_DIMENSIONS: Record<
  PlanoOrientacion,
  { ancho: number; alto: number }
> = {
  horizontal: {
    ancho: 600,
    alto: 350,
  },
  vertical: {
    ancho: 450,
    alto: 550,
  },
};

const DEFAULT_PLANO = {
  nombre: "Plano principal",
  ...ORIENTATION_DIMENSIONS.horizontal,
};

export interface DraftPlano {
  nombre: string;
  ancho: number;
  alto: number;
}

export interface DraftPlanoElemento {
  localId: string;
  id?: number;
  tipo: PlanoElementoTipo;
  nombre: string;
  capacidad: number | null;
  posicion_x: number;
  posicion_y: number;
  ancho: number;
  alto: number;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function normalizePlanoNumber(value: number, max: number) {
  if (!Number.isFinite(value)) return max;
  return clamp(Math.round(value), MIN_PLANO_SIZE, max);
}

function sanitizeElemento(
  element: DraftPlanoElemento,
  plano: DraftPlano
): DraftPlanoElemento {
  const baseAncho = clamp(
    Math.round(element.ancho),
    MIN_ELEMENT_SIZE,
    plano.ancho
  );
  const baseAlto = clamp(
    Math.round(element.alto),
    MIN_ELEMENT_SIZE,
    plano.alto
  );
  const size = element.tipo === "mesa" ? Math.max(baseAncho, baseAlto) : null;
  const ancho = clamp(size ?? baseAncho, MIN_ELEMENT_SIZE, plano.ancho);
  const alto = clamp(size ?? baseAlto, MIN_ELEMENT_SIZE, plano.alto);

  return {
    ...element,
    nombre: element.nombre || (element.tipo === "mesa" ? "Mesa" : "Objeto"),
    capacidad:
      element.tipo === "mesa"
        ? clamp(Math.round(element.capacidad ?? 4), 1, 24)
        : null,
    ancho,
    alto,
    posicion_x: clamp(Math.round(element.posicion_x), 0, plano.ancho - ancho),
    posicion_y: clamp(Math.round(element.posicion_y), 0, plano.alto - alto),
  };
}

function draftFromElemento(
  element: PlanoElemento,
  index: number
): DraftPlanoElemento {
  return {
    localId: `persisted-${element.id}-${index}`,
    id: element.id,
    tipo: element.tipo,
    nombre: element.nombre,
    capacidad: element.capacidad,
    posicion_x: element.posicion_x,
    posicion_y: element.posicion_y,
    ancho: element.ancho,
    alto: element.alto,
  };
}

function createDraftElemento(
  tipo: PlanoElementoTipo,
  plano: DraftPlano,
  serial: number
): DraftPlanoElemento {
  const baseSize = tipo === "mesa" ? 96 : 72;
  const initial = sanitizeElemento(
    {
      localId: `new-${serial}`,
      tipo,
      nombre: tipo === "mesa" ? `Mesa ${serial}` : `Objeto ${serial}`,
      capacidad: tipo === "mesa" ? 4 : null,
      posicion_x: 32,
      posicion_y: 32,
      ancho: baseSize,
      alto: baseSize,
    },
    plano
  );

  return initial;
}

function hasPlanoChanged(
  original: PlanoEstablecimiento | null,
  draft: DraftPlano
) {
  if (!original) return true;

  return (
    original.nombre !== draft.nombre ||
    original.ancho !== draft.ancho ||
    original.alto !== draft.alto
  );
}

function hasElementoChanged(
  original: DraftPlanoElemento | undefined,
  current: DraftPlanoElemento
) {
  if (!original) return true;

  return (
    original.tipo !== current.tipo ||
    original.nombre !== current.nombre ||
    (original.capacidad ?? null) !== (current.capacidad ?? null) ||
    original.posicion_x !== current.posicion_x ||
    original.posicion_y !== current.posicion_y ||
    original.ancho !== current.ancho ||
    original.alto !== current.alto
  );
}

function getOrientationFromPlano(plano: Pick<DraftPlano, "ancho" | "alto">): PlanoOrientacion {
  return plano.alto > plano.ancho ? "vertical" : "horizontal";
}

export function usePlanoRestauranteEditor() {
  const [establecimiento, setEstablecimiento] =
    useState<Establecimiento | null>(null);
  const [plano, setPlano] = useState<PlanoEstablecimiento | null>(null);
  const [draftPlano, setDraftPlano] = useState<DraftPlano>(DEFAULT_PLANO);
  const [elementos, setElementos] = useState<DraftPlanoElemento[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const serialRef = useRef(1);

  const isCompatible =
    establecimiento?.tipo_establecimiento !== "clothing_store";

  useEffect(() => {
    const load = async () => {
      const token = getStoredToken();
      if (!token) {
        setError("No autorizado");
        setLoading(false);
        return;
      }

      try {
        const currentEstablecimiento = await getMyEstablecimiento(token);
        setEstablecimiento(currentEstablecimiento);

        if (!currentEstablecimiento?.id) {
          setPlano(null);
          setDraftPlano(DEFAULT_PLANO);
          setElementos([]);
          return;
        }

        const foundPlano = await getPlanoByEstablecimiento(
          currentEstablecimiento.id,
          token
        );

        if (!foundPlano) {
          setPlano(null);
          setDraftPlano(DEFAULT_PLANO);
          setElementos([]);
          return;
        }

        setPlano(foundPlano);
        setDraftPlano({
          nombre: foundPlano.nombre,
          ancho: foundPlano.ancho,
          alto: foundPlano.alto,
        });
        setElementos(
          foundPlano.elementos.map((element, index) =>
            sanitizeElemento(
              draftFromElemento(element, index),
              {
                nombre: foundPlano.nombre,
                ancho: foundPlano.ancho,
                alto: foundPlano.alto,
              }
            )
          )
        );
      } catch {
        setError("No se pudo cargar el plano del restaurante");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    setElementos((current) =>
      current.map((element) => sanitizeElemento(element, draftPlano))
    );
  }, [draftPlano]);

  useEffect(() => {
    if (!successMessage) return;

    const timeout = window.setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);

    return () => window.clearTimeout(timeout);
  }, [successMessage]);

  const originalElementMap = useMemo(() => {
    return new Map(
      (plano?.elementos ?? []).map((element, index) => [
        element.id,
        draftFromElemento(element, index),
      ])
    );
  }, [plano]);

  const hasUnsavedChanges = useMemo(() => {
    if (!plano && elementos.length === 0) return false;
    if (hasPlanoChanged(plano, draftPlano)) return true;

    const originalIds = new Set((plano?.elementos ?? []).map((item) => item.id));
    const currentIds = new Set(
      elementos
        .map((item) => item.id)
        .filter((id): id is number => typeof id === "number")
    );

    if (originalIds.size !== currentIds.size) return true;

    for (const id of originalIds) {
      if (!currentIds.has(id)) return true;
    }

    return elementos.some((element) =>
      hasElementoChanged(
        typeof element.id === "number"
          ? originalElementMap.get(element.id)
          : undefined,
        element
      )
    );
  }, [draftPlano, elementos, originalElementMap, plano]);

  const selectedElement =
    elementos.find((element) => element.localId === selectedId) ?? null;
  const planoOrientacion = getOrientationFromPlano(draftPlano);

  const setPlanoField = (field: keyof DraftPlano, value: string | number) => {
    setDraftPlano((current) => {
      if (field === "nombre") {
        return {
          ...current,
          nombre: String(value),
        };
      }

      const numericValue =
        typeof value === "number" ? value : Number.parseInt(String(value), 10);
      const nextValue = Number.isFinite(numericValue)
        ? numericValue
        : current[field];

      return {
        ...current,
        [field]: normalizePlanoNumber(
          nextValue,
          field === "alto" ? MAX_PLANO_HEIGHT : MAX_PLANO_WIDTH
        ),
      };
    });
  };

  const setPlanoOrientacion = (orientacion: PlanoOrientacion) => {
    const dimensions = ORIENTATION_DIMENSIONS[orientacion];

    setDraftPlano((current) => ({
      ...current,
      ancho: dimensions.ancho,
      alto: dimensions.alto,
    }));
  };

  const selectElement = (localId: string | null) => {
    setSelectedId(localId);
  };

  const addElement = (tipo: PlanoElementoTipo) => {
    const nextSerial = serialRef.current++;
    const next = createDraftElemento(tipo, draftPlano, nextSerial);
    setElementos((current) => [...current, next]);
    setSelectedId(next.localId);
  };

  const addAutomaticTables = (count: number) => {
    const total = clamp(Math.round(count), 1, 100);
    const padding = 20;
    const gap = 14;
    const usableWidth = Math.max(draftPlano.ancho - padding * 2, MIN_ELEMENT_SIZE);
    const usableHeight = Math.max(draftPlano.alto - padding * 2, MIN_ELEMENT_SIZE);

    let bestCols = 1;
    let bestRows = total;
    let bestSize = MIN_ELEMENT_SIZE;

    for (let cols = 1; cols <= total; cols += 1) {
      const rows = Math.ceil(total / cols);
      const widthPerItem = Math.floor((usableWidth - gap * (cols - 1)) / cols);
      const heightPerItem = Math.floor((usableHeight - gap * (rows - 1)) / rows);
      const size = Math.min(widthPerItem, heightPerItem);

      if (size > bestSize) {
        bestSize = size;
        bestCols = cols;
        bestRows = rows;
      }
    }

    const finalSize = clamp(bestSize, MIN_ELEMENT_SIZE, 120);
    const occupiedWidth = bestCols * finalSize + gap * (bestCols - 1);
    const occupiedHeight = bestRows * finalSize + gap * (bestRows - 1);
    const offsetX = Math.max(Math.floor((draftPlano.ancho - occupiedWidth) / 2), 0);
    const offsetY = Math.max(Math.floor((draftPlano.alto - occupiedHeight) / 2), 0);

    const created: DraftPlanoElemento[] = [];

    for (let index = 0; index < total; index += 1) {
      const row = Math.floor(index / bestCols);
      const col = index % bestCols;
      const nextSerial = serialRef.current++;

      created.push(
        sanitizeElemento(
          {
            localId: `new-${nextSerial}`,
            tipo: "mesa",
            nombre: `Mesa ${nextSerial}`,
            capacidad: 4,
            posicion_x: offsetX + col * (finalSize + gap),
            posicion_y: offsetY + row * (finalSize + gap),
            ancho: finalSize,
            alto: finalSize,
          },
          draftPlano
        )
      );
    }

    setElementos((current) => [...current, ...created]);
    setSelectedId(created[0]?.localId ?? null);
  };

  const updateElement = (
    localId: string,
    changes: Partial<DraftPlanoElemento>
  ) => {
    setElementos((current) =>
      current.map((element) =>
        element.localId === localId
          ? sanitizeElemento({ ...element, ...changes }, draftPlano)
          : element
      )
    );
  };

  const updateSelectedElement = (changes: Partial<DraftPlanoElemento>) => {
    if (!selectedId) return;
    updateElement(selectedId, changes);
  };

  const moveElement = (localId: string, x: number, y: number) => {
    updateElement(localId, {
      posicion_x: x,
      posicion_y: y,
    });
  };

  const resizeElement = (
    localId: string,
    ancho: number,
    alto: number
  ) => {
    updateElement(localId, {
      ancho,
      alto,
    });
  };

  const removeElement = (localId: string) => {
    setElementos((current) =>
      current.filter((element) => element.localId !== localId)
    );
    setSelectedId((current) => (current === localId ? null : current));
  };

  const resetDraft = (nextPlano: PlanoEstablecimiento | null) => {
    setPlano(nextPlano);

    if (!nextPlano) {
      setDraftPlano(DEFAULT_PLANO);
      setElementos([]);
      setSelectedId(null);
      return;
    }

    const nextDraftPlano = {
      nombre: nextPlano.nombre,
      ancho: nextPlano.ancho,
      alto: nextPlano.alto,
    };

    setDraftPlano(nextDraftPlano);
    setElementos(
      nextPlano.elementos.map((element, index) =>
        sanitizeElemento(draftFromElemento(element, index), nextDraftPlano)
      )
    );
    setSelectedId(null);
  };

  const save = async () => {
    if (!establecimiento?.id) return;

    const token = getStoredToken();
    if (!token) {
      setError("No autorizado");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      let currentPlanoId = plano?.id;

      if (!currentPlanoId) {
        const createdPlano = await createPlanoEstablecimiento(
          {
            establecimiento_id: establecimiento.id,
            nombre: draftPlano.nombre.trim() || DEFAULT_PLANO.nombre,
            ancho: draftPlano.ancho,
            alto: draftPlano.alto,
          },
          token
        );

        currentPlanoId = createdPlano.id;
      } else if (hasPlanoChanged(plano, draftPlano)) {
        await updatePlanoEstablecimiento(
          currentPlanoId,
          {
            nombre: draftPlano.nombre.trim() || DEFAULT_PLANO.nombre,
            ancho: draftPlano.ancho,
            alto: draftPlano.alto,
          },
          token
        );
      }

      if (!currentPlanoId) return;

      const originalIds = new Set((plano?.elementos ?? []).map((item) => item.id));
      const currentExistingIds = new Set(
        elementos
          .map((item) => item.id)
          .filter((id): id is number => typeof id === "number")
      );

      for (const originalId of originalIds) {
        if (!currentExistingIds.has(originalId)) {
          await deletePlanoElemento(currentPlanoId, originalId, token);
        }
      }

      for (const element of elementos) {
        const payload =
          element.tipo === "mesa"
            ? {
                tipo: "mesa" as const,
                nombre: element.nombre.trim() || "Mesa",
                capacidad: clamp(Math.round(element.capacidad ?? 4), 1, 24),
                posicion_x: element.posicion_x,
                posicion_y: element.posicion_y,
                ancho: element.ancho,
                alto: element.alto,
              }
            : {
                tipo: "objeto_cuadrado" as const,
                nombre: element.nombre.trim() || "Objeto",
                posicion_x: element.posicion_x,
                posicion_y: element.posicion_y,
                ancho: element.ancho,
                alto: element.alto,
              };

        if (!element.id) {
          await createPlanoElemento(currentPlanoId, payload, token);
          continue;
        }

        const original = originalElementMap.get(element.id);
        if (hasElementoChanged(original, element)) {
          await updatePlanoElemento(currentPlanoId, element.id, payload, token);
        }
      }

      const refreshed = await getPlanoById(currentPlanoId, token);
      resetDraft(refreshed);
      setSuccessMessage("Cambios guardados");
    } catch {
      setError("No se pudieron guardar los cambios del plano");
    } finally {
      setSaving(false);
    }
  };

  const startCreatingPlan = () => {
    setDraftPlano(DEFAULT_PLANO);
    setElementos([]);
    setSelectedId(null);
  };

  return {
    establecimiento,
    plano,
    draftPlano,
    elementos,
    selectedElement,
    planoOrientacion,
    selectedId,
    loading,
    saving,
    error,
    successMessage,
    hasUnsavedChanges,
    isCompatible,
    setPlanoField,
    setPlanoOrientacion,
    selectElement,
    addElement,
    addAutomaticTables,
    updateSelectedElement,
    moveElement,
    resizeElement,
    removeElement,
    save,
    startCreatingPlan,
  };
}
