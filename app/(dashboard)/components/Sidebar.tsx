"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Establecimiento", href: "/establecimiento" },
  { label: "Carta", href: "/carta" },
  { label: "Productos", href: "/productos" },
  { label: "Configuración", href: "/configuracion" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r">
      <div className="h-16 flex items-center px-6 font-bold text-lg">
        Nego
      </div>

      <nav className="px-3 space-y-1">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded px-4 py-2 text-sm transition ${
                active
                  ? "bg-gray-100 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
