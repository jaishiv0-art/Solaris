import React, { useState, useEffect, useRef } from 'react';
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
  Crosshair,
  Loader2,
  Navigation,
  Compass,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { GeoPoint, AppMode, RooftopPreset } from '../types';
import { ROOFTOP_PRESETS } from '../lib/mockData';
import { calculatePolygonArea } from '../lib/solarCalculations';

interface MapWorkspaceProps {
  mode: AppMode;
  coordinates: GeoPoint[];
  setCoordinates: (coords: GeoPoint[]) => void;
  onPolygonComplete: () => void;
  activePresetId?: string;
  setActivePresetId?: (id: string) => void;
}

interface GeocodingResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
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
  const [mapType, setMapType] = useState<'satellite' | 'streets' | 'hybrid'>('satellite');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [showResultsDropdown, setShowResultsDropdown] = useState(false);
  const [locationName, setLocationName] = useState('Connaught Place, New Delhi');

  const [mapCenter, setMapCenter] = useState<GeoPoint>({ lat: 28.6315, lng: 77.2167 });
  const [mapZoom, setMapZoom] = useState(19);
  const searchTimeoutRef = useRef<any>(null);

  // Initialize with the first preset (Connaught Place Delhi) if no coords
  useEffect(() => {
    if (coordinates.length === 0) {
      const defaultPreset = ROOFTOP_PRESETS[0];
      setCoordinates(defaultPreset.polygon);
      setMapCenter(defaultPreset.center);
      setMapZoom(defaultPreset.zoom);
      setLocationName(defaultPreset.name);
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
    setLocationName(preset.name);
    setIsDrawing(false);
    if (setActivePresetId) {
      setActivePresetId(preset.id);
    }
  };

  // Real Geocoding Search using OpenStreetMap Nominatim API
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (text.trim().length < 3) {
      setSearchResults([]);
      setShowResultsDropdown(false);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            text
          )}&limit=5&addressdetails=1`,
          {
            headers: {
              'Accept-Language': 'en',
            },
          }
        );
        const data = await res.json();
        setSearchResults(data || []);
        setShowResultsDropdown(true);
      } catch (err) {
        console.warn('Geocoding error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 400);
  };

  const handleSelectLocation = (result: GeocodingResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    setMapCenter({ lat, lng });
    setMapZoom(19);
    setLocationName(result.display_name.split(',')[0]);
    setShowResultsDropdown(false);
    setSearchQuery('');
    // Clear old polygon and enable drawing so user can immediately click their roof
    setCoordinates([]);
    setIsDrawing(true);
  };

  // Browser GPS Locate Me
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setMapCenter({ lat, lng });
        setMapZoom(19);
        setLocationName('Your Current GPS Location');
        setIsLocating(false);
        // Start drawing mode
        setCoordinates([]);
        setIsDrawing(true);
      },
      (err) => {
        setIsLocating(false);
        alert('Could not retrieve your location: ' + err.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const polygonArea = coordinates.length >= 3 ? calculatePolygonArea(coordinates) : 0;

  return (
    <div className="relative w-full h-full min-h-[calc(100vh-4rem)] flex flex-col bg-slate-900 select-none">
      
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        {/* Left: Real Address Geocoder & GPS button */}
        <div className="flex items-center gap-2 pointer-events-auto flex-wrap relative">
          <div className="relative">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) setShowResultsDropdown(true);
                }}
                placeholder="Search any real address, city, building, or pin code..."
                className="pl-9 pr-8 py-2 w-72 sm:w-96 text-xs bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-soft focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 font-medium transition-all"
              />
              {isSearching && (
                <Loader2 className="w-4 h-4 text-amber-500 animate-spin absolute right-3" />
              )}
            </div>

            {/* Live Autocomplete Results Dropdown */}
            {showResultsDropdown && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-30 max-h-60 overflow-y-auto">
                {searchResults.map((item) => (
                  <div
                    key={item.place_id}
                    onClick={() => handleSelectLocation(item)}
                    className="p-3 hover:bg-amber-50 cursor-pointer border-b border-slate-100 last:border-b-0 text-xs flex items-start gap-2.5 transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700 leading-snug line-clamp-2">
                      {item.display_name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* GPS "Locate My Roof" Button */}
          <button
            onClick={handleLocateMe}
            disabled={isLocating}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-white/95 backdrop-blur-md hover:bg-slate-100 text-slate-800 rounded-2xl border border-slate-200/90 shadow-soft transition-all"
            title="Fly to your real current GPS location"
          >
            {isLocating ? (
              <Loader2 className="w-3.5 h-3.5 text-amber-500 animate-spin" />
            ) : (
              <Crosshair className="w-3.5 h-3.5 text-amber-600" />
            )}
            <span className="hidden sm:inline">Locate Me</span>
          </button>

          {/* Preset Rooftops Dropdown */}
          <div className="hidden xl:flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-slate-200/90 shadow-soft">
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

        {/* Right: Map Layers & Drawing Actions */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Tile Layer Switcher */}
          <div className="flex bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-slate-200/90 shadow-soft">
            <button
              onClick={() => setMapType('satellite')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all ${
                mapType === 'satellite'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              High-Res Satellite
            </button>
            <button
              onClick={() => setMapType('streets')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all ${
                mapType === 'streets'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Street Map
            </button>
          </div>

          {/* Drawing Tool Actions */}
          <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-slate-200/90 shadow-soft">
            {!isDrawing ? (
              <button
                onClick={() => setIsDrawing(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-sm transition-all"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Draw Roof Area</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleFinishDrawing}
                  disabled={coordinates.length < 3}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl shadow-sm transition-all"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Done ({coordinates.length} pts)</span>
                </button>
                <button
                  onClick={handleUndoPoint}
                  disabled={coordinates.length === 0}
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 rounded-xl transition-colors"
                  title="Undo last point"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </>
            )}

            <button
              onClick={handleClear}
              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              title="Clear Boundary and Redraw"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Floating Drawing Instructions Banner */}
      {isDrawing && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="bg-slate-900/95 text-white text-xs px-5 py-2.5 rounded-full shadow-float backdrop-blur-md flex items-center gap-2.5 border border-amber-500/40">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span className="font-semibold">
              Click the 4 corners of your roof on the satellite map. Click "Done" when closed.
            </span>
          </div>
        </div>
      )}

      {/* Bottom Floating Stats Pill */}
      <div className="absolute bottom-6 left-6 z-20 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-200/90 shadow-float flex items-center gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Live Measured Area
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-slate-900 font-mono">
                {polygonArea.toLocaleString()}
              </span>
              <span className="text-xs text-amber-600 font-bold">m²</span>
              <span className="text-xs text-slate-500 font-medium ml-1">
                ({Math.round(polygonArea * 10.7639).toLocaleString()} sq ft)
              </span>
            </div>
          </div>
          
          <div className="h-8 w-px bg-slate-200" />

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Active Focus
            </span>
            <div className="text-xs font-bold text-slate-800 truncate max-w-[160px]">
              {locationName}
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

        {/* Real High-Resolution Tile Providers */}
        {mapType === 'satellite' ? (
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com/">Esri</a> &mdash; DigitalGlobe, GeoEye, Earthstar Geographics'
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

        {/* Closed Polygon Boundary with Area fill */}
        {coordinates.length >= 3 && (
          <Polygon
            positions={coordinates.map((c) => [c.lat, c.lng])}
            pathOptions={{
              color: mode === 'solar' ? '#f59e0b' : '#10b981',
              weight: 3,
              fillColor: mode === 'solar' ? '#fbbf24' : '#34d399',
              fillOpacity: 0.4,
              dashArray: isDrawing ? '6, 6' : undefined,
            }}
          />
        )}

        {/* Intermediate line if drawing with < 3 points */}
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
