import { useEffect, useRef, useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { BRAND_CONTACT } from '../data/midtownData';

export interface InquiryPrefill {
  interestedIn?: 'Buy' | 'Sell' | 'Lease' | 'Invest';
  propertyType?: 'Residential' | 'Commercial' | 'Land & Plots' | 'Industrial';
  message?: string;
  key: number;
}

interface ContactSectionProps {
  prefill: InquiryPrefill | null;
}

const INTEREST_OPTIONS = ['Buy', 'Sell', 'Lease', 'Invest'] as const;
const PROPERTY_TYPES = ['Residential', 'Commercial', 'Land & Plots', 'Industrial'] as const;

export function ContactSection({ prefill }: ContactSectionProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const announcerRef = useRef<HTMLDivElement | null>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [interestedIn, setInterestedIn] = useState<(typeof INTEREST_OPTIONS)[number]>('Buy');
  const [propertyType, setPropertyType] = useState<(typeof PROPERTY_TYPES)[number]>('Residential');
  const [message, setMessage] = useState('');
  const [submittedSummary, setSubmittedSummary] = useState<{
    name: string;
    phone: string;
    email: string;
    interestedIn: string;
    propertyType: string;
    message: string;
  } | null>(null);

  // Sync prefill from Property Dossier, Locations, or Investment CTA
  useEffect(() => {
    if (!prefill) return;
    if (prefill.interestedIn) setInterestedIn(prefill.interestedIn);
    if (prefill.propertyType) setPropertyType(prefill.propertyType);
    if (prefill.message) setMessage(prefill.message);
    setSubmittedSummary(null);
  }, [prefill]);

  // Accessible validation sync (:user-invalid + Safari/older fallback + polite announcer)
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const supportsUserInvalid = CSS.supports('selector(:user-invalid)');
    const dirtyState = new WeakMap<Element, { hasInteracted: boolean; hasBlurred: boolean }>();
    const flagged = new WeakSet<Element>();
    const announced = new WeakSet<Element>();
    let announceTimer: ReturnType<typeof setTimeout> | undefined;
    let announcedField: Element | null = null;

    const linkError = (el: HTMLElement, shown: boolean) => {
      const errorId = el.dataset.error;
      if (!errorId) return;
      const ids = (el.getAttribute('aria-describedby') || '')
        .split(/\s+/)
        .filter((id) => id && id !== errorId);
      if (shown) ids.push(errorId);
      if (ids.length) el.setAttribute('aria-describedby', ids.join(' '));
      else el.removeAttribute('aria-describedby');
    };

    const announceError = (el: HTMLElement) => {
      const errorId = el.dataset.error;
      const errorEl = errorId ? document.getElementById(errorId) : null;
      const announcer = announcerRef.current;
      if (!errorEl || !announcer) return;

      const labelEl = form.querySelector(`label[for="${el.id}"]`);
      const labelText = labelEl ? `${labelEl.textContent?.trim()}: ` : '';
      clearTimeout(announceTimer);
      announcer.textContent = '';
      announcedField = el;
      announceTimer = setTimeout(() => {
        announcer.textContent = labelText + (errorEl.textContent?.trim() || '');
      }, 500);
    };

    const syncAria = (el: EventTarget | null, announce = false) => {
      if (!(el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement)) {
        return;
      }
      if (!el.classList.contains('field-control')) return;

      const invalid = supportsUserInvalid
        ? el.matches(':user-invalid')
        : el.classList.contains('user-invalid-fallback');

      if (invalid) {
        if (announce && !announced.has(el)) {
          announceError(el);
          announced.add(el);
        }
        el.setAttribute('aria-invalid', 'true');
        linkError(el, true);
        flagged.add(el);
      } else if (flagged.has(el) || el.getAttribute('aria-invalid') !== 'true') {
        el.setAttribute('aria-invalid', 'false');
        linkError(el, false);
        flagged.delete(el);
        announced.delete(el);
        if (announcedField === el && announcerRef.current) {
          clearTimeout(announceTimer);
          announcerRef.current.textContent = '';
        }
      }
    };

    form.querySelectorAll('.field-control').forEach((el) => {
      el.setAttribute('aria-invalid', 'false');
    });

    const onBlur = (e: FocusEvent) => {
      const target = e.target;
      if (!supportsUserInvalid && (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) {
        const state = dirtyState.get(target) || { hasInteracted: false, hasBlurred: false };
        state.hasBlurred = true;
        dirtyState.set(target, state);
        if (state.hasInteracted) {
          target.classList.toggle('user-invalid-fallback', !target.validity.valid);
          target.classList.toggle('user-valid-fallback', target.validity.valid);
        }
      }
      syncAria(target, true);
    };

    const onInput = (e: Event) => {
      const target = e.target;
      if (!supportsUserInvalid && (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) {
        const state = dirtyState.get(target) || { hasInteracted: false, hasBlurred: false };
        state.hasInteracted = true;
        dirtyState.set(target, state);
        if (state.hasBlurred) {
          target.classList.toggle('user-invalid-fallback', !target.validity.valid);
          target.classList.toggle('user-valid-fallback', target.validity.valid);
        }
      }
      if (target instanceof HTMLElement && target.hasAttribute('aria-invalid')) {
        syncAria(target, false);
      }
    };

    const onInvalid = (e: Event) => {
      const target = e.target;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) {
        if (!supportsUserInvalid) {
          dirtyState.set(target, { hasInteracted: true, hasBlurred: true });
          target.classList.add('user-invalid-fallback');
          target.classList.remove('user-valid-fallback');
        }
        announced.add(target);
        syncAria(target, false);
      }
    };

    form.addEventListener('blur', onBlur, true);
    form.addEventListener('input', onInput);
    form.addEventListener('change', onInput);
    form.addEventListener('invalid', onInvalid, true);

    return () => {
      clearTimeout(announceTimer);
      form.removeEventListener('blur', onBlur, true);
      form.removeEventListener('input', onInput);
      form.removeEventListener('change', onInput);
      form.removeEventListener('invalid', onInvalid, true);
    };
  }, [submittedSummary]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      const firstInvalid = form.querySelector<HTMLElement>(':invalid');
      firstInvalid?.focus();
      form.reportValidity();
      return;
    }

    setSubmittedSummary({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      interestedIn,
      propertyType,
      message: message.trim(),
    });
  };

  const buildWhatsappInquiryUrl = (summary: NonNullable<typeof submittedSummary>) => {
    const text = [
      `Hello Midtown Property,`,
      `Name: ${summary.name}`,
      `Phone: ${summary.phone}`,
      `Email: ${summary.email}`,
      `Interested In: ${summary.interestedIn} (${summary.propertyType})`,
      summary.message ? `Details: ${summary.message}` : '',
    ]
      .filter(Boolean)
      .join('\n');
    return `https://api.whatsapp.com/send?phone=919879813402&text=${encodeURIComponent(text)}`;
  };

  const buildMailtoUrl = (summary: NonNullable<typeof submittedSummary>) => {
    const subject = `Midtown Property Inquiry — ${summary.interestedIn} (${summary.propertyType})`;
    const body = [
      `Name: ${summary.name}`,
      `Phone: ${summary.phone}`,
      `Email: ${summary.email}`,
      `Interested In: ${summary.interestedIn}`,
      `Property Type: ${summary.propertyType}`,
      '',
      summary.message,
    ].join('\n');
    return `mailto:${BRAND_CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section
      id="contact"
      className="bg-[#F8F8F6] py-24 sm:py-32 border-t border-[#E2E2DD]"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Left Column: Direct Advisory Channels */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#4B7F1E]">
                11 · Private Consultation
              </p>
              <h2 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.05] tracking-tight text-[#0A0A0A]">
                Start a conversation with{' '}
                <span className="italic text-[#4B7F1E]">Midtown.</span>
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-[#57575C]">
                Visit our Thaltej advisory office or reach our team directly by phone, WhatsApp,
                or email for tailored site visits and property shortlists.
              </p>

              <div className="mt-10 space-y-6 border-t border-[#E2E2DD] pt-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#E2E2DD] bg-white">
                    <Phone className="h-4 w-4 text-[#4B7F1E]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#6E6E73]">
                      Phone
                    </p>
                    <a
                      href={BRAND_CONTACT.phoneHref}
                      className="mt-1 inline-block text-lg font-medium text-[#0A0A0A] hover:text-[#4B7F1E] transition-colors"
                    >
                      {BRAND_CONTACT.phoneDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#E2E2DD] bg-white">
                    <Mail className="h-4 w-4 text-[#4B7F1E]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#6E6E73]">
                      Email
                    </p>
                    <a
                      href={BRAND_CONTACT.emailHref}
                      className="mt-1 inline-block text-lg font-medium text-[#0A0A0A] hover:text-[#4B7F1E] transition-colors"
                    >
                      {BRAND_CONTACT.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#E2E2DD] bg-white">
                    <MapPin className="h-4 w-4 text-[#4B7F1E]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#6E6E73]">
                      Office Address
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-[#3F3F44]">
                      {BRAND_CONTACT.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-[#E2E2DD]">
              <a
                href={BRAND_CONTACT.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-3 bg-[#0A0A0A] px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#4B7F1E] transition-colors"
              >
                <MessageCircle className="h-4 w-4 text-[#84C44C]" aria-hidden="true" />
                <span>Chat on WhatsApp</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Right Column: Accessible Inquiry Form */}
          <div className="lg:col-span-7 bg-white border border-[#E2E2DD] p-6 sm:p-10">
            <div ref={announcerRef} aria-live="polite" className="visually-hidden" />

            {submittedSummary ? (
              <div className="flex h-full flex-col justify-between py-4" role="status">
                <div>
                  <div className="inline-flex items-center gap-2 border border-[#84C44C] bg-[#84C44C]/10 px-3 py-1.5 text-xs font-mono uppercase tracking-[0.14em] text-[#4B7F1E]">
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    Inquiry Prepared
                  </div>
                  <h3 className="mt-5 font-serif text-3xl sm:text-4xl font-normal text-[#0A0A0A]">
                    Thank you, {submittedSummary.name}.
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#57575C]">
                    Your brief has been validated for our advisory desk. Send it instantaneously via
                    WhatsApp or Email below to connect directly with our Thaltej team.
                  </p>

                  <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 border-y border-[#E2E2DD] py-5 text-sm">
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6E6E73]">
                        Requirement
                      </dt>
                      <dd className="mt-1 font-medium">
                        {submittedSummary.interestedIn} · {submittedSummary.propertyType}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6E6E73]">
                        Contact
                      </dt>
                      <dd className="mt-1 font-medium">
                        {submittedSummary.phone} · {submittedSummary.email}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={buildWhatsappInquiryUrl(submittedSummary)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#0A0A0A] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#4B7F1E] transition-colors"
                  >
                    <MessageCircle className="h-4 w-4 text-[#84C44C]" aria-hidden="true" />
                    <span>Send via WhatsApp</span>
                  </a>
                  <a
                    href={buildMailtoUrl(submittedSummary)}
                    className="inline-flex items-center gap-2 border border-[#0A0A0A] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#0A0A0A] hover:bg-[#F8F8F6] transition-colors"
                  >
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    <span>Send via Email</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setSubmittedSummary(null)}
                    className="px-4 py-3.5 text-xs font-medium uppercase tracking-[0.14em] text-[#57575C] hover:text-[#0A0A0A]"
                  >
                    Edit Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                aria-labelledby="contact-form-heading"
                noValidate
                className="space-y-6"
              >
                <div className="border-b border-[#E2E2DD] pb-4">
                  <h3 id="contact-form-heading" className="font-serif text-2xl sm:text-3xl font-normal text-[#0A0A0A]">
                    Property &amp; Investment Brief
                  </h3>
                  <p className="mt-1 text-xs text-[#6E6E73]">
                    Fields marked with <span aria-hidden="true">*</span> are required.
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Full Name */}
                  <div className="flex flex-col">
                    <label htmlFor="contact-name" className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0A0A0A]">
                      Name <span aria-hidden="true" className="text-[#4B7F1E]">*</span>
                    </label>
                    <span id="contact-name-hint" className="mt-1 text-xs text-[#6E6E73]">
                      Your full name
                    </span>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      minLength={2}
                      autoComplete="name"
                      enterKeyHint="next"
                      aria-describedby="contact-name-hint"
                      data-error="contact-name-error"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="field-control mt-2 w-full border border-[#D1D1CB] bg-[#F8F8F6] px-3.5 py-2.5 text-[#0A0A0A]"
                    />
                    <div id="contact-name-error" className="field-error-msg">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>Please enter your full name (at least 2 characters).</span>
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="flex flex-col">
                    <label htmlFor="contact-phone" className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0A0A0A]">
                      Phone Number <span aria-hidden="true" className="text-[#4B7F1E]">*</span>
                    </label>
                    <span id="contact-phone-hint" className="mt-1 text-xs text-[#6E6E73]">
                      10-digit mobile or +91 number
                    </span>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      required
                      inputMode="tel"
                      pattern="[+\d\s\-()]{10,16}"
                      autoComplete="tel"
                      enterKeyHint="next"
                      aria-describedby="contact-phone-hint"
                      data-error="contact-phone-error"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="field-control mt-2 w-full border border-[#D1D1CB] bg-[#F8F8F6] px-3.5 py-2.5 text-[#0A0A0A]"
                    />
                    <div id="contact-phone-error" className="field-error-msg">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>Enter a valid 10-digit phone number (digits, spaces, or +91).</span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Email */}
                  <div className="flex flex-col">
                    <label htmlFor="contact-email" className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0A0A0A]">
                      Email <span aria-hidden="true" className="text-[#4B7F1E]">*</span>
                    </label>
                    <span id="contact-email-hint" className="mt-1 text-xs text-[#6E6E73]">
                      Format: you@domain.com
                    </span>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      autoCorrect="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      enterKeyHint="next"
                      aria-describedby="contact-email-hint"
                      data-error="contact-email-error"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="field-control mt-2 w-full border border-[#D1D1CB] bg-[#F8F8F6] px-3.5 py-2.5 text-[#0A0A0A]"
                    />
                    <div id="contact-email-error" className="field-error-msg">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>Enter a valid email address in the format you@domain.com.</span>
                    </div>
                  </div>

                  {/* Property Type */}
                  <div className="flex flex-col">
                    <label htmlFor="contact-property-type" className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0A0A0A]">
                      Property Type <span aria-hidden="true" className="text-[#4B7F1E]">*</span>
                    </label>
                    <span id="contact-type-hint" className="mt-1 text-xs text-[#6E6E73]">
                      Asset category of interest
                    </span>
                    <select
                      id="contact-property-type"
                      name="property_type"
                      required
                      aria-describedby="contact-type-hint"
                      value={propertyType}
                      onChange={(e) =>
                        setPropertyType(e.target.value as (typeof PROPERTY_TYPES)[number])
                      }
                      className="field-control mt-2 w-full border border-[#D1D1CB] bg-[#F8F8F6] px-3.5 py-2.5 text-[#0A0A0A]"
                    >
                      {PROPERTY_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Interested In (4 options as visible radio controls per Selection Matrix) */}
                <fieldset className="border-t border-[#E2E2DD] pt-5">
                  <legend className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0A0A0A]">
                    Interested In <span aria-hidden="true" className="text-[#4B7F1E]">*</span>
                  </legend>
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {INTEREST_OPTIONS.map((option) => {
                      const radioId = `interest-${option.toLowerCase()}`;
                      const checked = interestedIn === option;
                      return (
                        <div key={option}>
                          <input
                            type="radio"
                            id={radioId}
                            name="interested_in"
                            value={option}
                            checked={checked}
                            onChange={() => setInterestedIn(option)}
                            className="peer visually-hidden"
                          />
                          <label
                            htmlFor={radioId}
                            className={`flex min-h-[48px] cursor-pointer items-center justify-center border px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-all peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-[#4B7F1E] peer-focus-visible:outline-offset-2 ${
                              checked
                                ? 'border-[#0A0A0A] bg-[#0A0A0A] text-white'
                                : 'border-[#D1D1CB] bg-[#F8F8F6] text-[#3F3F44] hover:border-[#0A0A0A]'
                            }`}
                          >
                            {option}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </fieldset>

                {/* Message */}
                <div className="flex flex-col">
                  <label htmlFor="contact-message" className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0A0A0A]">
                    Message <span aria-hidden="true" className="text-[#4B7F1E]">*</span>
                  </label>
                  <span id="contact-message-hint" className="mt-1 text-xs text-[#6E6E73]">
                    Preferred locations, size (Sq.Ft / BHK), or investment horizon
                  </span>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    required
                    minLength={6}
                    enterKeyHint="done"
                    aria-describedby="contact-message-hint"
                    data-error="contact-message-error"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="field-control mt-2 w-full border border-[#D1D1CB] bg-[#F8F8F6] px-3.5 py-3 text-[#0A0A0A]"
                  />
                  <div id="contact-message-error" className="field-error-msg">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>Please share a brief note about what you are looking for.</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
                  <p className="font-mono text-[11px] text-[#6E6E73]">
                    RERA Registered · {BRAND_CONTACT.reraNo}
                  </p>
                  <button
                    type="submit"
                    className="inline-flex min-h-[48px] items-center justify-center gap-2.5 bg-[#0A0A0A] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-[#4B7F1E] transition-colors cursor-pointer"
                  >
                    <span>Send Inquiry</span>
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
