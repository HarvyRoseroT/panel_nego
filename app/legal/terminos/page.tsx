export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-gray-900">
            Términos y Condiciones
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            Última actualización: {new Date().getFullYear()}
          </p>
          <div className="mt-4 h-1 w-20 bg-[#3fa10a] rounded-full" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8 text-sm leading-relaxed text-gray-700">

          <section>
            <p>
              Estos Términos y Condiciones regulan el acceso y uso de la
              plataforma <span className="font-semibold text-gray-900">Nego</span>.
              Al registrarte y utilizar el servicio, aceptas cumplir con las
              disposiciones aquí establecidas.
            </p>
          </section>

          <SectionTitle number="1" title="Objeto del servicio" />

          <p>
            Nego es una plataforma tecnológica que permite a establecimientos
            gestionar cartas digitales, pedidos y herramientas relacionadas
            con su operación.
          </p>

          <SectionTitle number="2" title="Registro y cuenta" />

          <ul className="list-disc pl-6 space-y-2">
            <li>El usuario debe proporcionar información veraz y actualizada.</li>
            <li>Es responsable de la confidencialidad de sus credenciales.</li>
            <li>No debe compartir el acceso con terceros no autorizados.</li>
          </ul>

          <SectionTitle number="3" title="Uso adecuado de la plataforma" />

          <p>
            El usuario es responsable del contenido publicado en su establecimiento,
            incluyendo precios, descripciones, imágenes y datos de contacto.
          </p>

          <p>
            Queda prohibido utilizar la plataforma para actividades ilegales,
            fraudulentas o que vulneren derechos de terceros.
          </p>

          <SectionTitle number="4" title="Planes y pagos" />

          <p>
            Nego ofrece planes de acceso mediante pagos periódicos.
          </p>

          <p className="font-medium text-gray-900">
            Importante: Los planes actualmente no se renuevan automáticamente.
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>El usuario debe realizar el pago manualmente cada período.</li>
            <li>Si no se realiza el pago, el acceso podrá suspenderse al finalizar el período activo.</li>
            <li>No existe obligación de renovación automática.</li>
          </ul>

          <SectionTitle number="5" title="Suspensión o cancelación" />

          <p>
            Nego podrá suspender o cancelar cuentas que incumplan estos términos
            o que utilicen el servicio de forma indebida.
          </p>

          <SectionTitle number="6" title="Limitación de responsabilidad" />

          <p>
            Nego proporciona una herramienta tecnológica. No garantiza resultados
            comerciales específicos ni se responsabiliza por pérdidas indirectas,
            lucro cesante o interrupciones derivadas del uso del servicio.
          </p>

          <SectionTitle number="7" title="Propiedad intelectual" />

          <p>
            La plataforma, su diseño y código son propiedad de Nego. El usuario
            conserva los derechos sobre el contenido que publique.
          </p>

          <SectionTitle number="8" title="Modificaciones" />

          <p>
            Nego podrá actualizar estos Términos en cualquier momento.
            Las modificaciones serán publicadas en esta página.
          </p>

          <SectionTitle number="9" title="Jurisdicción" />

          <p>
            Estos términos se rigen por la legislación aplicable en la
            República de Colombia.
          </p>

          <div className="pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Para consultas legales o soporte, puedes contactarnos
              a través de los canales oficiales.
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