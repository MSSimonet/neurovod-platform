import React from 'react';
import { leadDoctor } from '../data/catalog';
import { MessageCircle, Phone, AtSign } from 'lucide-react';

/**
 * DÓNDE SE ATIENDE EN PERSONA
 *
 * El compendio explica; no diagnostica. Esta sección cierra el recorrido
 * diciendo dónde sigue la consulta de verdad, con las direcciones y los
 * canales por los que se pide turno.
 *
 * Los teléfonos se muestran tal como los dicta el consultorio, sin armar
 * enlaces: inventar un prefijo para que `tel:` funcione sería adivinar. El
 * WhatsApp sí es enlace porque el número está en formato internacional.
 */
export const ConsultingRooms = () => {
  const { consultingRooms, contact } = leadDoctor;

  return (
    <section
      className="py-12 lg:py-16 border-b border-rule bg-app"
      aria-labelledby="consulta-presencial"
    >
      <div className="shell">
        <header className="mb-7 max-w-prose">
          <p className="kicker">Consulta presencial</p>
          <h2 id="consulta-presencial" className="mt-3 text-3xl sm:text-[2.5rem] leading-[1.1]">
            El video no reemplaza el turno. Estos son los consultorios.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-secondary">
            {leadDoctor.name} atiende en Entre Ríos y Corrientes. Para evaluación, diagnóstico,
            orientación y seguimiento, el turno se pide por estos canales.
          </p>
        </header>

        <div className="rule-grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          {consultingRooms.map((room) => (
            <article key={`${room.city}-${room.place}`} className="rule-cell p-5">
              <p className="tabular text-2xs uppercase tracking-wider text-ink-muted">
                {room.city} · {room.province}
              </p>
              <h3 className="mt-3 text-xl leading-snug text-ink">{room.place}</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-ink-secondary">{room.address}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 rule-grid grid-cols-1 sm:grid-cols-3">
          <div className="rule-cell p-5">
            <p className="label">Turnos por WhatsApp</p>
            <a
              href={contact.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="tabular inline-flex items-center gap-2 text-[15px] font-semibold text-accent hover:text-accent-hover"
            >
              <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              {contact.whatsapp}
            </a>
          </div>

          <div className="rule-cell p-5">
            <p className="label">Teléfonos</p>
            <ul className="space-y-1">
              {contact.phones.map((phone) => (
                <li key={phone} className="tabular flex items-center gap-2 text-[15px] text-ink">
                  <Phone className="w-4 h-4 shrink-0 text-ink-muted" aria-hidden="true" />
                  {phone}
                </li>
              ))}
            </ul>
          </div>

          <div className="rule-cell p-5">
            <p className="label">Instagram</p>
            <a
              href={contact.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-[15px] font-semibold text-accent hover:text-accent-hover"
            >
              <AtSign className="w-4 h-4 shrink-0" aria-hidden="true" />
              @{contact.instagramUser}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
