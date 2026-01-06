"use client";

import { useEffect, useState } from "react";
import { FiPlus, FiBookOpen } from "react-icons/fi";
import { getMyEstablecimiento } from "@/services/establecimientoService";
import {
  getCartasByEstablecimiento,
  deleteCarta,
} from "@/services/cartaService";
import { getStoredToken } from "@/services/authService";
import ModalCrearCarta from "./components/ModalCrearCarta";
import CartasListaSortable from "./components/CartasListaSortable";
import type { Carta } from "@/services/cartaService";

export default function CartasPage() {
  const [establecimientoId, setEstablecimientoId] = useState<number | null>(null);
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
        const establecimiento = await getMyEstablecimiento(token);
        setEstablecimientoId(establecimiento.id);

        const cartasData = await getCartasByEstablecimiento(
          establecimiento.id,
          token
        );

        setCartas(cartasData);
      } catch {
        setEstablecimientoId(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    const token = getStoredToken();
    if (!token) return;
    if (!confirm("¿Eliminar esta carta?")) return;

    try {
      await deleteCarta(id, token);
      setCartas((prev) => prev.filter((c) => c.id !== id));
    } catch (error: any) {
      alert(error.message || "No se pudo eliminar la carta");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-gray-500">
        Cargando…
      </div>
    );
  }

  if (!establecimientoId) {
    return (
      <div className="p-6 text-sm text-gray-500">
        Primero debes crear un establecimiento para gestionar cartas.
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

      {cartas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed rounded-xl">
          <FiBookOpen className="text-3xl text-gray-400 mb-3" />
          <p className="text-sm text-gray-500">
            Aún no has creado ninguna carta
          </p>
          <button
            onClick={() => setOpenCreateModal(true)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#72eb15]/15 text-[#3fa10a] font-semibold hover:bg-[#72eb15]/25 transition"
          >
            <FiPlus />
            Crear primera carta
          </button>
        </div>
      ) : (
        <CartasListaSortable
          cartas={cartas}
          setCartas={setCartas}
          establecimientoId={establecimientoId}
          onEdit={(carta) => setEditingCarta(carta)}
        />
      )}

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
