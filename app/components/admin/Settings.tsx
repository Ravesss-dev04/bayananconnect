"use client";

import { FaCog, FaUserShield, FaBell, FaDatabase } from "react-icons/fa";

export default function Settings() {
    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
            <div className="bg-slate-800 rounded-2xl shadow-sm border border-slate-700 p-6">
                 <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <FaCog className="text-gray-400" /> System Configuration
                </h2>
                
                <div className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                        <div>
                            <h3 className="font-bold text-white">System Status</h3>
                            <p className="text-sm text-slate-400">Current operational mode of the command center.</p>
                        </div>
                        <span className="px-3 py-1 bg-emerald-900/50 text-emerald-400 border border-emerald-800 rounded-full text-xs font-bold uppercase">
                            Operational
                        </span>
                    </div>

                    <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                        <div>
                            <h3 className="font-bold text-white">Public Alerts</h3>
                            <p className="text-sm text-slate-400">Enable automated SMS blasts for high-priority alerts.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-800 rounded-2xl shadow-sm border border-slate-700 p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <FaUserShield className="text-blue-400" /> Admin Access
                    </h3>
                    <div className="space-y-3">
                        <button className="w-full text-left px-4 py-3 bg-slate-900/50 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
                            Manage Accounts
                        </button>
                        <button className="w-full text-left px-4 py-3 bg-slate-900/50 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
                             Audit Logs
                        </button>
                    </div>
                </div>

                <div className="bg-slate-800 rounded-2xl shadow-sm border border-slate-700 p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <FaDatabase className="text-purple-400" /> Data Management
                    </h3>
                     <div className="space-y-3">
                        <button className="w-full text-left px-4 py-3 bg-slate-900/50 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
                            Backup System Data
                        </button>
                        <button className="w-full text-left px-4 py-3 bg-slate-900/50 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
                             Archive Old Requests
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
