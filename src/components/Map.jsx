import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
});

// District coordinates
const DISTRICTS = {
  KALIKOT: [29.2097, 81.6177],
  JHAPA: [26.5455, 87.8942],
  KAILALI: [28.6862, 80.9823]
};

// Component to handle map updates
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

// Component to handle location selection
const LocationMarker = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      onLocationSelect('pickup', [e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

const Map = ({ 
  height = '400px', 
  center = [28.3949, 84.1240], // Center of Nepal
  zoom = 7,
  markers = [],
  onLocationSelect = null,
  className = ''
}) => {
  return (
    <div style={{ height }} className={className}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
      >
        <ChangeView center={center} zoom={zoom} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* District Markers */}
        <Marker position={DISTRICTS.KALIKOT}>
          <Popup>
            <div className="font-semibold">Kalikot District Office</div>
            <div className="text-sm text-gray-600">Coordinates: {DISTRICTS.KALIKOT[0]}, {DISTRICTS.KALIKOT[1]}</div>
          </Popup>
        </Marker>
        <Marker position={DISTRICTS.JHAPA}>
          <Popup>
            <div className="font-semibold">Jhapa District Office</div>
            <div className="text-sm text-gray-600">Coordinates: {DISTRICTS.JHAPA[0]}, {DISTRICTS.JHAPA[1]}</div>
          </Popup>
        </Marker>
        <Marker position={DISTRICTS.KAILALI}>
          <Popup>
            <div className="font-semibold">Kailali District Office</div>
            <div className="text-sm text-gray-600">Coordinates: {DISTRICTS.KAILALI[0]}, {DISTRICTS.KAILALI[1]}</div>
          </Popup>
        </Marker>

        {/* Custom markers passed as props */}
        {markers.map((marker, index) => (
          <Marker key={index} position={marker.position}>
            <Popup>
              <div className="font-semibold">{marker.title}</div>
              <div className="text-sm text-gray-600">{marker.description}</div>
            </Popup>
          </Marker>
        ))}

        {onLocationSelect && <LocationMarker onLocationSelect={onLocationSelect} />}
      </MapContainer>
    </div>
  );
};

export default Map; 