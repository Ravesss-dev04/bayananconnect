"use client";

import { useState, useEffect } from "react";
import { 
  FaChartPie, FaClipboardList, FaMapMarkedAlt, 
  FaVideo, FaTruck, FaLayerGroup, FaBars, FaSearch, FaBell, FaSignOutAlt, FaCog,
  FaSpinner, FaBullhorn
} from "react-icons/fa";

// Import Modular Components
import DashboardOverview from "@/app/components/admin/DashboardOverview";
import Requests from "@/app/components/admin/Requests";
import Feedback from "@/app/components/admin/Feedback";
// Dynamically import map components to avoid "window is not defined" error during build
import dynamic from 'next/dynamic';
const GISMap = dynamic(() => import("@/app/components/admin/GISMap"), { 
  ssr: false,
  loading: () => <div className="h-[calc(100vh-140px)] flex items-center justify-center bg-slate-800 text-slate-500 rounded-2xl border border-slate-700"><FaSpinner className="animate-spin text-3xl"/></div>
});
import Analytics from "@/app/components/admin/Analytics";
import CCTVMonitoring from "@/app/components/admin/CCTVMonitoring";
import Settings from "@/app/components/admin/Settings";

const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
      active 
        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/20' 
        : 'text-gray-400 hover:bg-slate-800 hover:text-emerald-400'
    }`}
  >
    <Icon className={`text-lg ${active ? 'text-white' : 'text-gray-500 group-hover:text-emerald-400'}`} />
    <span className="font-medium text-sm">{label}</span>
  </button>
);

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [adminEmail, setAdminEmail] = useState<string>("");
    const [loading, setLoading] = useState(true);

    // Check if admin is logged in
    useEffect(() => {
        checkAdminAuth();
    }, []);

    const checkAdminAuth = async () => {
        try {
            const response = await fetch('/api/admin/check');
            const data = await response.json();
            
            if (data.loggedIn) {
                setAdminEmail(data.email || "Administrator");
            } else {
                window.location.href = '/admin/login';
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            window.location.href = '/admin/login';
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/admin/logout', { method: 'POST' });
            window.location.href = '/admin/login';
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const renderContent = () => {
        switch(activeTab) {
            case 'dashboard': return <DashboardOverview />;
            case 'requests': return <Requests />;
            case 'feedback': return <Feedback />;
            case 'gis': return <GISMap />;
            case 'analytics': return <Analytics />;
            case 'settings': return <Settings />;
            default: return <DashboardOverview />;
        }
    };

    // Show loading while checking auth
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-950 to-slate-950"></div>
                <div className="text-center z-10 animate-scaleIn">
                    <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-6"></div>
                    <h2 className="text-xl font-bold text-white tracking-wide">Bayanan Connect</h2>
                    <p className="text-emerald-500/80 text-sm mt-2">Verifying Credentials...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-950 text-gray-100 font-sans selection:bg-emerald-500/30 overflow-hidden">
            {/* Background Gradient */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/10 via-slate-950 to-slate-950 pointer-events-none z-0"></div>

            {/* Sidebar Desktop */}
            <aside className={`fixed lg:relative inset-y-0 left-0 z-50 w-72 bg-slate-950/80 backdrop-blur-xl border-r border-slate-800 transition-all duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20 lg:hover:w-72'} group/sidebar shadow-2xl`}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/50 bg-slate-900/20">
                    <div className={`flex items-center gap-3 overflow-hidden whitespace-nowrap transition-all duration-300 ${!isSidebarOpen && 'lg:opacity-0'}`}>
                         <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20">B</div>
                         <div>
                            <h1 className="text-sm font-bold text-white tracking-wide">BAYANAN</h1>
                            <p className="text-[10px] text-emerald-500 font-mono tracking-wider">ADMIN CONSOLE</p>
                         </div>
                    </div>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-500 hover:text-white transition-colors lg:hidden">
                        <FaBars />
                    </button>
                </div>

                {/* Admin Info */}
                <div className={`p-4 border-b border-slate-800/50 transition-all duration-300 overflow-hidden whitespace-nowrap ${!isSidebarOpen ? 'items-center justify-center p-2' : ''}`}>
                    <div className={`flex items-center gap-3 p-2 rounded-xl bg-slate-900/40 border border-slate-800/50 ${!isSidebarOpen && 'justify-center border-0 bg-transparent'}`}>
                        <div className="w-10 h-10 min-w-[2.5rem] rounded-full bg-slate-800 border-2 border-emerald-500/30 flex items-center justify-center text-white font-bold text-sm shadow-lg relative">
                            {adminEmail?.charAt(0).toUpperCase() || 'A'}
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
                        </div>
                        <div className={`transition-opacity duration-200 ${!isSidebarOpen && 'lg:hidden'}`}>
                            <p className="text-sm font-bold text-white truncate max-w-[140px]">{adminEmail || 'Administrator'}</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Super Admin</p>
                        </div>
                    </div>
                </div>

                <div className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-180px)] scrollbar-thin-custom">
                    <div className={`px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest transition-opacity ${!isSidebarOpen && 'lg:hidden'}`}>Main</div>
                    <SidebarItem icon={FaChartPie} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                    <SidebarItem icon={FaMapMarkedAlt} label="GIS Map" active={activeTab === 'gis'} onClick={() => setActiveTab('gis')} />
                    
                    <div className={`px-3 py-2 mt-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest transition-opacity ${!isSidebarOpen && 'lg:hidden'}`}>Operations</div>
                    <SidebarItem icon={FaClipboardList} label="Requests" active={activeTab === 'requests'} onClick={() => setActiveTab('requests')} />
                    
                    <div className={`px-3 py-2 mt-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest transition-opacity ${!isSidebarOpen && 'lg:hidden'}`}>Community</div>
                    <SidebarItem icon={FaBullhorn} label="Feedback" active={activeTab === 'feedback'} onClick={() => setActiveTab('feedback')} />
                    
                    <div className={`px-3 py-2 mt-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest transition-opacity ${!isSidebarOpen && 'lg:hidden'}`}>Analysis</div>
                    <SidebarItem icon={FaLayerGroup} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
                </div>

                <div className="absolute bottom-0 w-full bg-slate-950/90 backdrop-blur-sm border-t border-slate-800/50">
                    <div className="p-2 border-b border-slate-800/50">
                        <SidebarItem icon={FaCog} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                    </div>
                    <div className="p-4">
                        <button 
                            onClick={handleLogout}
                            className={`group flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all w-full ${!isSidebarOpen ? 'justify-center' : ''}`}
                        >
                            <FaSignOutAlt className="group-hover:rotate-180 transition-transform duration-300"/>
                            <span className={`${!isSidebarOpen && 'lg:hidden'} font-medium text-sm`}>Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
                {/* Header Mobile */}
                <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 lg:hidden">
                    <h1 className="font-bold text-white">Dashboard</h1>
                    <button onClick={() => setIsSidebarOpen(true)} className="text-slate-400 hover:text-white">
                        <FaBars />
                    </button>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto scrollbar-thin-custom p-4 lg:p-8">
                     <div className="max-w-[1600px] mx-auto animate-fadeIn">
                        {renderContent()}
                     </div>
                </div>
            </main>
        </div>
    );
}