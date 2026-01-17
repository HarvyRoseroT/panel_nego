"use client";

import { useState } from "react";
import ModalMultimediaEstablecimiento from "./ModalMultimediaEstablecimiento";

interface Establecimiento {
  id: number;
  nombre: string;
  descripcion?: string | null;
  pais: string;
  ciudad: string;
  direccion: string;
  telefono_contacto?: string | null;
  logo_url?: string | null;
  imagen_ubicacion_url?: string | null;
  activo: boolean;
}

interface Props {
  establecimiento: Establecimiento;
  onEdit: () => void;
  onUpdated: (data: Partial<Establecimiento>) => void;
}

const normalizeUrl = (url?: string | null) => {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
};

export default function EstablecimientoCard({
  establecimiento,
  onEdit,
  onUpdated,
}: Props) {
  const [openMedia, setOpenMedia] = useState(false);

  const logoUrl = normalizeUrl(establecimiento.logo_url);
  const coverUrl = normalizeUrl(establecimiento.imagen_ubicacion_url);

  return (
    <>
      <div className="w-full max-w-3xl mx-auto">
        {/* HERO */}
        <div className="relative h-80 rounded-3xl overflow-hidden shadow-md">

          {coverUrl ? (
            <img
              src={coverUrl}
              alt={establecimiento.nombre}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-300" />
          )}

          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/50" />

          <div className="absolute bottom-5 left-5 right-5 flex items-end gap-4">
            <div className="w-18.5 h-18.5 rounded-full bg-white p-0.75 shadow-xl">
              <div className="w-full h-full rounded-full border border-[#72eb15]/40 overflow-hidden flex items-center justify-center">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={establecimiento.nombre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-bold text-[#4fb30f]">
                    {establecimiento.nombre.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1">
              <h1 className="text-white text-2xl font-bold leading-tight drop-shadow">
                {establecimiento.nombre}
              </h1>
            </div>
          </div>
        </div>

        {/* INFO CARD */}
        <div className="mt-5 relative z-10 px-4">

          <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
            {establecimiento.descripcion && (
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">
                  Descripción
                </p>
                <p className="text-sm text-gray-700 line-clamp-3">
                  {establecimiento.descripcion}
                </p>
              </div>
            )}

            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex gap-2 items-start">
                <span className="text-[#72eb15]">📍</span>
                <span>{establecimiento.direccion}</span>
              </div>

              <div className="flex gap-2 items-start">
                <span className="text-[#72eb15]">🌍</span>
                <span>
                  {establecimiento.ciudad} · {establecimiento.pais}
                </span>
              </div>

              {establecimiento.telefono_contacto && (
                <div className="flex gap-2 items-start">
                  <span className="text-[#72eb15]">📞</span>
                  <span>{establecimiento.telefono_contacto}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setOpenMedia(true)}
                className="flex-1 py-2 rounded-xl text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Subir multimedia
              </button>

              <button
                onClick={onEdit}
                className="flex-1 py-2 rounded-xl text-sm font-medium bg-[#72eb15] text-black hover:bg-[#64d413] transition"
              >
                Editar establecimiento
              </button>
            </div>

            <div className="pt-2 text-right">
              <span
                className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${
                  establecimiento.activo
                    ? "bg-[#72eb15]/20 text-[#4fb30f]"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {establecimiento.activo ? "Activo" : "Inactivo"}
              </span>
            </div>
          </div>
        </div>

        <div className="h-20" />
      </div>

      {openMedia && (
        <ModalMultimediaEstablecimiento
          establecimientoId={establecimiento.id}
          logoUrl={establecimiento.logo_url}
          imagenUbicacionUrl={establecimiento.imagen_ubicacion_url}
          onClose={() => setOpenMedia(false)}
          onSaved={(data) => onUpdated(data)}
        />
      )}
    </>
  );
}
