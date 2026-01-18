"use client";

import { useEffect, useState } from "react";
import { FaCog, FaUserShield, FaBell, FaDatabase, FaPlus, FaTimes, FaArchive, FaCheckCircle, FaSpinner } from "react-icons/fa";

export default function Settings() {
    const [publicAlerts, setPublicAlerts] = useState(false);
    const [loadingSettings, setLoadingSettings] = useState(true);
    
    // Account Management State
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [admins, setAdmins] = useState<any[]>([]);
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [creatingAdmin, setCreatingAdmin] = useState(false);

    // Archive State
    const [showArchiveModal, setShowArchiveModal] = useState(false);
    const [archiveRequests, setArchiveRequests] = useState<any[]>([]);
    const [loadingArchive, setLoadingArchive] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings');
            if (res.ok) {
                const data = await res.json();
                setPublicAlerts(data.settings?.publicAlertsEnabled ?? false);
            }
        } catch (e) { console.error(e); }
        finally { setLoadingSettings(false); }
    };

    const togglePublicAlerts = async () => {
        const newState = !publicAlerts;
        setPublicAlerts(newState); 
        try {
            await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ publicAlertsEnabled: newState })
            });
        } catch (e) {
            setPublicAlerts(!newState); // Revert on error
            console.error(e);
        }
    };

    const fetchAdmins = async () => {
        try {
            const res = await fetch('/api/admin/accounts');
            if (res.ok) {
                const data = await res.json();
                setAdmins(data.admins);
            }
        } catch (e) { console.error(e); }
    };

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreatingAdmin(true);
        try {
            const res = await fetch('/api/admin/accounts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: newEmail, password: newPassword })
            });
            if (res.ok) {
                alert('Admin account created successfully');
                setNewEmail("");
                setNewPassword("");
                fetchAdmins();
            } else {
                alert('Failed to create account');
            }
        } catch (e) { console.error(e); }
        finally { setCreatingAdmin(false); }
    };

    const openAccountModal = () => {
        setShowAccountModal(true);
        fetchAdmins();
    };

    const openArchiveModal = async () => {
        setShowArchiveModal(true);
        setLoadingArchive(true);
        try {
            const res = await fetch('/api/admin/archive');
            if (res.ok) {
                const data = await res.json();
                setArchiveRequests(data.requests);
            }
        } catch (e) { console.error(e); }
        finally { setLoadingArchive(false); }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn relative">
            <div className="bg-slate-800 rounded-2xl shadow-sm border border-slate-700 p-6">
                 <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <FaCog className="text-gray-400" /> System Configuration
                </h2>
                
                <div className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                        <div>
                            <h3 className="font-bold text-white">System Status</h3>
                            <p className="text-sm text-slate-400">Current operational mode of the command center.</p>
                        </div>
                        <span className="px-3 py-1 bg-emerald-900/50 text-emerald-400 border border-emerald-800 rounded-full text-xs font-bold uppercase">
                            Operational
                        </span>
                    </div>

                    <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                        <div>
                            <h3 className="font-bold text-white">Public Alerts</h3>
                            <p className="text-sm text-slate-400">Enable automated SMS/App notifications for residents.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={publicAlerts} 
                                onChange={togglePublicAlerts} 
                            />
                            <div className={`w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${publicAlerts ? 'peer-checked:bg-emerald-500' : ''}`}></div>
                        </label>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-800 rounded-2xl shadow-sm border border-slate-700 p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <FaUserShield className="text-blue-400" /> Admin Access
                    </h3>
                    <div className="space-y-3">
                        <button 
                            onClick={openAccountModal}
                            className="w-full text-left px-4 py-3 bg-slate-900/50 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex justify-between items-center"
                        >
                            Manage Accounts <FaPlus size={10}/>
                        </button>
                    </div>
                </div>

                <div className="bg-slate-800 rounded-2xl shadow-sm border border-slate-700 p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <FaDatabase className="text-purple-400" /> Data Management
                    </h3>
                     <div className="space-y-3">
                        <button 
                            onClick={openArchiveModal}
                            className="w-full text-left px-4 py-3 bg-slate-900/50 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex justify-between items-center"
                        >
                             Archive Old Requests <FaArchive size={10}/>
                        </button>
                    </div>
                </div>
            </div>

            {/* Manage Accounts Modal */}
            {showAccountModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-lg overflow-hidden shadow-2xl animate-fadeIn">
                        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
                            <h3 className="font-bold text-white flex items-center gap-2"><FaUserShield/> Manage Accounts</h3>
                            <button onClick={() => setShowAccountModal(false)} className="text-slate-400 hover:text-white"><FaTimes/></button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Create Form */}
                            <form onSubmit={handleCreateAdmin} className="space-y-4 bg-slate-900/30 p-4 rounded-lg border border-slate-700/50">
                                <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wide">Create New Admin</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <input 
                                        type="email" 
                                        placeholder="Admin Email" 
                                        required 
                                        value={newEmail}
                                        onChange={e => setNewEmail(e.target.value)}
                                        className="bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white focus:border-emerald-500 outline-none"
                                    />
                                    <input 
                                        type="password" 
                                        placeholder="Password" 
                                        required 
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        className="bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>
                                <button type="submit" disabled={creatingAdmin} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded text-sm transition-colors disabled:opacity-50">
                                    {creatingAdmin ? "Creating..." : "Create Account"}
                                </button>
                            </form>

                            {/* List */}
                            <div>
                                <h4 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wide">Existing Admins</h4>
                                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                    {admins.map(admin => (
                                        <div key={admin.id} className="flex justify-between items-center bg-slate-700/30 p-2 rounded border border-slate-700">
                                            <span className="text-sm text-slate-300">{admin.email}</span>
                                            <span className="text-xs text-slate-500">{new Date(admin.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Archive View Modal */}
            {showArchiveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="glass-panel rounded-xl border border-slate-700 w-full max-w-5xl h-[50vh] flex flex-col shadow-2xl animate-scaleIn relative overflow-hidden">
                         <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/80 sticky top-0 z-10">
                            <h3 className="font-bold text-white flex items-center gap-2"><FaArchive className="text-emerald-500"/> Request Archive View</h3>
                            <button 
                                onClick={() => setShowArchiveModal(false)} 
                                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
                            >
                                <FaTimes/>
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto p-0 scrollbar-thin-custom">
                            {loadingArchive ? (
                                <div className="flex justify-center items-center h-full text-slate-500"><FaSpinner className="animate-spin text-3xl"/></div>
                            ) : (
                                <table className="w-full text-left text-sm">
                                    <thead className="text-slate-500 uppercase text-xs bg-slate-900/50 sticky top-0">
                                        <tr>
                                            <th className="p-3">Resident Name</th>
                                            <th className="p-3">Request Type</th>
                                            <th className="p-3">Date</th>
                                            <th className="p-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700">
                                        {archiveRequests.map(req => (
                                            <tr key={req.id} className="hover:bg-slate-700/30">
                                                <td className="p-3 font-bold text-white">{req.userFullName || 'Unknown'}</td>
                                                <td className="p-3 text-slate-300">{req.type}</td>
                                                <td className="p-3 text-slate-400">{new Date(req.createdAt).toLocaleDateString()}</td>
                                                <td className="p-3">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border ${
                                                        req.status === 'Completed' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800' : 
                                                        'bg-slate-700 text-slate-300 border-slate-600'
                                                    }`}>
                                                       {req.status === 'Completed' && <FaCheckCircle/>} {req.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
