import React from 'react';
import { leadDoctor } from '../data/catalog';
import { ShieldCheck, FileText, RotateCcw, Stethoscope } from 'lucide-react';

const GUARANTEES = [
  {
    icon: ShieldCheck,
    title: 'Contenido firmado',
    detail: 'Cada clase lleva nombre, especialidad y matrícula del profesional que la dicta.',
  },
  {
    icon: FileText,
    title: 'Bibliografía adjunta',
    detail: 'Las afirmaciones clínicas citan su fuente. La bibliografía se descarga en PDF.',
  },
  {
    icon: RotateCcw,
    title: 'Devolución en 7 días',
    detail: 'Si el módulo no resuelve tu consulta, se reintegra el monto sin pedir explicaciones.',
  },
  {
    icon: Stethoscope,
    title: 'Revisión anual',
    detail: 'Los protocolos se actualizan cuando cambian los criterios diagnósticos vigentes.',
  },
];

const BIBLIOGRAPHY = [
  {
    source: 'American Psychiatric Association',
    detail: 'DSM-5-TR, criterios diagnósticos de TDAH y Trastorno del Espectro Autista',
    year: 2022,
  },
  {
    source: 'Sociedad Argentina de Pediatría',
    detail: 'Consenso sobre abordaje interdisciplinario del neurodesarrollo',
    year: 2024,
  },
  {
    source: 'NICE Guideline NG87',
    detail: 'Attention deficit hyperactivity disorder: diagnosis and management',
    year: 2019,
  },
  {
    source: 'Journal of Clinical Sleep Medicine',
    detail: 'Sleep interventions in children with neurodevelopmental disorders',
    year: 2023,
  },
];

/**
 * Bloque de autoridad médica exigido por Voice.md (marco E-E-A-T):
 * profesional identificable, garantías explícitas y bibliografía consultable.
 */
export const DoctorProfileSection = () => {
  return (
    <section className="py-12 lg:py-16 border-b border-rule bg-card">
      <div className="shell">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Declaración del profesional */}
          <div className="lg:col-span-7">
            <p className="kicker">Quién responde por este contenido</p>

            <blockquote className="mt-5">
              <h2 className="text-3xl sm:text-[2.5rem] leading-[1.1]">
                &ldquo;El turno dura treinta minutos. Las dudas de una familia, no.&rdquo;
              </h2>
            </blockquote>

            <p className="mt-5 max-w-prose text-[15px] leading-relaxed text-ink-secondary">
              En cada consulta repito las mismas explicaciones de base. Las grabé para que puedas
              verlas las veces que hagan falta, con tu pareja, con los abuelos o con la terapeuta.
              El turno presencial queda libre para lo que sí es único de tu hijo.
            </p>

            <div className="mt-7 flex items-center gap-4 border-t border-ink pt-5">
              <img
                src={leadDoctor.avatarUrl}
                alt={`Retrato del ${leadDoctor.name}`}
                className="w-14 h-14 rounded-full object-cover border border-rule"
                loading="lazy"
              />
              <div>
                <p className="font-semibold text-ink">{leadDoctor.name}</p>
                <p className="tabular text-2xs uppercase tracking-wider text-ink-muted mt-0.5">
                  {leadDoctor.specialty} · Matrícula {leadDoctor.licenseNumber} ·{' '}
                  {leadDoctor.experienceYears} años de práctica
                </p>
              </div>
            </div>

            {/* Bibliografía consultable */}
            <div className="mt-10">
              <p className="kicker">Bibliografía de referencia</p>
              <ul className="mt-4 border-t border-rule">
                {BIBLIOGRAPHY.map((ref) => (
                  <li
                    key={ref.source}
                    className="flex items-baseline justify-between gap-4 border-b border-rule py-3"
                  >
                    <span className="text-[13px] leading-relaxed text-ink-secondary">
                      <span className="font-semibold text-ink">{ref.source}.</span> {ref.detail}.
                    </span>
                    <span className="tabular text-2xs text-ink-muted shrink-0">{ref.year}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Garantías clínicas */}
          <div className="lg:col-span-5">
            <p className="kicker">Garantías</p>
            <div className="mt-4 rule-grid grid-cols-1">
              {GUARANTEES.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rule-cell flex gap-4 p-5">
                    <Icon className="w-4 h-4 mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                    <div>
                      <h3 className="text-lg leading-snug text-ink">{item.title}</h3>
                      <p className="mt-1 text-[13px] leading-relaxed text-ink-secondary">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="evidence mt-6">
              Este material es psicoeducativo. No reemplaza la consulta individual, el diagnóstico
              clínico ni la indicación farmacológica del profesional que atiende a tu hijo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
