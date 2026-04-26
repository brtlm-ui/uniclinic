import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Sidebar from '../navbar/Sidebar';
import Header from '../navbar/Header';
import { config, endpoints } from '../config/config';

const typeConfig = {
    urgent:  { bg: 'bg-error-container/20',     iconColor: 'text-error',     iconBg: 'bg-error-container',     dot: 'bg-error' },
    warning: { bg: 'bg-tertiary-container/20',  iconColor: 'text-tertiary',  iconBg: 'bg-tertiary-container',  dot: 'bg-tertiary' },
    info:    { bg: 'bg-secondary-container/20', iconColor: 'text-secondary', iconBg: 'bg-secondary-container', dot: 'bg-secondary' },
    success: { bg: 'bg-primary-container/20',   iconColor: 'text-primary',   iconBg: 'bg-primary-container',   dot: 'bg-primary' },
};

const fmtGroup = (iso) => {
    const d = new Date(iso);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
    if (d >= today) return 'Today';
    if (d >= yesterday) return 'Yesterday';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const fmtTime = (iso) =>
    new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    const fetchNotifications = useCallback(async () => {
        try {
            const res = await axios.get(`${config.uniClinicAPI}${endpoints.notifications}`);
            setNotifications(res.data);
        } catch { /* ignore */ } finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

    const handleMarkRead = async (id) => {
        try {
            await axios.put(`${config.uniClinicAPI}${endpoints.notifications}/${id}/read`);
            setNotifications(prev => prev.map(n => n.notification_id === id ? { ...n, is_read: 1 } : n));
        } catch { /* ignore */ }
    };

    const handleMarkAllRead = async () => {
        try {
            await axios.put(`${config.uniClinicAPI}${endpoints.notifications}/read-all`);
            setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
        } catch { /* ignore */ }
    };

    const handleDismiss = async (id) => {
        try {
            await axios.delete(`${config.uniClinicAPI}${endpoints.notifications}/${id}`);
            setNotifications(prev => prev.filter(n => n.notification_id !== id));
        } catch { /* ignore */ }
    };

    const filtered = filter === 'all' ? notifications : notifications.filter(n => n.type === filter);
    const unreadCount = notifications.filter(n => !n.is_read).length;

    const grouped = filtered.reduce((acc, n) => {
        const label = fmtGroup(n.created_at);
        if (!acc[label]) acc[label] = [];
        acc[label].push(n);
        return acc;
    }, {});

    return (
        <>
            <Sidebar />
            <main className="flex-1 ml-72 min-h-screen overflow-y-auto pb-16">
                <Header hasSearch={false} />

                <section className="px-8 pt-10 mb-10">
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-primary font-bold tracking-widest text-xs uppercase mb-3">Clinic Activity</p>
                            <h1 className="font-manrope text-5xl font-black text-on-surface tracking-tight leading-tight">Activity Log</h1>
                            <p className="mt-3 text-on-surface-variant text-lg font-medium">
                                Track all clinic interactions, inventory shifts, and system alerts in one unified stream.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            {unreadCount > 0 && (
                                <div className="flex items-center gap-2 bg-error-container/20 text-error px-5 py-2.5 rounded-full">
                                    <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
                                    <span className="font-bold text-sm">{unreadCount} unread</span>
                                </div>
                            )}
                            <button
                                onClick={handleMarkAllRead}
                                className="bg-surface-container-lowest text-on-surface-variant px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-white transition-all shadow-sm"
                            >
                                Mark all as read
                            </button>
                        </div>
                    </div>
                </section>

                {/* Filter tabs */}
                <section className="px-8 mb-8">
                    <div className="flex items-center gap-1 bg-surface-container-low rounded-full p-1 w-fit">
                        {['all', 'urgent', 'warning', 'info', 'success'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-5 py-2 rounded-full text-sm font-bold transition-all capitalize ${
                                    filter === f
                                        ? 'bg-white text-on-surface shadow-sm'
                                        : 'text-on-surface-variant hover:text-on-surface'
                                }`}
                            >
                                {f === 'all' ? 'All Activity' : f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Notification list */}
                <section className="px-8 space-y-10">
                    {loading && (
                        <p className="text-center text-on-surface-variant py-16">Loading notifications...</p>
                    )}
                    {!loading && filtered.length === 0 && (
                        <div className="text-center py-16">
                            <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-4 block">notifications_off</span>
                            <p className="text-on-surface-variant font-medium">
                                {filter === 'all' ? 'No notifications yet.' : `No ${filter} notifications.`}
                            </p>
                        </div>
                    )}
                    {!loading && Object.entries(grouped).map(([date, items]) => (
                        <div key={date}>
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">{date}</span>
                                <div className="flex-1 h-px bg-surface-container-high"></div>
                            </div>
                            <div className="space-y-3">
                                {items.map(n => {
                                    const cfg = typeConfig[n.type] || typeConfig.info;
                                    return (
                                        <div
                                            key={n.notification_id}
                                            onClick={() => !n.is_read && handleMarkRead(n.notification_id)}
                                            className={`flex items-start gap-5 p-6 rounded-2xl transition-all group cursor-pointer hover:shadow-md ${
                                                !n.is_read
                                                    ? `${cfg.bg} shadow-sm border border-outline-variant/10`
                                                    : 'bg-surface-container-lowest/60'
                                            }`}
                                        >
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${cfg.iconBg}`}>
                                                <span className={`material-symbols-outlined ${cfg.iconColor}`}>{n.icon}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-1">
                                                            {!n.is_read && (
                                                                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`}></span>
                                                            )}
                                                            <p className="font-bold text-on-surface">{n.title}</p>
                                                        </div>
                                                        <p className="text-sm text-on-surface-variant leading-relaxed">{n.description}</p>
                                                    </div>
                                                    <span className="text-xs font-medium text-on-surface-variant flex-shrink-0 mt-0.5">
                                                        {fmtTime(n.created_at)}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={e => { e.stopPropagation(); handleDismiss(n.notification_id); }}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant flex-shrink-0"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">close</span>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </section>
            </main>
        </>
    );
};

export default Notifications;
