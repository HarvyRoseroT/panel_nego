export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard SuperAdmin</h1>

      <div className="grid grid-cols-4 gap-6">
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
    </div>
  );
}