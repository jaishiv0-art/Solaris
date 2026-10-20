import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SavedAnalysis, UserProfile } from '../types';

const STORAGE_KEY_CUSTOM_URL = 'geocanopy_custom_supabase_url';
const STORAGE_KEY_CUSTOM_KEY = 'geocanopy_custom_supabase_key';

// Check environment variables first, then localStorage override
function getActiveCredentials() {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const storedUrl = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_CUSTOM_URL) || '' : '';
  const storedKey = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_CUSTOM_KEY) || '' : '';

  const activeUrl = storedUrl || envUrl;
  const activeKey = storedKey || envKey;

  const isConfigured = Boolean(
    activeUrl &&
    activeKey &&
    activeUrl.startsWith('https://') &&
    !activeUrl.includes('your-project-id')
  );

  return { activeUrl, activeKey, isConfigured };
}

let activeCredentials = getActiveCredentials();

export function isSupabaseConnected(): boolean {
  return activeCredentials.isConfigured;
}

export const isSupabaseConfigured = isSupabaseConnected;

export function getSupabaseCredentials() {
  return {
    url: activeCredentials.activeUrl,
    anonKey: activeCredentials.activeKey,
    isConfigured: activeCredentials.isConfigured,
  };
}

export let supabase: SupabaseClient | null = activeCredentials.isConfigured
  ? createClient(activeCredentials.activeUrl, activeCredentials.activeKey)
  : null;

/**
 * Allows dynamic runtime configuration of Supabase credentials from the UI
 */
export async function updateSupabaseCredentials(url: string, anonKey: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const trimmedUrl = url.trim();
    const trimmedKey = anonKey.trim();

    if (!trimmedUrl.startsWith('https://')) {
      return { success: false, error: 'Supabase URL must start with https://' };
    }
    if (!trimmedKey) {
      return { success: false, error: 'Supabase Anon Key is required' };
    }

    const testClient = createClient(trimmedUrl, trimmedKey);
    // Simple ping to verify credentials
    const { error } = await testClient.from('saved_analyses').select('id').limit(1);
    
    // Note: if the table doesn't exist yet, error code is PGRST204 or 42P01, but connection itself succeeded
    if (error && error.message.includes('JWT') || (error && error.message.includes('API key'))) {
      return { success: false, error: 'Invalid API key or project credentials' };
    }

    localStorage.setItem(STORAGE_KEY_CUSTOM_URL, trimmedUrl);
    localStorage.setItem(STORAGE_KEY_CUSTOM_KEY, trimmedKey);

    activeCredentials = {
      activeUrl: trimmedUrl,
      activeKey: trimmedKey,
      isConfigured: true,
    };
    supabase = testClient;

    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to connect to Supabase' };
  }
}

export function clearSupabaseCredentials() {
  localStorage.removeItem(STORAGE_KEY_CUSTOM_URL);
  localStorage.removeItem(STORAGE_KEY_CUSTOM_KEY);
  activeCredentials = getActiveCredentials();
  supabase = activeCredentials.isConfigured
    ? createClient(activeCredentials.activeUrl, activeCredentials.activeKey)
    : null;
}

// Local mock storage keys
const MOCK_USER_STORAGE_KEY = 'geocanopy_user_session';
const MOCK_ANALYSES_STORAGE_KEY = 'geocanopy_saved_analyses';

// Auth helpers
export async function getCurrentUser(): Promise<UserProfile | null> {
  if (isSupabaseConnected() && supabase) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        return {
          id: session.user.id,
          email: session.user.email || 'user@example.com',
          fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          isGuest: false,
        };
      }
    } catch (e) {
      console.warn('Supabase getSession error, falling back to local session:', e);
    }
  }

  // Fallback to local session
  const stored = localStorage.getItem(MOCK_USER_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }

  // Default guest session
  const guestUser: UserProfile = {
    id: 'guest-session-001',
    email: 'guest.explorer@geocanopy.org',
    fullName: 'Guest Eco Explorer',
    isGuest: true,
  };
  localStorage.setItem(MOCK_USER_STORAGE_KEY, JSON.stringify(guestUser));
  return guestUser;
}

export async function signInWithGoogle(): Promise<{ error: string | null }> {
  if (isSupabaseConnected() && supabase) {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Google OAuth failed' };
    }
  }
  return { error: 'Supabase credentials are not connected yet.' };
}

