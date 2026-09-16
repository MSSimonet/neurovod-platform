import React, { useState } from 'react';
import { usePlatform } from '../context/PlatformContext';
import { Modal } from './ui/Modal';
import { formatArs, formatArsLong, formatDate } from '../lib/format';
import { confirmPayment, isSandbox, PaymentMethod, PaymentResult } from '../lib/mercadopago';
import { Check, Copy, Download, Play, ShieldCheck, AlertCircle } from 'lucide-react';

const METHODS: { value: PaymentMethod; label: string; detail: string }[] = [
  { value: 'mercadopago', label: 'Mercado Pago', detail: 'Dinero en cuenta o QR' },
  { value: 'card', label: 'Tarjeta', detail: 'Crédito o débito, hasta 3 cuotas' },
  { value: 'transfer', label: 'Transferencia', detail: 'CBU o alias, acreditación inmediata' },
];

const COUPONS: Record<string, number> = {
  DOCTOR2026: 0.15,
  LANZAMIENTO: 0.15,
};

const TRANSFER_ALIAS = 'NEURO.DESARROLLO.MP';

export const CheckoutModal = () => {
  const { activeCheckoutModule, setActiveCheckoutModule, purchaseModule, registerSale, setActiveVideoEpisode, user } =
    usePlatform();

  const [method, setMethod] = useState<PaymentMethod>('mercadopago');
  const [installments, setInstallments] = useState(1);
  const [email, setEmail] = useState(user?.email ?? '');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [invoiceType, setInvoiceType] = useState<'B' | 'A'>('B');
  const [cuit, setCuit] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discountRate, setDiscountRate] = useState(0);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [receipt, setReceipt] = useState<PaymentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!activeCheckoutModule) return null;

  const module = activeCheckoutModule;
  const listPrice = module.priceArs;
  const discount = Math.round(listPrice * discountRate);
  const total = Math.max(0, listPrice - discount);
  const consultFee = module.doctor.inPersonConsultFeeArs;
  const savings = consultFee - total;

  const close = () => {
    setActiveCheckoutModule(null);
    setReceipt(null);
    setError(null);
  };

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    const rate = COUPONS[code];
    if (rate) {
      setDiscountRate(rate);
      setCouponMessage(`Cupón aplicado. Descuento del ${Math.round(rate * 100)}%.`);
    } else {
      setDiscountRate(0);
      setCouponMessage('Ese cupón no está vigente. Revisá el código e intentá de nuevo.');
    }
  };

  const copyAlias = async () => {
    try {
      await navigator.clipboard.writeText(TRANSFER_ALIAS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('El navegador bloqueó el portapapeles. Copiá el alias a mano.');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      const result = await confirmPayment({
        module,
        amountArs: total,
        method,
        payerEmail: email,
        installments,
      });

      if (result.status !== 'approved') {
        setError('El pago no se acreditó. Probá con otro medio o escribinos por WhatsApp.');
        return;
      }

      purchaseModule(module.id);
      registerSale({
        moduleId: module.id,
        moduleTitle: module.title,
        buyerEmail: email,
        amountArs: total,
        method: result.detail,
        processedAt: result.processedAt,
        kind: 'pago',
      });
      setReceipt(result);
    } catch {
      setError('No pudimos contactar a Mercado Pago. Revisá tu conexión y reintentá.');
    } finally {
      setIsProcessing(false);
    }
  };

  const startWatching = () => {
    const firstEpisode = module.episodes[0];
    close();
    if (firstEpisode) setActiveVideoEpisode({ module, episode: firstEpisode });
  };

  /* ---------------- Comprobante ---------------- */
  if (receipt) {
    return (
      <Modal onClose={close} labelledBy="comprobante" width="sm">
        <div className="p-8">
          <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ok">
            <Check className="w-4 h-4" aria-hidden="true" />
            Pago acreditado
          </span>

          <h2 id="comprobante" className="mt-3 text-3xl leading-tight">
            Ya tenés acceso al módulo.
          </h2>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-secondary">
            Las {module.episodes.length} clases y el material en PDF quedaron habilitados en tu
            cuenta. El acceso no vence.
          </p>

          <dl className="mt-6 border-t border-rule text-[13px]">
            {[
              ['Comprobante', receipt.paymentId],
              ['Programa', module.title],
              ['Profesional', `${module.doctor.name} (${module.doctor.licenseNumber})`],
              ['Medio de pago', receipt.detail],
              ['Fecha', formatDate(receipt.processedAt)],
              ['Titular', email],
              [
                'Factura',
                invoiceType === 'A' ? `Tipo A, CUIT ${cuit || 'a confirmar'}` : 'Tipo B, consumidor final',
              ],
            ].map(([term, value]) => (
              <div key={term} className="flex items-baseline justify-between gap-4 border-b border-rule py-2.5">
                <dt className="text-ink-muted shrink-0">{term}</dt>
                <dd className="text-right text-ink truncate">{value}</dd>
              </div>
            ))}
            <div className="flex items-baseline justify-between gap-4 py-3">
              <dt className="font-semibold text-ink">Total abonado</dt>
              <dd className="tabular text-lg text-ink">{formatArsLong(total)}</dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-col sm:flex-row gap-2">
            <button onClick={startWatching} className="btn btn-primary flex-1 py-3">
              <Play className="w-3.5 h-3.5" aria-hidden="true" />
              Ver la primera clase
            </button>
            <button onClick={() => window.print()} className="btn btn-secondary py-3">
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              Comprobante
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  /* ---------------- Formulario de pago ---------------- */
  return (
    <Modal onClose={close} labelledBy="checkout" width="md">
      <form onSubmit={handleSubmit} className="p-6 sm:p-8">
        <p className="kicker">Pago seguro · Mercado Pago Argentina</p>
        <h2 id="checkout" className="mt-2 text-3xl leading-tight">
          Desbloquear el módulo
        </h2>

        {/* Resumen del programa */}
        <div className="mt-6 flex items-start gap-4 border-y border-rule py-4">
          <img
            src={module.thumbnailUrl}
            alt=""
            className="w-24 aspect-[16/9] object-cover rounded-xs border border-rule shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-lg leading-snug">{module.title}</h3>
            <p className="tabular mt-1 text-2xs uppercase tracking-wider text-ink-muted">
              {module.episodes.length} clases · Edición {module.year} · Acceso permanente
            </p>
          </div>
        </div>

        {/* Desglose transparente */}
        <dl className="mt-4 text-[13px]">
          <div className="flex items-baseline justify-between py-1.5">
            <dt className="text-ink-secondary">Precio del programa</dt>
            <dd className="tabular text-ink">{formatArs(listPrice)}</dd>
          </div>
          {discount > 0 && (
            <div className="flex items-baseline justify-between py-1.5">
              <dt className="text-ink-secondary">Descuento por cupón</dt>
              <dd className="tabular text-ok">- {formatArs(discount)}</dd>
            </div>
          )}
          <div className="flex items-baseline justify-between border-t border-rule mt-2 pt-3">
            <dt className="font-semibold text-ink">Total a pagar</dt>
            <dd className="tabular text-2xl text-ink">{formatArsLong(total)}</dd>
          </div>
        </dl>

        {savings > 0 && (
          <p className="evidence mt-4">
            Una consulta presencial en el consultorio cuesta {formatArs(consultFee)}. Este programa
            cubre las mismas explicaciones de base y queda disponible para volver a verlo.
          </p>
        )}

        {/* Medio de pago */}
        <fieldset className="mt-6">
          <legend className="label">Medio de pago</legend>
          <div className="rule-grid grid-cols-1 sm:grid-cols-3">
            {METHODS.map((option) => {
              const isActive = method === option.value;
              return (
                <label
                  key={option.value}
                  className={`rule-cell cursor-pointer p-4 transition-colors ${
                    isActive ? 'bg-accent-surface' : 'hover:bg-subtle'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment-method"
                    value={option.value}
                    checked={isActive}
                    onChange={() => setMethod(option.value)}
                    className="sr-only"
                  />
                  <span
                    className={`block text-[13px] font-semibold ${isActive ? 'text-accent' : 'text-ink'}`}
                  >
                    {option.label}
                  </span>
                  <span className="mt-1 block text-2xs text-ink-muted">{option.detail}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* Detalle según el medio elegido */}
        <div className="mt-5">
          {method === 'mercadopago' && (
            <div className="flex items-start gap-4 border border-rule rounded-xs p-4">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&margin=0&data=${encodeURIComponent(
                  `neurovod:${module.id}:${total}`,
                )}`}
                alt="Código QR de pago"
                className="w-24 h-24 shrink-0"
              />
              <div className="text-[13px] leading-relaxed text-ink-secondary">
                <p className="font-semibold text-ink">Escaneá con la app de Mercado Pago.</p>
                <p className="mt-1">
                  Confirmá el monto de {formatArsLong(total)}. El acceso se habilita apenas se
                  acredita el pago.
                </p>
              </div>
            </div>
          )}

          {method === 'card' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="label" htmlFor="card-number">Número de tarjeta</label>
                <input
                  id="card-number"
                  inputMode="numeric"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="0000 0000 0000 0000"
                  className="field tabular"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="card-holder">Nombre como figura en la tarjeta</label>
                <input
                  id="card-holder"
                  required
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                  className="field uppercase"
                />
              </div>
              <div>
                <label className="label" htmlFor="card-expiry">Vencimiento</label>
                <input
                  id="card-expiry"
                  required
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/AA"
                  className="field tabular"
                />
              </div>
              <div>
                <label className="label" htmlFor="card-cvv">Código de seguridad</label>
                <input
                  id="card-cvv"
                  required
                  inputMode="numeric"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                  className="field tabular"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="installments">Cuotas</label>
                <select
                  id="installments"
                  value={installments}
                  onChange={(e) => setInstallments(Number(e.target.value))}
                  className="field"
                >
                  <option value={1}>1 pago de {formatArs(total)}</option>
                  <option value={3}>3 cuotas de {formatArs(Math.round(total / 3))} sin interés</option>
                  <option value={6}>6 cuotas de {formatArs(Math.round((total * 1.15) / 6))}</option>
                </select>
              </div>
            </div>
          )}

          {method === 'transfer' && (
            <div className="border border-rule rounded-xs p-4 text-[13px]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="label mb-1">Alias</p>
                  <p className="tabular text-base text-ink">{TRANSFER_ALIAS}</p>
                </div>
                <button type="button" onClick={copyAlias} className="btn btn-secondary px-3 py-2">
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copiado' : 'Copiar alias'}
                </button>
              </div>
              <dl className="tabular mt-4 space-y-1 text-2xs text-ink-muted">
                <div>CBU 0000003100098421000123</div>
                <div>Titular {module.doctor.name}</div>
                <div>CUIT 20-28941029-4</div>
              </dl>
            </div>
          )}
        </div>

        {/* Datos de facturación */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="buyer-email">Correo para enviar el acceso</label>
            <input
              id="buyer-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="familia@ejemplo.com"
              className="field"
            />
          </div>
          <div>
            <label className="label" htmlFor="invoice-type">Tipo de factura</label>
            <select
              id="invoice-type"
              value={invoiceType}
              onChange={(e) => setInvoiceType(e.target.value as 'B' | 'A')}
              className="field"
            >
              <option value="B">Factura B, consumidor final</option>
              <option value="A">Factura A, con CUIT</option>
            </select>
          </div>
          {invoiceType === 'A' && (
            <div className="sm:col-span-2">
              <label className="label" htmlFor="cuit">CUIT para el reintegro de obra social</label>
              <input
                id="cuit"
                required
                value={cuit}
                onChange={(e) => setCuit(e.target.value)}
                placeholder="20-00000000-0"
                className="field tabular"
              />
            </div>
          )}
        </div>

        {/* Cupón */}
        <div className="mt-5">
          <label className="label" htmlFor="coupon">Cupón de descuento</label>
          <div className="flex gap-2">
            <input
              id="coupon"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Opcional"
              className="field uppercase"
            />
            <button type="button" onClick={applyCoupon} className="btn btn-secondary">
              Aplicar
            </button>
          </div>
          {couponMessage && (
            <p className={`mt-2 text-2xs ${discountRate > 0 ? 'text-ok' : 'text-ink-muted'}`}>
              {couponMessage}
            </p>
          )}
        </div>

        {error && (
          <p className="mt-5 flex items-start gap-2 border border-rule-strong rounded-xs p-3 text-[13px] text-ink">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-ink-muted" aria-hidden="true" />
            {error}
          </p>
        )}

        <button type="submit" disabled={isProcessing} className="btn btn-primary w-full mt-6 py-3.5">
          {isProcessing ? 'Confirmando el pago...' : `Pagar ${formatArsLong(total)}`}
        </button>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-2xs text-ink-muted">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-ok" aria-hidden="true" />
            Devolución dentro de los 7 días
          </span>
          <span>Acceso permanente en todos tus dispositivos</span>
        </div>

        {isSandbox() && (
          <p className="tabular mt-4 text-center text-2xs uppercase tracking-wider text-ink-muted">
            Entorno de prueba. Ninguna operación real se procesa.
          </p>
        )}
      </form>
    </Modal>
  );
};
