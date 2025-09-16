// 🤖 AI-Generated Map Component
// 🗺️ 基於 React-Leaflet 的互動式地圖組件

import React, { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import { LatLngExpression, Icon, DivIcon } from 'leaflet'
import 'leaflet/dist/leaflet.css'

// 🎯 Types
import { Coordinates, MapMarker, MapPolyline } from '@/types'

interface MapComponentProps {
  center: Coordinates
  zoom: number
  markers: MapMarker[]
  polylines: MapPolyline[]
  onMapClick?: (coordinates: Coordinates) => void
  onMarkerClick?: (marker: MapMarker) => void
  className?: string
}

// 🎨 Custom Icons
const createCustomIcon = (type: MapMarker['type'], emoji: string = '📍') => {
  const colors = {
    origin: '#22c55e',
    destination: '#ef4444',
    station: '#3b82f6',
    stop: '#f59e0b',
  }

  return new DivIcon({
    html: `
      <div style="
        background: ${colors[type] || '#6b7280'};
        color: white;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        font-size: 14px;
      ">
        ${type === 'origin' ? '起' : type === 'destination' ? '終' : emoji}
      </div>
    `,
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  })
}

// 🎯 Map Event Handler Component
const MapEventHandler: React.FC<{
  onMapClick?: (coordinates: Coordinates) => void
}> = ({ onMapClick }) => {
  const map = useMap()

  useEffect(() => {
    if (!onMapClick) return

    const handleClick = (e: any) => {
      onMapClick({
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      })
    }

    map.on('click', handleClick)
    return () => {
      map.off('click', handleClick)
    }
  }, [map, onMapClick])

  return null
}

// 🎯 Map View Controller Component
const MapViewController: React.FC<{
  center: Coordinates
  zoom: number
}> = ({ center, zoom }) => {
  const map = useMap()

  useEffect(() => {
    map.setView([center.latitude, center.longitude], zoom)
  }, [map, center, zoom])

  return null
}

const MapComponent: React.FC<MapComponentProps> = ({
  center,
  zoom,
  markers,
  polylines,
  onMapClick,
  onMarkerClick,
  className = '',
}) => {
  const mapRef = useRef<any>(null)

  // 🎯 Convert coordinates for Leaflet
  const leafletCenter: LatLngExpression = [center.latitude, center.longitude]

  // 🎯 Handle marker click
  const handleMarkerClick = (marker: MapMarker) => {
    if (onMarkerClick) {
      onMarkerClick(marker)
    }
  }

  return (
    <div className={`map-container ${className}`}>
      <MapContainer
        ref={mapRef}
        center={leafletCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        touchZoom={true}
        dragging={true}
        className="leaflet-container"
      >
        {/* 🗺️ Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={18}
          minZoom={3}
        />

        {/* 🎯 Map Event Handler */}
        <MapEventHandler onMapClick={onMapClick} />

        {/* 🎯 Map View Controller */}
        <MapViewController center={center} zoom={zoom} />

        {/* 📍 Markers */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.position.latitude, marker.position.longitude]}
            icon={createCustomIcon(marker.type, marker.icon)}
            eventHandlers={{
              click: () => handleMarkerClick(marker),
            }}
          >
            <Popup>
              <div className="text-sm">
                <h3 className="font-semibold text-gray-900">{marker.title}</h3>
                {marker.description && (
                  <p className="mt-1 text-gray-600">{marker.description}</p>
                )}
                <div className="mt-2 text-xs text-gray-500">
                  {marker.position.latitude.toFixed(6)}, {marker.position.longitude.toFixed(6)}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* 🛣️ Polylines */}
        {polylines.map((polyline) => (
          <Polyline
            key={polyline.id}
            positions={polyline.coordinates.map(coord => [coord.latitude, coord.longitude])}
            color={polyline.color}
            weight={polyline.weight}
            opacity={polyline.opacity}
            dashArray={polyline.dashArray}
          >
            {polyline.popup && (
              <Popup>
                <div className="text-sm">
                  {polyline.popup}
                </div>
              </Popup>
            )}
          </Polyline>
        ))}
      </MapContainer>

      {/* 🎨 Map Controls Overlay */}
      <div className="absolute top-4 right-4 z-10 space-y-2">
        {/* 🎯 Current Location Button */}
        <button
          onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const coords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                  }
                  if (mapRef.current) {
                    mapRef.current.setView([coords.latitude, coords.longitude], 15)
                  }
                },
                (error) => {
                  console.error('Geolocation error:', error)
                }
              )
            }
          }}
          className="rounded-lg bg-white p-2 shadow-md hover:bg-gray-50"
          title="定位到目前位置"
        >
          <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* 📊 Map Info Overlay */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="rounded-lg bg-white bg-opacity-90 px-3 py-2 text-xs text-gray-600 shadow-md">
          <div>中心: {center.latitude.toFixed(4)}, {center.longitude.toFixed(4)}</div>
          <div>縮放: {zoom}</div>
          {markers.length > 0 && <div>標記: {markers.length}</div>}
          {polylines.length > 0 && <div>路線: {polylines.length}</div>}
        </div>
      </div>
    </div>
  )
}

export default MapComponent