"use client";

import { FiX, FiImage } from "react-icons/fi";
import type { Producto } from "@/services/productoService";

export default function ModalPreviewImagenProducto({
  open,
  producto,
  onClose,
  onChangeImage,
}: {
  open: boolean;
  producto: Producto | null;
  onClose: () => void;
  onChangeImage: () => void;
}) {
  if (!open || !producto) return null;

  return (
    <div className="fixed inset-0 z-4000 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {producto.nombre}
            </h3>
            <p className="text-xs text-gray-400">
              Vista previa
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX />
          </button>
        </div>

        <div className="w-full aspect-square rounded-2xl bg-[#72eb15]/20 overflow-hidden flex items-center justify-center">
          {producto.imagen_url ? (
            <img
              src={producto.imagen_url}
              alt={producto.nombre}
              className="w-full h-full object-cover"
            />
          ) : (
            <FiImage className="text-[#4fb30f] text-4xl" />
          )}
        </div>

        <button
          onClick={onChangeImage}
          className="w-full py-2.5 rounded-full bg-[#72eb15] text-black font-semibold hover:bg-[#64d413] transition"
        >
          Cambiar imagen
        </button>
      </div>
    </div>
  );
}
