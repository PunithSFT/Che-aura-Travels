// app/customize-tour/InteractiveMap.js
'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function InteractiveMap({ attractions = [], setActivePlace }) {
  const [customMarkerIcon, setCustomMarkerIcon] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Safely configure custom Leaflet icon after browser mount
    import('leaflet').then((L) => {
      delete L.Icon.Default.prototype._getIconUrl;
      const icon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [28, 44],
        iconAnchor: [14, 44],
        popupAnchor: [1, -40],
        shadowSize: [44, 44],
        className: 'transition-transform duration-300 hover:scale-110 cursor-pointer',
      });
      setCustomMarkerIcon(icon);
    });
  }, []);

  // CRITICAL FIX: Return a loading placeholder until the client mounts.
  // This guarantees MapContainer and TileLayer won't attempt DOM appendChild operations prematurely.
  if (!isClient) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-sm font-medium">
        Loading Map...
      </div>
    );
  }

  return (
    <MapContainer 
      center={[7.8731, 80.7718]} 
      zoom={8} 
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />

      {attractions.map((place) => (
        <Marker
          key={place.id}
          position={[place.lat, place.lng]}
          icon={customMarkerIcon || undefined}
          eventHandlers={{
            click: () => setActivePlace && setActivePlace(place),
          }}
        >
          <Popup closeButton={false}>
            <div className="p-1 font-medium text-xs text-slate-800">
              {place.name}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}