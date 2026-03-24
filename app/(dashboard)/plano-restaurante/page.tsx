"use client";

import { FiAlertCircle, FiMap, FiMove } from "react-icons/fi";
import PlanoRestauranteEmptyState from "./components/PlanoRestauranteEmptyState";
import PlanoCanvas from "./components/PlanoCanvas";
import {
  AddElementCard,
  ElementPropertiesCard,
  PlanoSettingsRow,
} from "./components/PanelPropiedadesPlano";
import { usePlanoRestauranteEditor } from "@/hooks/usePlanoRestauranteEditor";

export default function PlanoRestaurantePage() {
  const {
    establecimiento,
    plano,
    draftPlano,
    planoOrientacion,
    elementos,
    selectedElement,
    selectedId,
    loading,
    saving,
    error,
    successMessage,
    hasUnsavedChanges,
    isCompatible,
    setPlanoField,
    setPlanoOrientacion,
    selectElement,
    addElement,
    addAutomaticTables,
    updateSelectedElement,
    moveElement,
    resizeElement,
    removeElement,
    save,
    startCreatingPlan,
  } = usePlanoRestauranteEditor();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-gray-500">
        Cargando plano del restaurante...
      </div>
    );
  }

  if (!establecimiento?.id) {
    return (
      <div className="flex items-center justify-center min-h-[65vh] px-4">
        <div className="w-full max-w-lg rounded-[28px] border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#72eb15]/15 text-[#3fa10a]">
            <FiMap className="text-2xl" />
          </div>

          <h1 className="mt-5 text-xl font-semibold text-gray-900">
            Primero crea tu establecimiento
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            El editor de plano necesita un establecimiento activo para asociar
            la distribución del local.
          </p>

          <button
            onClick={() => {
              window.location.href = "/establecimiento";
            }}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#72eb15]/15 px-4 py-2 text-sm font-semibold text-[#3fa10a] transition hover:bg-[#72eb15]/25"
          >
            Ir a establecimiento
          </button>
        </div>
      </div>
    );
  }

  if (!isCompatible) {
    return (
      <div className="flex items-center justify-center min-h-[65vh] px-4">
        <div className="w-full max-w-xl rounded-[28px] border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
            <FiAlertCircle className="text-2xl" />
          </div>

          <h1 className="mt-5 text-xl font-semibold text-gray-900">
            Esta sección no aplica para tu tipo de negocio
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            El editor de plano está pensado para restaurantes, cafés, bares y
            negocios con distribución física de mesas.
          </p>
        </div>
      </div>
    );
  }

  if (!plano && elementos.length === 0) {
    return (
      <PlanoRestauranteEmptyState
        nombre={draftPlano.nombre}
        orientacion={planoOrientacion}
        saving={saving}
        onFieldChange={setPlanoField}
        onOrientacionChange={setPlanoOrientacion}
        onCreate={() => {
          startCreatingPlan();
          void save();
        }}
      />
    );
  }

  return (
    <div className="w-full px-4 pb-8 pt-8 lg:px-0">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-[28px] border border-gray-200 bg-white px-5 py-5 shadow-sm lg:flex-row lg:items-center lg:justify-between lg:px-7">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#72eb15]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#3fa10a]">
              <FiMap />
              Plano del restaurante
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {draftPlano.nombre}
              </h1>
              <p className="text-sm text-gray-500">
                Constructor visual para organizar mesas y objetos dentro del
                local.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2 text-xs font-medium text-gray-600">
            <FiMove />
            Arrastra y redimensiona elementos desde el plano
          </div>
        </div>

        {(error || successMessage) && (
          <div className="space-y-3">
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="rounded-2xl border border-[#cae3bb] bg-[#72eb15]/10 px-4 py-3 text-sm text-[#265f08]">
                {successMessage}
              </div>
            )}
          </div>
        )}

        <PlanoSettingsRow
          draftPlano={draftPlano}
          orientacion={planoOrientacion}
          saving={saving}
          hasUnsavedChanges={hasUnsavedChanges}
          onPlanoFieldChange={setPlanoField}
          onOrientacionChange={setPlanoOrientacion}
          onSave={() => void save()}
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <PlanoCanvas
            width={draftPlano.ancho}
            height={draftPlano.alto}
            elementos={elementos}
            selectedId={selectedId}
            onSelect={selectElement}
            onMove={moveElement}
            onResize={resizeElement}
          />

          <div className="space-y-6">
            <AddElementCard
              onAddElement={addElement}
              onAddAutomaticTables={addAutomaticTables}
            />

            <ElementPropertiesCard
              selectedElement={selectedElement}
              onSelectedElementChange={updateSelectedElement}
              onRemoveSelected={() => {
                if (!selectedId) return;
                removeElement(selectedId);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
