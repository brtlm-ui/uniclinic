import React, { useState } from 'react';
import Sidebar from '../navbar/Sidebar';
import Header from '../navbar/Header';
import { AddEditStaffModal, ConfirmDeleteModal } from '../modals/SharedModals';

const STAFF = [
    { name: 'Dr. Julian Vane', role: 'Doctor', username: 'j.vane_clin', lastActive: '2 mins ago', title: 'Senior Practitioner', roleBg: 'bg-sky-100 text-sky-800 border-sky-200', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaIIyLz1eVUa_XRAAIbSP3eB_4LbAx0gcV-DskRnS0QkJA6846JLaY-BLlFifTWf67OQPNSgz5KPvU5mwM6vYW--p8YiH0cis7OdQp8omNm5gWA7LoYPOgdByyWwiG_ofU1pqTutLMIViMJoqsC7q128YZpliVx_7hDmPbB0K6eDIKqePM9gpZ_9devLiBFaozPSqzfr79-9m6ScZmwDXiHZ77Jb8s9-kNZ2xFn5RzQvfbVJDnZWoRpr9z0xZV4S-OFZ5O0yPQl2U' },
    { name: 'Clara Henderson', role: 'Nurse', username: 'clara.h_care', lastActive: '1 hour ago', title: 'Registered Nurse', roleBg: 'bg-tertiary-container text-on-tertiary-container border-tertiary-fixed-dim', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-AKFjRGCU_Cee-wObk6guTQnjycNfsEzz97CxKpI_M8zZU2BoORq7J6O_fIEm36_lHbdp97vJX4Y9ofH8hEgrixpQi7bCu5oUp_VBl6ASStTwzipYKOobQbiYCGjKlPHfnkkPTobvVwE1Kbj_4vZy8ntpmoq7mdh6LGFHYUjBpFbGOZC3a6SiB7fha6AaAb0P2csmhzMweOytiRJAFSW8ElsEFqqllwVaLVqA0g2gZoFl4uL8aw-Avikm-OudJYMPRho46S9A_F0' },
    { name: 'Marcus Chen', role: 'Administrator', username: 'm.chen_root', lastActive: 'Online', title: 'System Administrator', roleBg: 'bg-secondary-container text-on-secondary-container border-outline-variant/30', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMhcFgCtlMfdgRyTkqXrwsqhrUg_y3lvVZtDFUm689XOy__4x0rv_ccGIPVL3ZkS6092M8ap2dZBPd4P3nlUa2x-lc1kbtw-0uGa8QKlLq3shQyCjV7O082pTlTLmyjlFYmv1BrOmvu5UB6I5PcCqutcad6rTm2uD2zOAEHGiXrsM6vm1MWLsbGocji-ZH1a7jU_JqgPPwBt9dwIoiWICBhdEss8B0YGWt1K_nP5J0zJzEEVImlwaj3Mk2h3v1qH8wtxbX2phKNKQ' },
];

const StaffManagement = () => {
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    const openEdit = (s) => { setSelected(s); setEditOpen(true); };
    const openDelete = (s) => { setSelected(s); setDeleteOpen(true); };
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
                                <span className="text-4xl font-black text-on-surface">24</span>
                                <span className="text-primary font-bold mb-1">+2 this month</span>
                            </div>
                        </div>
                        <div className="bg-primary text-on-primary p-8 rounded-xl shadow-xl shadow-primary/10">
                            <p className="text-xs font-bold uppercase tracking-widest text-on-primary/70 mb-4">On Duty Now</p>
                            <div className="flex items-end gap-2">
                                <span className="text-4xl font-black">6</span>
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
                            <div className="flex gap-2">
                                <button className="p-2 rounded-lg hover:bg-white text-on-surface-variant">
                                    <span className="material-symbols-outlined">filter_list</span>
                                </button>
                                <button className="p-2 rounded-lg hover:bg-white text-on-surface-variant">
                                    <span className="material-symbols-outlined">more_vert</span>
                                </button>
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

                                    <tr className="hover:bg-surface-container-low/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-full bg-slate-100 flex-shrink-0 overflow-hidden border-2 border-surface-container">
                                                    <img alt="Dr. Julian Vane" data-alt="portrait of a middle-aged male doctor with glasses and short hair, neutral studio background, professional lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaIIyLz1eVUa_XRAAIbSP3eB_4LbAx0gcV-DskRnS0QkJA6846JLaY-BLlFifTWf67OQPNSgz5KPvU5mwM6vYW--p8YiH0cis7OdQp8omNm5gWA7LoYPOgdByyWwiG_ofU1pqTutLMIViMJoqsC7q128YZpliVx_7hDmPbB0K6eDIKqePM9gpZ_9devLiBFaozPSqzfr79-9m6ScZmwDXiHZ77Jb8s9-kNZ2xFn5RzQvfbVJDnZWoRpr9z0xZV4S-OFZ5O0yPQl2U" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-on-surface group-hover:text-primary transition-colors">Dr. Julian Vane</p>
                                                    <p className="text-xs text-on-surface-variant">Senior Practitioner</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter bg-sky-100 text-sky-800 border border-sky-200">Doctor</span>
                                        </td>
                                        <td className="px-8 py-6 font-mono text-sm text-on-surface-variant">j.vane_clin</td>
                                        <td className="px-8 py-6 text-sm text-on-surface-variant">2 mins ago</td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openEdit(STAFF[0])} className="w-10 h-10 rounded-full hover:bg-secondary-container text-on-secondary-container flex items-center justify-center transition-all" title="Edit">
                                                    <span className="material-symbols-outlined text-[20px]">edit_square</span>
                                                </button>
                                                <button onClick={() => openDelete(STAFF[0])} className="w-10 h-10 rounded-full hover:bg-error-container text-on-error-container flex items-center justify-center transition-all" title="Delete">
                                                    <span className="material-symbols-outlined text-[20px]">delete_sweep</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr className="hover:bg-surface-container-low/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-full bg-slate-100 flex-shrink-0 overflow-hidden border-2 border-surface-container">
                                                    <img alt="Nurse Clara" data-alt="young female nurse with tied hair smiling warmly, soft daylight in a modern clinic corridor" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-AKFjRGCU_Cee-wObk6guTQnjycNfsEzz97CxKpI_M8zZU2BoORq7J6O_fIEm36_lHbdp97vJX4Y9ofH8hEgrixpQi7bCu5oUp_VBl6ASStTwzipYKOobQbiYCGjKlPHfnkkPTobvVwE1Kbj_4vZy8ntpmoq7mdh6LGFHYUjBpFbGOZC3a6SiB7fha6AaAb0P2csmhzMweOytiRJAFSW8ElsEFqqllwVaLVqA0g2gZoFl4uL8aw-Avikm-OudJYMPRho46S9A_F0" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-on-surface group-hover:text-primary transition-colors">Clara Henderson</p>
                                                    <p className="text-xs text-on-surface-variant">Registered Nurse</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter bg-tertiary-container text-on-tertiary-container border border-tertiary-fixed-dim">Nurse</span>
                                        </td>
                                        <td className="px-8 py-6 font-mono text-sm text-on-surface-variant">clara.h_care</td>
                                        <td className="px-8 py-6 text-sm text-on-surface-variant">1 hour ago</td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openEdit(STAFF[1])} className="w-10 h-10 rounded-full hover:bg-secondary-container text-on-secondary-container flex items-center justify-center transition-all" title="Edit">
                                                    <span className="material-symbols-outlined text-[20px]">edit_square</span>
                                                </button>
                                                <button onClick={() => openDelete(STAFF[1])} className="w-10 h-10 rounded-full hover:bg-error-container text-on-error-container flex items-center justify-center transition-all" title="Delete">
                                                    <span className="material-symbols-outlined text-[20px]">delete_sweep</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr className="hover:bg-surface-container-low/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-full bg-slate-100 flex-shrink-0 overflow-hidden border-2 border-surface-container">
                                                    <img alt="Marcus Chen" data-alt="smiling young asian male administrator in casual business attire, bright office background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMhcFgCtlMfdgRyTkqXrwsqhrUg_y3lvVZtDFUm689XOy__4x0rv_ccGIPVL3ZkS6092M8ap2dZBPd4P3nlUa2x-lc1kbtw-0uGa8QKlLq3shQyCjV7O082pTlTLmyjlFYmv1BrOmvu5UB6I5PcCqutcad6rTm2uD2zOAEHGiXrsM6vm1MWLsbGocji-ZH1a7jU_JqgPPwBt9dwIoiWICBhdEss8B0YGWt1K_nP5J0zJzEEVImlwaj3Mk2h3v1qH8wtxbX2phKNKQ" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-on-surface group-hover:text-primary transition-colors">Marcus Chen</p>
                                                    <p className="text-xs text-on-surface-variant">System Administrator</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter bg-secondary-container text-on-secondary-container border border-outline-variant/30">Admin</span>
                                        </td>
                                        <td className="px-8 py-6 font-mono text-sm text-on-surface-variant">m.chen_root</td>
                                        <td className="px-8 py-6 text-sm text-on-surface-variant">Online</td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openEdit(STAFF[2])} className="w-10 h-10 rounded-full hover:bg-secondary-container text-on-secondary-container flex items-center justify-center transition-all" title="Edit">
                                                    <span className="material-symbols-outlined text-[20px]">edit_square</span>
                                                </button>
                                                <button onClick={() => openDelete(STAFF[2])} className="w-10 h-10 rounded-full hover:bg-error-container text-on-error-container flex items-center justify-center transition-all" title="Delete">
                                                    <span className="material-symbols-outlined text-[20px]">delete_sweep</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="px-8 py-6 flex justify-between items-center text-sm font-medium text-on-surface-variant">
                            <span>Showing 3 of 24 Staff Members</span>
                            <div className="flex gap-1">
                                <button className="px-4 py-2 rounded-full hover:bg-surface-container-low transition-colors">Previous</button>
                                <button className="w-10 h-10 flex items-center justify-center bg-primary text-on-primary rounded-full">1</button>
                                <button className="w-10 h-10 flex items-center justify-center hover:bg-surface-container-low rounded-full">2</button>
                                <button className="w-10 h-10 flex items-center justify-center hover:bg-surface-container-low rounded-full">3</button>
                                <button className="px-4 py-2 rounded-full hover:bg-surface-container-low transition-colors">Next</button>
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
            <AddEditStaffModal open={addOpen} onClose={() => setAddOpen(false)} />
            <AddEditStaffModal open={editOpen} onClose={() => setEditOpen(false)} staff={selected} />
            <ConfirmDeleteModal
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={() => { alert(`Removed: ${selected?.name}`); setDeleteOpen(false); }}
                itemName={selected?.name}
                itemType="staff member"
            />
        </>
    );
};

export default StaffManagement;
