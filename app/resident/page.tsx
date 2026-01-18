"use client";

import { useState, useEffect } from "react";
import { 
  FaMapMarkedAlt, 
  FaClipboardList, 
  FaBullhorn, 
  FaUser, 
  FaPlus, 
  FaBell, 
  FaBars, 
  FaTimes, 
  FaSignOutAlt,
  FaSpinner 
} from "react-icons/fa";
import ResidentMap from "@/app/components/ResidentMap";
import RequestTracker from "@/app/components/RequestTracker";
import CommunityBoard from "@/app/components/CommunityBoard";
import UserProfile from "@/app/components/UserProfile";
import ServiceRequestModal from "@/app/components/ServiceRequestModal";
import NotificationCenter from "@/app/components/NotificationCenter";
import ProtectedRoute from "@/app/components/ProtectedRoutes";
import { useAuth } from "@/app/context/AuthContext";

function ResidentDashboardContent() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"map" | "requests" | "community" | "profile">("map");
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleNavClick = (tab: "map" | "requests" | "community" | "profile") => {
    setActiveTab(tab);
    closeSidebar();
  };

  const handleLogout = async () => {
    await logout();
  };

  // When clicking report on map
  const handleMapReport = (lat: number, lng: number) => {
      setSelectedLocation({ lat, lng });
      setShowReportModal(true);
  };

  // When clicking the big FAB
  const handleFabClick = () => {
      // Try to get current location or just null (modal defaults to Bayanan center)
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
              (pos) => {
                  setSelectedLocation({
                      lat: pos.coords.latitude,
                      lng: pos.coords.longitude
                  });
                  setShowReportModal(true);
              },
              (err) => {
                  console.log("Loc error", err);
                  setSelectedLocation(null);
                  setShowReportModal(true);
              }
          );
      } else {
          setSelectedLocation(null);
          setShowReportModal(true);
      }
  };

  const handleReportSuccess = () => {
      setShowReportModal(false);
      setActiveTab("requests");
  };

  // Add welcome notification
  useEffect(() => {
    if (user) {
      console.log(`Welcome to BayananConnect, ${user.fullName}!`);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-emerald-500 mx-auto mb-4" />
          <p className="text-slate-400 font-medium">Loading command center...</p>
        </div>
      </div>
    );
  }

  // Generate avatar from user name
  const getAvatarUrl = () => {
    const name = user.fullName.replace(/\s+/g, "+");
    return `https://ui-avatars.com/api/?name=${name}&background=10b981&color=fff&bold=true&size=128`;
  };

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden text-slate-200 font-sans selection:bg-emerald-500/30">
      
      {/* Sidebar (Desktop: Static, Mobile: Drawer) */}
      <aside    
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-800 border-r border-slate-700 transform transition-transform duration-300 ease-in-out md:translate-x-0 shadow-2xl ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-full h-40 bg-emerald-600/10 blur-[60px] pointer-events-none"></div>

            {/* Sidebar Header */}
            <div className="h-20 flex items-center px-6 border-b border-slate-700/50 relative z-10">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-emerald-900/40 transform transition-transform hover:scale-105 hover:rotate-3">
                    <FaMapMarkedAlt className="text-xl"/>
                </div>
                <div>
                  <h1 className="font-bold text-white text-lg leading-tight tracking-tight">Bayanan<span className="text-emerald-400">Connect</span></h1>
                  <span className="text-[10px] text-emerald-500/80 uppercase tracking-widest font-bold">Resident Portal</span>
                </div>
                <button onClick={closeSidebar} className="md:hidden ml-auto text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-700 rounded-lg">
                    <FaTimes />
                </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Menu</p>
                <SidebarButton 
                    active={activeTab === "map"} 
                    onClick={() => handleNavClick("map")} 
                    icon={<FaMapMarkedAlt />} 
                    label="Live Map" 
                />
                <SidebarButton 
                    active={activeTab === "requests"} 
                    onClick={() => handleNavClick("requests")} 
                    icon={<FaClipboardList />} 
                    label="My Requests" 
                />
                <SidebarButton 
                    active={activeTab === "community"} 
                    onClick={() => handleNavClick("community")} 
                    icon={<FaBullhorn />} 
                    label="Community Board" 
                />
                
                <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-6">Account</p>
                <SidebarButton 
                    active={activeTab === "profile"} 
                    onClick={() => handleNavClick("profile")} 
                    icon={<FaUser />} 
                    label="My Profile" 
                />
            </nav>

            {/* User Profile Snippet (Bottom) */}
             <div className="p-4 border-t border-slate-700 bg-slate-800/80 backdrop-blur-sm">
               <div className="flex items-center gap-3 mb-4 p-2 rounded-xl bg-slate-900/50 border border-slate-700/50">
                   <div className="w-9 h-9 rounded-full border border-slate-600 p-0.5 relative">
                       <img 
                         src={getAvatarUrl()} 
                         alt={user.fullName} 
                         className="rounded-full w-full h-full object-cover" 
                       />
                       <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
                   </div>
                   <div className="overflow-hidden">
                       <p className="text-sm font-bold text-slate-200 truncate">{user.fullName}</p>
                       <p className="text-[10px] text-emerald-500 font-medium uppercase tracking-wide">Verified Resident</p>
                   </div>
               </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-all duration-200 font-medium text-xs w-full border border-transparent hover:border-red-500/20 group"
                >
                    <FaSignOutAlt className="group-hover:-translate-x-1 transition-transform" /> Sign Out
                </button>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64 relative bg-slate-900">
        
        {/* Mobile Header */}
        <header className="md:hidden bg-slate-800/90 backdrop-blur-md border-b border-slate-700 shadow-sm z-20 px-4 py-3 flex items-center justify-between sticky top-0">
            <button onClick={toggleSidebar} className="p-2 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700/50">
                <FaBars className="text-lg" />
            </button>
            <span className="font-bold text-slate-200 text-sm uppercase tracking-wide">
                {activeTab === "map" && "Live Map"}
                {activeTab === "requests" && "Requests"}
                {activeTab === "community" && "Community"}
                {activeTab === "profile" && "Profile"}
            </span>
            <NotificationCenter userId={user.id} />
        </header>

        {/* Viewport */}
        <main className="flex-1 relative overflow-hidden bg-slate-900">
            {/* Top Bar (Desktop Only) */}
             <div className="hidden md:flex items-center justify-between px-8 py-6 border-b border-slate-800 bg-slate-900/95 z-10 sticky top-0">
                <div>
                   <h2 className="text-2xl font-bold text-white tracking-tight">
                    Welcome back, <span className="text-emerald-400">{user.fullName.split(" ")[0]}</span>
                  </h2>
                  <p className="text-slate-500 text-sm flex items-center gap-2 mt-1 font-medium">
                     <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                     </span>
                     System Operational • {user.address}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                     <NotificationCenter userId={user.id} />
                </div>
             </div>

            {/* Dashboard Content Container */}
            <div className="h-[calc(100%-60px)] md:h-[calc(100%-96px)] relative overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900"> 
               <div className="animate-fadeIn h-full"> 
                  {/* Content rendered here needs to be dark-mode aware */}
                  {activeTab === "map" && <ResidentMap onReportClick={handleMapReport} user={user} />}
                  {activeTab === "requests" && <RequestTracker userId={user.id} />}
                  {activeTab === "community" && <CommunityBoard />}
                  {activeTab === "profile" && <UserProfile />}
               </div>
            </div>
            
            {/* Floating Action Button */}
            <button 
              onClick={handleFabClick}
              className="absolute bottom-6 right-6 md:bottom-10 md:right-10 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded-full p-4 shadow-xl shadow-emerald-900/40 z-30 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-3 group border border-emerald-400/30"
            >
                <FaPlus className="text-xl group-hover:rotate-90 transition-transform duration-300" />
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap font-bold">Report Issue</span>
            </button>
        </main>

      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-30 md:hidden"
            onClick={closeSidebar}
          ></div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <ServiceRequestModal 
          onClose={() => setShowReportModal(false)}
          onSuccess={handleReportSuccess}
          location={selectedLocation}
        />
      )}
    </div>
  );
}

const SidebarButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
      active 
        ? "text-white shadow-lg shadow-emerald-900/20" 
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    }`}
  >
    {active && (
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/90 to-emerald-600/70 border border-emerald-500/30 rounded-xl"></div>
    )}
    
    <div className={`text-lg transition-transform duration-300 relative z-10 ${active ? "scale-110" : "group-hover:scale-110 group-hover:text-emerald-400"}`}>
        {icon}
    </div>
    <span className={`font-medium text-sm tracking-wide relative z-10 ${active ? "" : "group-hover:translate-x-1 transition-transform"}`}>{label}</span>
    
    {/* Active indicator dot */}
    {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-sm shadow-emerald-200 relative z-10"></div>}
  </button>
);

// Main export with ProtectedRoute wrapper
export default function ResidentDashboard() {
  return (
    <ProtectedRoute>
      <ResidentDashboardContent />
    </ProtectedRoute>
  );
}
