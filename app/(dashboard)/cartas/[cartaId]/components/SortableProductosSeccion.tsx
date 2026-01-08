"use client";

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
import { FiMove, FiEdit2, FiTrash2, FiImage } from "react-icons/fi";
import type { Producto } from "@/services/productoService";
import { reordenarProductos } from "@/services/productoService";
import { getStoredToken } from "@/services/authService";

function SortableItem({
  producto,
  onEdit,
  onDelete,
  onPreview,
}: {
  producto: Producto;
  onEdit: (producto: Producto) => void;
  onDelete: (producto: Producto) => void;
  onPreview: (producto: Producto) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: producto.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100"
    >
      <button
        {...attributes}
        {...listeners}
        className="text-gray-400 hover:text-gray-600 cursor-grab"
      >
        <FiMove />
      </button>

      <div
        onClick={() => onPreview(producto)}
        className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center cursor-pointer"
      >
        {producto.imagen_url ? (
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            className="w-full h-full object-cover"
          />
        ) : (
          <FiImage className="text-gray-400" />
        )}
      </div>

      <p
        onClick={() => onEdit(producto)}
        className="flex-1 text-sm font-medium text-gray-700 cursor-pointer truncate"
      >
        {producto.nombre}
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPreview(producto)}
          className="p-1 rounded hover:bg-gray-200 text-gray-500"
        >
          <FiImage />
        </button>

        <button
          onClick={() => onEdit(producto)}
          className="p-1 rounded hover:bg-gray-200 text-gray-500"
        >
          <FiEdit2 />
        </button>

        <button
          onClick={() => onDelete(producto)}
          className="p-1 rounded hover:bg-red-100 text-red-500"
        >
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
}

export default function SortableProductosSeccion({
  seccionId,
  productos,
  onChange,
  onEdit,
  onDelete,
  onPreview,
}: {
  seccionId: number;
  productos: Producto[];
  onChange: () => void;
  onEdit: (producto: Producto) => void;
  onDelete: (producto: Producto) => void;
  onPreview: (producto: Producto) => void;
}) {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = productos.findIndex((p) => p.id === active.id);
    const newIndex = productos.findIndex((p) => p.id === over.id);

    const newItems = arrayMove(productos, oldIndex, newIndex);

    const token = getStoredToken();
    if (!token) return;

    await reordenarProductos(
      newItems.map((p, index) => ({
        id: p.id,
        orden: index,
      })),
      token
    );

    onChange();
  };

  return (
    <div className="px-6 pb-6 space-y-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={productos.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          {productos.map((producto) => (
            <SortableItem
              key={producto.id}
              producto={producto}
              onEdit={onEdit}
              onDelete={onDelete}
              onPreview={onPreview}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
