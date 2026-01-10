"use client";

import { useState } from "react";
import { FaMapMarkedAlt, FaClipboardList, FaBullhorn, FaUser, FaPlus, FaBell, FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";
import ResidentMap from "@/app/components/ResidentMap";
import RequestTracker from "@/app/components/RequestTracker";
import CommunityBoard from "@/app/components/CommunityBoard";
import UserProfile from "@/app/components/UserProfile";
import ServiceRequestModal from "@/app/components/ServiceRequestModal";
import Link from "next/link";

export default function ResidentDashboard() {
  const [activeTab, setActiveTab] = useState<'map' | 'requests' | 'community' | 'profile'>('map');
  const [showReportModal, setShowReportModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleNavClick = (tab: 'map' | 'requests' | 'community' | 'profile') => {
      setActiveTab(tab);
      closeSidebar();
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* Sidebar (Desktop: Static, Mobile: Drawer) */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="h-16 flex items-center px-6 border-b border-gray-100 bg-emerald-600">
                <div className="w-8 h-8 bg-white text-emerald-600 rounded-lg flex items-center justify-center mr-3">
                    <FaMapMarkedAlt />
                </div>
                <h1 className="font-bold text-white text-lg">Bayanan<span className="text-emerald-200">Connect</span></h1>
                <button onClick={closeSidebar} className="md:hidden ml-auto text-white p-1">
                    <FaTimes />
                </button>
            </div>

            {/* User Info (Sidebar) */}
            <div className="p-6 border-b border-gray-100 bg-emerald-50/50">
               <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-white border-2 border-emerald-200 p-0.5">
                       <img src="https://ui-avatars.com/api/?name=Juan+Dela+Cruz" alt="Profile" className="rounded-full" />
                   </div>
                   <div>
                       <p className="text-sm font-bold text-gray-800">Juan Dela Cruz</p>
                       <p className="text-xs text-emerald-600">Resident</p>
                   </div>
               </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                <SidebarButton 
                    active={activeTab === 'map'} 
                    onClick={() => handleNavClick('map')} 
                    icon={<FaMapMarkedAlt />} 
                    label="Live Map" 
                />
                <SidebarButton 
                    active={activeTab === 'requests'} 
                    onClick={() => handleNavClick('requests')} 
                    icon={<FaClipboardList />} 
                    label="My Requests" 
                />
                <SidebarButton 
                    active={activeTab === 'community'} 
                    onClick={() => handleNavClick('community')} 
                    icon={<FaBullhorn />} 
                    label="Community Board" 
                />
                <SidebarButton 
                    active={activeTab === 'profile'} 
                    onClick={() => handleNavClick('profile')} 
                    icon={<FaUser />} 
                    label="My Profile" 
                />
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-gray-100">
                <Link href="/login" className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm">
                    <FaSignOutAlt /> Sign Out
                </Link>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        
        {/* Mobile Header (Hamburger) */}
        <header className="md:hidden bg-white shadow-sm z-20 px-4 py-3 flex items-center justify-between">
            <button onClick={toggleSidebar} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <FaBars className="text-xl" />
            </button>
            <span className="font-bold text-gray-700">
                {activeTab === 'map' && 'Live Map'}
                {activeTab === 'requests' && 'My Requests'}
                {activeTab === 'community' && 'Community'}
                {activeTab === 'profile' && 'Profile'}
            </span>
            <button className="p-2 text-gray-500 relative">
                <FaBell />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
        </header>

        {/* Viewport */}
        <main className="flex-1 relative overflow-hidden bg-gray-100">
            {activeTab === 'map' && <ResidentMap onReportClick={() => setShowReportModal(true)} />}
            {activeTab === 'requests' && <RequestTracker />}
            {activeTab === 'community' && <CommunityBoard />}
            {activeTab === 'profile' && <UserProfile />}
            
            {/* FAB (Only on Map view or always? Keep it standard) */}
             <button 
                onClick={() => setShowReportModal(true)}
                className="absolute bottom-8 right-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-4 shadow-lg z-30 transition-transform active:scale-95 flex items-center gap-2 group"
            >
                <FaPlus className="text-xl" />
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap">Report Issue</span>
            </button>
        </main>

      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={closeSidebar}
          ></div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <ServiceRequestModal onClose={() => setShowReportModal(false)} />
      )}
    </div>
  );
}

const SidebarButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
      active 
        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' 
        : 'text-gray-500 hover:bg-emerald-50 hover:text-emerald-600'
    }`}
  >
    <div className={`text-lg ${active ? 'text-white' : 'text-gray-400 group-hover:text-emerald-600'}`}>
        {icon}
    </div>
    <span className="font-medium text-sm">{label}</span>
  </button>
);
