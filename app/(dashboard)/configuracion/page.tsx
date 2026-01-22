"use client";

import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { requestPasswordReset } from "@/services/authService";
import ModalPlanes from "../components/ModalPlanes";
import { useRouter } from "next/navigation";
import { updateNotificationPreferences } from "@/services/authService";

export default function ConfiguracionPage() {
  const { user, refreshUser } = useUser();

  const router = useRouter();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [planesOpen, setPlanesOpen] = useState(false);

  const prefs = user.notification_preferences;

  const [emailsPagos, setEmailsPagos] = useState(
    prefs?.emails_pagos ?? true
  );
  const [emailsCambiosPlan, setEmailsCambiosPlan] = useState(
    prefs?.emails_cambios_plan ?? true
  );
  const [emailsNovedades, setEmailsNovedades] = useState(
    prefs?.emails_novedades ?? false
  );

  const [savingPrefs, setSavingPrefs] = useState(false);
  const [savedOk, setSavedOk] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-500">Cargando configuración…</p>
      </div>
    );
  }

  const originalPrefs = {
    emails_pagos: prefs?.emails_pagos ?? true,
    emails_cambios_plan: prefs?.emails_cambios_plan ?? true,
    emails_novedades: prefs?.emails_novedades ?? false
  };

  const hasChanges =
    emailsPagos !== originalPrefs.emails_pagos ||
    emailsCambiosPlan !== originalPrefs.emails_cambios_plan ||
    emailsNovedades !== originalPrefs.emails_novedades;

  const subscription = user.subscription;
  const plan = subscription?.Plan;

  const handleSendReset = async () => {
    try {
      setSending(true);
      await requestPasswordReset(user.email);
      setSent(true);
      setConfirmOpen(false);
    } finally {
      setSending(false);
    }
  };

    const handleSavePreferences = async () => {
    try {
        setSavingPrefs(true);

        await updateNotificationPreferences({
        emails_pagos: emailsPagos,
        emails_cambios_plan: emailsCambiosPlan,
        emails_novedades: emailsNovedades
        });

        await refreshUser();
        setSavedOk(true);
    } finally {
        setSavingPrefs(false);
    }
    };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8 mt-12 space-y-8">
        <header>
          <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
          <p className="text-sm text-gray-500 mt-1">
            Administra tu cuenta y preferencias
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Cuenta</h3>
              <p className="text-sm text-gray-500 mt-1">
                Información personal y seguridad
              </p>
            </div>

            <div className="p-6 space-y-4 text-sm">
              <div>
                <p className="text-gray-500">Nombre</p>
                <p className="font-medium text-gray-900">{user.name}</p>
              </div>

              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>

              <div className="flex gap-3 pt-2">
                {!sent ? (
                  <button
                    onClick={() => setConfirmOpen(true)}
                    className="px-4 py-2 rounded-lg border text-sm"
                  >
                    Cambiar contraseña
                  </button>
                ) : (
                  <span className="text-sm text-[#3fa10a] font-medium">
                    Se envió un correo para cambiar tu contraseña
                  </span>
                )}
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Suscripción</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Plan y facturación
                </p>
              </div>

              {subscription?.status === "active" && (
                <span className="text-xs px-2 py-1 rounded-full bg-[#72eb15]/20 text-[#3fa10a] font-medium h-fit">
                  Activa
                </span>
              )}
            </div>

            <div className="p-6 space-y-4 text-sm">
              {subscription && plan ? (
                <>
                  <p>
                    <strong>Plan:</strong> {plan.name}
                  </p>

                  <p>
                    <strong>Precio:</strong>{" "}
                    ${Number(plan.price).toLocaleString("es-CO")}
                  </p>

                  {subscription.ends_at && (
                    <p>
                      <strong>Finaliza:</strong>{" "}
                      {new Date(subscription.ends_at).toLocaleDateString()}
                    </p>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setPlanesOpen(true)}
                      className="px-4 py-2 rounded-lg bg-[#3fa10a] text-white text-sm"
                    >
                      Cambiar plan
                    </button>

                    <button
                      onClick={() => router.push("/facturas")}
                      className="px-4 py-2 rounded-lg border text-sm"
                    >
                      Ver facturas
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => setPlanesOpen(true)}
                  className="px-4 py-2 rounded-lg bg-[#3fa10a] text-white text-sm"
                >
                  Ver planes
                </button>
              )}
            </div>
          </section>
        </div>

        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Notificaciones</h3>
            <p className="text-sm text-gray-500 mt-1">
              Decide qué tipo de comunicaciones deseas recibir
            </p>
          </div>

          <div className="p-6 space-y-5 text-sm">
            {[
              {
                label: "Emails de pagos",
                desc: "Confirmaciones y avisos relacionados con pagos",
                value: emailsPagos,
                setter: setEmailsPagos
              },
              {
                label: "Cambios de plan",
                desc: "Avisos cuando tu suscripción cambie o finalice",
                value: emailsCambiosPlan,
                setter: setEmailsCambiosPlan
              },
              {
                label: "Novedades y anuncios",
                desc: "Información sobre nuevas funciones y mejoras",
                value: emailsNovedades,
                setter: setEmailsNovedades
              }
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.value}
                    onChange={(e) => {
                      item.setter(e.target.checked);
                      setSavedOk(false);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-[#72eb15] transition" />
                  <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5" />
                </label>
              </div>
            ))}

            <div className="pt-4">
              {savedOk && !hasChanges ? (
                <p className="text-sm font-medium text-[#3fa10a]">
                  Preferencias guardadas correctamente
                </p>
              ) : (
                hasChanges && (
                  <button
                    onClick={handleSavePreferences}
                    disabled={savingPrefs}
                    className="px-5 py-2.5 rounded-xl bg-[#3fa10a] text-white text-sm font-medium hover:bg-[#368d09] transition disabled:opacity-60"
                  >
                    {savingPrefs ? "Guardando…" : "Guardar preferencias"}
                  </button>
                )
              )}
            </div>
          </div>
        </section>
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white max-w-sm w-full rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              ¿Cambiar contraseña?
            </h3>

            <p className="text-sm text-gray-600">
              Te enviaremos un enlace a tu correo para que puedas cambiar tu
              contraseña de forma segura.
            </p>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 rounded-lg border text-sm"
                disabled={sending}
              >
                Cancelar
              </button>

              <button
                onClick={handleSendReset}
                disabled={sending}
                className="px-4 py-2 rounded-lg bg-[#3fa10a] text-white text-sm"
              >
                {sending ? "Enviando…" : "Enviar correo"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ModalPlanes
        open={planesOpen}
        onClose={() => setPlanesOpen(false)}
        currentSubscription={user.subscription}
      />
    </div>
  );
}
