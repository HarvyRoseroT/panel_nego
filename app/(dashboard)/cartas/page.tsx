"use client";

import { useEffect, useState } from "react";
import { FiPlus, FiBookOpen } from "react-icons/fi";
import { getMyEstablecimiento } from "@/services/establecimientoService";
import {
  getCartasByEstablecimiento,
} from "@/services/cartaService";
import { getStoredToken } from "@/services/authService";
import ModalCrearCarta from "./components/ModalCrearCarta";
import CartasListaSortable from "./components/CartasListaSortable";
import type { Carta } from "@/services/cartaService";
import type { Establecimiento } from "@/services/establecimientoService";

export default function CartasPage() {
  const [establecimientoId, setEstablecimientoId] =
    useState<number | null>(null);
  const [cartas, setCartas] = useState<Carta[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [editingCarta, setEditingCarta] = useState<Carta | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = getStoredToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const establecimiento: Establecimiento | null =
          await getMyEstablecimiento(token);

        if (!establecimiento) {
          setEstablecimientoId(null);
          setCartas([]);
          setLoading(false);
          return;
        }

        setEstablecimientoId(establecimiento.id);

        const cartasData = await getCartasByEstablecimiento(
          establecimiento.id,
          token
        );

        setCartas(cartasData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-gray-500">
        Cargando…
      </div>
    );
  }

  if (!establecimientoId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <div className="w-full max-w-md text-center bg-white border border-dashed rounded-2xl p-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#72eb15]/15">
            <FiBookOpen className="text-2xl text-[#3fa10a]" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">
            Aún no tienes un establecimiento
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Para crear y gestionar cartas, primero debes registrar tu negocio.
          </p>
          <button
            onClick={() => (window.location.href = "/establecimiento")}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#72eb15]/15 text-[#3fa10a] font-semibold hover:bg-[#72eb15]/25 transition"
          >
            <FiPlus />
            Crear establecimiento
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Cartas</h1>
          <p className="text-sm text-gray-500">
            Gestiona las cartas de tu establecimiento
          </p>
        </div>

        <button
          onClick={() => setOpenCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#72eb15]/15 text-[#3fa10a] font-semibold hover:bg-[#72eb15]/25 transition"
        >
          <FiPlus />
          Nueva carta
        </button>
      </div>

      <CartasListaSortable
        cartas={cartas}
        setCartas={setCartas}
        establecimientoId={establecimientoId}
        onEdit={(carta) => setEditingCarta(carta)}
      />

      <ModalCrearCarta
        open={openCreateModal || !!editingCarta}
        onClose={() => {
          setOpenCreateModal(false);
          setEditingCarta(null);
        }}
        establecimientoId={establecimientoId}
        carta={editingCarta}
        onCreated={(carta) =>
          setCartas((prev) => [...prev, carta])
        }
        onUpdated={(updated) =>
          setCartas((prev) =>
            prev.map((c) => (c.id === updated.id ? updated : c))
          )
        }
      />
    </div>
  );
}
