import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../navbar/Sidebar';
import Header from '../navbar/Header';
import { AddEditStudentModal, ViewStudentModal, ConfirmDeleteModal } from '../modals/SharedModals';
import { config, endpoints } from '../config/config';

const AVATAR_COLORS = [
    { bg: 'bg-tertiary-container', fg: 'text-on-tertiary-container' },
    { bg: 'bg-secondary-fixed', fg: 'text-on-secondary-fixed' },
    { bg: 'bg-primary-container', fg: 'text-on-primary-container' },
    { bg: 'bg-outline-variant/20', fg: 'text-on-surface' },
];

const YEAR_BADGE = {
    1: 'bg-surface-container-highest text-on-surface-variant',
    2: 'bg-primary-container/20 text-on-primary-container',
    3: 'bg-secondary-container/20 text-on-secondary-container',
    4: 'bg-tertiary-container/20 text-on-tertiary-container',
};

const YEAR_LABEL = { 1: '1st Year', 2: '2nd Year', 3: '3rd Year', 4: '4th Year' };

const Students = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [search, setSearch] = useState('');
    const [filterCourse, setFilterCourse] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const [page, setPage] = useState(1);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${config.uniClinicAPI}${endpoints.students}`);
            setStudents(res.data);
        } catch {
            setError('Failed to load students.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStudents(); }, []);
    useEffect(() => { setPage(1); }, [search, filterCourse, filterYear]);

    const handleAdd = async (form) => {
        try {
            await axios.post(`${config.uniClinicAPI}${endpoints.students}`, form);
            fetchStudents();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add student.');
        }
    };

    const handleEdit = async (form) => {
        try {
            await axios.put(`${config.uniClinicAPI}${endpoints.students}/${selectedStudent.student_id}`, form);
            fetchStudents();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update student.');
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${config.uniClinicAPI}${endpoints.students}/${selectedStudent.student_id}`);
            setDeleteOpen(false);
            fetchStudents();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete student.');
        }
    };

    const openEdit = (s) => { setSelectedStudent(s); setEditOpen(true); };
    const openView = (s) => { setSelectedStudent(s); setViewOpen(true); };
    const openDelete = (s) => { setSelectedStudent(s); setDeleteOpen(true); };

    const courses = [...new Set(students.map(s => s.course).filter(Boolean))].sort();

    const filtered = students.filter(s => {
        const q = search.toLowerCase();
        const matchSearch = !q ||
            `${s.first_name} ${s.last_name}`.toLowerCase().includes(q) ||
            (s.student_number || '').toLowerCase().includes(q);
        const matchCourse = !filterCourse || s.course === filterCourse;
        const matchYear = !filterYear || String(s.year_level) === filterYear;
        return matchSearch && matchCourse && matchYear;
    });

    const PAGE_SIZE = 10;
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <>
            <Sidebar />
            <main className="flex-1 ml-72 min-h-screen overflow-y-auto pt-0 pb-20">
                <Header title="Student Records" hasSearch={true} searchPlaceholder="Search Student Records" />
                <div className="px-8">
                    <section className="px-0 pt-10">

                        <div className="mb-16 flex justify-between items-end">
                            <div className="max-w-2xl">
                                <h1 className="font-headline text-5xl font-extrabold tracking-tight text-on-surface mb-4">Student Records</h1>
                                <p className="text-lg text-on-surface-variant font-light">Manage and monitor health profiles for the academic community with clinical precision and empathetic care.</p>
                            </div>
                            <button
                                onClick={() => setAddOpen(true)}
                                className="bg-primary hover:bg-primary-dim text-on-primary px-8 py-4 rounded-full flex items-center gap-3 transition-all editorial-shadow transform active:scale-95"
                            >
                                <span className="material-symbols-outlined" data-icon="add">add</span>
                                <span className="font-semibold">New Student Record</span>
                            </button>
                        </div>

                        {/* Filter bar */}
                        <div className="bg-surface-container-low rounded-xl p-6 mb-12 flex flex-wrap lg:flex-nowrap items-center gap-6">
                            <div className="relative flex-1 group">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant">search</span>
                                <input
                                    className="w-full bg-surface-container-lowest border-none rounded-full py-4 pl-12 pr-6 text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-primary-fixed-dim transition-all editorial-shadow"
                                    placeholder="Search by name or student number..."
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-outline-variant ml-4">Filter by Course</span>
                                    <select
                                        className="bg-surface-container-lowest border-none rounded-full py-3 px-6 text-sm font-medium focus:ring-2 focus:ring-primary-fixed-dim editorial-shadow min-w-[200px]"
                                        value={filterCourse}
                                        onChange={e => setFilterCourse(e.target.value)}
                                    >
                                        <option value="">All Courses</option>
                                        {courses.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-outline-variant ml-4">Year Level</span>
                                    <select
                                        className="bg-surface-container-lowest border-none rounded-full py-3 px-6 text-sm font-medium focus:ring-2 focus:ring-primary-fixed-dim editorial-shadow min-w-[150px]"
                                        value={filterYear}
                                        onChange={e => setFilterYear(e.target.value)}
                                    >
                                        <option value="">All Years</option>
                                        <option value="1">1st Year</option>
                                        <option value="2">2nd Year</option>
                                        <option value="3">3rd Year</option>
                                        <option value="4">4th Year</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="bg-surface-container-lowest rounded-xl editorial-shadow overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-surface-container-high text-on-surface-variant">
                                            <th className="px-8 py-6 font-headline text-xs font-bold uppercase tracking-widest">Student Number</th>
                                            <th className="px-8 py-6 font-headline text-xs font-bold uppercase tracking-widest">Full Name</th>
                                            <th className="px-8 py-6 font-headline text-xs font-bold uppercase tracking-widest">Course</th>
                                            <th className="px-8 py-6 font-headline text-xs font-bold uppercase tracking-widest text-center">Year Level</th>
                                            <th className="px-8 py-6 font-headline text-xs font-bold uppercase tracking-widest text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-surface-container">
                                        {loading ? (
                                            <tr><td colSpan={5} className="px-8 py-12 text-center text-on-surface-variant">Loading students...</td></tr>
                                        ) : error ? (
                                            <tr><td colSpan={5} className="px-8 py-12 text-center text-error">{error}</td></tr>
                                        ) : filtered.length === 0 ? (
                                            <tr><td colSpan={5} className="px-8 py-12 text-center text-on-surface-variant">{students.length === 0 ? 'No students found.' : 'No students match your filters.'}</td></tr>
                                        ) : paged.map((s, i) => {
                                            const colors = AVATAR_COLORS[i % AVATAR_COLORS.length];
                                            const initials = `${s.first_name?.[0] || ''}${s.last_name?.[0] || ''}`.toUpperCase();
                                            const yearLabel = YEAR_LABEL[s.year_level] || `Year ${s.year_level}`;
                                            return (
                                            <tr key={s.student_id} className="hover:bg-surface-container-low transition-colors group">
                                                <td className="px-8 py-6 font-mono text-primary font-semibold">{s.student_number}</td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`h-10 w-10 rounded-full ${colors.bg} flex items-center justify-center ${colors.fg} font-bold`}>
                                                            {initials}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-on-surface">{s.first_name} {s.last_name}</div>
                                                            <div className="text-xs text-on-surface-variant">{s.course}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-on-surface-variant">{s.course}</td>
                                                <td className="px-8 py-6 text-center">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${YEAR_BADGE[s.year_level] || 'bg-surface-container text-on-surface-variant'}`}>{yearLabel}</span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => openView(s)} className="p-2 rounded-full text-primary hover:bg-primary/10 transition-all" title="View Details">
                                                            <span className="material-symbols-outlined">visibility</span>
                                                        </button>
                                                        <button onClick={() => openEdit(s)} className="p-2 rounded-full text-secondary hover:bg-secondary/10 transition-all" title="Edit Record">
                                                            <span className="material-symbols-outlined">edit</span>
                                                        </button>
                                                        <button onClick={() => openDelete(s)} className="p-2 rounded-full text-error hover:bg-error/10 transition-all" title="Delete Record">
                                                            <span className="material-symbols-outlined">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div className="bg-surface-container-low px-8 py-6 flex justify-between items-center">
                                <span className="text-sm text-on-surface-variant">
                                    {filtered.length === 0 ? 'No students found' :
                                        `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length} student${filtered.length !== 1 ? 's' : ''}${(search || filterCourse || filterYear) ? ' (filtered)' : ''}`}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="h-10 w-10 flex items-center justify-center rounded-full bg-surface-container-lowest text-outline hover:text-primary transition-colors editorial-shadow disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <span className="material-symbols-outlined">chevron_left</span>
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter(n => totalPages <= 5 || Math.abs(n - page) <= 1 || n === 1 || n === totalPages)
                                        .map((n, idx, arr) => (
                                            <React.Fragment key={n}>
                                                {idx > 0 && arr[idx - 1] !== n - 1 && (
                                                    <span className="h-10 w-10 flex items-center justify-center text-on-surface-variant text-xs">…</span>
                                                )}
                                                <button
                                                    onClick={() => setPage(n)}
                                                    className={`h-10 w-10 flex items-center justify-center rounded-full font-bold text-xs transition-colors editorial-shadow ${page === n ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-on-surface hover:bg-primary-container'}`}
                                                >{n}</button>
                                            </React.Fragment>
                                        ))}
                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="h-10 w-10 flex items-center justify-center rounded-full bg-surface-container-lowest text-outline hover:text-primary transition-colors editorial-shadow disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <span className="material-symbols-outlined">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Bottom cards */}
                        <div className="grid grid-cols-12 gap-8 mt-12">
                            <div className="col-span-12 md:col-span-4 bg-primary-dim text-on-primary p-10 rounded-xl editorial-shadow relative overflow-hidden group">
                                <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-9xl opacity-10 group-hover:rotate-12 transition-transform">trending_up</span>
                                <h3 className="text-sm font-bold uppercase tracking-widest opacity-80 mb-2">Total Students</h3>
                                <p className="text-5xl font-black font-manrope">{students.length.toLocaleString()}</p>
                                <div className="mt-4 flex items-center gap-2 text-xs font-bold bg-white/10 w-fit px-3 py-1 rounded-full">
                                    <span className="material-symbols-outlined text-sm">school</span>
                                    enrolled this semester
                                </div>
                            </div>
                            <div className="col-span-12 md:col-span-8 bg-surface-container-high rounded-xl p-8 flex items-center justify-between border-l-8 border-primary relative overflow-hidden">
                                <div className="z-10">
                                    <h3 className="text-xl font-bold font-manrope text-on-surface mb-2">Health Record Integrity</h3>
                                    <p className="text-on-surface-variant max-w-md">98.4% of student records are up-to-date with current vaccinations and physical examinations.</p>
                                    <div className="mt-6 flex items-center gap-4">
                                        <div className="h-2 w-64 bg-surface-container rounded-full overflow-hidden">
                                            <div className="h-full bg-primary w-[98.4%] rounded-full"></div>
                                        </div>
                                        <span className="font-bold text-primary">98.4%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* Modals */}
            <AddEditStudentModal open={addOpen} onClose={() => setAddOpen(false)} onSubmit={handleAdd} />
            <AddEditStudentModal open={editOpen} onClose={() => setEditOpen(false)} student={selectedStudent} onSubmit={handleEdit} />
            <ViewStudentModal open={viewOpen} onClose={() => setViewOpen(false)} student={selectedStudent} />
            <ConfirmDeleteModal
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDelete}
                itemName={selectedStudent ? `${selectedStudent.first_name} ${selectedStudent.last_name}` : ''}
                itemType="student record"
            />
        </>
    );
};

export default Students;
