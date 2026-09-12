import React, { useState } from 'react';
import { usePlatform } from '../context/PlatformContext';
import {
  X, CheckCircle, ShieldCheck, CreditCard, QrCode, Building2,
  Lock, Sparkles, ArrowRight, Loader2, BadgeCheck, Copy, Check,
  Tag, Download, HelpCircle, FileText, CheckCircle2, ChevronRight
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const { activeCheckoutModule, setActiveCheckoutModule, purchaseModule, setActiveVideoEpisode } = usePlatform();
  const [paymentMethod, setPaymentMethod] = useState<'mercadopago' | 'card' | 'transfer'>('mercadopago');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('carolina.gomez@gmail.com');
  const [cardNumber, setCardNumber] = useState('4509 2381 9920 4812');
  const [cardHolder, setCardHolder] = useState('CAROLINA GOMEZ');
  const [expiry, setExpiry] = useState('08/29');
  const [cvv, setCvv] = useState('834');
  const [installments, setInstallments] = useState('3');
  const [invoiceType, setInvoiceType] = useState<'B' | 'A'>('B');
  const [cuit, setCuit] = useState('27-34891023-4');

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponFeedback, setCouponFeedback] = useState<string | null>(null);

  // Copy CBU feedback
  const [copiedAlias, setCopiedAlias] = useState(false);

  if (!activeCheckoutModule) return null;

  const originalPrice = activeCheckoutModule.priceArs;
  const finalPrice = Math.max(0, originalPrice - appliedDiscount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'DOCTOR2026' || code === 'LANZAMIENTO' || code === 'DEMO') {
      const discount = Math.round(originalPrice * 0.15); // 15% discount
      setAppliedDiscount(discount);
      setCouponFeedback('¡Cupón aplicado con éxito! -15% de descuento especial.');
    } else {
      setCouponFeedback('Cupón inválido. Prueba con "DOCTOR2026" o "LANZAMIENTO".');
    }
  };

  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      purchaseModule(activeCheckoutModule.id);
    }, 1200);
  };

  const handleCopyAlias = () => {
    navigator.clipboard?.writeText('NEURO.DESARROLLO.MP');
    setCopiedAlias(true);
    setTimeout(() => setCopiedAlias(false), 2000);
  };

  const handleStartWatching = () => {
    const mod = activeCheckoutModule;
    setActiveCheckoutModule(null);
    setIsSuccess(false);
    if (mod && mod.episodes.length > 0) {
      setActiveVideoEpisode({ module: mod, episode: mod.episodes[0] });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-gradient-to-b from-[#0F172A] to-[#0B0F17] rounded-3xl overflow-hidden border border-cyan-500/40 shadow-2xl shadow-cyan-950/50 my-6 animate-scale-in flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-400 flex items-center justify-center text-slate-950 shadow-md">
              <Lock className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white">
                  Pasarela de Cobro Médica Segura
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Mercado Pago Argentina
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Transacción oficial cifrada con protocolo TLS 1.3 de 256 bits
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveCheckoutModule(null);
              setIsSuccess(false);
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Cerrar ventana de pago"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View 1: Success Confirmation & Downloadable Receipt */}
        {isSuccess ? (
          <div className="p-6 sm:p-10 text-center space-y-6 animate-scale-in">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center shadow-xl shadow-emerald-500/30">
                <BadgeCheck className="w-12 h-12 stroke-[2.2]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
                Acceso Clínico Habilitado de por Vida
              </span>
              <h4 className="text-2xl sm:text-3xl font-black text-white pt-1">
                ¡Pago Confirmado con Éxito!
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                Tu acceso a los <strong>{activeCheckoutModule.episodesCount} episodios</strong> y materiales de{' '}
                <span className="text-cyan-300 font-bold">{activeCheckoutModule.title}</span> ya se encuentra activo.
              </p>
            </div>

            {/* Official Medical Receipt Box */}
            <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 text-left text-xs space-y-2.5 max-w-md mx-auto shadow-inner">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800 text-slate-400">
                <span className="font-semibold text-slate-200">Comprobante Oficial de Pago</span>
                <span className="font-mono text-cyan-400 font-bold">#MP-984210-AR</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Especialista a Cargo:</span>
                <span className="font-bold text-white">{activeCheckoutModule.doctor.name} (MN 142.890)</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Monto Final Facturado:</span>
                <span className="font-black text-emerald-400 text-sm">
                  ${finalPrice.toLocaleString('es-AR')} ARS
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Titular Registrado:</span>
                <span className="text-cyan-300">{email}</span>
              </div>
              <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800/60 text-[11px]">
                <span>Tipo de Factura:</span>
                <span className="font-semibold text-slate-300">Factura {invoiceType} {invoiceType === 'A' ? `(CUIT: ${cuit})` : '(Consumidor Final)'}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
              <button
                onClick={handleStartWatching}
                className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                Comenzar a Ver el Módulo
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => alert(`Descargando Comprobante Fiscal #MP-984210-AR para reintegro médico...`)}
                className="py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-slate-700"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                Descargar Recibo
              </button>
            </div>
          </div>
        ) : (
          /* View 2: Interactive Checkout Form */
          <form onSubmit={handleSimulatePayment} className="p-5 sm:p-6 space-y-5">
            {/* Top Selected Module Summary */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={activeCheckoutModule.thumbnailUrl}
                  alt={activeCheckoutModule.title}
                  className="w-16 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase text-cyan-400 px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-800">
                      {activeCheckoutModule.condition}
                    </span>
                    <span className="text-xs text-slate-400">
                      {activeCheckoutModule.episodesCount} episodios • Edición {activeCheckoutModule.year}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white line-clamp-1 mt-0.5">
                    {activeCheckoutModule.title}
                  </h4>
                </div>
              </div>

              {/* Price Tag with Savings Highlight */}
              <div className="text-right shrink-0">
                <div className="text-xs text-slate-400 line-through">
                  ${activeCheckoutModule.doctor.inPersonConsultFeeArs.toLocaleString('es-AR')} ARS
                </div>
                <div className="text-xl sm:text-2xl font-black text-emerald-400">
                  ${finalPrice.toLocaleString('es-AR')}
                  <span className="text-xs font-semibold text-slate-300 ml-1">ARS</span>
                </div>
              </div>
            </div>

            {/* Savings Badge */}
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-950/60 to-cyan-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <strong>Ahorro frente a consulta presencial:</strong> Te ahorras ${(activeCheckoutModule.doctor.inPersonConsultFeeArs - finalPrice).toLocaleString('es-AR')} ARS.
              </span>
              <span className="hidden sm:inline font-mono font-bold text-white bg-emerald-900/60 px-2 py-0.5 rounded">
                -17% OFF
              </span>
            </div>

            {/* Payment Method Tabs */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                <span>1. Elige tu medio de pago (Argentina):</span>
                <span className="text-[11px] text-cyan-400 font-normal">Habilitación automática</span>
              </label>

              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mercadopago')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'mercadopago'
                      ? 'bg-cyan-500/20 border-cyan-400 text-white font-bold shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  <QrCode className="w-6 h-6 text-cyan-400" />
                  <span className="text-xs font-bold">Mercado Pago</span>
                  <span className="text-[10px] text-cyan-300 font-medium">QR / Dinero en cuenta</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'card'
                      ? 'bg-cyan-500/20 border-cyan-400 text-white font-bold shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  <CreditCard className="w-6 h-6 text-teal-400" />
                  <span className="text-xs font-bold">Tarjeta C/D</span>
                  <span className="text-[10px] text-teal-300 font-medium">Hasta 3 cuotas fijas</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('transfer')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'transfer'
                      ? 'bg-cyan-500/20 border-cyan-400 text-white font-bold shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  <Building2 className="w-6 h-6 text-indigo-400" />
                  <span className="text-xs font-bold">Transferencia</span>
                  <span className="text-[10px] text-indigo-300 font-medium">CBU / Alias 3.0</span>
                </button>
              </div>
            </div>

            {/* TAB CONTENT: Mercado Pago QR */}
            {paymentMethod === 'mercadopago' && (
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-900/60 flex flex-col sm:flex-row items-center gap-5">
                {/* Animated QR Mock */}
                <div className="relative w-36 h-36 bg-white p-2.5 rounded-2xl shrink-0 shadow-lg shadow-cyan-500/10 flex items-center justify-center overflow-hidden">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=https://mercadopago.com.ar/neurovod-pago-demo"
                    alt="Código QR Mercado Pago"
                    className="w-full h-full object-contain"
                  />
                  {/* Subtle scan beam */}
                  <div className="absolute inset-x-0 h-1 bg-cyan-500/80 shadow-md shadow-cyan-400 animate-pulse" />
                </div>

                <div className="space-y-2 text-xs text-left">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 font-mono font-bold text-[11px] border border-cyan-800">
                    <QrCode className="w-3.5 h-3.5" />
                    QR DINÁMICO DE PAGO
                  </div>
                  <h5 className="font-bold text-white text-sm">
                    Escanea desde la App de Mercado Pago
                  </h5>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Abre la aplicación de Mercado Pago en tu celular, apunta con la cámara al código y confirma el monto de <strong>${finalPrice.toLocaleString('es-AR')} ARS</strong>. El acceso se activará en tu pantalla en segundos.
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-semibold pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    También puedes pagar con dinero disponible en tu cuenta.
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Credit Card Interactive Preview & Inputs */}
            {paymentMethod === 'card' && (
              <div className="space-y-4">
                {/* 3D Glassmorphism Virtual Card Preview */}
                <div className="relative h-44 rounded-2xl bg-gradient-to-tr from-cyan-950 via-slate-900 to-teal-950 p-5 border border-cyan-500/40 shadow-xl overflow-hidden text-white flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black tracking-widest text-cyan-300">
                      NEUROVOD CARD PASS
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-white/10 text-white font-mono">
                      VISA / DEBIT
                    </span>
                  </div>

                  <div className="font-mono text-base sm:text-lg tracking-widest text-cyan-100 font-bold drop-shadow">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </div>

                  <div className="flex justify-between items-end text-xs">
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-slate-400">Titular</div>
                      <div className="font-bold uppercase text-white truncate max-w-[180px]">
                        {cardHolder || 'NOMBRE TITULAR'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-slate-400">Vence</div>
                      <div className="font-mono font-bold text-white">{expiry || 'MM/AA'}</div>
                    </div>
                  </div>
                </div>

                {/* Card Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-300 font-semibold mb-1">Número de Tarjeta:</label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Nombre Impreso en Tarjeta:</label>
                    <input
                      type="text"
                      required
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white uppercase focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Vto (MM/AA):</label>
                      <input
                        type="text"
                        required
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">CVV:</label>
                      <input
                        type="text"
                        required
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  {/* Cuotas Selector */}
                  <div className="sm:col-span-2">
                    <label className="block text-slate-300 font-semibold mb-1">Plan de Cuotas (Argentina):</label>
                    <select
                      value={installments}
                      onChange={(e) => setInstallments(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="1">1 cuota de ${finalPrice.toLocaleString('es-AR')} ARS (Sin interés)</option>
                      <option value="3">3 cuotas fijas de ${Math.round(finalPrice / 3).toLocaleString('es-AR')} ARS (Sin interés)</option>
                      <option value="6">6 cuotas de ${Math.round((finalPrice * 1.15) / 6).toLocaleString('es-AR')} ARS</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Bank Transfer with Copy Alias */}
            {paymentMethod === 'transfer' && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-cyan-400" />
                    Datos Oficiales para Transferencia Inmediata
                  </span>
                  <span className="text-[10px] text-slate-400">Banco Santander Argentina</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block">Alias de Transferencia:</span>
                    <span className="font-mono text-sm font-bold text-white">NEURO.DESARROLLO.MP</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyAlias}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold transition-colors"
                  >
                    {copiedAlias ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedAlias ? '¡Copiado!' : 'Copiar Alias'}
                  </button>
                </div>

                <div className="space-y-1 text-slate-400 text-[11px]">
                  <div>CBU: <span className="font-mono text-slate-200">0000003100098421000123</span></div>
                  <div>Titular: <span className="text-slate-200 font-semibold">Dr. Julián Rossi (Neurodesarrollo)</span></div>
                  <div>CUIT: <span className="font-mono text-slate-200">20-28941029-4</span></div>
                </div>
              </div>
            )}

            {/* Coupon Code Section */}
            <div className="pt-1">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="¿Tienes cupón? Prueba: DOCTOR2026"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-2 text-xs text-white uppercase focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold transition-colors"
                >
                  Aplicar
                </button>
              </div>
              {couponFeedback && (
                <div className={`text-[11px] mt-1.5 font-medium ${appliedDiscount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {couponFeedback}
                </div>
              )}
            </div>

            {/* Invoicing Selector */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300">Tipo de Factura Médica:</span>
              </div>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setInvoiceType('B')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-xs ${
                    invoiceType === 'B' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Factura B
                </button>
                <button
                  type="button"
                  onClick={() => setInvoiceType('A')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-xs ${
                    invoiceType === 'A' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Factura A (Reintegro)
                </button>
              </div>
            </div>

            {/* Primary CTA Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-cyan-500/30 hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                  Confirmando Operación en Mercado Pago...
                </>
              ) : (
                <>
                  <span>Pagar ${finalPrice.toLocaleString('es-AR')} ARS y Desbloquear Acceso</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 text-center">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Garantía Médica de Devolución (7 días)
              </span>
              <span>•</span>
              <span>Disponibilidad 24/7 en Todos tus Dispositivos</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
