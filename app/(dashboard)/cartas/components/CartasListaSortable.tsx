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
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import SortableCartaItem from "./SortableCartaItem";
import { getStoredToken } from "@/services/authService";
import {
  deleteCarta,
  updateCartasOrden,
  updateCarta,
} from "@/services/cartaService";
import type { Carta } from "@/services/cartaService";

export default function CartasListaSortable({
  cartas,
  setCartas,
  establecimientoId,
  onEdit,
}: {
  cartas: Carta[];
  setCartas: React.Dispatch<React.SetStateAction<Carta[]>>;
  establecimientoId: number;
  onEdit: (c: Carta) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleToggleActiva = async (
    id: number,
    activa: boolean
  ) => {
    const token = getStoredToken();
    if (!token) return;

    const prev = cartas.map((c) => ({ ...c }));

    setCartas((p) =>
      p.map((c) =>
        c.id === id ? { ...c, activa } : c
      )
    );

    try {
      await updateCarta(id, { activa }, token);
    } catch {
      setCartas(prev);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = cartas.findIndex((c) => c.id === active.id);
    const newIndex = cartas.findIndex((c) => c.id === over.id);

    const reordered = arrayMove(cartas, oldIndex, newIndex).map(
      (c, index) => ({ ...c, orden: index })
    );

    setCartas(reordered);

    const token = getStoredToken();
    if (!token) return;

    await updateCartasOrden(
      establecimientoId,
      reordered.map((c) => ({
        id: c.id,
        orden: c.orden,
      })),
      token
    );
  };

  const handleDelete = async (id: number) => {
    const token = getStoredToken();
    if (!token) return;
    if (!confirm("¿Eliminar esta carta?")) return;

    await deleteCarta(id, token);
    setCartas((p) => p.filter((c) => c.id !== id));
  };

  const cartasOrdenadas = [...cartas].sort(
    (a, b) => a.orden - b.orden
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={cartasOrdenadas.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className="space-y-3">
          {cartasOrdenadas.map((carta) => (
            <SortableCartaItem
              key={carta.id}
              carta={carta}
              onEdit={() => onEdit(carta)}
              onDelete={() => handleDelete(carta.id)}
              onToggleActiva={handleToggleActiva}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
