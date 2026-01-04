"use client";

import { useUser } from "@/contexts/UserContext";

export default function Header() {
  const { logout } = useUser();

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <span className="text-sm text-gray-500">
        Panel de administración
      </span>

      <button
        onClick={logout}
        className="text-sm text-red-600 hover:underline"
      >
        Cerrar sesión
      </button>
    </header>
  );
}
