"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { logout } from "@/services/authService";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (!stored) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(stored);

    if (user.role !== "superadmin") {
      router.push("/");
      return;
    }

    setAuthorized(true);
  }, []);

  const handleLogout = () => {
    logout(); // limpia token y user
    router.push("/login");
  };

  if (!authorized) return null;

  return (
    <div className="min-h-screen flex bg-neutral-950 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 p-6 border-r border-neutral-800 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-8">Nego Admin</h2>

          <nav className="space-y-4">
            <Link href="/admin" className="block hover:text-green-400">
              Dashboard
            </Link>
            <Link href="/admin/partners" className="block hover:text-green-400">
              Partners
            </Link>
            <Link
              href="/admin/commissions"
              className="block hover:text-green-400"
            >
              Comisiones
            </Link>
            <Link href="/admin/payments" className="block hover:text-green-400">
              Pagos
            </Link>
            <Link href="/admin/ai" className="block hover:text-green-400">
              Servicio IA
            </Link>
          </nav>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="mt-10 bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded-lg transition"
        >
          Cerrar sesión
        </button>
      </aside>

      {/* Content */}
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
