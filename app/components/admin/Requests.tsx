"use client";

import { useEffect, useState } from "react";
import { FaTrash, FaCheck, FaExclamationCircle, FaSpinner, FaFilter, FaRedoAlt, FaPlus, FaSearch } from "react-icons/fa";

interface Request {
    id: string;
    type: string;
    description: string;
    status: string;
    createdAt: string;
    userFullName: string | null;
    userAddress: string | null;
}

export default function Requests() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');

    const fetchRequests = async () => {
         setLoading(true);
         try {
            const res = await fetch('/api/admin/requests');
            if (res.ok) {
                const data = await res.json();
                setRequests(data.requests);
                setFilteredRequests(data.requests);
            }
         } catch (error) {
             console.error("Failed to fetch requests", error);
         } finally {
             setLoading(false);
         }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    // Filter logic
    useEffect(() => {
        let res = requests;
        if (filter !== 'All') {
            res = res.filter(r => r.status === filter);
        }
        if (search) {
            const lowerSearch = search.toLowerCase();
            res = res.filter(r => 
                r.description.toLowerCase().includes(lowerSearch) || 
                r.type.toLowerCase().includes(lowerSearch) ||
                (r.userFullName || '').toLowerCase().includes(lowerSearch) ||
                r.id.toLowerCase().includes(lowerSearch)
            );
        }
        setFilteredRequests(res);
    }, [filter, search, requests]);

    const updateStatus = async (id: string, newStatus: string) => {
        setProcessing(id);
        try {
            const res = await fetch('/api/admin/requests/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus })
            });
            if (res.ok) {
                // Optimistic update
                setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
            } else {
                alert('Failed to update status');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setProcessing(null);
        }
    };

    const deleteRequest = async (id: string) => {
        if (!confirm('Are you sure you want to delete this requests? This cannot be undone.')) return;
        setProcessing(id);
        try {
            const res = await fetch(`/api/admin/requests?id=${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setRequests(prev => prev.filter(r => r.id !== id));
            }
        } catch (e) {
            console.error(e);
        } finally {
            setProcessing(null);
        }
    };

    return (
        <div className="glass-panel rounded-2xl animate-fadeIn transition-all duration-300">
            {/* Toolbar */}
            <div className="p-6 border-b border-slate-700/50 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-slate-900/20">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        Central Dispatch 
                        <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">{filteredRequests.length} Active</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">Manage and track resident service requests</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
                    {/* Search */}
                    <div className="relative group flex-1 sm:flex-none">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search requests..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-slate-900/50 border border-slate-700 text-sm rounded-lg pl-9 pr-4 py-2 text-white w-full sm:w-64 focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                    </div>

                    {/* Filter */}
                    <div className="relative flex-1 sm:flex-none">
                        <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <select 
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="bg-slate-900/50 border border-slate-700 text-sm rounded-lg pl-9 pr-8 py-2 text-white w-full focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                        >
                            <option value="All">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>

                 
                    
                 
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-900/40 text-slate-400 uppercase text-xs font-semibold tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Request ID</th>
                            <th className="px-6 py-4">Description</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Reported By</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {loading && (
                            <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500"><FaSpinner className="animate-spin inline-block mr-2"/> Loading Requests...</td></tr>
                        )}
                        {!loading && filteredRequests.length === 0 && (
                            <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">No matching requests found.</td></tr>
                        )}
                        {filteredRequests.map((req, index) => (
                            <tr 
                                key={req.id} 
                                className="hover:bg-slate-800/30 transition-colors group animate-slideIn"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <td className="px-6 py-4 font-mono text-xs text-slate-500 group-hover:text-emerald-400 transition-colors">
                                    #{req.id.slice(0, 8)}...
                                </td>
                                <td className="px-6 py-4">
                                    <div className="max-w-xs truncate text-slate-300 font-medium" title={req.description}>{req.description}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-block bg-slate-800 border border-slate-700 text-slate-300 px-2 py-1 rounded text-xs font-medium">
                                        {req.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-300">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-white text-xs">{req.userFullName || "Unknown Agent"}</span>
                                        <span className="text-[10px] text-slate-500">{new Date(req.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                     <div className="relative">
                                        <select 
                                            disabled={processing === req.id}
                                            value={req.status}
                                            onChange={(e) => updateStatus(req.id, e.target.value)}
                                            className={`appearance-none w-32 bg-slate-900 border border-slate-700 text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer transition-colors ${
                                                ['Resolved', 'Completed'].includes(req.status) ? 'text-emerald-400 border-emerald-900/50 bg-emerald-900/10' :
                                                req.status === 'In Progress' ? 'text-blue-400 border-blue-900/50 bg-blue-900/10' : 
                                                'text-amber-400 border-amber-900/50 bg-amber-900/10'
                                            }`}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Resolved">Resolved</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-[10px]">▼</div>
                                     </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => deleteRequest(req.id)}
                                        disabled={processing === req.id}
                                        className="text-slate-500 hover:text-red-400 hover:bg-red-900/20 transition-all p-2 rounded-lg"
                                        title="Delete Request"
                                    >
                                        {processing === req.id ? <FaSpinner className="animate-spin"/> : <FaTrash size={14} />}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination / Footer Info - Simplified */}
            <div className="p-4 border-t border-slate-700/50 bg-slate-900/30 text-xs text-slate-500 flex justify-between items-center rounded-b-2xl">
                 <span>Showing {filteredRequests.length} of {requests.length} requests</span>
                 <div className="flex gap-2">
                     <button disabled className="px-3 py-1 rounded bg-slate-800 text-slate-600 cursor-not-allowed">Previous</button>
                     <button disabled className="px-3 py-1 rounded bg-slate-800 text-slate-600 cursor-not-allowed">Next</button>
                 </div>
            </div>
        </div>
    );
}
