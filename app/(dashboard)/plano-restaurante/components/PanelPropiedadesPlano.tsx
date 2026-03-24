"use client";

import { useState } from "react";
import {
  FiBox,
  FiLayout,
  FiPlus,
  FiSave,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";
import type {
  DraftPlano,
  DraftPlanoElemento,
  PlanoOrientacion,
} from "@/hooks/usePlanoRestauranteEditor";

function SectionTitle({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#72eb15]/15 text-[#3fa10a]">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <p className="text-xs leading-5 text-gray-500">{subtitle}</p>
      </div>
    </div>
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
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {children}
    </label>
  );
}

export function AddElementCard({
  onAddElement,
  onAddAutomaticTables,
}: {
  onAddElement: (type: "mesa" | "objeto_cuadrado") => void;
  onAddAutomaticTables: (count: number) => void;
}) {
  const [tableCount, setTableCount] = useState("4");

  return (
    <div className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
      <SectionTitle
        icon={<FiPlus className="text-lg" />}
        title="Añadir elementos"
        subtitle="Crea elementos manualmente o genera varias mesas de una vez."
      />

      <div className="mt-5 grid gap-3">
        <button
          onClick={() => onAddElement("mesa")}
          className="flex items-center justify-between rounded-2xl border border-[#cae3bb] bg-[#72eb15]/10 px-4 py-3 text-left transition hover:bg-[#72eb15]/20"
        >
          <span>
            <span className="block text-sm font-semibold text-[#265f08]">
              Nueva mesa
            </span>
            <span className="block text-xs text-[#265f08]/70">
              Añade una sola mesa editable
            </span>
          </span>
          <FiUsers className="text-lg text-[#265f08]" />
        </button>

        <button
          onClick={() => onAddElement("objeto_cuadrado")}
          className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition hover:bg-slate-100"
        >
          <span>
            <span className="block text-sm font-semibold text-slate-800">
              Nuevo objeto
            </span>
            <span className="block text-xs text-slate-500">
              Para cajas, barras o puntos visuales
            </span>
          </span>
          <FiBox className="text-lg text-slate-700" />
        </button>
      </div>

      <div className="mt-4 rounded-2xl border border-dashed border-[#cae3bb] bg-[#72eb15]/8 p-4">
        <p className="text-sm font-semibold text-[#265f08]">
          Generar mesas automáticamente
        </p>
        <p className="mt-1 text-xs leading-5 text-[#265f08]/75">
          Indica cuántas mesas quieres. Se distribuirán y ajustarán su tamaño
          según las dimensiones actuales del plano.
        </p>

        <div className="mt-3 flex items-end gap-3">
          <Field label="Mesas">
            <input
              type="number"
              min={1}
              max={100}
              value={tableCount}
              onChange={(event) => setTableCount(event.target.value)}
              className="input-ui w-24 px-2.5 text-center"
            />
          </Field>

          <button
            type="button"
            onClick={() =>
              onAddAutomaticTables(Number.parseInt(tableCount, 10) || 1)
            }
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#3fa10a] px-4 text-sm font-semibold text-white transition hover:bg-[#358609]"
          >
            Generar
          </button>
        </div>
      </div>
    </div>
  );
}

export function ElementPropertiesCard({
  selectedElement,
  onSelectedElementChange,
  onRemoveSelected,
}: {
  selectedElement: DraftPlanoElemento | null;
  onSelectedElementChange: (changes: Partial<DraftPlanoElemento>) => void;
  onRemoveSelected: () => void;
}) {
  return (
    <div className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
      <SectionTitle
        icon={
          selectedElement?.tipo === "mesa" ? (
            <FiUsers className="text-lg" />
          ) : (
            <FiBox className="text-lg" />
          )
        }
        title="Propiedades"
        subtitle={
          selectedElement
            ? "Edita el elemento seleccionado."
            : "Selecciona un elemento en el plano para ver sus propiedades."
        }
      />

      {!selectedElement ? (
        <div className="mt-5 rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-sm leading-6 text-gray-500">
          No hay ningún elemento seleccionado. Haz clic sobre una mesa u objeto
          dentro del plano para editar su nombre y tamaño.
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          <Field label="Nombre">
            <input
              value={selectedElement.nombre}
              onChange={(event) =>
                onSelectedElementChange({ nombre: event.target.value })
              }
              className="input-ui"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-[96px_96px_auto] sm:items-end">
            {selectedElement.tipo === "mesa" ? (
              <Field label="Tamaño">
                <input
                  type="number"
                  min={40}
                  value={selectedElement.ancho}
                  onChange={(event) => {
                    const next = Number.parseInt(event.target.value, 10) || 40;
                    onSelectedElementChange({
                      ancho: next,
                      alto: next,
                    });
                  }}
                  className="input-ui px-2.5 text-center"
                />
              </Field>
            ) : (
              <>
                <Field label="Ancho">
                  <input
                    type="number"
                    min={40}
                    value={selectedElement.ancho}
                    onChange={(event) =>
                      onSelectedElementChange({
                        ancho: Number.parseInt(event.target.value, 10) || 40,
                      })
                    }
                    className="input-ui px-2.5 text-center"
                  />
                </Field>

                <Field label="Alto">
                  <input
                    type="number"
                    min={40}
                    value={selectedElement.alto}
                    onChange={(event) =>
                      onSelectedElementChange({
                        alto: Number.parseInt(event.target.value, 10) || 40,
                      })
                    }
                    className="input-ui px-2.5 text-center"
                  />
                </Field>
              </>
            )}

            {selectedElement.tipo === "mesa" && (
              <Field label="Capacidad">
                <input
                  type="number"
                  min={1}
                  max={24}
                  value={selectedElement.capacidad ?? 4}
                  onChange={(event) =>
                    onSelectedElementChange({
                      capacidad: Number.parseInt(event.target.value, 10) || 1,
                    })
                  }
                  className="input-ui px-2.5 text-center"
                />
              </Field>
            )}

            <button
              onClick={onRemoveSelected}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-50 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              <FiTrash2 />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function PlanoSettingsRow({
  draftPlano,
  orientacion,
  saving,
  hasUnsavedChanges,
  onPlanoFieldChange,
  onOrientacionChange,
  onSave,
}: {
  draftPlano: DraftPlano;
  orientacion: PlanoOrientacion;
  saving: boolean;
  hasUnsavedChanges: boolean;
  onPlanoFieldChange: (field: "nombre", value: string) => void;
  onOrientacionChange: (orientacion: PlanoOrientacion) => void;
  onSave: () => void;
}) {
  return (
    <div className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)_260px_220px] xl:items-end">
        <SectionTitle
          icon={<FiLayout className="text-lg" />}
          title="Opciones del plano"
          subtitle="Elige si el plano será horizontal o vertical."
        />

        <Field label="Nombre">
          <input
            value={draftPlano.nombre}
            onChange={(event) => onPlanoFieldChange("nombre", event.target.value)}
            className="input-ui"
            placeholder="Plano principal"
          />
        </Field>

        <Field label="Orientación">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onOrientacionChange("horizontal")}
              className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
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
              className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                orientacion === "vertical"
                  ? "border-[#72eb15] bg-[#72eb15]/15 text-[#265f08]"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Vertical
            </button>
          </div>
        </Field>

        <button
          onClick={onSave}
          disabled={saving || !hasUnsavedChanges}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#3fa10a] px-4 text-sm font-semibold text-white transition hover:bg-[#358609] disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          <FiSave />
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}
