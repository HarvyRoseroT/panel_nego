"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiHome, FiUsers, FiDollarSign, FiLogOut } from "react-icons/fi";

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      router.replace("/login");
      return;
    }

    const user = JSON.parse(storedUser);

    if (user.role !== "partner") {
      router.replace("/");
      return;
    }

    setChecking(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/login");
  };

  const navItem = (
    href: string,
    label: string,
    Icon: any
  ) => {
    const active = pathname === href;

    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
          active
            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
            : "text-neutral-400 hover:text-white hover:bg-neutral-800"
        }`}
      >
        <Icon size={18} />
        <span>{label}</span>
      </Link>
    );
  };

  if (checking) return null;

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex">
      <aside className="w-64 bg-neutral-900 border-r border-neutral-800 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-10 text-emerald-400">
            Partner Panel
          </h2>

          <nav className="space-y-3 text-sm">
            {navItem("/partner", "Dashboard", FiHome)}
            {navItem("/partner/commissions", "Comisiones", FiDollarSign)}
            {navItem("/partner/referrals", "Referidos", FiUsers)}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all duration-200 text-sm"
        >
          <FiLogOut size={18} />
          Cerrar sesión
        </button>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}