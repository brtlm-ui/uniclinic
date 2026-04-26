import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { NAV_LINKS } from '../config/Constants'
import { LogoutModal } from '../modals/SharedModals'

function Sidebar() {
    const navigate = useNavigate()
    const [logoutOpen, setLogoutOpen] = useState(false)

    const getLinkClassName = (isActive) => {
        return isActive
            ? 'bg-white text-sky-700 shadow-sm rounded-full mx-4 py-3 px-6 flex items-center gap-4 transition-all duration-200 active:scale-95 font-inter text-sm font-semibold'
            : 'text-slate-500 mx-4 py-3 px-6 flex items-center gap-4 hover:translate-x-1 hover:text-sky-600 transition-transform font-inter text-sm font-semibold'
    }

    return (
        <>
            <nav className="fixed left-0 top-0 h-full w-72 overflow-hidden bg-slate-50 flex flex-col py-8 space-y-2 border-r border-slate-200 z-50">
                <div className="px-8 mb-12">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary" data-icon="medical_services">medical_services</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold font-manrope text-slate-800 leading-tight">Clinical Serenity</h2>
                            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Health Concierge</p>
                        </div>
                    </div>
                </div>
                <div className="flex-1 space-y-1 overflow-y-auto">
                    {NAV_LINKS.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) => getLinkClassName(isActive)}
                        >
                            <span
                                className="material-symbols-outlined"
                                data-icon={link.icon}
                                style={link.iconFill ? { fontVariationSettings: "'FILL' 1" } : undefined}
                            >
                                {link.icon}
                            </span>
                            <span>{link.label}</span>
                        </NavLink>
                    ))}
                </div>
                <div className="px-4 mt-auto pt-4 border-t border-slate-200/70">
                    <button
                        type="button"
                        onClick={() => setLogoutOpen(true)}
                        className="w-full text-left text-slate-500 py-3 px-6 flex items-center gap-4 hover:translate-x-1 hover:text-red-500 transition-all font-inter text-sm font-semibold rounded-full hover:bg-red-50"
                    >
                        <span className="material-symbols-outlined" data-icon="logout">logout</span>
                        <span>Logout</span>
                    </button>
                </div>
            </nav>

            <LogoutModal
                open={logoutOpen}
                onClose={() => setLogoutOpen(false)}
                onConfirm={() => navigate('/')}
            />
        </>
    )
}

export default Sidebar;
