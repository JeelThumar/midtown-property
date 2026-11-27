export interface PropertyItem {
  id: string;
  name: string;
  location: string;
  areaKey: string;
  category: 'Residential' | 'Commercial';
  propertyType: string;
  configuration: string;
  area: string;
  price?: string;
  priceNote?: string;
  availability?: string;
  developer?: string;
  possession?: string;
  image: string;
  imageNote?: string;
  featured?: boolean;
  summary: string;
  highlights: string[];
}

export interface CategoryItem {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  types: string[];
}

export interface LocationItem {
  id: string;
  name: string;
  corridor: string;
  character: string;
  focus: string[];
  featuredProject?: string;
  coords: { x: number; y: number };
}

export interface TestimonialItem {
  id: number;
  name: string;
  location: string;
  context: string;
  quote: string;
}

export interface PartnerItem {
  slug: string;
  name: string;
  logo: string;
}

export const BRAND_CONTACT = {
  company: 'Midtown Property',
  tagline: 'Reach beyond with us',
  phoneDisplay: '+91 98798 13402',
  phoneHref: 'tel:+919879813402',
  whatsappHref:
    'https://api.whatsapp.com/send?phone=919879813402&text=Hello!%20I%20would%20like%20to%20connect%20with%20Midtown%20Property.',
  email: 'hthummar17@gmail.com',
  emailHref: 'mailto:hthummar17@gmail.com',
  address:
    '401, Zion Prime, Nr. Copper Stone, Thaltej - Shilaj Road, Thaltej, Ahmedabad, Gujarat - 380059',
  shortAddress: '401, Zion Prime, Thaltej - Shilaj Road, Ahmedabad 380059',
  reraNo: 'AG/GJ/AHMEDABAD/AHMEDABAD CITY/AUDA/AA01657/230826R1',
  socials: {
    facebook: 'https://www.facebook.com/midtown.property',
    linkedin: 'https://www.linkedin.com/in/hiren-patel-541a24106/',
  },
} as const;

export const PROPERTY_CATEGORIES: CategoryItem[] = [
  {
    id: 'residential',
    index: '01',
    title: 'Residential',
    subtitle: 'Private Sanctuaries & Urban Living',
    description:
      'Apartments, bungalows, duplexes, penthouses, row houses and homes crafted for modern living across West Ahmedabad.',
    image: './images/cat-residential.jpg',
    types: ['Apartments', 'Bungalows', 'Duplexes', 'Penthouses', 'Row Houses'],
  },
  {
    id: 'commercial',
    index: '02',
    title: 'Commercial',
    subtitle: 'Workspaces & Retail Frontage',
    description:
      'Office spaces, showrooms, retail shops, business centres and high-visibility commercial investments along key corridors.',
    image: './images/cat-commercial.jpg',
    types: ['Office Spaces', 'Showrooms', 'Retail Shops', 'Business Centres'],
  },
  {
    id: 'land',
    index: '03',
    title: 'Land & Plots',
    subtitle: 'Long-Term Appreciation & Estates',
    description:
      'Agricultural land, NA land, farmhouses, residential plots and commercial plots vetted for clarity and future growth.',
    image: './images/cat-land.jpg',
    types: ['NA Land', 'Agricultural Land', 'Farmhouses', 'Residential & Commercial Plots'],
  },
  {
    id: 'industrial',
    index: '04',
    title: 'Industrial',
    subtitle: 'Logistics & Manufacturing Hubs',
    description:
      'Warehouses, godowns, factories, industrial land and scalable business infrastructure across Gujarat’s industrial belts.',
    image: './images/cat-industrial.jpg',
    types: ['Warehouses', 'Godowns', 'Factories', 'Industrial Land'],
  },
];

