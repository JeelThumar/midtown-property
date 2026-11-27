import { useEffect, useRef, useState } from 'react';
import { Menu, X, ArrowUpRight, Phone } from 'lucide-react';
import { BRAND_CONTACT } from '../data/midtownData';

const NAV_LINKS = [
  { id: 'hero', label: 'Home' },
  { id: 'story', label: 'About' },
  { id: 'categories', label: 'Services' },
  { id: 'properties', label: 'Properties' },
  { id: 'locations', label: 'Locations' },
] as const;

interface NavbarProps {
  onNavigate: (id: string) => void;
}

export function Navbar({ onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const drawerRef = useRef<HTMLDialogElement | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const sheetRef = useRef<HTMLElement | null>(null);
  const openBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = ['hero', 'story', 'categories', 'properties', 'why-midtown', 'locations', 'investment', 'contact'];
    const mapToNav = (id: string) => {
      if (id === 'why-midtown') return 'story';
      if (id === 'investment') return 'categories';
      return id;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(mapToNav(entry.target.id));
          }
        }
      },
      { rootMargin: '-38% 0px -50% 0px', threshold: 0 },
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const drawer = drawerRef.current;
    const scroller = scrollerRef.current;
    const sheet = sheetRef.current;
    if (!drawer || !scroller || !sheet) return;

    const visibleThreshold = 1 / Math.max(window.innerWidth, 320);

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (!drawer.open) return;
        if (entry.intersectionRatio < visibleThreshold) {
          drawer.close();
          setDrawerOpen(false);
        } else if (entry.intersectionRatio >= 0.99) {
          setDrawerOpen(true);
        }
      },
      { root: drawer, threshold: [visibleThreshold, 0.99] },
    );
    observer.observe(sheet);

    let cleanBackdropFallback: (() => void) | undefined;
    if (!CSS.supports('animation-timeline: scroll()')) {
      const onScrollerScroll = () => {
        const closedWidth = scroller.offsetWidth - sheet.offsetWidth;
        const ratio = closedWidth > 0 ? Math.min(1, Math.max(0, scroller.scrollLeft / closedWidth)) : 0;
        drawer.style.setProperty('--drawer-backdrop', String(ratio));
      };
      scroller.addEventListener('scroll', onScrollerScroll, { passive: true });
      cleanBackdropFallback = () => scroller.removeEventListener('scroll', onScrollerScroll);
    }

    const onCancel = (e: Event) => {
      if (e.cancelable) {
        e.preventDefault();
        closeDrawer();
      }
    };
    drawer.addEventListener('cancel', onCancel);

    return () => {
      observer.disconnect();
      drawer.removeEventListener('cancel', onCancel);
      cleanBackdropFallback?.();
    };
  }, []);

  const openDrawer = async () => {
    const drawer = drawerRef.current;
    const scroller = scrollerRef.current;
    if (!drawer || !scroller) return;

    drawer.showModal();
    setDrawerOpen(true);

    if (!CSS.supports('scroll-initial-target', 'nearest')) {
      scroller.scrollTo({ left: 0, behavior: 'instant' as ScrollBehavior });
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      );
    }
    scroller.scrollTo({ left: scroller.scrollWidth, behavior: 'auto' });
  };

  const closeDrawer = () => {
    const scroller = scrollerRef.current;
    const drawer = drawerRef.current;
    if (!scroller || !drawer) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      drawer.close();
      setDrawerOpen(false);
      return;
    }
    scroller.scrollTo({ left: 0, behavior: 'auto' });
  };

  const handleLinkClick = (id: string) => {
    if (drawerRef.current?.open) {
      drawerRef.current.close();
      setDrawerOpen(false);
    }
    onNavigate(id);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#F8F8F6]/95 backdrop-blur-md border-b border-[#E2E2DD] py-2.5 shadow-[0_8px_30px_-22px_rgba(10,10,10,0.22)]'
            : 'bg-[#F8F8F6]/90 backdrop-blur-sm border-b border-[#E2E2DD]/80 py-3'
        }`}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center gap-4 px-5 sm:px-8 lg:px-12">
          {/* Left Column: Background-Free Logo */}
          <div className="flex items-center justify-self-start">
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('hero');
              }}
              className="inline-flex items-center shrink-0 transition-opacity hover:opacity-85"
              aria-label="Midtown Property — Return to top"
            >
              <img
                src="/images/midtown-logo.png"
                alt="Midtown Property — Reach beyond with us"
                width={180}
                height={89}
                className="h-10 sm:h-11 w-auto object-contain"
              />
            </a>
          </div>

          {/* Center Column: Dead-Center Flush Architectural Nav Rail */}
          <nav
            aria-label="Primary"
            className="hidden lg:flex items-center justify-self-center border border-[#E2E2DD] bg-white"
          >
            <ul className="flex items-center divide-x divide-[#E2E2DD]">
              {NAV_LINKS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick(item.id);
                      }}
                      className={`relative flex h-10 items-center justify-center px-5 text-[12px] font-medium uppercase tracking-[0.14em] whitespace-nowrap transition-colors ${
                        isActive
                          ? 'bg-[#0A0A0A] text-white'
                          : 'text-[#57575C] hover:text-[#0A0A0A] hover:bg-[#F8F8F6]'
                      }`}
                    >
                      <span>{item.label}</span>
                      <span
                        aria-hidden="true"
                        className={`absolute inset-x-0 bottom-0 h-[2px] bg-[#84C44C] transition-transform duration-300 ${
                          isActive ? 'scale-x-100' : 'scale-x-0'
                        }`}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right Column: Uniform 40px Height Phone + CTA */}
          <div className="flex items-center justify-end justify-self-end gap-2.5">
            <a
              href={BRAND_CONTACT.phoneHref}
              className="hidden xl:inline-flex h-10 items-center gap-2 border border-[#E2E2DD] bg-white px-4 text-xs font-mono tracking-wider text-[#3F3F44] whitespace-nowrap hover:border-[#0A0A0A] hover:text-[#0A0A0A] transition-colors"
            >
              <span className="h-2 w-2 rounded-full bg-[#84C44C]" aria-hidden="true" />
              <Phone className="h-3.5 w-3.5 text-[#4B7F1E]" aria-hidden="true" />
              <span>{BRAND_CONTACT.phoneDisplay}</span>
            </a>

            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('contact');
              }}
              className="hidden sm:inline-flex h-10 items-center gap-2 bg-[#0A0A0A] px-5 text-xs font-semibold uppercase tracking-[0.14em] text-white whitespace-nowrap hover:bg-[#4B7F1E] transition-colors"
            >
              <span>Let’s Talk</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-[#84C44C]" aria-hidden="true" />
            </a>

            <button
              ref={openBtnRef}
              id="drawer-open"
              type="button"
              onClick={openDrawer}
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
              aria-controls="mobile-nav-drawer"
              className="inline-flex h-10 w-10 items-center justify-center border border-[#D1D1CB] bg-white text-[#0A0A0A] lg:hidden hover:border-[#0A0A0A] transition-colors"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Native <dialog> Swipeable Navigation Drawer */}
      <dialog
        ref={drawerRef}
        id="mobile-nav-drawer"
        className="Drawer"
        aria-label="Mobile navigation drawer"
        onClick={(e) => {
          if (sheetRef.current && !sheetRef.current.contains(e.target as Node)) {
            closeDrawer();
          }
        }}
      >
        <div ref={scrollerRef} className="Drawer-scroller">
          <nav ref={sheetRef} className="Drawer-sheet p-7" aria-label="Mobile">
            <div className="flex items-center justify-between border-b border-[#E2E2DD] pb-5">
              <img
                src="/images/midtown-logo.png"
                alt="Midtown Property"
                width={150}
                height={74}
                className="h-9 w-auto object-contain"
              />
              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Close navigation menu"
                autoFocus
                className="inline-flex h-11 w-11 items-center justify-center border border-[#D1D1CB] bg-white text-[#0A0A0A] hover:border-[#0A0A0A]"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <ul className="my-8 flex flex-col divide-y divide-[#E2E2DD] border-y border-[#E2E2DD]">
              {NAV_LINKS.map((item, idx) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(item.id);
                    }}
                    className="flex items-baseline justify-between py-4 text-2xl font-serif text-[#0A0A0A] hover:text-[#4B7F1E] transition-colors"
                  >
                    <span>{item.label}</span>
                    <span className="font-mono text-xs text-[#6E6E73]">
                      0{idx + 1}
                    </span>
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick('contact');
                  }}
                  className="flex items-baseline justify-between py-4 text-2xl font-serif text-[#4B7F1E]"
                >
                  <span>Contact</span>
                  <span className="font-mono text-xs text-[#4B7F1E]">06</span>
                </a>
              </li>
            </ul>

            <div className="mt-auto space-y-4 border-t border-[#E2E2DD] pt-5 text-xs text-[#57575C]">
              <p className="font-mono uppercase tracking-[0.16em] text-[#4B7F1E]">
                {BRAND_CONTACT.tagline}
              </p>
              <a
                href={BRAND_CONTACT.phoneHref}
                className="block text-sm font-semibold text-[#0A0A0A]"
              >
                {BRAND_CONTACT.phoneDisplay}
              </a>
              <p className="leading-relaxed">{BRAND_CONTACT.shortAddress}</p>
            </div>
          </nav>
        </div>
      </dialog>
    </>
  );
}
