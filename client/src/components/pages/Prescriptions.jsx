import React, { useState, useEffect } from 'react';
import Sidebar from '../navbar/Sidebar';
import Header from '../navbar/Header';

const PRESCRIPTIONS = [
    { id: '#RX-8821', visitId: 'VST-4492', medicine: 'Amoxicillin 500mg', quantity: '15 Units', icon: 'medication', iconBg: 'bg-tertiary-container', iconFg: 'text-on-tertiary-container' },
    { id: '#RX-8822', visitId: 'VST-4495', medicine: 'Paracetamol', quantity: '10 Units', icon: 'pill', iconBg: 'bg-primary-container', iconFg: 'text-on-primary-container' },
    { id: '#RX-8825', visitId: 'VST-4501', medicine: 'Ibuprofen 200mg', quantity: '20 Units', icon: 'medical_services', iconBg: 'bg-tertiary-container', iconFg: 'text-on-tertiary-container' },
    { id: '#RX-8830', visitId: 'VST-4512', medicine: 'Cetirizine', quantity: '5 Units', icon: 'medication', iconBg: 'bg-primary-container', iconFg: 'text-on-primary-container' },
];

const PrescriptionModal = ({ open, onClose, prescription = null }) => {
    const isEdit = !!prescription;
    const [form, setForm] = useState({ visitId: '', medicine: '', quantity: '', notes: '' });

    useEffect(() => {
        if (prescription) {
            setForm({ visitId: prescription.visitId || '', medicine: prescription.medicine || '', quantity: prescription.quantity?.replace(' Units', '') || '', notes: '' });
        } else {
            setForm({ visitId: '', medicine: '', quantity: '', notes: '' });
        }
    }, [prescription, open]);

    useEffect(() => {
        if (open) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    if (!open) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`${isEdit ? 'Updated' : 'Created'} prescription for: ${form.medicine}`);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-on-surface/30 backdrop-blur-sm" />
            <div
                className="relative w-full max-w-lg bg-surface-container-lowest rounded-3xl shadow-2xl overflow-hidden"
                style={{ animation: 'modalIn 0.2s ease-out' }}
                onClick={e => e.stopPropagation()}
            >
                <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.95) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }`}</style>

                {/* Header */}
                <div className="px-8 pt-8 pb-6 border-b border-surface-container flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary-container/20 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-primary">prescriptions</span>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-xl text-on-surface font-manrope">{isEdit ? 'Edit Prescription' : 'Create Prescription'}</h3>
                        <p className="text-sm text-on-surface-variant mt-0.5">Fill in the prescription details below</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors">
                        <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-8 space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Visit ID</label>
                                <input className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20" value={form.visitId} onChange={e => setForm({ ...form, visitId: e.target.value })} placeholder="e.g. VST-4492" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Quantity (units)</label>
                                <input type="number" className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} placeholder="e.g. 15" required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Medicine</label>
                            <select className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20" value={form.medicine} onChange={e => setForm({ ...form, medicine: e.target.value })} required>
                                <option value="">Select medicine</option>
                                <option>Amoxicillin 500mg</option>
                                <option>Paracetamol</option>
                                <option>Ibuprofen 200mg</option>
                                <option>Cetirizine</option>
                                <option>Epinephrine Pen</option>
                                <option>Vitamin C 500mg</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Notes / Instructions</label>
                            <textarea className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 resize-none" rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="e.g. Take with food, twice daily..." />
                        </div>
                    </div>
                    <div className="px-8 pb-8 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-3 rounded-full border border-outline-variant/30 text-on-surface-variant font-bold text-sm hover:bg-surface-container transition-all">
                            Cancel
                        </button>
                        <button type="submit" className="flex-1 py-3 rounded-full bg-primary text-on-primary font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary-dim transition-all active:scale-95">
                            {isEdit ? 'Save Changes' : 'Create Prescription'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Prescriptions = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingRx, setEditingRx] = useState(null);

    const openCreate = () => { setEditingRx(null); setModalOpen(true); };
    const openEdit = (rx) => { setEditingRx(rx); setModalOpen(true); };

    return (
        <>
            <Sidebar />
            <main className="flex-1 ml-72 min-h-screen overflow-y-auto pt-0 pb-12">

                <Header hasSearch={true} searchPlaceholder="Search prescriptions..." />

                <div className="pt-10 px-8">

                    <section className="flex justify-between items-end mb-16">
                        <div className="space-y-2">
                            <h2 className="text-5xl font-black font-manrope text-on-surface tracking-tight leading-tight">Prescriptions</h2>
                            <p className="text-lg text-on-surface-variant font-body">Managing therapeutic flows for the current semester.</p>
                        </div>
                        <div>
                            <button
                                onClick={openCreate}
                                className="bg-primary text-on-primary px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-primary-dim transition-all shadow-lg shadow-primary/20 scale-100 active:scale-95"
                            >
                                <span className="material-symbols-outlined">add</span>
                                Create Prescription
                            </button>
                        </div>
                    </section>

                    <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/10">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-surface-container-low">
                                        <th className="text-left py-6 px-8 text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">Prescription ID</th>
                                        <th className="text-left py-6 px-8 text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">Visit ID</th>
                                        <th className="text-left py-6 px-8 text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">Medicine Name</th>
                                        <th className="text-left py-6 px-8 text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">Quantity</th>
                                        <th className="text-right py-6 px-8 text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-surface-container">

                                    <tr className="hover:bg-surface-container-low transition-colors group">
                                        <td className="py-6 px-8">
                                            <span className="font-bold text-primary">#RX-8821</span>
                                        </td>
                                        <td className="py-6 px-8">
                                            <span className="text-sm font-medium text-on-surface">VST-4492</span>
                                        </td>
                                        <td className="py-6 px-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-tertiary-container flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-on-tertiary-container text-sm">medication</span>
                                                </div>
                                                <span className="font-semibold text-on-surface">Amoxicillin 500mg</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-8">
                                            <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold">15 Units</span>
                                        </td>
                                        <td className="py-6 px-8 text-right">
                                            <button onClick={() => openEdit(PRESCRIPTIONS[0])} className="p-2 rounded-full text-on-surface-variant hover:bg-white hover:text-primary transition-all opacity-0 group-hover:opacity-100">
                                                <span className="material-symbols-outlined">edit</span>
                                            </button>
                                        </td>
                                    </tr>

                                    <tr className="hover:bg-surface-container-low transition-colors group">
                                        <td className="py-6 px-8">
                                            <span className="font-bold text-primary">#RX-8822</span>
                                        </td>
                                        <td className="py-6 px-8">
                                            <span className="text-sm font-medium text-on-surface">VST-4495</span>
                                        </td>
                                        <td className="py-6 px-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-on-primary-container text-sm">pill</span>
                                                </div>
                                                <span className="font-semibold text-on-surface">Paracetamol</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-8">
                                            <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold">10 Units</span>
                                        </td>
                                        <td className="py-6 px-8 text-right">
                                            <button onClick={() => openEdit(PRESCRIPTIONS[1])} className="p-2 rounded-full text-on-surface-variant hover:bg-white hover:text-primary transition-all opacity-0 group-hover:opacity-100">
                                                <span className="material-symbols-outlined">edit</span>
                                            </button>
                                        </td>
                                    </tr>

                                    <tr className="hover:bg-surface-container-low transition-colors group">
                                        <td className="py-6 px-8">
                                            <span className="font-bold text-primary">#RX-8825</span>
                                        </td>
                                        <td className="py-6 px-8">
                                            <span className="text-sm font-medium text-on-surface">VST-4501</span>
                                        </td>
                                        <td className="py-6 px-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-tertiary-container flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-on-tertiary-container text-sm">medical_services</span>
                                                </div>
                                                <span className="font-semibold text-on-surface">Ibuprofen 200mg</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-8">
                                            <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold">20 Units</span>
                                        </td>
                                        <td className="py-6 px-8 text-right">
                                            <button onClick={() => openEdit(PRESCRIPTIONS[2])} className="p-2 rounded-full text-on-surface-variant hover:bg-white hover:text-primary transition-all opacity-0 group-hover:opacity-100">
                                                <span className="material-symbols-outlined">edit</span>
                                            </button>
                                        </td>
                                    </tr>

                                    <tr className="hover:bg-surface-container-low transition-colors group">
                                        <td className="py-6 px-8">
                                            <span className="font-bold text-primary">#RX-8830</span>
                                        </td>
                                        <td className="py-6 px-8">
                                            <span className="text-sm font-medium text-on-surface">VST-4512</span>
                                        </td>
                                        <td className="py-6 px-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-on-primary-container text-sm">medication</span>
                                                </div>
                                                <span className="font-semibold text-on-surface">Cetirizine</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-8">
                                            <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold">5 Units</span>
                                        </td>
                                        <td className="py-6 px-8 text-right">
                                            <button onClick={() => openEdit(PRESCRIPTIONS[3])} className="p-2 rounded-full text-on-surface-variant hover:bg-white hover:text-primary transition-all opacity-0 group-hover:opacity-100">
                                                <span className="material-symbols-outlined">edit</span>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="p-8 bg-surface-container-low flex justify-between items-center">
                            <p className="text-sm font-body text-on-surface-variant">Showing 4 of 124 prescriptions</p>
                            <div className="flex gap-2">
                                <button className="h-10 w-10 flex items-center justify-center rounded-full bg-white shadow-sm text-on-surface hover:text-primary transition-all">
                                    <span className="material-symbols-outlined">chevron_left</span>
                                </button>
                                <button className="h-10 w-10 flex items-center justify-center rounded-full bg-primary text-on-primary shadow-lg shadow-primary/20">
                                    1
                                </button>
                                <button className="h-10 w-10 flex items-center justify-center rounded-full bg-white shadow-sm text-on-surface hover:text-primary transition-all">
                                    2
                                </button>
                                <button className="h-10 w-10 flex items-center justify-center rounded-full bg-white shadow-sm text-on-surface hover:text-primary transition-all">
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 grid grid-cols-12 gap-8">
                        <div className="col-span-12 md:col-span-7 bg-primary-container/10 p-10 rounded-xl relative overflow-hidden flex flex-col justify-center min-h-[300px]">
                            <div className="relative z-10 space-y-4">
                                <span className="inline-block px-4 py-1.5 bg-primary text-on-primary text-xs font-bold rounded-full uppercase tracking-widest">Efficiency Tip</span>
                                <h3 className="text-3xl font-black text-on-primary-container leading-tight">Streamline with recurring prescriptions.</h3>
                                <p className="text-on-primary-container/70 max-w-md font-body">Use the "Duplicate" feature on frequent chronic prescriptions to save 40% more time on administrative entry.</p>
                            </div>
                            <div className="absolute -right-20 -bottom-20 opacity-20 rotate-12">
                                <span className="material-symbols-outlined text-[300px]">prescriptions</span>
                            </div>
                        </div>
                        <div className="col-span-12 md:col-span-5 bg-tertiary-container/20 p-10 rounded-xl border border-tertiary/10 flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-on-tertiary-container mb-2">Pending Approvals</h3>
                                <p className="text-on-tertiary-container/60 text-sm font-body">There are currently 12 prescriptions awaiting physician confirmation.</p>
                            </div>
                            <div className="mt-8">
                                <div className="flex -space-x-3">
                                    <img className="w-12 h-12 rounded-full border-4 border-surface shadow-sm" data-alt="Close-up of a diverse male doctor with glasses in a professional medical setting with soft bokeh background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA603FTxPItMf2QzYr-S3RvjpSv4pjtE6_4WasreamjlFFscxwFO4hJDk7Z1FXmd6Hqkx3njwrz2jv3CFQOCwX3xnwhrtReQpNbCJUbFqN1tGFkwoKvfqjvooNGCxnWvsupflhEhhmlqbsQu3kwgTs59nhaVYrrgEb__H7YiUALTuFi21SAqX5BzQfoU-p0UrBFfh3BerUUsSGSJMF_sNkteFTn-4AB9GufOUaZTYlE6Ii4CUezxSAslqjIj7Vtq5kr7EH3yA1B4Ew" />
                                    <img className="w-12 h-12 rounded-full border-4 border-surface shadow-sm" data-alt="Portrait of a female pediatrician in white coat in a friendly office environment" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAx6yCqbL0cuQ4OSXi-RjHULM76KgzwdfJHCxhBOAmgJTgC10yuoWjtCUOLdSgG8hRDMvM0I7WUY94GLWRF0ZaRIX0QDpMyGl3mtCRtMseLwx7yH036ar5DExkmPkmMf_WXE6Xw37VG__KqWWao7YyRmpfjBmcDXTAGYA4uyj8WDRCepgiLWTvCXbtHx4euhX68leyeIRsuW5XKOey4LgswSRW4Lpy0OQWAvy8qKTbgDBM2RHq6RYNTj7mN-D7nrZxIQHcZyv9Yrsk" />
                                    <div className="w-12 h-12 rounded-full bg-tertiary text-on-tertiary border-4 border-surface shadow-sm flex items-center justify-center font-bold text-xs">+9</div>
                                </div>
                                <button className="mt-6 text-primary font-bold text-sm flex items-center gap-1 group">
                                    Review Queue
                                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <PrescriptionModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                prescription={editingRx}
            />
        </>
    );
};

export default Prescriptions;
