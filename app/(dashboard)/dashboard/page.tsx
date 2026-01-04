"use client";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Bienvenido a Nego</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Establecimiento">
          Configura los datos de tu negocio
        </Card>

        <Card title="Carta">
          Crea y gestiona tu menú digital
        </Card>

        <Card title="Productos">
          Añade productos y precios
        </Card>
      </div>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border rounded p-4">
      <h2 className="font-medium mb-2">{title}</h2>
      <p className="text-sm text-gray-600">{children}</p>
    </div>
  );
}
