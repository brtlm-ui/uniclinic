import React, { useState, useEffect } from 'react';

/* ─────────────────────────────────────────────────────────────
   MODAL SHELL — base overlay + card
───────────────────────────────────────────────────────────── */
export function ModalShell({ open, onClose, children, maxWidth = 'max-w-lg' }) {
    useEffect(() => {
        if (open) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-on-surface/30 backdrop-blur-sm" />
            <div
                className={`relative w-full ${maxWidth} bg-surface-container-lowest rounded-3xl shadow-2xl shadow-on-surface/20 overflow-hidden`}
                style={{ animation: 'modalIn 0.2s ease-out' }}
                onClick={e => e.stopPropagation()}
            >
                {children}
            </div>
            <style>{`
                @keyframes modalIn {
                    from { opacity: 0; transform: scale(0.95) translateY(8px); }
                    to   { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>
        </div>
    );
}

function ModalHeader({ icon, title, subtitle, onClose, iconBg = 'bg-primary-container/20', iconColor = 'text-primary' }) {
    return (
        <div className="px-8 pt-8 pb-6 border-b border-surface-container flex items-start gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                <span className={`material-symbols-outlined ${iconColor}`}>{icon}</span>
            </div>
            <div className="flex-1">
                <h3 className="font-bold text-xl text-on-surface font-manrope">{title}</h3>
                {subtitle && <p className="text-sm text-on-surface-variant mt-0.5">{subtitle}</p>}
            </div>
            <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors flex-shrink-0"
            >
                <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
        </div>
    );
}

function FormRow({ label, children }) {
    return (
        <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">{label}</label>
            {children}
        </div>
    );
}

const inputCls = "w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all";
const selectCls = "w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all appearance-none";

/* ─────────────────────────────────────────────────────────────
   LOGOUT MODAL
───────────────────────────────────────────────────────────── */
export function LogoutModal({ open, onClose, onConfirm }) {
    return (
        <ModalShell open={open} onClose={onClose} maxWidth="max-w-sm">
            <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-error-container/20 flex items-center justify-center mx-auto mb-5">
                    <span className="material-symbols-outlined text-error text-3xl">logout</span>
                </div>
                <h3 className="font-bold text-xl text-on-surface font-manrope mb-2">Sign Out?</h3>
                <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
                    You'll be returned to the login screen. Any unsaved changes will be lost.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-full border border-outline-variant/30 text-on-surface-variant font-bold text-sm hover:bg-surface-container transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3 rounded-full bg-error text-on-error font-bold text-sm hover:bg-error-dim transition-all shadow-lg shadow-error/20 active:scale-95"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </ModalShell>
    );
}

/* ─────────────────────────────────────────────────────────────
   CONFIRM DELETE MODAL
───────────────────────────────────────────────────────────── */
export function ConfirmDeleteModal({ open, onClose, onConfirm, itemName = 'this record', itemType = 'record' }) {
    return (
        <ModalShell open={open} onClose={onClose} maxWidth="max-w-sm">
            <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-error-container/20 flex items-center justify-center mx-auto mb-5">
                    <span className="material-symbols-outlined text-error text-3xl">delete_forever</span>
                </div>
                <h3 className="font-bold text-xl text-on-surface font-manrope mb-2">Delete {itemType}?</h3>
                <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
                    <span className="font-bold text-on-surface">{itemName}</span> will be permanently removed. This action cannot be undone.
                </p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 rounded-full border border-outline-variant/30 text-on-surface-variant font-bold text-sm hover:bg-surface-container transition-all">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="flex-1 py-3 rounded-full bg-error text-on-error font-bold text-sm hover:bg-error-dim transition-all shadow-lg shadow-error/20 active:scale-95">
                        Delete
                    </button>
                </div>
            </div>
        </ModalShell>
    );
}

/* ─────────────────────────────────────────────────────────────
   VIEW STUDENT MODAL
───────────────────────────────────────────────────────────── */
export function ViewStudentModal({ open, onClose, student }) {
    if (!student) return null;
    const initials = student.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return (
        <ModalShell open={open} onClose={onClose} maxWidth="max-w-lg">
            <ModalHeader icon="person" title="Student Record" subtitle={`ID: ${student.id}`} onClose={onClose} />
            <div className="p-8 space-y-6">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-primary-container flex items-center justify-center text-on-primary-container font-black text-xl">{initials}</div>
                    <div>
                        <h4 className="font-bold text-on-surface text-lg">{student.name}</h4>
                        <p className="text-sm text-on-surface-variant">{student.email}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { label: 'Course', value: student.course },
                        { label: 'Year Level', value: student.year },
                        { label: 'Student ID', value: student.id },
                        { label: 'Status', value: 'Enrolled' },
                    ].map(f => (
                        <div key={f.label} className="bg-surface-container-low rounded-xl px-4 py-3">
                            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">{f.label}</p>
                            <p className="font-semibold text-on-surface text-sm">{f.value}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="px-8 pb-8">
                <button onClick={onClose} className="w-full py-3 rounded-full bg-surface-container text-on-surface font-bold text-sm hover:bg-surface-container-high transition-all">Close</button>
            </div>
        </ModalShell>
    );
}

/* ─────────────────────────────────────────────────────────────
   ADD / EDIT STUDENT MODAL
───────────────────────────────────────────────────────────── */
export function AddEditStudentModal({ open, onClose, student = null }) {
    const isEdit = !!student;
    const [form, setForm] = useState({ name: '', email: '', course: '', year: '' });

    useEffect(() => {
        if (student) setForm({ name: student.name || '', email: student.email || '', course: student.course || '', year: student.year || '' });
        else setForm({ name: '', email: '', course: '', year: '' });
    }, [student, open]);

    const handleSubmit = (e) => { e.preventDefault(); alert(`${isEdit ? 'Updated' : 'Added'}: ${form.name}`); onClose(); };

    return (
        <ModalShell open={open} onClose={onClose} maxWidth="max-w-lg">
            <ModalHeader icon={isEdit ? 'edit' : 'person_add'} title={isEdit ? 'Edit Student Record' : 'New Student Record'} subtitle="Fill in the student information below" onClose={onClose} />
            <form onSubmit={handleSubmit}>
                <div className="p-8 space-y-5">
                    <FormRow label="Full Name">
                        <input className={inputCls} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Elena Marasigan" required />
                    </FormRow>
                    <FormRow label="Email Address">
                        <input type="email" className={inputCls} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="e.g. elena.m@university.edu" />
                    </FormRow>
                    <div className="grid grid-cols-2 gap-4">
                        <FormRow label="Course">
                            <select className={selectCls} value={form.course} onChange={e => setForm({ ...form, course: e.target.value })} required>
                                <option value="">Select course</option>
                                <option>B.S. Nursing</option>
                                <option>B.S. Computer Science</option>
                                <option>B.S. Architecture</option>
                                <option>B.A. Communication</option>
                                <option>B.S. Business Administration</option>
                            </select>
                        </FormRow>
                        <FormRow label="Year Level">
                            <select className={selectCls} value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} required>
                                <option value="">Select year</option>
                                <option>1st Year</option>
                                <option>2nd Year</option>
                                <option>3rd Year</option>
                                <option>4th Year</option>
                            </select>
                        </FormRow>
                    </div>
                </div>
                <div className="px-8 pb-8 flex gap-3">
                    <button type="button" onClick={onClose} className="flex-1 py-3 rounded-full border border-outline-variant/30 text-on-surface-variant font-bold text-sm hover:bg-surface-container transition-all">Cancel</button>
                    <button type="submit" className="flex-1 py-3 rounded-full bg-primary text-on-primary font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary-dim transition-all active:scale-95">
                        {isEdit ? 'Save Changes' : 'Add Student'}
                    </button>
                </div>
            </form>
        </ModalShell>
    );
}

/* ─────────────────────────────────────────────────────────────
   VIEW VISIT MODAL
───────────────────────────────────────────────────────────── */
export function ViewVisitModal({ open, onClose, visit }) {
    if (!visit) return null;
    return (
        <ModalShell open={open} onClose={onClose} maxWidth="max-w-lg">
            <ModalHeader icon="event_note" title="Visit Details" subtitle={`Visit Record`} onClose={onClose} />
            <div className="p-8 space-y-4">
                {[
                    { label: 'Student', value: visit.student },
                    { label: 'Date & Time', value: `${visit.date} at ${visit.time}` },
                    { label: 'Reason / Diagnosis', value: visit.reason },
                    { label: 'Status', value: visit.status },
                    { label: 'Attending Staff', value: visit.staff },
                ].map(f => (
                    <div key={f.label} className="bg-surface-container-low rounded-xl px-5 py-3 flex items-center gap-3">
                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest w-32 flex-shrink-0">{f.label}</p>
                        <p className="font-semibold text-on-surface text-sm">{f.value}</p>
                    </div>
                ))}
            </div>
            <div className="px-8 pb-8">
                <button onClick={onClose} className="w-full py-3 rounded-full bg-surface-container text-on-surface font-bold text-sm hover:bg-surface-container-high transition-all">Close</button>
            </div>
        </ModalShell>
    );
}

/* ─────────────────────────────────────────────────────────────
   ADD / EDIT VISIT MODAL
───────────────────────────────────────────────────────────── */
export function AddEditVisitModal({ open, onClose, visit = null }) {
    const isEdit = !!visit;
    const [form, setForm] = useState({ student: '', date: '', time: '', reason: '', status: 'Completed', staff: 'Nurse Miller' });

    useEffect(() => {
        if (visit) setForm({ student: visit.student || '', date: visit.date || '', time: visit.time || '', reason: visit.reason || '', status: visit.status || 'Completed', staff: visit.staff || '' });
        else setForm({ student: '', date: '', time: '', reason: '', status: 'Completed', staff: 'Nurse Miller' });
    }, [visit, open]);

    const handleSubmit = (e) => { e.preventDefault(); alert(`${isEdit ? 'Updated' : 'Logged'} visit for: ${form.student}`); onClose(); };

    return (
        <ModalShell open={open} onClose={onClose} maxWidth="max-w-lg">
            <ModalHeader icon={isEdit ? 'edit' : 'add_circle'} title={isEdit ? 'Edit Visit Record' : 'Log New Visit'} subtitle="Record clinic visit details below" onClose={onClose} />
            <form onSubmit={handleSubmit}>
                <div className="p-8 space-y-5">
                    <FormRow label="Student Name">
                        <input className={inputCls} value={form.student} onChange={e => setForm({ ...form, student: e.target.value })} placeholder="e.g. Ethan Sterling" required />
                    </FormRow>
                    <div className="grid grid-cols-2 gap-4">
                        <FormRow label="Date">
                            <input type="date" className={inputCls} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
                        </FormRow>
                        <FormRow label="Time">
                            <input type="time" className={inputCls} value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
                        </FormRow>
                    </div>
                    <FormRow label="Reason / Diagnosis">
                        <input className={inputCls} value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} placeholder="e.g. Recurring Migraine" required />
                    </FormRow>
                    <div className="grid grid-cols-2 gap-4">
                        <FormRow label="Status">
                            <select className={selectCls} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                                <option>Completed</option>
                                <option>In Progress</option>
                                <option>Emergency</option>
                                <option>Referred</option>
                            </select>
                        </FormRow>
                        <FormRow label="Attending Staff">
                            <select className={selectCls} value={form.staff} onChange={e => setForm({ ...form, staff: e.target.value })}>
                                <option>Nurse Miller</option>
                                <option>Dr. Chen</option>
                                <option>Dr. Julian Vane</option>
                            </select>
                        </FormRow>
                    </div>
                </div>
                <div className="px-8 pb-8 flex gap-3">
                    <button type="button" onClick={onClose} className="flex-1 py-3 rounded-full border border-outline-variant/30 text-on-surface-variant font-bold text-sm hover:bg-surface-container transition-all">Cancel</button>
                    <button type="submit" className="flex-1 py-3 rounded-full bg-primary text-on-primary font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary-dim transition-all active:scale-95">
                        {isEdit ? 'Save Changes' : 'Log Visit'}
                    </button>
                </div>
            </form>
        </ModalShell>
    );
}

/* ─────────────────────────────────────────────────────────────
   ADD / EDIT MEDICINE MODAL
───────────────────────────────────────────────────────────── */
export function AddEditMedicineModal({ open, onClose, medicine = null }) {
    const isEdit = !!medicine;
    const [form, setForm] = useState({ name: '', quantity: '', category: '', expiryDate: '', threshold: '' });

    useEffect(() => {
        if (medicine) setForm({ name: medicine.name || '', quantity: medicine.quantity || '', category: medicine.category || '', expiryDate: medicine.expiryDate || '', threshold: medicine.threshold || '' });
        else setForm({ name: '', quantity: '', category: '', expiryDate: '', threshold: '' });
    }, [medicine, open]);

    const handleSubmit = (e) => { e.preventDefault(); alert(`${isEdit ? 'Updated' : 'Added'} medicine: ${form.name}`); onClose(); };

    return (
        <ModalShell open={open} onClose={onClose} maxWidth="max-w-lg">
            <ModalHeader icon={isEdit ? 'edit' : 'medication'} title={isEdit ? 'Edit Medicine' : 'Register New Stock'} subtitle="Manage pharmaceutical inventory entry" onClose={onClose} />
            <form onSubmit={handleSubmit}>
                <div className="p-8 space-y-5">
                    <FormRow label="Medicine Name">
                        <input className={inputCls} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Paracetamol 500mg" required />
                    </FormRow>
                    <div className="grid grid-cols-2 gap-4">
                        <FormRow label="Stock Quantity">
                            <input type="number" className={inputCls} value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} placeholder="0" required />
                        </FormRow>
                        <FormRow label="Low Stock Threshold">
                            <input type="number" className={inputCls} value={form.threshold} onChange={e => setForm({ ...form, threshold: e.target.value })} placeholder="e.g. 20" />
                        </FormRow>
                    </div>
                    <FormRow label="Category">
                        <select className={selectCls} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                            <option value="">Select category</option>
                            <option>Analgesic</option>
                            <option>Antibiotic</option>
                            <option>Antihistamine</option>
                            <option>Antiseptic</option>
                            <option>Antiviral</option>
                            <option>Vitamins & Supplements</option>
                            <option>Emergency Medication</option>
                        </select>
                    </FormRow>
                    <FormRow label="Expiration Date">
                        <input type="date" className={inputCls} value={form.expiryDate} onChange={e => setForm({ ...form, expiryDate: e.target.value })} />
                    </FormRow>
                </div>
                <div className="px-8 pb-8 flex gap-3">
                    <button type="button" onClick={onClose} className="flex-1 py-3 rounded-full border border-outline-variant/30 text-on-surface-variant font-bold text-sm hover:bg-surface-container transition-all">Cancel</button>
                    <button type="submit" className="flex-1 py-3 rounded-full bg-primary text-on-primary font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary-dim transition-all active:scale-95">
                        {isEdit ? 'Save Changes' : 'Add Medicine'}
                    </button>
                </div>
            </form>
        </ModalShell>
    );
}

/* ─────────────────────────────────────────────────────────────
   ADD / EDIT STAFF MODAL
───────────────────────────────────────────────────────────── */
export function AddEditStaffModal({ open, onClose, staff = null }) {
    const isEdit = !!staff;
    const [form, setForm] = useState({ name: '', role: '', username: '', email: '' });

    useEffect(() => {
        if (staff) setForm({ name: staff.name || '', role: staff.role || '', username: staff.username || '', email: staff.email || '' });
        else setForm({ name: '', role: '', username: '', email: '' });
    }, [staff, open]);

    const handleSubmit = (e) => { e.preventDefault(); alert(`${isEdit ? 'Updated' : 'Registered'} staff: ${form.name}`); onClose(); };

    return (
        <ModalShell open={open} onClose={onClose} maxWidth="max-w-lg">
            <ModalHeader icon={isEdit ? 'edit' : 'person_add'} title={isEdit ? 'Edit Staff Record' : 'Register New Staff'} subtitle="Manage clinical team member details" onClose={onClose} iconBg="bg-secondary-container/30" iconColor="text-secondary" />
            <form onSubmit={handleSubmit}>
                <div className="p-8 space-y-5">
                    <FormRow label="Full Name">
                        <input className={inputCls} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Dr. Julian Vane" required />
                    </FormRow>
                    <FormRow label="Email Address">
                        <input type="email" className={inputCls} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="e.g. j.vane@clinic.edu" />
                    </FormRow>
                    <div className="grid grid-cols-2 gap-4">
                        <FormRow label="Role">
                            <select className={selectCls} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} required>
                                <option value="">Select role</option>
                                <option>Doctor</option>
                                <option>Nurse</option>
                                <option>Pharmacist</option>
                                <option>Administrator</option>
                                <option>Medic</option>
                            </select>
                        </FormRow>
                        <FormRow label="Username">
                            <input className={inputCls} value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="e.g. j.vane_clin" required />
                        </FormRow>
                    </div>
                </div>
                <div className="px-8 pb-8 flex gap-3">
                    <button type="button" onClick={onClose} className="flex-1 py-3 rounded-full border border-outline-variant/30 text-on-surface-variant font-bold text-sm hover:bg-surface-container transition-all">Cancel</button>
                    <button type="submit" className="flex-1 py-3 rounded-full bg-primary text-on-primary font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary-dim transition-all active:scale-95">
                        {isEdit ? 'Save Changes' : 'Register Staff'}
                    </button>
                </div>
            </form>
        </ModalShell>
    );
}
