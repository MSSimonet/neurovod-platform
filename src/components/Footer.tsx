import React from 'react';
import { leadDoctor } from '../data/catalog';

const CATEGORIES = [
  'Trastorno por Déficit de Atención (TDAH)',
  'Condición del Espectro Autista (TEA)',
  'Regulación sensorial y alimentación',
  'Congresos y actualización médica',
];

const LEGAL = ['Términos del servicio', 'Privacidad del paciente', 'Política de reintegros'];

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-rule">
      <div className="shell py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Identidad */}
          <div className="md:col-span-5">
            <p className="font-serif text-2xl leading-none text-ink">
              NeuroVOD <span className="kicker align-middle">Médica</span>
            </p>
            <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-ink-secondary">
              Programas clínicos en video sobre TDAH, Autismo y neurodesarrollo. Dirigidos a
              familias, docentes y equipos terapéuticos de Argentina y Latinoamérica.
            </p>
            <p className="tabular mt-5 text-2xs uppercase tracking-wider text-ink-muted">
              {leadDoctor.name} · {leadDoctor.licenses.join(' · ')}
            </p>
          </div>

          {/* Categorías */}
          <nav className="md:col-span-4" aria-label="Categorías clínicas">
            <p className="label">Categorías</p>
            <ul className="space-y-2">
              {CATEGORIES.map((item) => (
                <li key={item}>
                  <span className="text-[13px] text-ink-secondary">{item}</span>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contacto */}
          <div className="md:col-span-3">
            <p className="label">Turnos y consultas</p>
            <ul className="space-y-2 text-[13px] text-ink-secondary">
              <li>
                <a
                  href={leadDoctor.contact.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="tabular text-accent hover:text-accent-hover"
                >
                  WhatsApp {leadDoctor.contact.whatsapp}
                </a>
              </li>
              {leadDoctor.contact.phones.map((phone) => (
                <li key={phone} className="tabular">
                  {phone}
                </li>
              ))}
              <li>
                <a
                  href={leadDoctor.contact.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent hover:text-accent-hover"
                >
                  @{leadDoctor.contact.instagramUser}
                </a>
              </li>
              <li className="text-ink-muted">
                Consultorios en Entre Ríos y Corrientes, con agenda sujeta a disponibilidad.
              </li>
            </ul>
          </div>
        </div>

        {/* Aviso legal */}
        <div className="evidence mt-12">
          <strong className="text-ink">Aviso médico.</strong> El contenido de esta plataforma tiene
          fines psicoeducativos y de orientación familiar. Ningún video ni guía descargable
          sustituye la consulta médica individual, el diagnóstico clínico ni la prescripción
          farmacológica del profesional tratante.
        </div>

        <div className="mt-8 pt-6 border-t border-rule flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="tabular text-2xs text-ink-muted">
            © 2026 NEUROVOD MÉDICA · ENTRE RÍOS Y CORRIENTES, ARGENTINA
          </p>
          <ul className="flex flex-wrap items-center gap-4 text-2xs text-ink-muted">
            {LEGAL.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};
