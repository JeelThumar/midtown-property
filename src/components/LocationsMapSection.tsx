import { useState } from 'react';
import { MapPin, ArrowUpRight, Compass } from 'lucide-react';
import { AHMEDABAD_LOCATIONS, type LocationItem } from '../data/midtownData';

interface LocationsMapSectionProps {
  onSelectLocation: (locationName: string) => void;
}

export function LocationsMapSection({ onSelectLocation }: LocationsMapSectionProps) {
  const [selected, setSelected] = useState<LocationItem>(AHMEDABAD_LOCATIONS[0]);

  return (
    <section
      id="locations"
      className="relative bg-[#F8F8F6] py-24 sm:py-32 border-t border-[#E2E2DD]"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        {/* Editorial Header */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end mb-14">
          <div className="lg:col-span-7 reveal-up">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#4B7F1E]">
              06 · Ahmedabad &amp; Key Corridors
            </p>
            <h2 className="mt-4 font-serif text-4xl sm:text-6xl lg:text-[4.25rem] font-normal leading-[1.03] tracking-tight text-[#0A0A0A]">
              Rooted across West Ahmedabad’s{' '}
              <span className="italic text-[#4B7F1E]">defining corridors.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 reveal-up">
            <p className="text-base leading-relaxed text-[#57575C]">
              From our advisory office on Thaltej–Shilaj Road, we track micro-market supply,
              infrastructure catalysts, and neighbourhood character across eleven high-demand zones.
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-stretch">
          {/* Left: Interactive Location Directory */}
          <div className="lg:col-span-5 flex flex-col justify-between border border-[#E2E2DD] bg-white p-5 sm:p-7">
            <div>
              <div className="flex items-center justify-between border-b border-[#E2E2DD] pb-4 mb-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#6E6E73]">
                  Select Micro-Market (11)
                </span>
                <span className="font-mono text-[11px] text-[#4B7F1E]">
                  23.0497° N, 72.5117° E
                </span>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1.5" role="list">
                {AHMEDABAD_LOCATIONS.map((loc, idx) => {
                  const isActive = selected.id === loc.id;
                  return (
                    <li key={loc.id}>
                      <button
                        type="button"
                        onClick={() => setSelected(loc)}
                        aria-pressed={isActive}
                        className={`group flex w-full items-center justify-between px-3.5 py-2.5 text-left transition-all border ${
                          isActive
                            ? 'border-[#0A0A0A] bg-[#0A0A0A] text-white'
                            : 'border-transparent bg-transparent text-[#0A0A0A] hover:bg-[#F8F8F6] hover:border-[#E2E2DD]'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className={`font-mono text-[11px] ${
                              isActive ? 'text-[#84C44C]' : 'text-[#6E6E73]'
                            }`}
                          >
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <span className="text-sm font-medium tracking-tight">
                            {loc.name}
                          </span>
                        </span>
                        <span
                          className={`h-1.5 w-1.5 rounded-full transition-transform ${
                            isActive
                              ? 'bg-[#84C44C] scale-125'
                              : 'bg-[#D1D1CB] group-hover:bg-[#4B7F1E]'
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mt-6 border-t border-[#E2E2DD] pt-4 flex items-center gap-2 text-xs text-[#6E6E73]">
              <Compass className="h-4 w-4 text-[#4B7F1E]" aria-hidden="true" />
              <span>Ahmedabad &amp; Gandhinagar Metropolitan Region</span>
            </div>
          </div>

          {/* Right: Architectural Schematic Map + Active Area Dossier */}
          <div className="lg:col-span-7 flex flex-col border border-[#E2E2DD] bg-[#0A0A0A] text-white overflow-hidden">
            {/* Minimal Architectural Schematic Map */}
            <div className="relative flex-1 min-h-[340px] sm:min-h-[410px] p-5 sm:p-7">
              <div className="flex items-center justify-between mb-3 relative z-10">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/60">
                  Architectural Corridor Schematic
                </span>
                <span className="inline-flex items-center gap-2 font-mono text-[11px] text-[#84C44C]">
                  <span className="h-2 w-2 rounded-full bg-[#84C44C]" aria-hidden="true" />
                  Midtown HQ · Thaltej
                </span>
              </div>

              {/* Clean architectural grid + SG Highway / SP Ring Road schematic */}
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid meet"
                className="absolute inset-0 h-full w-full pointer-events-none opacity-85"
                aria-hidden="true"
              >
                <defs>
                  <pattern id="archGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path
                      d="M 10 0 L 0 0 0 10"
                      fill="none"
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="0.25"
                    />
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#archGrid)" />
                {/* SP Ring Road arc */}
                <path
                  d="M 14 25 Q 10 62 32 88"
                  fill="none"
                  stroke="rgba(255,255,255,0.16)"
                  strokeWidth="0.45"
                  strokeDasharray="1.5 1.5"
                />
                {/* SG Highway spine */}
                <path
                  d="M 60 8 Q 52 44 48 92"
                  fill="none"
                  stroke="rgba(132,196,76,0.42)"
                  strokeWidth="0.6"
                />
                {/* Sindhubhavan & Thaltej-Shilaj east-west axes */}
                <line
                  x1="15"
                  y1="52"
                  x2="78"
                  y2="54"
                  stroke="rgba(255,255,255,0.16)"
                  strokeWidth="0.35"
                />
                <line
                  x1="22"
                  y1="64"
                  x2="74"
                  y2="63"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="0.35"
                />
              </svg>

              {/* Interactive Corridor Markers */}
              <div className="relative h-[280px] sm:h-[340px] w-full">
                {AHMEDABAD_LOCATIONS.map((loc) => {
                  const isActive = selected.id === loc.id;
                  return (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => setSelected(loc)}
                      style={{
                        left: `${loc.coords.x}%`,
                        top: `${loc.coords.y}%`,
                      }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 group flex items-center gap-1.5 px-2.5 py-1 transition-all cursor-pointer ${
                        isActive
                          ? 'z-20 bg-[#84C44C] text-[#0A0A0A] font-semibold shadow-lg scale-105'
                          : 'z-10 bg-[#141416]/90 text-white/80 border border-white/15 hover:border-[#84C44C] hover:text-white'
                      }`}
                      aria-label={`Select ${loc.name} micro-market`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isActive ? 'bg-[#0A0A0A]' : 'bg-[#84C44C]'
                        }`}
                        aria-hidden="true"
                      />
                      <span className="whitespace-nowrap text-[11px] tracking-wide">
                        {loc.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Location Architectural Detail Bar */}
            <div className="border-t border-white/15 bg-[#121214] p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#84C44C]">
                    {selected.corridor}
                  </p>
                  <h3 className="mt-1.5 font-serif text-3xl font-normal text-white flex items-center gap-2.5">
                    <MapPin className="h-5 w-5 text-[#84C44C] shrink-0" aria-hidden="true" />
                    {selected.name}
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/75">
                    {selected.character}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {selected.focus.map((tag) => (
                      <span
                        key={tag}
                        className="border border-white/15 px-2.5 py-1 font-mono text-[11px] text-white/80"
                      >
                        {tag}
                      </span>
                    ))}
                    {selected.featuredProject && (
                      <span className="border border-[#84C44C]/40 bg-[#84C44C]/10 px-2.5 py-1 font-mono text-[11px] text-[#84C44C]">
                        Featured: {selected.featuredProject}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectLocation(selected.name)}
                  className="inline-flex shrink-0 items-center gap-2 self-start bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#0A0A0A] hover:bg-[#84C44C] transition-colors"
                >
                  <span>Inquire in {selected.name}</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
