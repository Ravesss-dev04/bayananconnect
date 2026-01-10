"use client";

import { FaClipboardList, FaBullhorn, FaTruck, FaShieldAlt } from "react-icons/fa";
import { mockRequests } from "@/lib/mockData";

const StatCard = ({ title, value, color, icon: Icon, subtext }: any) => (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm hover:shadow-md transition-all">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-${color.split('-')[1]}-400`}>
                <Icon className="text-2xl" />
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-900/30 px-2 py-1 rounded-full border border-emerald-900/50">{subtext}</span>
        </div>
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold text-white mt-1">{value}</p>
    </div>
);

export default function DashboardOverview() {
    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Requests" 
                    value="1,248" 
                    color="bg-blue-500" 
                    icon={FaClipboardList} 
                    subtext="+12% this week" 
                />
                <StatCard 
                    title="Critical Issues" 
                    value="12" 
                    color="bg-red-500" 
                    icon={FaBullhorn} 
                    subtext="Action required" 
                />
                <StatCard 
                    title="Active Units" 
                    value="8" 
                    color="bg-emerald-500" 
                    icon={FaTruck} 
                    subtext="Deployed" 
                />
                <StatCard 
                    title="System Status" 
                    value="99.9%" 
                    color="bg-purple-500" 
                    icon={FaShieldAlt} 
                    subtext="Secure" 
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-white">Recent Service Requests</h3>
                        <button className="text-sm text-emerald-400 font-medium hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-400 uppercase bg-slate-900/50">
                                <tr>
                                    <th className="px-4 py-3 rounded-l-lg">ID</th>
                                    <th className="px-4 py-3">Type</th>
                                    <th className="px-4 py-3">Location</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 rounded-r-lg">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {mockRequests.slice(0, 5).map((req) => (
                                    <tr key={req.id} className="hover:bg-slate-700/50 transition-colors">
                                        <td className="px-4 py-3 font-mono text-gray-400">#{req.id}</td>
                                        <td className="px-4 py-3 font-medium text-white">{req.type}</td>
                                        <td className="px-4 py-3 text-gray-400">{req.location.address}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                req.status === 'Completed' ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-800' :
                                                req.status === 'In Progress' ? 'bg-blue-900/50 text-blue-400 border border-blue-800' :
                                                'bg-yellow-900/50 text-yellow-400 border border-yellow-800'
                                            }`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">{new Date(req.dateSubmitted).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm">
                   <h3 className="font-bold text-lg text-white mb-6">Live Feed Activity</h3>
                    <div className="space-y-6">
                        {mockRequests.slice(0, 3).map((req, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-emerald-900/30 mb-1"></div>
                                    <div className="w-0.5 h-full bg-slate-700"></div>
                                </div>
                                <div className="pb-4">
                                    <p className="text-sm font-medium text-white">New {req.type} reported</p>
                                    <p className="text-xs text-gray-500 mb-2">by Resident • 2m ago</p>
                                    <div className="p-2 bg-slate-900 rounded text-xs text-gray-400 border border-slate-700">
                                        "{req.description}"
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
