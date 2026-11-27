import { ArrowUpRight, MessageCircle, MapPin, Phone, Mail } from 'lucide-react';
import { BRAND_CONTACT, PROPERTY_CATEGORIES } from '../data/midtownData';
import type { LegalDocType } from './LegalModal';

interface FooterProps {
  onNavigate: (id: string) => void;
  onOpenLegal: (doc: LegalDocType) => void;
  onSelectCategory: (categoryTitle: string) => void;
}

export function Footer({ onNavigate, onOpenLegal, onSelectCategory }: FooterProps) {
  return (
    <footer className="bg-[#EFECE6] text-[#0A0A0A] border-t border-[#D6D2C8]">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 py-16 sm:py-24">
        {/* Top Monumental Architectural Statement + Transparent Logo */}
        <div className="grid gap-8 border-b border-[#D6D2C8] pb-14 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7 space-y-6">
            <img
              src="./images/midtown-logo.png"
              alt="Midtown Property — Reach beyond with us"
              width={230}
              height={114}
              loading="lazy"
              className="h-14 w-auto sm:h-16 object-contain"
            />
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.04] tracking-tight text-[#0A0A0A]">
              Every dream space rises{' '}
              <span className="italic text-[#4B7F1E]">brick by brick.</span>
            </h2>
          </div>

          <div className="lg:col-span-5 flex flex-wrap gap-3 lg:justify-end">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('contact');
              }}
              className="inline-flex min-h-[48px] items-center gap-2 bg-[#0A0A0A] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-white hover:bg-[#4B7F1E] transition-colors"
            >
              <span>Schedule Advisory</span>
              <ArrowUpRight className="h-4 w-4 text-[#84C44C]" aria-hidden="true" />
            </a>
            <a
              href={BRAND_CONTACT.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center gap-2 border border-[#0A0A0A] bg-white px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors"
            >
              <MessageCircle className="h-4 w-4 text-[#4B7F1E]" aria-hidden="true" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Middle Architectural Structural Grid (Hairline-Divided Modules) */}
        <div className="grid border-b border-[#D6D2C8] md:grid-cols-2 lg:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#D6D2C8]">
          {/* Office Plinth */}
          <div className="py-10 lg:col-span-4 lg:pr-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#4B7F1E]">
              Advisory Office · Thaltej
            </p>
            <div className="mt-5 space-y-4 text-sm text-[#3F3F44]">
              <p className="flex items-start gap-2.5 leading-relaxed">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#4B7F1E]" aria-hidden="true" />
                <span>{BRAND_CONTACT.address}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-[#4B7F1E]" aria-hidden="true" />
                <a href={BRAND_CONTACT.phoneHref} className="font-medium text-[#0A0A0A] hover:text-[#4B7F1E]">
                  {BRAND_CONTACT.phoneDisplay}
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-[#4B7F1E]" aria-hidden="true" />
                <a href={BRAND_CONTACT.emailHref} className="font-medium text-[#0A0A0A] hover:text-[#4B7F1E]">
                  {BRAND_CONTACT.email}
                </a>
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="py-10 md:px-8 lg:col-span-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#4B7F1E]">
              Site Directory
            </p>
            <ul className="mt-5 grid grid-cols-2 gap-y-3 gap-x-4 text-sm text-[#3F3F44]">
              {[
                { id: 'hero', label: 'Home' },
                { id: 'story', label: 'About' },
                { id: 'categories', label: 'Collections' },
                { id: 'properties', label: 'Properties' },
                { id: 'locations', label: 'Locations' },
                { id: 'investment', label: 'Advisory' },
                { id: 'testimonials', label: 'Reviews' },
                { id: 'contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(link.id);
                    }}
                    className="hover:text-[#0A0A0A] hover:underline underline-offset-4 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Asset Categories */}
          <div className="py-10 md:px-8 lg:col-span-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#4B7F1E]">
              Asset Verticals
            </p>
            <ul className="mt-5 space-y-3 text-sm text-[#3F3F44]">
              {PROPERTY_CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => onSelectCategory(cat.title)}
                    className="group flex w-full items-center justify-between text-left hover:text-[#0A0A0A] transition-colors cursor-pointer"
                  >
                    <span className="font-medium">{cat.title}</span>
                    <span className="font-mono text-[10px] text-[#6E6E73] group-hover:text-[#4B7F1E]">
                      {cat.index}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Network & Tagline */}
          <div className="py-10 lg:pl-8 lg:col-span-2 flex flex-col justify-between gap-6">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#4B7F1E]">
                Connect
              </p>
              <div className="mt-5 flex flex-col gap-2.5">
                <a
                  href={BRAND_CONTACT.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between border border-[#D6D2C8] bg-white px-3.5 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#0A0A0A] hover:border-[#0A0A0A]"
                >
                  <span>Facebook</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#4B7F1E]" aria-hidden="true" />
                </a>
                <a
                  href={BRAND_CONTACT.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between border border-[#D6D2C8] bg-white px-3.5 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#0A0A0A] hover:border-[#0A0A0A]"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#4B7F1E]" aria-hidden="true" />
                </a>
              </div>
            </div>

            <p className="font-serif italic text-lg text-[#4B7F1E]">
              “{BRAND_CONTACT.tagline}”
            </p>
          </div>
        </div>

        {/* Bottom RERA & Legal Datum Strip */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs text-[#57575C]">
          <div className="space-y-1">
            <p className="font-medium text-[#0A0A0A]">
              © {new Date().getFullYear()} Midtown Property · Ahmedabad, Gujarat.
            </p>
            <p className="font-mono text-[11px] text-[#57575C]">
              RERA Registration: {BRAND_CONTACT.reraNo}
            </p>
          </div>
          <div className="flex items-center gap-6 font-medium">
            <button
              type="button"
              onClick={() => onOpenLegal('privacy')}
              className="hover:text-[#0A0A0A] underline underline-offset-4 cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => onOpenLegal('terms')}
              className="hover:text-[#0A0A0A] underline underline-offset-4 cursor-pointer"
            >
              Terms &amp; Conditions
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
