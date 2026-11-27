import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import {
  ArrowUpRight,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Plus,
  Check,
  Layers,
} from 'lucide-react';

import {
  BRAND_CONTACT,
  CONSULTATION_SERVICES,
  DEVELOPER_PARTNERS,
  FEATURED_PROPERTIES,
  PROPERTY_CATEGORIES,
  TESTIMONIALS,
  WHY_MIDTOWN_PILLARS,
  type PropertyItem,
} from './data/midtownData';
import { Navbar } from './components/Navbar';
import { PropertyDossierModal } from './components/PropertyDossierModal';
import { LegalModal, type LegalDocType } from './components/LegalModal';
import { LocationsMapSection } from './components/LocationsMapSection';
import { ContactSection, type InquiryPrefill } from './components/ContactSection';
import { Footer } from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

const HERO_MODES = [
  {
    id: 'living',
    num: '01',
    label: 'Living',
    caption: 'Private residences & sky terraces across Thaltej, Science City & Bodakdev',
    insetImage: '/images/cat-residential.jpg',
    insetAlt: 'Luxury residential terrace in West Ahmedabad',
  },
  {
    id: 'business',
    num: '02',
    label: 'Business',
    caption: 'Grade-A corporate towers & flagship showrooms along SG Highway',
    insetImage: '/images/cat-commercial.jpg',
    insetAlt: 'Contemporary commercial tower along SG Highway',
  },
  {
    id: 'land',
    num: '03',
    label: 'Land',
    caption: 'Vetted NA plots, estates & industrial hubs across Ahmedabad & Gujarat',
    insetImage: '/images/cat-land.jpg',
    insetAlt: 'Expansive plotted estate and landscaped land in Ahmedabad',
  },
] as const;

const BRICK_LAYERS = [
  {
    course: 'Course 01 · Foundation',
    title: 'Trust & RERA Clarity',
    detail:
      'Every residential home or commercial mandate starts on verified ground—clear titles, RERA scrutiny, and transparent carpet-to-super-built-up numbers.',
  },
  {
    course: 'Course 02 · Alignment',
    title: 'Street-Level Local Mastery',
    detail:
      'Guided from our Thaltej–Shilaj office with firsthand insight into micro-markets, infrastructure pipelines, and developer track records.',
  },
  {
    course: 'Course 03 · Craft',
    title: 'Spaces Fit for Life & Work',
    detail:
      'Natural light, floor-plate efficiency, acoustic privacy, and builder pedigree—evaluating architecture for how you actually live and operate.',
  },
  {
    course: 'Course 04 · Horizon',
    title: 'Enduring Long-Term Value',
    detail:
      'Because a property is someone’s dream and capital anchor, we structure every acquisition for resilience and multi-decade appreciation.',
  },
] as const;

const ADVISORY_GOALS = [
  {
    id: 'home',
    label: 'Dream Residence',
    interest: 'Buy' as const,
    propertyType: 'Residential' as const,
    steps: [
      'Shortlist RERA-verified 3–5 BHK residences & penthouses across West Ahmedabad',
      'Compare carpet efficiency, orientation, and builder delivery history',
      'Negotiate transparently through allotment and possession handover',
    ],
  },
  {
    id: 'workspace',
    label: 'Commercial / Retail',
    interest: 'Lease' as const,
    propertyType: 'Commercial' as const,
    steps: [
      'Identify high-footfall showrooms and Grade-A office plates on SG Highway & SBR',
      'Evaluate frontage, parking ratios, and furnished vs. bare-shell economics',
      'Structure lease or acquisition terms aligned with business expansion',
    ],
  },
  {
    id: 'capital',
    label: 'Portfolio Growth',
    interest: 'Invest' as const,
    propertyType: 'Commercial' as const,
    steps: [
      'Benchmark rental yield and corridor appreciation catalysts across Ahmedabad',
      'Balance ready-possession income assets with strategic pre-possession entries',
      'Execute clean exit or long-term compounding strategies with developer access',
    ],
  },
  {
    id: 'land',
    label: 'Land & Industrial',
    interest: 'Buy' as const,
    propertyType: 'Land & Plots' as const,
    steps: [
      'Screen NA / agricultural land parcels, plotted estates, and industrial belts',
      'Verify zoning, road connectivity, and logistics infrastructure suitability',
      'Coordinate site inspections and compliant documentation end-to-end',
    ],
  },
] as const;

