"use client";

import { FaClipboardList, FaBullhorn, FaTruck, FaShieldAlt, FaArrowRight } from "react-icons/fa";
import { useEffect, useState } from "react";

interface Request {
    severity: string;
    id: string;
    type: string;
    description: string;
    status: string;
    createdAt: string;
    userFullName: string | null;
    userAddress: string | null;
}

const StatCard = ({ title, value, color, icon: Icon, subtext, delay }: any) => {
    // Determine color classes
    const colorClasses = {
        'bg-blue-500': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        'bg-red-500': 'bg-red-500/10 text-red-400 border-red-500/20',
        'bg-emerald-500': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        'bg-purple-500': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    }[color as string] || 'bg-slate-700 text-slate-400 border-slate-600';

    return (
        <div 
            className="glass-card p-6 rounded-2xl transition-all duration-300 hover:transform hover:-translate-y-1 animate-scaleIn"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl border ${colorClasses}`}>
                    <Icon className="text-xl" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-900/20 px-2 py-1 rounded-full border border-emerald-500/20 shadow-sm shadow-emerald-500/10">
                    {subtext}
                </span>
            </div>
            <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wide">{title}</h3>
            <p className="text-3xl font-bold text-white mt-1 tracking-tight">{value}</p>
        </div>
    );
};

export default function DashboardOverview() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
             try {
                // Fetch Requests
                const reqRes = await fetch('/api/admin/requests');
                if (reqRes.ok) {
                    const data = await reqRes.json();
                    setRequests(data.requests);
                }

                // Fetch Stats (User Count)
                // Assuming this endpoint exists based on earlier context, if not it will error but catch block handles it
                const statsRes = await fetch('/api/admin/stats');
                if (statsRes.ok) {
                    const data = await statsRes.json();
                    setTotalUsers(data.totalUsers);
                } else {
                    // Fallback if stats fail
                    setTotalUsers(0); 
                }

             } catch (error) {
                 console.error("Failed to fetch dashboard data", error);
             } finally {
                 setLoading(false);
             }
        };

        fetchData();

        // Polling for real-time updates (every 10 seconds)
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    const totalRequests = requests.length;
    const criticalIssues = requests.filter(r => r.status === 'Pending').length; 
    
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard 
                    title="Total Requests" 
                    value={loading ? "..." : totalRequests.toLocaleString()} 
                    color="bg-blue-500" 
                    icon={FaClipboardList} 
                    subtext="Realtime"
                    delay={0}
                />
                <StatCard 
                    title="Action Required" 
                    value={loading ? "..." : criticalIssues.toString()} 
                    color="bg-red-500" 
                    icon={FaBullhorn} 
                    subtext="Pending Review"
                    delay={100}
                />
                <StatCard 
                    title="Total Residents" 
                    value={loading ? "..." : totalUsers.toLocaleString()} 
                    color="bg-emerald-500" 
                    icon={FaShieldAlt} 
                    subtext="Active Users"
                    delay={200}
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Requests Table */}
                <div className="lg:col-span-2 glass-panel p-6 rounded-2xl animate-slideIn transition-all" style={{ animationDelay: '300ms' }}>
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-bold text-lg text-white">Recent Requests</h3>
                            <p className="text-xs text-slate-400">Latest submissions from residents</p>
                        </div>
                        <button className="text-xs flex items-center gap-1 text-emerald-400 font-bold hover:text-emerald-300 transition-colors uppercase tracking-wide">
                            View All <FaArrowRight size={10}/>
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-900/30 font-medium tracking-wider">
                                <tr>
                                    <th className="px-4 py-3 rounded-l-lg">ID</th>
                                    <th className="px-4 py-3">Type</th>
                                    <th className="px-4 py-3">Location</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 rounded-r-lg">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {requests.slice(0, 5).map((req) => (
                                    <tr key={req.id} className="hover:bg-slate-800/40 transition-colors group">
                                        <td className="px-4 py-4 font-mono text-slate-500 text-xs group-hover:text-emerald-500 transition-colors">
                                            #{req.id.slice(0, 6)}...
                                        </td>
                                        <td className="px-4 py-4 font-bold text-slate-200">{req.type}</td>
                                        <td className="px-4 py-4 text-slate-400 truncate max-w-[150px]">{req.userAddress || "No Location Provided"}</td>
                                        <td className="px-4 py-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                                req.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                req.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                            }`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-slate-500 text-xs">{new Date(req.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                                {!loading && requests.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <FaClipboardList className="text-2xl opacity-20"/>
                                                <p>No requests found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Live Activity Feed */}
                <div className="glass-panel p-6 rounded-2xl animate-slideIn transition-all flex flex-col" style={{ animationDelay: '400ms' }}>
                   <div className="mb-6">
                        <h3 className="font-bold text-lg text-white">Live Activity</h3>
                        <p className="text-xs text-slate-400">Real-time system events</p>
                   </div>
                   
                   <div className="flex-1 space-y-0 relative">
                        {/* Vertical Line */}
                        <div className="absolute left-[9px] top-2 bottom-2 w-px bg-slate-800"></div>

                        {requests.slice(0, 5).map((req, i) => (
                            <div key={i} className="flex gap-4 relative pb-6 last:pb-0 group">
                                <div className="z-10 mt-1">
                                    <div className="w-5 h-5 rounded-full bg-slate-900 border-2 border-slate-700 group-hover:border-emerald-500 group-hover:scale-110 transition-all flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-300 font-medium group-hover:text-white transition-colors">
                                        New request: <span className="text-emerald-400">{req.type}</span>
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-xs text-slate-500">{new Date(req.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                        <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                        <p className="text-[10px] text-slate-600 uppercase tracking-wider font-bold">{req.userFullName || 'Guest'}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                         {!loading && requests.length === 0 && (
                             <div className="text-center text-slate-500 text-xs py-10">No recent activity</div>
                         )}
                    </div>
                    
                    <button className="w-full mt-6 py-2 rounded-lg bg-slate-800 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-700 transition-colors uppercase tracking-wide">
                        View Full History
                    </button>
                </div>
            </div>
        </div>
    );
}
