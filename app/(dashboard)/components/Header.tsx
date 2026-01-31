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
import { openBillingPortal } from "@/services/stripeService";
import ModalPlanes from "./ModalPlanes";

const GRACE_PERIOD_DAYS = 5;

function isInGracePeriod(subscription: any) {
  if (!subscription || subscription.status !== "past_due") return false;
  const updatedAt = new Date(subscription.updatedAt);
  const limit = new Date(updatedAt);
  limit.setDate(limit.getDate() + GRACE_PERIOD_DAYS);
  return new Date() <= limit;
}

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

  const handleFixPayment = async () => {
    const url = await openBillingPortal();
    window.location.href = url;
  };

  const subscription = user?.subscription;
  const showGraceBanner = isInGracePeriod(subscription);

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
    past_due: {
      label: "Pago pendiente",
      styles: "bg-yellow-100 text-yellow-800",
      Icon: FiAlertTriangle,
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
      {showGraceBanner && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-yellow-50 border-b border-yellow-200 px-5 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-yellow-800 text-sm font-medium">
            <FiAlertTriangle className="text-lg shrink-0" />
            <span>
              Tu último pago falló. Estás en período de gracia.
            </span>
          </div>
          <button
            onClick={handleFixPayment}
            className="px-4 py-2 rounded-lg bg-yellow-400 text-yellow-900 font-semibold text-sm hover:bg-yellow-500 transition"
          >
            Actualizar método de pago
          </button>
        </div>
      )}

      <header
        className={`fixed left-0 right-0 md:left-64 h-18 bg-white z-30 shadow-sm flex items-center justify-between px-5 md:px-8 ${
          showGraceBanner ? "top-14" : "top-0"
        }`}
      >
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
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-semibold text-base ${planUI.styles}`}
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
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-[#72eb15]/15 text-[#3fa10a] font-semibold text-base"
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
                <p className="mt-3 text-sm font-semibold text-gray-900 truncate">
                  {user.name}
                </p>
                <div className="mt-1 flex items-center gap-1 text-xs text-gray-500 truncate">
                  <FiMail className="text-[13px]" />
                  {user.email}
                </div>
              </div>

              <div className="h-px bg-gray-100" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-600 hover:bg-red-50"
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
