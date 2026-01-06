"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiPlus, FiArrowLeft } from "react-icons/fi";
import { getStoredToken } from "@/services/authService";
import { getCartaById } from "@/services/cartaService";
import type { Carta } from "@/services/cartaService";

export default function SeccionesCartaPage() {
  const router = useRouter();
  const { cartaId } = useParams<{ cartaId: string }>();

  const [carta, setCarta] = useState<Carta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarta = async () => {
      const token = getStoredToken();
      if (!token) return;

      try {
        const cartaData = await getCartaById(Number(cartaId), token);
        setCarta(cartaData);
      } finally {
        setLoading(false);
      }
    };

    fetchCarta();
  }, [cartaId]);

  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-500">
        Cargando…
      </div>
    );
  }

  if (!carta) {
    return (
      <div className="p-6 text-sm text-gray-500">
        No se pudo cargar la carta
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/cartas")}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <FiArrowLeft />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {carta.nombre}
            </h1>
            <p className="text-sm text-gray-500">
              Secciones de la carta
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            /* abrir modal crear sección */
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#72eb15]/15 text-[#3fa10a] font-semibold hover:bg-[#72eb15]/25 transition"
        >
          <FiPlus />
          Crear sección
        </button>
      </div>
    </div>
  );
}
