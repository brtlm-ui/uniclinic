import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../navbar/Sidebar';
import Header from '../navbar/Header';
import { AddEditStaffModal, ConfirmDeleteModal } from '../modals/SharedModals';
import { config, endpoints } from '../config/config';

const getRoleBadge = (role) => {
    if (role === 'doctor') return 'bg-sky-100 text-sky-800 border border-sky-200';
    if (role === 'nurse') return 'bg-tertiary-container text-on-tertiary-container border border-tertiary-fixed-dim';
    return 'bg-secondary-container text-on-secondary-container border border-outline-variant/30';
};

const getInitials = (name = '') => name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

const timeAgo = (dateStr) => {
    if (!dateStr) return '—';
    const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const StaffManagement = () => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${config.uniClinicAPI}${endpoints.staff}`);
            setStaff(res.data);
        } catch {
            setError('Failed to load staff.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStaff(); }, []);
    useEffect(() => { setPage(1); }, [search]);

    const handleAdd = async (form) => {
        try {
            await axios.post(`${config.uniClinicAPI}${endpoints.staff}`, form);
            fetchStaff();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add staff.');
        }
    };

    const handleEdit = async (form) => {
        const payload = { name: form.name, role: form.role, username: form.username };
        if (form.password) payload.password = form.password;
        try {
            await axios.put(`${config.uniClinicAPI}${endpoints.staff}/${selected.staff_id}`, payload);
            fetchStaff();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update staff.');
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${config.uniClinicAPI}${endpoints.staff}/${selected.staff_id}`);
            setDeleteOpen(false);
            fetchStaff();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete staff.');
        }
    };

    const openEdit = (s) => { setSelected(s); setEditOpen(true); };
    const openDelete = (s) => { setSelected(s); setDeleteOpen(true); };

    // Real stats
    const doctorCount = staff.filter(s => s.role === 'doctor').length;
    const nurseCount = staff.filter(s => s.role === 'nurse').length;
    const adminCount = staff.filter(s => s.role === 'admin').length;

    const filtered = staff.filter(s => {
        const q = search.toLowerCase();
        return !q ||
            (s.name || '').toLowerCase().includes(q) ||
            (s.role || '').toLowerCase().includes(q) ||
            (s.username || '').toLowerCase().includes(q);
    });

    const PAGE_SIZE = 10;
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <>
            <Sidebar />
            <main className="flex-1 ml-72 min-h-screen overflow-y-auto pt-0 pb-12">

                <Header hasSearch={true} searchPlaceholder="Search staffs..." />

                <section className="p-12 pt-10 space-y-12">

                    <div className="flex justify-between items-end">
                        <div className="space-y-2">
                            <h1 className="text-5xl font-extrabold tracking-tight text-on-surface leading-tight">Clinical Team<br /><span className="text-primary">Management</span></h1>
                            <p className="text-on-surface-variant max-w-md text-lg">Oversee clinical staff permissions and access levels for the school healthcare ecosystem.</p>
                        </div>
                        <button
                            onClick={() => setAddOpen(true)}
                            className="bg-primary text-on-primary px-8 py-4 rounded-full font-bold flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95"
                        >
                            <span className="material-symbols-outlined">person_add</span>
                            Register New Staff
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10">
                            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">Total Active Staff</p>
                            <div className="flex items-end gap-2">
                                <span className="text-4xl font-black text-on-surface">{staff.length}</span>
                            </div>
                            <p className="text-xs text-on-surface-variant mt-2">{doctorCount} doctor{doctorCount !== 1 ? 's' : ''} · {nurseCount} nurse{nurseCount !== 1 ? 's' : ''} · {adminCount} admin{adminCount !== 1 ? 's' : ''}</p>
                        </div>
                        <div className="bg-primary text-on-primary p-8 rounded-xl shadow-xl shadow-primary/10">
                            <p className="text-xs font-bold uppercase tracking-widest text-on-primary/70 mb-4">Doctors on Staff</p>
                            <div className="flex items-end gap-2">
                                <span className="text-4xl font-black">{doctorCount}</span>
                                <span className="text-on-primary/80 mb-1">Clinical Personnel</span>
                            </div>
                        </div>
                        <div className="col-span-1 md:col-span-2 bg-tertiary-container text-on-tertiary-container p-8 rounded-xl relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-4">Quick Action</p>
                                <h3 className="text-xl font-bold mb-4">Generate Compliance Report</h3>
                                <button className="bg-tertiary text-on-tertiary px-6 py-2 rounded-full text-sm font-semibold">Start Export</button>
                            </div>
                            <span className="material-symbols-outlined absolute -right-8 -bottom-8 text-9xl opacity-10">shield_with_heart</span>
                        </div>
                    </div>

                    <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
                        <div className="px-8 py-6 flex justify-between items-center bg-surface-container-low/50">
                            <h3 className="font-bold text-xl text-on-surface">Staff Directory</h3>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
                                    <input
                                        className="pl-10 pr-4 py-2 bg-surface rounded-full border-none focus:ring-2 focus:ring-primary/20 transition-all text-sm w-64"
                                        placeholder="Search by name, role, or username..."
                                        type="text"
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-separate border-spacing-0">
                                <thead>
                                    <tr>
                                        <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant border-b border-surface-container-high bg-surface-container-low/20">Name &amp; Identity</th>
                                        <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant border-b border-surface-container-high bg-surface-container-low/20">Role</th>
                                        <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant border-b border-surface-container-high bg-surface-container-low/20">Username</th>
                                        <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant border-b border-surface-container-high bg-surface-container-low/20">Last Active</th>
                                        <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant border-b border-surface-container-high bg-surface-container-low/20 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-surface-container-high">

                                    {loading ? (
                                        <tr><td colSpan={5} className="px-8 py-12 text-center text-on-surface-variant">Loading staff...</td></tr>
                                    ) : error ? (
                                        <tr><td colSpan={5} className="px-8 py-12 text-center text-error">{error}</td></tr>
                                    ) : staff.length === 0 ? (
                                        <tr><td colSpan={5} className="px-8 py-12 text-center text-on-surface-variant">No staff found.</td></tr>
                                    ) : paged.length === 0 ? (
                                        <tr><td colSpan={5} className="px-8 py-12 text-center text-on-surface-variant">No staff match your search.</td></tr>
                                    ) : paged.map((s) => (
                                        <tr key={s.staff_id} className="hover:bg-surface-container-low/30 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-full bg-primary-container flex-shrink-0 flex items-center justify-center text-on-primary-container font-bold text-sm">
                                                        {getInitials(s.name)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-on-surface group-hover:text-primary transition-colors">{s.name}</p>
                                                        <p className="text-xs text-on-surface-variant capitalize">{s.role}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${getRoleBadge(s.role)}`}>{s.role}</span>
                                            </td>
                                            <td className="px-8 py-6 font-mono text-sm text-on-surface-variant">{s.username}</td>
                                            <td className="px-8 py-6 text-sm text-on-surface-variant">{timeAgo(s.last_active)}</td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => openEdit(s)} className="w-10 h-10 rounded-full hover:bg-secondary-container text-on-secondary-container flex items-center justify-center transition-all" title="Edit">
                                                        <span className="material-symbols-outlined text-[20px]">edit_square</span>
                                                    </button>
                                                    <button onClick={() => openDelete(s)} className="w-10 h-10 rounded-full hover:bg-error-container text-on-error-container flex items-center justify-center transition-all" title="Delete">
                                                        <span className="material-symbols-outlined text-[20px]">delete_sweep</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-8 py-6 flex justify-between items-center text-sm font-medium text-on-surface-variant">
                            <span>
                                {filtered.length === 0 ? 'No staff found' :
                                    `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length} staff member${filtered.length !== 1 ? 's' : ''}${search ? ' (filtered)' : ''}`}
                            </span>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 rounded-full hover:bg-surface-container-low transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                >Previous</button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(n => totalPages <= 5 || Math.abs(n - page) <= 1 || n === 1 || n === totalPages)
                                    .map((n, idx, arr) => (
                                        <React.Fragment key={n}>
                                            {idx > 0 && arr[idx - 1] !== n - 1 && (
                                                <span className="w-10 h-10 flex items-center justify-center text-xs">…</span>
                                            )}
                                            <button
                                                onClick={() => setPage(n)}
                                                className={`w-10 h-10 flex items-center justify-center rounded-full font-bold transition-colors ${page === n ? 'bg-primary text-on-primary' : 'hover:bg-surface-container-low'}`}
                                            >{n}</button>
                                        </React.Fragment>
                                    ))}
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="px-4 py-2 rounded-full hover:bg-surface-container-low transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                >Next</button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                        <div className="md:col-span-7 bg-surface-container-highest p-12 rounded-xl">
                            <h2 className="text-3xl font-bold mb-4">Security Protocol</h2>
                            <p className="text-on-surface-variant mb-8 leading-relaxed">All staff actions are logged for medical audit compliance. Username changes require Administrative override and two-factor authentication. Please ensure all roles are assigned based on current medical certifications.</p>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2 text-primary font-bold">
                                    <span className="material-symbols-outlined">shield</span>
                                    Audit Logs
                                </div>
                                <div className="flex items-center gap-2 text-on-surface-variant font-bold">
                                    <span className="material-symbols-outlined">history_edu</span>
                                    Certification Hub
                                </div>
                            </div>
                        </div>
                        <div className="md:col-span-5 relative h-64 rounded-xl overflow-hidden shadow-2xl shadow-slate-900/10">
                            <img alt="Modern clinic" className="w-full h-full object-cover" data-alt="abstract blurred view of a ultra-modern minimalist hospital interior with soft blue and white tones and clean lines" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCU9mjUxCRhCwl5Of0Ilek0U3EB92ls9A57vuXWBTpZIRlAyFY_nw6ni4Zlr2vOL9i74gx2nU0lplkrJ3Wevb5t6neW5_5datSvvs78Byc-rbzMm0TlYRdTiXu4yAoBdywfIUAwziTtYULKJPUhs7Vn4T2PT99tllLbJ6eUpEx9oQ7EHC67Ym7hAQvWjmVd91MhgIMVlJ76YKK2Xx_NdSVoCcOZvxenMskPbTHQHLzOY2uWFiFdo66aTbarTDplWtlIDp9y-PZ7T5c" />
                            <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm flex flex-col justify-center items-center text-on-primary text-center p-8">
                                <h4 className="text-xl font-bold mb-2">Staff Training Portal</h4>
                                <p className="text-sm opacity-90 mb-6">Access the latest hygiene and emergency response protocols.</p>
                                <button className="bg-white text-primary px-6 py-2 rounded-full font-bold text-sm shadow-lg">Enter Portal</button>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            {/* Modals */}
            <AddEditStaffModal open={addOpen} onClose={() => setAddOpen(false)} onSubmit={handleAdd} />
            <AddEditStaffModal open={editOpen} onClose={() => setEditOpen(false)} staff={selected} onSubmit={handleEdit} />
            <ConfirmDeleteModal
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDelete}
                itemName={selected?.name}
                itemType="staff member"
            />
        </>
    );
};

export default StaffManagement;
