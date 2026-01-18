"use client";

import { useEffect, useState } from "react";
import { FaBell, FaCheck, FaInfoCircle, FaCheckCircle, FaExclamationTriangle, FaTimes } from "react-icons/fa";

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    isRead: boolean;
    createdAt: string;
}

export default function NotificationCenter({ userId }: { userId?: string }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/notifications');
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications);
                setUnreadCount(data.notifications.filter((n: Notification) => !n.isRead).length);
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id?: string) => {
        try {
            await fetch('/api/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            fetchNotifications();
        } catch (e) { console.error(e); }
    };

    const handleOpen = () => {
        if (!isOpen) {
            // Optimistically mark all as read or just open
            // Maybe just open first, let user click or mark all read
        }
        setIsOpen(!isOpen);
    };

    const handleMarkAllRead = () => {
        markAsRead(); // No ID means all
    };

    const getIcon = (type: string) => {
        switch(type) {
            case 'success': return <FaCheckCircle className="text-emerald-500" />;
            case 'warning': return <FaExclamationTriangle className="text-yellow-500" />;
            case 'error': return <FaTimes className="text-red-500" />;
            default: return <FaInfoCircle className="text-blue-500" />;
        }
    };

    return (
        <div className="relative z-50">
            <button 
                onClick={handleOpen}
                className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
            >
                <FaBell className="text-xl" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full animate-pulse border border-slate-900"></span>
                )}
            </button>

            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-40 bg-transparent" 
                        onClick={() => setIsOpen(false)}
                    ></div>
                    <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-fadeIn">
                        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
                            <h3 className="font-bold text-white text-sm">Notifications</h3>
                            {unreadCount > 0 && (
                                <button 
                                    onClick={handleMarkAllRead}
                                    className="text-[10px] text-emerald-400 hover:text-emerald-300 font-medium"
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>
                        <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-slate-500 text-sm">
                                    <FaBell className="mx-auto mb-2 opacity-20 text-2xl" />
                                    No notifications yet
                                </div>
                            ) : (
                                notifications.map(notif => (
                                    <div 
                                        key={notif.id} 
                                        className={`p-4 border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors flex gap-3 ${!notif.isRead ? 'bg-slate-700/20' : ''}`}
                                        onClick={() => markAsRead(notif.id)}
                                    >
                                        <div className="mt-1 flex-shrink-0">
                                            {getIcon(notif.type)}
                                        </div>
                                        <div>
                                            <h4 className={`text-sm ${!notif.isRead ? 'font-bold text-white' : 'font-medium text-slate-300'}`}>
                                                {notif.title}
                                            </h4>
                                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                                {notif.message}
                                            </p>
                                            <span className="text-[10px] text-slate-600 mt-2 block">
                                                {new Date(notif.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                        {!notif.isRead && (
                                            <div className="ml-auto mt-2">
                                                <div className="h-2 w-2 bg-emerald-500 rounded-full"></div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
