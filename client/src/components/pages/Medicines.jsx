import React, { useState } from 'react';
import Sidebar from '../navbar/Sidebar';
import Header from '../navbar/Header';
import { AddEditMedicineModal, ConfirmDeleteModal } from '../modals/SharedModals';

const MEDICINES = [
    { name: 'Amoxicillin 500mg', category: 'Antibiotic / Capsule', quantity: '450', expiryDate: '2025-10-12', status: 'OK Status', statusBg: 'bg-tertiary-container text-on-tertiary-container', icon: 'pill' },
    { name: 'Paracetamol Syrup', category: 'Analgesic / 100ml Bottle', quantity: '12', expiryDate: '2024-05-30', status: 'Low Stock', statusBg: 'bg-error-container text-on-error-container', icon: 'medication' },
    { name: 'Epinephrine Pen', category: 'Emergency / Auto-injector', quantity: '25', expiryDate: '2024-03-15', status: 'Expiring', statusBg: 'bg-tertiary-container text-on-tertiary-container', icon: 'vaccines' },
    { name: 'Ibuprofen 200mg', category: 'NSAID / Tablets', quantity: '1200', expiryDate: '2026-12-05', status: 'OK Status', statusBg: 'bg-tertiary-container text-on-tertiary-container', icon: 'medical_information' },
];

