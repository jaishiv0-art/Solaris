import React, { useState, useEffect } from 'react';
import { X, Database, CheckCircle2, AlertCircle, Key, Globe, Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import { getSupabaseCredentials, updateSupabaseCredentials, clearSupabaseCredentials, isSupabaseConnected } from '../lib/supabaseClient';

interface SupabaseConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectionChange: () => void;
}

export const SupabaseConnectModal: React.FC<SupabaseConnectModalProps> = ({
  isOpen,
  onClose,
  onConnectionChange,
}) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeTab, setActiveTab] = useState<'connect' | 'sql'>('connect');

  useEffect(() => {
    if (isOpen) {
      const creds = getSupabaseCredentials();
      setUrl(creds.url);
      setAnonKey(creds.anonKey);
      setStatus(creds.isConfigured ? 'success' : 'idle');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('testing');
    setErrorMsg(null);

    const res = await updateSupabaseCredentials(url, anonKey);
    if (res.success) {
      setStatus('success');
      onConnectionChange();
    } else {
      setStatus('error');
      setErrorMsg(res.error || 'Failed to connect');
    }
  };

  const handleDisconnect = () => {
    clearSupabaseCredentials();
    setUrl('');
    setAnonKey('');
    setStatus('idle');
    onConnectionChange();
  };

  const sqlSchemaText = `-- Copy & paste into Supabase SQL Editor:
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

ALTER TABLE public.saved_analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read" ON public.saved_analyses FOR SELECT USING (true);
CREATE POLICY "Public Insert" ON public.saved_analyses FOR INSERT WITH CHECK (true);
CREATE POLICY "Owner Delete" ON public.saved_analyses FOR DELETE USING (auth.uid() = user_id OR user_id IS NULL);`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(sqlSchemaText);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-inner">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Supabase Cloud Connection</h3>
                {isSupabaseConnected() && (
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    Live Connected
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Connect your real database to persist rooftop assessments and sync auth.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 px-6 pt-3 gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('connect')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'connect'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Connection Keys
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'sql'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            SQL Table Migration Schema
            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 rounded">Ready</span>
          </button>
        </div>

        {/* Tab 1: Connection Form */}
        {activeTab === 'connect' && (
          <form onSubmit={handleConnect} className="p-6 space-y-4">
            {status === 'success' && (
              <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <strong>Connected to Supabase!</strong> Your analyses are being saved to cloud tables.
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700">Supabase Project URL</label>
                <a
                  href="https://supabase.com/dashboard/project/_/settings/api"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-amber-600 hover:underline flex items-center gap-1 font-medium"
                >
                  Find in Supabase Dashboard <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Supabase Anon (Public) Key
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={anonKey}
                  onChange={(e) => setAnonKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                You can also permanently place these in a <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-mono">.env</code> file.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={status === 'testing'}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {status === 'testing' ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Connect & Verify Connection</span>
                  </>
                )}
              </button>

              {isSupabaseConnected() && (
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 transition-colors"
                >
                  Disconnect
                </button>
              )}
            </div>
          </form>
        )}

        {/* Tab 2: SQL Migration */}
        {activeTab === 'sql' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-600">
                Run this in your <strong>Supabase SQL Editor</strong> to create the <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">saved_analyses</code> table:
              </p>
              <button
                onClick={copySqlToClipboard}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL Script'}</span>
              </button>
            </div>

            <pre className="p-4 bg-slate-900 text-slate-200 text-[11px] font-mono rounded-2xl overflow-x-auto max-h-56 leading-relaxed border border-slate-800">
              {sqlSchemaText}
            </pre>
          </div>
        )}

        <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
