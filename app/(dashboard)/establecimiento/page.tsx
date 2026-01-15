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
      <div className="flex items-center justify-center py-24 text-sm text-gray-500">
        Cargando…
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 pt-8 space-y-8">
      {/* Header de la página */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-semibold">Establecimiento</h1>
        <p className="text-sm text-gray-600">
          Información principal de tu negocio
        </p>
      </div>

      {/* Contenido */}
      <div className="mx-auto w-full max-w-3xl">
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
            onUpdated={(data) =>
              setEstablecimiento((prev: any) => ({
                ...prev,
                ...data,
              }))
            }
          />

        )}
      </div>
    </div>
  );
}
