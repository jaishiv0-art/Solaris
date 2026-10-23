/**
 * ============================================================================
 * SOLVANTA / GEOCANOPY - CENTRAL CONFIGURATION FILE
 * ============================================================================
 * 
 * Edit this file to customize text, branding, contact info, images, default 
 * locations, and solar math across the entire application without touching 
 * complex React code.
 * 
 * Everything here is typed with TypeScript for autocompletion and safety.
 * ============================================================================
 */

export const siteConfig = {
  // --------------------------------------------------------------------------
  // 1. BRANDING & IDENTITY
  // --------------------------------------------------------------------------
  branding: {
    name: 'SOLVANTA',
    nameHighlightedPart: 'O', // The letter highlighted in amber: S[O]LVANTA
    subtitle: 'GeoCanopy',
    tagline: 'Connecting Rural & Urban',
    subTagline: 'Precision Satellite Rooftop Solar & Urban Greenery Estimator',
    description:
      'Empowering homeowners, commercial building managers, and urban planners to unlock clean rooftop solar energy and quantify urban greenery canopy with precision satellite intelligence.',
    inspiration: 'Inspired by Google Project Sunroof & PM Surya Ghar Muft Bijli Yojana',
  },

  // --------------------------------------------------------------------------
  // 2. MEDIA & ASSET PATHS (Files located in the /public folder)
  // --------------------------------------------------------------------------
  media: {
    // Brand Logo: place your logo image in the "public" folder
    logo: '/solaris-logo.jpg',
    logoPng: '/solaris-logo.png',
    
    // Hero Section Background Image:
    // Change this to your desired image path in the "public" folder
    heroBackground: '/solar_background.avif',

    // Interactive Estimator Card Background Image:
    cardBackground: '/solarsetting.avif',
  },

  // --------------------------------------------------------------------------
  // 3. DEVELOPER & CONTACT INFORMATION (Shown in Footer & Reports)
  // --------------------------------------------------------------------------
  developer: {
    name: 'Jaishiv Tiwari',
    role: 'Lead Full-Stack Architect',
    email: 'jaishivtiwari@gmail.com',
    phone: '+91 98765 43210',
    location: 'New Delhi / Remote, Global',
    github: 'https://github.com/jaishiv0-art/Solvanta',
    liveUrl: 'https://solaris-omega-rosy.vercel.app',
  },

  // --------------------------------------------------------------------------
  // 4. MAP & SATELLITE DEFAULTS
  // --------------------------------------------------------------------------
  map: {
    // Default initial location when user opens the app (e.g. New Delhi, India)
    defaultCenter: {
      lat: 28.6139,
      lng: 77.2090,
    },
    defaultZoom: 16,
    minZoom: 3,
    maxZoom: 22,
    // Maximum zoom level available natively on satellite servers before digital zooming
    maxNativeZoom: 18,
    // Google Satellite Hybrid tile layer (Photographic + Streets/Labels)
    googleSatelliteUrl: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    osmUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  },

  // --------------------------------------------------------------------------
  // 5. SOLAR PV TECHNICAL ASSUMPTIONS & FORMULAS
  // --------------------------------------------------------------------------
  solar: {
    // Usable roof ratio (e.g. 0.72 = 72% usable, 28% reserved for parapets, walkways, shadow buffers)
    usableRoofRatio: 0.72,

    // Standard Tier-1 Monocrystalline PERC solar panel
    panelWattageWatts: 400, // 400W panel
    panelCapacityKW: 0.4,   // 0.4 kWp per panel
    panelAreaSqMeters: 2.0, // Standard size: ~1.95m x 1.0m = ~2.0 m²

    // System Performance Ratio (PR): thermal loss, inverter efficiency, cabling = ~78%
    performanceRatio: 0.78,

    // Peak Sun Hours (PSH) baseline for tropical regions
    defaultPeakSunHours: 5.0,

    // Environmental offsets:
    // kg of CO2 displaced per kWh of clean solar electricity generated
    co2PerKWhKg: 0.82,
    // Equivalent mature trees required to absorb 1 metric ton of CO2 per year
    treesPerTonCO2: 45,
  },

  // --------------------------------------------------------------------------
  // 6. FINANCIALS, ELECTRICITY TARIFFS & GOVT SUBSIDIES
  // --------------------------------------------------------------------------
  financials: {
    // Default electricity tariff rates
    defaultTariffINR: 8.2,  // ₹ per kWh (India)
    defaultTariffUSD: 0.18, // $ per kWh (International)
    
    // System installation cost estimate per kWp (before subsidy)
    costPerKWpINR: 55000,

    // Official PM Surya Ghar: Muft Bijli Yojana Central Financial Assistance (CFA)
    pmSuryaGhar: {
      schemeName: 'PM Surya Ghar: Muft Bijli Yojana',
      subsidy1KWp: 30000,   // ₹30,000 for 1 kWp system
      subsidy2KWp: 60000,   // ₹60,000 for 2 kWp system
      subsidy3KWpPlus: 78000, // ₹78,000 maximum capped subsidy for 3 kWp and above
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