export const FEATURED_PROPERTIES: PropertyItem[] = [
  {
    id: 'anantara-abode',
    name: 'Anantara Abode',
    location: 'Science City, Ahmedabad',
    areaKey: 'Science City',
    category: 'Residential',
    propertyType: 'High-Rise Residential',
    configuration: '3 & 4 BHK Apartments & Penthouses',
    area: '2,480 – 3,791+ Sq.Ft',
    price: '₹1.61 Cr – ₹2.50 Cr',
    availability: 'Ready Possession',
    developer: 'A. Shridhar Group',
    possession: 'Ready Possession (Jun 2024)',
    image: './images/prop-anantara-abode.jpg',
    featured: true,
    summary:
      'A signature ready-possession residential landmark near Science Park, Science City, pairing spacious floor plates with understated architectural craft.',
    highlights: [
      'Science Park, Nr. Science City, Ahmedabad',
      'Developed by A. Shridhar Group',
      '3 BHK (~2,480 Sq.Ft), 4 BHK & Penthouse options',
      'Ready Possession verified on Midtown Property',
    ],
  },
  {
    id: 'shompole',
    name: 'Shompole',
    location: 'Thaltej, Ahmedabad',
    areaKey: 'Thaltej',
    category: 'Residential',
    propertyType: 'Flat / Apartment (Sale)',
    configuration: '3 BHK Residence',
    area: '2,406 Sq.Ft Super Built-up (1,563 Sq.Ft Carpet)',
    price: '₹1.90 Cr',
    priceNote: '₹7,896.92 / Sq.Ft',
    availability: 'Active Listing',
    image: './images/prop-shompole-brochure.jpg',
    summary:
      'An active 3 BHK residence in Thaltej offering generous 1,563 Sq.Ft carpet proportions and refined low-rise neighbourhood character.',
    highlights: [
      'Prime Thaltej residential pocket, Ahmedabad',
      '2,406 Sq.Ft Super Built-up · 1,563 Sq.Ft Carpet Area',
      'Listed at ₹1.90 Cr (₹7,896.92 / Sq.Ft)',
      'Active resale / ready opportunity via Midtown',
    ],
  },
  {
    id: 'eminence-96',
    name: 'Eminence 96',
    location: 'Thaltej, Ahmedabad',
    areaKey: 'Thaltej',
    category: 'Residential',
    propertyType: 'High-Rise Residential',
    configuration: '4 & 5 BHK Apartments & Duplexes',
    area: '~3,550 Sq.Ft Super Built-up',
    priceNote: 'Price available on consultation',
    availability: 'RERA Approved Project',
    possession: 'Apr 2025 Schedule',
    image: './images/prop-eminence-96.jpg',
    summary:
      'Expansive 4 and 5 BHK residences and duplexes off Aarayaman Lane in Thaltej, crafted for multi-generational privacy and skyline views.',
    highlights: [
      'Aarayaman Lane, Thaltej, Ahmedabad',
      'Large-format 4 & 5 BHK residences and duplexes',
      'Architectural high-rise elevation with sky decks',
      'Private site visits arranged on request',
    ],
  },
  {
    id: 'super-shaligram',
    name: 'Super Shaligram',
    location: 'Gota, SG Highway, Ahmedabad',
    areaKey: 'Gota',
    category: 'Residential',
    propertyType: 'High-Rise Apartments & Penthouses',
    configuration: '3 & 4 BHK Apartments & Penthouses',
    area: '1,285 – 1,900+ Sq.Ft Carpet',
    price: '₹1.65 Cr – ₹2.10 Cr',
    availability: 'Under Construction',
    possession: 'Dec 2027',
    image: './images/prop-super-shaligram.jpg',
    summary:
      'Contemporary high-rise living along SG Highway in Gota, combining central landscaped courtyards with strong corridor connectivity.',
    highlights: [
      'SG Highway corridor, Gota, Ahmedabad',
      '3 & 4 BHK apartments and sky penthouses',
      'Indicative range ₹1.65 Cr – ₹2.10 Cr',
      'Expected possession December 2027',
    ],
  },
  {
    id: 'the-prospera',
    name: 'The Prospera',
    location: 'Vaishnodevi Circle, SG Highway',
    areaKey: 'Vaishnodevi Circle',
    category: 'Commercial',
    propertyType: 'Commercial Offices, Showrooms & Shops',
    configuration: 'Commercial Office & Retail Units',
    area: '821 – 1,100+ Sq.Ft',
    price: '₹57.47 Lac – ₹90.94 Lac',
    availability: 'Under Construction',
    possession: 'Jul 2028',
    image: './images/prop-prospera.jpg',
    imageNote: 'Representative architectural visual — official project imagery shared on inquiry',
    summary:
      'High-visibility commercial offices, showrooms and retail spaces positioned at Vaishnodevi Circle along the SG Highway growth corridor.',
    highlights: [
      'Vaishnodevi Circle, SG Highway, Ahmedabad',
      'Offices, showrooms & retail formats (821 – 1,100+ Sq.Ft)',
      'Indicative range ₹57.47 Lac – ₹90.94 Lac',
      'Expected possession July 2028',
    ],
  },
];

