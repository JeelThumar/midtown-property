# Midtown Property — Website Redesign

Single-page architectural real estate website for **Midtown Property**, an Ahmedabad-based real estate consultancy and brokerage (*"Reach beyond with us"*).

## Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Motion & Scroll**: GSAP + ScrollTrigger, Lenis smooth scroll, CSS Scroll-Driven Animations
- **Icons**: Lucide React

## Key Features & Sections

- **Architectural Light Theme**: Built around the transparent Midtown Property logo (`#0A0A0A`, `#F8F8F6`, `#EFECE6`, and logo green `#84C44C` / `#4B7F1E`) with a subtle drafting masonry grid.
- **01 · Hero**: Split architectural 2D photography composition with an interactive Mandate Lens switcher (`Living`, `Business`, `Land`).
- **02 · Brand Story**: Pinned desktop storytelling and interactive 4-course *"Built Brick by Brick"* progression.
- **03 · Asset Collections**: Interactive showcase across Residential, Commercial, Land & Plots, and Industrial categories.
- **04 · Featured Properties**: Filterable Ahmedabad portfolio (`Anantara Abode`, `Shompole`, `Eminence 96`, `Super Shaligram`, `The Prospera`), native `<dialog>` property dossiers, and a multi-property Shortlist builder.
- **05 · Why Midtown**: Six interactive advisory pillars paired with studio photography.
- **06 · Ahmedabad & Locations**: Interactive schematic corridor map covering 11 key West Ahmedabad & SG Highway micro-markets.
- **07 · Investment & Advisory Blueprint**: Interactive goal selector with step-by-step acquisition breakdown and six core services.
- **08 · Client Voices**: Verified testimonials with accessible manual navigation controls.
- **09 · Developer Alliances**: Scroll-driven dual-row showcase of 18 Ahmedabad developer partner logos.
- **10–11 · Consultation & Footer**: Validated inquiry form (`:user-invalid` + ARIA live announcements + WhatsApp/Email dispatch), RERA registration details, and Privacy Policy / Terms `<dialog>` modals.

## Project Structure

```text
├── public/
│   ├── images/          # Brand logo & architectural photography
│   └── partners/        # Developer partner logos
├── src/
│   ├── components/
│   │   ├── ContactSection.tsx
│   │   ├── Footer.tsx
│   │   ├── LegalModal.tsx
│   │   ├── LocationsMapSection.tsx
│   │   ├── Navbar.tsx
│   │   └── PropertyDossierModal.tsx
│   ├── data/
│   │   └── midtownData.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
└── vite.config.ts
```

## Local Development

```sh
npm install
npm run dev
```

## Production Build

```sh
npm run build
npm run preview
```
