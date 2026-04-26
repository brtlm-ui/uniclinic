import React, { useState } from 'react';
import Sidebar from '../navbar/sidebar';
import Header from '../navbar/Header';
import { AddEditStudentModal, ViewStudentModal, ConfirmDeleteModal } from '../modals/SharedModals';

const STUDENTS = [
    { id: '2023-10042', name: 'Elena Marasigan', email: 'elena.m@university.edu', course: 'B.S. Nursing', year: '2nd Year', bg: 'bg-tertiary-container', fg: 'text-on-tertiary-container' },
    { id: '2021-08521', name: 'Julian Teodoro', email: 'j.teodoro@university.edu', course: 'B.S. Computer Science', year: '4th Year', bg: 'bg-secondary-fixed', fg: 'text-on-secondary-fixed' },
    { id: '2022-12903', name: 'Amara Rodriguez', email: 'amara.rod@university.edu', course: 'B.S. Architecture', year: '3rd Year', bg: 'bg-primary-container', fg: 'text-on-primary-container' },
    { id: '2024-00122', name: 'Caleb Kim', email: 'c.kim@university.edu', course: 'B.A. Communication', year: '1st Year', bg: 'bg-outline-variant/20', fg: 'text-on-surface' },
];

const yearBadge = {
    '1st Year': 'bg-surface-container-highest text-on-surface-variant',
    '2nd Year': 'bg-primary-container/20 text-on-primary-container',
    '3rd Year': 'bg-secondary-container/20 text-on-secondary-container',
    '4th Year': 'bg-tertiary-container/20 text-on-tertiary-container',
};

const Students = () => {
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const openEdit = (s) => { setSelectedStudent(s); setEditOpen(true); };
    const openView = (s) => { setSelectedStudent(s); setViewOpen(true); };
    const openDelete = (s) => { setSelectedStudent(s); setDeleteOpen(true); };

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
                                <input className="w-full bg-surface-container-lowest border-none rounded-full py-4 pl-12 pr-6 text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-primary-fixed-dim transition-all editorial-shadow" placeholder="Search by name or student number..." type="text" />
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-outline-variant ml-4">Filter by Course</span>
                                    <select className="bg-surface-container-lowest border-none rounded-full py-3 px-6 text-sm font-medium focus:ring-2 focus:ring-primary-fixed-dim editorial-shadow min-w-[200px]">
                                        <option>All Courses</option>
                                        <option>Computer Science</option>
                                        <option>Nursing</option>
                                        <option>Business Administration</option>
                                        <option>Architecture</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-outline-variant ml-4">Year Level</span>
                                    <select className="bg-surface-container-lowest border-none rounded-full py-3 px-6 text-sm font-medium focus:ring-2 focus:ring-primary-fixed-dim editorial-shadow min-w-[150px]">
                                        <option>All Years</option>
                                        <option>1st Year</option>
                                        <option>2nd Year</option>
                                        <option>3rd Year</option>
                                        <option>4th Year</option>
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
                                        {STUDENTS.map(s => (
                                            <tr key={s.id} className="hover:bg-surface-container-low transition-colors group">
                                                <td className="px-8 py-6 font-mono text-primary font-semibold">{s.id}</td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`h-10 w-10 rounded-full ${s.bg} flex items-center justify-center ${s.fg} font-bold`}>
                                                            {s.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-on-surface">{s.name}</div>
                                                            <div className="text-xs text-on-surface-variant">{s.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-on-surface-variant">{s.course}</td>
                                                <td className="px-8 py-6 text-center">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${yearBadge[s.year] || 'bg-surface-container text-on-surface-variant'}`}>{s.year}</span>
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
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="bg-surface-container-low px-8 py-6 flex justify-between items-center">
                                <span className="text-sm text-on-surface-variant">Showing 1 to 4 of 1,280 students</span>
                                <div className="flex gap-2">
                                    <button className="h-10 w-10 flex items-center justify-center rounded-full bg-surface-container-lowest text-outline hover:text-primary transition-colors editorial-shadow">
                                        <span className="material-symbols-outlined">chevron_left</span>
                                    </button>
                                    <button className="h-10 w-10 flex items-center justify-center rounded-full bg-primary text-on-primary editorial-shadow font-bold">1</button>
                                    <button className="h-10 w-10 flex items-center justify-center rounded-full bg-surface-container-lowest text-on-surface hover:bg-primary-container transition-colors editorial-shadow font-medium">2</button>
                                    <button className="h-10 w-10 flex items-center justify-center rounded-full bg-surface-container-lowest text-on-surface hover:bg-primary-container transition-colors editorial-shadow font-medium">3</button>
                                    <button className="h-10 w-10 flex items-center justify-center rounded-full bg-surface-container-lowest text-outline hover:text-primary transition-colors editorial-shadow">
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
                                <p className="text-5xl font-black font-manrope">1,280</p>
                                <div className="mt-4 flex items-center gap-2 text-xs font-bold bg-white/10 w-fit px-3 py-1 rounded-full">
                                    <span className="material-symbols-outlined text-sm">arrow_upward</span>
                                    12% from last semester
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
            <AddEditStudentModal open={addOpen} onClose={() => setAddOpen(false)} />
            <AddEditStudentModal open={editOpen} onClose={() => setEditOpen(false)} student={selectedStudent} />
            <ViewStudentModal open={viewOpen} onClose={() => setViewOpen(false)} student={selectedStudent} />
            <ConfirmDeleteModal
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={() => { alert(`Deleted: ${selectedStudent?.name}`); setDeleteOpen(false); }}
                itemName={selectedStudent?.name}
                itemType="student record"
            />
        </>
    );
};

export default Students;
