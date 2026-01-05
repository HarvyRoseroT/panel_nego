"use client";

import { useEffect, useState } from "react";
import LocationPicker from "./LocationPicker";
import {
  createEstablecimiento,
  updateEstablecimiento,
} from "@/services/establecimientoService";
import { getStoredToken } from "@/services/authService";

interface Establecimiento {
  id?: number;
  nombre: string;
  tipo: string;
  descripcion: string | null;
  pais: string;
  ciudad: string;
  direccion: string;
  lat: number | null;
  lng: number | null;
  logo: string | null;
  activo: boolean;
}

const tipos = [
  "Restaurante",
  "Bar",
  "Cafetería",
  "Food Truck",
  "Otro",
];

const paises = [
  "Colombia",
  "Ecuador",
  "Peru",
  "Venezuela",
  "Chile",
];

const normalizeTipo = (tipo: string) => {
  const map: Record<string, string> = {
    restaurante: "Restaurante",
    bar: "Bar",
    cafeteria: "Cafetería",
    cafetería: "Cafetería",
    food_truck: "Food Truck",
    foodtruck: "Food Truck",
    "food truck": "Food Truck",
    otro: "Otro",
  };

  return map[tipo?.toLowerCase()] ?? "";
};

export default function EstablecimientoForm({
  initialData,
  onSaved,
  onCancel,
}: {
  initialData?: Establecimiento | null;
  onSaved: (data: Establecimiento) => void;
  onCancel: () => void;
}) {
  const [data, setData] = useState<Establecimiento>({
    nombre: "",
    tipo: "",
    descripcion: null,
    pais: "",
    ciudad: "",
    direccion: "",
    lat: null,
    lng: null,
    logo: null,
    activo: true,
  });

  const [loading, setLoading] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  useEffect(() => {
    if (initialData) {
      setData({
        id: initialData.id,
        nombre: initialData.nombre,
        tipo: normalizeTipo(initialData.tipo),
        descripcion: initialData.descripcion ?? "",
        pais: initialData.pais,
        ciudad: initialData.ciudad,
        direccion: initialData.direccion,
        lat: initialData.lat,
        lng: initialData.lng,
        logo: initialData.logo ?? null,
        activo: initialData.activo,
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errors: string[] = [];

    if (!data.nombre) errors.push("Nombre del establecimiento");
    if (!data.tipo) errors.push("Tipo");
    if (!data.pais) errors.push("País");
    if (!data.ciudad) errors.push("Ciudad");
    if (!data.direccion) errors.push("Dirección");

    setMissingFields(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const token = getStoredToken();
      if (!token) return;

      const payload = {
        nombre: data.nombre,
        tipo: data.tipo,
        descripcion: data.descripcion,
        pais: data.pais,
        ciudad: data.ciudad,
        direccion: data.direccion,
        lat: data.lat,
        lng: data.lng,
        logo: data.logo,
        activo: data.activo,
      };

      const result = data.id
        ? await updateEstablecimiento(data.id, payload, token)
        : await createEstablecimiento(payload, token);

      onSaved(result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-2xl p-8 space-y-8 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-gray-800">
          Información del establecimiento
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Nombre">
            <input
              name="nombre"
              value={data.nombre}
              onChange={handleChange}
              className="input-ui"
            />
          </Field>

          <Field label="Tipo">
            <select
              name="tipo"
              value={data.tipo}
              onChange={handleChange}
              className="input-ui"
            >
              <option value="">Selecciona un tipo</option>
              {tipos.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Descripción">
          <textarea
            name="descripcion"
            value={data.descripcion ?? ""}
            onChange={handleChange}
            rows={3}
            className="input-ui resize-none"
          />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="País">
            <select
              name="pais"
              value={data.pais}
              onChange={(e) =>
                setData({ ...data, pais: e.target.value, lat: null, lng: null })
              }
              className="input-ui"
            >
              <option value="">Selecciona un país</option>
              {paises.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Ciudad">
            <input
              name="ciudad"
              value={data.ciudad}
              onChange={handleChange}
              className="input-ui"
            />
          </Field>
        </div>

        <Field label="Ubicación en el mapa">
          <LocationPicker
            pais={data.pais}
            value={{ lat: data.lat, lng: data.lng }}
            onChange={(loc) =>
              setData({ ...data, lat: loc.lat, lng: loc.lng })
            }
          />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Dirección">
            <input
              name="direccion"
              value={data.direccion}
              onChange={handleChange}
              className="input-ui"
            />
          </Field>

          <Field label="Logo (URL)">
            <input
              name="logo"
              value={data.logo ?? ""}
              onChange={handleChange}
              className="input-ui"
            />
          </Field>
        </div>

        <label className="flex items-center gap-3 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={data.activo}
            onChange={(e) =>
              setData({ ...data, activo: e.target.checked })
            }
            className="accent-[#72eb15]"
          />
          Establecimiento activo
        </label>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setMissingFields([]);
              onCancel();
            }}
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2 rounded-lg font-medium text-black bg-[#72eb15] hover:bg-[#64d413] transition disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>

      </form>

      {missingFields.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Faltan campos obligatorios
            </h3>

            <ul className="list-disc list-inside text-sm text-gray-600">
              {missingFields.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setMissingFields([])}
                className="px-4 py-2 rounded-lg bg-[#72eb15] text-black font-medium hover:bg-[#64d413]"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {children}
    </label>
  );
}
