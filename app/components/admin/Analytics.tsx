"use client";

import { useEffect, useState, useMemo } from "react";
import { FaSpinner, FaCircle, FaChartPie, FaChartBar, FaCalendarAlt } from "react-icons/fa";

export default function Analytics() {
    const [loading, setLoading] = useState(true);
    const [rawRequests, setRawRequests] = useState<any[]>([]);
    const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
    
    // Global stats (all time)
    const [stats, setStats] = useState({
        total: 0,
        byStatus: { pending: 0, in_progress: 0, completed: 0, rejected: 0 } as Record<string, number>,
        byType: {} as Record<string, number>,
    });

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await fetch('/api/admin/analytics');
                if (res.ok) {
                    const data = await res.json();
                    setRawRequests(data.requests);
                    processGlobalStats(data.requests);
                }
            } catch(e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const processGlobalStats = (requests: any[]) => {
        const byStatus = { pending: 0, in_progress: 0, completed: 0, rejected: 0 };
        const byType: Record<string, number> = {};
        
        requests.forEach(r => {
            const statusKey = r.status.replace('-', '_');
            if (byStatus[statusKey as keyof typeof byStatus] !== undefined) {
                byStatus[statusKey as keyof typeof byStatus]++;
            }
            byType[r.type] = (byType[r.type] || 0) + 1;
        });

        setStats({
            total: requests.length,
            byStatus,
            byType,
        });
    };

    // Calculate Trend Data based on Filter
    const trendData = useMemo(() => {
        const filtered = rawRequests.filter(r => new Date(r.createdAt).getFullYear() === yearFilter);
        const labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const data = [0, 0, 0, 0, 0];

        filtered.forEach(r => {
            const day = new Date(r.createdAt).getDay(); // 0-6
            // Map Mon(1) -> 0, Fri(5) -> 4
            if (day >= 1 && day <= 5) {
                data[day - 1]++;
            }
        });

        // If no data, max is 10 to avoid division by zero visuals
        const max = Math.max(...data, 5); 
        return { labels, data, max };
    }, [rawRequests, yearFilter]);

    const availableYears = useMemo(() => {
        const years = new Set(rawRequests.map(r => new Date(r.createdAt).getFullYear()));
        years.add(new Date().getFullYear());
        return Array.from(years).sort((a,b) => b-a);
    }, [rawRequests]);


    if (loading) return <div className="h-64 flex items-center justify-center text-slate-500"><FaSpinner className="animate-spin text-2xl"/></div>;

    return (
        <div className="grid lg:grid-cols-2 gap-6 animate-fadeIn">
            {/* Activity Trend - Line Chart */}
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm flex flex-col">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg text-white flex items-center gap-2"><FaChartBar className="text-emerald-500"/> Activity Trend</h3>
                    
                    {/* Year Filter */}
                    <div className="relative">
                        <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"/>
                        <select 
                            value={yearFilter} 
                            onChange={(e) => setYearFilter(Number(e.target.value))}
                            className="bg-slate-900 border border-slate-600 text-slate-300 text-xs rounded pl-8 pr-2 py-1.5 outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                        >
                            {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                 </div>
                 
                 <div className="flex-1 flex flex-col justify-end min-h-[200px] relative mt-4">
                     {/* SVG Line Chart */}
                     <svg className="w-full h-full text-emerald-500 overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
                         {/* Grid Lines (Optional) */}
                         <line x1="0" y1="50" x2="500" y2="50" stroke="#334155" strokeWidth="1" strokeDasharray="4"/>
                         <line x1="0" y1="100" x2="500" y2="100" stroke="#334155" strokeWidth="1" strokeDasharray="4"/>
                         <line x1="0" y1="150" x2="500" y2="150" stroke="#334155" strokeWidth="1" strokeDasharray="4"/>

                         {/* Path */}
                         <path 
                             d={`M ${trendData.data.map((val, i) => {
                                 const x = (i / 4) * 500; // 5 points
                                 const y = 200 - ((val / trendData.max) * 180); // Leave 20px padding at bottom
                                 return `${x} ${y}`;
                             }).join(' L ')}`}
                             fill="none"
                             stroke="currentColor"
                             strokeWidth="3"
                             className="drop-shadow-lg"
                         />

                         {/* Indicators (Dots) + Tooltips */}
                         {trendData.data.map((val, i) => {
                             const x = (i / 4) * 500;
                             const y = 200 - ((val / trendData.max) * 180);
                             return (
                                 <g key={i} className="group cursor-pointer">
                                     <circle cx={x} cy={y} r="5" fill="#10b981" stroke="#0f172a" strokeWidth="2" className="group-hover:r-7 transition-all"/>
                                     {/* Tooltip Label above dot */}
                                     <text x={x} y={y - 15} textAnchor="middle" fill="#fff" fontSize="12" className="opacity-0 group-hover:opacity-100 transition-opacity font-bold bg-black">
                                         {val}
                                     </text>
                                 </g>
                             );
                         })}
                     </svg>
                     
                     {/* X-Axis Labels */}
                     <div className="flex justify-between mt-4 text-xs text-slate-400">
                         {trendData.labels.map((label, i) => (
                             <span key={i} style={{ width: '20px', textAlign: 'center' }}>{label}</span>
                         ))}
                     </div>
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
