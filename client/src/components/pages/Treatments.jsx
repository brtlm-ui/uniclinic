import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../navbar/Sidebar';
import Header from '../navbar/Header';
import { AddEditTreatmentModal, ConfirmDeleteModal } from '../modals/SharedModals';
import { config, endpoints } from '../config/config';

const Treatments = () => {
    const [treatments, setTreatments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');

    const fetchTreatments = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${config.uniClinicAPI}${endpoints.treatments}`);
            setTreatments(res.data);
        } catch {
            setError('Failed to load treatments.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTreatments(); }, []);
    useEffect(() => { setPage(1); }, [search]);

    const handleAdd = async (form) => {
        try {
            await axios.post(`${config.uniClinicAPI}${endpoints.treatments}`, form);
            fetchTreatments();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add treatment.');
        }
    };

    const handleEdit = async (form) => {
        try {
            await axios.put(`${config.uniClinicAPI}${endpoints.treatments}/${selected.treatment_id}`, form);
            fetchTreatments();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update treatment.');
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${config.uniClinicAPI}${endpoints.treatments}/${selected.treatment_id}`);
            setDeleteOpen(false);
            fetchTreatments();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete treatment.');
        }
    };

    const openEdit = (t) => { setSelected(t); setEditOpen(true); };
    const openDelete = (t) => { setSelected(t); setDeleteOpen(true); };

    // Derived stats
    const todayStr = new Date().toISOString().slice(0, 10);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthCount = treatments.filter(t => {
        if (!t.visit_date) return false;
        const d = new Date(t.visit_date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;
    const todayCount = treatments.filter(t => t.visit_date?.slice(0, 10) === todayStr).length;

    const filtered = treatments.filter(t => {
        const q = search.toLowerCase();
        return !q ||
            (t.treatment_given || '').toLowerCase().includes(q) ||
            (t.student_name || '').toLowerCase().includes(q) ||
            (t.notes || '').toLowerCase().includes(q);
    });

    const PAGE_SIZE = 10;
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return(
        <>
            <Sidebar />
            <main className="ml-72 min-h-screen pt-0 pb-12">
                <Header hasSearch={true} searchPlaceholder="Search Treatment Records"/>
                <section className="px-8 pt-10 mb-20 flex justify-between items-end">
                    <div className="max-w-2xl">
                        <span className="text-primary font-bold tracking-widest text-xs uppercase mb-4 block">Medical Administration</span>
                        <h1 className="text-6xl font-extrabold tracking-tight text-on-surface leading-tight">
                            Treatment <br /> <span className="text-outline-variant/60 italic">Records</span>
                        </h1>
                        <p className="mt-8 text-on-surface-variant text-lg leading-relaxed font-medium">
                            Comprehensive log of all medical interventions, triage protocols, and supervised clinical administrations performed within the facility.
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-6">
                        <div className="flex -space-x-4">
                            <img className="w-14 h-14 rounded-full border-4 border-surface object-cover" data-alt="professional female doctor with stethoscope in clean medical setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC43f_KGDl_itounXx-ubVmYYNlfNzuLGQA4dQ8iQq6g2Hhw9zINFR_KA4D5IPhTylg8pgVaIdvXd_wuExUxCBgRxX-zeGG3Z_bz4umYaUKxUI_Z8gPc99Ps-GZLqJ_Pvj4afKPyUoVJ6clhkjOzgMj7I_oTmVs1kGMW2nK7ELAmtviSDbJb-gXpqrlUYC75AdLGBY5Vvon5uB8lJMrpF0K6J-AKFyZDezzuY_ayAqsfaZUJ0QdU62Aor9GybOgIqGdS0zeAbLlwDE" />
                            <img className="w-14 h-14 rounded-full border-4 border-surface object-cover" data-alt="confident male physician in white coat smiling in modern clinic" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBURo547Bki2RS8swMUBv-5gBiUpjo4JKy0w0NghRMCxzwHWQP1YKPoV86EA_KmeaKivOhypmixbQhdqr84XR0xzxktK7oy03HuSWgQsp8p3MuJ9NdjZUDJjZSo91IP6hOwj2Ct-33Xq2M01fIWhtAER0Ju4pFZY0uehG1Cdvwbl76DirOvKYnIfUDYZ29gZ3dHmqR1Qcf9f6U7G0KFAnYwZ54wOW95JgsxX_BArJfZ9KP5LBsO_5IuebmJg-P4Jf-4wXZSJ6rWLHI" />
                            <div className="w-14 h-14 rounded-full border-4 border-surface bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-sm">+4</div>
                        </div>
                        <button
                            onClick={() => setAddOpen(true)}
                            className="bg-primary text-on-primary px-10 py-4 rounded-full font-bold shadow-xl shadow-primary/20 flex items-center gap-3 active:scale-95 transition-all">
                            <span className="material-symbols-outlined">add</span>
                            New Record
                        </button>
                    </div>
                </section>

                <section className="px-8 grid grid-cols-12 gap-8 mb-16">
                    <div className="col-span-8 bg-surface-container-lowest rounded-xl p-10 flex items-center gap-12 shadow-sm">
                        <div className="h-32 w-32 rounded-full border-[10px] border-primary-fixed flex items-center justify-center flex-shrink-0">
                            <span className="text-3xl font-black text-primary">{treatments.length}</span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Total Records</h3>
                            <p className="text-on-surface-variant max-w-sm">All treatment records logged in the system across all patient visits.</p>
                            <p className="mt-3 text-sm font-bold text-primary">{todayCount} recorded today</p>
                        </div>
                    </div>
                    <div className="col-span-4 bg-tertiary-container rounded-xl p-10 flex flex-col justify-between text-on-tertiary-container">
                        <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: '\'FILL\' 1' }}>analytics</span>
                        <div>
                            <div className="text-4xl font-black">{thisMonthCount.toLocaleString()}</div>
                            <div className="font-bold opacity-80">Treatments This Month</div>
                        </div>
                    </div>
                </section>

                <div className="px-8 bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
                    <div className="p-8 flex justify-between items-center bg-surface-container-low/30">
                        <div className="relative w-96">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
                            <input
                                className="w-full pl-12 pr-4 py-3 bg-surface rounded-full border-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                                placeholder="Search by treatment, student, or notes..."
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => setSearch('')} className="p-3 rounded-full hover:bg-surface-variant transition-colors" title="Clear search">
                                <span className="material-symbols-outlined text-on-surface-variant">filter_list</span>
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-container-low/50">
                                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-outline">Treatment ID</th>
                                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-outline">Student</th>
                                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-outline">Visit Date</th>
                                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-outline">Treatment Given</th>
                                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-outline">Notes</th>
                                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-outline text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-container">

                                {loading ? (
                                    <tr><td colSpan={5} className="px-8 py-12 text-center text-on-surface-variant">Loading treatments...</td></tr>
                                ) : error ? (
                                    <tr><td colSpan={5} className="px-8 py-12 text-center text-error">{error}</td></tr>
                                ) : treatments.length === 0 ? (
                                    <tr><td colSpan={6} className="px-8 py-12 text-center text-on-surface-variant">No treatment records found.</td></tr>
                                ) : paged.length === 0 ? (
                                    <tr><td colSpan={6} className="px-8 py-12 text-center text-on-surface-variant">No records match your search.</td></tr>
                                ) : paged.map((t) => (
                                    <tr key={t.treatment_id} className="group hover:bg-surface-container-low transition-colors">
                                        <td className="px-8 py-6 font-bold text-primary">TR-{t.treatment_id}</td>
                                        <td className="px-8 py-6">
                                            <span className="font-semibold text-on-surface">{t.student_name || `Visit #${t.visit_id}`}</span>
                                        </td>
                                        <td className="px-8 py-6 text-sm text-on-surface-variant">
                                            {t.visit_date ? new Date(t.visit_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center flex-shrink-0">
                                                    <span className="material-symbols-outlined text-primary text-lg">healing</span>
                                                </div>
                                                <span className="font-bold">{t.treatment_given}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-sm text-on-surface-variant max-w-xs truncate">{t.notes || '—'}</td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openEdit(t)} className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-primary transition-all">
                                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                                </button>
                                                <button onClick={() => openDelete(t)} className="p-2 rounded-full hover:bg-error-container/20 text-on-surface-variant hover:text-error transition-all">
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-8 border-t border-surface-container flex justify-between items-center">
                        <span className="text-sm font-medium text-on-surface-variant">
                            {filtered.length === 0 ? 'No records found' :
                                `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length} record${filtered.length !== 1 ? 's' : ''}${search ? ' (filtered)' : ''}`}
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-variant text-on-surface transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(n => totalPages <= 5 || Math.abs(n - page) <= 1 || n === 1 || n === totalPages)
                                .map((n, idx, arr) => (
                                    <React.Fragment key={n}>
                                        {idx > 0 && arr[idx - 1] !== n - 1 && (
                                            <span className="w-10 h-10 flex items-center justify-center text-on-surface-variant text-xs">…</span>
                                        )}
                                        <button
                                            onClick={() => setPage(n)}
                                            className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm shadow-md transition-colors ${page === n ? 'bg-primary text-on-primary' : 'bg-surface-container hover:bg-surface-variant text-on-surface'}`}
                                        >{n}</button>
                                    </React.Fragment>
                                ))}
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-variant text-on-surface transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>

                <section className="px-8 mt-20 grid grid-cols-2 gap-12">
                    <div className="relative overflow-hidden rounded-xl h-80 group">
                        <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="clean bright medical office with modern equipment and natural light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMVTf6Ppj5T8tKS6Z3iKpBETEuYOL8ZouT3Bq2PqneigqxGTTE-vcEj4pjvoXPHoi4oKO9jSg8e0tLf8tFAVMfvpdIVBWyitUll4jxPTAONbLUDDsWi2ykCzq9pk5Gr4Brq5L2hNdXVLx5ChHaS8-hwWyVwsMR7lThLOOkulFpDp_eIBQdZLceDrRwuQKQO15HycNB8S9xR9C1K0JS4F5yDqX5fdNyGEYB9VrUpYFWtqUQYRL0fPrqWuTcvithV790eXUjR953sGQ" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-10 flex flex-col justify-end">
                            <h4 className="text-white text-2xl font-bold mb-2">Clinic Best Practices</h4>
                            <p className="text-white/70">Review the updated 2024 protocols for treatment documentation and patient privacy.</p>
                        </div>
                    </div>
                    <div className="bg-primary-container/10 rounded-xl p-10 border border-primary-container/20">
                        <div className="flex items-center gap-4 mb-6 text-primary">
                            <span className="material-symbols-outlined text-4xl">verified_user</span>
                            <h4 className="text-2xl font-bold">Compliance Audit</h4>
                        </div>
                        <p className="text-on-surface-variant leading-relaxed mb-8">
                            Your records are currently 100% compliant with the state healthcare standards for educational institutions. Your last audit was 4 days ago.
                        </p>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-3 bg-surface-container rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full w-full"></div>
                            </div>
                            <span className="font-bold text-primary">Excellent</span>
                        </div>
                    </div>
                </section>
            </main>

            {/* Modals */}
            <AddEditTreatmentModal open={addOpen} onClose={() => setAddOpen(false)} onSubmit={handleAdd} />
            <AddEditTreatmentModal open={editOpen} onClose={() => setEditOpen(false)} treatment={selected} onSubmit={handleEdit} />
            <ConfirmDeleteModal
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDelete}
                itemName={selected ? `TR-${selected.treatment_id}: ${selected.treatment_given}` : ''}
                itemType="treatment record"
            />
        </>
    );
};

export default Treatments;
