"use client";

import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import {
  requestPasswordReset,
  updateNotificationPreferences,
} from "@/services/authService";
import ModalPlanes from "../components/ModalPlanesWompi";
import CancelSubscriptionModal from "./components/CancelSubscriptionModal";
import { useRouter } from "next/navigation";

export default function ConfiguracionPage() {
  const { user, refreshUser, token } = useUser();
  const router = useRouter();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [planesOpen, setPlanesOpen] = useState(false);


  const prefs = user?.notification_preferences ?? {};

  const [emailsPagos, setEmailsPagos] = useState(
    prefs.emails_pagos ?? true
  );
  const [emailsCambiosPlan, setEmailsCambiosPlan] = useState(
    prefs.emails_cambios_plan ?? true
  );
  const [emailsNovedades, setEmailsNovedades] = useState(
    prefs.emails_novedades ?? false
  );

  const [savingPrefs, setSavingPrefs] = useState(false);
  const [savedOk, setSavedOk] = useState(false);

  const originalPrefs = {
    emails_pagos: prefs.emails_pagos ?? true,
    emails_cambios_plan: prefs.emails_cambios_plan ?? true,
    emails_novedades: prefs.emails_novedades ?? false,
  };

  const hasChanges =
    emailsPagos !== originalPrefs.emails_pagos ||
    emailsCambiosPlan !== originalPrefs.emails_cambios_plan ||
    emailsNovedades !== originalPrefs.emails_novedades;

  const subscription = user?.subscription ?? null;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-500">Cargando configuración…</p>
      </div>
    );
  }


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
        emails_novedades: emailsNovedades,
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
          <h1 className="text-2xl font-bold text-gray-900">
            Configuración
          </h1>
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
                <p className="font-medium text-gray-900">
                  {user.name}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-medium text-gray-900">
                  {user.email}
                </p>
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
                <h3 className="font-semibold text-gray-900">
                  Suscripción
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Plan y facturación
                </p>
              </div>

              {subscription?.status === "ACTIVE" && (
                <span className="text-xs px-2 py-1 rounded-full bg-[#72eb15]/20 text-[#3fa10a] font-medium h-fit">
                  Activa
                </span>
              )}

              {subscription?.status === "TRIAL" && (
                <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 font-medium h-fit">
                  Prueba
                </span>
              )}

              {subscription?.status === "PAST_DUE" && (
                <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 font-medium h-fit">
                  Pago pendiente
                </span>
              )}

              {subscription?.status === "FAILED" && (
                <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 font-medium h-fit">
                  Pago fallido
                </span>
              )}

              {subscription?.status === "EXPIRED" && (
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 font-medium h-fit">
                  Expirada
                </span>
              )}

              {subscription?.status === "CANCELED" && (
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 font-medium h-fit">
                  Cancelada
                </span>
              )}
            </div>

            <div className="p-6 space-y-4 text-sm">
              {subscription ? (
                <>
                  <p>
                    <strong>Estado:</strong>{" "}
                    {subscription.status}
                  </p>

                  <p>
                    <strong>Precio actual:</strong>{" "}
                    {(subscription.plan_price / 100).toLocaleString(
                      "es-CO",
                      {
                        style: "currency",
                        currency: subscription.currency,
                        minimumFractionDigits: 0,
                      }
                    )}
                  </p>

                  <p>
                    <strong>Periodo actual:</strong>{" "}
                    {new Date(
                      subscription.current_period_start
                    ).toLocaleDateString()}{" "}
                    -{" "}
                    {new Date(
                      subscription.current_period_end
                    ).toLocaleDateString()}
                  </p>

                  <p>
                    <strong>Próximo cobro:</strong>{" "}
                    {new Date(
                      subscription.next_billing_date
                    ).toLocaleDateString()}
                  </p>

                  {subscription.retry_count > 0 && (
                    <p className="text-yellow-700">
                      Reintentos de cobro:{" "}
                      {subscription.retry_count}
                    </p>
                  )}

                  {subscription.cancel_at_period_end &&
                    subscription.current_period_end && (
                      <p className="text-yellow-700">
                        Tu suscripción se cancelará el{" "}
                        {new Date(
                          subscription.current_period_end
                        ).toLocaleDateString()}
                      </p>
                    )}

                  <div className="flex gap-3 pt-2 flex-wrap">
                    <button
                      onClick={() => setPlanesOpen(true)}
                      className="px-4 py-2 rounded-lg bg-[#3fa10a] text-white text-sm"
                    >
                      Cambiar plan
                    </button>

                    <button
                      onClick={() =>
                        router.push("/facturas")
                      }
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
              <div key={item.label} className="flex items-center justify-between">
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

        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Legal</h3>
            <p className="text-sm text-gray-500 mt-1">
              Documentos legales y políticas del servicio
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              <button
                onClick={() => router.push("/legal/privacidad")}
                className="group rounded-xl border border-gray-200 p-4 text-left transition hover:border-[#3fa10a] hover:shadow-md"
              >
                <p className="font-medium text-gray-900 group-hover:text-[#3fa10a] transition">
                  Política de Privacidad
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Cómo protegemos y tratamos tus datos.
                </p>
              </button>

              <button
                onClick={() => router.push("/legal/terminos")}
                className="group rounded-xl border border-gray-200 p-4 text-left transition hover:border-[#3fa10a] hover:shadow-md"
              >
                <p className="font-medium text-gray-900 group-hover:text-[#3fa10a] transition">
                  Términos y Condiciones
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Reglas y condiciones de uso de la plataforma.
                </p>
              </button>

              <button
                onClick={() => router.push("/legal/pagos")}
                className="group rounded-xl border border-gray-200 p-4 text-left transition hover:border-[#3fa10a] hover:shadow-md"
              >
                <p className="font-medium text-gray-900 group-hover:text-[#3fa10a] transition">
                  Política de Pagos
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Información sobre planes y facturación.
                </p>
              </button>

            </div>
          </div>
        </section>
      </div>

      <ModalPlanes
        open={planesOpen}
        onClose={() => setPlanesOpen(false)}
      />

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Cambiar contraseña
            </h3>

            <p className="text-sm text-gray-500 mb-6">
              Te enviaremos un correo con instrucciones para cambiar tu contraseña.
            </p>

            <div className="flex justify-end gap-3">
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
                {sending ? "Enviando..." : "Enviar correo"}
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}

