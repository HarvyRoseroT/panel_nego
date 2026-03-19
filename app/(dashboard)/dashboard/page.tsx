"use client";

import { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import { FiHome, FiBookOpen, FiEye, FiPackage, FiTruck } from "react-icons/fi";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

import {
  getAnalyticsResumen,
  getVisitasPorDia,
  getCartasTop,
  getProductosTop,
  getProductosDomicilioTop,
  AnalyticsResumen,
  VisitasPorDia,
  CartaTop,
  ProductoTop,
} from "@/services/analyticsService";

import { getMyEstablecimiento } from "@/services/establecimientoService";
import { getCartasByEstablecimiento } from "@/services/cartaService";
import { getStoredToken } from "@/services/authService";
import type { Carta } from "@/services/cartaService";
import type { Establecimiento } from "@/services/establecimientoService";

const DEFAULT_RESUMEN: AnalyticsResumen = {
  visitas: 0,
  visitasUnicas: 0,
  visitasCartas: 0,
  visitasHoy: 0,
  visitasSemana: 0,
  visitasMes: 0,
  visitasUltimos7Dias: 0,
  visitasUltimos30Dias: 0,
  tasaInteraccionCartas: 0,
  promedioVisitasPorUsuario: 0,
  ultimaVisita: null,
};

export default function DashboardPage() {
  const [establecimiento, setEstablecimiento] =
    useState<Establecimiento | null>(null);
  const [resumen, setResumen] = useState<AnalyticsResumen>(DEFAULT_RESUMEN);
  const [visitas, setVisitas] = useState<VisitasPorDia[]>([]);
  const [cartasTop, setCartasTop] =
    useState<(CartaTop & { nombre: string })[]>([]);
  const [productosTop, setProductosTop] =
    useState<(ProductoTop & { nombre: string })[]>([]);
  const [productosDomicilioTop, setProductosDomicilioTop] =
    useState<(ProductoTop & { nombre: string })[]>([]);
  const [cartasActivas, setCartasActivas] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const token = getStoredToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const est = await getMyEstablecimiento(token);
        setEstablecimiento(est);

        if (!est) {
          setResumen(DEFAULT_RESUMEN);
          setVisitas([]);
          setCartasTop([]);
          setProductosTop([]);
          setProductosDomicilioTop([]);
          setCartasActivas(0);
          setLoading(false);
          return;
        }

        const [
          resumenData,
          visitasData,
          cartasTopData,
          productosTopData,
          productosDomicilioTopData,
          cartasData,
        ] = await Promise.all([
          getAnalyticsResumen(est.id),
          getVisitasPorDia(est.id),
          getCartasTop(est.id),
          getProductosTop(est.id),
          getProductosDomicilioTop(est.id),
          getCartasByEstablecimiento(est.id, token),
        ]);

        const cartasMap = new Map(
          cartasData.map((c: Carta) => [c.id, c.nombre] as const)
        );

        setResumen(resumenData);

        setVisitas(
          visitasData.map((v) => ({
            fecha: v.fecha,
            total: Number(v.total),
          }))
        );

        setCartasTop(
          cartasTopData.map((c) => ({
            ...c,
            vistas: Number(c.vistas),
            nombre: cartasMap.get(c.carta_id) || `Carta ${c.carta_id}`,
          }))
        );

        setProductosTop(
          productosTopData.map((productoTop) => ({
            ...productoTop,
            total: Number(productoTop.total),
            nombre:
              productoTop.producto?.nombre ||
              `Producto ${productoTop.producto_id}`,
          }))
        );

        setProductosDomicilioTop(
          productosDomicilioTopData.map((productoTop) => ({
            ...productoTop,
            total: Number(productoTop.total),
            nombre:
              productoTop.producto?.nombre ||
              `Producto ${productoTop.producto_id}`,
          }))
        );

        setCartasActivas(
          cartasData.filter((c: Carta) => c.activa === true).length
        );
      } catch (error) {
        console.error("Dashboard analytics error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="pt-24 text-center text-sm text-gray-500">
        Cargando estadisticas...
      </div>
    );
  }

  return (
    <div className="pt-24 space-y-16">
      <div>
        <h1 className="text-3xl font-semibold text-gray-800">
          Estadisticas {establecimiento ? `de ${establecimiento.nombre}` : ""}
        </h1>
        <p className="mt-1 text-gray-500">
          {establecimiento
            ? "Resumen general de tu negocio"
            : "Crea tu establecimiento para comenzar a generar estadisticas"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Visitas totales"
          value={resumen.visitas}
          icon={FiEye}
          highlight
        />
        <StatCard
          title="Visitas unicas"
          value={resumen.visitasUnicas}
          icon={FiHome}
        />
        <StatCard
          title="Visitas a cartas"
          value={resumen.visitasCartas}
          icon={FiEye}
        />
        <StatCard
          title="Cartas activas"
          value={cartasActivas}
          icon={FiBookOpen}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatCard title="Visitas hoy" value={resumen.visitasHoy} icon={FiEye} />
        <StatCard
          title="Visitas esta semana"
          value={resumen.visitasSemana}
          icon={FiEye}
        />
        <StatCard
          title="Visitas este mes"
          value={resumen.visitasMes}
          icon={FiEye}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Visitas por dia
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visitas}>
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#3fa10a"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Cartas mas vistas
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cartasTop}>
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="vistas" fill="#72eb15" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TopProductosCard
          title="Productos mas vistos"
          emptyLabel="Aun no hay visitas a productos"
          data={productosTop}
          icon={FiPackage}
        />
        <TopProductosCard
          title="Productos top en domicilio"
          emptyLabel="Aun no hay interacciones de domicilio"
          data={productosDomicilioTop}
          icon={FiTruck}
        />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  highlight = false,
}: {
  title: string;
  value: number | string;
  icon: IconType;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-xl bg-white p-5 shadow-sm ${
        highlight ? "ring-1 ring-[#72eb15]/40" : ""
      }`}
    >
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="mt-1 text-2xl font-semibold text-gray-800">{value}</p>
      </div>
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#72eb15]/20">
        <Icon className="text-xl text-[#3fa10a]" />
      </div>
    </div>
  );
}

function TopProductosCard({
  title,
  emptyLabel,
  data,
  icon: Icon,
}: {
  title: string;
  emptyLabel: string;
  data: (ProductoTop & { nombre: string })[];
  icon: IconType;
}) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#72eb15]/20">
          <Icon className="text-lg text-[#3fa10a]" />
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex h-72 items-center justify-center text-center text-sm text-gray-500">
          {emptyLabel}
        </div>
      ) : (
        <div className="space-y-3">
          {data.slice(0, 5).map((producto, index) => (
            <div
              key={`${title}-${producto.producto_id}`}
              className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 px-4 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#72eb15]/15 text-sm font-semibold text-[#3fa10a]">
                  {index + 1}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-800">
                    {producto.nombre}
                  </p>
                  <p className="text-xs text-gray-500">
                    ID #{producto.producto_id}
                  </p>
                </div>
              </div>
              <p className="shrink-0 text-sm font-semibold text-gray-800">
                {Number(producto.total)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
