"use client";

import {
  FiHome,
  FiBookOpen,
  FiBox,
  FiEye,
} from "react-icons/fi";
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

const visitsData = [
  { day: "Lun", visits: 80 },
  { day: "Mar", visits: 120 },
  { day: "Mié", visits: 150 },
  { day: "Jue", visits: 90 },
  { day: "Vie", visits: 200 },
  { day: "Sáb", visits: 260 },
  { day: "Dom", visits: 180 },
];

const productsData = [
  { name: "Carta", value: 2 },
  { name: "Productos", value: 18 },
  { name: "Categorías", value: 5 },
];

export default function DashboardPage() {
  return (
    <div className="pt-24 space-y-12">
      <div>
        <h1 className="text-3xl font-semibold text-gray-800">
          Bienvenido a Nego
        </h1>
        <p className="text-gray-500 mt-1">
          Resumen general de tu negocio
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Establecimientos" value="1" icon={FiHome} />
        <StatCard title="Cartas activas" value="2" icon={FiBookOpen} />
        <StatCard title="Productos" value="18" icon={FiBox} />
        <StatCard title="Vistas hoy" value="124" icon={FiEye} highlight />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Visitas de la semana
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visitsData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="visits"
                  stroke="#3fa10a"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Contenido creado
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productsData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#72eb15" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ActionCard
          title="Establecimiento"
          description="Configura los datos de tu negocio"
          icon={FiHome}
        />
        <ActionCard
          title="Carta"
          description="Crea y gestiona tu menú digital"
          icon={FiBookOpen}
        />
        <ActionCard
          title="Productos"
          description="Añade productos, precios y extras"
          icon={FiBox}
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
  value: string;
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

function ActionCard({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: any;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
      <div className="w-12 h-12 rounded-lg bg-[#72eb15]/20 flex items-center justify-center mb-4">
        <Icon className="text-[#3fa10a] text-2xl" />
      </div>
      <h2 className="text-lg font-semibold text-gray-800">
        {title}
      </h2>
      <p className="text-sm text-gray-600 mt-1">
        {description}
      </p>
    </div>
  );
}
