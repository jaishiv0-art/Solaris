import React, { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Polygon,
  Polyline,
  CircleMarker,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import {
  Pencil,
  RotateCcw,
  Trash2,
  Check,
  Layers,
  Search,
  MapPin,
  Maximize2,
  Info,
  Compass,
} from 'lucide-react';
import { GeoPoint, AppMode, RooftopPreset } from '../types';
import { ROOFTOP_PRESETS } from '../lib/mockData';
import { calculatePolygonArea, getPolygonCenter } from '../lib/solarCalculations';

interface MapWorkspaceProps {
  mode: AppMode;
  coordinates: GeoPoint[];
  setCoordinates: (coords: GeoPoint[]) => void;
  onPolygonComplete: () => void;
  activePresetId?: string;
  setActivePresetId?: (id: string) => void;
}

// Controller component to handle clicks on the Leaflet map
const MapClickHandler: React.FC<{
  isDrawing: boolean;
  onAddPoint: (point: GeoPoint) => void;
}> = ({ isDrawing, onAddPoint }) => {
  useMapEvents({
    click(e) {
      if (isDrawing) {
        onAddPoint({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });
  return null;
};

// Component to dynamically pan and fly map when location changes
const MapViewUpdater: React.FC<{
  center: GeoPoint;
  zoom: number;
}> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo([center.lat, center.lng], zoom, { duration: 1.5 });
  }, [center.lat, center.lng, zoom, map]);
  return null;
};

export const MapWorkspace: React.FC<MapWorkspaceProps> = ({
  mode,
  coordinates,
  setCoordinates,
  onPolygonComplete,
  activePresetId,
  setActivePresetId,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [mapType, setMapType] = useState<'satellite' | 'streets'>('satellite');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState<GeoPoint>({ lat: 28.6315, lng: 77.2167 });
  const [mapZoom, setMapZoom] = useState(19);

  // Initialize with the first preset (Connaught Place Delhi) if no coords
  useEffect(() => {
    if (coordinates.length === 0) {
      const defaultPreset = ROOFTOP_PRESETS[0];
      setCoordinates(defaultPreset.polygon);
      setMapCenter(defaultPreset.center);
      setMapZoom(defaultPreset.zoom);
    }
  }, []);

  const handleAddPoint = (point: GeoPoint) => {
    setCoordinates([...coordinates, point]);
  };

  const handleUndoPoint = () => {
    if (coordinates.length > 0) {
      setCoordinates(coordinates.slice(0, -1));
    }
  };

  const handleClear = () => {
    setCoordinates([]);
    setIsDrawing(true);
  };

  const handleFinishDrawing = () => {
    setIsDrawing(false);
    onPolygonComplete();
  };

  const handleSelectPreset = (preset: RooftopPreset) => {
    setCoordinates(preset.polygon);
    setMapCenter(preset.center);
    setMapZoom(preset.zoom);
    setIsDrawing(false);
    if (setActivePresetId) {
      setActivePresetId(preset.id);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Fast geocoding simulation for major solar cities
    const query = searchQuery.toLowerCase();
    const cityMap: Record<string, GeoPoint> = {
      'delhi': { lat: 28.6139, lng: 77.2090 },
      'mumbai': { lat: 19.0760, lng: 72.8777 },
      'bengaluru': { lat: 12.9716, lng: 77.5946 },
      'bangalore': { lat: 12.9716, lng: 77.5946 },
      'hyderabad': { lat: 17.3850, lng: 78.4867 },
      'chennai': { lat: 13.0827, lng: 80.2707 },
      'pune': { lat: 18.5204, lng: 73.8567 },
      'jaipur': { lat: 26.9124, lng: 75.7873 },
      'ahmedabad': { lat: 23.0225, lng: 72.5714 },
      'new york': { lat: 40.7128, lng: -74.0060 },
      'london': { lat: 51.5074, lng: -0.1278 },
      'tokyo': { lat: 35.6762, lng: 139.6503 },
      'dubai': { lat: 25.2048, lng: 55.2708 },
    };

    const matchedKey = Object.keys(cityMap).find(key => query.includes(key));
    if (matchedKey) {
      setMapCenter(cityMap[matchedKey]);
      setMapZoom(18);
    } else {
      // Default to general center + slight random offset for test
      setMapCenter({ lat: 28.6139, lng: 77.2090 });
      setMapZoom(18);
    }
  };

  const polygonArea = coordinates.length >= 3 ? calculatePolygonArea(coordinates) : 0;

  return (
    <div className="relative w-full h-full min-h-[calc(100vh-4rem)] flex flex-col bg-slate-900 select-none">
      
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        {/* Left: Search Box & Presets */}
        <div className="flex items-center gap-2 pointer-events-auto flex-wrap">
          <form onSubmit={handleSearch} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search city or address (e.g. Delhi, Mumbai, New York)..."
              className="pl-9 pr-4 py-2 w-64 sm:w-80 text-xs bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-soft focus:ring-2 focus:ring-amber-500 outline-none text-slate-800 transition-all font-medium"
            />
          </form>

          {/* Preset Roof Selector */}
          <div className="hidden lg:flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-slate-200/80 shadow-soft">
            <span className="text-[11px] font-bold text-slate-500 px-2 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-amber-500" /> Presets:
            </span>
            {ROOFTOP_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(p)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-xl transition-all ${
                  activePresetId === p.id
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {p.city}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Layer Switcher & Drawing Toolbar */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Map Layer Switcher */}
          <div className="flex bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-slate-200/80 shadow-soft">
            <button
              onClick={() => setMapType('satellite')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all ${
                mapType === 'satellite'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Satellite
            </button>
            <button
              onClick={() => setMapType('streets')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all ${
                mapType === 'streets'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Streets
            </button>
          </div>

          {/* Drawing Tool Buttons */}
          <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-slate-200/80 shadow-soft">
            {!isDrawing ? (
              <button
                onClick={() => setIsDrawing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-sm transition-all"
              >
                <Pencil className="w-3.5 h-3.5" />
                Draw Roof
              </button>
            ) : (
              <>
                <button
                  onClick={handleFinishDrawing}
                  disabled={coordinates.length < 3}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl shadow-sm transition-all"
                >
                  <Check className="w-3.5 h-3.5" />
                  Done ({coordinates.length} pts)
                </button>
                <button
                  onClick={handleUndoPoint}
                  disabled={coordinates.length === 0}
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 rounded-xl transition-colors"
                  title="Undo point"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </>
            )}

            <button
              onClick={handleClear}
              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              title="Clear Boundary"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Floating Instructions Banner when drawing */}
      {isDrawing && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="bg-slate-900/90 text-white text-xs px-4 py-2 rounded-full shadow-float backdrop-blur-md flex items-center gap-2 border border-slate-700 animate-bounce-subtle">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>Click around the edges of the roof to drop perimeter points. Click "Done" when finished.</span>
          </div>
        </div>
      )}

      {/* Bottom Floating Stats Pill on Map */}
      <div className="absolute bottom-6 left-6 z-20 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-200/80 shadow-float flex items-center gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Selected Roof Area</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-slate-900 font-mono">
                {polygonArea.toLocaleString()}
              </span>
              <span className="text-xs text-slate-600 font-medium">m²</span>
              <span className="text-xs text-slate-600">
                ({Math.round(polygonArea * 10.7639).toLocaleString()} sq ft)
              </span>
            </div>
          </div>
          
          <div className="h-8 w-px bg-slate-200" />

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Active Mode</span>
            <div className="text-xs font-bold flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${mode === 'solar' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
              <span className={mode === 'solar' ? 'text-amber-700' : 'text-emerald-700'}>
                {mode === 'solar' ? 'Rooftop Solar PV' : 'Greenery & NDVI'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Leaflet Map Canvas */}
      <MapContainer
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={mapZoom}
        scrollWheelZoom={true}
        zoomControl={false}
        className="w-full h-full flex-1"
      >
        <MapViewUpdater center={mapCenter} zoom={mapZoom} />

        {/* Tile Provider Layer */}
        {mapType === 'satellite' ? (
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, Maxar, Earthstar Geographics'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={20}
          />
        ) : (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
        )}

        <MapClickHandler isDrawing={isDrawing} onAddPoint={handleAddPoint} />

        {/* Closed Polygon Boundary */}
        {coordinates.length >= 3 && (
          <Polygon
            positions={coordinates.map((c) => [c.lat, c.lng])}
            pathOptions={{
              color: mode === 'solar' ? '#f59e0b' : '#10b981',
              weight: 3,
              fillColor: mode === 'solar' ? '#fbbf24' : '#34d399',
              fillOpacity: 0.35,
              dashArray: isDrawing ? '6, 6' : undefined,
            }}
          />
        )}

        {/* Intermediate line if drawing and < 3 points */}
        {coordinates.length > 1 && coordinates.length < 3 && (
          <Polyline
            positions={coordinates.map((c) => [c.lat, c.lng])}
            pathOptions={{
              color: mode === 'solar' ? '#f59e0b' : '#10b981',
              weight: 2,
              dashArray: '4, 4',
            }}
          />
        )}

        {/* Vertex Markers */}
        {coordinates.map((pt, idx) => (
          <CircleMarker
            key={`pt-${idx}`}
            center={[pt.lat, pt.lng]}
            radius={isDrawing ? 6 : 4}
            pathOptions={{
              color: '#ffffff',
              fillColor: idx === 0 && isDrawing ? '#10b981' : mode === 'solar' ? '#d97706' : '#059669',
              fillOpacity: 1,
              weight: 2,
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
};
