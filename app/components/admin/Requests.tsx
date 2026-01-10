"use client";

import { mockRequests } from "@/lib/mockData";

export default function Requests() {
    return (
        <div className="bg-slate-800 rounded-2xl shadow-sm border border-slate-700 overflow-hidden animate-fadeIn">
            <div className="p-6 border-b border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-bold text-white">Central Request Dispatch</h2>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm font-medium text-gray-300 hover:bg-slate-600 transition-colors">Export Log</button>
                    <button className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-900/20">Manual Entry</button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-900/50 text-gray-400 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Request ID</th>
                            <th className="px-6 py-4 font-semibold">Source</th>
                            <th className="px-6 py-4 font-semibold">Type</th>
                            <th className="px-6 py-4 font-semibold">Urgency</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {mockRequests.map(req => (
                            <tr key={req.id} className="hover:bg-slate-700/50 transition-colors">
                                <td className="px-6 py-4 font-mono text-emerald-400 font-medium">#{req.id}</td>
                                <td className="px-6 py-4 text-gray-300">App</td>
                                <td className="px-6 py-4 text-gray-300">{req.type}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                                        req.urgency === 'High' ? 'bg-red-900/50 text-red-400 border border-red-800' : 
                                        req.urgency === 'Medium' ? 'bg-orange-900/50 text-orange-400 border border-orange-800' : 'bg-slate-700 text-gray-400'
                                    }`}>
                                        {req.urgency}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold border border-transparent ${
                                        req.status === 'Completed' ? 'bg-emerald-900/50 text-emerald-400 border-emerald-800' :
                                        req.status === 'In Progress' ? 'bg-blue-900/50 text-blue-400 border-blue-800' :
                                        'bg-yellow-900/50 text-yellow-400 border-yellow-800'
                                    }`}>
                                        {req.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-emerald-400 font-medium hover:text-emerald-300">Manage</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
