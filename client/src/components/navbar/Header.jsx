import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import NotificationsModal from '../pages/NotificationsModal'
import { config, endpoints } from '../config/config'

function Header({ children, hasSearch = false, searchPlaceholder = 'Search...' }) {
    const navigate = useNavigate()
    const [notifOpen, setNotifOpen] = useState(false)
    const [notifications, setNotifications] = useState([])

    const user = useMemo(() => {
        try { return JSON.parse(localStorage.getItem('user')) || {} } catch { return {} }
    }, [])

    const getInitials = (name = '') => {
        const parts = name.trim().split(/\s+/)
        if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        return name.slice(0, 2).toUpperCase() || 'U'
    }

    const fetchNotifications = useCallback(async () => {
        try {
            const res = await axios.get(`${config.uniClinicAPI}${endpoints.notifications}`)
            setNotifications(res.data)
        } catch { /* silently fail */ }
    }, [])

    useEffect(() => { fetchNotifications() }, [fetchNotifications])

    const unreadCount = notifications.filter(n => !n.is_read).length

    return (
        <>
            <header className="sticky top-0 z-40 bg-white flex justify-between items-center w-full px-8 py-4 h-20 shadow-sm shadow-sky-900/5">
                <div className="flex items-center gap-8">
                    <h2 className="text-2xl font-black font-manrope text-sky-700">UniClinic</h2>
                    {hasSearch && (
                        <div className="relative group">
                            <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                                <span className="material-symbols-outlined text-[20px]">search</span>
                            </span>
                                <input
                                    className="bg-surface-container-low border-none rounded-full pl-12 pr-6 py-2.5 w-80 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder={searchPlaceholder}
                                    type="text"
                                />
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {/* Notifications bell */}
                    <div className="relative">
                        <button
                            id="header-notifications-btn"
                            onClick={() => setNotifOpen(prev => !prev)}
                            className={`p-2.5 rounded-full transition-all duration-300 ${notifOpen ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100/50 text-on-surface-variant'}`}
                        >
                            <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
                        </button>
                        {/* Unread badge */}
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 min-w-[18px] h-[18px] rounded-full bg-error border-2 border-white flex items-center justify-center">
                                <span className="text-[10px] font-bold text-white leading-none">{unreadCount > 99 ? '99+' : unreadCount}</span>
                            </span>
                        )}
                    </div>

                    {/* Settings */}
                    <button
                        id="header-settings-btn"
                        onClick={() => navigate('/settings')}
                        className="p-2.5 rounded-full hover:bg-slate-100/50 transition-all duration-300 text-on-surface-variant"
                    >
                        <span className="material-symbols-outlined" data-icon="settings">settings</span>
                    </button>

                    {/* Profile avatar */}
                    <button
                        id="header-profile-btn"
                        onClick={() => navigate('/profile')}
                        className="h-10 w-10 rounded-full overflow-hidden ml-2 border-2 border-primary-fixed hover:border-primary transition-all bg-primary-container flex items-center justify-center"
                    >
                        <span className="text-sm font-bold text-on-primary-container">{getInitials(user.name)}</span>
                    </button>
                </div>
            </header>

            {/* Inline animation style */}
            <style>{`
                @keyframes slideDownFade {
                    from { opacity: 0; transform: translateY(-8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <NotificationsModal
                open={notifOpen}
                onClose={() => setNotifOpen(false)}
                onViewAll={() => navigate('/notifications')}
                notifications={notifications}
                onRefresh={fetchNotifications}
            />
        </>
    )
}

export default Header;
