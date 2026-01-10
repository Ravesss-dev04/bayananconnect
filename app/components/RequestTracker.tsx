"use client";

import { mockRequests } from "@/lib/mockData";
import { FaCircle, FaMapMarkerAlt, FaCalendar } from "react-icons/fa";

export default function RequestTracker() {
  const myRequests = mockRequests; // In real app, filter by user ID

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'text-yellow-500 bg-yellow-50';
      case 'In Progress': return 'text-blue-500 bg-blue-50';
      case 'Completed': return 'text-emerald-500 bg-emerald-50';
      case 'Cancelled': return 'text-red-500 bg-red-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="h-full overflow-y-auto pb-20 p-4 bg-gray-50">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 px-1">My Requests <span className="text-sm font-normal text-gray-500 ml-2">({myRequests.length})</span></h2>
      
      <div className="space-y-4">
        {myRequests.map((req) => (
          <div key={req.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-xs font-mono text-gray-400">#{req.id}</span>
                <h3 className="font-bold text-gray-800 text-lg">{req.type}</h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border border-transparent ${getStatusColor(req.status)}`}>
                {req.status}
              </span>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{req.description}</p>

            <div className="flex flex-col gap-2 text-sm text-gray-500 mb-4 ">
                <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-gray-400" />
                    <span>{req.location.address}</span>
                </div>
                <div className="flex items-center gap-2">
                    <FaCalendar className="text-gray-400" />
                    <span>{new Date(req.dateSubmitted).toLocaleDateString()}</span>
                </div>
            </div>

            {/* Timeline Mini-View */}
            <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span>Timeline</span>
                    {req.estimatedCompletion && <span className="text-blue-600 font-medium">Est. Finish: {req.estimatedCompletion}</span>}
                </div>
                <div className="relative flex items-center justify-between">
                    <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-100 -z-10"></div>
                    {['Pending', 'In Progress', 'Completed'].map((step, idx) => {
                        const isCompleted = ['Pending', 'In Progress', 'Completed'].indexOf(req.status) >= idx;
                        const isCurrent = req.status === step;
                        return (
                            <div key={step} className="flex flex-col items-center gap-1 bg-white px-1">
                                <div className={`w-3 h-3 rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-gray-200'} ${isCurrent ? 'ring-2 ring-emerald-100 ring-offset-1' : ''}`}></div>
                                <span className={`text-[10px] ${isCompleted ? 'text-gray-800 font-medium' : 'text-gray-300'}`}>{step}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
            
            <div className="mt-4 flex gap-2">
                 <button className="flex-1 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">View Details</button>
                 {req.status === 'Completed' && (
                     <button className="flex-1 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">Rate Service</button>
                 )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
