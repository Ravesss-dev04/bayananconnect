"use client";

import { FaMapMarkedAlt, FaTruck } from "react-icons/fa";

export default function GISMap() {
    return (
        <div className="h-[calc(100vh-140px)] bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 relative group animate-fadeIn">
            <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur p-4 rounded-xl border border-slate-700 shadow-xl">
                 <h3 className="font-bold text-white mb-3">Layer Controls</h3>
                 <div className="space-y-2">
                     {['Traffic', 'Flood Zones', 'CCTV', 'Incident Heatmap'].map(layer => (
                         <label key={layer} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-white">
                             <input type="checkbox" defaultChecked className="rounded border-slate-600 text-emerald-600 bg-slate-800 focus:ring-emerald-500" />
                             {layer}
                         </label>
                     ))}
                 </div>
            </div>
    
            {/* Mock Map Background */}
            <div className="w-full h-full bg-slate-900 relative opacity-80">
                {/* Grid Lines */}
                <div className="absolute inset-0" style={{ 
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', 
                    backgroundSize: '40px 40px' 
                }}></div>
                
                {/* Mock Elements */}
                <div className="absolute top-1/4 left-1/3 animate-pulse">
                    <FaMapMarkedAlt className="text-4xl text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                     <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap border border-slate-700">Accident Report</div>
                </div>
    
                 <div className="absolute bottom-1/3 right-1/4">
                    <FaTruck className="text-2xl text-emerald-500" />
                </div>
    
                <div className="absolute top-1/2 left-1/2">
                    <div className="w-32 h-32 bg-blue-500/20 rounded-full blur-xl"></div>
                </div>
            </div>
        </div>
    );
}
