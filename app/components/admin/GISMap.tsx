"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FaLayerGroup, FaSpinner, FaSyncAlt, FaPlus, FaTrash, FaMapMarkerAlt, FaUser, FaPhone, FaExternalLinkAlt } from "react-icons/fa";

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

const serviceIcon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});

const resourceIcon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});

 interface MapMarker {
    id: string;
    title: string;
    description: string;
    type: 'SERVICE' | 'RESOURCE';
    latitude: number;
    longitude: number;
}

function AddMarkerHandler({ onAddMarker }: { onAddMarker: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onAddMarker(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

function FlyToLocation({ coords }: { coords: [number, number] | null }) {
    const map = useMap();
    useEffect(() => {
        if (coords) {
            map.setView(coords, 18, { animate: true, duration: 1.5 });
        }
    }, [coords, map]);
    return null;
}

export default function GISMap() {
    const [requests, setRequests] = useState<any[]>([]);
    const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([]);
    const [flyToCoords, setFlyToCoords] = useState<[number, number] | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [mapReady, setMapReady] = useState(false);
    const [isAddMode, setIsAddMode] = useState(false);
    const [newMarker, setNewMarker] = useState<{lat: number, lng: number} | null>(null);
    const [formData, setFormData] = useState({ title: '', description: '', type: 'SERVICE' });

    const fetchAllData = async (isBackground = false) => {
        try {
            if (isBackground) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }
            
            const [reqRes, markRes] = await Promise.all([
                fetch('/api/admin/requests'),
                fetch('/api/admin/markers')
            ]);

            if (reqRes.ok) {
                const data = await reqRes.json();
                if(data.requests) setRequests(data.requests);
            }
            if (markRes.ok) {
                const data = await markRes.json();
                if(data.markers) setMapMarkers(data.markers);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        setMapReady(true);
        fetchAllData(false);
        const interval = setInterval(() => fetchAllData(true), 30000); 
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

    const handleAddMarker = (lat: number, lng: number) => {
        setNewMarker({ lat, lng });
        setIsAddMode(false); // Exit add mode after clicking
    };

    const submitMarker = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMarker) return;

        try {
            const res = await fetch('/api/admin/markers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    latitude: newMarker.lat,
                    longitude: newMarker.lng
                })
            });

            if (res.ok) {
                setNewMarker(null);
                setFormData({ title: '', description: '', type: 'SERVICE' });
                fetchAllData(true);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const deleteMarker = async (id: string) => {
        if (!confirm('Are you sure you want to delete this marker?')) return;
        try {
            const res = await fetch(`/api/admin/markers?id=${id}`, { method: 'DELETE' });
            if (res.ok) fetchAllData(true);
        } catch (err) {
            console.error(err);
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
            <div className="absolute top-4 left-14 z-[1000] space-y-4 w-60">
                 {/* Legend */}
                 <div className="bg-slate-900/90 backdrop-blur p-4 rounded-xl border border-slate-700 shadow-xl">
                     <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-white text-sm flex items-center gap-2"><FaLayerGroup/> Map Layers</h3>
                        <button onClick={() => fetchAllData(true)} className="text-slate-400 hover:text-white transition-colors">
                            <FaSyncAlt className={refreshing ? "animate-spin" : ""} />
                        </button>
                     </div>
                     <div className="space-y-2">
                         <div className="flex items-center gap-2 text-xs text-gray-300">
                             <span className="w-3 h-3 rounded-full bg-red-500 block"></span> Pending Issues
                         </div>
                         <div className="flex items-center gap-2 text-xs text-gray-300">
                             <span className="w-3 h-3 rounded-full bg-yellow-500 block"></span> In Progress
                         </div>
                         <div className="flex items-center gap-2 text-xs text-gray-300">
                             <span className="w-3 h-3 rounded-full bg-emerald-500 block"></span> Completed
                         </div>
                         <div className="border-t border-slate-700 my-2"></div>
                         <div className="flex items-center gap-2 text-xs text-gray-300">
                             <span className="w-3 h-3 rounded-full bg-blue-500 bl   ock"></span> Public Services
                         </div>
                         <div className="flex items-center gap-2 text-xs text-gray-300">
                             <span className="w-3 h-3 rounded-full bg-violet-500 block"></span> Resources
                         </div>
                     </div>
                 </div>

                 {/* Actions */}
                 <div className="bg-slate-900/90 backdrop-blur p-3 rounded-xl border border-slate-700 shadow-xl">
                     <button
                        onClick={() => setIsAddMode(!isAddMode)}
                        className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-all ${
                            isAddMode 
                            ? 'bg-red-500/20 text-red-500 border border-red-500/50' 
                            : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                        }`}
                     >
                         {isAddMode ? 'Cancel Selection' : <><FaPlus/> Add Marker</>}
                     </button>
                     {isAddMode && (
                         <p className="text-[10px] text-center text-emerald-400 mt-2 animate-pulse">
                             Click location on map to place marker
                         </p>
                     )}
                 </div>
            </div>
    
            <MapContainer 
                center={center} 
                zoom={13} 
                style={{ height: "100%", width: "100%" }}
                className={`z-0 transition-opacity ${isAddMode ? 'cursor-crosshair' : ''}`}
            >
                <FlyToLocation coords={flyToCoords} />
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; CARTO'
                />

                {isAddMode && <AddMarkerHandler onAddMarker={handleAddMarker} />}
                
                {/* Resident Requests */}
                {validRequests.map((req) => (
                    <Marker 
                        key={`req-${req.id}`} 
                        position={[req.latitude, req.longitude]}
                        icon={getIcon(req.status)}
                    >
                        <Popup className="custom-popup">
                             <div className="p-3 min-w-[250px]">
                                 <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
                                     <b className="uppercase text-xs text-slate-500 flex items-center gap-1">
                                        <FaMapMarkerAlt className="text-emerald-500"/> Resident Issue
                                     </b>
                                     <span className={`text-[10px] px-2 py-0.5 rounded-full text-white font-bold ${
                                         req.status === 'pending' ? 'bg-red-500' : 
                                         req.status === 'in-progress' ? 'bg-yellow-500' : 'bg-emerald-500'
                                     }`}>
                                         {req.status.toUpperCase()}
                                     </span>
                                 </div>
                                 
                                 <div className="space-y-3">
                                     <div>
                                         <p className="font-bold text-sm text-slate-800 leading-tight">{req.description}</p>
                                         <p className="text-[10px] text-slate-400 mt-1">{new Date(req.createdAt).toLocaleString()}</p>
                                     </div>
                                     
                                     <div className="bg-slate-50 p-2 rounded border border-slate-100 space-y-1">
                                         <p className="text-xs text-slate-600 flex items-center gap-2">
                                             <FaUser className="text-slate-400"/> <b>{req.userFullName || 'Unknown Resident'}</b>
                                         </p>
                                         <p className="text-xs text-slate-600 flex items-center gap-2">
                                             <FaPhone className="text-slate-400"/> {req.userMobile || 'N/A'}
                                         </p>
                                         <p className="text-xs text-slate-600 flex items-start gap-2">
                                             <FaMapMarkerAlt className="text-slate-400 mt-0.5 flex-shrink-0"/> 
                                             <span className="truncate">{req.userAddress || 'No address provided'}</span>
                                         </p>
                                     </div>

                                     <button 
                                        onClick={() => setFlyToCoords([Number(req.latitude), Number(req.longitude)])}
                                        className="block w-full text-center py-1.5 bg-emerald-50 text-emerald-600 text-xs font-bold rounded hover:bg-emerald-100 transition-colors border border-emerald-200 flex items-center justify-center gap-2"
                                     >
                                         <FaMapMarkerAlt/> Zoom to Location
                                     </button>
                                 </div>
                             </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Admin Markers */}
                {mapMarkers.map((marker) => (
                    <Marker
                        key={`marker-${marker.id}`}
                        position={[marker.latitude, marker.longitude]}
                        icon={marker.type === 'SERVICE' ? serviceIcon : resourceIcon}
                    >
                        <Popup className="custom-popup">
                            <div className="p-1 min-w-[200px]">
                                <div className="flex justify-between items-start mb-2">
                                    <b className="uppercase text-xs text-slate-500">{marker.type}</b>
                                    <button 
                                        onClick={() => deleteMarker(marker.id)}
                                        className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
                                    >
                                        <FaTrash size={12}/>
                                    </button>
                                </div>
                                <h4 className="font-bold text-slate-800 mb-1">{marker.title}</h4>
                                <p className="text-sm text-slate-600 leading-relaxed">{marker.description}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* New Marker Preview */}
                {newMarker && (
                    <Popup position={[newMarker.lat, newMarker.lng]} closeButton={false}>
                        <div className="min-w-[250px] p-2">
                            <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                                <FaMapMarkerAlt className="text-emerald-500"/>
                                New Map Marker
                            </h4>
                            <form onSubmit={submitMarker} className="space-y-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Type</label>
                                    <select 
                                        className="w-full text-sm border border-slate-300 rounded p-1.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                                        value={formData.type}
                                        onChange={e => setFormData({...formData, type: e.target.value})}
                                    >
                                        <option value="SERVICE">Public Service</option>
                                        <option value="RESOURCE">Resource Center</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Title</label>
                                    <input 
                                        autoFocus
                                        required
                                        className="w-full text-sm border border-slate-300 rounded p-1.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                                        placeholder="e.g., Health Center"
                                        value={formData.title}
                                        onChange={e => setFormData({...formData, title: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Description</label>
                                    <textarea 
                                        required
                                        rows={3}
                                        className="w-full text-sm border border-slate-300 rounded p-1.5 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                                        placeholder="Add details..."
                                        value={formData.description}
                                        onChange={e => setFormData({...formData, description: e.target.value})}
                                    />
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button 
                                        type="button"
                                        onClick={() => setNewMarker(null)}
                                        className="flex-1 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className="flex-1 py-1.5 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded transition-colors shadow-sm"
                                    >
                                        Save Marker
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Popup>
                )}
            </MapContainer>

            {loading && (
                <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center z-[1001]">
                    <FaSpinner className="animate-spin text-4xl text-emerald-500"/>
                </div>
            )}
        </div>
    );
}
