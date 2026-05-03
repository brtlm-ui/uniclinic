import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../navbar/Sidebar';
import Header from '../navbar/Header';
import { AddEditMedicineModal, ConfirmDeleteModal } from '../modals/SharedModals';
import { config, endpoints } from '../config/config';

const getMedicineStatus = (m) => {
    if (!m.expiration_date && m.stock_quantity <= 20)
        return { label: 'Low Stock', cls: 'bg-error-container text-on-error-container' };
    if (m.stock_quantity <= 20)
        return { label: 'Low Stock', cls: 'bg-error-container text-on-error-container' };
    if (m.expiration_date) {
        const days = (new Date(m.expiration_date) - new Date()) / (1000 * 60 * 60 * 24);
        if (days <= 30) return { label: 'Expiring', cls: 'bg-tertiary-container text-on-tertiary-container' };
    }
    return { label: 'OK Status', cls: 'bg-tertiary-container text-on-tertiary-container' };
};

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

const Medicines = () => {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');

    const fetchMedicines = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${config.uniClinicAPI}${endpoints.statistics.medicines}`);
            setMedicines(res.data);
        } catch {
            setError('Failed to load medicines.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMedicines(); }, []);
    useEffect(() => { setPage(1); }, [search]);

    const handleAdd = async (form) => {
        try {
            await axios.post(`${config.uniClinicAPI}${endpoints.medicines}`, form);
            fetchMedicines();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add medicine.');
        }
    };

    const handleEdit = async (form) => {
        try {
            await axios.put(`${config.uniClinicAPI}${endpoints.medicines}/${selected.medicine_id}`, form);
            fetchMedicines();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update medicine.');
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${config.uniClinicAPI}${endpoints.medicines}/${selected.medicine_id}`);
            setDeleteOpen(false);
            fetchMedicines();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete medicine.');
        }
    };

    const openEdit = (m) => { setSelected(m); setEditOpen(true); };
    const openDelete = (m) => { setSelected(m); setDeleteOpen(true); };

    // Real stats — derived from enriched statistics/medicines response
    const totalSKU = medicines.length;
    const lowStockCount = medicines.filter(m => m.stock_quantity <= 20).length;
    const expiringSoonCount = medicines.filter(m => {
        if (!m.expiration_date) return false;
        const days = (new Date(m.expiration_date) - new Date()) / (1000 * 60 * 60 * 24);
        return days > 0 && days <= 30;
    }).length;
    const totalDispensed = medicines.reduce((s, m) => s + (Number(m.total_dispensed) || 0), 0);

    const filtered = medicines.filter(m => {
        const q = search.toLowerCase();
        return !q || (m.name || '').toLowerCase().includes(q);
    });

    const PAGE_SIZE = 10;
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <>
            <Sidebar />
            <main className="flex-1 ml-72 min-h-screen overflow-y-auto pb-16">

                <Header hasSearch={true} searchPlaceholder="Search inventory..." />
                <section className="px-8 py-10">

                    <div className="flex justify-between items-end mb-16">
                        <div className="max-w-2xl">
                            <h1 className="text-6xl font-extrabold tracking-tight text-on-surface mb-4 leading-tight">Medicine <span className="text-primary">Inventory</span></h1>
                            <p className="text-on-surface-variant text-lg font-medium leading-relaxed">Precision management of pharmaceutical stock to ensure student safety and clinic efficiency.</p>
                        </div>
                        <button
                            onClick={() => setAddOpen(true)}
                            className="bg-primary text-on-primary px-8 py-4 rounded-full font-bold flex items-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            <span className="material-symbols-outlined">add</span>
                            <span>Register New Stock</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                        <div className="bg-surface-container-lowest p-8 rounded-xl flex flex-col justify-between h-48 border border-outline-variant/10">
                            <div className="flex justify-between items-start">
                                <span className="material-symbols-outlined text-primary text-3xl">inventory_2</span>
                                <span className="text-xs font-bold uppercase tracking-tighter text-on-surface-variant">Total SKU</span>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-on-surface">{totalSKU}</div>
                                <div className="text-sm text-on-surface-variant">Active medicines in stock</div>
                            </div>
                        </div>
                        <div className="bg-surface-container-low p-8 rounded-xl flex flex-col justify-between h-48">
                            <div className="flex justify-between items-start">
                                <span className="material-symbols-outlined text-error text-3xl">warning</span>
                                <span className="text-xs font-bold uppercase tracking-tighter text-on-surface-variant">Critically Low</span>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-on-surface">{lowStockCount}</div>
                                <div className="text-sm text-on-surface-variant">Require immediate restock</div>
                            </div>
                        </div>
                        <div className="bg-tertiary-container/30 p-8 rounded-xl flex flex-col justify-between h-48 border border-tertiary/5">
                            <div className="flex justify-between items-start">
                                <span className="material-symbols-outlined text-tertiary text-3xl">event_busy</span>
                                <span className="text-xs font-bold uppercase tracking-tighter text-on-surface-variant">Expiring Soon</span>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-on-surface">{expiringSoonCount}</div>
                                <div className="text-sm text-on-surface-variant">Within next 30 days</div>
                            </div>
                        </div>
                        <div className="bg-primary/10 p-8 rounded-xl flex flex-col justify-between h-48 border border-primary/10">
                            <div className="flex justify-between items-start">
                                <span className="material-symbols-outlined text-primary text-3xl">medication_liquid</span>
                                <span className="text-xs font-bold uppercase tracking-tighter text-on-surface-variant">Total Dispensed</span>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-on-surface">{totalDispensed.toLocaleString()}</div>
                                <div className="text-sm text-on-surface-variant">Units given across all visits</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm shadow-slate-200">
                        <div className="px-8 py-6 border-b border-surface-container flex items-center justify-between bg-surface-container-lowest">
                            <div className="relative w-80">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
                                <input
                                    className="w-full pl-11 pr-4 py-2.5 bg-surface rounded-full border-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                                    placeholder="Search medicines..."
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-primary-container"></span>
                                    <span className="text-xs font-medium text-on-surface-variant">In Stock</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-error-container"></span>
                                    <span className="text-xs font-medium text-on-surface-variant">Low Stock</span>
                                </div>
                            </div>
                        </div>
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-on-surface-variant text-[11px] font-bold uppercase tracking-widest border-b border-surface-container">
                                    <th className="px-8 py-6">Medicine Name</th>
                                    <th className="px-8 py-6">Stock Quantity</th>
                                    <th className="px-8 py-6">Expiration Date</th>
                                    <th className="px-8 py-6">Times Prescribed</th>
                                    <th className="px-8 py-6">Status</th>
                                    <th className="px-8 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-container-low">

                                {loading ? (
                                    <tr><td colSpan={6} className="px-8 py-12 text-center text-on-surface-variant">Loading medicines...</td></tr>
                                ) : error ? (
                                    <tr><td colSpan={6} className="px-8 py-12 text-center text-error">{error}</td></tr>
                                ) : medicines.length === 0 ? (
                                    <tr><td colSpan={6} className="px-8 py-12 text-center text-on-surface-variant">No medicines found.</td></tr>
                                ) : paged.length === 0 ? (
                                    <tr><td colSpan={6} className="px-8 py-12 text-center text-on-surface-variant">No medicines match your search.</td></tr>
                                ) : paged.map((m) => {
                                    const status = getMedicineStatus(m);
                                    return (
                                    <tr key={m.medicine_id} className="group hover:bg-surface-container-low/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                                                    <span className="material-symbols-outlined text-[20px]">medication</span>
                                                </div>
                                                <div>
                                                    <div className="font-bold text-on-surface">{m.name}</div>
                                                    <div className="text-xs text-on-surface-variant">ID: {m.medicine_id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="font-semibold text-on-surface">{m.stock_quantity} <span className="text-on-surface-variant text-xs font-normal">units</span></span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-on-surface-variant font-medium">{formatDate(m.expiration_date)}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="font-semibold text-on-surface">{Number(m.times_prescribed) || 0}</div>
                                            <div className="text-xs text-on-surface-variant">{Number(m.total_dispensed) || 0} units total</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${status.cls}`}>
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openEdit(m)} className="p-2 hover:bg-white rounded-full text-on-surface-variant hover:text-primary transition-colors">
                                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                                </button>
                                                <button onClick={() => openDelete(m)} className="p-2 hover:bg-white rounded-full text-on-surface-variant hover:text-error transition-colors">
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <div className="px-8 py-6 flex items-center justify-between text-sm text-on-surface-variant">
                            <p>{filtered.length === 0 ? 'No medicines found' :
                                `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length} medicine${filtered.length !== 1 ? 's' : ''}${search ? ' (filtered)' : ''}`}</p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(n => totalPages <= 5 || Math.abs(n - page) <= 1 || n === 1 || n === totalPages)
                                    .map((n, idx, arr) => (
                                        <React.Fragment key={n}>
                                            {idx > 0 && arr[idx - 1] !== n - 1 && (
                                                <span className="w-8 h-8 flex items-center justify-center text-xs">…</span>
                                            )}
                                            <button
                                                onClick={() => setPage(n)}
                                                className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-xs transition-all ${page === n ? 'bg-primary text-on-primary' : 'hover:bg-surface-container'}`}
                                            >{n}</button>
                                        </React.Fragment>
                                    ))}
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 flex gap-10 items-start">
                        <div className="flex-1 bg-primary text-on-primary p-12 rounded-lg relative overflow-hidden group">
                            <div className="relative z-10">
                                <h3 className="text-3xl font-extrabold mb-4">Stock Optimization AI</h3>
                                <p className="max-w-md text-primary-container leading-relaxed mb-8">Based on historical trends from flu season, we recommend increasing <b>Paracetamol</b> and <b>Cough Suppressant</b> stock by 25% before November.</p>
                                <button className="bg-surface-container-lowest text-primary px-6 py-3 rounded-full font-bold shadow-lg">View Recommendations</button>
                            </div>

                            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
                        </div>
                        <div className="w-80 bg-surface-container-high p-8 rounded-lg">
                            <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-6">Recent Activity</h4>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-1.5 h-1.5 mt-2 rounded-full bg-primary ring-4 ring-primary/10"></div>
                                    <div>
                                        <p className="text-sm font-bold text-on-surface">Stock Added</p>
                                        <p className="text-[11px] text-on-surface-variant">50x Insulin Pens by Nurse Sarah</p>
                                        <p className="text-[10px] mt-1 text-primary font-medium">10 mins ago</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-1.5 h-1.5 mt-2 rounded-full bg-error ring-4 ring-error/10"></div>
                                    <div>
                                        <p className="text-sm font-bold text-on-surface">Quantity Alert</p>
                                        <p className="text-[11px] text-on-surface-variant">Bandages below 10 units</p>
                                        <p className="text-[10px] mt-1 text-error font-medium">2 hours ago</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            {/* Modals */}
            <AddEditMedicineModal open={addOpen} onClose={() => setAddOpen(false)} onSubmit={handleAdd} />
            <AddEditMedicineModal open={editOpen} onClose={() => setEditOpen(false)} medicine={selected} onSubmit={handleEdit} />
            <ConfirmDeleteModal
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDelete}
                itemName={selected?.name}
                itemType="medicine"
            />
        </>
    );
};

export default Medicines;
