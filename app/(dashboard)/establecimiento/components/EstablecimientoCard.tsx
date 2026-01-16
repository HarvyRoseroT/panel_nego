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
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden w-full max-w-3xl mx-auto shadow-sm">
        {coverUrl && (
          <div className="w-full h-40 bg-gray-100 overflow-hidden">
            <img
              src={coverUrl}
              alt={establecimiento.nombre}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-5 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-[#72eb15]/20 flex items-center justify-center shrink-0 overflow-hidden">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={establecimiento.nombre}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg font-semibold text-[#4fb30f]">
                  {establecimiento.nombre.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold text-gray-800 leading-tight">
                  {establecimiento.nombre}
                </h2>

                <span
                  className={`px-2 py-1 text-xs rounded-full font-medium ${
                    establecimiento.activo
                      ? "bg-[#72eb15]/20 text-[#4fb30f]"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {establecimiento.activo ? "Activo" : "Inactivo"}
                </span>
              </div>

              {establecimiento.descripcion && (
                <p className="text-sm text-gray-600">
                  {establecimiento.descripcion}
                </p>
              )}

              <div className="text-sm text-gray-700 pt-1 space-y-1">
                <p>
                  <span className="font-medium">Dirección:</span>{" "}
                  {establecimiento.direccion}
                </p>
                <p>
                  {establecimiento.ciudad}, {establecimiento.pais}
                </p>
                {establecimiento.telefono_contacto && (
                  <p>
                    <span className="font-medium">Contacto:</span>{" "}
                    {establecimiento.telefono_contacto}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setOpenMedia(true)}
              className="px-5 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Subir multimedia
            </button>

            <button
              onClick={onEdit}
              className="px-5 py-2 rounded-lg text-sm font-medium text-black bg-[#72eb15] hover:bg-[#64d413] transition"
            >
              Editar establecimiento
            </button>
          </div>
        </div>
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
