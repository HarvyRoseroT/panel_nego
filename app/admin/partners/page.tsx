"use client";

import { useState, useEffect, useCallback } from "react";
import { Dialog } from "@headlessui/react";
import {
  createPartner,
  getPartners,
  PartnerListItem,
  updatePartnerStatus,
  deletePartner,
  getAdminCommissions,
  payCommissions,
  CommissionItem,
} from "@/services/partnerService";

export default function PartnersPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPayOpen, setIsPayOpen] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedPartner, setSelectedPartner] =
    useState<PartnerListItem | null>(null);

  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [payLoading, setPayLoading] = useState(false);

  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [partners, setPartners] = useState<PartnerListItem[]>([]);
  const [availableCommissions, setAvailableCommissions] = useState<
    CommissionItem[]
  >([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const fetchPartners = useCallback(async () => {
    try {
      const data = await getPartners();
      setPartners(data);
    } catch {
      setError("Error cargando partners");
    } finally {
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await createPartner(form);
      await fetchPartners();

      setIsOpen(false);
      setForm({ name: "", email: "", password: "" });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Error creando partner");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: number, current: boolean) => {
    try {
      setError(null);
      await updatePartnerStatus(id, !current);
      await fetchPartners();
    } catch {
      setError("Error actualizando estado");
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;

    try {
      setDeleteLoading(true);
      setError(null);

      await deletePartner(selectedId);
      await fetchPartners();

      setIsDeleteOpen(false);
      setSelectedId(null);
    } catch {
      setError("Error eliminando partner");
    } finally {
      setDeleteLoading(false);
    }
  };

  const openPayModal = async (partner: PartnerListItem) => {
    setSelectedPartner(partner);

    const commissions = await getAdminCommissions();

    const filtered = commissions.filter(
      (c) =>
        c.status === "approved" &&
        c.Referral?.PartnerProfile?.User?.id === partner.id
    );

    setAvailableCommissions(filtered);

    setIsPayOpen(true);
  };

  const handlePay = async () => {
    if (!availableCommissions.length) return;

    try {
      setPayLoading(true);

      await payCommissions({
        commissionIds: availableCommissions.map((c) => c.id),
      });

      setIsPayOpen(false);
      setAvailableCommissions([]);
      await fetchPartners();
    } finally {
      setPayLoading(false);
    }
  };

  const availableTotal = availableCommissions.reduce(
    (acc, c) => acc + c.commission_amount,
    0
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Partners</h1>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-green-500 hover:bg-green-400 text-black font-semibold px-5 py-2 rounded-lg transition"
        >
          Crear Partner
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800">
        <table className="w-full text-left">
          <thead className="bg-neutral-800 text-neutral-400 text-sm">
            <tr>
              <th className="p-4">Nombre</th>
              <th>Email</th>
              <th>Código</th>
              <th>Estado</th>
              <th className="p-4 text-center">Activo</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {initialLoading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-neutral-500">
                  Cargando partners...
                </td>
              </tr>
            ) : partners.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-neutral-500">
                  No hay partners registrados todavía.
                </td>
              </tr>
            ) : (
              partners.map((partner) => (
                <tr
                  key={partner.id}
                  className="border-t border-neutral-800 hover:bg-neutral-800/50 transition"
                >
                  <td className="p-4 font-medium">{partner.name}</td>
                  <td>{partner.email}</td>
                  <td className="text-green-400 font-mono">
                    {partner.referralCode}
                  </td>
                  <td>
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        partner.active
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {partner.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() =>
                        handleToggle(partner.id, partner.active)
                      }
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                        partner.active ? "bg-green-500" : "bg-neutral-600"
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                          partner.active ? "translate-x-6" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="p-4 text-center flex justify-center gap-3">
                    <button
                      onClick={() => openPayModal(partner)}
                      className="text-green-400 hover:text-green-300 font-semibold"
                    >
                      Pagar saldo
                    </button>

                    <button
                      onClick={() => {
                        setSelectedId(partner.id);
                        setIsDeleteOpen(true);
                      }}
                      className="text-red-400 hover:text-red-300 font-semibold"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-neutral-900 p-8 rounded-xl w-105 border border-neutral-800">
            <h2 className="text-xl font-bold mb-6">Crear Partner</h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nombre"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="w-full p-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:outline-none"
              />

              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="w-full p-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:outline-none"
              />

              <input
                type="password"
                placeholder="Contraseña"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                className="w-full p-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-neutral-700 rounded-lg"
              >
                Cancelar
              </button>

              <button
                onClick={handleCreate}
                disabled={loading}
                className="px-4 py-2 bg-green-500 text-black font-semibold rounded-lg"
              >
                {loading ? "Creando..." : "Crear"}
              </button>
            </div>
          </div>
        </div>
      </Dialog>

      <Dialog open={isPayOpen} onClose={() => setIsPayOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-neutral-900 p-8 rounded-xl w-105 border border-neutral-800">
            <h2 className="text-xl font-bold mb-4">Pagar saldo partner</h2>

            <p className="text-neutral-400 mb-6">
              Total disponible{" "}
              <span className="text-green-400 font-semibold">
                {formatMoney(availableTotal)}
              </span>
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsPayOpen(false)}
                className="px-4 py-2 bg-neutral-700 rounded-lg"
              >
                Cancelar
              </button>

              <button
                onClick={handlePay}
                disabled={payLoading}
                className="px-4 py-2 bg-green-500 text-black font-semibold rounded-lg"
              >
                {payLoading ? "Pagando..." : "Confirmar pago"}
              </button>
            </div>
          </div>
        </div>
      </Dialog>

      <Dialog open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-neutral-900 p-8 rounded-xl w-100 border border-neutral-800">
            <h2 className="text-lg font-bold mb-4 text-red-400">
              Confirmar eliminación
            </h2>

            <p className="text-neutral-400 mb-6">
              ¿Seguro que deseas eliminar este partner?
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="px-4 py-2 bg-neutral-700 rounded-lg"
              >
                Cancelar
              </button>

              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-500 text-black font-semibold rounded-lg"
              >
                {deleteLoading ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

function formatMoney(value: number) {
  return Number(value).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  });
}