export const WHY_MIDTOWN_PILLARS = [
  {
    number: '01',
    title: 'Client-First Guidance',
    description:
      'Every mandate begins with your timeline, lifestyle, and capital goals—never a push toward off-fit inventory.',
  },
  {
    number: '02',
    title: 'Local Real Estate Expertise',
    description:
      'Rooted on Thaltej–Shilaj Road with granular street-level insight across West Ahmedabad, SG Highway, and Gandhinagar corridors.',
  },
  {
    number: '03',
    title: 'Trusted Developer Network',
    description:
      'Direct relationships with Ahmedabad’s most respected builders give clients clear access, verified documentation, and priority walkthroughs.',
  },
  {
    number: '04',
    title: 'Transparent Dealings',
    description:
      'RERA-registered advisory built on clear carpet-to-super-built-up comparisons, clean title diligence, and straightforward communication.',
  },
  {
    number: '05',
    title: 'Investment-Focused Advice',
    description:
      'From pre-launch commercial yields to long-horizon NA land parcels, we evaluate appreciation drivers and liquidity before you commit.',
  },
  {
    number: '06',
    title: 'Personalized Property Solutions',
    description:
      'Whether acquiring a 4 BHK family residence, leasing a 3,000 Sq.Ft corporate office, or structuring industrial space, every search is bespoke.',
  },
];

export const AHMEDABAD_LOCATIONS: LocationItem[] = [
  {
    id: 'thaltej',
    name: 'Thaltej',
    corridor: 'West Ahmedabad Core · Midtown HQ',
    character: 'Established luxury residential lanes, boutique low-rise apartments, and corporate offices.',
    focus: ['3–5 BHK Residences', 'Corporate Offices', 'Midtown HQ'],
    featuredProject: 'Shompole & Eminence 96',
    coords: { x: 46, y: 54 },
  },
  {
    id: 'shilaj',
    name: 'Shilaj',
    corridor: 'Thaltej–Shilaj Extension',
    character: 'Low-density villa pockets, serene green avenues, and contemporary residential enclaves.',
    focus: ['Luxury Residences', 'Villas & Bungalows', 'Plotted Estates'],
    featuredProject: 'Thaltej–Shilaj Corridor',
    coords: { x: 26, y: 50 },
  },
  {
    id: 'sg-highway',
    name: 'SG Highway',
    corridor: 'Primary Commercial Spine',
    character: 'Ahmedabad’s premier north-south business corridor connecting Grade-A towers and showrooms.',
    focus: ['Grade-A Offices', 'Showrooms', 'High-Rise Living'],
    featuredProject: 'Super Shaligram & The Prospera',
    coords: { x: 54, y: 42 },
  },
  {
    id: 'vaishnodevi',
    name: 'Vaishnodevi Circle',
    corridor: 'North SG Highway Gateway',
    character: 'Rapidly expanding commercial and residential gateway linking Ahmedabad and Gandhinagar.',
    focus: ['Commercial Showrooms', 'Retail & Offices', '3 BHK Homes'],
    featuredProject: 'The Prospera & Zion Nest',
    coords: { x: 58, y: 18 },
  },
  {
    id: 'jagatpur',
    name: 'Jagatpur',
    corridor: 'North-West Growth Belt',
    character: 'Integrated residential townships with strong highway access and family infrastructure.',
    focus: ['Residential Apartments', 'Integrated Living'],
    coords: { x: 48, y: 27 },
  },
  {
    id: 'gota',
    name: 'Gota',
    corridor: 'SG Highway North',
    character: 'High-momentum residential skyline offering spacious modern apartments and penthouses.',
    focus: ['3 & 4 BHK High-Rise', 'Penthouses'],
    featuredProject: 'Super Shaligram',
    coords: { x: 50, y: 34 },
  },
  {
    id: 'science-city',
    name: 'Science City',
    corridor: 'Science Park & Sola',
    character: 'Upscale residential precinct prized for wide roads, green cover, and landmark high-rises.',
    focus: ['Luxury 3 & 4 BHK', 'Penthouses', 'Ready Possession'],
    featuredProject: 'Anantara Abode',
    coords: { x: 38, y: 43 },
  },
  {
    id: 'sindhubhavan',
    name: 'Sindhubhavan Road',
    corridor: 'SBR Lifestyle & Commercial Strip',
    character: 'Ahmedabad’s most coveted address for flagship retail, fine hospitality, and ultra-luxury homes.',
    focus: ['Flagship Retail', 'Premium Residences', 'Boutique Offices'],
    coords: { x: 39, y: 63 },
  },
  {
    id: 'bodakdev',
    name: 'Bodakdev',
    corridor: 'Central West Precinct',
    character: 'Mature, tree-lined elite neighbourhood combining legacy bungalows with executive towers.',
    focus: ['Prime Apartments', 'Executive Offices', 'Bungalows'],
    coords: { x: 50, y: 66 },
  },
  {
    id: 'bopal',
    name: 'Bopal',
    corridor: 'SP Ring Road West',
    character: 'Well-established residential community along Sardar Patel Ring Road with balanced livability.',
    focus: ['Family Residences', 'Retail Frontage'],
    coords: { x: 24, y: 70 },
  },
  {
    id: 'south-bopal',
    name: 'South Bopal',
    corridor: 'South-West Urban Corridor',
    character: 'Contemporary residential and commercial high-street district with strong rental demand.',
    focus: ['Modern Apartments', 'Commercial Shops'],
    coords: { x: 28, y: 82 },
  },
];

