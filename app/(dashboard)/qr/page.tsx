"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import {
  getMyEstablecimiento,
  type Establecimiento,
} from "@/services/establecimientoService";
import { getStoredToken } from "@/services/authService";
import { getPlanosByEstablecimiento } from "@/services/planoEstablecimientoService";
import { createZipBlob } from "@/utils/zip";

const QR_BASE_URL = "https://nego.ink";
const QR_SIZE = 300;
const QR_RADIUS = 32;

interface MesaQrItem {
  id: number;
  nombre: string;
  planoNombre: string;
  capacidad: number | null;
}

function sanitizeFilePart(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

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
  const [mesas, setMesas] = useState<MesaQrItem[]>([]);
  const [selectedMesaIds, setSelectedMesaIds] = useState<number[]>([]);
  const [previewMesaId, setPreviewMesaId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingTables, setDownloadingTables] = useState(false);

  const [qrColor, setQrColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [logo, setLogo] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState(70);

  const qrUrl = establecimiento ? `${QR_BASE_URL}/${establecimiento.slug}` : "";

  const sortedMesas = useMemo(() => {
    const collator = new Intl.Collator("es", {
      numeric: true,
      sensitivity: "base",
    });

    return [...mesas].sort((a, b) => collator.compare(a.nombre, b.nombre));
  }, [mesas]);

  const selectedMesas = useMemo(
    () => sortedMesas.filter((mesa) => selectedMesaIds.includes(mesa.id)),
    [selectedMesaIds, sortedMesas]
  );

  const previewMesa = useMemo(
    () =>
      sortedMesas.find((mesa) => mesa.id === previewMesaId) ??
      selectedMesas[0] ??
      null,
    [previewMesaId, selectedMesas, sortedMesas]
  );

  const previewUrl = previewMesa
    ? `${qrUrl}?mesaId=${previewMesa.id}&mesa=${encodeURIComponent(
        previewMesa.nombre
      )}`
    : qrUrl;

  useEffect(() => {
    const fetchData = async () => {
      const token = getStoredToken();
      if (!token) return setLoading(false);

      try {
        const data = await getMyEstablecimiento(token);
        if (!data?.slug || !data.id) return router.replace("/establecimiento");

        setEstablecimiento(data);

        const planos = await getPlanosByEstablecimiento(data.id, token);
        const nextMesas = planos.flatMap((plano) =>
          plano.elementos
            .filter((elemento) => elemento.tipo === "mesa")
            .map((mesa) => ({
              id: mesa.id,
              nombre: mesa.nombre || `Mesa ${mesa.id}`,
              planoNombre: plano.nombre,
              capacidad: mesa.capacidad,
            }))
        );

        setMesas(nextMesas);
      } catch {
        router.replace("/establecimiento");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  useEffect(() => {
    if (!canvasRef.current || !establecimiento) return;

    void renderQrIntoCanvas(canvasRef.current, previewUrl).catch(() => undefined);
  }, [establecimiento, previewUrl, qrColor, bgColor, logo, logoSize]);

  useEffect(() => {
    setSelectedMesaIds((current) =>
      current.filter((id) => mesas.some((mesa) => mesa.id === id))
    );
    setPreviewMesaId((current) =>
      current !== null && mesas.some((mesa) => mesa.id === current) ? current : null
    );
  }, [mesas]);

  async function renderQrIntoCanvas(
    canvas: HTMLCanvasElement,
    url: string
  ) {
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

  const toggleMesa = (mesaId: number) => {
    setSelectedMesaIds((current) =>
      current.includes(mesaId)
        ? current.filter((id) => id !== mesaId)
        : [...current, mesaId]
    );
    setPreviewMesaId(mesaId);
  };

  const toggleAllMesas = () => {
    if (selectedMesaIds.length === sortedMesas.length) {
      setSelectedMesaIds([]);
      setPreviewMesaId(null);
      return;
    }

    setSelectedMesaIds(sortedMesas.map((mesa) => mesa.id));
    setPreviewMesaId(sortedMesas[0]?.id ?? null);
  };

  const downloadGeneralQr = async () => {
    if (!establecimiento?.slug) return;

    const dataUrl = await buildRoundedQrDataUrl(qrUrl);
    downloadBlob(
      new Blob([dataUrlToUint8Array(dataUrl)], { type: "image/png" }),
      `qr-${establecimiento.slug}.png`
    );
  };

  const downloadSelectedTables = async () => {
    if (!establecimiento?.slug || selectedMesas.length === 0) return;

    setDownloadingTables(true);

    try {
      if (selectedMesas.length === 1) {
        const mesa = selectedMesas[0];
        const mesaUrl = `${qrUrl}?mesaId=${mesa.id}&mesa=${encodeURIComponent(
          mesa.nombre
        )}`;
        const dataUrl = await buildRoundedQrDataUrl(mesaUrl);

        downloadBlob(
          new Blob([dataUrlToUint8Array(dataUrl)], { type: "image/png" }),
          `qr-${establecimiento.slug}-${sanitizeFilePart(mesa.nombre || `mesa-${mesa.id}`)}.png`
        );
        return;
      }

      const files = await Promise.all(
        selectedMesas.map(async (mesa) => {
          const mesaUrl = `${qrUrl}?mesaId=${mesa.id}&mesa=${encodeURIComponent(
            mesa.nombre
          )}`;
          const dataUrl = await buildRoundedQrDataUrl(mesaUrl);

          return {
            name: `qr-${sanitizeFilePart(mesa.nombre || `mesa-${mesa.id}`)}.png`,
            data: dataUrlToUint8Array(dataUrl),
          };
        })
      );

      const zipBlob = createZipBlob(files);
      downloadBlob(zipBlob, `qrs-mesas-${establecimiento.slug}.zip`);
    } finally {
      setDownloadingTables(false);
    }
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
    <div className="pt-16 pb-24 px-6 max-w-7xl mx-auto space-y-12">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold">
          QR de {establecimiento.nombre}
        </h1>
        <p className="text-sm text-gray-600">{previewUrl}</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-12">
        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-sm p-7 space-y-10">
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-gray-800">
                Apariencia del QR
              </h3>
              <p className="text-sm text-gray-500">
                Estos ajustes se aplican al QR general y a los QR de cada mesa.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-xl bg-gray-50 p-4 space-y-2">
                <p className="text-sm font-medium text-gray-700">Color del QR</p>
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="color"
                    value={qrColor}
                    onChange={(event) => setQrColor(event.target.value)}
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
                    onChange={(event) => setBgColor(event.target.value)}
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

          <div className="bg-white rounded-2xl shadow-sm p-7 space-y-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-gray-800">
                  QR por mesa
                </h3>
                <p className="text-sm text-gray-500">
                  Selecciona una o varias mesas para generar su QR individual.
                </p>
              </div>

              <button
                onClick={toggleAllMesas}
                disabled={sortedMesas.length === 0}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {selectedMesaIds.length === sortedMesas.length &&
                sortedMesas.length > 0
                  ? "Quitar todas"
                  : "Seleccionar todas"}
              </button>
            </div>

            {sortedMesas.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-8 text-sm text-gray-500">
                No hay mesas disponibles. Crea mesas desde el plano del
                restaurante para poder generar QR individuales.
              </div>
            ) : (
              <div className="space-y-3">
                {sortedMesas.map((mesa) => {
                  const checked = selectedMesaIds.includes(mesa.id);

                  return (
                    <label
                      key={mesa.id}
                      className={`flex items-center justify-between gap-4 rounded-2xl border p-4 transition cursor-pointer ${
                        checked
                          ? "border-[#3fa10a] bg-[#3fa10a]/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleMesa(mesa.id)}
                          className="h-4 w-4 accent-[#3fa10a]"
                        />

                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {mesa.nombre}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {mesa.planoNombre}
                            {mesa.capacidad
                              ? ` · ${mesa.capacidad} puestos`
                              : ""}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          setPreviewMesaId(mesa.id);
                        }}
                        className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-white"
                      >
                        Ver QR
                      </button>
                    </label>
                  );
                })}
              </div>
            )}

            <div className="flex flex-col gap-3 md:flex-row">
              <button
                onClick={downloadSelectedTables}
                disabled={selectedMesaIds.length === 0 || downloadingTables}
                className="flex-1 rounded-xl bg-[#3fa10a] py-3 text-white font-medium hover:bg-[#369208] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {downloadingTables
                  ? "Preparando descarga..."
                  : selectedMesaIds.length > 1
                    ? "Descargar ZIP de mesas"
                    : "Descargar QR de mesa"}
              </button>

              <p className="text-xs text-gray-500 md:max-w-xs md:self-center">
                Si seleccionas varias mesas, la descarga se genera en un archivo
                ZIP.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl shadow-sm p-7 space-y-8 flex flex-col items-center">
          <div className="text-center space-y-1">
            <h3 className="text-base font-semibold text-gray-800">
              {previewMesa ? `Vista previa de ${previewMesa.nombre}` : "QR general"}
            </h3>
            <p className="text-sm text-gray-500">
              {previewMesa
                ? "Este QR identifica una mesa para que el cliente haga pedidos desde allí."
                : "Este es el QR general de tu establecimiento."}
            </p>
          </div>

          <div className="w-full rounded-xl bg-white/70 px-4 py-2 text-center">
            <p className="text-xs text-gray-500 truncate">{previewUrl}</p>
          </div>

          <div
            className="rounded-3xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.25)]"
            style={{ backgroundColor: bgColor }}
          >
            <canvas ref={canvasRef} className="block rounded-3xl" />
          </div>

          <div className="w-full rounded-2xl bg-white p-5 shadow-sm space-y-4">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-gray-800">QR general</h4>
              <p className="text-xs text-gray-500 truncate">{qrUrl}</p>
            </div>

            <button
              onClick={downloadGeneralQr}
              className="w-full rounded-xl border border-[#3fa10a] py-3 text-[#3fa10a] font-medium hover:bg-[#3fa10a]/10 transition"
            >
              Descargar QR general
            </button>
          </div>

          <div className="w-full rounded-xl bg-[#3fa10a]/10 px-4 py-3 text-center">
            <p className="text-sm text-[#3fa10a] font-medium">
              Prueba cada QR con tu celular antes de imprimirlo y colocarlo en
              las mesas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
