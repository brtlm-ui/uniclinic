import React, { useEffect, useRef } from 'react';

const notifications = [
    {
        id: 1,
        type: 'urgent',
        icon: 'emergency',
        title: 'Low stock: Paracetamol',
        description: 'The clinic inventory for analgesic tablets is below 15%. Consider restocking.',
        time: '2 min ago',
        unread: true,
    },
    {
        id: 2,
        type: 'info',
        icon: 'event_available',
        title: 'New visit recorded: Ethan Sterling',
        description: 'Assistant Nurse Chen has finalized the visit report for the Grade 11 student.',
        time: '14 min ago',
        unread: true,
    },
    {
        id: 3,
        type: 'warning',
        icon: 'system_update',
        title: 'System Update scheduled',
        description: 'Platform maintenance is scheduled for Sunday at 02:00 AM. Expected downtime: 15 mins.',
        time: '1 hr ago',
        unread: false,
    },
    {
        id: 4,
        type: 'success',
        icon: 'science',
        title: 'Lab results available',
        description: 'Bloodwork results for Student ID #9921 have been securely uploaded to the portal.',
        time: '2 hr ago',
        unread: false,
    },
];

const typeConfig = {
    urgent: { iconBg: 'bg-error-container', iconColor: 'text-error' },
    info: { iconBg: 'bg-primary-container/30', iconColor: 'text-primary' },
    warning: { iconBg: 'bg-tertiary-container', iconColor: 'text-tertiary' },
    success: { iconBg: 'bg-secondary-container', iconColor: 'text-secondary' },
};

const NotificationsModal = ({ open, onClose, onViewAll }) => {
    const panelRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                onClose();
            }
        };
        if (open) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open, onClose]);

    if (!open) return null;

    const unreadCount = notifications.filter(n => n.unread).length;

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
                        <p className="text-xs text-on-surface-variant mt-0.5">You have <span className="font-bold text-primary">{unreadCount} unread</span> messages</p>
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
                    {notifications.map((n, i) => {
                        const cfg = typeConfig[n.type];
                        return (
                            <div
                                key={n.id}
                                className={`px-6 py-4 flex items-start gap-4 cursor-pointer transition-colors hover:bg-surface-container-low border-b border-surface-container last:border-0 ${n.unread ? 'bg-surface-container-lowest' : 'bg-surface-container-lowest/50'}`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${cfg.iconBg}`}>
                                    <span className={`material-symbols-outlined text-[18px] ${cfg.iconColor}`}>{n.icon}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1"></span>}
                                            <p className="font-semibold text-on-surface text-sm leading-snug">{n.title}</p>
                                        </div>
                                        <span className="text-[11px] text-on-surface-variant flex-shrink-0">{n.time}</span>
                                    </div>
                                    <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{n.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-surface-container bg-surface-container-low flex items-center justify-between">
                    <button className="text-xs text-on-surface-variant font-semibold hover:text-on-surface transition-colors">
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
