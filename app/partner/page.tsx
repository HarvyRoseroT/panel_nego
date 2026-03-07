"use client";

import { useEffect, useState } from "react";
import { getPartnerDashboard } from "@/services/partnerPanelService";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function PartnerDashboardPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getPartnerDashboard().then(setData);
  }, []);

  if (!data) {
    return <p className="text-neutral-400">Cargando...</p>;
  }

  const barData = [
    { name: "Disponible", value: Number(data.totals.available) },
    { name: "Pendiente", value: Number(data.totals.pending) },
  ];

  const pieData = [
    { name: "Disponible", value: Number(data.totals.available) },
    { name: "Pendiente", value: Number(data.totals.pending) },
  ];

  const COLORS = ["#10b981", "#facc15"];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl md:text-3xl font-bold text-white">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card title="Referidos" value={data.referrals} />
        <Card
          title="Total Generado"
          value={formatMoney(data.totals.total_generated)}
        />
        <Card
          title="Disponible"
          value={formatMoney(data.totals.available)}
        />
        <Card
          title="Pendiente"
          value={formatMoney(data.totals.pending)}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 h-80 md:h-95">
          <h2 className="text-white font-semibold mb-4">
            Distribución de Comisiones
          </h2>

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                innerRadius={60}
              >
                {pieData.map((entry: any, index: number) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip formatter={(value: any) => formatMoney(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 h-80 md:h-95">
          <h2 className="text-white font-semibold mb-4">
            Disponible vs Pendiente
          </h2>

          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />

              <Tooltip formatter={(value: any) => formatMoney(value)} />

              <Bar
                dataKey="value"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: any }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 md:p-6">
      <p className="text-sm text-neutral-400">{title}</p>

      <p className="text-xl md:text-2xl font-bold mt-2 text-emerald-400">
        {value}
      </p>
    </div>
  );
}

function formatMoney(value: number) {
  return Number(value).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  });
}