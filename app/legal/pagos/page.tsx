export default function PoliticaPagosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-gray-900">
            Política de Pagos y Suscripciones
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            Última actualización: {new Date().getFullYear()}
          </p>
          <div className="mt-4 h-1 w-20 bg-[#3fa10a] rounded-full" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8 text-sm leading-relaxed text-gray-700">

          <section>
            <p>
              Esta Política regula las condiciones relacionadas con los pagos y el acceso
              a los planes ofrecidos por{" "}
              <span className="font-semibold text-gray-900">Nego</span>.
            </p>
          </section>

          <SectionTitle number="1" title="Modelo de suscripción" />

          <p>
            Nego ofrece planes de acceso mediante pago periódico.
          </p>

          <p className="font-medium text-gray-900">
            Actualmente, los planes no se renuevan automáticamente.
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>El usuario debe realizar el pago manualmente en cada período.</li>
            <li>No se realizan cobros automáticos sin acción expresa del usuario.</li>
            <li>El acceso se habilita una vez confirmado el pago.</li>
          </ul>

          <SectionTitle number="2" title="Duración del acceso" />

          <p>
            Cada pago otorga acceso por el período especificado en el plan seleccionado.
          </p>

          <p>
            Una vez finalizado el período activo, el acceso podrá suspenderse
            hasta que se realice un nuevo pago.
          </p>

          <SectionTitle number="3" title="Estados de suscripción" />

          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Activo:</strong> El plan se encuentra vigente.</li>
            <li><strong>Prueba:</strong> Período promocional temporal.</li>
            <li><strong>Expirado:</strong> El período finalizó sin renovación.</li>
            <li><strong>Pago fallido:</strong> El intento de pago no fue aprobado.</li>
          </ul>

          <SectionTitle number="4" title="Procesamiento de pagos" />

          <p>
            Los pagos son procesados a través de un proveedor externo autorizado
            de servicios de pago.
          </p>

          <p>
            Actualmente, Nego utiliza la pasarela de pagos{" "}
            <span className="font-semibold text-gray-900">Wompi</span>{" "}
            para la gestión de transacciones electrónicas.
          </p>

          <p>
            La información financiera ingresada por el usuario es procesada
            directamente por dicho proveedor bajo sus propios términos,
            condiciones y políticas de seguridad.
          </p>

          <p>
            Nego no almacena números completos de tarjetas ni datos financieros
            sensibles en sus servidores.
          </p>

          <p>
            Al realizar un pago, el usuario acepta también los términos
            y condiciones aplicables del proveedor de pago correspondiente.
          </p>

          <SectionTitle number="5" title="Reembolsos" />

          <p>
            Los pagos realizados no son reembolsables una vez activado el período
            correspondiente, salvo disposición legal obligatoria.
          </p>

          <SectionTitle number="6" title="Cambios de precio" />

          <p>
            Nego podrá modificar los precios de los planes en cualquier momento.
            Los cambios no afectarán períodos ya pagados.
          </p>

          <SectionTitle number="7" title="Suspensión del servicio" />

          <p>
            En caso de incumplimiento de pago o uso indebido de la plataforma,
            Nego podrá suspender el acceso al servicio.
          </p>

          <div className="pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Para consultas relacionadas con facturación, puedes comunicarte
              a través de los canales oficiales de soporte.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

function SectionTitle({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#3fa10a]/10 text-[#3fa10a] text-xs font-bold">
        {number}
      </span>
      {title}
    </h2>
  );
}