import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NotificationsModal from '../pages/NotificationsModal'

const DEFAULT_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYNJS2j9zKN5JENqHQe6xAmOZtg1qgKXAgMb2l-UwwZSdhnNHKTiPfGCxzEBDiw6Tzae9bIBdt7ceUR43ZQAaqGevOgl0oP0CzjBr0BjAzlAHdal9jyhtxnycsVLqAphOZuGBAy39XEbM7E1PH-jWiycWODCh6_nOeyOpoRWuMjltNNXk-rmXiGggbPR8RDzCoDCi9VqR6BEp1W1gJBo-4NbFzBFwMHMpMtJhiusfzBO9Yd1jQNqu7rVp0zLXk81KmMH57-XNS-vk'

function Header({ children, hasSearch = false, searchPlaceholder = 'Search...', userName = 'Sarah Miller', userAvatar = DEFAULT_AVATAR }) {
    const navigate = useNavigate()
    const [notifOpen, setNotifOpen] = useState(false)

    return (
        <>
            <header className="sticky top-0 z-40 bg-white dark:bg-slate-950 flex justify-between items-center w-full px-8 py-4 h-20 shadow-sm shadow-sky-900/5">
                <div className="flex items-center gap-8">
                    <h2 className="text-2xl font-black font-manrope text-sky-700 dark:text-sky-300">UniClinic</h2>
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
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error border-2 border-white"></span>
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
                        className="h-10 w-10 rounded-full overflow-hidden ml-2 border-2 border-primary-fixed hover:border-primary transition-all"
                    >
                        <img className="w-full h-full object-cover" src={userAvatar} alt={userName} />
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
            />
        </>
    )
}

export default Header;
