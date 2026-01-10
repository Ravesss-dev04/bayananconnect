"use client";

import { mockCCTV } from "@/lib/mockData";

export default function CCTVMonitoring() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
            {mockCCTV.map((cam) => (
                <div key={cam.id} className="bg-black rounded-lg overflow-hidden border border-slate-700 relative group aspect-video">
                    <img src={cam.feedUrl} alt={cam.location} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                    <div className="absolute top-2 left-2 flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full ${cam.status === 'Online' ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
                         <span className="text-white text-xs font-mono bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">{cam.location}</span>
                    </div>
                    <div className="absolute top-2 right-2 text-white/50 text-xs font-mono">REC • [{cam.id}]</div>
                    
                    {/* Overlay Lines */}
                    <div className="absolute inset-x-0 bottom-4 text-center text-green-500/50 text-[10px] font-mono">
                        ----------------- {new Date().toLocaleTimeString()} -----------------
                    </div>
                </div>
            ))}
        </div>
    );
}
