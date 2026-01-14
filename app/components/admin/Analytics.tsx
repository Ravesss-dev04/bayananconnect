"use client";

import { useEffect, useState } from "react";
import { FaSpinner, FaCircle, FaChartPie, FaChartBar } from "react-icons/fa";

export default function Analytics() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        byStatus: { pending: 0, in_progress: 0, completed: 0, rejected: 0 } as Record<string, number>,
        byType: {} as Record<string, number>,
        dailyTrend: [] as number[], // Last 7 days
    });

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await fetch('/api/admin/analytics');
                if (res.ok) {
                    const data = await res.json();
                    processData(data.requests);
                }
            } catch(e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const processData = (requests: any[]) => {
        const byStatus = { pending: 0, in_progress: 0, completed: 0, rejected: 0 };
        const byType: Record<string, number> = {};
        
        // Simple daily trend (Last 5 days)
        const days = Array(5).fill(0);
        const today = new Date();
        today.setHours(0,0,0,0);

        requests.forEach(r => {
            // Status Count
            const statusKey = r.status.replace('-', '_'); // handle in-progress
            if (byStatus[statusKey as keyof typeof byStatus] !== undefined) {
                byStatus[statusKey as keyof typeof byStatus]++;
            }

            // Type Count
            byType[r.type] = (byType[r.type] || 0) + 1;

            // Trend
            const rDate = new Date(r.createdAt);
            rDate.setHours(0,0,0,0);
            const diffTime = Math.abs(today.getTime() - rDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            if (diffDays < 5) {
                days[4 - diffDays]++; // 4 is today, 0 is 5 days ago (roughly)
            }
        });

        setStats({
            total: requests.length,
            byStatus,
            byType,
            dailyTrend: days
        });
    };

    if (loading) return <div className="h-64 flex items-center justify-center text-slate-500"><FaSpinner className="animate-spin text-2xl"/></div>;

    const maxTrend = Math.max(...stats.dailyTrend, 1);

    return (
        <div className="grid lg:grid-cols-2 gap-6 animate-fadeIn">
            {/* Request Distribution (Trend) */}
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg text-white flex items-center gap-2"><FaChartBar className="text-emerald-500"/> Activity Trend</h3>
                    <span className="text-xs text-slate-400 bg-slate-900 px-2 py-1 rounded">Last 5 Days</span>
                 </div>
                 
                 <div className="h-48 flex items-end justify-around gap-4 px-4 pb-4 border-b border-slate-700/50">
                     {stats.dailyTrend.map((count, i) => {
                         const height = (count / maxTrend) * 100;
                         return (
                             <div key={i} className="w-full relative group">
                                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 border border-slate-600">
                                     {count} Requests
                                 </div>
                                 <div style={{ height: `${height}%` }} className="w-full bg-emerald-600/80 rounded-t-sm transition-all hover:bg-emerald-500 min-h-[4px]"></div>
                             </div>
                         );
                     })}
                 </div>
                 <div className="flex justify-between text-xs text-slate-400 mt-3 px-1 uppercase tracking-wide">
                     <span>5d ago</span>
                     <span>Today</span>
                 </div>
            </div>

            {/* Incident Types / Status Pie */}
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm flex flex-col">
                 <h3 className="font-bold text-lg text-white mb-6 flex items-center gap-2"><FaChartPie className="text-blue-500"/> Request Status</h3>
                 
                 <div className="flex-1 flex flex-row items-center justify-around">
                     {/* CSS Pie Chart Attempt or Legend-based visualization */}
                     <div className="relative w-40 h-40">
                        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                            {/* Background Circle */}
                            <path className="text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.8" />
                            {/* Segments - Simplified visual for now since SVG math is complex without library. 
                                Instead using a visual representation of the biggest slice */}
                            <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-emerald-500" strokeWidth="3" strokeDasharray={`${(stats.byStatus.completed / stats.total) * 100}, 100`} />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-white">{stats.total}</span>
                            <span className="text-[10px] uppercase text-slate-400 tracking-widest">Total</span>
                        </div>
                     </div>

                     <div className="space-y-3">
                         <div className="flex items-center justify-between gap-4 text-sm w-40">
                             <span className="flex items-center gap-2 text-slate-300"><FaCircle className="text-emerald-500 text-[10px]"/> Completed</span>
                             <span className="font-bold text-white">{stats.byStatus.completed}</span>
                         </div>
                         <div className="flex items-center justify-between gap-4 text-sm w-40">
                             <span className="flex items-center gap-2 text-slate-300"><FaCircle className="text-yellow-500 text-[10px]"/> In Progress</span>
                             <span className="font-bold text-white">{stats.byStatus.in_progress}</span>
                         </div>
                         <div className="flex items-center justify-between gap-4 text-sm w-40">
                             <span className="flex items-center gap-2 text-slate-300"><FaCircle className="text-red-500 text-[10px]"/> Pending</span>
                             <span className="font-bold text-white">{stats.byStatus.pending}</span>
                         </div>
                     </div>
                 </div>
            </div>
        </div>
    );
}
