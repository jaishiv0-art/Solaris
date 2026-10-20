export type AppMode = 'solar' | 'greenery';

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface AnalysisCalculation {
  areaSqMeters: number;
  areaSqFt: number;
  usableRoofRatio: number; // e.g. 0.75 (taking into account parapets, access paths)
  usableAreaSqMeters: number;
  panelCount: number; // Standard 400W panels (2m x 1m = 2m²)
  systemCapacityKWp: number; // kWp
  annualSolarGenerationKWh: number; // kWh/year
  estimatedAnnualSavings: number; // in USD or INR
  currency: 'INR' | 'USD';
  currencySymbol: string;
  co2OffsetTonsPerYear: number;
  treesEquivalent: number;
  ndviScore: number; // 0.0 to 1.0
  greeneryRatioPercent: number; // %
  canopyDensityLevel: 'Sparse' | 'Moderate' | 'Dense' | 'Optimal Urban Forest';
  shadeRisk: 'Low' | 'Medium' | 'High';
  shadeFactor: number; // e.g. 0.05 to 0.35
  shadeCauses: string[];
}

export interface SolarVendor {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviewsCount: number;
  verified: boolean;
  warrantyYears: number;
  pricePerKWp: number; // Cost per kW
  estimatedInstallationDays: number;
  supportedSchemes: string[];
  contactEmail: string;
  contactPhone: string;
}

export interface SubsidyScheme {
  id: string;
  title: string;
  authority: string;
  maxSubsidyAmount: number;
  percentageCovered: number;
  eligibilityNotes: string;
  badge: string;
}

export interface SavedAnalysis {
  id: string;
  title: string;
  created_at: string;
  user_id?: string;
  mode: AppMode;
  coordinates: GeoPoint[];
  center: GeoPoint;
  locationName: string;
  areaSqMeters: number;
  annualSolarGenerationKWh: number;
  systemCapacityKWp: number;
  greeneryRatioPercent: number;
  annualSavings: number;
  shadeRisk: 'Low' | 'Medium' | 'High';
}

export interface RooftopPreset {
  id: string;
  name: string;
  city: string;
  country: string;
  center: GeoPoint;
  zoom: number;
  polygon: GeoPoint[];
  description: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  isGuest?: boolean;
}
