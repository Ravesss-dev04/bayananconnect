"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { FaSpinner, FaMapMarkerAlt, FaSync } from "react-icons/fa";

// Dynamically import Leaflet map to avoid SSR issues
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-100">
      <div className="text-center">
        <FaSpinner className="animate-spin text-4xl text-emerald-600 mx-auto mb-2" />
        <p className="text-gray-500 font-medium">Loading Map...</p>
      </div>
    </div>
  ),
});

type Pin = {
  id: string;
  lat: number;
  lng: number;
  type: string;
  category?: string;
  details?: string;
  status?: string;
};

interface ResidentMapProps {
    user?: any;
    onReportClick: (lat: number, lng: number) => void;
}

// Real coordinates for Bayanan, Muntinlupa
const BAYANAN_CENTER: [number, number] = [14.4081, 121.0415];

export default function ResidentMap({ onReportClick, user }: ResidentMapProps) {
  const [pins, setPins] = useState<any[]>([]);
  const [loadingPins, setLoadingPins] = useState(false);

  // Fetch real data from server
  const fetchPins = async () => {
    // Only show loading spinner on first load, not on refreshes to keep it smooth
    if (pins.length === 0) setLoadingPins(true);
    try {
      
        const res = await fetch("/api/requests/public");
        if (res.ok) {
            const data = await res.json();
            // Add "me" pin if user has coordinates (mock for now or real if avail)
            // If user has address, we could technically geocode it, but valid for now
            const myPin = { id: "me", lat: 14.4081, lng: 121.0415, type: "me", details: "My Home" };
            setPins([myPin, ...data.pins]);
        }
    } catch (e) {
        console.error("Failed to fetch map pins", e);
    } finally {
        setLoadingPins(false);
    }
  };

  // Initial fetch and periodic refresh (Simulation of "Real Time")
  useEffect(() => {
    fetchPins();
    const interval = setInterval(fetchPins, 10000); // Refresh every 10s for "Live" feel
    return () => clearInterval(interval);
  }, []);
  
  const handleMapClick = (lat: number, lng: number) => {
    console.log("Map clicked at:", lat, lng);
    onReportClick(lat, lng);
  };

  return (
    <div className="w-full h-full bg-slate-200 relative overflow-hidden group">
        <LeafletMap 
            pins={pins} 
            center={BAYANAN_CENTER} 
            zoom={16} 
            onReportClick={handleMapClick}
        />

        {/* Floating Action Buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-[400]">
            <button 
                onClick={fetchPins}
                className={`bg-white p-3 rounded-full shadow-md text-emerald-600 hover:bg-emerald-50 transition-all ${loadingPins ? "animate-spin" : ""}`}
                title="Refresh Map"
            >
                <FaSync />
            </button>
        </div>

        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-lg p-2 shadow-sm text-xs text-gray-500 z-[400] pointer-events-none border border-emerald-100">
            <p className="font-bold text-emerald-800">Live Community Map</p>
            <p className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Issues</p>
            <p className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> My Home</p>
        </div>

        <button className="absolute bottom-6 right-6 bg-white p-4 rounded-full shadow-xl text-emerald-600 hover:text-emerald-700 hover:scale-110 transition-all z-[400] pointer-events-none">
            <FaMapMarkerAlt className="text-xl" />
        </button>
    </div>
  );
}
