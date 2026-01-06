"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { BsGripVertical } from "react-icons/bs";
import { Switch } from "@headlessui/react";
import { useRouter } from "next/navigation";
import type { Carta } from "@/services/cartaService";

export default function SortableCartaItem({
  carta,
  onEdit,
  onDelete,
  onToggleActiva,
}: {
  carta: Carta;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActiva: (id: number, activa: boolean) => void;
}) {
  const router = useRouter();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: carta.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between gap-3 p-4 rounded-xl bg-white transition shadow-sm ${
        isDragging ? "opacity-60 shadow-lg" : "hover:shadow-md"
      }`}
    >
      <div className="flex items-center gap-3 flex-1">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab text-gray-400 hover:text-gray-600"
        >
          <BsGripVertical size={18} />
        </button>

        <div className="flex flex-col">
          <span
            onClick={() => router.push(`/cartas/${carta.id}`)}
            className="font-medium text-gray-800 cursor-pointer hover:underline"
          >
            {carta.nombre}
          </span>

          <span
            className={`text-xs font-semibold mt-0.5 ${
              carta.activa ? "text-green-600" : "text-gray-400"
            }`}
          >
            {carta.activa ? "Activa" : "Inactiva"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Switch
          checked={carta.activa}
          onChange={(value) =>
            onToggleActiva(carta.id, value)
          }
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
            carta.activa ? "bg-[#72eb15]" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              carta.activa ? "translate-x-4" : "translate-x-1"
            }`}
          />
        </Switch>

        <button
          onClick={onEdit}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <FiEdit />
        </button>

        <button
          onClick={onDelete}
          className="p-2 rounded-lg text-red-500 hover:bg-red-50"
        >
          <FiTrash2 />
        </button>
      </div>
    </li>
  );
}
