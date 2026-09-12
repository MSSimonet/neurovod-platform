import React from 'react';
import { Activity, ShieldAlert, Heart, Mail, Phone, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-12 pb-8 px-4 sm:px-8 lg:px-12 text-slate-400">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-slate-950 font-black">
                <Activity className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              </div>
              <span className="text-lg font-black text-white tracking-wider">
                NEURO<span className="text-cyan-400">VOD</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                Médica
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Plataforma de Video On Demand creada por especialistas en neurodesarrollo. Democratizando el acceso a psicoeducación médica de excelencia para familias con hijos con TDAH, Autismo (TEA) y desafíos sensoriales.
            </p>
          </div>

          {/* Col 2: Condiciones y Módulos */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Categorías Principales
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Trastorno por Déficit de Atención (TDAH)</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Condición del Espectro Autista (TEA)</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Desafíos Sensoriales y Selectividad</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Clases Magistrales y Congresos</a></li>
            </ul>
          </div>

          {/* Col 3: Contacto & Consultas */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Atención y Soporte
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>contacto@neurovod.med.ar</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Consultorio CABA: +54 (11) 4821-XXXX</span>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                Consultas presenciales sujetas a disponibilidad de agenda en consultorio.
              </p>
            </div>
          </div>
        </div>

        {/* Medical Disclaimer Box */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-slate-200">Aviso Médico Legal Importante:</strong> El contenido de esta plataforma de streaming tiene fines estrictamente psicoeducativos, formativos y de orientación familiar. Ningún video, guía descargable o material aquí presentado sustituye la consulta médica individualizada, el diagnóstico clínico personalizado ni la prescripción farmacológica directa por parte del profesional tratante de su hijo.
          </p>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            © 2026 NeuroVOD Médica. Desarrollado para orientación clínica especializada en Argentina y Latinoamérica.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="#" className="hover:text-slate-300">Términos de Servicio</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-300">Privacidad del Paciente</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-300">Seguridad de Pagos</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
