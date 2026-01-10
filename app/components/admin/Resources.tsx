"use client";

import { FaTruck, FaHardHat, FaBoxOpen } from "react-icons/fa";
import { mockResources, mockPersonnel, mockInventory } from "@/lib/mockData";

export default function Resources() {
    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Vehicles & Equipment */}
            <div className="bg-slate-800 rounded-2xl shadow-sm border border-slate-700 p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <FaTruck className="text-emerald-500" /> Fleet Management
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockResources.map((res) => (
                        <div key={res.id} className="bg-slate-700/50 p-4 rounded-xl border border-slate-600">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-mono text-slate-400">{res.id}</span>
                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                    res.status === 'Active' || res.status === 'Available' ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-800' : 'bg-red-900/50 text-red-400 border border-red-800'
                                }`}>
                                    {res.status}
                                </span>
                            </div>
                            <h3 className="font-bold text-white">{res.name}</h3>
                            <p className="text-sm text-slate-400 mt-1">{res.type}</p>
                            <div className="mt-4 flex items-center gap-2 text-xs text-slate-300">
                                <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                                Assigned: {res.assignedTo}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
    
            {/* Personnel */}
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-slate-800 rounded-2xl shadow-sm border border-slate-700 p-6">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <FaHardHat className="text-blue-500" /> Active Personnel
                    </h2>
                    <div className="space-y-4">
                        {mockPersonnel.map((person) => (
                            <div key={person.id} className="flex items-center justify-between p-3 flex-wrap gap-2 bg-slate-900/50 rounded-lg border border-slate-700">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 font-bold">
                                        {person.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">{person.name}</p>
                                        <p className="text-xs text-slate-400">{person.role} • {person.department}</p>
                                    </div>
                                </div>
                                <span className="text-xs text-emerald-400 bg-emerald-900/30 px-2 py-1 rounded border border-emerald-800">{person.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
    
                 <div className="bg-slate-800 rounded-2xl shadow-sm border border-slate-700 p-6">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <FaBoxOpen className="text-orange-500" /> Critical Inventory
                    </h2>
                    <div className="space-y-4">
                        {mockInventory.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                                <div>
                                    <p className="font-medium text-white">{item.item}</p>
                                    <p className="text-xs text-slate-400">Ref: {item.id}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-xl text-white">{item.quantity} <span className="text-xs font-normal text-slate-500">{item.unit}</span></p>
                                    <p className={`text-[10px] ${item.quantity < item.threshold ? 'text-red-400' : 'text-emerald-400'}`}>
                                        {item.quantity < item.threshold ? 'Low Stock' : 'Good Stock'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
