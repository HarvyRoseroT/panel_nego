"use client";

import { FiLayout, FiSave } from "react-icons/fi";
import type { PlanoOrientacion } from "@/hooks/usePlanoRestauranteEditor";

interface Props {
  nombre: string;
  orientacion: PlanoOrientacion;
  saving: boolean;
  onFieldChange: (field: "nombre", value: string) => void;
  onOrientacionChange: (orientacion: PlanoOrientacion) => void;
  onCreate: () => void;
}

export default function PlanoRestauranteEmptyState({
  nombre,
  orientacion,
  saving,
  onFieldChange,
  onOrientacionChange,
  onCreate,
}: Props) {
  return (
    <div className="flex items-center justify-center min-h-[65vh] px-4">
      <div className="w-full max-w-3xl rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm md:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#72eb15]/15 text-[#3fa10a]">
              <FiLayout className="text-2xl" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-gray-900">
                Plano del restaurante
              </h1>
              <p className="max-w-xl text-sm leading-6 text-gray-600">
                Diseña la distribución de tu local con un editor visual para
                ubicar mesas y objetos. Crea primero el plano base y después
                agrega elementos desde el editor.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                  Editor
                </p>
                <p className="mt-2 text-sm font-medium text-gray-800">
                  Drag and drop libre
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                  Elementos
                </p>
                <p className="mt-2 text-sm font-medium text-gray-800">
                  Mesas y objetos cuadrados
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                  Persistencia
                </p>
                <p className="mt-2 text-sm font-medium text-gray-800">
                  Guarda cambios en la API
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-gray-200 bg-[#f8faf7] p-5">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-gray-900">
                Crear plano
              </h2>
              <p className="text-sm text-gray-500">
                Define el nombre y la orientación inicial.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-gray-700">
                  Nombre
                </span>
                <input
                  value={nombre}
                  onChange={(event) => onFieldChange("nombre", event.target.value)}
                  className="input-ui"
                  placeholder="Plano principal"
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-gray-700">
                  Orientación
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => onOrientacionChange("horizontal")}
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                      orientacion === "horizontal"
                        ? "border-[#72eb15] bg-[#72eb15]/15 text-[#265f08]"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Horizontal
                  </button>

                  <button
                    type="button"
                    onClick={() => onOrientacionChange("vertical")}
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                      orientacion === "vertical"
                        ? "border-[#72eb15] bg-[#72eb15]/15 text-[#265f08]"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Vertical
                  </button>
                </div>
              </label>
            </div>

            <button
              onClick={onCreate}
              disabled={saving}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#3fa10a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#358609] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiSave />
              {saving ? "Creando..." : "Crear plano y abrir editor"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
