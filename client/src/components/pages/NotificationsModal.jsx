import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { config, endpoints } from '../config/config';

const typeConfig = {
    urgent:  { iconBg: 'bg-error-container',     iconColor: 'text-error' },
    info:    { iconBg: 'bg-primary-container/30', iconColor: 'text-primary' },
    warning: { iconBg: 'bg-tertiary-container',   iconColor: 'text-tertiary' },
    success: { iconBg: 'bg-secondary-container',  iconColor: 'text-secondary' },
};

const NotificationsModal = ({ open, onClose, onViewAll, notifications = [], onRefresh }) => {
    const panelRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
        };
        if (open) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open, onClose]);

    if (!open) return null;

    const unreadCount = notifications.filter(n => !n.is_read).length;
    const recent = notifications.slice(0, 6);

    const handleMarkRead = async (id) => {
        try {
            await axios.put(`${config.uniClinicAPI}${endpoints.notifications}/${id}/read`);
            onRefresh();
        } catch { /* ignore */ }
    };

    const handleMarkAllRead = async () => {
        try {
            await axios.put(`${config.uniClinicAPI}${endpoints.notifications}/read-all`);
            onRefresh();
        } catch { /* ignore */ }
    };

    return (
        <div className="fixed inset-0 z-50 pointer-events-none">
            <div
                ref={panelRef}
                className="pointer-events-auto absolute top-24 right-6 w-[400px] bg-surface-container-lowest rounded-2xl shadow-2xl shadow-on-surface/10 border border-outline-variant/10 overflow-hidden"
                style={{ animation: 'slideDownFade 0.2s ease-out' }}
            >
                {/* Header */}
                <div className="px-6 py-5 border-b border-surface-container flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-on-surface font-manrope text-lg">Notifications</h3>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                            You have <span className="font-bold text-primary">{unreadCount} unread</span> messages
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                </div>

                {/* Notification list */}
                <div className="max-h-[420px] overflow-y-auto">
                    {recent.length === 0 && (
                        <div className="px-6 py-10 text-center text-on-surface-variant text-sm">No notifications yet.</div>
                    )}
                    {recent.map(n => {
                        const cfg = typeConfig[n.type] || typeConfig.info;
                        return (
                            <div
                                key={n.notification_id}
                                onClick={() => !n.is_read && handleMarkRead(n.notification_id)}
                                className={`px-6 py-4 flex items-start gap-4 cursor-pointer transition-colors hover:bg-surface-container-low border-b border-surface-container last:border-0 ${
                                    !n.is_read ? 'bg-surface-container-lowest' : 'bg-surface-container-lowest/50'
                                }`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${cfg.iconBg}`}>
                                    <span className={`material-symbols-outlined text-[18px] ${cfg.iconColor}`}>{n.icon}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            {!n.is_read && <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1"></span>}
                                            <p className="font-semibold text-on-surface text-sm leading-snug">{n.title}</p>
                                        </div>
                                        <span className="text-[11px] text-on-surface-variant flex-shrink-0">
                                            {new Date(n.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{n.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-surface-container bg-surface-container-low flex items-center justify-between">
                    <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-on-surface-variant font-semibold hover:text-on-surface transition-colors"
                    >
                        Mark all as read
                    </button>
                    <button
                        onClick={() => { onClose(); onViewAll(); }}
                        className="flex items-center gap-1.5 text-primary font-bold text-xs hover:underline"
                    >
                        View all activity
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationsModal;
