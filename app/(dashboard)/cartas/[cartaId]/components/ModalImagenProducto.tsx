"use client";

import { useState, useEffect } from "react";
import { FiTrash2 } from "react-icons/fi";
import type { Producto } from "@/services/productoService";
import {
  subirImagenProducto,
  borrarImagenProducto,
} from "@/services/productoService";
import { getStoredToken } from "@/services/authService";

export default function ModalImagenProducto({
  open,
  producto,
  onClose,
  onSuccess,
}: {
  open: boolean;
  producto: Producto | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (producto?.imagen_url) {
      setPreview(producto.imagen_url);
    } else {
      setPreview(null);
    }
    setFile(null);
    setUploaded(false);
  }, [producto]);

  if (!open || !producto) return null;

  const uploadImage = async () => {
    if (!file) return;
    const token = getStoredToken();
    if (!token) return;

    setLoading(true);
    try {
      await subirImagenProducto(producto.id, file, token);
      setUploaded(true);
      setFile(null);
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async () => {
    const token = getStoredToken();
    if (!token) return;

    setLoading(true);
    try {
      await borrarImagenProducto(producto.id, token);
      setPreview(null);
      setUploaded(false);
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-5000 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl">
        <div className="px-6 py-5 text-center">
          <h3 className="text-lg font-semibold text-gray-800">
            Imagen del producto
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            {producto.nombre}
          </p>
        </div>

        <div className="px-6 py-8 space-y-6">
          <div className="flex flex-col items-center gap-5">
            <div className="w-44 h-44 rounded-2xl bg-[#72eb15]/20 flex items-center justify-center overflow-hidden">
              {preview ? (
                <img
                  src={preview}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm font-medium text-[#4fb30f]">
                  Sin imagen
                </span>
              )}
            </div>

            {!uploaded && (
              <div className="flex items-center gap-3">
                <label className="px-5 py-2 rounded-full border border-[#72eb15] text-[#4fb30f] font-semibold cursor-pointer hover:bg-[#72eb15]/10 transition">
                  Seleccionar archivo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      setFile(f);
                      setPreview(URL.createObjectURL(f));
                    }}
                  />
                </label>

                <button
                  onClick={uploadImage}
                  disabled={!file || loading}
                  className="px-6 py-2 rounded-full bg-[#72eb15] text-black font-semibold disabled:opacity-50 hover:bg-[#64d413] transition"
                >
                  {loading ? "Subiendo..." : "Subir imagen"}
                </button>
              </div>
            )}

            {uploaded && (
              <span className="text-xs font-semibold text-[#4fb30f] bg-[#72eb15]/20 px-4 py-1.5 rounded-full">
                Imagen subida
              </span>
            )}
          </div>

          {producto.imagen_url && (
            <div className="flex justify-center">
              <button
                onClick={deleteImage}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
              >
                <FiTrash2 />
                Eliminar imagen
              </button>
            </div>
          )}
        </div>

        <div className="px-6 py-5 flex justify-center">
          <button
            onClick={onClose}
            className="px-8 py-2 rounded-full bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
