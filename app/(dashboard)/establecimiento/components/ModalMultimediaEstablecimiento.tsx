"use client";

import { useState } from "react";
import {
  subirLogoEstablecimiento,
  subirImagenUbicacionEstablecimiento,
} from "@/services/establecimientoService";
import { getStoredToken } from "@/services/authService";

export default function ModalMultimediaEstablecimiento({
  establecimientoId,
  onClose,
}: {
  establecimientoId: number;
  onClose: () => void;
}) {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoUploaded, setLogoUploaded] = useState(false);

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverUploaded, setCoverUploaded] = useState(false);

  const [loadingLogo, setLoadingLogo] = useState(false);
  const [loadingCover, setLoadingCover] = useState(false);

  const uploadLogo = async () => {
    if (!logoFile) return;
    const token = getStoredToken();
    if (!token) return;

    setLoadingLogo(true);
    try {
      await subirLogoEstablecimiento(establecimientoId, logoFile, token);
      setLogoUploaded(true);
      setLogoFile(null);
    } finally {
      setLoadingLogo(false);
    }
  };

  const uploadCover = async () => {
    if (!coverFile) return;
    const token = getStoredToken();
    if (!token) return;

    setLoadingCover(true);
    try {
      await subirImagenUbicacionEstablecimiento(
        establecimientoId,
        coverFile,
        token
      );
      setCoverUploaded(true);
      setCoverFile(null);
    } finally {
      setLoadingCover(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl">
        <div className="px-6 py-5 text-center">
          <h3 className="text-lg font-semibold text-gray-800">
            Multimedia del establecimiento
          </h3>
        </div>

        <div className="px-6 py-8 space-y-12">
          <div className="flex flex-col items-center gap-5">
            <div className="w-28 h-28 rounded-full bg-[#72eb15]/20 flex items-center justify-center overflow-hidden">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm font-medium text-[#4fb30f]">
                  Logo
                </span>
              )}
            </div>

            {!logoUploaded && (
              <div className="flex items-center gap-3">
                <label className="px-5 py-2 rounded-full border border-[#72eb15] text-[#4fb30f] font-semibold cursor-pointer hover:bg-[#72eb15]/10 transition">
                  Seleccionar archivo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setLogoFile(file);
                      setLogoPreview(URL.createObjectURL(file));
                    }}
                  />
                </label>

                <button
                  onClick={uploadLogo}
                  disabled={!logoFile || loadingLogo}
                  className="px-6 py-2 rounded-full bg-[#72eb15] text-black font-semibold disabled:opacity-50 hover:bg-[#64d413] transition"
                >
                  {loadingLogo ? "Subiendo..." : "Subir logo"}
                </button>
              </div>
            )}

            {logoUploaded && (
              <span className="text-xs font-semibold text-[#4fb30f] bg-[#72eb15]/20 px-4 py-1.5 rounded-full">
                Logo subido
              </span>
            )}
          </div>

          <div className="space-y-5">
            <div className="w-full h-44 rounded-2xl bg-gray-100 overflow-hidden flex items-center justify-center">
              {coverPreview ? (
                <img
                  src={coverPreview}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm text-gray-400">
                  Imagen de portada
                </span>
              )}
            </div>

            {!coverUploaded && (
              <div className="flex justify-center gap-3">
                <label className="px-5 py-2 rounded-full border border-[#72eb15] text-[#4fb30f] font-semibold cursor-pointer hover:bg-[#72eb15]/10 transition">
                  Seleccionar archivo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setCoverFile(file);
                      setCoverPreview(URL.createObjectURL(file));
                    }}
                  />
                </label>

                <button
                  onClick={uploadCover}
                  disabled={!coverFile || loadingCover}
                  className="px-6 py-2 rounded-full bg-[#72eb15] text-black font-semibold disabled:opacity-50 hover:bg-[#64d413] transition"
                >
                  {loadingCover ? "Subiendo..." : "Subir imagen"}
                </button>
              </div>
            )}

            {coverUploaded && (
              <div className="flex justify-center">
                <span className="text-xs font-semibold text-[#4fb30f] bg-[#72eb15]/20 px-4 py-1.5 rounded-full">
                  Imagen subida
                </span>
              </div>
            )}
          </div>
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
