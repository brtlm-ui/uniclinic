import React, { useState } from 'react';
import Sidebar from '../navbar/Sidebar';
import Header from '../navbar/Header';
import { useNavigate } from 'react-router-dom';

const DEFAULT_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYNJS2j9zKN5JENqHQe6xAmOZtg1qgKXAgMb2l-UwwZSdhnNHKTiPfGCxzEBDiw6Tzae9bIBdt7ceUR43ZQAaqGevOgl0oP0CzjBr0BjAzlAHdal9jyhtxnycsVLqAphOZuGBAy39XEbM7E1PH-jWiycWODCh6_nOeyOpoRWuMjltNNXk-rmXiGggbPR8RDzCoDCi9VqR6BEp1W1gJBo-4NbFzBFwMHMpMtJhiusfzBO9Yd1jQNqu7rVp0zLXk81KmMH57-XNS-vk';

const Profile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'credentials', label: 'Credentials' },
        { id: 'access', label: 'Access History' },
    ];

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
                        <h1 className="font-manrope text-4xl font-black text-on-primary tracking-tight">Dr. Sarah Miller</h1>
                        <p className="text-on-primary/70 mt-1 font-medium">Senior Practitioner • UniClinic Health Services</p>
                    </div>
                </div>

                {/* Profile Card floated up */}
                <section className="px-8 -mt-12 mb-8 relative z-10">
                    <div className="bg-surface-container-lowest rounded-2xl shadow-lg p-8 flex items-center gap-8">
                        <div className="relative flex-shrink-0">
                            <img
                                src={DEFAULT_AVATAR}
                                alt="Dr. Sarah Miller"
                                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md"
                            />
                            <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-primary border-2 border-white"></span>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="font-manrope text-2xl font-black text-on-surface">Sarah Miller-West</h2>
                                    <p className="text-on-surface-variant font-medium">Senior Clinical Practitioner</p>
                                    <div className="flex items-center gap-4 mt-3">
                                        <span className="inline-flex items-center gap-1.5 bg-primary-container/20 text-primary px-3 py-1 rounded-full text-xs font-bold">
                                            <span className="material-symbols-outlined text-sm">badge</span>
                                            CC-8829-NW
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 bg-surface-container text-on-surface-variant px-3 py-1 rounded-full text-xs font-bold">
                                            <span className="material-symbols-outlined text-sm">school</span>
                                            6 Years Tenure
                                        </span>
                                    </div>
                                </div>
                                <button className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-bold text-sm hover:bg-primary-dim transition-all shadow-lg shadow-primary/20">
                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                        {/* Quick stats */}
                        <div className="hidden lg:flex items-center gap-8 border-l border-outline-variant/20 pl-8">
                            <div className="text-center">
                                <p className="text-3xl font-black font-manrope text-on-surface">1,240</p>
                                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">Students Managed</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-black font-manrope text-on-surface">4,892</p>
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
                                <div className="space-y-5">
                                    {[
                                        { label: 'Full Name', value: 'Sarah Miller-West', icon: 'badge' },
                                        { label: 'Staff ID', value: 'CC-8829-NW', icon: 'tag' },
                                        { label: 'Email Address', value: 's.miller@curatedcare.edu', icon: 'mail' },
                                        { label: 'Phone Number', value: '+1 (555) 234-8910', icon: 'phone' },
                                    ].map(item => (
                                        <div key={item.label} className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl">
                                            <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center flex-shrink-0">
                                                <span className="material-symbols-outlined text-on-secondary-container text-[18px]">{item.icon}</span>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{item.label}</p>
                                                <p className="font-semibold text-on-surface mt-0.5">{item.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Info cards */}
                            <div className="col-span-12 lg:col-span-5 space-y-6">
                                <div className="bg-primary text-on-primary rounded-2xl p-8 relative overflow-hidden">
                                    <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-white/10"></div>
                                    <span className="material-symbols-outlined text-3xl mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                                    <p className="text-xs font-bold uppercase tracking-widest text-on-primary/70 mb-1">Current Role</p>
                                    <h4 className="text-xl font-bold">Senior Practitioner</h4>
                                    <p className="text-on-primary/70 text-sm mt-1">Oakwood High School Clinic</p>
                                </div>

                                <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm">
                                    <h4 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-4">Need to update credentials?</h4>
                                    <p className="text-on-surface-variant text-sm leading-relaxed mb-5">Contact the Human Resources portal to update your licensing or primary workplace location.</p>
                                    <button className="flex items-center gap-2 text-primary font-bold text-sm hover:underline">
                                        Visit HR Portal
                                        <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'credentials' && (
                        <div className="space-y-4">
                            {[
                                { title: 'Registered Nurse (RN)', issuer: 'Board of Nursing', detail: 'License #RN-299301-A', status: 'active', icon: 'medical_services' },
                                { title: 'M.S. in Nursing (MSN)', issuer: 'State University Health Sciences', detail: '2015', status: 'active', icon: 'school' },
                                { title: 'Pediatric Advanced Life Support (PALS)', issuer: 'American Heart Association', detail: 'Expires September 2025', status: 'expiring', icon: 'favorite' },
                                { title: 'Basic Life Support (BLS)', issuer: 'American Heart Association', detail: 'Cert #BLS-2023-441', status: 'active', icon: 'health_and_safety' },
                            ].map(cred => (
                                <div key={cred.title} className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex items-center gap-6">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${cred.status === 'expiring' ? 'bg-tertiary-container' : 'bg-primary-container/20'}`}>
                                        <span className={`material-symbols-outlined text-2xl ${cred.status === 'expiring' ? 'text-on-tertiary-container' : 'text-primary'}`}>{cred.icon}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-on-surface">{cred.title}</h4>
                                        <p className="text-sm text-on-surface-variant">{cred.issuer}</p>
                                        <p className="text-xs font-medium text-on-surface-variant mt-1">{cred.detail}</p>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                                        cred.status === 'expiring'
                                            ? 'bg-tertiary-container text-on-tertiary-container'
                                            : 'bg-primary-container/20 text-primary'
                                    }`}>
                                        {cred.status === 'expiring' ? 'Expiring Soon' : 'Active'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'access' && (
                        <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden">
                            <div className="px-8 py-6 bg-surface-container-low/50 flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">history</span>
                                <h3 className="font-bold text-on-surface">Recent Login & Activity History</h3>
                            </div>
                            <div className="divide-y divide-surface-container">
                                {[
                                    { action: 'System Login', detail: 'Today, 08:30 AM', extra: 'IP: 192.168.1.45', icon: 'login', type: 'success' },
                                    { action: 'Password Updated', detail: 'Oct 12, 2023', extra: '04:15 PM', icon: 'lock', type: 'info' },
                                    { action: 'Inventory Audit', detail: 'Oct 10, 2023', extra: '11:20 AM', icon: 'inventory_2', type: 'info' },
                                    { action: 'Student Record Accessed', detail: 'Oct 09, 2023', extra: '02:45 PM — Student ID #4412', icon: 'person_search', type: 'info' },
                                    { action: 'Failed Login Attempt', detail: 'Oct 08, 2023', extra: 'IP: 203.0.113.99 (blocked)', icon: 'gpp_bad', type: 'error' },
                                ].map((entry, i) => (
                                    <div key={i} className="px-8 py-5 flex items-center gap-5 hover:bg-surface-container-low/30 transition-colors">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                            entry.type === 'success' ? 'bg-primary-container/20' :
                                            entry.type === 'error' ? 'bg-error-container/20' : 'bg-secondary-container/20'
                                        }`}>
                                            <span className={`material-symbols-outlined text-[18px] ${
                                                entry.type === 'success' ? 'text-primary' :
                                                entry.type === 'error' ? 'text-error' : 'text-secondary'
                                            }`}>{entry.icon}</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-on-surface text-sm">{entry.action}</p>
                                            <p className="text-xs text-on-surface-variant">{entry.detail} &bull; {entry.extra}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </>
    );
};

export default Profile;
