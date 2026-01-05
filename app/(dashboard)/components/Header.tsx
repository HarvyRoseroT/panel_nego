"use client";

import { useUser } from "@/contexts/UserContext";

export default function Header({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void;
}) {
  const { logout } = useUser();

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        {/* Botón hamburguesa (solo móvil) */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden text-gray-600"
        >
          ☰
        </button>

        <span className="text-sm text-gray-500">
          Panel de administración
        </span>
      </div>

      <button
        onClick={logout}
        className="text-sm text-red-600 hover:underline"
      >
        Cerrar sesión
      </button>
    </header>
  );
}
