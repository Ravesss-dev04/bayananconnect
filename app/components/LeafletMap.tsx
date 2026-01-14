"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default Leaflet markers in Next.js
const iconUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

// Custom Icons
const homeIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28], 
  shadowSize: [41, 41]
});

const problemIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

const serviceIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

function MapEvents({ onMapClick }: { onMapClick: (e: L.LeafletMouseEvent) => void }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e);
    },
    contextmenu: (e) => {
      // Handle long press or right click for reporting
      onMapClick(e);
    },
  });
  return null;
}

interface MapProps {
  pins: any[];
  center: [number, number];
  zoom: number;
  onReportClick: (lat: number, lng: number) => void;
}

export default function LeafletMap({ pins, center, zoom, onReportClick }: MapProps) {
  
  // Bayanan Coordinates: 14.4081 N, 121.0415 E
  const bayananBounds = new L.LatLngBounds(
    [14.3900, 121.0300], // Southwest
    [14.4250, 121.0600]  // Northeast
  );

  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      style={{ height: "100%", width: "100%" }}
      className="z-0"
      maxBounds={bayananBounds}
      minZoom={14}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapEvents onMapClick={(e) => onReportClick(e.latlng.lat, e.latlng.lng)} />

      {pins.map((pin) => {
        let icon = defaultIcon;
        // Logic to choose icons based on "type" or "status"
        // If coming from DB, maybe use "status" to color code or "type"
        const isRequest = pin.status !== undefined; 
        
        if (!isRequest && pin.type === "me") icon = homeIcon;
        else if (isRequest || pin.type === "problem") {
             // Maybe differentiate icon based on type here if we had more icons
             icon = problemIcon;
        }
        else if (pin.type === "service") icon = serviceIcon;

        // Ensure lat/lng are numbers
        const lat = parseFloat(pin.latitude || pin.lat);
        const lng = parseFloat(pin.longitude || pin.lng);

        if (isNaN(lat) || isNaN(lng)) return null;

        return (
          <Marker 
            key={pin.id} 
            position={[lat, lng]} 
            icon={icon}
          >
            <Tooltip direction="top" offset={[0, -40]} opacity={1}>
                {pin.type || "Issue"}
            </Tooltip>
            <Popup>
               <div className="p-1">
                 <h3 className="font-bold text-sm text-gray-800 capitalize">{pin.type || "Issue"}</h3>
                 <p className="text-xs text-gray-600 my-1">{pin.description || pin.details}</p>
                 {pin.status && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full text-white ${
                        pin.status === "Pending" ? "bg-yellow-500" :
                        pin.status === "Completed" ? "bg-emerald-500" : "bg-blue-500"
                    }`}>
                        {pin.status}
                    </span>
                 )}
               </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
