import React from 'react';
import { leadDoctor } from '../data/catalog';
import { ShieldCheck, Award, Stethoscope, Users, HeartHandshake, BookCheck } from 'lucide-react';

export const DoctorProfileSection: React.FC = () => {
  return (
    <section className="my-16 sm:my-20 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-[#101726] to-slate-900 border border-slate-800 p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl">
        {/* Subtle background glow & attentive consultation photo texture */}
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=1200&auto=format&fit=crop"
            alt="Consulta médica pediátrica"
            className="w-full h-full object-cover filter grayscale contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900" />
        </div>
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          {/* Doctor Avatar & Badges */}
          <div className="lg:col-span-4 flex flex-col items-center text-center">
            <div className="relative">
              <img
                src={leadDoctor.avatarUrl}
                alt={leadDoctor.name}
                className="w-44 h-44 sm:w-52 sm:h-52 rounded-3xl object-cover border-4 border-cyan-500/40 shadow-2xl"
              />
              <div className="absolute -bottom-3 -right-3 p-2.5 rounded-2xl bg-cyan-500 text-slate-950 shadow-lg font-bold flex items-center gap-1">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white mt-5">
              {leadDoctor.name}
            </h3>
            <p className="text-xs font-bold text-cyan-400 mt-1 uppercase tracking-wider">
              {leadDoctor.title}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {leadDoctor.licenseNumber}
            </p>

            {/* Quick stats badges */}
            <div className="grid grid-cols-2 gap-2 mt-4 w-full max-w-xs">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                <div className="text-lg font-black text-white">+3.500</div>
                <div className="text-[10px] text-slate-400">Familias Guiadas</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                <div className="text-lg font-black text-white">{leadDoctor.experienceYears} Años</div>
                <div className="text-[10px] text-slate-400">Práctica Clínica</div>
              </div>
            </div>
          </div>

          {/* Doctor Message & Rationale */}
          <div className="lg:col-span-8 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              <HeartHandshake className="w-4 h-4 text-cyan-400" />
              El Propósito de esta Plataforma
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              "El tiempo físico en el consultorio es limitado, pero las dudas de una familia con un hijo neurodivergente no pueden esperar meses."
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              En cada consulta presencial repito las mismas explicaciones esenciales sobre neurobiología, desregulaciones, escuela y rutinas cotidianas. Con esta plataforma VOD quise volcar todo ese conocimiento en módulos ordenados y prácticos para que las familias tengan respuestas inmediatas a un valor mucho más accesible que una consulta privada.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 shadow-sm">
                <BookCheck className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-black text-white">Pedagogía Médica Clara</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Módulos estructurados con lenguaje empático, directo y sin jerga incomprensible.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 shadow-sm">
                <Users className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-black text-white">A tu Propio Ritmo</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Repasa las clases cuantas veces necesites junto a la pareja, abuelos o terapeutas.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 shadow-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-black text-white">Kits & PDFs Incluidos</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Modelos de informes para docentes, agendas visuales y checklists para el hogar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
