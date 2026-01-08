"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FiPlus,
  FiArrowLeft,
  FiEdit2,
  FiTrash2,
  FiMove,
} from "react-icons/fi";
import { getStoredToken } from "@/services/authService";
import { getCartaById } from "@/services/cartaService";
import type { Carta } from "@/services/cartaService";
import ModalCrearSeccion from "./components/ModalCrearSeccion";
import ModalOrdenarSecciones from "./components/ModalOrdenarSecciones";
import {
  getSeccionesByCarta,
  deleteSeccion,
  type Seccion,
} from "@/services/seccionService";
import {
  getProductosBySeccion,
  type Producto,
} from "@/services/productoService";
import SortableProductosSeccion from "./components/SortableProductosSeccion";
import ModalCrearEditarProducto from "./components/ModalCrearEditarProducto";

export default function SeccionesCartaPage() {
  const router = useRouter();
  const { cartaId } = useParams<{ cartaId: string }>();

  const [carta, setCarta] = useState<Carta | null>(null);
  const [secciones, setSecciones] = useState<Seccion[]>([]);
  const [productosPorSeccion, setProductosPorSeccion] = useState<
    Record<number, Producto[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openOrdenarModal, setOpenOrdenarModal] = useState(false);
  const [seccionParaEditar, setSeccionParaEditar] =
    useState<Seccion | null>(null);

  const [openProductoModal, setOpenProductoModal] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState<Seccion | null>(null);
  const [productoParaEditar, setProductoParaEditar] =
    useState<Producto | null>(null);

  const fetchProductos = async (seccionId: number) => {
    const token = getStoredToken();
    if (!token) return;

    const data = await getProductosBySeccion(seccionId, token);
    setProductosPorSeccion((prev) => ({
      ...prev,
      [seccionId]: data,
    }));
  };

  const fetchSecciones = async () => {
    const token = getStoredToken();
    if (!token || !cartaId) return;

    const data = await getSeccionesByCarta(Number(cartaId), token);
    setSecciones(data);
    await Promise.all(data.map((s) => fetchProductos(s.id)));
  };

  useEffect(() => {
    const fetchCarta = async () => {
      const token = getStoredToken();
      if (!token) return;

      const cartaData = await getCartaById(Number(cartaId), token);
      setCarta(cartaData);
      setLoading(false);
    };

    fetchCarta();
  }, [cartaId]);

  useEffect(() => {
    if (carta) fetchSecciones();
  }, [carta]);

  if (loading || !carta) {
    return <div className="p-6 text-sm text-gray-500">Cargando…</div>;
  }

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/cartas")}
            className="p-2 rounded-full bg-white shadow hover:bg-gray-100"
          >
            <FiArrowLeft />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {carta.nombre}
            </h1>
            <p className="text-sm text-gray-500">
              Carta · Secciones y productos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpenOrdenarModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white shadow text-gray-700 hover:bg-gray-100"
          >
            <FiMove />
            Ordenar secciones
          </button>

          <button
            onClick={() => {
              setSeccionParaEditar(null);
              setOpenModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#72eb15]/20 text-[#3fa10a] font-semibold hover:bg-[#72eb15]/30"
          >
            <FiPlus />
            Nueva sección
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {secciones.map((seccion) => (
          <div
            key={seccion.id}
            className="rounded-2xl bg-white shadow-sm"
          >
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  {seccion.nombre}
                </p>
                <p className="text-xs text-gray-400">
                  Sección de la carta
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSeccionParaEditar(seccion);
                    setOpenModal(true);
                  }}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm"
                >
                  <FiEdit2 />
                  Editar sección
                </button>

                <button
                  onClick={() => {
                    setSeccionActiva(seccion);
                    setProductoParaEditar(null);
                    setOpenProductoModal(true);
                  }}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 text-sm"
                >
                  <FiPlus />
                  Añadir producto
                </button>


                <button
                  onClick={async () => {
                    const token = getStoredToken();
                    if (!token) return;
                    await deleteSeccion(seccion.id, token);
                    fetchSecciones();
                  }}
                  className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>

            <SortableProductosSeccion
              seccionId={seccion.id}
              productos={productosPorSeccion[seccion.id] || []}
              onChange={() => fetchProductos(seccion.id)}
              onEdit={(producto) => {
                setProductoParaEditar(producto);
                setSeccionActiva(seccion);
                setOpenProductoModal(true);
              }}
              onDelete={async (producto) => {
                const token = getStoredToken();
                if (!token) return;

                const confirm = window.confirm(
                  `¿Eliminar el producto "${producto.nombre}"?`
                );
                if (!confirm) return;

                const { deleteProducto } = await import("@/services/productoService");
                await deleteProducto(producto.id, token);
                fetchProductos(seccion.id);
              }}
            />

          </div>
        ))}
      </div>

      <ModalCrearSeccion
        open={openModal}
        cartaId={carta.id}
        seccion={seccionParaEditar}
        onClose={() => {
          setOpenModal(false);
          setSeccionParaEditar(null);
        }}
        onSuccess={fetchSecciones}
      />

      <ModalOrdenarSecciones
        open={openOrdenarModal}
        secciones={secciones}
        onClose={() => setOpenOrdenarModal(false)}
        onSuccess={fetchSecciones}
      />

      <ModalCrearEditarProducto
        open={openProductoModal}
        seccion={seccionActiva}
        producto={productoParaEditar}
        onClose={() => {
          setOpenProductoModal(false);
          setProductoParaEditar(null);
          setSeccionActiva(null);
        }}
        onSuccess={() => {
          if (seccionActiva) fetchProductos(seccionActiva.id);
        }}
      />
    </div>
  );
}
