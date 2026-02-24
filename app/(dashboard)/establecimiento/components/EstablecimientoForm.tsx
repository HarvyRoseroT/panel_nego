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
  slug?: string;
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


const paises = ["Colombia"];

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
    descripcion: "",
    pais: "",
    ciudad: "",
    direccion: "",
    telefono_contacto: "",
    lat: null,
    lng: null,
    activo: true,
    domicilio_activo: true,
  });

  const [loading, setLoading] = useState(false);
  const [errorTelefono, setErrorTelefono] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setData({
        ...initialData,
        activo: Boolean(initialData.activo),
        domicilio_activo: Boolean(initialData.domicilio_activo),
        telefono_contacto:
          initialData.telefono_contacto?.startsWith("+")
            ? initialData.telefono_contacto
            : "+",
      });
    }
  }, [initialData]);

  const handleTelefonoChange = (value: string) => {
    let cleaned = value.replace(/[^\d+]/g, "");
    if (!cleaned.startsWith("+")) cleaned = "+" + cleaned.replace(/\+/g, "");
    cleaned = "+" + cleaned.substring(1).replace(/\+/g, "");
    setData({ ...data, telefono_contacto: cleaned });
  };

  const validate = () => {
    if (!data.nombre) return false;
    if (!data.pais) return false;
    if (!data.ciudad) return false;
    if (!data.direccion) return false;
    if (data.descripcion && data.descripcion.length > 200) return false;

    if (data.domicilio_activo) {
      if (!data.telefono_contacto) return false;
      if (!data.telefono_contacto.startsWith("+")) {
        setErrorTelefono(
          "El número debe iniciar con el código de país (ej: +57)"
        );
        return false;
      }
      if (!/^\+\d{6,15}$/.test(data.telefono_contacto)) {
        setErrorTelefono(
          "El número debe contener solo números después del código de país"
        );
        return false;
      }
    }

    setErrorTelefono(null);
    return true;
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
        telefono_contacto: data.domicilio_activo
          ? data.telefono_contacto
          : null,
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
          value={data.nombre}
          onChange={(e) => setData({ ...data, nombre: e.target.value })}
          className="input-ui"
          required
        />
      </Field>

      <Field label="Descripción (máx. 200 caracteres)">
        <textarea
          value={data.descripcion ?? ""}
          maxLength={200}
          rows={3}
          onChange={(e) =>
            setData({ ...data, descripcion: e.target.value })
          }
          className="input-ui resize-none"
        />
        <div className="text-xs text-gray-500 text-right">
          {(data.descripcion?.length ?? 0)}/200
        </div>
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="País">
          <select
            value={data.pais}
            onChange={(e) => setData({ ...data, pais: e.target.value })}
            className="input-ui"
            required
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
            value={data.ciudad}
            onChange={(e) => setData({ ...data, ciudad: e.target.value })}
            className="input-ui"
            required
          />
        </Field>
      </div>

      <Field label="Dirección">
        <input
          value={data.direccion}
          onChange={(e) =>
            setData({ ...data, direccion: e.target.value })
          }
          className="input-ui"
          required
        />
      </Field>

      <Field label="Ubicación en el mapa">
        <div className="bg-blue-50 border border-blue-200 text-blue-800 text-sm p-4 rounded-xl mb-4 space-y-2">
          <p className="font-medium">
            Ajusta tu ubicación con precisión
          </p>
          <p>
            Arrastra el marcador hasta la ubicación exacta de tu establecimiento.
            Puedes usar el scroll y las herramientas del mapa para acercar o alejar.
          </p>
          <p>
            Esta ubicación es clave: se te asignará un radio aproximado de 5 km.
            Los usuarios que estén dentro de ese rango podrán ver tu establecimiento
            en nuestra app y recibir recomendaciones y domicilios basadas en cercanía.
          </p>
        </div>

        <LocationPicker
          pais={data.pais}
          value={{ lat: data.lat, lng: data.lng }}
          onChange={(loc) => setData({ ...data, lat: loc.lat, lng: loc.lng })}
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Switch
          label="Establecimiento activo"
          checked={data.activo}
          onChange={(v) => setData({ ...data, activo: v })}
        />

        <Switch
          label="Domicilio disponible"
          checked={data.domicilio_activo}
          onChange={(v) =>
            setData({
              ...data,
              domicilio_activo: v,
              telefono_contacto: v ? "+" : "",
            })
          }
        />
      </div>

      {data.domicilio_activo && (
        <Field label="Contacto / WhatsApp (incluye código de país)">
          
          <div className="bg-amber-50 border border-amber-200 text-amber-900 text-sm p-4 rounded-xl mb-4 space-y-2">
            <p className="font-semibold flex items-center gap-2">
              Número receptor oficial de pedidos
            </p>

            <p>
              El teléfono que registres aquí será el canal oficial donde se enviarán
              automáticamente los pedidos a domicilio generados desde nuestra app.
            </p>

            <p>
              Cada vez que un cliente confirme un pedido, recibirás automáticamente en este número el detalle completo vía WhatsApp en tiempo real. Desde allí podrás gestionar toda la información del pedido, incluyendo ubicación de entrega y método de pago seleccionado.
            </p>

            <p>
              Es fundamental que el número esté correcto, activo y disponible para
              responder rápidamente, ya que cualquier retraso puede afectar la
              experiencia del cliente.
            </p>

            <p className="font-medium">
              Si actualmente no ofreces servicio a domicilio, puedes desactivar la
              opción “Domicilio disponible” y este campo dejará de ser obligatorio.
            </p>
          </div>

          <input
            value={data.telefono_contacto ?? ""}
            onChange={(e) => handleTelefonoChange(e.target.value)}
            className="input-ui"
            inputMode="numeric"
            placeholder="+573001234567"
            required
          />

          {errorTelefono && (
            <p className="text-sm text-red-500 mt-1">{errorTelefono}</p>
          )}
        </Field>
      )}

      <div className="flex justify-end gap-3 pt-4">
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

function Switch({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 p-4 rounded-xl bg-gray-50">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full transition ${
          checked ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`block w-5 h-5 bg-white rounded-full transform transition ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </label>
  );
}
