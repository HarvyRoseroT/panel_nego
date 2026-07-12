"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { logout } from "@/services/authService";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [open, setOpen] = useState(false);

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

  const navLinks = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/partners", label: "Partners" },
    { href: "/admin/commissions", label: "Comisiones" },
    { href: "/admin/payments", label: "Pagos" },
    { href: "/admin/ai", label: "Servicio IA" },
  ];

  return (
    <div className="min-h-screen flex bg-neutral-950 text-white">
      <div
        className={`fixed inset-0 bg-black/60 z-40 md:hidden ${
          open ? "block" : "hidden"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-neutral-900 p-6 border-r border-neutral-800 flex flex-col justify-between transform transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl font-bold">Nego Admin</h2>
            <button
              onClick={() => setOpen(false)}
              className="text-neutral-400 hover:text-white md:hidden"
            >
              <FiX size={20} />
            </button>
          </div>

          <nav className="space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block hover:text-green-400"
              >
                {link.label}
              </Link>
            ))}
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
      <main className="flex-1 w-full min-w-0">
        <div className="md:hidden flex items-center p-4 border-b border-neutral-800">
          <button
            onClick={() => setOpen(true)}
            className="text-neutral-300"
          >
            <FiMenu size={22} />
          </button>
          <span className="ml-3 font-semibold">Nego Admin</span>
        </div>

        <div className="p-4 sm:p-6 md:p-10">{children}</div>
      </main>
    </div>
  );
}
