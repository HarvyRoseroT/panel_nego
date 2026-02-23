export default function PoliticaPrivacidadPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-gray-900">
            Política de Privacidad
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

          <section className="space-y-4">
            <p>
              En <span className="font-semibold text-gray-900">Nego</span>,
              respetamos y protegemos la información personal de nuestros usuarios.
              Esta Política describe cómo recopilamos, usamos y protegemos los datos
              cuando utilizas nuestra plataforma.
            </p>
          </section>

          <SectionTitle number="1" title="Información que recopilamos" />

          <ul className="list-disc pl-6 space-y-2">
            <li>Nombre y dirección de correo electrónico</li>
            <li>Información del establecimiento (nombre, dirección, teléfono, ubicación)</li>
            <li>Datos relacionados con suscripciones y facturación</li>
            <li>Preferencias de notificación</li>
            <li>Datos técnicos básicos (IP, navegador, dispositivo)</li>
          </ul>

          <SectionTitle number="2" title="Finalidad del tratamiento" />

          <p>
            Utilizamos la información recopilada para:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Proveer y mantener el servicio</li>
            <li>Procesar pagos y gestionar suscripciones</li>
            <li>Enviar comunicaciones relacionadas con la cuenta</li>
            <li>Mejorar la experiencia del usuario</li>
            <li>Cumplir obligaciones legales</li>
          </ul>

          <SectionTitle number="3" title="Base legal del tratamiento" />

          <p>
            El tratamiento de datos se realiza con base en el consentimiento del
            usuario al registrarse y aceptar los Términos y Condiciones, conforme
            a la normativa vigente en Colombia sobre protección de datos personales.
          </p>

          <SectionTitle number="4" title="Compartición de información" />

          <p>
            Nego no vende información personal. Podremos compartir datos
            únicamente con proveedores tecnológicos necesarios para operar
            el servicio, incluyendo pasarelas de pago y servicios de infraestructura.
          </p>

          <SectionTitle number="5" title="Seguridad de la información" />

          <ul className="list-disc pl-6 space-y-2">
            <li>Conexiones cifradas (HTTPS)</li>
            <li>Contraseñas protegidas mediante hash seguro</li>
            <li>Control de acceso basado en roles</li>
            <li>Monitoreo y protección contra accesos no autorizados</li>
          </ul>

          <SectionTitle number="6" title="Conservación de datos" />

          <p>
            Conservamos la información mientras la cuenta permanezca activa
            o sea necesaria para cumplir obligaciones legales.
          </p>

          <SectionTitle number="7" title="Derechos del usuario" />

          <p>
            El usuario puede solicitar en cualquier momento el acceso,
            corrección o eliminación de sus datos personales escribiendo
            a nuestro canal de soporte.
          </p>

          <SectionTitle number="8" title="Modificaciones" />

          <p>
            Nego podrá actualizar esta Política en cualquier momento.
            Las modificaciones serán publicadas en esta página.
          </p>

          {/* Footer visual */}
          <div className="pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Si tienes preguntas sobre esta Política, puedes contactarnos
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