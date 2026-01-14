"use client";

import { mockUser } from "@/lib/mockData";
import { FaUserEdit, FaCog, FaHistory, FaDownload, FaPhoneAlt, FaClock, FaUniversity, FaSignOutAlt } from "react-icons/fa";
import Link from "next/link";

interface UserProfileProps {
  user?: any; // Add this if you want to keep the user prop
}

export default function UserProfile({ user }: UserProfileProps) {
  const displayUser = user || mockUser;

  return (
    <div className="h-full overflow-y-auto pb-20 p-6 bg-slate-900 scrollbar-hide">
      
      {/* Profile Card */}
      <div className="bg-slate-800 rounded-2xl shadow-lg border border-slate-700 p-8 mb-8 flex flex-col items-center text-center relative overflow-hidden group">
        <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-slate-700/50 to-transparent"></div>
        
        <div className="w-28 h-28 rounded-full bg-slate-700 overflow-hidden mb-4 ring-4 ring-slate-600 shadow-2xl relative z-10 group-hover:ring-emerald-500 transition-all duration-500 group-hover:scale-105">
            <img 
                src={user?.fullName ? `https://ui-avatars.com/api/?name=${user.fullName.replace(/\s+/g, "+")}&background=10b981&color=fff&bold=true&size=128` : mockUser.avatarUrl} 
                alt={displayUser.fullName || displayUser.name} 
                className="w-full h-full object-cover" 
            />
        </div>
        <h2 className="text-2xl font-bold text-white relative z-10">{displayUser.fullName || displayUser.name}</h2>
        <p className="text-slate-400 text-sm mb-3 relative z-10 font-medium">{displayUser.email}</p>
        <div className="relative z-10">
            <span className="text-emerald-400 text-xs font-bold bg-emerald-900/30 border border-emerald-500/30 px-4 py-1.5 rounded-full shadow-sm shadow-emerald-900/20">
                {displayUser.address}
            </span>
        </div>
        <button className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-slate-900/50 border border-slate-600 rounded-xl text-sm font-bold text-slate-300 hover:bg-emerald-600 hover:text-white hover:border-emerald-500 transition-all duration-300 relative z-10 hover:shadow-lg hover:shadow-emerald-900/20">
            <FaUserEdit /> Edit Profile
        </button>
      </div>
      {/* Settings & Activity */}
      <div className="grid gap-4 mb-8">
        <h3 className="text-xs font-bold text-slate-500 uppercase px-1 tracking-wider">Account Settings</h3>
        <button className="flex items-center justify-between p-4 bg-slate-800 rounded-xl border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-700/50 transition-all group shadow-sm">
            <div className="flex items-center gap-4">
                <div className="p-2.5 bg-slate-900 text-purple-400 rounded-lg group-hover:bg-purple-500 group-hover:text-white transition-colors border border-slate-700 group-hover:border-purple-500"><FaCog /></div>
                <span className="font-medium text-slate-200 group-hover:text-white">Notification Settings</span>
            </div>
            <span className="text-slate-500 text-xs font-mono group-hover:text-purple-300">Email, SMS</span>
        </button>
        <button className="flex items-center justify-between p-4 bg-slate-800 rounded-xl border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-700/50 transition-all group shadow-sm">
            <div className="flex items-center gap-4">
                <div className="p-2.5 bg-slate-900 text-blue-400 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors border border-slate-700 group-hover:border-blue-500"><FaHistory /></div>
                <span className="font-medium text-slate-200 group-hover:text-white">Activity History</span>
            </div>
        </button>
        
        <button className="flex items-center justify-between p-4 bg-slate-800 rounded-xl border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-700/50 transition-all group shadow-sm">
            <div className="flex items-center gap-4">
                <div className="p-2.5 bg-slate-900 text-emerald-400 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition-colors border border-slate-700 group-hover:border-emerald-500"><FaDownload /></div>
                <span className="font-medium text-slate-200 group-hover:text-white">Download Reports (PDF)</span>
            </div>
        </button>
      </div>
      
      {/* Community Directory */}
     

    </div>
  );
}
