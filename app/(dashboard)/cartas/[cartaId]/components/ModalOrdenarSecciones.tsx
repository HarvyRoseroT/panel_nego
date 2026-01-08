"use client";

import { useEffect, useState } from "react";
import { FiX, FiMove } from "react-icons/fi";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Seccion } from "@/services/seccionService";
import { reordenarSecciones } from "@/services/seccionService";
import { getStoredToken } from "@/services/authService";

interface Props {
  open: boolean;
  secciones: Seccion[];
  onClose: () => void;
  onSuccess?: () => void;
}

function SortableItem({ seccion }: { seccion: Seccion }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: seccion.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2 cursor-grab active:cursor-grabbing"
    >
      <span className="text-sm font-medium text-gray-700">
        {seccion.nombre}
      </span>
      <FiMove className="text-gray-400" />
    </div>
  );
}

export default function ModalOrdenarSecciones({
  open,
  secciones,
  onClose,
  onSuccess,
}: Props) {
  const [items, setItems] = useState<Seccion[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  useEffect(() => {
    setItems(secciones);
  }, [secciones, open]);

  if (!open) return null;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setItems((prev) => {
      const oldIndex = prev.findIndex((i) => i.id === active.id);
      const newIndex = prev.findIndex((i) => i.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const handleSave = async () => {
    const token = getStoredToken();
    if (!token) return;

    const payload = items.map((s, index) => ({
      id: s.id,
      orden: index,
    }));

    await reordenarSecciones(payload, token);
    onSuccess?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600">
              <FiMove />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">
              Ordenar secciones
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <FiX />
          </button>
        </div>

        <div className="px-6 py-4 space-y-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items.map((i) => i.id)}
              strategy={verticalListSortingStrategy}
            >
              {items.map((s) => (
                <SortableItem key={s.id} seccion={s} />
              ))}
            </SortableContext>
          </DndContext>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg bg-white text-gray-700 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 text-sm rounded-lg bg-[#3fa10a] text-white font-semibold hover:bg-[#369108]"
          >
            Guardar orden
          </button>
        </div>
      </div>
    </div>
  );
}
