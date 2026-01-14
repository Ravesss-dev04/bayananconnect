"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FaLayerGroup, FaSpinner, FaSyncAlt } from "react-icons/fa";

// Fix for default Leaflet markers
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
const pendingIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28], 
  shadowSize: [41, 41]
});

const progressIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

const completedIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

export default function GISMap() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [mapReady, setMapReady] = useState(false);

    const fetchRequests = async () => {
        try {
            const res = await fetch('/api/admin/requests');
            if (res.ok) {
                const data = await res.json();
                setRequests(data.requests);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setMapReady(true);
        fetchRequests();
        const interval = setInterval(fetchRequests, 30000); // 30s polling
        return () => clearInterval(interval);
    }, []);

    const getIcon = (status: string) => {
        switch(status) {
            case 'pending': return pendingIcon;
            case 'in-progress': return progressIcon;
            case 'completed': return completedIcon;
            default: return defaultIcon;
        }
    };

    if (!mapReady) return <div className="h-full flex items-center justify-center bg-slate-800 text-slate-500">Initializing Map...</div>;

    const validRequests = requests.filter(r => r.latitude && r.longitude);
    const center: [number, number] = validRequests.length > 0 
        ? [validRequests[0].latitude, validRequests[0].longitude] 
        : [14.5995, 120.9842]; // Fallback to Manila

    return (
        <div className="h-[calc(100vh-140px)] bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 relative group animate-fadeIn z-0">
            {/* Controls */}
            <div className="absolute top-4 left-14 z-[1000] bg-slate-900/90 backdrop-blur p-4 rounded-xl border border-slate-700 shadow-xl w-48">
                 <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2"><FaLayerGroup/> Layers</h3>
                    <button onClick={() => { setLoading(true); fetchRequests(); }} className="text-slate-400 hover:text-white transition-colors">
                        <FaSyncAlt className={loading ? "animate-spin" : ""} />
                    </button>
                 </div>
                 <div className="space-y-2">
                     <div className="flex items-center gap-2 text-xs text-gray-300">
                         <span className="w-3 h-3 rounded-full bg-red-500 block"></span> Pending
                     </div>
                     <div className="flex items-center gap-2 text-xs text-gray-300">
                         <span className="w-3 h-3 rounded-full bg-yellow-500 block"></span> In Progress
                     </div>
                      <div className="flex items-center gap-2 text-xs text-gray-300">
                         <span className="w-3 h-3 rounded-full bg-emerald-500 block"></span> Completed
                     </div>
                 </div>
            </div>
    
            <MapContainer 
                center={center} 
                zoom={13} 
                style={{ height: "100%", width: "100%" }}
                className="z-0"
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                
                {validRequests.map((req) => (
                    <Marker 
                        key={req.id} 
                        position={[req.latitude, req.longitude]}
                        icon={getIcon(req.status)}
                    >
                        <Popup className="custom-popup">
                             <div className="p-1">
                                 <b className="uppercase text-xs text-slate-500 block mb-1">{req.type}</b>
                                 <p className="font-bold text-sm text-slate-800 mb-1">{req.description}</p>
                                 <span className={`text-[10px] px-2 py-0.5 rounded-full text-white ${
                                     req.status === 'pending' ? 'bg-red-500' : 
                                     req.status === 'in-progress' ? 'bg-yellow-500' : 'bg-emerald-500'
                                 }`}>
                                     {req.status.toUpperCase()}
                                 </span>
                                 <p className="text-xs text-slate-400 mt-2">{new Date(req.createdAt).toLocaleString()}</p>
                             </div>
                        </Popup>
                        <Tooltip>{req.type}: {req.status}</Tooltip>
                    </Marker>
                ))}
            </MapContainer>

            {loading && (
                <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center z-[1001]">
                    <FaSpinner className="animate-spin text-4xl text-emerald-500"/>
                </div>
            )}
        </div>
    );
}
