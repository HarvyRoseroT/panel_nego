"use client";

import { useState } from "react";

export default function SoportePage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "No me llegan los pedidos a WhatsApp",
      answer:
        "Verifica que el número registrado tenga el código de país correcto y que el servicio de domicilio esté activo. También asegúrate de que el número tenga WhatsApp activo.",
    },
    {
      question: "¿Cómo funciona el radio de 5 km?",
      answer:
        "La visibilidad de tu establecimiento depende de la ubicación configurada en el mapa. Los usuarios dentro de un radio aproximado de 5 km podrán ver tu negocio en la app.",
    },
    {
      question: "¿Puedo cambiar mi plan?",
      answer:
        "Sí. Puedes actualizar o modificar tu plan despues de que tu plan expire, esto lo puede hacer desde configuracion",
    },
    {
      question: "¿Cómo desactivo el servicio a domicilio?",
      answer:
        "En la configuración del establecimiento, desactiva la opción 'Domicilio disponible'. Esto deshabilitará el envío de pedidos por WhatsApp.",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="max-w-4xl mx-auto space-y-16">

        {/* HERO */}
        <section className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Centro de Soporte
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Estamos aquí para ayudarte. Encuentra respuestas rápidas o
            contáctanos si necesitas asistencia personalizada.
          </p>
        </section>

        {/* CONTACTO */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Contacto directo
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-gray-50 p-6 rounded-xl border">
              <h3 className="font-medium text-gray-900 mb-2">
                📧 Soporte por correo
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Respuesta en menos de 24 horas.
              </p>
              <a
                href="mailto:soporte@nego.ink"
                className="text-green-600 font-medium hover:underline"
              >
                soporte@nego.ink
              </a>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border">
              <h3 className="font-medium text-gray-900 mb-2">
                💬 WhatsApp Soporte
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Atención directa para casos urgentes.
              </p>
              <a
                href="https://wa.me/573245038961"
                target="_blank"
                className="text-green-600 font-medium hover:underline"
              >
                Contactar por WhatsApp
              </a>
            </div>

          </div>
        </section>

        {/* FAQ */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Preguntas frecuentes
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white border rounded-xl p-5 cursor-pointer transition hover:shadow-sm"
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-900">
                    {faq.question}
                  </h3>
                  <span className="text-gray-400">
                    {openIndex === index ? "−" : "+"}
                  </span>
                </div>

                {openIndex === index && (
                  <p className="mt-3 text-sm text-gray-600">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* STATUS */}
        <section className="bg-green-50 border border-green-200 p-6 rounded-xl text-sm text-green-800">
          ✅ Todos los sistemas operando con normalidad.
        </section>

        {/* CTA FINAL */}
        <section className="text-center space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            ¿No encontraste lo que buscabas?
          </h2>
          <p className="text-gray-600">
            Escríbenos y nuestro equipo te ayudará lo antes posible.
          </p>
        </section>

      </div>
    </main>
  );
}