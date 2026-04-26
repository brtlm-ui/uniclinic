import React, { useState } from 'react';
import Sidebar from '../navbar/Sidebar';
import Header from '../navbar/Header';

const Settings = () => {
    const [activeSection, setActiveSection] = useState('general');
    const [darkMode, setDarkMode] = useState(false);
    const [compactView, setCompactView] = useState(false);
    const [emailNotif, setEmailNotif] = useState(true);
    const [lowStockAlerts, setLowStockAlerts] = useState(true);
    const [visitAlerts, setVisitAlerts] = useState(true);
    const [systemAlerts, setSystemAlerts] = useState(false);
    const [language, setLanguage] = useState('en');
    const [timezone, setTimezone] = useState('Asia/Manila');
    const [dateFormat, setDateFormat] = useState('MMM DD, YYYY');

    const nav = [
        { id: 'general', label: 'General', icon: 'tune' },
        { id: 'notifications', label: 'Notifications', icon: 'notifications' },
        { id: 'security', label: 'Security & Privacy', icon: 'shield' },
        { id: 'appearance', label: 'Appearance', icon: 'palette' },
    ];

    const Toggle = ({ value, onChange }) => (
        <button
            onClick={() => onChange(!value)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-primary' : 'bg-surface-container-highest'}`}
        >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${value ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    );

    const SettingRow = ({ label, description, children }) => (
        <div className="flex items-center justify-between py-5 border-b border-surface-container last:border-0">
            <div className="max-w-md">
                <p className="font-semibold text-on-surface text-sm">{label}</p>
                {description && <p className="text-xs text-on-surface-variant mt-0.5">{description}</p>}
            </div>
            {children}
        </div>
    );

    return (
        <>
            <Sidebar />
            <main className="flex-1 ml-72 min-h-screen overflow-y-auto pb-16">
                <Header hasSearch={false} />

                <section className="px-8 pt-10 mb-10">
                    <p className="text-primary font-bold tracking-widest text-xs uppercase mb-3">Workspace Configuration</p>
                    <h1 className="font-manrope text-5xl font-black text-on-surface tracking-tight leading-tight">Settings</h1>
                    <p className="mt-3 text-on-surface-variant text-lg font-medium">Configure your workspace preferences and how the clinic environment looks to you.</p>
                </section>

                <section className="px-8 grid grid-cols-12 gap-8">
                    {/* Sidebar Nav */}
                    <div className="col-span-12 lg:col-span-3">
                        <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-3 sticky top-24">
                            {/* Active Profile Card */}
                            <div className="bg-surface-container-low rounded-xl p-4 mb-3 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary text-[18px]">person</span>
                                </div>
                                <div>
                                    <p className="font-bold text-on-surface text-sm">Dr. Sarah Miller</p>
                                    <p className="text-[11px] text-on-surface-variant">Senior Practitioner</p>
                                </div>
                            </div>
                            <nav className="space-y-1">
                                {nav.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveSection(item.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                                            activeSection === item.id
                                                ? 'bg-primary text-on-primary shadow-md shadow-primary/20'
                                                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                                        {item.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-span-12 lg:col-span-9">

                        {activeSection === 'general' && (
                            <div className="space-y-8">
                                <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-8">
                                    <h2 className="font-bold text-lg text-on-surface mb-1">Regional Preferences</h2>
                                    <p className="text-sm text-on-surface-variant mb-6">Used across the interface to format dates, times, and language.</p>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Language</label>
                                            <select
                                                value={language}
                                                onChange={e => setLanguage(e.target.value)}
                                                className="w-full bg-surface-container-low border-none rounded-full py-3 px-5 text-sm font-medium focus:ring-2 focus:ring-primary/20"
                                            >
                                                <option value="en">English (US)</option>
                                                <option value="fil">Filipino</option>
                                                <option value="es">Español</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Timezone</label>
                                            <select
                                                value={timezone}
                                                onChange={e => setTimezone(e.target.value)}
                                                className="w-full bg-surface-container-low border-none rounded-full py-3 px-5 text-sm font-medium focus:ring-2 focus:ring-primary/20"
                                            >
                                                <option value="Asia/Manila">Asia/Manila (UTC+8)</option>
                                                <option value="America/New_York">America/New_York (UTC-5)</option>
                                                <option value="Europe/London">Europe/London (UTC+0)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Date Format</label>
                                            <select
                                                value={dateFormat}
                                                onChange={e => setDateFormat(e.target.value)}
                                                className="w-full bg-surface-container-low border-none rounded-full py-3 px-5 text-sm font-medium focus:ring-2 focus:ring-primary/20"
                                            >
                                                <option value="MMM DD, YYYY">Apr 21, 2026</option>
                                                <option value="DD/MM/YYYY">21/04/2026</option>
                                                <option value="MM-DD-YYYY">04-21-2026</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-8">
                                    <h2 className="font-bold text-lg text-on-surface mb-1">Interface</h2>
                                    <p className="text-sm text-on-surface-variant mb-6">Adjust visit schedules and display layouts.</p>
                                    <div>
                                        <SettingRow label="Compact View" description="Reduce spacing for denser data tables">
                                            <Toggle value={compactView} onChange={setCompactView} />
                                        </SettingRow>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold shadow-lg shadow-primary/20 hover:bg-primary-dim transition-all active:scale-95">
                                        Save Preferences
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeSection === 'notifications' && (
                            <div className="space-y-8">
                                <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-8">
                                    <h2 className="font-bold text-lg text-on-surface mb-1">Notification Channels</h2>
                                    <p className="text-sm text-on-surface-variant mb-6">Choose how and when you receive updates from the clinic system.</p>
                                    <SettingRow label="Email Notifications" description="Receive daily digest and urgent alerts via email">
                                        <Toggle value={emailNotif} onChange={setEmailNotif} />
                                    </SettingRow>
                                </div>

                                <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-8">
                                    <h2 className="font-bold text-lg text-on-surface mb-1">Alert Types</h2>
                                    <p className="text-sm text-on-surface-variant mb-6">Select which events trigger in-app notifications.</p>
                                    <SettingRow label="Low Stock Alerts" description="Notify when medicine inventory drops below threshold">
                                        <Toggle value={lowStockAlerts} onChange={setLowStockAlerts} />
                                    </SettingRow>
                                    <SettingRow label="New Visit Logged" description="Notify when a new patient visit is recorded">
                                        <Toggle value={visitAlerts} onChange={setVisitAlerts} />
                                    </SettingRow>
                                    <SettingRow label="System Maintenance Alerts" description="Get notified before scheduled platform downtime">
                                        <Toggle value={systemAlerts} onChange={setSystemAlerts} />
                                    </SettingRow>
                                </div>

                                <div className="flex justify-end">
                                    <button className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold shadow-lg shadow-primary/20 hover:bg-primary-dim transition-all active:scale-95">
                                        Save Preferences
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeSection === 'security' && (
                            <div className="space-y-8">
                                <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-8">
                                    <h2 className="font-bold text-lg text-on-surface mb-1">Password & Authentication</h2>
                                    <p className="text-sm text-on-surface-variant mb-6">Manage your login credentials and security settings.</p>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Current Password</label>
                                            <input type="password" className="w-full bg-surface-container-low border-none rounded-full py-3 px-5 text-sm focus:ring-2 focus:ring-primary/20" placeholder="••••••••" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">New Password</label>
                                            <input type="password" className="w-full bg-surface-container-low border-none rounded-full py-3 px-5 text-sm focus:ring-2 focus:ring-primary/20" placeholder="••••••••" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Confirm New Password</label>
                                            <input type="password" className="w-full bg-surface-container-low border-none rounded-full py-3 px-5 text-sm focus:ring-2 focus:ring-primary/20" placeholder="••••••••" />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-primary-container/10 rounded-2xl p-8 border border-primary-container/20">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="material-symbols-outlined text-primary text-2xl">shield</span>
                                        <h3 className="font-bold text-on-surface">Security Best Practices</h3>
                                    </div>
                                    <p className="text-on-surface-variant text-sm leading-relaxed">All staff actions are logged for medical audit compliance. Ensure your password is at least 12 characters and includes a mix of uppercase, lowercase, numbers, and symbols.</p>
                                </div>
                                <div className="flex justify-end">
                                    <button className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold shadow-lg shadow-primary/20 hover:bg-primary-dim transition-all active:scale-95">
                                        Update Password
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeSection === 'appearance' && (
                            <div className="space-y-8">
                                <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-8">
                                    <h2 className="font-bold text-lg text-on-surface mb-1">Visual Appearance</h2>
                                    <p className="text-sm text-on-surface-variant mb-6">Customize the look and feel of your workspace.</p>
                                    <SettingRow label="Dark Mode" description="Switch to a dark color scheme (coming soon)">
                                        <Toggle value={darkMode} onChange={setDarkMode} />
                                    </SettingRow>
                                </div>

                                <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-8">
                                    <h2 className="font-bold text-lg text-on-surface mb-4">Accent Color</h2>
                                    <p className="text-sm text-on-surface-variant mb-6">Choose your preferred accent color for the interface.</p>
                                    <div className="flex items-center gap-4">
                                        {['#006592', '#7B5EA7', '#00795C', '#B3001B', '#C35A00'].map(color => (
                                            <button
                                                key={color}
                                                className={`w-10 h-10 rounded-full transition-all hover:scale-110 ${color === '#006592' ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''}`}
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold shadow-lg shadow-primary/20 hover:bg-primary-dim transition-all active:scale-95">
                                        Save Appearance
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
};

export default Settings;
