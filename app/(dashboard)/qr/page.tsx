"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import {
  getMyEstablecimiento,
  Establecimiento,
} from "@/services/establecimientoService";
import { getStoredToken } from "@/services/authService";

const QR_BASE_URL = "https://nego.ink";

export default function QRPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [establecimiento, setEstablecimiento] =
    useState<Establecimiento | null>(null);
  const [loading, setLoading] = useState(true);

  const [qrColor, setQrColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [logo, setLogo] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState(70);

  useEffect(() => {
    const fetchEstablecimiento = async () => {
      const token = getStoredToken();
      if (!token) return setLoading(false);

      try {
        const data = await getMyEstablecimiento(token);
        if (!data?.slug) return router.replace("/establecimiento");
        setEstablecimiento(data);
      } catch {
        router.replace("/establecimiento");
      } finally {
        setLoading(false);
      }
    };

    fetchEstablecimiento();
  }, [router]);

  useEffect(() => {
    if (!establecimiento) return;
    drawQR();
  }, [establecimiento, qrColor, bgColor, logo, logoSize]);

  const qrUrl = establecimiento
    ? `${QR_BASE_URL}/${establecimiento.slug}`
    : "";

  const drawQR = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    await QRCode.toCanvas(canvas, qrUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: qrColor,
        light: bgColor,
      },
      errorCorrectionLevel: "H",
    });

    if (logo) {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new Image();
      img.src = logo;
      await new Promise((res) => (img.onload = res));

      const size = logoSize;
      const x = (canvas.width - size) / 2;
      const y = (canvas.height - size) / 2;

      ctx.save();
      ctx.beginPath();
      ctx.arc(
        canvas.width / 2,
        canvas.height / 2,
        size / 2 + 6,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = bgColor;
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(
        canvas.width / 2,
        canvas.height / 2,
        size / 2,
        0,
        Math.PI * 2
      );
      ctx.clip();
      ctx.drawImage(img, x, y, size, size);
      ctx.restore();
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result as string);
    reader.readAsDataURL(file);
  };

  const downloadQR = () => {
    const sourceCanvas = canvasRef.current;
    if (!sourceCanvas) return;

    const size = sourceCanvas.width;
    const radius = 32;

    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = size;
    exportCanvas.height = size;

    const ctx = exportCanvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(size - radius, 0);
    ctx.quadraticCurveTo(size, 0, size, radius);
    ctx.lineTo(size, size - radius);
    ctx.quadraticCurveTo(size, size, size - radius, size);
    ctx.lineTo(radius, size);
    ctx.quadraticCurveTo(0, size, 0, size - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(sourceCanvas, 0, 0);

    const link = document.createElement("a");
    link.download = `qr-${establecimiento?.slug}.png`;
    link.href = exportCanvas.toDataURL("image/png");
    link.click();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-32 text-sm text-gray-500">
        Cargando QR…
      </div>
    );
  }

  if (!establecimiento) return null;

  return (
    <div className="pt-16 pb-24 px-6 max-w-6xl mx-auto space-y-12">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold">
          QR de {establecimiento.nombre}
        </h1>
        <p className="text-sm text-gray-600">{qrUrl}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white rounded-2xl shadow-sm p-7 space-y-10">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-gray-800">
              Apariencia del QR
            </h3>
            <p className="text-sm text-gray-500">
              Personaliza los colores para que coincidan con tu marca
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="rounded-xl bg-gray-50 p-4 space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Color del QR
              </p>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="color"
                  value={qrColor}
                  onChange={(e) => setQrColor(e.target.value)}
                  className="w-12 h-10 rounded-lg"
                />
                <span className="text-xs text-gray-500">{qrColor}</span>
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Color de fondo
              </p>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-12 h-10 rounded-lg"
                />
                <span className="text-xs text-gray-500">{bgColor}</span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-semibold text-gray-800">
              Logo central
            </h3>
            <p className="text-sm text-gray-500">
              Refuerza tu identidad colocando el logo en el centro del QR
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-xl bg-gray-50 p-4">
            <div>
              <p className="text-sm font-medium text-gray-700">
                Imagen del logo
              </p>
              <p className="text-xs text-gray-500">
                PNG o JPG, preferiblemente cuadrado
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium bg-white text-[#3fa10a] hover:bg-[#3fa10a]/10 transition"
            >
              Seleccionar logo
            </button>
          </div>

          {logo && (
            <div className="space-y-2 rounded-xl bg-gray-50 p-4">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Tamaño del logo
                </p>
                <p className="text-xs text-gray-500">
                  Ajusta sin afectar la lectura del QR
                </p>
              </div>

              <input
                type="range"
                min={40}
                max={110}
                value={logoSize}
                onChange={(e) => setLogoSize(Number(e.target.value))}
                className="w-full accent-[#3fa10a]"
              />
            </div>
          )}
        </div>

        <div className="bg-gray-50 rounded-2xl shadow-sm p-7 space-y-8 flex flex-col items-center">
          <div className="text-center space-y-1">
            <h3 className="text-base font-semibold text-gray-800">
              Vista previa del QR
            </h3>
            <p className="text-sm text-gray-500">
              Este es el QR que compartirán tus clientes
            </p>
          </div>

          <div className="w-full rounded-xl bg-white/70 px-4 py-2 text-center">
            <p className="text-xs text-gray-500 truncate">{qrUrl}</p>
          </div>

          <div
            className="rounded-3xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.25)]"
            style={{ backgroundColor: bgColor }}
          >
            <canvas
              ref={canvasRef}
              className="block rounded-3xl"
            />
          </div>

          <div className="w-full max-w-md rounded-xl bg-[#3fa10a]/10 px-4 py-3 text-center">
            <p className="text-sm text-[#3fa10a] font-medium">
              Prueba tu QR escaneándolo con tu celular para verificar que funciona correctamente
            </p>
          </div>

          <button
            onClick={downloadQR}
            className="w-full max-w-xs rounded-xl bg-[#3fa10a] py-3 text-white font-medium hover:bg-[#369208] transition"
          >
            Descargar QR
          </button>
        </div>
      </div>
    </div>
  );
}
