# ☀️ SOLVANTA — Connecting Rural & Urban
> **Autonomous Satellite Rooftop Solar & Urban Greenery Feasibility Engine**  
> *Inspired by Google Project Sunroof & PM Surya Ghar: Muft Bijli Yojana*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-solaris--omega--rosy.vercel.app-amber?style=for-the-badge&logo=vercel)](https://solaris-omega-rosy.vercel.app/)
[![Vite](https://img.shields.io/badge/Built%20With-React%2019%20%2B%20Vite%20%2B%20TypeScript-blue?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Backend-Supabase%20Auth%20%26%20DB-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)

---

## 📖 Table of Contents
1. [Overview](#-overview)
2. [Key Features](#-key-features)
3. [Project Directory Map](#-project-directory-map)
4. [🛠️ Manual Customization Guide (For Developers)](#️-manual-customization-guide-for-developers)
   - [1. How to Change the Logo](#1-how-to-change-the-logo)
   - [2. How to Change the Hero Background Image](#2-how-to-change-the-hero-background-image)
   - [3. How to Change Site Name, Tagline & Contact Details](#3-how-to-change-site-name-tagline--contact-details)
   - [4. How to Change Solar Formulas, Tariffs & Subsidies](#4-how-to-change-solar-formulas-tariffs--subsidies)
   - [5. How to Change Map Coordinates & Default City](#5-how-to-change-map-coordinates--default-city)
   - [6. How to Configure Supabase (Auth & Database)](#6-how-to-configure-supabase-auth--database)
5. [Quick Start (Local Development)](#-quick-start-local-development)
6. [Deploying to Vercel (Git Push)](#-deploying-to-vercel-git-push)
7. [Tech Stack](#-tech-stack)
8. [Author & Credits](#-author--credits)

---

## 🌟 Overview

**Solvanta** (GeoCanopy) is a high-precision, open clean-energy intelligence application designed to bridge rural and urban property owners with rooftop solar energy and urban tree canopy analytics.

Using satellite GIS mapping (Google Hybrid & OpenStreetMap), users can:
- Draw precise perimeter polygons on their real rooftops.
- Instantly compute geodesic planar area in square meters and square feet.
- Calculate rated DC solar capacity (kWp), annual electricity generation (kWh), and financial savings.
- Calculate direct government subsidies under India's official **PM Surya Ghar: Muft Bijli Yojana** (₹30k / ₹60k / ₹78k cap).
- Simulate high-density AI PV panel placement arrays.
- Measure urban vegetation and canopy density index (NDVI).
- Export professional, print-ready PDF assessment reports.
- Save and load rooftop assessments via Supabase.

---

## 🚀 Key Features

- **Interactive Satellite GIS Workspace**: Draw polygons with live sub-meter geodesic accuracy. Features smooth upscaling up to zoom level 22 without "Map data not available" tile crashes.
- **Real-Time Financial & Subsidy Engine**: Computes annual savings based on real DISCOM tariffs and official MNRE PM Surya Ghar subsidy slabs.
- **AI Solar Panel Auto-Layout**: Generates optimal solar array distributions factoring in walkways, parapets, and shadow clearances.
- **Environmental Impact Metrics**: Calculates metric tons of CO2 offset annually and equivalent mature trees planted.
- **One-Click PDF Audit Report**: Generates an official, print-ready feasibility report for DISCOM or vendor submission.
- **Cloud Persistence**: Optional authentication via Supabase allows users to bookmark and retrieve past rooftop audits.

---

## 📂 Project Directory Map

```text
Solaris/
├── public/                           # Static assets served directly at root
│   ├── solaris-logo.jpg              # Primary brand logo
│   ├── solaris-logo.png              # PNG fallback logo / favicon
│   ├── solar_background.avif         # Hero section background image
│   ├── favicon.svg                   # Browser favicon
│   └── icons.svg                     # SVG sprite icons
│
├── src/
│   ├── config/
│   │   └── siteConfig.ts             # ⭐️ Central config: edit text, media, contact, tariffs here!
│   │
│   ├── components/
│   │   ├── Navbar.tsx                # Top navigation header & branding
│   │   ├── Footer.tsx                # Footer with author info, links, and credentials
│   │   ├── MapWorkspace.tsx          # Leaflet satellite canvas & drawing tools
│   │   ├── AnalyticsSidebar.tsx      # Solar metrics, savings, subsidy & shade analysis
│   │   ├── AILayoutModal.tsx         # AI Solar PV array layout simulation
│   │   ├── ReportModal.tsx           # PDF export & printable audit report
│   │   ├── AuthModal.tsx             # Supabase email sign in & sign up modal
│   │   ├── SavedAnalysesDrawer.tsx   # Slide-over drawer of saved rooftop records
│   │   └── VendorQuoteModal.tsx      # Modal for requesting installer quotes
│   │
│   ├── pages/
│   │   ├── LandingPage.tsx           # Public homepage with live ROI calculator & hero
│   │   └── DashboardPage.tsx         # Main estimator dashboard (Map + Sidebar)
│   │
│   ├── lib/
│   │   ├── solarCalculations.ts      # Mathematical formulas (Geodesic area, solar yield, PM Surya Ghar)
│   │   ├── supabaseClient.ts         # Supabase client & database CRUD operations
│   │   └── mockData.ts               # City presets (Delhi, Mumbai, Bengaluru, Jaipur)
│   │
│   ├── types/
│   │   └── index.ts                  # TypeScript interface declarations
│   │
│   ├── App.tsx                       # Root React application component & view router
│   ├── main.tsx                      # Vite React entry point
│   ├── index.css                     # Tailwind CSS & global styling
│   └── App.css                       # Application utility animations
│
├── .env                              # Environment variables (Supabase keys)
├── index.html                        # HTML entry point with metadata & Google Fonts
├── package.json                      # Project dependencies & npm scripts
├── tsconfig.json                     # TypeScript configuration
├── vite.config.ts                    # Vite bundler configuration
└── README.md                         # This file
```

---

## 🛠️ Manual Customization Guide (For Developers)

To make changes easy and avoid digging through complex React code, all common values are centralized in:
👉 `src/config/siteConfig.ts`

### 1. How to Change the Logo
1. Put your new logo image in the `public/` folder (e.g. `public/my-logo.png`).
2. Open `src/config/siteConfig.ts`.
3. Update the `media.logo` line:
   ```typescript
   media: {
     logo: '/my-logo.png', // Your new logo path
     logoPng: '/my-logo.png',
   }
   ```
4. Save the file. The logo will automatically update in the Navbar, Footer, and PDF Reports!

---

### 2. How to Change the Hero Background Image
1. Put your image in the `public/` folder (e.g. `public/my-background.jpg` or `.png` / `.avif`).
2. Open `src/config/siteConfig.ts`.
3. Update `media.heroBackground`:
   ```typescript
   media: {
     heroBackground: '/my-background.jpg',
   }
   ```
4. If you want to adjust the brightness or dark overlay over the image, open `src/pages/LandingPage.tsx` and adjust lines 57-61:
   ```tsx
   {/* Subtle dark tint to keep text ultra-readable */}
   <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/70 to-slate-900/40" />
   ```

---

### 3. How to Change Site Name, Tagline & Contact Details
Open `src/config/siteConfig.ts` and edit:
```typescript
branding: {
  name: 'SOLVANTA',
  subtitle: 'GeoCanopy',
  tagline: 'Connecting Rural & Urban',
  description: 'Your custom description...',
},
developer: {
  name: 'Your Name',
  role: 'Solar Engineer / Full-Stack Developer',
  email: 'yourname@example.com',
  phone: '+91 98765 43210',
  location: 'City, Country',
}
```

---

### 4. How to Change Solar Formulas, Tariffs & Subsidies
Open `src/config/siteConfig.ts`:
- **Change Electricity Tariff Rate**:
  ```typescript
  financials: {
    defaultTariffINR: 8.5,  // Change electricity cost per unit (₹/kWh)
    defaultTariffUSD: 0.20, // Change international USD cost per unit
  }
  ```
- **Change PM Surya Ghar Subsidy Amounts**:
  ```typescript
  pmSuryaGhar: {
    subsidy1KWp: 30000,     // Subsidy for 1 kWp system
    subsidy2KWp: 60000,     // Subsidy for 2 kWp system
    subsidy3KWpPlus: 78000, // Capped subsidy for 3 kWp and above
  }
  ```
- **Change Solar Panel Specs**:
  ```typescript
  solar: {
    usableRoofRatio: 0.72,       // 72% roof usable (28% reserved for parapets/walkways)
    panelWattageWatts: 400,      // 400W panel
    panelCapacityKW: 0.4,        // 0.4 kWp per panel
    panelAreaSqMeters: 2.0,      // 2.0 m² per panel
    performanceRatio: 0.78,      // 78% overall system efficiency
  }
  ```

---

### 5. How to Change Map Coordinates & Default City
- **Default starting point**: Open `src/config/siteConfig.ts`:
  ```typescript
  map: {
    defaultCenter: {
      lat: 28.6139, // Latitude
      lng: 77.2090, // Longitude
    },
    defaultZoom: 16,
  }
  ```
- **City Presets (Delhi, Mumbai, Bengaluru, Jaipur)**:  
  Edit coordinates in `src/lib/mockData.ts` under `ROOFTOP_PRESETS`.

---

### 6. How to Configure Supabase (Auth & Database)
The application connects to Supabase via `.env`:
```env
VITE_SUPABASE_URL=https://pxdpdioqybpuukwbznnz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```
To use your own Supabase project:
1. Create a project at [supabase.com](https://supabase.com).
2. Copy your Project URL & Anon Key into `.env`.
3. In Supabase SQL Editor, run the setup schema (see `src/lib/supabaseClient.ts` comments) to create the `saved_analyses` table.

---

## 💻 Quick Start (Local Development)

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/jaishiv0-art/Solaris.git
cd Solaris
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```
Open your browser and navigate to: `http://localhost:5173/`

### 4. Build for production
```bash
npm run build
```
The optimized bundle will be generated in the `dist/` directory.

---

## 🚀 Deploying to Vercel (Git Push)

Solvanta is connected to Vercel with automatic continuous integration. Whenever you push to the `main` branch, Vercel rebuilds and deploys the website automatically.

### Deploying Your Updates:
```bash
# 1. Check changed files
git status

# 2. Stage all modifications
git add .

# 3. Commit with a clear message
git commit -m "Update logo, background and site configuration"

# 4. Push to GitHub main branch
git push origin main
```
Within 1–2 minutes, your live site at [https://solaris-omega-rosy.vercel.app/](https://solaris-omega-rosy.vercel.app/) will reflect your changes.

> **Note on Browser Cache**: If you update an image with the same name, press `Ctrl + F5` (or `Cmd + Shift + R` on Mac) in your browser to perform a hard reload and bypass cached images.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19 + TypeScript |
| **Build Tool** | Vite 7 |
| **Styling** | Tailwind CSS 3 |
| **Interactive Maps** | Leaflet + React-Leaflet |
| **Satellite Imagery** | Google Satellite Hybrid (lyrs=y) & OpenStreetMap |
| **Icons** | Lucide React |
| **PDF Generation** | jsPDF |
| **Backend & Auth** | Supabase (PostgreSQL + Auth) |
| **Deployment** | Vercel |

---

## 👨‍💻 Author & Credits

- **Developer & Architect**: **Jaishiv Tiwari**
- **Email**: [jaishivtiwari@gmail.com](mailto:jaishivtiwari@gmail.com)
- **Phone**: +91 98765 43210
- **GitHub**: [@jaishiv0-art](https://github.com/jaishiv0-art)
- **Repository**: [https://github.com/jaishiv0-art/Solaris](https://github.com/jaishiv0-art/Solaris)
- **Live URL**: [https://solaris-omega-rosy.vercel.app](https://solaris-omega-rosy.vercel.app)

---

*Open Clean Energy Intelligence • Connecting Rural & Urban • PM Surya Ghar Compatible*
