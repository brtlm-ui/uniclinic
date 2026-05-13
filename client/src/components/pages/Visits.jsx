import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Sidebar from '../navbar/Sidebar';
import Header from '../navbar/Header';
import { useNavigate } from 'react-router-dom';
import { AddEditVisitModal, ConfirmDeleteModal } from '../modals/SharedModals';
import { config, endpoints } from '../config/config';

const getVisitStatusStyle = (status) => {
    if (status === 'completed') return { bg: 'bg-tertiary-container', fg: 'text-on-tertiary-container', label: 'Completed' };
    if (status === 'ongoing') return { bg: 'bg-primary-container', fg: 'text-on-primary-container', label: 'Ongoing' };
    return { bg: 'bg-surface-container', fg: 'text-on-surface-variant', label: status };
};

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
const formatTime = (t) => {
    if (!t) return '—';
    const [h, m] = t.split(':');
    const hr = parseInt(h);
    return `${hr > 12 ? hr - 12 : hr || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
};

const getInitials = (name = '') => name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

const Visits = () => {
    const navigate = useNavigate();
    const [visits, setVisits] = useState([]);
    const [students, setStudents] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [search, setSearch] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [page, setPage] = useState(1);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [vRes, sRes, stRes] = await Promise.all([
                axios.get(`${config.uniClinicAPI}${endpoints.statistics.visits}`),
                axios.get(`${config.uniClinicAPI}${endpoints.students}`),
                axios.get(`${config.uniClinicAPI}${endpoints.staff}`),
            ]);
            setVisits(vRes.data);
            setStudents(sRes.data);
            setStaffList(stRes.data);
        } catch {
            setError('Failed to load visits.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAll(); }, []);
    useEffect(() => { setPage(1); }, [search, filterDate, filterStatus]);

    const handleAdd = async (form) => {
        try {
            await axios.post(`${config.uniClinicAPI}${endpoints.visits}`, form);
            fetchAll();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add visit.');
        }
    };

    const handleEdit = async (form) => {
        try {
            await axios.put(`${config.uniClinicAPI}${endpoints.visits}/${selected.visit_id}`, form);
            fetchAll();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update visit.');
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${config.uniClinicAPI}${endpoints.visits}/${selected.visit_id}`);
            setDeleteOpen(false);
            fetchAll();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete visit.');
        }
    };

    const openEdit = (v) => { setSelected(v); setEditOpen(true); };
    const openDelete = (v) => { setSelected(v); setDeleteOpen(true); };

    const exportToPDF = () => {
        const doc = new jsPDF('landscape');
        
        // Title
        doc.setFontSize(20);
        doc.text('Clinical Serenity - Clinic Visits Report', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
        
        // Date
        doc.setFontSize(10);
        doc.text(`Generated: ${new Date().toLocaleString()}`, doc.internal.pageSize.getWidth() / 2, 22, { align: 'center' });
        
        // Prepare table data
        const tableData = filtered.map(v => {
            const prescriptions = (() => {
                try {
                    if (v.prescriptions) {
                        const parsed = typeof v.prescriptions === 'string' ? JSON.parse(v.prescriptions) : v.prescriptions;
                        if (Array.isArray(parsed)) {
                            return parsed.map(p => `${p.medicine_name} (${p.quantity}x)`).join(', ') || 'None';
                        }
                    }
                } catch (e) {}
                return 'None';
            })();
            
            return [
                v.student_name || 'N/A',
                v.student_number || 'N/A',
                formatDate(v.visit_date),
                formatTime(v.visit_time),
                v.reason || '—',
                prescriptions,
                v.status,
                v.staff_name || 'N/A'
            ];
        });
        
        // Create table
        doc.autoTable({
            head: [['Student Name', 'ID', 'Date', 'Time', 'Reason', 'Medicines', 'Status', 'Staff']],
            body: tableData,
            startY: 28,
            theme: 'grid',
            headStyles: { fillColor: [63, 81, 181], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 10 },
            bodyStyles: { fontSize: 9 },
            alternateRowStyles: { fillColor: [245, 245, 245] },
            margin: { top: 28, right: 10, bottom: 10, left: 10 },
            didDrawPage: () => {
                // Footer
                const pageSize = doc.internal.pageSize;
                const pageHeight = pageSize.getHeight();
                const pageWidth = pageSize.getWidth();
                doc.setFontSize(8);
                doc.text(
                    `Page ${doc.internal.pages.length - 1}`,
                    pageWidth / 2,
                    pageHeight - 10,
                    { align: 'center' }
                );
            }
        });
        
        // Save PDF
        doc.save(`clinic-visits-${new Date().toISOString().split('T')[0]}.pdf`);
    };

    // Derived — filter
    const filtered = visits.filter(v => {
        const q = search.toLowerCase();
        const matchSearch = !q ||
            (v.student_name || '').toLowerCase().includes(q) ||
            (v.reason || '').toLowerCase().includes(q);
        const matchDate = !filterDate || (v.visit_date?.slice(0, 10) === filterDate);
        const matchStatus = !filterStatus || v.status === filterStatus;
        return matchSearch && matchDate && matchStatus;
    });

    // Stats computed from real data
    const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format
    const todayCount = visits.filter(v => {
        if (!v.visit_date) return false;
        const vDate = new Date(v.visit_date).toLocaleDateString('en-CA');
        return vDate === todayStr;
    }).length;
    const ongoingCount = visits.filter(v => v.status === 'ongoing').length;
    const reasonCounts = {};
    visits.forEach(v => { if (v.reason) { const r = v.reason.trim(); reasonCounts[r] = (reasonCounts[r] || 0) + 1; } });
    const topReason = Object.entries(reasonCounts).sort((a, b) => b[1] - a[1])[0];
    const mostCommonReason = topReason ? topReason[0] : 'No data yet';
    const mostCommonCount = topReason ? topReason[1] : 0;

    const PAGE_SIZE = 10;
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <>
            <Sidebar />
            <main className="flex-1 ml-72 min-h-screen overflow-y-auto pt-0 pb-12">
                <Header hasSearch={true} searchPlaceholder="Search Clinic Visits"/>
                <div className="px-8">
                
                <section className="pt-10 mb-16 flex justify-between items-end">
                    <div className="max-w-2xl">
                        <span className="text-primary font-bold tracking-widest text-xs uppercase mb-3 block">Wellness Registry</span>
                        <h2 className="text-6xl font-black font-manrope text-on-surface tracking-tight leading-none mb-6">Clinic Visits</h2>
                        <p className="text-on-surface-variant text-lg leading-relaxed">Monitoring the pulse of our student community. Manage daily encounters with Clinical Serenity's intuitive intake system.</p>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={exportToPDF} className="bg-surface-container-lowest text-primary px-8 py-4 rounded-full font-bold flex items-center gap-2 shadow-sm border border-outline-variant/10 hover:bg-white transition-all">
                            <span className="material-symbols-outlined">filter_list</span>
                            Export Data
                        </button>
                        <button
                            onClick={() => setAddOpen(true)}
                            className="bg-primary text-on-primary px-10 py-4 rounded-full font-bold flex items-center gap-2 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                        >
                            <span className="material-symbols-outlined">add</span>
                            New Visit
                        </button>
                    </div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-surface-container-low rounded-xl p-8 border border-outline-variant/5">
                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Today's Total</p>
                        <h3 className="text-4xl font-black font-manrope text-on-surface">{todayCount}</h3>
                        <div className="mt-4 flex items-center gap-2 text-on-surface-variant font-bold text-xs">
                            Visit{todayCount !== 1 ? 's' : ''} recorded today
                        </div>
                    </div>
                    <div className="bg-surface-container-low rounded-xl p-8 border border-outline-variant/5">
                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Ongoing Visits</p>
                        <h3 className="text-4xl font-black font-manrope text-primary">{String(ongoingCount).padStart(2, '0')}</h3>
                        <div className="mt-4 flex items-center gap-2 text-on-surface-variant font-bold text-xs">
                            Currently in progress
                        </div>
                    </div>
                    <div className="bg-surface-container-low rounded-xl p-8 border border-outline-variant/5 col-span-2 relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Most Common Reason</p>
                            <h3 className="text-3xl font-black font-manrope text-on-surface">{mostCommonReason}</h3>
                            <p className="mt-2 text-sm text-on-surface-variant">{mostCommonCount > 0 ? `Reported ${mostCommonCount} time${mostCommonCount !== 1 ? 's' : ''} across all visits` : 'No visit data yet'}</p>
                        </div>
                        <div className="absolute -right-12 -bottom-12 opacity-10">
                            <span className="material-symbols-outlined text-[160px]">health_and_safety</span>
                        </div>
                    </div>
                </section>

                <section className="bg-surface-container-low rounded-xl p-6 mb-12 flex flex-wrap items-center gap-6">
                    <div className="flex-1 min-w-[240px] relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                        <input className="w-full bg-surface-container-lowest border-none rounded-full py-4 pl-12 pr-6 focus:ring-2 focus:ring-primary/20 transition-all text-sm" placeholder="Search by student name or reason..." type="text" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Date</span>
                        <input className="bg-surface-container-lowest border-none rounded-full py-4 px-6 text-sm focus:ring-2 focus:ring-primary/20" type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</span>
                        <select className="bg-surface-container-lowest border-none rounded-full py-4 pl-6 pr-10 text-sm focus:ring-2 focus:ring-primary/20 appearance-none min-w-[160px]" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                            <option value="">All Visits</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <button onClick={() => { setSearch(''); setFilterDate(''); setFilterStatus(''); }} className="w-12 h-12 bg-surface-container-highest rounded-full flex items-center justify-center text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container transition-colors">
                        <span className="material-symbols-outlined">refresh</span>
                    </button>
                </section>

                <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant/10">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-container-high/30">
                                <th className="px-8 py-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Student Details</th>
                                <th className="px-8 py-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Visit Timing</th>
                                <th className="px-8 py-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Reason &amp; Diagnosis</th>
                                <th className="px-8 py-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Prescriptions</th>
                                <th className="px-8 py-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Status</th>
                                <th className="px-8 py-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Attending Staff</th>
                                <th className="px-8 py-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container">

                            {loading ? (
                                <tr><td colSpan={7} className="px-8 py-12 text-center text-on-surface-variant">Loading visits...</td></tr>
                            ) : error ? (
                                <tr><td colSpan={7} className="px-8 py-12 text-center text-error">{error}</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={7} className="px-8 py-12 text-center text-on-surface-variant">No visits match your filters.</td></tr>
                            ) : paged.map((v) => {
                                const st = getVisitStatusStyle(v.status);
                                let prescriptions = [];
                                try {
                                    if (v.prescriptions) {
                                        const parsed = typeof v.prescriptions === 'string' ? JSON.parse(v.prescriptions) : v.prescriptions;
                                        prescriptions = Array.isArray(parsed) ? parsed.filter(p => p !== null && p.prescription_id) : [];
                                    }
                                } catch (e) {
                                    prescriptions = [];
                                }
                                const hasPrescriptions = prescriptions.length > 0;
                                return (
                                <tr key={v.visit_id} className="hover:bg-surface-container-low transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-sm">
                                                {getInitials(v.student_name)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-on-surface">{v.student_name}</p>
                                                <p className="text-xs text-on-surface-variant">ID: {v.student_number}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-semibold text-on-surface">{formatDate(v.visit_date)}</p>
                                        <p className="text-xs text-on-surface-variant">{formatTime(v.visit_time)}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-semibold text-on-surface max-w-xs truncate">{v.reason}</p>
                                        <p className="text-xs text-on-surface-variant italic">{v.diagnosis}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        {hasPrescriptions ? (
                                            <div className="space-y-2">
                                                {prescriptions.map((p, idx) => (
                                                    <div key={idx} className="bg-primary-container/30 rounded-lg px-3 py-2 border-l-2 border-primary">
                                                        <p className="text-sm font-semibold text-on-surface">{p.medicine_name}</p>
                                                        <p className="text-xs text-on-surface-variant">{p.quantity} unit{p.quantity !== 1 ? 's' : ''}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-on-surface-variant italic">None</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${st.bg} ${st.fg}`}>{st.label}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-primary-fixed-dim flex items-center justify-center text-[10px] font-bold text-on-primary-fixed">{getInitials(v.staff_name)}</div>
                                            <span className="text-sm font-medium text-on-surface">{v.staff_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEdit(v)} className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-primary transition-all" title="Edit">
                                                <span className="material-symbols-outlined text-[20px]">edit</span>
                                            </button>
                                            <button onClick={() => openDelete(v)} className="p-2 rounded-full hover:bg-error-container/20 text-on-surface-variant hover:text-error transition-all" title="Delete">
                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <div className="px-8 py-6 bg-surface-container-low flex justify-between items-center">
                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                            {filtered.length === 0 ? 'No visits found' :
                                `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length} visit${filtered.length !== 1 ? 's' : ''}${(search || filterDate || filterStatus) ? ' (filtered)' : ''}`}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="w-10 h-10 rounded-full bg-surface-container-lowest border border-outline-variant/10 flex items-center justify-center text-on-surface-variant hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(n => totalPages <= 5 || Math.abs(n - page) <= 1 || n === 1 || n === totalPages)
                                    .map((n, idx, arr) => (
                                        <React.Fragment key={n}>
                                            {idx > 0 && arr[idx - 1] !== n - 1 && (
                                                <span className="w-10 h-10 flex items-center justify-center text-on-surface-variant text-xs">…</span>
                                            )}
                                            <button
                                                onClick={() => setPage(n)}
                                                className={`w-10 h-10 rounded-full font-bold text-xs transition-all ${page === n ? 'bg-primary text-on-primary' : 'bg-transparent text-on-surface-variant hover:bg-white'}`}
                                            >{n}</button>
                                        </React.Fragment>
                                    ))}
                            </div>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="w-10 h-10 rounded-full bg-surface-container-lowest border border-outline-variant/10 flex items-center justify-center text-on-surface-variant hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>
                </div>
            </main>

            {/* Modals */}
            <AddEditVisitModal open={addOpen} onClose={() => setAddOpen(false)} onSubmit={handleAdd} students={students} staff={staffList} />
            <AddEditVisitModal open={editOpen} onClose={() => setEditOpen(false)} visit={selected} onSubmit={handleEdit} students={students} staff={staffList} />
            <ConfirmDeleteModal
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDelete}
                itemName={selected ? `${selected.student_name}'s visit on ${formatDate(selected.visit_date)}` : ''}
                itemType="visit record"
            />
        </>
    );
};

export default Visits;
