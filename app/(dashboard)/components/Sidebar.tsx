"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiGrid,
  FiHome,
  FiBookOpen,
  FiBox,
  FiSettings,
  FiZap,
  FiFileText
} from "react-icons/fi";

const items = [
  { label: "Inicio", href: "/dashboard", icon: FiGrid },
  { label: "Establecimiento", href: "/establecimiento", icon: FiHome },
  { label: "Cartas", href: "/cartas", icon: FiBookOpen },
  { label: "Productos", href: "/productos", icon: FiBox },
  { label: "Facturas", href: "/facturas", icon: FiFileText },
  { label: "Configuración", href: "/configuracion", icon: FiSettings },
];

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 w-64 bg-white z-50
        shadow-sm
        transform transition-transform duration-200
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
    >
      <div className="h-16 flex items-center gap-3 px-6">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#72eb15]/20">
          <FiZap className="text-[#3fa10a] text-lg" />
        </div>
        <span className="font-bold text-xl text-[#3fa10a]">
          Nego
        </span>
      </div>

      <nav className="p-3 space-y-1 mt-2">
        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`
                relative group flex items-center gap-4 rounded-lg
                px-4 py-3 text-[15px] transition-colors
                ${
                  active
                    ? "bg-[#72eb15]/15 text-[#3fa10a] font-semibold"
                    : "text-gray-600 hover:bg-gray-50"
                }
              `}
            >
              <span
                className={`
                  absolute left-0 h-7 w-1 rounded-r
                  ${active ? "bg-[#3fa10a]" : "bg-transparent"}
                `}
              />

              <Icon
                className={`
                  text-lg
                  ${
                    active
                      ? "text-[#3fa10a]"
                      : "text-gray-400 group-hover:text-gray-600"
                  }
                `}
              />

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
