"use client";

import { useState, useRef, useEffect } from "react";
import {
  FiMenu,
  FiUser,
  FiGift,
  FiCheckCircle,
  FiAlertTriangle,
  FiXCircle,
  FiLogOut,
  FiMail,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import ModalPlanes from "./ModalPlanes";

export default function Header({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void;
}) {
  const { user, logout, refreshUser } = useUser();
  const router = useRouter();

  const [openMenu, setOpenMenu] = useState(false);
  const [openPlanes, setOpenPlanes] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpenMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setOpenMenu(false);
    logout();
    router.replace("/login");
  };

  const handleOpenPlanes = async () => {
    await refreshUser();
    setOpenPlanes(true);
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
    pending: {
      label: "Pendiente",
      styles: "bg-orange-100 text-orange-700",
      Icon: FiAlertTriangle,
    },
    active: {
      label: "Plan activo",
      styles: "bg-[#72eb15]/20 text-[#3fa10a]",
      Icon: FiCheckCircle,
    },
    expired: {
      label: "Plan expirado",
      styles: "bg-gray-100 text-gray-600",
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
    <>
      <header className="fixed top-0 left-0 md:left-64 right-0 h-18 bg-white z-30 shadow-sm flex items-center justify-between px-5 md:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2.5 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            <FiMenu className="text-xl" />
          </button>

          {subscription && planUI && (
            <button
              onClick={handleOpenPlanes}
              className={`
                flex items-center gap-2.5
                px-5 py-2.5 rounded-xl
                font-semibold text-base
                ${planUI.styles}
                hover:opacity-90 transition
                focus:outline-none focus:ring-2 focus:ring-[#72eb15]/40
              `}
            >
              <planUI.Icon className="text-lg shrink-0" />
              <span className="leading-none whitespace-nowrap">
                {planUI.label}
                {subscription.status === "active" &&
                subscription.Plan?.name
                  ? ` · ${subscription.Plan.name}`
                  : ""}
              </span>
            </button>
          )}
        </div>

        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="
              flex items-center gap-2.5
              px-5 py-2.5 rounded-xl
              bg-[#72eb15]/15 text-[#3fa10a]
              font-semibold text-base
              hover:bg-[#72eb15]/25 transition
            "
          >
            <FiUser className="text-lg" />
            Mi cuenta
          </button>

          {openMenu && user && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="px-6 py-5 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-[#72eb15]/20 flex items-center justify-center text-[#3fa10a] font-semibold text-xl">
                  {user.name.charAt(0).toUpperCase()}
                </div>

                <p className="mt-3 text-sm font-semibold text-gray-900 truncate max-w-full">
                  {user.name}
                </p>

                <div className="mt-1 flex items-center gap-1 text-xs text-gray-500 truncate max-w-full">
                  <FiMail className="text-[13px]" />
                  {user.email}
                </div>
              </div>

              <div className="h-px bg-gray-100" />

              <button
                onClick={handleLogout}
                className="
                  w-full flex items-center gap-3
                  px-5 py-3 text-sm
                  text-red-600
                  hover:bg-red-50
                  transition
                "
              >
                <FiLogOut className="text-base" />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </header>

      <ModalPlanes
        open={openPlanes}
        onClose={() => setOpenPlanes(false)}
        currentSubscription={user?.subscription}
      />
    </>
  );
}
