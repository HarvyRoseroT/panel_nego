"use client";

import { useEffect, useRef, useState } from "react";
import { FiUser } from "react-icons/fi";
import type { DraftPlanoElemento } from "@/hooks/usePlanoRestauranteEditor";

interface DragState {
  localId: string;
  offsetX: number;
  offsetY: number;
}

interface ResizeState {
  localId: string;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  tipo: DraftPlanoElemento["tipo"];
}

interface Props {
  width: number;
  height: number;
  elementos: DraftPlanoElemento[];
  selectedId: string | null;
  onSelect: (localId: string | null) => void;
  onMove: (localId: string, x: number, y: number) => void;
  onResize: (localId: string, width: number, height: number) => void;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function PlanoCanvas({
  width,
  height,
  elementos,
  selectedId,
  onSelect,
  onMove,
  onResize,
}: Props) {
  const planeRef = useRef<HTMLDivElement | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [resizeState, setResizeState] = useState<ResizeState | null>(null);

  useEffect(() => {
    if (!dragState && !resizeState) return;

    const handlePointerMove = (event: PointerEvent) => {
      const plane = planeRef.current;
      if (!plane) return;
      const rect = plane.getBoundingClientRect();
      const scaleX = rect.width / width;
      const scaleY = rect.height / height;

      if (dragState) {
        const current = elementos.find(
          (item) => item.localId === dragState.localId
        );
        if (!current) return;

        const x = (event.clientX - rect.left) / scaleX - dragState.offsetX;
        const y = (event.clientY - rect.top) / scaleY - dragState.offsetY;

        onMove(
          dragState.localId,
          clamp(Math.round(x), 0, width - current.ancho),
          clamp(Math.round(y), 0, height - current.alto)
        );
        return;
      }

      if (resizeState) {
        const current = elementos.find(
          (item) => item.localId === resizeState.localId
        );
        if (!current) return;

        const deltaX = (event.clientX - resizeState.startX) / scaleX;
        const deltaY = (event.clientY - resizeState.startY) / scaleY;
        const maxWidth = width - current.posicion_x;
        const maxHeight = height - current.posicion_y;

        if (resizeState.tipo === "mesa") {
          const nextSize = clamp(
            Math.round(
              Math.max(
                resizeState.startWidth + deltaX,
                resizeState.startHeight + deltaY
              )
            ),
            40,
            Math.min(maxWidth, maxHeight)
          );

          onResize(resizeState.localId, nextSize, nextSize);
          return;
        }

        onResize(
          resizeState.localId,
          clamp(Math.round(resizeState.startWidth + deltaX), 40, maxWidth),
          clamp(Math.round(resizeState.startHeight + deltaY), 40, maxHeight)
        );
      }
    };

    const stopDragging = () => {
      setDragState(null);
      setResizeState(null);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopDragging);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopDragging);
    };
  }, [dragState, elementos, height, onMove, onResize, resizeState, width]);

  return (
    <div className="rounded-[28px] border border-gray-200 bg-white p-3 shadow-sm md:p-5">
      <div className="mb-4 flex flex-col gap-2 border-b border-gray-100 pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Área de diseño
          </h2>
          <p className="text-sm text-gray-500">
            Arrastra elementos dentro del plano o ajusta sus valores desde el
            panel lateral.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
          {width} x {height}
        </div>
      </div>

      <div className="overflow-auto rounded-[22px] bg-[linear-gradient(135deg,#f8faf7_0%,#f2f7ee_100%)] p-3 md:p-5">
        <div
          ref={planeRef}
          className="relative overflow-hidden rounded-[26px] border border-[#d8e4d0] bg-white shadow-[inset_0_0_0_1px_rgba(114,235,21,0.08)]"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            backgroundImage:
              "linear-gradient(to right, rgba(148,163,184,0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.14) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) {
              onSelect(null);
            }
          }}
        >
          <div className="pointer-events-none absolute inset-x-4 top-4 flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.18em] text-gray-300">
            <span>Entrada visual</span>
            <span>Plano activo</span>
          </div>

          {elementos.map((element) => {
            const isTable = element.tipo === "mesa";
            const isSelected = selectedId === element.localId;

            return (
              <button
                key={element.localId}
                type="button"
                className={`absolute flex flex-col justify-between overflow-hidden rounded-2xl border px-3 py-2 text-left shadow-sm transition ${
                  isTable
                    ? "bg-[#3fa10a]/12 text-[#265f08]"
                    : "bg-[#0f172a]/8 text-slate-700"
                } ${
                  isSelected
                    ? "ring-2 ring-[#3fa10a] ring-offset-2"
                    : "hover:shadow-md"
                }`}
                style={{
                  left: `${element.posicion_x}px`,
                  top: `${element.posicion_y}px`,
                  width: `${element.ancho}px`,
                  height: `${element.alto}px`,
                  touchAction: "none",
                }}
                onPointerDown={(event) => {
                  event.stopPropagation();
                  const target = event.currentTarget.getBoundingClientRect();
                  const scaleX = target.width / element.ancho;
                  const scaleY = target.height / element.alto;

                  onSelect(element.localId);
                  setDragState({
                    localId: element.localId,
                    offsetX: (event.clientX - target.left) / scaleX,
                    offsetY: (event.clientY - target.top) / scaleY,
                  });
                }}
              >
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] opacity-70">
                  {isTable ? element.nombre : "Objeto"}
                </div>

                <div className="space-y-1">
                  {!isTable && (
                    <div className="line-clamp-2 text-sm font-semibold leading-4">
                      {element.nombre}
                    </div>
                  )}

                  {isTable && (
                    <div className="inline-flex items-center gap-1 text-xs opacity-80">
                      <span>{element.capacidad ?? 0}</span>
                      <FiUser className="text-[11px]" />
                    </div>
                  )}
                </div>

                <span
                  className={`absolute bottom-1 right-1 h-4 w-4 rounded-sm border border-white/80 shadow-sm ${
                    isTable ? "bg-[#3fa10a]" : "bg-slate-700"
                  }`}
                  onPointerDown={(event) => {
                    event.stopPropagation();
                    onSelect(element.localId);
                    setDragState(null);
                    setResizeState({
                      localId: element.localId,
                      startX: event.clientX,
                      startY: event.clientY,
                      startWidth: element.ancho,
                      startHeight: element.alto,
                      tipo: element.tipo,
                    });
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
