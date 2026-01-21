"use client";

import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { createProducto, updateProducto } from "@/services/productoService";
import type { Producto } from "@/services/productoService";
import type { Seccion } from "@/services/seccionService";
import { getStoredToken } from "@/services/authService";

interface Props {
  open: boolean;
  seccion: Seccion | null;
  producto?: Producto | null;
  onClose: () => void;
  onSuccess?: (producto: Producto) => void;
}


export default function ModalCrearEditarProducto({
  open,
  seccion,
  producto,
  onClose,
  onSuccess,
}: Props) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState<string>("");
  const [activo, setActivo] = useState(true);
  const [errors, setErrors] = useState<{ nombre?: string; precio?: string }>({});

    useEffect(() => {
    if (!open) return;

    if (producto) {
        setNombre(producto.nombre);
        setDescripcion(producto.descripcion || "");
        setPrecio(String(producto.precio));
        setActivo(producto.activo);
    } else {
        setNombre("");
        setDescripcion("");
        setPrecio("");
        setActivo(true);
    }

    setErrors({});
    }, [producto, open]);


  if (!open || !seccion) return null;

  const validate = () => {
    const newErrors: { nombre?: string; precio?: string } = {};

    if (!nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    }

    if (!precio.trim()) {
      newErrors.precio = "El precio es obligatorio";
    } else if (isNaN(Number(precio))) {
      newErrors.precio = "El precio debe ser un número";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const token = getStoredToken();
    if (!token) return;

    const precioNumber = Number(precio);
    let savedProducto: Producto;

    if (producto) {
      savedProducto = await updateProducto(
        producto.id,
        {
          nombre,
          descripcion,
          precio: precioNumber,
          activo,
        },
        token
      );
    } else {
      savedProducto = await createProducto(
        {
          nombre,
          descripcion,
          precio: precioNumber,
          seccion_id: seccion.id,
          activo,
        },
        token
      );
    }

    onSuccess?.(savedProducto);
    onClose();
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-lg text-gray-800">
            {producto ? "Editar producto" : "Crear producto"}
          </h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <FiX />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs text-gray-500">Nombre *</label>
            <input
              className={`mt-1 w-full rounded-lg bg-gray-50 border px-3 py-2 text-sm focus:outline-none ${
                errors.nombre ? "border-red-400" : "border-gray-200"
              }`}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            {errors.nombre && (
              <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>
            )}
          </div>

          <div>
            <label className="text-xs text-gray-500">Descripción</label>
            <textarea
              className="mt-1 w-full rounded-lg bg-gray-50 border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none"
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">Precio *</label>
            <input
              type="text"
              className={`mt-1 w-full rounded-lg bg-white border px-3 py-2 text-sm focus:outline-none ${
                errors.precio ? "border-red-400" : "border-gray-200"
              }`}
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              placeholder="Ej: 12.50"
            />
            {errors.precio && (
              <p className="text-xs text-red-500 mt-1">{errors.precio}</p>
            )}
          </div>

          <label className="flex items-center gap-3 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={activo}
              onChange={(e) => setActivo(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            Producto activo
          </label>
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-[#72eb15]/20 text-[#3fa10a] text-sm font-semibold hover:bg-[#72eb15]/30"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
