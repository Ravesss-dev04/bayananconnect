"use client";

import { mockAnnouncements, mockPolls } from "@/lib/mockData";
import { FaBullhorn, FaPoll, FaStar, FaCommentDots } from "react-icons/fa";

export default function CommunityBoard() {
  return (
    <div className="h-full overflow-y-auto pb-20 p-4 bg-gray-50 space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Community Board</h2>
      </div>

      {/* Give Feedback Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
        <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">How are we doing?</h3>
            <p className="text-emerald-100 text-sm mb-4">Rate our barangay services and help us improve.</p>
            <button className="bg-white text-emerald-600 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
                <FaStar /> Give Feedback
            </button>
        </div>
        <FaCommentDots className="absolute -right-4 -bottom-4 text-8xl text-emerald-500 opacity-30 rotate-12" />
      </div>

      {/* Active Polls */}
      <div>
        <div className="flex items-center gap-2 mb-3">
            <FaPoll className="text-blue-500" />
            <h3 className="font-bold text-gray-700">Active Polls</h3>
        </div>
        {mockPolls.map(poll => (
            <div key={poll.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h4 className="font-semibold text-gray-800 mb-4">{poll.question}</h4>
                <div className="space-y-3">
                    {poll.options.map(opt => (
                        <div key={opt.id} className="relative">
                            <div className="flex justify-between text-sm mb-1 text-gray-600">
                                <span>{opt.text}</span>
                                <span className="font-medium">{opt.votes} votes</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5">
                                <div 
                                    className="bg-blue-500 h-2.5 rounded-full transition-all duration-1000" 
                                    style={{ width: `${(opt.votes / 50) * 100}%` }} // Simplified percentage
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="w-full mt-4 py-2 text-blue-600 text-sm font-medium border border-blue-100 rounded-lg hover:bg-blue-50 transition-colors">
                    Vote Now
                </button>
            </div>
        ))}
      </div>

      {/* Announcements */}
      <div>
        <div className="flex items-center gap-2 mb-3">
            <FaBullhorn className="text-orange-500" />
            <h3 className="font-bold text-gray-700">Announcements</h3>
        </div>
        <div className="space-y-3">
            {mockAnnouncements.map(ann => (
                <div key={ann.id} className={`bg-white rounded-xl shadow-sm border-l-4 p-4 ${ann.type === 'alert' ? 'border-red-500' : 'border-blue-500'}`}>
                    <div className="flex justify-between items-start mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${ann.type === 'alert' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                            {ann.type}
                        </span>
                        <span className="text-xs text-gray-400">{new Date(ann.date).toLocaleDateString()}</span>
                    </div>
                    <h4 className="font-bold text-gray-800 mb-1">{ann.title}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{ann.content}</p>
                </div>
            ))}
        </div>
      </div>

    </div>
  );
}
