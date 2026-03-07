"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiHome, FiUsers, FiDollarSign, FiLogOut, FiMenu } from "react-icons/fi";

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [open, setOpen] = useState(false);

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

  const navItem = (href: string, label: string, Icon: any) => {
    const active = pathname === href;

    return (
      <Link
        href={href}
        onClick={() => setOpen(false)}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
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
      <div
        className={`fixed inset-0 bg-black/60 z-40 md:hidden ${
          open ? "block" : "hidden"
        }`}
        onClick={() => setOpen(false)}
      />

      <aside
        className={`fixed md:static z-50 w-64 bg-neutral-900 border-r border-neutral-800 p-6 flex flex-col justify-between transform transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
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
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 text-sm"
        >
          <FiLogOut size={18} />
          Cerrar sesión
        </button>
      </aside>

      <main className="flex-1 w-full">
        <div className="md:hidden flex items-center p-4 border-b border-neutral-800">
          <button
            onClick={() => setOpen(true)}
            className="text-neutral-300"
          >
            <FiMenu size={22} />
          </button>
        </div>

        <div className="p-4 md:p-10">{children}</div>
      </main>
    </div>
  );
}