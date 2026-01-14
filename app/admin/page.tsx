"use client";

import { useState, useEffect } from "react";
import { 
  FaChartPie, FaClipboardList, FaMapMarkedAlt, 
  FaVideo, FaTruck, FaLayerGroup, FaBars, FaSearch, FaBell, FaSignOutAlt, FaCog,
  FaSpinner
} from "react-icons/fa";

// Import Modular Components
import DashboardOverview from "@/app/components/admin/DashboardOverview";
import Requests from "@/app/components/admin/Requests";
import Resources from "@/app/components/admin/Resources";
import GISMap from "@/app/components/admin/GISMap";
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
            case 'resources': return <Resources />;
            case 'gis': return <GISMap />;
            case 'analytics': return <Analytics />;
            case 'monitoring': return <CCTVMonitoring />;
            case 'settings': return <Settings />;
            default: return <DashboardOverview />;
        }
    };

    // Show loading while checking auth
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-4xl text-emerald-600 mx-auto mb-4" />
                    <p className="text-gray-400">Checking Admin Access...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-900 text-gray-100 font-sans selection:bg-emerald-500/30">
            {/* Sidebar Desktop */}
            <aside className={`fixed lg:relative inset-y-0 left-0 z-40 w-64 bg-slate-950 border-r border-slate-800 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <div>
                        <h1 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Command Center</h1>
                        <p className="text-xs text-emerald-500 font-mono mt-1">v2.4.1 • Secure</p>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
                        <FaBars />
                    </button>
                </div>
                
                {/* Admin Info */}
                <div className="p-4 border-b border-slate-800 bg-slate-900/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-emerald-500/20">
                            {adminEmail?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white truncate">{adminEmail || 'Administrator'}</p>
                            <p className="text-xs text-emerald-500">ADMINISTRATOR</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-220px)]">
                    <p className="text-xs font-bold text-slate-500 uppercase px-4 py-2 mt-2">Main</p>
                    <SidebarItem icon={FaChartPie} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                    <SidebarItem icon={FaMapMarkedAlt} label="GIS Map" active={activeTab === 'gis'} onClick={() => setActiveTab('gis')} />
                    
                    <p className="text-xs font-bold text-slate-500 uppercase px-4 py-2 mt-4">Operations</p>
                    <SidebarItem icon={FaClipboardList} label="Requests" active={activeTab === 'requests'} onClick={() => setActiveTab('requests')} />
                    <SidebarItem icon={FaVideo} label="CCTV Monitoring" active={activeTab === 'monitoring'} onClick={() => setActiveTab('monitoring')} />
                    
                    <p className="text-xs font-bold text-slate-500 uppercase px-4 py-2 mt-4">Logistics</p>
                    <SidebarItem icon={FaTruck} label="Resources" active={activeTab === 'resources'} onClick={() => setActiveTab('resources')} />
                    
                    <p className="text-xs font-bold text-slate-500 uppercase px-4 py-2 mt-4">Analysis</p>
                    <SidebarItem icon={FaLayerGroup} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
                    
                    <p className="text-xs font-bold text-slate-500 uppercase px-4 py-2 mt-4">System</p>
                    <SidebarItem icon={FaCog} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                </div>

                <div className="absolute bottom-0 w-full p-4 border-t border-slate-800 bg-slate-950">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-900 rounded-lg transition-colors w-full text-left"
                    >
                        <FaSignOutAlt />
                        <span className="font-medium text-sm">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
            )}

            {/* Main Content */}
            <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="bg-slate-950 border-b border-slate-800 h-16 flex items-center justify-between px-6 sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setIsSidebarOpen(true)}>
                            <FaBars className="text-xl" />
                        </button>
                        <h2 className="text-lg font-bold text-white capitalize">{activeTab.replace('-', ' ')}</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center bg-slate-900 rounded-full px-4 py-1.5 border border-slate-700 focus-within:ring-2 focus-within:ring-emerald-500/50">
                            <FaSearch className="text-slate-500" />
                            <input 
                                type="text" 
                                placeholder="Search..." 
                                className="bg-transparent border-none focus:ring-0 text-sm text-white placeholder-slate-500 w-48"
                            />
                        </div>
                        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                            <FaBell className="text-lg" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-emerald-500/20">
                            {adminEmail?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div className="hidden md:block text-sm text-slate-400">
                            {adminEmail}
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-auto p-4 lg:p-8 bg-slate-900 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    <div className="max-w-7xl mx-auto">
                        {renderContent()}
                    </div>
                </div>
            </main>
        </div>
    );
}