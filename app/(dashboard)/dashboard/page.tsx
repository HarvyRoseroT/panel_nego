"use client";

import { useEffect, useState } from "react";
import { FiHome, FiBookOpen, FiEye } from "react-icons/fi";
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
  AnalyticsResumen,
  VisitasPorDia,
  CartaTop,
} from "@/services/analyticsService";

import { getMyEstablecimiento } from "@/services/establecimientoService";
import { getCartasByEstablecimiento } from "@/services/cartaService";
import { getStoredToken } from "@/services/authService";
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
  ultimaVisita: null
};

export default function DashboardPage() {
  const [establecimiento, setEstablecimiento] =
    useState<Establecimiento | null>(null);
  const [resumen, setResumen] =
    useState<AnalyticsResumen>(DEFAULT_RESUMEN);
  const [visitas, setVisitas] = useState<VisitasPorDia[]>([]);
  const [cartasTop, setCartasTop] =
    useState<(CartaTop & { nombre: string })[]>([]);
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
          setCartasActivas(0);
          setLoading(false);
          return;
        }

        const [
          resumenData,
          visitasData,
          cartasTopData,
          cartasData,
        ] = await Promise.all([
          getAnalyticsResumen(est.id),
          getVisitasPorDia(est.id),
          getCartasTop(est.id),
          getCartasByEstablecimiento(est.id, token),
        ]);

        const cartasMap = new Map(
          cartasData.map((c: any) => [c.id, c.nombre])
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

        setCartasActivas(
          cartasData.filter((c: any) => c.activa === true).length
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
        Cargando estadísticas…
      </div>
    );
  }

  return (
    <div className="pt-24 space-y-16">
      <div>
        <h1 className="text-3xl font-semibold text-gray-800">
          Estadísticas {establecimiento ? `de ${establecimiento.nombre}` : ""}
        </h1>
        <p className="text-gray-500 mt-1">
          {establecimiento
            ? "Resumen general de tu negocio"
            : "Crea tu establecimiento para comenzar a generar estadísticas"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Visitas totales"
          value={resumen.visitas}
          icon={FiEye}
          highlight
        />
        <StatCard
          title="Visitas únicas"
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Visitas hoy"
          value={resumen.visitasHoy}
          icon={FiEye}
        />
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Visitas por día
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

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Cartas más vistas
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
  icon: any;
  highlight?: boolean;
}) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm p-5 flex items-center justify-between ${
        highlight ? "ring-1 ring-[#72eb15]/40" : ""
      }`}
    >
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-800 mt-1">
          {value}
        </p>
      </div>
      <div className="w-11 h-11 rounded-lg bg-[#72eb15]/20 flex items-center justify-center">
        <Icon className="text-[#3fa10a] text-xl" />
      </div>
    </div>
  );
}
