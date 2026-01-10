"use client";

import { mockUser } from "@/lib/mockData";
import { FaUserEdit, FaCog, FaHistory, FaDownload, FaPhoneAlt, FaClock, FaUniversity, FaSignOutAlt } from "react-icons/fa";
import Link from "next/link";

export default function UserProfile() {
  return (
    <div className="h-full overflow-y-auto pb-20 p-4 bg-gray-50">
      
      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-4 ring-4 ring-emerald-50">
            <img src={mockUser.avatarUrl} alt={mockUser.name} className="w-full h-full object-cover" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">{mockUser.name}</h2>
        <p className="text-gray-500 text-sm mb-1">{mockUser.email}</p>
        <p className="text-emerald-600 text-xs font-medium bg-emerald-50 px-3 py-1 rounded-full">{mockUser.address}</p>
        
        <button className="mt-4 flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <FaUserEdit /> Edit Profile
        </button>
      </div>

      {/* Settings & Activity */}
      <div className="grid gap-3 mb-8">
        <h3 className="text-sm font-bold text-gray-500 uppercase px-1">Account</h3>
        
        <button className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors group">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg group-hover:bg-purple-200 transition-colors"><FaCog /></div>
                <span className="font-medium text-gray-700">Notification Settings</span>
            </div>
            <span className="text-gray-400 text-sm">Email, SMS</span>
        </button>

        <button className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors group">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-200 transition-colors"><FaHistory /></div>
                <span className="font-medium text-gray-700">Activity History</span>
            </div>
        </button>

        <button className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors group">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg group-hover:bg-green-200 transition-colors"><FaDownload /></div>
                <span className="font-medium text-gray-700">Download My Reports (PDF)</span>
            </div>
        </button>
      </div>
      {/* Community Directory (Feature 8) */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-500 uppercase px-1 mb-3">Community Directory</h3>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
            
            <div className="p-4 flex items-start gap-4">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><FaUniversity /></div>
                <div>
                    <h4 className="font-bold text-gray-800 text-sm">Barangay Secretariat</h4>
                    <p className="text-xs text-gray-500 mb-2">For permits, clearances, and general inquiries.</p>
                    <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1 text-gray-600"><FaClock /> 8:00 AM - 5:00 PM</span>
                        <a href="tel:1234567" className="flex items-center gap-1 text-emerald-600 underline"><FaPhoneAlt /> (02) 8123-4567</a>
                    </div>
                </div>
            </div>

            <div className="p-4 flex items-start gap-4">
                <div className="p-2 bg-red-100 text-red-600 rounded-lg"><FaPhoneAlt /></div>
                <div>
                    <h4 className="font-bold text-gray-800 text-sm">Emergency Hotline</h4>
                    <p className="text-xs text-gray-500 mb-2">Fire, Police, and Rescue (24/7)</p>
                    <a href="tel:911" className="text-lg font-bold text-red-600">Dial 911 / (02) 8999-9999</a>
                </div>
            </div>

        </div>
      </div>

      <Link href="/login" className="flex items-center justify-center gap-2 w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl border border-red-100 hover:bg-red-100 transition-colors">
        <FaSignOutAlt /> Log Out
      </Link>

    </div>
  );
}