export const CONSULTATION_SERVICES = [
  {
    code: '01',
    title: 'Property Selection',
    detail: 'Curated shortlists tailored to orientation, floor plate efficiency, builder pedigree, and neighbourhood fit.',
  },
  {
    code: '02',
    title: 'Investment Opportunities',
    detail: 'Early-stage and ready-yield opportunities across West Ahmedabad, SG Highway, and Gandhinagar corridors.',
  },
  {
    code: '03',
    title: 'Commercial Property Consulting',
    detail: 'Strategic advisory for corporate offices, high-street showrooms, and Grade-A business centres.',
  },
  {
    code: '04',
    title: 'Buying & Selling',
    detail: 'End-to-end mandate execution with transparent market benchmarking and streamlined documentation.',
  },
  {
    code: '05',
    title: 'Corporate & Retail Leasing',
    detail: 'Turnkey bare-shell and fully furnished workspace leasing matched to operational timelines.',
  },
  {
    code: '06',
    title: 'Land & Development Opportunities',
    detail: 'NA land, agricultural parcels, industrial tracts, and joint-development evaluation across Gujarat.',
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 4,
    name: 'Suresh Patel',
    location: 'Ahmedabad',
    context: 'Property Buyer & Investor',
    quote:
      'Midtown Property is best for customer as well as investor. I purchased property through Midtown and they cooperated with me, suggested the best location, and offered complete support. If I purchase another property, I will give first priority to Midtown Property.',
  },
  {
    id: 5,
    name: 'Ankit Parekh',
    location: 'Ahmedabad',
    context: '3,000 Sq.Ft Office Lease',
    quote:
      'Had a great experience with Midtown Property while leasing our 3,000 sq.ft fully furnished office space. The entire journey, from property search to deal closure, was smooth and professional. Their support, transparency, and market expertise made the process hassle-free. Highly recommended!',
  },
  {
    id: 6,
    name: 'Bhavesh Shah',
    location: 'Iconic Road, Ahmedabad',
    context: '4 BHK Home Buyer · Shaligram Super',
    quote:
      'We recently purchased our dream 4 BHK home at Shaligram Super, Iconic Road through Midtown Property. The entire process was smooth, transparent, and professionally handled. Special thanks to the team for helping us find the perfect home.',
  },
];

export const DEVELOPER_PARTNERS: PartnerItem[] = [
  { slug: 'a-shridhar', name: 'A. Shridhar Group', logo: './partners/a-shridhar.png' },
  { slug: 'shivalik', name: 'Shivalik Group', logo: './partners/shivalik.png' },
  { slug: 'b-safal', name: 'B Safal', logo: './partners/b-safal.png' },
  { slug: 'gala-infra', name: 'Gala Infrastructure', logo: './partners/gala-infra.png' },
  { slug: 'sobha', name: 'SOBHA Limited', logo: './partners/sobha.png' },
  { slug: 'sheetal', name: 'Sheetal Infrastructure', logo: './partners/sheetal.png' },
  { slug: 'shaligram', name: 'Shaligram Group', logo: './partners/shaligram.png' },
  { slug: 'navratna', name: 'Navratna Group', logo: './partners/navratna.png' },
  { slug: 'savvy', name: 'Savvy Infrastructures', logo: './partners/savvy.png' },
  { slug: 'rajyash', name: 'Rajyash Group', logo: './partners/rajyash.png' },
  { slug: 'ganesh', name: 'Ganesh Housing Corporation', logo: './partners/ganesh.png' },
  { slug: 'sun-builders', name: 'Sun Builders', logo: './partners/sun-builders.png' },
  { slug: 'bakeri', name: 'Bakeri Group', logo: './partners/bakeri.png' },
  { slug: 'shilp', name: 'Shilp Group', logo: './partners/shilp.png' },
  { slug: 'venus', name: 'Venus Infrastructure', logo: './partners/venus.png' },
  { slug: 'vishwanath', name: 'Vishwanath Builders', logo: './partners/vishwanath.png' },
  { slug: 'hn-safal', name: 'HN Safal', logo: './partners/hn-safal.png' },
  { slug: 'ratnaakar', name: 'Ratnaakar Group', logo: './partners/ratnaakar.png' },
];
