"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getProductosByEstablecimiento,
  Producto,
} from "@/services/productoService";
import { getMyEstablecimiento } from "@/services/establecimientoService";
import { getStoredToken } from "@/services/authService";

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = getStoredToken();
      if (!token) {
        setError("No autorizado");
        setLoading(false);
        return;
      }

      try {
        const establecimiento = await getMyEstablecimiento(token);

        if (!establecimiento?.id) {
          setError("Establecimiento no encontrado");
          return;
        }

        const productosData = await getProductosByEstablecimiento(
          establecimiento.id,
          token
        );

        setProductos(productosData);
      } catch {
        setError("Error cargando productos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const productosFiltrados = useMemo(() => {
    return productos.filter((p) =>
      p.nombre.toLowerCase().includes(search.toLowerCase())
    );
  }, [productos, search]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-sm text-gray-500">
        Cargando productos…
      </div>
    );
  }

  if (error === "Establecimiento no encontrado") {
    return (
      <div className="flex items-center justify-center min-h-[70vh] px-6">
        <div className="w-full max-w-md text-center bg-white border border-dashed rounded-2xl p-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#72eb15]/15">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-[#3fa10a]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7l9-4 9 4-9 4-9-4z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 17l9 4 9-4"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l9 4 9-4"
              />
            </svg>
          </div>

          <h2 className="text-lg font-semibold text-gray-800">
            Aún no tienes un establecimiento
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Para gestionar productos, primero debes crear tu establecimiento.
          </p>

          <button
            onClick={() => (window.location.href = "/establecimiento")}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#72eb15]/15 text-[#3fa10a] font-semibold hover:bg-[#72eb15]/25 transition"
          >
            Crear establecimiento
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 pt-10 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Productos
          </h1>
          <p className="text-sm text-gray-600">
            Gestiona todos los productos del establecimiento
          </p>
        </div>

        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Buscar producto…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-white px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#72eb15]/25"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left font-medium text-gray-600">
                Producto
              </th>
              <th className="px-6 py-4 text-right font-medium text-gray-600">
                Precio
              </th>
              <th className="px-6 py-4 text-center font-medium text-gray-600">
                Estado
              </th>
            </tr>
          </thead>

          <tbody>
            {productosFiltrados.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-14 text-center text-gray-500"
                >
                  No se encontraron productos
                </td>
              </tr>
            )}

            {productosFiltrados.map((producto) => (
              <tr
                key={producto.id}
                className="hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">
                      {producto.nombre}
                    </span>
                    {producto.descripcion && (
                      <span className="text-xs text-gray-500 truncate max-w-md">
                        {producto.descripcion}
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4 text-right font-medium text-gray-800">
                  {producto.precio && !isNaN(Number(producto.precio))
                    ? `$${Number(producto.precio).toFixed(2)}`
                    : "-"}
                </td>

                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                      producto.activo
                        ? "bg-[#72eb15]/20 text-[#4fb30f]"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        producto.activo
                          ? "bg-[#4fb30f]"
                          : "bg-gray-500"
                      }`}
                    />
                    {producto.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
