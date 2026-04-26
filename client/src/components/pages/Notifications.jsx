import React, { useState } from 'react';
import Sidebar from '../navbar/Sidebar';
import Header from '../navbar/Header';

const notificationData = [
    {
        id: 1,
        type: 'urgent',
        icon: 'emergency',
        title: 'Urgent: Anaphylaxis Protocol Initiated',
        description: 'Student Liam Carter (Grade 4) required epinephrine administration. Emergency services notified at 10:42 AM.',
        time: '10:42 AM',
        date: 'Today',
        unread: true,
    },
    {
        id: 2,
        type: 'warning',
        icon: 'inventory_2',
        title: 'Low Stock: Saline Solution',
        description: 'Current inventory for 0.9% Saline 500ml has fallen below threshold (4 units remaining).',
        time: '09:15 AM',
        date: 'Today',
        unread: true,
    },
    {
        id: 3,
        type: 'info',
        icon: 'system_update',
        title: 'System Update Completed',
        description: 'The Patient Data Relay module has been updated to v2.4.1. Encryption protocols verified.',
        time: '08:00 AM',
        date: 'Today',
        unread: false,
    },
    {
        id: 4,
        type: 'success',
        icon: 'event_available',
        title: 'Visit Logged: Routine Screening',
        description: 'Student Maya Singh (Grade 10) completed annual vision screening. All metrics normal.',
        time: '03:30 PM',
        date: 'Yesterday',
        unread: false,
    },
    {
        id: 5,
        type: 'warning',
        icon: 'assignment_late',
        title: 'Overdue Medical Form',
        description: 'The immunization record for Ethan Hunt is still missing after 3 follow-ups. Administrative action suggested.',
        time: '02:00 PM',
        date: 'Yesterday',
        unread: false,
    },
    {
        id: 6,
        type: 'info',
        icon: 'science',
        title: 'Lab Results Available',
        description: 'Bloodwork results for Student ID #9921 have been securely uploaded to the portal.',
        time: '11:30 AM',
        date: 'Yesterday',
        unread: false,
    },
    {
        id: 7,
        type: 'success',
        icon: 'medication',
        title: 'Prescription Dispensed',
        description: 'Cetirizine 10mg dispensed to Student Amara Rodriguez (2022-12903) by Nurse Sarah.',
        time: '10:00 AM',
        date: 'Apr 19, 2026',
        unread: false,
    },
];

const typeConfig = {
    urgent: { bg: 'bg-error-container/20', iconColor: 'text-error', iconBg: 'bg-error-container', dot: 'bg-error' },
    warning: { bg: 'bg-tertiary-container/20', iconColor: 'text-tertiary', iconBg: 'bg-tertiary-container', dot: 'bg-tertiary' },
    info: { bg: 'bg-secondary-container/20', iconColor: 'text-secondary', iconBg: 'bg-secondary-container', dot: 'bg-secondary' },
    success: { bg: 'bg-primary-container/20', iconColor: 'text-primary', iconBg: 'bg-primary-container', dot: 'bg-primary' },
};

const Notifications = () => {
    const [filter, setFilter] = useState('all');

    const grouped = notificationData.reduce((acc, n) => {
        if (!acc[n.date]) acc[n.date] = [];
        acc[n.date].push(n);
        return acc;
    }, {});

    const unreadCount = notificationData.filter(n => n.unread).length;

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
                            <button className="bg-surface-container-lowest text-on-surface-variant px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-white transition-all shadow-sm">
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
                    {Object.entries(grouped).map(([date, items]) => {
                        const filtered = filter === 'all' ? items : items.filter(n => n.type === filter);
                        if (filtered.length === 0) return null;
                        return (
                            <div key={date}>
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">{date}</span>
                                    <div className="flex-1 h-px bg-surface-container-high"></div>
                                </div>
                                <div className="space-y-3">
                                    {filtered.map(notification => {
                                        const cfg = typeConfig[notification.type];
                                        return (
                                            <div
                                                key={notification.id}
                                                className={`flex items-start gap-5 p-6 rounded-2xl transition-all group cursor-pointer hover:shadow-md ${
                                                    notification.unread ? 'bg-surface-container-lowest shadow-sm border border-outline-variant/10' : 'bg-surface-container-lowest/60'
                                                }`}
                                            >
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${cfg.iconBg}`}>
                                                    <span className={`material-symbols-outlined ${cfg.iconColor}`} data-icon={notification.icon}>{notification.icon}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-1">
                                                                {notification.unread && (
                                                                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`}></span>
                                                                )}
                                                                <p className="font-bold text-on-surface">{notification.title}</p>
                                                            </div>
                                                            <p className="text-sm text-on-surface-variant leading-relaxed">{notification.description}</p>
                                                        </div>
                                                        <span className="text-xs font-medium text-on-surface-variant flex-shrink-0 mt-0.5">{notification.time}</span>
                                                    </div>
                                                </div>
                                                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant">
                                                    <span className="material-symbols-outlined text-[18px]">close</span>
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </section>
            </main>
        </>
    );
};

export default Notifications;
