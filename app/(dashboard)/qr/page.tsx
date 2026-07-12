"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import {
  getMyEstablecimiento,
  type Establecimiento,
} from "@/services/establecimientoService";
import { getStoredToken } from "@/services/authService";

const QR_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3003"
    : "https://open.nego.ink";
const QR_SIZE = 300;
const QR_RADIUS = 32;

function dataUrlToUint8Array(dataUrl: string) {
  const [, base64 = ""] = dataUrl.split(",");
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

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

  const qrUrl = establecimiento ? `${QR_BASE_URL}/${establecimiento.slug}` : "";

  useEffect(() => {
    const fetchData = async () => {
      const token = getStoredToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getMyEstablecimiento(token);
        if (!data?.slug || !data.id) {
          router.replace("/establecimiento");
          return;
        }

        setEstablecimiento(data);
      } catch {
        router.replace("/establecimiento");
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [router]);

  useEffect(() => {
    if (!canvasRef.current || !establecimiento) return;

    void renderQrIntoCanvas(canvasRef.current, qrUrl).catch(() => undefined);
  }, [establecimiento, qrUrl, qrColor, bgColor, logo, logoSize]);

  async function renderQrIntoCanvas(canvas: HTMLCanvasElement, url: string) {
    await QRCode.toCanvas(canvas, url, {
      width: QR_SIZE,
      margin: 2,
      color: {
        dark: qrColor,
        light: bgColor,
      },
      errorCorrectionLevel: "H",
    });

    if (!logo) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = logo;
    await new Promise((resolve, reject) => {
      img.onload = () => resolve(true);
      img.onerror = () => reject(new Error("logo"));
    });

    const size = logoSize;
    const x = (canvas.width - size) / 2;
    const y = (canvas.height - size) / 2;

    ctx.save();
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, size / 2 + 6, 0, Math.PI * 2);
    ctx.fillStyle = bgColor;
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, size / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(img, x, y, size, size);
    ctx.restore();
  }

  async function buildRoundedQrDataUrl(url: string) {
    const sourceCanvas = document.createElement("canvas");
    await renderQrIntoCanvas(sourceCanvas, url);

    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = sourceCanvas.width;
    exportCanvas.height = sourceCanvas.height;

    const ctx = exportCanvas.getContext("2d");
    if (!ctx) {
      throw new Error("No se pudo preparar el canvas del QR");
    }

    const size = sourceCanvas.width;

    ctx.beginPath();
    ctx.moveTo(QR_RADIUS, 0);
    ctx.lineTo(size - QR_RADIUS, 0);
    ctx.quadraticCurveTo(size, 0, size, QR_RADIUS);
    ctx.lineTo(size, size - QR_RADIUS);
    ctx.quadraticCurveTo(size, size, size - QR_RADIUS, size);
    ctx.lineTo(QR_RADIUS, size);
    ctx.quadraticCurveTo(0, size, 0, size - QR_RADIUS);
    ctx.lineTo(0, QR_RADIUS);
    ctx.quadraticCurveTo(0, 0, QR_RADIUS, 0);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(sourceCanvas, 0, 0);

    return exportCanvas.toDataURL("image/png");
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result as string);
    reader.readAsDataURL(file);
  };

  const downloadGeneralQr = async () => {
    if (!establecimiento?.slug) return;

    const dataUrl = await buildRoundedQrDataUrl(qrUrl);
    downloadBlob(
      new Blob([dataUrlToUint8Array(dataUrl)], { type: "image/png" }),
      `qr-${establecimiento.slug}.png`
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-32 text-sm text-gray-500">
        Cargando QR...
      </div>
    );
  }

  if (!establecimiento) return null;

  return (
    <div className="mx-auto max-w-7xl space-y-8 sm:space-y-12 px-4 sm:px-6 pb-16 sm:pb-24 pt-8 sm:pt-16">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl sm:text-3xl font-semibold">
          QR de {establecimiento.nombre}
        </h1>
        <p className="text-sm text-gray-600 break-all">{qrUrl}</p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:gap-12 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <div className="space-y-8 sm:space-y-10 rounded-2xl bg-white p-4 sm:p-7 shadow-sm">
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-gray-800">
                Apariencia del QR
              </h3>
              <p className="text-sm text-gray-500">
                Estos ajustes se aplican al QR general de tu establecimiento.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-6">
              <div className="space-y-2 rounded-xl bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-700">Color del QR</p>
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="color"
                    value={qrColor}
                    onChange={(event) => setQrColor(event.target.value)}
                    className="h-10 w-12 rounded-lg"
                  />
                  <span className="text-xs text-gray-500">{qrColor}</span>
                </div>
              </div>

              <div className="space-y-2 rounded-xl bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-700">
                  Color de fondo
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(event) => setBgColor(event.target.value)}
                    className="h-10 w-12 rounded-lg"
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
                Refuerza tu identidad colocando el logo en el centro del QR.
              </p>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-xl bg-gray-50 p-4">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Imagen del logo
                </p>
                <p className="text-xs text-gray-500">
                  PNG o JPG, preferiblemente cuadrado.
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
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-[#3fa10a] transition hover:bg-[#3fa10a]/10"
              >
                Seleccionar logo
              </button>
            </div>

            {logo && (
              <div className="space-y-2 rounded-xl bg-gray-50 p-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Tamano del logo
                  </p>
                  <p className="text-xs text-gray-500">
                    Ajusta sin afectar la lectura del QR.
                  </p>
                </div>

                <input
                  type="range"
                  min={40}
                  max={110}
                  value={logoSize}
                  onChange={(event) => setLogoSize(Number(event.target.value))}
                  className="w-full accent-[#3fa10a]"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center space-y-8 rounded-2xl bg-gray-50 p-4 sm:p-7 shadow-sm">
          <div className="space-y-1 text-center">
            <h3 className="text-base font-semibold text-gray-800">QR general</h3>
            <p className="text-sm text-gray-500">
              Este es el QR general de tu establecimiento.
            </p>
          </div>

          <div className="w-full rounded-xl bg-white/70 px-4 py-2 text-center">
            <p className="truncate text-xs text-gray-500">{qrUrl}</p>
          </div>

          <div
            className="w-full max-w-75 rounded-3xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.25)]"
            style={{ backgroundColor: bgColor }}
          >
            <canvas ref={canvasRef} className="block h-auto w-full rounded-3xl" />
          </div>

          <div className="w-full space-y-4 rounded-2xl bg-white p-5 shadow-sm">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-gray-800">QR general</h4>
              <p className="truncate text-xs text-gray-500">{qrUrl}</p>
            </div>

            <button
              onClick={downloadGeneralQr}
              className="w-full rounded-xl border border-[#3fa10a] py-3 font-medium text-[#3fa10a] transition hover:bg-[#3fa10a]/10"
            >
              Descargar QR general
            </button>
          </div>

          <div className="w-full rounded-xl bg-[#3fa10a]/10 px-4 py-3 text-center">
            <p className="text-sm font-medium text-[#3fa10a]">
              Prueba este QR con tu celular antes de imprimirlo o compartirlo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
