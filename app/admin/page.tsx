import Link from "next/link";
import BillingModeControl from "./components/BillingModeControl";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard SuperAdmin</h1>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        <div className="bg-neutral-900 p-6 rounded-xl">
          <p className="text-sm text-neutral-400">Total Partners</p>
          <p className="text-2xl font-bold">--</p>
        </div>

        <div className="bg-neutral-900 p-6 rounded-xl">
          <p className="text-sm text-neutral-400">Total Clientes</p>
          <p className="text-2xl font-bold">--</p>
        </div>

        <div className="bg-neutral-900 p-6 rounded-xl">
          <p className="text-sm text-neutral-400">Comisiones pendientes</p>
          <p className="text-2xl font-bold">--</p>
        </div>

        <div className="bg-neutral-900 p-6 rounded-xl">
          <p className="text-sm text-neutral-400">Tokens activos</p>
          <p className="text-2xl font-bold">--</p>
        </div>
      </div>

      <div className="mt-8">
        <BillingModeControl />
      </div>

      <div className="mt-8 rounded-xl border border-neutral-800 bg-neutral-900 p-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between">
          <div>
            <p className="text-sm text-neutral-400">Servicio IA</p>
            <h2 className="mt-2 text-xl font-bold">Control de generacion de imagenes</h2>
            <p className="mt-2 max-w-2xl text-sm text-neutral-400">
              Activa o desactiva el servicio de IA usado para generar imagenes
              desde el panel de superadmin.
            </p>
          </div>

          <Link
            href="/admin/ai"
            className="w-full shrink-0 rounded-lg bg-green-500 px-4 py-2 text-center font-semibold text-black transition hover:bg-green-400 sm:w-auto"
          >
            Administrar
          </Link>
        </div>
      </div>
    </div>
  );
}
