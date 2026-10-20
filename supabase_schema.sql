-- ==============================================================================
-- GeoCanopy: Supabase Database Schema & RLS Policies
-- Copy and run this script in the Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. Create the saved_analyses table
CREATE TABLE IF NOT EXISTS public.saved_analyses (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    mode TEXT DEFAULT 'solar' CHECK (mode IN ('solar', 'greenery')),
    coordinates JSONB NOT NULL,
    center JSONB,
    location_name TEXT,
    area_sq_meters NUMERIC NOT NULL,
    annual_solar_kwh NUMERIC NOT NULL,
    system_capacity_kwp NUMERIC NOT NULL,
    greenery_ratio_pct NUMERIC NOT NULL,
    annual_savings NUMERIC NOT NULL,
    shade_risk TEXT DEFAULT 'Low' CHECK (shade_risk IN ('Low', 'Medium', 'High')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- 2. Create index for performance
CREATE INDEX IF NOT EXISTS idx_saved_analyses_user_id ON public.saved_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_analyses_created_at ON public.saved_analyses(created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.saved_analyses ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies:
-- Allow users (and guests) to view analyses
CREATE POLICY "Allow public read access to analyses"
ON public.saved_analyses
FOR SELECT
USING (true);

-- Allow authenticated users & anon users to save their assessments
CREATE POLICY "Allow insert access to analyses"
ON public.saved_analyses
FOR INSERT
WITH CHECK (true);

-- Allow users to update their own analyses
CREATE POLICY "Allow update access to analyses"
ON public.saved_analyses
FOR UPDATE
USING (auth.uid() = user_id OR user_id IS NULL);

-- Allow users to delete their own analyses
CREATE POLICY "Allow delete access to analyses"
ON public.saved_analyses
FOR DELETE
USING (auth.uid() = user_id OR user_id IS NULL);

-- Confirmation message
COMMENT ON TABLE public.saved_analyses IS 'GeoCanopy rooftop solar PV and urban canopy assessment records';
