"use client";

import type { AxiosError } from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getSuperadminEstablecimientos,
  SuperadminEstablecimiento,
  SuperadminEstablecimientoTipo,
  SuperadminEstablecimientosPagination,
  updateSuperadminEstablecimientoVerificado,
} from "@/services/superadminEstablecimientoService";

const ESTABLECIMIENTO_TIPOS: Array<{
  value: SuperadminEstablecimientoTipo;
  label: string;
}> = [
  { value: "restaurant", label: "Restaurante" },
  { value: "cafe", label: "Cafe" },
  { value: "dark_kitchen", label: "Dark kitchen" },
  { value: "bar", label: "Bar" },
  { value: "clothing_store", label: "Tienda de ropa" },
];

type ActivoFilter = "" | "true" | "false";

export default function AdminEstablecimientosPage() {
  const [establecimientos, setEstablecimientos] = useState<
    SuperadminEstablecimiento[]
  >([]);
  const [pagination, setPagination] =
    useState<SuperadminEstablecimientosPagination>({
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 1,
    });

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activo, setActivo] = useState<ActivoFilter>("");
  const [tipo, setTipo] = useState<SuperadminEstablecimientoTipo | "">("");
  const [loading, setLoading] = useState(true);
  const [updatingVerifiedId, setUpdatingVerifiedId] = useState<number | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setPage(1);
      setDebouncedSearch(search.trim());
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [search]);

  const loadEstablecimientos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getSuperadminEstablecimientos({
        page,
        limit: 20,
        search: debouncedSearch,
        activo: activo === "" ? "" : activo === "true",
        tipo_establecimiento: tipo,
      });

      setEstablecimientos(response.data);
      setPagination(response.pagination);
    } catch (error) {
      setError(
        getErrorMessage(error, "No se pudieron cargar los negocios registrados")
      );
    } finally {
      setLoading(false);
    }
  }, [activo, debouncedSearch, page, tipo]);

  useEffect(() => {
    loadEstablecimientos();
  }, [loadEstablecimientos]);

  const pageSummary = useMemo(() => {
    if (pagination.total === 0) return "0 negocios";

    const start = (pagination.page - 1) * pagination.limit + 1;
    const end = Math.min(pagination.page * pagination.limit, pagination.total);

    return `${start}-${end} de ${pagination.total} negocios`;
  }, [pagination]);

  function handleActivoChange(value: ActivoFilter) {
    setPage(1);
    setActivo(value);
  }

  function handleTipoChange(value: SuperadminEstablecimientoTipo | "") {
    setPage(1);
    setTipo(value);
  }

  async function handleVerificadoToggle(
    establecimiento: SuperadminEstablecimiento
  ) {
    if (updatingVerifiedId) return;

    const nextVerificado = !Boolean(establecimiento.verificado);

    try {
      setUpdatingVerifiedId(establecimiento.id);
      setError(null);

      setEstablecimientos((current) =>
        current.map((item) =>
          item.id === establecimiento.id
            ? { ...item, verificado: nextVerificado }
            : item
        )
      );

      const updated = await updateSuperadminEstablecimientoVerificado(
        establecimiento.id,
        nextVerificado
      );

      setEstablecimientos((current) =>
        current.map((item) => (item.id === updated.id ? updated : item))
      );
    } catch (error) {
      setEstablecimientos((current) =>
        current.map((item) =>
          item.id === establecimiento.id
            ? { ...item, verificado: establecimiento.verificado }
            : item
        )
      );
      setError(
        getErrorMessage(error, "No se pudo actualizar la verificacion")
      );
    } finally {
      setUpdatingVerifiedId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
            Superadmin
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white">
            Negocios registrados
          </h1>
        </div>

        <p className="text-sm text-neutral-400">{pageSummary}</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      )}

      <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(260px,1fr)_180px_220px]">
          <label className="block">
            <span className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
              Buscar
            </span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Nombre, slug, ciudad o pais"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-green-500 focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
              Activo
            </span>
            <select
              value={activo}
              onChange={(event) =>
                handleActivoChange(event.target.value as ActivoFilter)
              }
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white focus:border-green-500 focus:outline-none"
            >
              <option value="">Todos</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
              Tipo
            </span>
            <select
              value={tipo}
              onChange={(event) =>
                handleTipoChange(
                  event.target.value as SuperadminEstablecimientoTipo | ""
                )
              }
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white focus:border-green-500 focus:outline-none"
            >
              <option value="">Todos</option>
              {ESTABLECIMIENTO_TIPOS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1280px] text-left text-sm">
            <thead className="border-b border-neutral-800 bg-neutral-800 text-neutral-400">
              <tr>
                <th className="p-4">Negocio</th>
                <th>Ciudad/Pais</th>
                <th>Tipo</th>
                <th>Estado activo</th>
                <th>Verificado</th>
                <th>Dueno</th>
                <th>Email</th>
                <th>Estado suscripcion</th>
                <th>Plan</th>
                <th className="p-4">Fecha de registro</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-neutral-500">
                    Cargando negocios...
                  </td>
                </tr>
              ) : establecimientos.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-neutral-500">
                    No hay negocios registrados con estos filtros.
                  </td>
                </tr>
              ) : (
                establecimientos.map((establecimiento) => (
                  <tr
                    key={establecimiento.id}
                    className="border-b border-neutral-800 hover:bg-neutral-800/40"
                  >
                    <td className="p-4">
                      <div className="font-medium text-neutral-100">
                        {establecimiento.nombre || "Sin nombre"}
                      </div>
                      <div className="mt-1 max-w-48 truncate font-mono text-xs text-neutral-500">
                        {establecimiento.slug || `ID ${establecimiento.id}`}
                      </div>
                    </td>

                    <td className="text-neutral-300">
                      {formatLocation(establecimiento)}
                    </td>

                    <td className="text-neutral-300">
                      {formatTipo(establecimiento.tipo_establecimiento)}
                    </td>

                    <td>
                      <ActiveBadge active={establecimiento.activo} />
                    </td>

                    <td>
                      <ToggleButton
                        checked={Boolean(establecimiento.verificado)}
                        disabled={updatingVerifiedId === establecimiento.id}
                        onClick={() => handleVerificadoToggle(establecimiento)}
                      />
                    </td>

                    <td className="text-neutral-300">
                      {establecimiento.owner?.name || "Sin dueno"}
                    </td>

                    <td className="text-neutral-300">
                      {establecimiento.owner?.email || "Sin email"}
                    </td>

                    <td>
                      <SubscriptionBadge
                        status={establecimiento.subscription?.status}
                      />
                    </td>

                    <td className="text-neutral-300">
                      {establecimiento.subscription?.plan?.name ||
                        formatPlanFallback(establecimiento)}
                    </td>

                    <td className="p-4 text-neutral-300">
                      {formatDate(establecimiento.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-neutral-800 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-neutral-400">
            Pagina {pagination.page} de {Math.max(pagination.totalPages, 1)}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(current - 1, 1))}
              disabled={loading || pagination.page <= 1}
              className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-200 transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Anterior
            </button>
            <button
              type="button"
              onClick={() =>
                setPage((current) =>
                  Math.min(current + 1, Math.max(pagination.totalPages, 1))
                )
              }
              disabled={loading || pagination.page >= pagination.totalPages}
              className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-200 transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleButton({
  checked,
  disabled,
  onClick,
}: {
  checked: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={checked}
      className={`flex h-6 w-12 items-center rounded-full p-1 transition disabled:cursor-not-allowed disabled:opacity-60 ${
        checked ? "bg-green-500" : "bg-neutral-600"
      }`}
      title={checked ? "Deshabilitar verificacion" : "Habilitar verificacion"}
    >
      <span
        className={`h-4 w-4 rounded-full bg-white shadow-md transition ${
          checked ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function ActiveBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        active ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"
      }`}
    >
      {active ? "Activo" : "Inactivo"}
    </span>
  );
}

function SubscriptionBadge({ status }: { status?: string }) {
  const colors: Record<string, string> = {
    active: "bg-green-500/15 text-green-400",
    trialing: "bg-blue-500/15 text-blue-400",
    past_due: "bg-yellow-500/15 text-yellow-400",
    canceled: "bg-red-500/15 text-red-400",
    cancelled: "bg-red-500/15 text-red-400",
    inactive: "bg-neutral-700 text-neutral-300",
  };

  const normalized = status || "sin suscripcion";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        colors[normalized] || "bg-neutral-700 text-neutral-300"
      }`}
    >
      {formatStatus(normalized)}
    </span>
  );
}

function formatLocation(establecimiento: SuperadminEstablecimiento) {
  const parts = [establecimiento.ciudad, establecimiento.pais].filter(Boolean);
  return parts.length ? parts.join(" / ") : "Sin ubicacion";
}

function formatTipo(tipo: SuperadminEstablecimientoTipo | null) {
  return ESTABLECIMIENTO_TIPOS.find((item) => item.value === tipo)?.label || "-";
}

function formatStatus(status: string) {
  return status.replace(/_/g, " ");
}

function formatPlanFallback(establecimiento: SuperadminEstablecimiento) {
  const subscription = establecimiento.subscription;

  if (!subscription) return "Sin plan";
  if (subscription.plan_id) return `Plan ${subscription.plan_id}`;

  return "Sin plan";
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
  }).format(date);
}

function getErrorMessage(error: unknown, fallback: string) {
  const message = (error as AxiosError<{ message?: string }>)?.response?.data
    ?.message;

  return message || fallback;
}