const Medicines = () => {
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    const openEdit = (m) => { setSelected(m); setEditOpen(true); };
    const openDelete = (m) => { setSelected(m); setDeleteOpen(true); };
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-surface-container-lowest p-8 rounded-xl flex flex-col justify-between h-48 border border-outline-variant/10">
                            <div className="flex justify-between items-start">
                                <span className="material-symbols-outlined text-primary text-3xl">inventory_2</span>
                                <span className="text-xs font-bold uppercase tracking-tighter text-on-surface-variant">Total SKU</span>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-on-surface">142</div>
                                <div className="text-sm text-on-surface-variant">Active medicines in stock</div>
                            </div>
                        </div>
                        <div className="bg-surface-container-low p-8 rounded-xl flex flex-col justify-between h-48">
                            <div className="flex justify-between items-start">
                                <span className="material-symbols-outlined text-error text-3xl">warning</span>
                                <span className="text-xs font-bold uppercase tracking-tighter text-on-surface-variant">Critically Low</span>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-on-surface">08</div>
                                <div className="text-sm text-on-surface-variant">Require immediate restock</div>
                            </div>
                        </div>
                        <div className="bg-tertiary-container/30 p-8 rounded-xl flex flex-col justify-between h-48 border border-tertiary/5">
                            <div className="flex justify-between items-start">
                                <span className="material-symbols-outlined text-tertiary text-3xl">event_busy</span>
                                <span className="text-xs font-bold uppercase tracking-tighter text-on-surface-variant">Expiring Soon</span>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-on-surface">12</div>
                                <div className="text-sm text-on-surface-variant">Within next 30 days</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm shadow-slate-200">
                        <div className="px-8 py-6 border-b border-surface-container flex items-center justify-between bg-surface-container-lowest">
                            <div className="flex items-center gap-4">
                                <span className="material-symbols-outlined text-on-surface-variant">filter_list</span>
                                <span className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest">Active Inventory</span>
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
                                    <th className="px-8 py-6">Status</th>
                                    <th className="px-8 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-container-low">

                                <tr className="group hover:bg-surface-container-low/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                                                <span className="material-symbols-outlined text-[20px]">pill</span>
                                            </div>
                                            <div>
                                                <div className="font-bold text-on-surface">Amoxicillin 500mg</div>
                                                <div className="text-xs text-on-surface-variant">Antibiotic / Capsule</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="font-semibold text-on-surface">450 <span className="text-on-surface-variant text-xs font-normal">units</span></span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-on-surface-variant font-medium">Oct 12, 2025</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-tertiary-container text-on-tertiary-container">
                                            OK Status
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEdit(MEDICINES[0])} className="p-2 hover:bg-white rounded-full text-on-surface-variant hover:text-primary transition-colors">
                                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                            </button>
                                            <button onClick={() => openDelete(MEDICINES[0])} className="p-2 hover:bg-white rounded-full text-on-surface-variant hover:text-error transition-colors">
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>

                                <tr className="group hover:bg-surface-container-low/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                                                <span className="material-symbols-outlined text-[20px]">medication</span>
                                            </div>
                                            <div>
                                                <div className="font-bold text-on-surface">Paracetamol Syrup</div>
                                                <div className="text-xs text-on-surface-variant">Analgesic / 100ml Bottle</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="font-semibold text-on-surface text-error">12 <span className="text-on-surface-variant text-xs font-normal">units</span></span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-on-surface-variant font-medium">May 30, 2024</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-error-container text-on-error-container">
                                            Low Stock
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEdit(MEDICINES[1])} className="p-2 hover:bg-white rounded-full text-on-surface-variant hover:text-primary transition-colors">
                                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                            </button>
                                            <button onClick={() => openDelete(MEDICINES[1])} className="p-2 hover:bg-white rounded-full text-on-surface-variant hover:text-error transition-colors">
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>

                                <tr className="group hover:bg-surface-container-low/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                                                <span className="material-symbols-outlined text-[20px]">vaccines</span>
                                            </div>
                                            <div>
                                                <div className="font-bold text-on-surface">Epinephrine Pen</div>
                                                <div className="text-xs text-on-surface-variant">Emergency / Auto-injector</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="font-semibold text-on-surface">25 <span className="text-on-surface-variant text-xs font-normal">units</span></span>
                                    </td>
                                    <td className="px-8 py-6 text-error">
                                        <span className="font-bold">Mar 15, 2024</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-tertiary-container text-on-tertiary-container">
                                            Expiring
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEdit(MEDICINES[2])} className="p-2 hover:bg-white rounded-full text-on-surface-variant hover:text-primary transition-colors">
                                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                            </button>
                                            <button onClick={() => openDelete(MEDICINES[2])} className="p-2 hover:bg-white rounded-full text-on-surface-variant hover:text-error transition-colors">
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>

                                <tr className="group hover:bg-surface-container-low/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                                                <span className="material-symbols-outlined text-[20px]">medical_information</span>
                                            </div>
                                            <div>
                                                <div className="font-bold text-on-surface">Ibuprofen 200mg</div>
                                                <div className="text-xs text-on-surface-variant">NSAID / Tablets</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="font-semibold text-on-surface">1200 <span className="text-on-surface-variant text-xs font-normal">units</span></span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-on-surface-variant font-medium">Dec 05, 2026</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-tertiary-container text-on-tertiary-container">
                                            OK Status
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEdit(MEDICINES[3])} className="p-2 hover:bg-white rounded-full text-on-surface-variant hover:text-primary transition-colors">
                                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                            </button>
                                            <button onClick={() => openDelete(MEDICINES[3])} className="p-2 hover:bg-white rounded-full text-on-surface-variant hover:text-error transition-colors">
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="px-8 py-6 flex items-center justify-between text-sm text-on-surface-variant">
                            <p>Showing 4 of 142 products</p>
                            <div className="flex items-center gap-2">
                                <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container transition-all">
                                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                                </button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-on-primary font-bold">1</button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container transition-all">2</button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container transition-all">3</button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container transition-all">
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
            <AddEditMedicineModal open={addOpen} onClose={() => setAddOpen(false)} />
            <AddEditMedicineModal open={editOpen} onClose={() => setEditOpen(false)} medicine={selected} />
            <ConfirmDeleteModal
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={() => { alert(`Deleted: ${selected?.name}`); setDeleteOpen(false); }}
                itemName={selected?.name}
                itemType="medicine"
            />
        </>
    );
};

export default Medicines;