export function App() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  const [heroModeIdx, setHeroModeIdx] = useState(0);
  const [activeBrickIdx, setActiveBrickIdx] = useState(0);
  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0);
  const [propertyFilter, setPropertyFilter] = useState<'All' | 'Residential' | 'Commercial'>('All');
  const [shortlistIds, setShortlistIds] = useState<string[]>([]);
  const [activePillarIdx, setActivePillarIdx] = useState(0);
  const [activeGoalIdx, setActiveGoalIdx] = useState(0);
  const [selectedProperty, setSelectedProperty] = useState<PropertyItem | null>(null);
  const [legalDoc, setLegalDoc] = useState<LegalDocType>(null);
  const [inquiryPrefill, setInquiryPrefill] = useState<InquiryPrefill | null>(null);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [hoveredPartner, setHoveredPartner] = useState<string | null>(null);

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset: -72 });
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const prefillAndScrollToContact = (prefill: Omit<InquiryPrefill, 'key'>) => {
    setInquiryPrefill({ ...prefill, key: Date.now() });
    scrollToSection('contact');
  };

  const toggleShortlist = (id: string) => {
    setShortlistIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // GSAP + ScrollTrigger + Lenis "Brick-by-Brick" Choreography
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      // 1. Hero Staggered Brick-Aperture Entrance
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      heroTl
        .from('.hero-brick-eyebrow', { y: 16, opacity: 0, duration: 0.65 })
        .from('.hero-title-line', { y: 36, opacity: 0, duration: 0.85, stagger: 0.12 }, '-=0.4')
        .from('.hero-accent-rule', { scaleX: 0, transformOrigin: 'left center', duration: 0.65 }, '-=0.45')
        .from('.hero-copy-block', { y: 18, opacity: 0, duration: 0.65 }, '-=0.4')
        .from('.hero-brick-frame', {
          clipPath: 'inset(100% 0% 0% 0%)',
          y: 28,
          duration: 0.9,
          stagger: 0.12,
        }, '-=0.65');

      // Subtle hero photography parallax on scroll
      gsap.to('.hero-main-photo', {
        yPercent: 10,
        scale: 1.05,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // 2. Section 02 — Pinned Brick-by-Brick Story on Desktop
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px)', () => {
        const storyTl = gsap.timeline({
          scrollTrigger: {
            trigger: '#story',
            start: 'top top',
            end: '+=110%',
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
            onUpdate: (self) => {
              const step = Math.min(3, Math.floor(self.progress * 3.99));
              setActiveBrickIdx(step);
            },
          },
        });

        storyTl
          .from('.story-headline-accent', { opacity: 0.25, y: 18, duration: 0.5 })
          .fromTo(
            '.story-photo-reveal',
            { clipPath: 'inset(16% 0% 0% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7 },
            0,
          )
          .from('.story-stat-brick', { y: 20, opacity: 0, stagger: 0.12, duration: 0.5 }, '-=0.35');
      });

      // 3. Staggered Masonry Brick Reveals Across Sections
      gsap.utils.toArray<HTMLElement>('.brick-reveal').forEach((el, idx) => {
        gsap.from(el, {
          y: 28,
          opacity: 0,
          duration: 0.72,
          delay: (idx % 3) * 0.06,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 87%',
            once: true,
          },
        });
      });

      // 4. Clip-Path Architectural Apertures
      gsap.utils.toArray<HTMLElement>('.clip-reveal').forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: 'inset(12% 0% 0% 0%)', opacity: 0.45 },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 86%',
              once: true,
            },
          },
        );
      });

      // 5. Scroll-Driven Partner Brick Wall (No auto-timer, moves strictly on scroll)
      gsap.fromTo(
        '.partner-row-top',
        { xPercent: 0 },
        {
          xPercent: -12,
          ease: 'none',
          scrollTrigger: {
            trigger: '#partners',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      );

      gsap.fromTo(
        '.partner-row-bottom',
        { xPercent: -12 },
        {
          xPercent: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '#partners',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      );

      // 6. Numerical Statistics Counter Animation
      gsap.utils.toArray<HTMLElement>('.count-metric').forEach((el) => {
        const targetVal = Number(el.dataset.target || '0');
        const suffix = el.dataset.suffix || '';
        const decimals = Number(el.dataset.decimals || '0');
        const counter = { val: 0 };

        gsap.to(counter, {
          val: targetVal,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
          onUpdate: () => {
            el.textContent = counter.val.toFixed(decimals) + suffix;
          },
        });
      });
    }, rootRef);

    return () => {
      ctx.revert();
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const filteredProperties =
    propertyFilter === 'All'
      ? FEATURED_PROPERTIES
      : FEATURED_PROPERTIES.filter((p) => p.category === propertyFilter);

  const primaryProperty = filteredProperties[0];
  const secondaryProperties = filteredProperties.slice(1);
  const currentCategory = PROPERTY_CATEGORIES[activeCategoryIdx];
  const currentTestimonial = TESTIMONIALS[testimonialIdx];
  const currentHeroMode = HERO_MODES[heroModeIdx];
  const currentGoal = ADVISORY_GOALS[activeGoalIdx];

  const shortlistedNames = FEATURED_PROPERTIES.filter((p) =>
    shortlistIds.includes(p.id),
  ).map((p) => p.name);

  const partnerRowTop = DEVELOPER_PARTNERS.slice(0, 9);
  const partnerRowBottom = DEVELOPER_PARTNERS.slice(9);

  return (
    <div ref={rootRef} className="min-h-screen bg-[#F8F8F6] text-[#0A0A0A]">
      <a href="#main-heading" className="skip-link visually-hidden">
        Skip to main content
      </a>

      <Navbar onNavigate={scrollToSection} />

      <main>
        {/* ================================================================
            SECTION 01 — REDESIGNED LIGHT ARCHITECTURAL 2D HERO (BRICK-BY-BRICK)
            ================================================================ */}
        <section
          id="hero"
          className="masonry-grid-bg relative overflow-hidden bg-[#F8F8F6] pt-28 pb-16 sm:pt-32 sm:pb-24 border-b border-[#E2E2DD]"
        >
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              {/* Left Column: Editorial Headline + Philosophy + Interactive Mode Selector */}
              <div className="lg:col-span-6 space-y-7">
                <div className="hero-brick-eyebrow flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#57575C]">
                  <span className="inline-block h-2.5 w-5 bg-[#84C44C]" aria-hidden="true" />
                  <span>Thaltej · Ahmedabad</span>
                  <span className="text-[#D1D1CB]" aria-hidden="true">/</span>
                  <span className="text-[#4B7F1E] font-semibold">{BRAND_CONTACT.tagline}</span>
                </div>

                <h1
                  id="main-heading"
                  tabIndex={-1}
                  className="font-serif text-[clamp(3.15rem,6.8vw,5.9rem)] font-normal leading-[0.96] tracking-[-0.025em] text-[#0A0A0A] focus:outline-none"
                >
                  <span className="hero-title-line block">Find a space.</span>
                  <span className="hero-title-line block italic text-[#4B7F1E]">
                    See a future.
                  </span>
                </h1>

                <div className="hero-accent-rule h-[2px] w-24 bg-[#84C44C]" aria-hidden="true" />

                <div className="hero-copy-block space-y-3 max-w-xl">
                  <p className="text-base sm:text-lg leading-relaxed text-[#3F3F44]">
                    Thoughtfully curated real estate opportunities for living, business and
                    long-term investment.
                  </p>
                  <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#6E6E73]">
                    Built Brick by Brick · Because every home &amp; enterprise begins as a dream
                  </p>
                </div>

                {/* Primary CTAs */}
                <div className="hero-copy-block flex flex-wrap items-center gap-3.5 pt-1">
                  <button
                    type="button"
                    onClick={() => scrollToSection('properties')}
                    className="inline-flex min-h-[48px] items-center gap-2.5 bg-[#0A0A0A] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-[#4B7F1E] transition-colors cursor-pointer"
                  >
                    <span>Explore Properties</span>
                    <ArrowUpRight className="h-4 w-4 text-[#84C44C]" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('contact')}
                    className="inline-flex min-h-[48px] items-center gap-2.5 border border-[#0A0A0A] bg-white px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#0A0A0A] hover:bg-[#EFECE6] transition-colors cursor-pointer"
                  >
                    <span>Let’s Talk</span>
                  </button>
                </div>

                {/* Interactive Hero Brick-Mood Selector */}
                <div className="pt-4 border-t border-[#E2E2DD] max-w-xl">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6E6E73] mb-3">
                    Select Your Mandate Lens
                  </p>
                  <div className="grid grid-cols-3 gap-2.5" role="group" aria-label="Select property focus">
                    {HERO_MODES.map((mode, idx) => {
                      const active = heroModeIdx === idx;
                      return (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => setHeroModeIdx(idx)}
                          aria-pressed={active}
                          className={`flex flex-col items-start justify-between px-3.5 py-3 text-left font-mono text-[11px] uppercase tracking-[0.12em] border transition-all cursor-pointer ${
                            active
                              ? 'border-[#0A0A0A] bg-[#0A0A0A] text-white'
                              : 'border-[#E2E2DD] bg-white text-[#57575C] hover:border-[#0A0A0A] hover:text-[#0A0A0A]'
                          }`}
                        >
                          <div className="flex w-full items-center justify-between gap-2 mb-2">
                            <span
                              className={`block h-1 w-6 ${
                                active ? 'bg-[#84C44C]' : 'bg-[#E2E2DD]'
                              }`}
                              aria-hidden="true"
                            />
                            <span className={active ? 'text-[#84C44C]' : 'text-[#6E6E73]'}>
                              {mode.num}
                            </span>
                          </div>
                          <span className="whitespace-nowrap font-semibold">
                            {mode.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Pure 2D Staggered Masonry Architectural Composition */}
              <div className="lg:col-span-6">
                <div className="relative grid grid-cols-12 gap-3 sm:gap-4 items-end">
                  {/* Primary Monumental Architectural Frame (LCP) */}
                  <div className="hero-brick-frame col-span-12 sm:col-span-9 relative overflow-hidden border border-[#D1D1CB] bg-white p-2 shadow-[0_24px_60px_-24px_rgba(10,10,10,0.18)]">
                    <div className="overflow-hidden aspect-[16/11] bg-[#EFECE6]">
                      <img
                        src="/images/hero-architecture.jpg"
                        alt="Contemporary travertine and bronze residential pavilion in Ahmedabad at golden hour"
                        fetchPriority="high"
                        width={1376}
                        height={768}
                        className="hero-main-photo h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between pt-2.5 px-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#57575C]">
                      <span>23.0497° N · 72.5117° E</span>
                      <span className="text-[#4B7F1E]">West Ahmedabad</span>
                    </div>
                  </div>

                  {/* Staggered Offset Architectural Brick Inset (Interactive with Mode Lens) */}
                  <div className="hero-brick-frame col-span-12 sm:col-span-6 sm:col-start-7 sm:-mt-28 z-10 border border-[#0A0A0A] bg-white p-2.5 shadow-xl">
                    <div className="overflow-hidden aspect-[4/3] bg-[#EFECE6]">
                      <img
                        key={currentHeroMode.id}
                        src={currentHeroMode.insetImage}
                        alt={currentHeroMode.insetAlt}
                        width={1200}
                        height={896}
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                    <div className="mt-2.5 flex items-start justify-between gap-3">
                      <p className="text-xs leading-snug text-[#3F3F44]">
                        {currentHeroMode.caption}
                      </p>
                      <span className="mt-0.5 h-2.5 w-2.5 shrink-0 bg-[#84C44C]" aria-hidden="true" />
                    </div>
                  </div>
                </div>

                {/* Bottom Scroll Cue */}
                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={() => scrollToSection('story')}
                    className="group inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#57575C] hover:text-[#0A0A0A] transition-colors cursor-pointer"
                  >
                    <span>Explore Brick by Brick</span>
                    <span className="flex h-9 w-9 items-center justify-center border border-[#D1D1CB] bg-white group-hover:border-[#0A0A0A] transition-colors">
                      <ArrowDown className="h-4 w-4 text-[#4B7F1E]" aria-hidden="true" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 02 — BRAND STORY ("BUILT BRICK BY BRICK" INTERACTIVE STACK)
            ================================================================ */}
        <section
          id="story"
          className="relative bg-white py-24 sm:py-32 lg:min-h-[100svh] lg:flex lg:items-center border-b border-[#E2E2DD]"
        >
          <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
              {/* Left: Editorial Narrative + Interactive 4-Course Brick Stack */}
              <div className="lg:col-span-7">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#4B7F1E]">
                  02 · Built Brick by Brick
                </p>

                <h2 className="mt-5 font-serif text-4xl sm:text-5xl lg:text-[4rem] font-normal leading-[1.04] tracking-tight text-[#0A0A0A]">
                  <span className="block">Real estate is more than a property.</span>
                  <span className="story-headline-accent mt-2 block italic text-[#4B7F1E]">
                    It’s a decision about your future.
                  </span>
                </h2>

                <div className="mt-6 space-y-4 max-w-xl text-base leading-relaxed text-[#3F3F44]">
                  <p>
                    Midtown Property helps individuals, businesses and investors navigate real estate
                    with thoughtful guidance, market knowledge and a trusted network.
                  </p>
                  <p className="text-[#57575C]">
                    We believe the right property is more than a location. It’s an opportunity to
                    grow, live better and build long-term value.
                  </p>
                </div>

                {/* Interactive Masonry Stack (Courses 01 -> 04) */}
                <div className="mt-8 grid gap-2.5 max-w-xl" role="group" aria-label="Four architectural courses of Midtown advisory">
                  {BRICK_LAYERS.map((layer, idx) => {
                    const isBuilt = idx <= activeBrickIdx;
                    const isFocused = idx === activeBrickIdx;
                    return (
                      <button
                        key={layer.course}
                        type="button"
                        onClick={() => setActiveBrickIdx(idx)}
                        aria-expanded={isFocused}
                        className={`text-left border p-4 transition-all cursor-pointer ${
                          isFocused
                            ? 'border-[#0A0A0A] bg-[#0A0A0A] text-white shadow-md'
                            : isBuilt
                              ? 'border-[#84C44C] bg-[#F8F8F6] text-[#0A0A0A]'
                              : 'border-[#E2E2DD] bg-white text-[#57575C] hover:border-[#0A0A0A]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <span
                              className={`font-mono text-[10px] uppercase tracking-[0.16em] ${
                                isFocused ? 'text-[#84C44C]' : 'text-[#4B7F1E]'
                              }`}
                            >
                              {layer.course}
                            </span>
                            <h3 className="mt-0.5 font-serif text-xl sm:text-2xl font-normal">
                              {layer.title}
                            </h3>
                          </div>
                          <span
                            className={`h-3 w-6 shrink-0 transition-colors ${
                              isFocused
                                ? 'bg-[#84C44C]'
                                : isBuilt
                                  ? 'bg-[#4B7F1E]'
                                  : 'bg-[#E2E2DD]'
                            }`}
                            aria-hidden="true"
                          />
                        </div>
                        {isFocused && (
                          <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-white/80">
                            {layer.detail}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Verified Quantitative Anchors */}
                <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-[#E2E2DD] pt-7 max-w-xl">
                  <div className="story-stat-brick">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#6E6E73]">
                      Asset Classes
                    </dt>
                    <dd
                      className="count-metric mt-1 font-serif text-4xl sm:text-5xl text-[#0A0A0A]"
                      data-target="4"
                      data-suffix=""
                    >
                      4
                    </dd>
                  </div>
                  <div className="story-stat-brick">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#6E6E73]">
                      Ahmedabad Zones
                    </dt>
                    <dd
                      className="count-metric mt-1 font-serif text-4xl sm:text-5xl text-[#0A0A0A]"
                      data-target="11"
                      data-suffix="+"
                    >
                      11+
                    </dd>
                  </div>
                  <div className="story-stat-brick">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#6E6E73]">
                      Client Rating
                    </dt>
                    <dd
                      className="count-metric mt-1 font-serif text-4xl sm:text-5xl text-[#4B7F1E]"
                      data-target="5.0"
                      data-decimals="1"
                      data-suffix="★"
                    >
                      5.0★
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Right: Architectural Study Plate */}
              <div className="lg:col-span-5">
                <div className="story-photo-reveal border border-[#E2E2DD] bg-[#F8F8F6] p-3">
                  <div className="overflow-hidden bg-[#EFECE6]">
                    <img
                      src="/images/story-architecture.jpg"
                      alt="Minimalist sunlit concrete and limestone architectural courtyard"
                      loading="lazy"
                      width={896}
                      height={1200}
                      className="scroll-zoom-media aspect-[4/5] w-full object-cover"
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between px-1 pt-1">
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#57575C]">
                      Architectural Discipline
                    </span>
                    <span className="font-serif italic text-base text-[#4B7F1E]">
                      {BRAND_CONTACT.tagline}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 03 — PROPERTY CATEGORIES (RUNNING-BOND COLLECTION)
            ================================================================ */}
        <section id="categories" className="masonry-grid-bg bg-[#F8F8F6] py-24 sm:py-32">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-end mb-14">
              <div className="lg:col-span-7 brick-reveal">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#4B7F1E]">
                  03 · Asset Collections
                </p>
                <h2 className="mt-4 font-serif text-4xl sm:text-6xl font-normal leading-[1.03] tracking-tight text-[#0A0A0A]">
                  Four disciplines of{' '}
                  <span className="italic text-[#4B7F1E]">spatial value.</span>
                </h2>
              </div>
              <div className="lg:col-span-5 brick-reveal">
                <p className="text-base leading-relaxed text-[#57575C]">
                  From private sky residences in Thaltej to institutional industrial infrastructure,
                  explore Midtown’s four curated real estate verticals.
                </p>
              </div>
            </div>

            <div className="grid gap-10 lg:grid-cols-12 lg:items-stretch border-y border-[#E2E2DD] bg-white p-6 sm:p-10">
              {/* Left Interactive Category Bricks */}
              <div className="lg:col-span-5 flex flex-col justify-between divide-y divide-[#E2E2DD]">
                {PROPERTY_CATEGORIES.map((cat, idx) => {
                  const isSelected = activeCategoryIdx === idx;
                  return (
                    <div key={cat.id} className="py-5 first:pt-0 last:pb-0">
                      <button
                        type="button"
                        onClick={() => setActiveCategoryIdx(idx)}
                        onMouseEnter={() => setActiveCategoryIdx(idx)}
                        aria-expanded={isSelected}
                        className="group flex w-full items-start justify-between gap-4 text-left cursor-pointer"
                      >
                        <div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`font-mono text-xs ${
                                isSelected ? 'text-[#4B7F1E] font-semibold' : 'text-[#6E6E73]'
                              }`}
                            >
                              {cat.index}
                            </span>
                            <h3
                              className={`font-serif text-3xl sm:text-4xl transition-colors ${
                                isSelected
                                  ? 'text-[#0A0A0A] italic'
                                  : 'text-[#6E6E73] group-hover:text-[#0A0A0A]'
                              }`}
                            >
                              {cat.title}
                            </h3>
                          </div>
                          <p className="mt-2 pl-7 text-sm leading-relaxed text-[#57575C]">
                            {cat.description}
                          </p>
                        </div>
                        <span
                          className={`mt-2.5 h-2.5 w-5 shrink-0 transition-colors ${
                            isSelected ? 'bg-[#84C44C]' : 'bg-[#E2E2DD]'
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Right Staggered Architectural Collection Frame */}
              <div className="lg:col-span-7 flex flex-col justify-between bg-[#F8F8F6] border border-[#E2E2DD] p-3 sm:p-4">
                <div className="relative overflow-hidden aspect-[16/11] bg-[#EFECE6]">
                  <img
                    key={currentCategory.id}
                    src={currentCategory.image}
                    alt={`${currentCategory.title} architecture — ${currentCategory.subtitle}`}
                    loading="lazy"
                    width={1200}
                    height={896}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                  />
                  <div className="absolute left-4 top-4 bg-[#F8F8F6]/95 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-[#0A0A0A] border border-[#E2E2DD]">
                    <span className="text-[#4B7F1E] font-semibold">{currentCategory.index}</span> ·{' '}
                    {currentCategory.title}
                  </div>
                </div>

                <div className="pt-5 px-2 pb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                  <div>
                    <p className="font-serif text-2xl text-[#0A0A0A]">
                      {currentCategory.subtitle}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {currentCategory.types.map((t) => (
                        <span
                          key={t}
                          className="border border-[#E2E2DD] bg-white px-2.5 py-1 font-mono text-[11px] text-[#3F3F44]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      prefillAndScrollToContact({
                        propertyType: currentCategory.title as InquiryPrefill['propertyType'],
                        interestedIn: 'Buy',
                        message: `I would like to explore ${currentCategory.title} opportunities in Ahmedabad.`,
                      })
                    }
                    className="inline-flex shrink-0 items-center gap-2 bg-[#0A0A0A] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#4B7F1E] transition-colors cursor-pointer"
                  >
                    <span>Explore {currentCategory.title}</span>
                    <ArrowUpRight className="h-4 w-4 text-[#84C44C]" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 04 — FEATURED PROPERTIES (MASONRY SHOWCASE + SHORTLIST)
            ================================================================ */}
        <section id="properties" className="bg-[#0A0A0A] py-24 sm:py-32 text-white">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-12">
              <div className="brick-reveal">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#84C44C]">
                  04 · Curated Portfolio
                </p>
                <h2 className="mt-4 font-serif text-4xl sm:text-6xl font-normal leading-[1.03] tracking-tight text-white">
                  Selected Ahmedabad{' '}
                  <span className="italic text-[#84C44C]">landmarks.</span>
                </h2>
              </div>

              <div
                className="inline-flex border border-white/15 bg-[#121214] p-1 self-start"
                role="group"
                aria-label="Filter featured properties by category"
              >
                {(['All', 'Residential', 'Commercial'] as const).map((tab) => {
                  const active = propertyFilter === tab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setPropertyFilter(tab)}
                      aria-pressed={active}
                      className={`px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors cursor-pointer ${
                        active
                          ? 'bg-white text-[#0A0A0A]'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Primary Monumental Property Showcase */}
            {primaryProperty && (
              <article className="clip-reveal grid gap-8 lg:grid-cols-12 border border-white/15 bg-[#121214] mb-10">
                <div className="relative overflow-hidden lg:col-span-7 min-h-[290px] sm:min-h-[420px]">
                  <img
                    src={primaryProperty.image}
                    alt={`${primaryProperty.name} in ${primaryProperty.location}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                  />
                  {primaryProperty.availability && (
                    <span className="absolute left-5 top-5 bg-[#0A0A0A]/85 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[#84C44C]">
                      {primaryProperty.availability}
                    </span>
                  )}
                </div>

                <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-10">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#84C44C]">
                      Featured {primaryProperty.category} · {primaryProperty.propertyType}
                    </p>
                    <h3 className="mt-3 font-serif text-4xl sm:text-5xl font-normal text-white">
                      {primaryProperty.name}
                    </h3>
                    <p className="mt-2 flex items-center gap-2 text-sm text-white/70">
                      <MapPin className="h-4 w-4 text-[#84C44C]" aria-hidden="true" />
                      {primaryProperty.location}
                    </p>

                    <p className="mt-5 text-sm leading-relaxed text-white/75">
                      {primaryProperty.summary}
                    </p>

                    <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-white/15 py-5 text-sm">
                      <div>
                        <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">
                          Configuration
                        </dt>
                        <dd className="mt-1 text-white">{primaryProperty.configuration}</dd>
                      </div>
                      <div>
                        <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">
                          Area
                        </dt>
                        <dd className="mt-1 text-white">{primaryProperty.area}</dd>
                      </div>
                      {(primaryProperty.price || primaryProperty.priceNote) && (
                        <div className="col-span-2">
                          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">
                            Price Range
                          </dt>
                          <dd className="mt-1 text-lg font-medium text-[#84C44C]">
                            {primaryProperty.price ?? primaryProperty.priceNote}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedProperty(primaryProperty)}
                      className="inline-flex flex-1 items-center justify-between bg-white px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#0A0A0A] hover:bg-[#84C44C] transition-colors cursor-pointer"
                    >
                      <span>Explore Property</span>
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleShortlist(primaryProperty.id)}
                      aria-pressed={shortlistIds.includes(primaryProperty.id)}
                      className={`inline-flex items-center gap-2 border px-4 py-4 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors cursor-pointer ${
                        shortlistIds.includes(primaryProperty.id)
                          ? 'border-[#84C44C] bg-[#84C44C]/15 text-[#84C44C]'
                          : 'border-white/25 text-white/80 hover:border-white'
                      }`}
                    >
                      {shortlistIds.includes(primaryProperty.id) ? (
                        <>
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Saved</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Shortlist</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            )}

            {/* Supporting Aligned Property Showcase Grid */}
            {secondaryProperties.length > 0 && (
              <div className="grid gap-8 md:grid-cols-2">
                {secondaryProperties.map((prop) => {
                  const isSaved = shortlistIds.includes(prop.id);
                  return (
                    <article
                      key={prop.id}
                      className="brick-reveal group flex flex-col justify-between border border-white/15 bg-[#121214] overflow-hidden"
                    >
                      <div>
                        <div className="relative aspect-[16/10] overflow-hidden bg-[#18181b]">
                          <img
                            src={prop.image}
                            alt={`${prop.name} — ${prop.location}`}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                          />
                          {prop.availability && (
                            <span className="absolute left-4 top-4 bg-[#0A0A0A]/85 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#84C44C]">
                              {prop.availability}
                            </span>
                          )}
                          {prop.imageNote && (
                            <span className="absolute bottom-2 left-2 right-2 bg-[#0A0A0A]/80 px-2.5 py-1 text-[10px] text-white/75">
                              {prop.imageNote}
                            </span>
                          )}
                        </div>

                        <div className="p-6 sm:p-8">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#84C44C]">
                                {prop.category} · {prop.propertyType}
                              </p>
                              <h3 className="mt-2 font-serif text-3xl text-white">
                                {prop.name}
                              </h3>
                              <p className="mt-1 text-xs text-white/65">{prop.location}</p>
                            </div>
                            {prop.price && (
                              <span className="font-mono text-xs text-white/90 text-right shrink-0">
                                {prop.price}
                              </span>
                            )}
                          </div>

                          <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-4 text-xs">
                            <div>
                              <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/45">
                                Configuration
                              </dt>
                              <dd className="mt-1 text-white/90">{prop.configuration}</dd>
                            </div>
                            <div>
                              <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/45">
                                Area
                              </dt>
                              <dd className="mt-1 text-white/90">{prop.area}</dd>
                            </div>
                          </dl>
                        </div>
                      </div>

                      <div className="px-6 pb-6 sm:px-8 sm:pb-8 flex gap-2.5">
                        <button
                          type="button"
                          onClick={() => setSelectedProperty(prop)}
                          className="inline-flex flex-1 items-center justify-between border border-white/25 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:border-[#84C44C] hover:text-[#84C44C] transition-colors cursor-pointer"
                        >
                          <span>Explore Property</span>
                          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleShortlist(prop.id)}
                          aria-pressed={isSaved}
                          aria-label={isSaved ? `Remove ${prop.name} from shortlist` : `Add ${prop.name} to shortlist`}
                          className={`inline-flex items-center justify-center border px-3.5 py-3 font-mono text-[11px] uppercase transition-colors cursor-pointer ${
                            isSaved
                              ? 'border-[#84C44C] bg-[#84C44C]/15 text-[#84C44C]'
                              : 'border-white/20 text-white/75 hover:border-white'
                          }`}
                        >
                          {isSaved ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* Interactive Shortlist Bar (Appears once user picks 1+ properties) */}
            {shortlistedNames.length > 0 && (
              <div className="mt-14 border border-[#84C44C]/50 bg-[#141416] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Layers className="mt-0.5 h-5 w-5 text-[#84C44C] shrink-0" aria-hidden="true" />
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#84C44C]">
                      Your Curated Shortlist ({shortlistedNames.length})
                    </p>
                    <p className="mt-1 text-sm text-white/90">
                      {shortlistedNames.join(' · ')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShortlistIds([])}
                    className="px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-white/60 hover:text-white cursor-pointer"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      prefillAndScrollToContact({
                        interestedIn: 'Buy',
                        propertyType: 'Residential',
                        message: `I would like floor plans, availability, and site visit scheduling for my shortlisted properties: ${shortlistedNames.join(', ')}.`,
                      })
                    }
                    className="inline-flex items-center gap-2 bg-[#84C44C] px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#0A0A0A] hover:bg-white transition-colors cursor-pointer"
                  >
                    <span>Request Combined Dossier</span>
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ================================================================
            SECTION 05 — WHY MIDTOWN (INTERACTIVE ARCHITECTURAL COURSES)
            ================================================================ */}
        <section id="why-midtown" className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
              <div className="lg:col-span-5 lg:sticky lg:top-28">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#4B7F1E]">
                  05 · Why Midtown
                </p>
                <h2 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-[3.75rem] font-normal leading-[1.04] tracking-tight text-[#0A0A0A]">
                  The right property.{' '}
                  <span className="italic text-[#4B7F1E]">The right guidance.</span>
                </h2>
                <p className="mt-5 text-base leading-relaxed text-[#57575C]">
                  Every lasting home or commercial asset rests on six disciplined pillars. Select
                  any course to see how we protect your decision.
                </p>

                <div className="clip-reveal mt-8 border border-[#E2E2DD] bg-[#F8F8F6] p-2.5">
                  <img
                    src="/images/why-midtown.jpg"
                    alt="Midtown Property private architectural consultation studio"
                    loading="lazy"
                    width={1200}
                    height={896}
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
              </div>

              <div className="lg:col-span-7 space-y-3">
                {WHY_MIDTOWN_PILLARS.map((pillar, idx) => {
                  const isActive = activePillarIdx === idx;
                  return (
                    <button
                      key={pillar.number}
                      type="button"
                      onClick={() => setActivePillarIdx(idx)}
                      aria-expanded={isActive}
                      className={`brick-reveal w-full text-left border p-6 sm:p-7 transition-all cursor-pointer ${
                        isActive
                          ? 'border-[#0A0A0A] bg-[#F8F8F6] shadow-sm'
                          : 'border-[#E2E2DD] bg-white hover:border-[#0A0A0A]'
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-4">
                        <div className="flex items-baseline gap-4">
                          <span className="font-mono text-xs font-semibold text-[#4B7F1E]">
                            {pillar.number}
                          </span>
                          <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#0A0A0A]">
                            {pillar.title}
                          </h3>
                        </div>
                        <span
                          className={`h-2.5 w-6 shrink-0 transition-colors ${
                            isActive ? 'bg-[#84C44C]' : 'bg-[#E2E2DD]'
                          }`}
                          aria-hidden="true"
                        />
                      </div>
                      <p className="mt-3 pl-8 text-sm sm:text-base leading-relaxed text-[#57575C]">
                        {pillar.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 06 — AHMEDABAD & LOCATIONS
            ================================================================ */}
        <LocationsMapSection
          onSelectLocation={(areaName) =>
            prefillAndScrollToContact({
              interestedIn: 'Buy',
              propertyType: 'Residential',
              message: `I am exploring property opportunities in ${areaName}, Ahmedabad.`,
            })
          }
        />

        {/* ================================================================
            SECTION 07 — INVESTMENT & INTERACTIVE DREAM SPACE PLANNER
            ================================================================ */}
        <section
          id="investment"
          className="relative overflow-hidden bg-[#0A0A0A] py-24 sm:py-32 text-white"
        >
          <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            <img
              src="/images/investment-architecture.jpg"
              alt="Twilight commercial skyline and illuminated executive tower"
              loading="lazy"
              width={1376}
              height={768}
              className="h-full w-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A]/85 to-[#0A0A0A]" />
          </div>

          <div className="relative z-10 mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-end mb-14">
              <div className="lg:col-span-7 brick-reveal">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#84C44C]">
                  07 · Advisory &amp; Dream Space Blueprint
                </p>
                <h2 className="mt-4 font-serif text-4xl sm:text-6xl font-normal leading-[1.03] tracking-tight text-white">
                  Every property has potential.{' '}
                  <span className="italic text-[#84C44C]">Find the right one.</span>
                </h2>
              </div>
              <div className="lg:col-span-5 flex lg:justify-end brick-reveal">
                <button
                  type="button"
                  onClick={() =>
                    prefillAndScrollToContact({
                      interestedIn: currentGoal.interest,
                      propertyType: currentGoal.propertyType,
                      message: `I am planning around "${currentGoal.label}" and would like to discuss opportunities with Midtown Property.`,
                    })
                  }
                  className="inline-flex min-h-[48px] items-center gap-2.5 bg-[#84C44C] px-7 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#0A0A0A] hover:bg-white transition-colors cursor-pointer"
                >
                  <span>Discuss Your Investment</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Interactive Brick-by-Brick Blueprint Selector */}
            <div className="mb-12 border border-white/15 bg-[#121214]/95 p-6 sm:p-8">
              <div className="grid gap-6 xl:grid-cols-12 xl:items-center border-b border-white/15 pb-6">
                <div className="xl:col-span-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#84C44C]">
                    Interactive Advisory Blueprint
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/75">
                    Choose your objective to preview how Midtown structures your acquisition step by step:
                  </p>
                </div>
                <div
                  className="xl:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5"
                  role="group"
                  aria-label="Select advisory objective"
                >
                  {ADVISORY_GOALS.map((goal, idx) => {
                    const active = activeGoalIdx === idx;
                    return (
                      <button
                        key={goal.id}
                        type="button"
                        onClick={() => setActiveGoalIdx(idx)}
                        aria-pressed={active}
                        className={`flex min-h-[46px] items-center justify-center px-3 py-2.5 text-center font-mono text-[11px] uppercase tracking-[0.1em] whitespace-nowrap border transition-colors cursor-pointer ${
                          active
                            ? 'border-[#84C44C] bg-[#84C44C] text-[#0A0A0A] font-semibold'
                            : 'border-white/20 bg-transparent text-white/75 hover:border-white hover:text-white'
                        }`}
                      >
                        {goal.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <ol className="mt-6 grid gap-5 md:grid-cols-3">
                {currentGoal.steps.map((step, idx) => (
                  <li key={step} className="border border-white/10 bg-[#0A0A0A] p-5">
                    <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#84C44C]">
                      Step 0{idx + 1}
                    </span>
                    <p className="mt-2 text-sm leading-relaxed text-white/85">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* 6 Core Advisory Services Grid */}
            <div className="grid gap-px bg-white/15 sm:grid-cols-2 lg:grid-cols-3 border border-white/15">
              {CONSULTATION_SERVICES.map((srv) => (
                <div
                  key={srv.code}
                  className="bg-[#0A0A0A]/94 p-7 sm:p-9 transition-colors hover:bg-[#141416]"
                >
                  <span className="font-mono text-xs text-[#84C44C]">{srv.code}</span>
                  <h3 className="mt-4 font-serif text-2xl sm:text-3xl font-normal text-white">
                    {srv.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/65">{srv.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 08 — GENUINE CLIENT TESTIMONIALS (NO PLAY/PAUSE BUTTON)
            ================================================================ */}
        <section id="testimonials" className="bg-[#F8F8F6] py-24 sm:py-32 border-b border-[#E2E2DD]">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#4B7F1E]">
                  08 · Client Voices
                </p>
                <h2 className="mt-3 font-serif text-4xl sm:text-5xl font-normal text-[#0A0A0A]">
                  Trusted by buyers, tenants &amp; investors.
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setTestimonialIdx(
                      (prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length,
                    )
                  }
                  aria-label="Previous testimonial"
                  className="inline-flex h-11 w-11 items-center justify-center border border-[#D1D1CB] bg-white text-[#0A0A0A] hover:border-[#0A0A0A] cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setTestimonialIdx((prev) => (prev + 1) % TESTIMONIALS.length)
                  }
                  aria-label="Next testimonial"
                  className="inline-flex h-11 w-11 items-center justify-center border border-[#D1D1CB] bg-white text-[#0A0A0A] hover:border-[#0A0A0A] cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="border-y border-[#E2E2DD] bg-white p-7 sm:p-12" aria-live="polite">
              <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
                <div className="lg:col-span-9">
                  <span className="font-mono text-xs text-[#4B7F1E]">
                    0{testimonialIdx + 1} / 0{TESTIMONIALS.length}
                  </span>
                  <blockquote className="mt-5 font-serif text-2xl sm:text-4xl font-normal leading-[1.26] text-[#0A0A0A]">
                    “{currentTestimonial.quote}”
                  </blockquote>
                </div>

                <div className="lg:col-span-3 lg:text-right border-t lg:border-t-0 border-[#E2E2DD] pt-6 lg:pt-0">
                  <p className="text-lg font-semibold text-[#0A0A0A]">
                    {currentTestimonial.name}
                  </p>
                  <p className="mt-1 text-sm text-[#4B7F1E] font-medium">
                    {currentTestimonial.context}
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-[#6E6E73]">
                    {currentTestimonial.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Client Selector Bricks */}
            <div className="mt-4 grid gap-3 sm:grid-cols-3" role="tablist" aria-label="Select client testimonial">
              {TESTIMONIALS.map((item, idx) => {
                const active = testimonialIdx === idx;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setTestimonialIdx(idx)}
                    className={`flex items-center justify-between border px-5 py-4 text-left transition-all cursor-pointer ${
                      active
                        ? 'border-[#0A0A0A] bg-[#0A0A0A] text-white'
                        : 'border-[#E2E2DD] bg-white text-[#3F3F44] hover:border-[#0A0A0A]'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold">{item.name}</p>
                      <p className={`text-xs ${active ? 'text-white/70' : 'text-[#6E6E73]'}`}>
                        {item.context}
                      </p>
                    </div>
                    <span
                      className={`h-2 w-4 ${active ? 'bg-[#84C44C]' : 'bg-[#E2E2DD]'}`}
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 09 — SCROLL-DRIVEN DEVELOPER BRICK WALL (NO PLAY/PAUSE BTN)
            ================================================================ */}
        <section id="partners" className="bg-white py-20 sm:py-24 overflow-hidden">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 mb-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#4B7F1E]">
                  09 · Developer Alliances
                </p>
                <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-normal text-[#0A0A0A]">
                  Partnered with Ahmedabad’s leading builders.
                </h2>
              </div>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#4B7F1E] min-h-[1.25rem]">
                {hoveredPartner ? `Selected Partner: ${hoveredPartner}` : '18 Featured Developer Partners'}
              </p>
            </div>
          </div>

          {/* Running-Bond Brick Wall of Verified Logos Driven by Scroll */}
          <div className="space-y-4 border-y border-[#E2E2DD] bg-[#F8F8F6] py-8 overflow-hidden">
            <div className="partner-row-top flex items-center gap-4 px-4 w-max">
              {partnerRowTop.map((partner) => (
                <div
                  key={partner.slug}
                  onMouseEnter={() => setHoveredPartner(partner.name)}
                  onMouseLeave={() => setHoveredPartner(null)}
                  className="flex h-20 w-44 shrink-0 items-center justify-center border border-[#E2E2DD] bg-white px-4 grayscale opacity-85 transition-all duration-300 hover:border-[#0A0A0A] hover:grayscale-0 hover:opacity-100"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    loading="lazy"
                    className="max-h-12 w-auto object-contain mix-blend-multiply"
                  />
                </div>
              ))}
            </div>

            <div className="partner-row-bottom flex items-center gap-4 px-12 w-max">
              {partnerRowBottom.map((partner) => (
                <div
                  key={partner.slug}
                  onMouseEnter={() => setHoveredPartner(partner.name)}
                  onMouseLeave={() => setHoveredPartner(null)}
                  className="flex h-20 w-44 shrink-0 items-center justify-center border border-[#E2E2DD] bg-white px-4 grayscale opacity-85 transition-all duration-300 hover:border-[#0A0A0A] hover:grayscale-0 hover:opacity-100"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    loading="lazy"
                    className="max-h-12 w-auto object-contain mix-blend-multiply"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 10 — FINAL CTA (WARM LIMESTONE ARCHITECTURAL FRAMING)
            ================================================================ */}
        <section
          id="final-cta"
          className="relative overflow-hidden bg-[#0A0A0A] py-28 sm:py-36 text-white"
        >
          <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            <img
              src="/images/closing-architecture.jpg"
              alt="Sunlit travertine architectural sky-frame courtyard looking toward contemporary towers"
              loading="lazy"
              width={1376}
              height={768}
              className="scroll-zoom-media h-full w-full object-cover opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/65 to-[#0A0A0A]/80" />
          </div>

          <div className="relative z-10 mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#84C44C]">
              10 · {BRAND_CONTACT.tagline}
            </p>
            <h2 className="mx-auto mt-5 max-w-3xl font-serif text-5xl sm:text-6xl lg:text-7xl font-normal leading-[1.02] tracking-tight text-white">
              Your next move <span className="italic text-[#84C44C]">starts here.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-white/80">
              Whether you’re finding a home, expanding your business or exploring your next
              investment, let’s find the opportunity that moves you forward.
            </p>
            <div className="mt-10">
              <button
                type="button"
                onClick={() => scrollToSection('contact')}
                className="inline-flex min-h-[52px] items-center gap-3 bg-white px-8 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#0A0A0A] hover:bg-[#84C44C] transition-colors cursor-pointer"
              >
                <span>Let’s Find Your Property</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 11 — CONTACT & CONSULTATION
            ================================================================ */}
        <ContactSection prefill={inquiryPrefill} />
      </main>

      <Footer
        onNavigate={scrollToSection}
        onOpenLegal={setLegalDoc}
        onSelectCategory={(catTitle) =>
          prefillAndScrollToContact({
            interestedIn: 'Buy',
            propertyType: catTitle as InquiryPrefill['propertyType'],
            message: `I would like to explore ${catTitle} options with Midtown Property.`,
          })
        }
      />

      {/* Native <dialog> Modals */}
      <PropertyDossierModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onInquire={(prop) =>
          prefillAndScrollToContact({
            interestedIn: 'Buy',
            propertyType: prop.category,
            message: `I am interested in ${prop.name} (${prop.location} · ${prop.configuration}). Please share floor plans, availability, and site visit timings.`,
          })
        }
      />

      <LegalModal docType={legalDoc} onClose={() => setLegalDoc(null)} />
    </div>
  );
}

export default App;
