"use client";

interface Establecimiento {
  nombre: string;
  tipo: string;
  descripcion?: string | null;
  pais: string;
  ciudad: string;
  direccion: string;
  logo?: string | null;
  activo: boolean;
}

interface Props {
  establecimiento: Establecimiento;
  onEdit: () => void;
}

export default function EstablecimientoCard({
  establecimiento,
  onEdit,
}: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 w-full max-w-3xl mx-auto">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full bg-[#72eb15]/20 border border-[#72eb15] flex items-center justify-center shrink-0">
          {establecimiento.logo ? (
            <img
              src={establecimiento.logo}
              alt={establecimiento.nombre}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span className="text-lg font-semibold text-[#4fb30f]">
              {establecimiento.nombre.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Info principal */}
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 leading-tight">
                {establecimiento.nombre}
              </h2>
              <p className="text-sm text-gray-500">
                {establecimiento.tipo}
              </p>
            </div>

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

          <div className="text-sm text-gray-700 space-y-0.5 pt-1">
            <p>
              <span className="font-medium">Dirección:</span>{" "}
              {establecimiento.direccion}
            </p>
            <p>
              {establecimiento.ciudad}, {establecimiento.pais}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end pt-4">
        <button
          onClick={onEdit}
          className="px-5 py-2 rounded-lg text-sm font-medium text-black bg-[#72eb15] hover:bg-[#64d413] transition"
        >
          Editar establecimiento
        </button>
      </div>
    </div>
  );
}
