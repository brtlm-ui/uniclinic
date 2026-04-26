import React, { useState } from 'react';
import Sidebar from '../navbar/Sidebar';
import Header from '../navbar/Header';
import { useNavigate } from 'react-router-dom';
import { AddEditVisitModal, ConfirmDeleteModal } from '../modals/SharedModals';

const VISITS = [
    { student: 'Ethan Sterling', grade: 'Grade 10-B', date: 'Oct 24, 2023', time: '10:15 AM', reason: 'Recurring Migraine', diagnosis: 'Mild Dehydration', status: 'Completed', statusBg: 'bg-tertiary-container', statusFg: 'text-on-tertiary-container', staff: 'Nurse Miller', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0YFe7iuSARwAc7YWn-aMWDCmD_ZZI91t2FtG1buYx07J1Xp2lGe2Qa_Eq3ZMSe-5kymum-Zh2RBJooaX9VCIDL68p0k8a3Ez4Lc4Bhq0O1cOMea-WC1-m6kNUabVZuStPKm0UZs85KmPgVNWP3s6Kf2GQtToD8OHaTR-HhjOLpMrmwpQA2JC9bT6BVBqPDEvfAWO0PvGWuUbLXeB0fO_rs2VQKKpmyTl1h9Ig7_9oiKJ70lQtqmPKhLHh29iY0PF9yeF5RlR1o6Y' },
    { student: 'Sienna Rossi', grade: 'Grade 08-A', date: 'Oct 24, 2023', time: '11:45 AM', reason: 'Asthma Flare-up', diagnosis: 'Exercise Induced', status: 'Emergency', statusBg: 'bg-error-container', statusFg: 'text-on-error-container', staff: 'Dr. Chen', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKaq7Q5uzkkVFTnWPs9QoJo4IU__kAyRfyvxzR-AuAiSdIicoT2H2WgucbFy6FyDPKVY6Tp7dyAeIY-kJq8LX1td43i16LqMS1SJ51rpZVc2BFiziFbfsrIjuGciVX1KCCiT0rd3jZU139GCq6UC7mJ8qcvB2BPl0CNvh-ayzds7qaJs-vakImE-gHcoYvEflqB3amYJma60UhtzJ-XxPERu42gQnyqPmqYCHdSLIjRElxrSYQKTDCWifWHo6C_gHc8W0TqDegNfs' },
    { student: 'Marcus Thorne', grade: 'Grade 12-C', date: 'Oct 24, 2023', time: '01:30 PM', reason: 'Ankle Sprain', diagnosis: 'Sports Injury (PE)', status: 'In Progress', statusBg: 'bg-primary-container', statusFg: 'text-on-primary-container', staff: 'Nurse Miller', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCw3VW01ATo_o50_oP4A3LdUbkyni0TGNa1Bfi-8dptUxFf5q_ng9o2s2xZAauZKtMKxcoezh-cNCtEXxNSDK-9nK3RZ38VK2FeoXY9Cimg57a2chcSphgEXYBbn7tBVPRfUwVDbaCbEZXcZJgyu3poAzkaYKq2_gxNLfjGJe7F7VO3PKxQSYVCq2UyKp7owrwEze3LzjvyzWcryGoOpoOPzlN2GeE1V-MkdqTPdHpW6iJdVqT7mGefEAkrnNv2VDuJDcE7V_n8WnM' },
    { student: 'Elena Vance', grade: 'Grade 09-B', date: 'Oct 23, 2023', time: '02:15 PM', reason: 'Allergic Reaction', diagnosis: 'Nut Sensitivity', status: 'Referred', statusBg: 'bg-secondary-container', statusFg: 'text-on-secondary-container', staff: 'Dr. Chen', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1tjVO1PTQB6p8I3PpE9UJ377Tme0Ahf8iMutO7Sd0Uw5nOcdTDIYH-MXA7x0VU-4m3eQ8gtHAATxu5iQbCswC2e6lhP-I46ZrjoQA7sarrJPU5FSj0yiVRoNU4teIeRzMHitunJ0yVzAc_gewVcHU5t5ALy-uI5Ht369xDoCDKLXHWhEHjtj8tV0LJob8hL3aZi-BA9xIsxqbHQELTaf8UstAz94AVbnT-9LsQHJuD0I5c0i34riNW0B6l7FO9b6pmnTosedjhiA' },
];

const Visits = () => {
    const navigate = useNavigate();
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    const openEdit = (v) => { setSelected(v); setEditOpen(true); };
    const openDelete = (v) => { setSelected(v); setDeleteOpen(true); };
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
                        <button className="bg-surface-container-lowest text-primary px-8 py-4 rounded-full font-bold flex items-center gap-2 shadow-sm border border-outline-variant/10 hover:bg-white transition-all">
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

                <section className="bg-surface-container-low rounded-xl p-6 mb-12 flex flex-wrap items-center gap-6">
                    <div className="flex-1 min-w-[240px] relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                        <input className="w-full bg-surface-container-lowest border-none rounded-full py-4 pl-12 pr-6 focus:ring-2 focus:ring-primary/20 transition-all text-sm" placeholder="Search by student name or reason..." type="text" />
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Date</span>
                        <input className="bg-surface-container-lowest border-none rounded-full py-4 px-6 text-sm focus:ring-2 focus:ring-primary/20" type="date" />
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</span>
                        <select className="bg-surface-container-lowest border-none rounded-full py-4 pl-6 pr-10 text-sm focus:ring-2 focus:ring-primary/20 appearance-none min-w-[160px]">
                            <option>All Visits</option>
                            <option>Completed</option>
                            <option>In Progress</option>
                            <option>Referred</option>
                            <option>Emergency</option>
                        </select>
                    </div>
                    <button className="w-12 h-12 bg-surface-container-highest rounded-full flex items-center justify-center text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container transition-colors">
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
                                <th className="px-8 py-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Status</th>
                                <th className="px-8 py-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Attending Staff</th>
                                <th className="px-8 py-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container">

                            <tr className="hover:bg-surface-container-low transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <img className="w-12 h-12 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all" src={VISITS[0].img} />
                                        <div>
                                            <p className="font-bold text-on-surface">{VISITS[0].student}</p>
                                            <p className="text-xs text-on-surface-variant">{VISITS[0].grade}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-sm font-semibold text-on-surface">{VISITS[0].date}</p>
                                    <p className="text-xs text-on-surface-variant">{VISITS[0].time}</p>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-sm font-semibold text-on-surface max-w-xs truncate">{VISITS[0].reason}</p>
                                    <p className="text-xs text-on-surface-variant italic">{VISITS[0].diagnosis}</p>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${VISITS[0].statusBg} ${VISITS[0].statusFg}`}>{VISITS[0].status}</span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-primary-fixed-dim flex items-center justify-center text-[10px] font-bold text-on-primary-fixed">NM</div>
                                        <span className="text-sm font-medium text-on-surface">{VISITS[0].staff}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEdit(VISITS[0])} className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-primary transition-all" title="Edit">
                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                        </button>
                                        <button onClick={() => openDelete(VISITS[0])} className="p-2 rounded-full hover:bg-error-container/20 text-on-surface-variant hover:text-error transition-all" title="Delete">
                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>

                            <tr className="hover:bg-surface-container-low transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <img className="w-12 h-12 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all" src={VISITS[1].img} />
                                        <div>
                                            <p className="font-bold text-on-surface">{VISITS[1].student}</p>
                                            <p className="text-xs text-on-surface-variant">{VISITS[1].grade}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-sm font-semibold text-on-surface">{VISITS[1].date}</p>
                                    <p className="text-xs text-on-surface-variant">{VISITS[1].time}</p>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-sm font-semibold text-on-surface max-w-xs truncate">{VISITS[1].reason}</p>
                                    <p className="text-xs text-on-surface-variant italic">{VISITS[1].diagnosis}</p>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${VISITS[1].statusBg} ${VISITS[1].statusFg}`}>{VISITS[1].status}</span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-secondary-fixed-dim flex items-center justify-center text-[10px] font-bold text-on-secondary-fixed">Dr</div>
                                        <span className="text-sm font-medium text-on-surface">{VISITS[1].staff}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEdit(VISITS[1])} className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-primary transition-all">
                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                        </button>
                                        <button onClick={() => openDelete(VISITS[1])} className="p-2 rounded-full hover:bg-error-container/20 text-on-surface-variant hover:text-error transition-all">
                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>

                            <tr className="hover:bg-surface-container-low transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <img className="w-12 h-12 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all" src={VISITS[2].img} />
                                        <div>
                                            <p className="font-bold text-on-surface">{VISITS[2].student}</p>
                                            <p className="text-xs text-on-surface-variant">{VISITS[2].grade}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-sm font-semibold text-on-surface">{VISITS[2].date}</p>
                                    <p className="text-xs text-on-surface-variant">{VISITS[2].time}</p>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-sm font-semibold text-on-surface max-w-xs truncate">{VISITS[2].reason}</p>
                                    <p className="text-xs text-on-surface-variant italic">{VISITS[2].diagnosis}</p>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${VISITS[2].statusBg} ${VISITS[2].statusFg}`}>{VISITS[2].status}</span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-primary-fixed-dim flex items-center justify-center text-[10px] font-bold text-on-primary-fixed">NM</div>
                                        <span className="text-sm font-medium text-on-surface">{VISITS[2].staff}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEdit(VISITS[2])} className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-primary transition-all">
                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                        </button>
                                        <button onClick={() => openDelete(VISITS[2])} className="p-2 rounded-full hover:bg-error-container/20 text-on-surface-variant hover:text-error transition-all">
                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>

                            <tr className="hover:bg-surface-container-low transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <img className="w-12 h-12 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all" src={VISITS[3].img} />
                                        <div>
                                            <p className="font-bold text-on-surface">{VISITS[3].student}</p>
                                            <p className="text-xs text-on-surface-variant">{VISITS[3].grade}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-sm font-semibold text-on-surface">{VISITS[3].date}</p>
                                    <p className="text-xs text-on-surface-variant">{VISITS[3].time}</p>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-sm font-semibold text-on-surface max-w-xs truncate">{VISITS[3].reason}</p>
                                    <p className="text-xs text-on-surface-variant italic">{VISITS[3].diagnosis}</p>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${VISITS[3].statusBg} ${VISITS[3].statusFg}`}>{VISITS[3].status}</span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-secondary-fixed-dim flex items-center justify-center text-[10px] font-bold text-on-secondary-fixed">Dr</div>
                                        <span className="text-sm font-medium text-on-surface">{VISITS[3].staff}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEdit(VISITS[3])} className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-primary transition-all">
                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                        </button>
                                        <button onClick={() => openDelete(VISITS[3])} className="p-2 rounded-full hover:bg-error-container/20 text-on-surface-variant hover:text-error transition-all">
                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="px-8 py-6 bg-surface-container-low flex justify-between items-center">
                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Showing 4 of 124 visits</p>
                        <div className="flex items-center gap-2">
                            <button className="w-10 h-10 rounded-full bg-surface-container-lowest border border-outline-variant/10 flex items-center justify-center text-on-surface-variant hover:text-primary transition-all">
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            <div className="flex items-center gap-1">
                                <button className="w-10 h-10 rounded-full bg-primary text-on-primary font-bold text-xs">1</button>
                                <button className="w-10 h-10 rounded-full bg-transparent text-on-surface-variant font-bold text-xs hover:bg-white transition-all">2</button>
                                <button className="w-10 h-10 rounded-full bg-transparent text-on-surface-variant font-bold text-xs hover:bg-white transition-all">3</button>
                            </div>
                            <button className="w-10 h-10 rounded-full bg-surface-container-lowest border border-outline-variant/10 flex items-center justify-center text-on-surface-variant hover:text-primary transition-all">
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>

                <section className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-surface-container-low rounded-xl p-8 border border-outline-variant/5">
                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Today's Total</p>
                        <h3 className="text-4xl font-black font-manrope text-on-surface">24</h3>
                        <div className="mt-4 flex items-center gap-2 text-primary font-bold text-xs">
                            <span className="material-symbols-outlined text-sm">trending_up</span>
                            +12% vs yesterday
                        </div>
                    </div>
                    <div className="bg-surface-container-low rounded-xl p-8 border border-outline-variant/5">
                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Awaiting Treatment</p>
                        <h3 className="text-4xl font-black font-manrope text-primary">03</h3>
                        <div className="mt-4 flex items-center gap-2 text-on-surface-variant font-bold text-xs">
                            Average wait: 8m
                        </div>
                    </div>
                    <div className="bg-surface-container-low rounded-xl p-8 border border-outline-variant/5 col-span-2 relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Most Common Reason</p>
                            <h3 className="text-3xl font-black font-manrope text-on-surface">Seasonal Flu Symptoms</h3>
                            <p className="mt-2 text-sm text-on-surface-variant">Recommended: Increase hygiene awareness in East Wing</p>
                        </div>
                        <div className="absolute -right-12 -bottom-12 opacity-10">
                            <span className="material-symbols-outlined text-[160px]">health_and_safety</span>
                        </div>
                    </div>
                </section>
                </div>
            </main>

            {/* Modals */}
            <AddEditVisitModal open={addOpen} onClose={() => setAddOpen(false)} />
            <AddEditVisitModal open={editOpen} onClose={() => setEditOpen(false)} visit={selected} />
            <ConfirmDeleteModal
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={() => { alert(`Deleted visit for: ${selected?.student}`); setDeleteOpen(false); }}
                itemName={selected ? `${selected.student}'s visit on ${selected.date}` : ''}
                itemType="visit record"
            />
        </>
    );
};

export default Visits;