export async function loginWithEmail(email: string, password: string): Promise<{ user: UserProfile | null; error: string | null }> {
  if (isSupabaseConnected() && supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) {
        const user: UserProfile = {
          id: data.user.id,
          email: data.user.email || email,
          fullName: data.user.user_metadata?.full_name || email.split('@')[0],
          isGuest: false,
        };
        localStorage.setItem(MOCK_USER_STORAGE_KEY, JSON.stringify(user));
        return { user, error: null };
      }
    } catch (err: any) {
      return { user: null, error: err.message || 'Authentication failed' };
    }
  }

  // Mock / Demo authentication
  if (password.length < 6) {
    return { user: null, error: 'Password must be at least 6 characters' };
  }

  const user: UserProfile = {
    id: 'usr_' + Math.random().toString(36).substring(2, 9),
    email,
    fullName: email.split('@')[0].replace('.', ' '),
    isGuest: false,
  };
  localStorage.setItem(MOCK_USER_STORAGE_KEY, JSON.stringify(user));
  return { user, error: null };
}

export async function signupWithEmail(email: string, password: string, fullName: string): Promise<{ user: UserProfile | null; error: string | null }> {
  if (isSupabaseConnected() && supabase) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });
      if (error) throw error;
      if (data.user) {
        const user: UserProfile = {
          id: data.user.id,
          email: data.user.email || email,
          fullName: fullName || email.split('@')[0],
          isGuest: false,
        };
        localStorage.setItem(MOCK_USER_STORAGE_KEY, JSON.stringify(user));
        return { user, error: null };
      }
    } catch (err: any) {
      return { user: null, error: err.message || 'Registration failed' };
    }
  }

  // Mock signup
  if (password.length < 6) {
    return { user: null, error: 'Password must be at least 6 characters' };
  }

  const user: UserProfile = {
    id: 'usr_' + Math.random().toString(36).substring(2, 9),
    email,
    fullName: fullName || email.split('@')[0],
    isGuest: false,
  };
  localStorage.setItem(MOCK_USER_STORAGE_KEY, JSON.stringify(user));
  return { user, error: null };
}

export async function logoutUser(): Promise<void> {
  if (isSupabaseConnected() && supabase) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase logout error:', e);
    }
  }
  localStorage.removeItem(MOCK_USER_STORAGE_KEY);
}

// Database: Saved Analyses
export async function saveAnalysisRecord(analysis: SavedAnalysis): Promise<{ success: boolean; error: string | null }> {
  // If Supabase configured, attempt insert
  if (isSupabaseConnected() && supabase) {
    try {
      const { error } = await supabase
        .from('saved_analyses')
        .insert([{
          id: analysis.id,
          title: analysis.title,
          user_id: analysis.user_id,
          mode: analysis.mode,
          coordinates: analysis.coordinates,
          center: analysis.center,
          location_name: analysis.locationName,
          area_sq_meters: analysis.areaSqMeters,
          annual_solar_kwh: analysis.annualSolarGenerationKWh,
          system_capacity_kwp: analysis.systemCapacityKWp,
          greenery_ratio_pct: analysis.greeneryRatioPercent,
          annual_savings: analysis.annualSavings,
          shade_risk: analysis.shadeRisk,
          created_at: analysis.created_at
        }]);

      if (error) {
        console.warn('Supabase DB save error (table might need migration):', error.message);
      }
    } catch (err: any) {
      console.warn('Supabase save error, persisting locally as well:', err.message);
    }
  }

  // Always persist locally for instant responsiveness & offline viewing
  try {
    const existing = getLocalSavedAnalyses();
    const updated = [analysis, ...existing.filter(item => item.id !== analysis.id)];
    localStorage.setItem(MOCK_ANALYSES_STORAGE_KEY, JSON.stringify(updated));
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save analysis' };
  }
}

export function getLocalSavedAnalyses(): SavedAnalysis[] {
  try {
    const data = localStorage.getItem(MOCK_ANALYSES_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function fetchUserAnalyses(): Promise<SavedAnalysis[]> {
  if (isSupabaseConnected() && supabase) {
    try {
      const { data, error } = await supabase
        .from('saved_analyses')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          id: item.id,
          title: item.title,
          created_at: item.created_at,
          user_id: item.user_id,
          mode: item.mode,
          coordinates: item.coordinates,
          center: item.center,
          locationName: item.location_name,
          areaSqMeters: item.area_sq_meters,
          annualSolarGenerationKWh: item.annual_solar_kwh,
          systemCapacityKWp: item.system_capacity_kwp,
          greeneryRatioPercent: item.greenery_ratio_pct,
          annualSavings: item.annual_savings,
          shadeRisk: item.shade_risk,
        }));
      }
    } catch (e) {
      console.warn('Supabase fetch error, using local fallback:', e);
    }
  }

  return getLocalSavedAnalyses();
}

export async function deleteSavedAnalysis(id: string): Promise<boolean> {
  if (isSupabaseConnected() && supabase) {
    try {
      await supabase.from('saved_analyses').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete error:', e);
    }
  }

  const existing = getLocalSavedAnalyses();
  const updated = existing.filter(a => a.id !== id);
  localStorage.setItem(MOCK_ANALYSES_STORAGE_KEY, JSON.stringify(updated));
  return true;
}
