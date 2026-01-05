"use client";

import { useState, useRef, useEffect } from "react";
import {
  FiMenu,
  FiUser,
  FiLogOut,
  FiGift,
  FiCheckCircle,
  FiAlertTriangle,
  FiXCircle,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";

export default function Header({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void;
}) {
  const { logout, user } = useUser();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setOpen(false);
    logout();
    router.replace("/login");
  };

  const subscription = user?.subscription;

  const statusConfig: Record<
    string,
    { label: string; styles: string; Icon: any }
  > = {
    trial: {
      label: "Prueba gratuita",
      styles: "bg-yellow-100 text-yellow-800",
      Icon: FiGift,
    },
    active: {
      label: "Plan activo",
      styles: "bg-[#72eb15]/20 text-[#3fa10a]",
      Icon: FiCheckCircle,
    },
    expired: {
      label: "Plan expirado",
      styles: "bg-red-100 text-red-700",
      Icon: FiAlertTriangle,
    },
    canceled: {
      label: "Plan cancelado",
      styles: "bg-gray-100 text-gray-600",
      Icon: FiXCircle,
    },
  };

  const planUI = subscription
    ? statusConfig[subscription.status]
    : null;

  return (
    <header className="fixed top-0 left-0 md:left-64 right-0 h-18 bg-white z-30 shadow-sm flex items-center justify-between px-5 md:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2.5 rounded-lg text-gray-600 hover:bg-gray-100"
        >
          <FiMenu className="text-xl" />
        </button>

        {subscription && planUI && (
          <div
            className={`flex items-center gap-2.5 px-4 py-1.5 rounded-full text-sm font-semibold ${planUI.styles}`}
          >
            <planUI.Icon className="text-base" />
            <span>
              {planUI.label}
              {subscription.status === "active" &&
              subscription.Plan?.name
                ? ` · ${subscription.Plan.name}`
                : ""}
            </span>
          </div>
        )}
      </div>

      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="
            flex items-center gap-2.5 px-5 py-2.5 rounded-lg
            bg-[#72eb15]/15 text-[#3fa10a]
            font-semibold text-base
            hover:bg-[#72eb15]/25 transition-colors
          "
        >
          <FiUser className="text-lg" />
          Mi cuenta
        </button>

        {open && (
          <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg py-1">
            <button className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
              <FiUser className="text-gray-400 text-base" />
              Perfil
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-red-600 hover:bg-red-50"
            >
              <FiLogOut className="text-base" />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
