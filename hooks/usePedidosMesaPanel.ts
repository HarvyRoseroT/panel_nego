"use client";

import { useEffect, useMemo, useState } from "react";
import { getStoredToken } from "@/services/authService";
import {
  getMyEstablecimiento,
  type Establecimiento,
} from "@/services/establecimientoService";
import {
  comparePedidosByDateDesc,
  getPedidoMesaById,
  getPedidosMesaByEstablecimiento,
  updatePedidoMesaEstado,
  type PedidoMesa,
  type PedidoMesaEstado,
} from "@/services/pedidoService";

type UsePedidosMesaPanelOptions = {
  autoRefreshMs?: number | null;
};

export function usePedidosMesaPanel(
  options: UsePedidosMesaPanelOptions = {}
) {
  const { autoRefreshMs = null } = options;

  const [establecimiento, setEstablecimiento] =
    useState<Establecimiento | null>(null);
  const [pedidos, setPedidos] = useState<PedidoMesa[]>([]);
  const [selectedPedidoId, setSelectedPedidoId] = useState<number | null>(null);
  const [selectedPedido, setSelectedPedido] = useState<PedidoMesa | null>(null);
  const [estadoFilter, setEstadoFilter] = useState<"todos" | PedidoMesaEstado>(
    "todos"
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [updatingEstado, setUpdatingEstado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadedDetailIds, setLoadedDetailIds] = useState<number[]>([]);

  const filteredPedidos = useMemo(() => {
    const sorted = [...pedidos].sort(comparePedidosByDateDesc);

    if (estadoFilter === "todos") return sorted;

    return sorted.filter((pedido) => pedido.estado === estadoFilter);
  }, [estadoFilter, pedidos]);

  useEffect(() => {
    const run = async () => {
      const token = getStoredToken();
      if (!token) {
        setError("No autorizado");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        setError(null);
        const est = await getMyEstablecimiento(token);
        setEstablecimiento(est);

        if (!est?.id) {
          setPedidos([]);
          return;
        }

        const pedidosData = await getPedidosMesaByEstablecimiento(est.id, token);
        setPedidos(pedidosData);
        setLoadedDetailIds(
          pedidosData
            .filter((pedido) => pedido.items.length > 0)
            .map((pedido) => pedido.id)
        );
      } catch {
        setError("No se pudieron cargar los pedidos por mesa");
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, []);

  useEffect(() => {
    if (!autoRefreshMs || !establecimiento?.id) return;

    const runRefresh = async () => {
      const token = getStoredToken();
      if (!token || !establecimiento?.id) return;

      try {
        const pedidosData = await getPedidosMesaByEstablecimiento(
          establecimiento.id,
          token
        );
        setPedidos(pedidosData);
        setLoadedDetailIds(
          pedidosData
            .filter((pedido) => pedido.items.length > 0)
            .map((pedido) => pedido.id)
        );

        if (selectedPedidoId !== null) {
          const detail = await getPedidoMesaById(selectedPedidoId, token);
          if (detail) {
            setPedidos((current) => mergePedidos(current, detail));
            setLoadedDetailIds((current) =>
              current.includes(detail.id) ? current : [...current, detail.id]
            );
          }
        }
      } catch {
        setError("No se pudieron actualizar los pedidos");
      }
    };

    const intervalId = window.setInterval(() => {
      void runRefresh();
    }, autoRefreshMs);

    return () => window.clearInterval(intervalId);
  }, [autoRefreshMs, establecimiento, selectedPedidoId]);

  useEffect(() => {
    if (!filteredPedidos.length) {
      setSelectedPedidoId(null);
      setSelectedPedido(null);
      return;
    }

    setSelectedPedidoId((current) =>
      current !== null && filteredPedidos.some((pedido) => pedido.id === current)
        ? current
        : filteredPedidos[0].id
    );
  }, [filteredPedidos]);

  useEffect(() => {
    if (selectedPedidoId === null) {
      setSelectedPedido(null);
      return;
    }

    const pedidoFromList =
      pedidos.find((pedido) => pedido.id === selectedPedidoId) ?? null;

    if (!pedidoFromList) {
      setSelectedPedido(null);
      return;
    }

    setSelectedPedido(pedidoFromList);
    if (
      pedidoFromList.items.length > 0 ||
      loadedDetailIds.includes(selectedPedidoId)
    ) {
      return;
    }

    const run = async () => {
      const token = getStoredToken();
      if (!token) return;

      setDetailLoading(true);
      try {
        const detail = await getPedidoMesaById(selectedPedidoId, token);
        setLoadedDetailIds((current) =>
          current.includes(selectedPedidoId)
            ? current
            : [...current, selectedPedidoId]
        );
        if (!detail) return;

        setPedidos((current) => mergePedidos(current, detail));
        setSelectedPedido(detail);
      } finally {
        setDetailLoading(false);
      }
    };

    void run();
  }, [loadedDetailIds, pedidos, selectedPedidoId]);

  async function refreshPedidos(silent = false) {
    const token = getStoredToken();
    if (!token || !establecimiento?.id) return;

    if (!silent) {
      setRefreshing(true);
    }

    try {
      setError(null);
      const pedidosData = await getPedidosMesaByEstablecimiento(
        establecimiento.id,
        token
      );
      setPedidos(pedidosData);
      setLoadedDetailIds(
        pedidosData.filter((pedido) => pedido.items.length > 0).map((pedido) => pedido.id)
      );

      if (selectedPedidoId !== null) {
        const detail = await getPedidoMesaById(selectedPedidoId, token);
        if (detail) {
          setPedidos((current) => mergePedidos(current, detail));
          setLoadedDetailIds((current) =>
            current.includes(detail.id) ? current : [...current, detail.id]
          );
        }
      }
    } catch {
      setError("No se pudieron actualizar los pedidos");
    } finally {
      setRefreshing(false);
    }
  }

  async function changePedidoEstado(estado: PedidoMesaEstado) {
    const token = getStoredToken();
    if (!token || selectedPedidoId === null) return;

    setUpdatingEstado(true);
    try {
      setError(null);
      const updated = await updatePedidoMesaEstado(selectedPedidoId, estado, token);
      if (!updated) {
        setError("No se pudo actualizar el estado del pedido");
        return;
      }

      setPedidos((current) => mergePedidos(current, updated));
      setLoadedDetailIds((current) =>
        current.includes(updated.id) ? current : [...current, updated.id]
      );
      setSelectedPedido(updated);
    } catch {
      setError("No se pudo actualizar el estado del pedido");
    } finally {
      setUpdatingEstado(false);
    }
  }

  return {
    establecimiento,
    pedidos,
    filteredPedidos,
    selectedPedidoId,
    selectedPedido,
    estadoFilter,
    loading,
    refreshing,
    detailLoading,
    updatingEstado,
    error,
    setEstadoFilter,
    setSelectedPedidoId,
    refreshPedidos,
    changePedidoEstado,
  };
}

function mergePedidos(current: PedidoMesa[], updated: PedidoMesa) {
  const next = current.filter((pedido) => pedido.id !== updated.id);
  next.push(updated);
  return next.sort(comparePedidosByDateDesc);
}
