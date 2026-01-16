"use client";

import { useEffect, useState } from "react";
import LocationPicker from "./LocationPicker";
import {
  createEstablecimiento,
  updateEstablecimiento,
} from "@/services/establecimientoService";
import { getStoredToken } from "@/services/authService";

interface EstablecimientoFormData {
  id?: number;
  nombre: string;
  descripcion: string | null;
  pais: string;
  ciudad: string;
  direccion: string;
  telefono_contacto: string | null;
  lat: number | null;
  lng: number | null;
  activo: boolean;
  domicilio_activo: boolean;
}

const paises = ["Colombia", "Ecuador", "Peru", "Venezuela", "Chile"];

export default function EstablecimientoForm({
  initialData,
  onSaved,
  onCancel,
}: {
  initialData?: EstablecimientoFormData | null;
  onSaved: (data: any) => void;
  onCancel: () => void;
}) {
  const [data, setData] = useState<EstablecimientoFormData>({
    nombre: "",
    descripcion: null,
    pais: "",
    ciudad: "",
    direccion: "",
    telefono_contacto: null,
    lat: null,
    lng: null,
    activo: true,
    domicilio_activo: true,
  });

  const [loading, setLoading] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errors: string[] = [];

    if (!data.nombre) errors.push("Nombre");
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
        descripcion: data.descripcion,
        pais: data.pais,
        ciudad: data.ciudad,
        direccion: data.direccion,
        telefono_contacto: data.telefono_contacto,
        lat: data.lat,
        lng: data.lng,
        activo: data.activo,
        domicilio_activo: data.domicilio_activo,
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
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-2xl p-8 space-y-8 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-gray-800">
        Información del establecimiento
      </h2>

      <Field label="Nombre">
        <input
          name="nombre"
          value={data.nombre}
          onChange={handleChange}
          className="input-ui"
        />
      </Field>

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
            onChange={handleChange}
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

      <Field label="Teléfono de contacto">
        <input
          name="telefono_contacto"
          value={data.telefono_contacto ?? ""}
          onChange={handleChange}
          className="input-ui"
        />
      </Field>

      <Field label="Ubicación en el mapa">
        <LocationPicker
          pais={data.pais}
          value={{ lat: data.lat, lng: data.lng }}
          onChange={(loc) => setData({ ...data, lat: loc.lat, lng: loc.lng })}
        />
      </Field>

      <Field label="Dirección">
        <input
          name="direccion"
          value={data.direccion}
          onChange={handleChange}
          className="input-ui"
        />
      </Field>

      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={data.activo}
            onChange={(e) =>
              setData({ ...data, activo: e.target.checked })
            }
          />
          Establecimiento activo
        </label>

        <label className="flex items-center gap-3 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={data.domicilio_activo}
            onChange={(e) =>
              setData({ ...data, domicilio_activo: e.target.checked })
            }
          />
          Domicilio
        </label>
      </div>

      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancelar
        </button>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
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
