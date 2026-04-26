import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../navbar/Sidebar';
import Header from '../navbar/Header';
import { config, endpoints } from '../config/config';

const DEFAULT_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYNJS2j9zKN5JENqHQe6xAmOZtg1qgKXAgMb2l-UwwZSdhnNHKTiPfGCxzEBDiw6Tzae9bIBdt7ceUR43ZQAaqGevOgl0oP0CzjBr0BjAzlAHdal9jyhtxnycsVLqAphOZuGBAy39XEbM7E1PH-jWiycWODCh6_nOeyOpoRWuMjltNNXk-rmXiGggbPR8RDzCoDCi9VqR6BEp1W1gJBo-4NbFzBFwMHMpMtJhiusfzBO9Yd1jQNqu7rVp0zLXk81KmMH57-XNS-vk';

const getInitials = (name = '') => name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();

const fmtDateTime = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit', hour12: true,
    });
};

const Profile = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [staffData, setStaffData] = useState(null);
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editEmail, setEditEmail] = useState(false);
    const [emailInput, setEmailInput] = useState('');
    const [saving, setSaving] = useState(false);

    // Read logged-in user from localStorage
    const localUser = (() => {
        try { return JSON.parse(localStorage.getItem('user')) || {}; } catch { return {}; }
    })();

    useEffect(() => {
        if (!localUser.staff_id) { setLoading(false); return; }
        const fetchData = async () => {
            try {
                const [sRes, vRes] = await Promise.all([
                    axios.get(`${config.uniClinicAPI}${endpoints.staff}/${localUser.staff_id}`),
                    axios.get(`${config.uniClinicAPI}${endpoints.visits}`),
                ]);
                setStaffData(sRes.data);
                setEmailInput(sRes.data.email || '');
                setVisits(vRes.data);
            } catch (err) {
                console.error('Failed to load profile data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSaveEmail = async () => {
        if (!localUser.staff_id) return;
        setSaving(true);
        try {
            await axios.put(`${config.uniClinicAPI}${endpoints.staff}/${localUser.staff_id}`, { email: emailInput });
            setStaffData(prev => ({ ...prev, email: emailInput }));
            setEditEmail(false);
        } catch (err) {
            console.error('Failed to save email', err);
        } finally {
            setSaving(false);
        }
    };

    // Stats derived from visits
    const myVisits = visits.filter(v => v.staff_id === localUser.staff_id || v.staff_id === staffData?.staff_id);
    const uniqueStudents = new Set(myVisits.map(v => v.student_id)).size;

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'access', label: 'Access History' },
    ];

    if (loading) {
        return (
            <>
                <Sidebar />
                <main className="flex-1 ml-72 min-h-screen flex items-center justify-center">
                    <span className="text-on-surface-variant text-lg">Loading profile...</span>
                </main>
            </>
        );
    }

    const displayName = staffData?.name || localUser.name || 'Unknown User';
    const displayRole = staffData?.role || localUser.role || '—';
    const displayUsername = staffData?.username || localUser.username || '—';
    const displayEmail = staffData?.email || null;
    const lastActive = staffData?.last_active || null;

    return (
        <>
            <Sidebar />
            <main className="flex-1 ml-72 min-h-screen overflow-y-auto pb-16">
                <Header hasSearch={false} />

                {/* Profile Hero Banner */}
                <div className="relative bg-primary overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-white/20"></div>
                        <div className="absolute right-40 top-10 w-64 h-64 rounded-full bg-white/10"></div>
                    </div>
                    <div className="relative z-10 px-8 pt-12 pb-24">
                        <p className="text-primary-container font-bold tracking-widest text-xs uppercase mb-2">User Profile</p>
                        <h1 className="font-manrope text-4xl font-black text-on-primary tracking-tight capitalize">{displayName}</h1>
                        <p className="text-on-primary/70 mt-1 font-medium capitalize">{displayRole} &bull; UniClinic Health Services</p>
                    </div>
                </div>

                {/* Profile Card */}
                <section className="px-8 -mt-12 mb-8 relative z-10">
                    <div className="bg-surface-container-lowest rounded-2xl shadow-lg p-8 flex items-center gap-8">
                        <div className="relative flex-shrink-0">
                            <div className="w-24 h-24 rounded-2xl bg-primary-container flex items-center justify-center border-4 border-white shadow-md">
                                <span className="text-3xl font-black text-on-primary-container">{getInitials(displayName)}</span>
                            </div>
                            <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-primary border-2 border-white"></span>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="font-manrope text-2xl font-black text-on-surface capitalize">{displayName}</h2>
                                    <p className="text-on-surface-variant font-medium capitalize">{displayRole}</p>
                                    <div className="flex items-center gap-4 mt-3">
                                        <span className="inline-flex items-center gap-1.5 bg-primary-container/20 text-primary px-3 py-1 rounded-full text-xs font-bold">
                                            <span className="material-symbols-outlined text-sm">badge</span>
                                            ID #{staffData?.staff_id || localUser.staff_id}
                                        </span>
                                        {lastActive && (
                                            <span className="inline-flex items-center gap-1.5 bg-surface-container text-on-surface-variant px-3 py-1 rounded-full text-xs font-bold">
                                                <span className="material-symbols-outlined text-sm">schedule</span>
                                                Last login: {fmtDateTime(lastActive)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Quick stats */}
                        <div className="hidden lg:flex items-center gap-8 border-l border-outline-variant/20 pl-8">
                            <div className="text-center">
                                <p className="text-3xl font-black font-manrope text-on-surface">{uniqueStudents.toLocaleString()}</p>
                                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">Students Seen</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-black font-manrope text-on-surface">{myVisits.length.toLocaleString()}</p>
                                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">Visits Handled</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tabs */}
                <section className="px-8 mb-8">
                    <div className="border-b border-surface-container-high">
                        <div className="flex items-center gap-0">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-6 py-4 text-sm font-bold transition-all border-b-2 -mb-[2px] ${
                                        activeTab === tab.id
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-on-surface-variant hover:text-on-surface'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Tab Content */}
                <section className="px-8">
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-12 gap-8">
                            {/* Personal Details */}
                            <div className="col-span-12 lg:col-span-7 bg-surface-container-lowest rounded-2xl p-8 shadow-sm">
                                <h3 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">person</span>
                                    Personal Details
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Full Name', value: displayName, icon: 'badge' },
                                        { label: 'Staff ID', value: `#${staffData?.staff_id || localUser.staff_id}`, icon: 'tag' },
                                        { label: 'Role', value: displayRole, icon: 'verified_user', capitalize: true },
                                        { label: 'Username', value: displayUsername, icon: 'alternate_email' },
                                    ].map(item => (
                                        <div key={item.label} className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl">
                                            <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center flex-shrink-0">
                                                <span className="material-symbols-outlined text-on-secondary-container text-[18px]">{item.icon}</span>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{item.label}</p>
                                                <p className={`font-semibold text-on-surface mt-0.5 ${item.capitalize ? 'capitalize' : ''}`}>{item.value}</p>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Email row — editable */}
                                    <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl">
                                        <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center flex-shrink-0">
                                            <span className="material-symbols-outlined text-on-secondary-container text-[18px]">mail</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Email Address</p>
                                            {editEmail ? (
                                                <div className="flex items-center gap-2 mt-1">
                                                    <input
                                                        type="email"
                                                        value={emailInput}
                                                        onChange={e => setEmailInput(e.target.value)}
                                                        className="flex-1 bg-surface rounded-lg px-3 py-1.5 text-sm border border-outline-variant/30 focus:ring-2 focus:ring-primary/20 outline-none"
                                                        placeholder="your@email.com"
                                                    />
                                                    <button
                                                        onClick={handleSaveEmail}
                                                        disabled={saving}
                                                        className="px-3 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-bold disabled:opacity-50"
                                                    >{saving ? 'Saving...' : 'Save'}</button>
                                                    <button
                                                        onClick={() => { setEditEmail(false); setEmailInput(staffData?.email || ''); }}
                                                        className="px-3 py-1.5 bg-surface-container text-on-surface-variant rounded-lg text-xs font-bold"
                                                    >Cancel</button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3 mt-0.5">
                                                    <p className="font-semibold text-on-surface">{displayEmail || <span className="text-on-surface-variant italic font-normal">Not set</span>}</p>
                                                    <button
                                                        onClick={() => setEditEmail(true)}
                                                        className="text-primary text-xs font-bold hover:underline"
                                                    >{displayEmail ? 'Edit' : 'Add'}</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right column */}
                            <div className="col-span-12 lg:col-span-5 space-y-6">
                                <div className="bg-primary text-on-primary rounded-2xl p-8 relative overflow-hidden">
                                    <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-white/10"></div>
                                    <span className="material-symbols-outlined text-3xl mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                                    <p className="text-xs font-bold uppercase tracking-widest text-on-primary/70 mb-1">Current Role</p>
                                    <h4 className="text-xl font-bold capitalize">{displayRole}</h4>
                                    <p className="text-on-primary/70 text-sm mt-1">UniClinic Health Services</p>
                                </div>

                                <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="bg-surface-container-low rounded-xl p-5 text-center">
                                            <p className="text-2xl font-black text-on-surface">{uniqueStudents}</p>
                                            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">Students Seen</p>
                                        </div>
                                        <div className="bg-surface-container-low rounded-xl p-5 text-center">
                                            <p className="text-2xl font-black text-on-surface">{myVisits.length}</p>
                                            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">Visits Handled</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'access' && (
                        <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden">
                            <div className="px-8 py-6 bg-surface-container-low/50 flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">history</span>
                                <h3 className="font-bold text-on-surface">Login & Activity History</h3>
                            </div>
                            <div className="divide-y divide-surface-container">
                                {lastActive ? (
                                    <div className="px-8 py-5 flex items-center gap-5">
                                        <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center flex-shrink-0">
                                            <span className="material-symbols-outlined text-[18px] text-primary">login</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-on-surface text-sm">Last System Login</p>
                                            <p className="text-xs text-on-surface-variant">{fmtDateTime(lastActive)}</p>
                                        </div>
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary-container/20 text-primary">Verified</span>
                                    </div>
                                ) : (
                                    <div className="px-8 py-5 flex items-center gap-5">
                                        <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0">
                                            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">login</span>
                                        </div>
                                        <p className="text-sm text-on-surface-variant">No login recorded yet.</p>
                                    </div>
                                )}
                                <div className="px-8 py-5 flex items-center gap-5">
                                    <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined text-[18px] text-secondary">medical_services</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-on-surface text-sm">Total Visits Handled</p>
                                        <p className="text-xs text-on-surface-variant">{myVisits.length} visit{myVisits.length !== 1 ? 's' : ''} attributed to your account</p>
                                    </div>
                                </div>
                                <div className="px-8 py-5 flex items-center gap-5">
                                    <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined text-[18px] text-secondary">groups</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-on-surface text-sm">Unique Students Seen</p>
                                        <p className="text-xs text-on-surface-variant">{uniqueStudents} unique student{uniqueStudents !== 1 ? 's' : ''} across all your visits</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </>
    );
};

export default Profile;
