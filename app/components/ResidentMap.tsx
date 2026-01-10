"use client";

import { useState } from "react";
import { FaMapMarkerAlt, FaHome, FaExclamationTriangle, FaTrash, FaLightbulb, FaRoad } from "react-icons/fa";

type Pin = {
  id: string;
  x: number; // percentage
  y: number; // percentage
  type: 'problem' | 'service' | 'me';
  category?: string;
  details?: string;
};

const mockPins: Pin[] = [
  { id: '1', x: 20, y: 30, type: 'me', details: 'My Home' },
  { id: '2', x: 45, y: 50, type: 'problem', category: 'pothole', details: 'Pothole on Main St.' },
  { id: '3', x: 70, y: 20, type: 'problem', category: 'garbage', details: 'Uncollected Trash' },
  { id: '4', x: 60, y: 60, type: 'service', details: 'Health Center' },
  { id: '5', x: 30, y: 80, type: 'problem', category: 'streetlight', details: 'Dark Area' },
];

export default function ResidentMap({ onReportClick }: { onReportClick: () => void }) {
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);

  const getIcon = (pin: Pin) => {
    if (pin.type === 'me') return <FaHome className="text-blue-500 text-2xl drop-shadow-md" />;
    if (pin.type === 'service') return <FaMapMarkerAlt className="text-green-500 text-3xl drop-shadow-md" />;
    
    // Problems
    switch(pin.category) {
        case 'pothole': return <FaRoad className="text-red-500 text-xl drop-shadow-md" />;
        case 'garbage': return <FaTrash className="text-red-500 text-xl drop-shadow-md" />;
        case 'streetlight': return <FaLightbulb className="text-red-500 text-xl drop-shadow-md" />;
        default: return <FaExclamationTriangle className="text-red-500 text-xl drop-shadow-md" />;
    }
  };

  return (
    <div className="w-full h-full bg-slate-200 relative overflow-hidden group">
        {/* Mock Map Background - a grid pattern to look like streets */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[length:40px_40px]"></div>
        
        {/* Mock Streets */}
        <div className="absolute top-[40%] left-0 w-full h-8 bg-white border-y border-gray-300 transform -skew-y-2"></div>
        <div className="absolute top-0 left-[30%] w-8 h-full bg-white border-x border-gray-300 transform skew-x-2"></div>

        {/* Long Press Area Hint */}
        <div 
            className="absolute inset-0 cursor-crosshair"
            onContextMenu={(e) => {
                e.preventDefault();
                onReportClick();
            }}
            onClick={() => setSelectedPin(null)}
        >
        </div>

        {/* Pins */}
        {mockPins.map(pin => (
            <button
                key={pin.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform z-10"
                style={{ top: `${pin.y}%`, left: `${pin.x}%` }}
                onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPin(pin);
                }}
            >
                {getIcon(pin)}
                {pin.type === 'me' && <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50"></div>}
            </button>
        ))}

        {/* Current Location Indicator (FAB style on map) */}
        <button className="absolute bottom-4 left-4 bg-white p-3 rounded-full shadow-lg text-gray-600 hover:text-blue-500 z-20">
            <FaMapMarkerAlt />
        </button>

        {/* Pin Detail Card */}
        {selectedPin && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-sm bg-white rounded-xl shadow-xl p-4 z-20 animate-slide-up">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-gray-800 capitalize">{selectedPin.type === 'me' ? 'My Location' : (selectedPin.category || selectedPin.details)}</h3>
                        <p className="text-sm text-gray-500">{selectedPin.details}</p>
                    </div>
                    <button onClick={() => setSelectedPin(null)} className="text-gray-400 hover:text-gray-600">&times;</button>
                </div>
                {selectedPin.type === 'problem' && (
                    <div className="mt-3 flex gap-2">
                        <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full font-medium">Reported Issue</span>
                    </div>
                )}
            </div>
        )}

        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-lg p-2 shadow-sm text-xs text-gray-500 z-10 pointer-events-none">
            <p>Hint: Right-click (or long press) anywhere to report</p>
        </div>
    </div>
  );
}
