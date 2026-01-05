"use client";

import { useEffect, useState } from "react";
import EstablecimientoForm from "./components/EstablecimientoForm";
import EstablecimientoCard from "./components/EstablecimientoCard";
import { getMyEstablecimiento } from "@/services/establecimientoService";
import { getStoredToken } from "@/services/authService";

export default function EstablecimientoPage() {
  const [establecimiento, setEstablecimiento] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = getStoredToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getMyEstablecimiento(token);
        setEstablecimiento(data);
      } catch {
        setEstablecimiento(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-sm text-gray-500">
        Cargando…
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex justify-center">
      <div className="w-full max-w-7xl px-4 lg:px-8 space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-semibold">Establecimiento</h1>
          <p className="text-sm text-gray-600">
            Información principal de tu negocio
          </p>
        </div>

        {!establecimiento || editing ? (
          <EstablecimientoForm
            initialData={establecimiento}
            onSaved={(data) => {
                setEstablecimiento(data);
                setEditing(false);
            }}
            onCancel={() => setEditing(false)}
            />

        ) : (
          <EstablecimientoCard
            establecimiento={establecimiento}
            onEdit={() => setEditing(true)}
          />
        )}
      </div>
    </div>
  );
}
