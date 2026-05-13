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
export function AddEditStudentModal({ open, onClose, student = null, onSubmit }) {
    const isEdit = !!student;
    const [form, setForm] = useState({ student_number: '', first_name: '', last_name: '', course: '', year_level: '' });

    useEffect(() => {
        if (student) setForm({ student_number: student.student_number || '', first_name: student.first_name || '', last_name: student.last_name || '', course: student.course || '', year_level: student.year_level || '' });
        else setForm({ student_number: '', first_name: '', last_name: '', course: '', year_level: '' });
    }, [student, open]);

    const handleSubmit = (e) => { e.preventDefault(); onSubmit?.(form); onClose(); };

    return (
        <ModalShell open={open} onClose={onClose} maxWidth="max-w-lg">
            <ModalHeader icon={isEdit ? 'edit' : 'person_add'} title={isEdit ? 'Edit Student Record' : 'New Student Record'} subtitle="Fill in the student information below" onClose={onClose} />
            <form onSubmit={handleSubmit}>
                <div className="p-8 space-y-5">
                    <FormRow label="Student Number">
                        <input className={inputCls} value={form.student_number} onChange={e => setForm({ ...form, student_number: e.target.value })} placeholder="e.g. 2024-00122" required />
                    </FormRow>
                    <div className="grid grid-cols-2 gap-4">
                        <FormRow label="First Name">
                            <input className={inputCls} value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} placeholder="e.g. Elena" required />
                        </FormRow>
                        <FormRow label="Last Name">
                            <input className={inputCls} value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} placeholder="e.g. Marasigan" required />
                        </FormRow>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <FormRow label="Course">
                            <select className={selectCls} value={form.course} onChange={e => setForm({ ...form, course: e.target.value })} required>
                                <option value="">Select course</option>
                                <option>B.S. Nursing</option>
                                <option>B.S. Computer Science</option>
                                <option>B.S. Information Technology</option>
                                <option>B.S. Architecture</option>
                                <option>B.A. Communication</option>
                                <option>B.S. Business Administration</option>
                            </select>
                        </FormRow>
                        <FormRow label="Year Level">
                            <select className={selectCls} value={form.year_level} onChange={e => setForm({ ...form, year_level: e.target.value })} required>
                                <option value="">Select year</option>
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3">3rd Year</option>
                                <option value="4">4th Year</option>
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
export function AddEditVisitModal({ open, onClose, visit = null, onSubmit, students = [], staff = [] }) {
    const isEdit = !!visit;
    const [form, setForm] = useState({ student_id: '', staff_id: '', visit_date: '', visit_time: '', reason: '', diagnosis: '', status: 'ongoing' });

    useEffect(() => {
        if (visit) setForm({ student_id: visit.student_id || '', staff_id: visit.staff_id || '', visit_date: visit.visit_date?.slice(0, 10) || '', visit_time: visit.visit_time || '', reason: visit.reason || '', diagnosis: visit.diagnosis || '', status: visit.status || 'ongoing' });
        else setForm({ student_id: '', staff_id: '', visit_date: '', visit_time: '', reason: '', diagnosis: '', status: 'ongoing' });
    }, [visit, open]);

    const handleSubmit = (e) => { e.preventDefault(); onSubmit?.(form); onClose(); };

    return (
        <ModalShell open={open} onClose={onClose} maxWidth="max-w-lg">
            <ModalHeader icon={isEdit ? 'edit' : 'add_circle'} title={isEdit ? 'Edit Visit Record' : 'Log New Visit'} subtitle="Record clinic visit details below" onClose={onClose} />
            <form onSubmit={handleSubmit}>
                <div className="p-8 space-y-5">
                    <FormRow label="Student">
                        <select className={selectCls} value={form.student_id} onChange={e => setForm({ ...form, student_id: e.target.value })} required>
                            <option value="">Select student</option>
                            {students.map(s => (
                                <option key={s.student_id} value={s.student_id}>{s.first_name} {s.last_name} — {s.student_number}</option>
                            ))}
                        </select>
                    </FormRow>
                    <div className="grid grid-cols-2 gap-4">
                        <FormRow label="Date">
                            <input type="date" className={inputCls} value={form.visit_date} onChange={e => setForm({ ...form, visit_date: e.target.value })} required />
                        </FormRow>
                        <FormRow label="Time">
                            <input type="time" className={inputCls} value={form.visit_time} onChange={e => setForm({ ...form, visit_time: e.target.value })} />
                        </FormRow>
                    </div>
                    <FormRow label="Reason">
                        <input className={inputCls} value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} placeholder="e.g. Recurring Migraine" required />
                    </FormRow>
                    <FormRow label="Diagnosis">
                        <input className={inputCls} value={form.diagnosis} onChange={e => setForm({ ...form, diagnosis: e.target.value })} placeholder="e.g. Mild Dehydration" />
                    </FormRow>
                    <div className="grid grid-cols-2 gap-4">
                        <FormRow label="Status">
                            <select className={selectCls} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                                <option value="ongoing">Ongoing</option>
                                <option value="completed">Completed</option>
                            </select>
                        </FormRow>
                        <FormRow label="Attending Staff">
                            <select className={selectCls} value={form.staff_id} onChange={e => setForm({ ...form, staff_id: e.target.value })}>
                                <option value="">Select staff</option>
                                {staff.map(s => (
                                    <option key={s.staff_id} value={s.staff_id}>{s.name} ({s.role})</option>
                                ))}
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
export function AddEditMedicineModal({ open, onClose, medicine = null, onSubmit }) {
    const isEdit = !!medicine;
    const [form, setForm] = useState({ name: '', stock_quantity: '', expiration_date: '' });

    useEffect(() => {
        if (medicine) setForm({ name: medicine.name || '', stock_quantity: medicine.stock_quantity || '', expiration_date: medicine.expiration_date || '' });
        else setForm({ name: '', stock_quantity: '', expiration_date: '' });
    }, [medicine, open]);

    const handleSubmit = (e) => { e.preventDefault(); onSubmit?.(form); onClose(); };

    return (
        <ModalShell open={open} onClose={onClose} maxWidth="max-w-lg">
            <ModalHeader icon={isEdit ? 'edit' : 'medication'} title={isEdit ? 'Edit Medicine' : 'Register New Stock'} subtitle="Manage pharmaceutical inventory entry" onClose={onClose} />
            <form onSubmit={handleSubmit}>
                <div className="p-8 space-y-5">
                    <FormRow label="Medicine Name">
                        <input className={inputCls} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Paracetamol 500mg" required />
                    </FormRow>
                    <FormRow label="Stock Quantity">
                        <input type="number" className={inputCls} value={form.stock_quantity} onChange={e => setForm({ ...form, stock_quantity: e.target.value })} placeholder="0" required />
                    </FormRow>
                    <FormRow label="Expiration Date">
                        <input type="date" className={inputCls} value={form.expiration_date} onChange={e => setForm({ ...form, expiration_date: e.target.value })} />
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
export function AddEditStaffModal({ open, onClose, staff = null, onSubmit }) {
    const isEdit = !!staff;
    const [form, setForm] = useState({ name: '', role: '', username: '', password: '' });

    useEffect(() => {
        if (staff) setForm({ name: staff.name || '', role: staff.role || '', username: staff.username || '', password: '' });
        else setForm({ name: '', role: '', username: '', password: '' });
    }, [staff, open]);

    const handleSubmit = (e) => { e.preventDefault(); onSubmit?.(form); onClose(); };

    return (
        <ModalShell open={open} onClose={onClose} maxWidth="max-w-lg">
            <ModalHeader icon={isEdit ? 'edit' : 'person_add'} title={isEdit ? 'Edit Staff Record' : 'Register New Staff'} subtitle="Manage clinical team member details" onClose={onClose} iconBg="bg-secondary-container/30" iconColor="text-secondary" />
            <form onSubmit={handleSubmit}>
                <div className="p-8 space-y-5">
                    <FormRow label="Full Name">
                        <input className={inputCls} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Dr. Julian Vane" required />
                    </FormRow>
                    <div className="grid grid-cols-2 gap-4">
                        <FormRow label="Role">
                            <select className={selectCls} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} required>
                                <option value="">Select role</option>
                                <option value="doctor">Doctor</option>
                                <option value="nurse">Nurse</option>
                                <option value="admin">Administrator</option>
                            </select>
                        </FormRow>
                        <FormRow label="Username">
                            <input className={inputCls} value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="e.g. j.vane_clin" required />
                        </FormRow>
                    </div>
                    {!isEdit && (
                        <FormRow label="Password">
                            <input type="password" className={inputCls} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min. 6 characters" required />
                        </FormRow>
                    )}
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

/* ─────────────────────────────────────────────────────────────
   ADD / EDIT TREATMENT MODAL
───────────────────────────────────────────────────────────── */
export function AddEditTreatmentModal({ open, onClose, treatment = null, visits = [], onSubmit }) {
    const isEdit = !!treatment;
    const [form, setForm] = useState({ visit_id: '', treatment_given: '', notes: '' });
    useEffect(() => {
        if (treatment) setForm({ visit_id: treatment.visit_id ?? '', treatment_given: treatment.treatment_given ?? '', notes: treatment.notes ?? '' });
        else setForm({ visit_id: '', treatment_given: '', notes: '' });
    }, [treatment, open]);
    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
    const handleSubmit = (e) => { e.preventDefault(); onSubmit?.(form); onClose(); };
    return (
        <ModalShell open={open} onClose={onClose} maxWidth="max-w-lg">
            <ModalHeader icon="healing" title={isEdit ? 'Edit Treatment Record' : 'New Treatment Record'} subtitle="Fill in the treatment details below" onClose={onClose} />
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
                <div>
                    <label className="block text-sm font-semibold text-on-surface-variant mb-2">Select Visit</label>
                    <select 
                        className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 transition-all text-sm appearance-none" 
                        value={form.visit_id} 
                        onChange={set('visit_id')} 
                        required
                    >
                        <option value="">Select visit</option>
                        {visits.map(v => (
                            <option key={v.visit_id} value={v.visit_id}>
                                {v.student_name} — {new Date(v.visit_date).toLocaleDateString()}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-on-surface-variant mb-2">Treatment Given</label>
                    <input className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 transition-all text-sm" value={form.treatment_given} onChange={set('treatment_given')} required placeholder="e.g. Nebulization Therapy" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-on-surface-variant mb-2">Notes</label>
                    <textarea className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 transition-all text-sm resize-none" rows={3} value={form.notes} onChange={set('notes')} placeholder="Clinical notes..." />
                </div>
                <div className="flex gap-3 pt-2">
                    <button type="button" onClick={onClose} className="flex-1 py-3 rounded-full border border-outline-variant/30 text-on-surface-variant font-bold text-sm hover:bg-surface-container transition-all">Cancel</button>
                    <button type="submit" className="flex-1 py-3 rounded-full bg-primary text-on-primary font-bold text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all">{isEdit ? 'Save Changes' : 'Add Record'}</button>
                </div>
            </form>
        </ModalShell>
    );
}
