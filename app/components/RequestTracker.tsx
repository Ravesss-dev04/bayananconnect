"use client";

import { useEffect, useState } from "react";
import { FaCircle, FaMapMarkerAlt, FaCalendar, FaSpinner, FaInbox } from "react-icons/fa";

interface RequestTrackerProps {
  userId?: string;
}

export default function RequestTracker({userId}: RequestTrackerProps) {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
        const res = await fetch("/api/requests/list");
        if (res.ok) {
            const data = await res.json();
            setRequests(data.requests);
        }
    } catch (e) {
        console.error("Failed to fetch requests", e);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "text-yellow-400 bg-yellow-900/30 border-yellow-700/50";
      case "In Progress": return "text-blue-400 bg-blue-900/30 border-blue-700/50";
      case "Resolved": return "text-emerald-400 bg-emerald-900/30 border-emerald-700/50";
      case "Rejected": return "text-red-400 bg-red-900/30 border-red-700/50";
      default: return "text-slate-400 bg-slate-800 border-slate-700";
    }
  };

  if (loading) {
      return (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <FaSpinner className="animate-spin text-3xl mb-3 text-emerald-500" />
              <p>Loading your requests...</p>
          </div>
      );
  }

  return (
    <div className="h-full overflow-y-auto pb-20 p-6 bg-slate-900 scrollbar-hide">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            My Requests 
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-xs font-medium text-slate-400 border border-slate-700">{requests.length}</span>
        </h2>
        <button onClick={fetchRequests} className="text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors">Refresh List</button>
      </div>
      
      {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/50">
              <FaInbox className="text-6xl mb-4 opacity-20" />
              <p className="font-medium">No requests found</p>
              <p className="text-sm">Start by reporting an issue using the + button.</p>
          </div>
      ) : (
        <div className="grid gap-4">
            {requests.map((req) => (
            <div key={req.id} className="bg-slate-800 rounded-xl p-5 border border-slate-700 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-900/10 transition-all group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-slate-700 to-transparent group-hover:from-emerald-500 transition-colors"></div>
                
                <div className="flex justify-between items-start mb-3 pl-2">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-white text-lg group-hover:text-emerald-400 transition-colors">{req.type}</h3>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border ${getStatusColor(req.status)}`}>
                                {req.status}
                            </span>
                        </div>
                         <span className="text-xs font-mono text-slate-500">ID: {req.id.substring(0, 8)}</span>
                    </div>
                </div>

                <p className="text-slate-400 text-sm mb-4 pl-2 leading-relaxed border-l-2 border-slate-700 ml-1 py-1 pr-4">{req.description}</p>
                 
                {req.imageUrl && (
                    <div className="mb-4 pl-2">
                        <img src={req.imageUrl} alt="Evidence" className="h-32 w-full object-cover rounded-lg border border-slate-600 opacity-80 group-hover:opacity-100 transition-opacity" />
                    </div>
                )}

                <div className="flex items-center justify-between text-xs text-slate-500 pl-2 mt-4 border-t border-slate-700/50 pt-3">
                    <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-emerald-600" />
                        <span>{req.latitude.substring(0,8)}, {req.longitude.substring(0,9)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaCalendar className="text-slate-600" />
                        <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
            ))}
        </div>
      )}
    </div>
  );
}
