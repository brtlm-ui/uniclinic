import React from 'react';

const AddEditVisit = () => {
    return (
        <>
            

<aside className="fixed left-0 top-0 h-full w-72 overflow-hidden bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full py-8 space-y-2 z-50">
<div className="px-8 mb-12">
<h1 className="text-xl font-bold font-manrope text-slate-800 dark:text-slate-200">Clinical Serenity</h1>
<p className="text-xs text-on-surface-variant font-medium tracking-widest uppercase">Health Concierge</p>
</div>
<nav className="flex-1 space-y-1">
<a className="text-slate-500 dark:text-slate-400 mx-4 py-3 px-6 hover:translate-x-1 flex items-center gap-4 transition-all duration-300 font-inter text-sm font-semibold" href="#">
<span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
<span>Dashboard</span>
</a>
<a className="text-slate-500 dark:text-slate-400 mx-4 py-3 px-6 hover:translate-x-1 flex items-center gap-4 transition-all duration-300 font-inter text-sm font-semibold" href="#">
<span className="material-symbols-outlined" data-icon="group">group</span>
<span>Students</span>
</a>
<a className="bg-white dark:bg-slate-800 text-sky-700 dark:text-sky-300 shadow-sm rounded-full mx-4 py-3 px-6 flex items-center gap-4 font-inter text-sm font-semibold" href="#">
<span className="material-symbols-outlined" data-icon="event_note" style={{ fontVariationSettings: '\'FILL\' 1' }}>event_note</span>
<span>Visits</span>
</a>
<a className="text-slate-500 dark:text-slate-400 mx-4 py-3 px-6 hover:translate-x-1 flex items-center gap-4 transition-all duration-300 font-inter text-sm font-semibold" href="#">
<span className="material-symbols-outlined" data-icon="medical_services">medical_services</span>
<span>Treatments</span>
</a>
<a className="text-slate-500 dark:text-slate-400 mx-4 py-3 px-6 hover:translate-x-1 flex items-center gap-4 transition-all duration-300 font-inter text-sm font-semibold" href="#">
<span className="material-symbols-outlined" data-icon="medication">medication</span>
<span>Medicines</span>
</a>
<a className="text-slate-500 dark:text-slate-400 mx-4 py-3 px-6 hover:translate-x-1 flex items-center gap-4 transition-all duration-300 font-inter text-sm font-semibold" href="#">
<span className="material-symbols-outlined" data-icon="description">description</span>
<span>Prescriptions</span>
</a>
<a className="text-slate-500 dark:text-slate-400 mx-4 py-3 px-6 hover:translate-x-1 flex items-center gap-4 transition-all duration-300 font-inter text-sm font-semibold" href="#">
<span className="material-symbols-outlined" data-icon="assessment">assessment</span>
<span>Reports</span>
</a>
<a className="text-slate-500 dark:text-slate-400 mx-4 py-3 px-6 hover:translate-x-1 flex items-center gap-4 transition-all duration-300 font-inter text-sm font-semibold" href="#">
<span className="material-symbols-outlined" data-icon="badge">badge</span>
<span>Staff</span>
</a>
</nav>
<div className="px-4 mt-auto">
<a className="text-slate-500 dark:text-slate-400 mx-4 py-3 px-6 hover:translate-x-1 flex items-center gap-4 transition-all duration-300 font-inter text-sm font-semibold" href="#">
<span className="material-symbols-outlined" data-icon="logout">logout</span>
<span>Logout</span>
</a>
</div>
</aside>
<main className="flex-1 ml-72">

<header className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl docked full-width top-0 z-40 shadow-sm shadow-sky-900/5 flex justify-between items-center w-full px-8 py-4 h-20 sticky">
<div className="flex items-center gap-8">
<span className="text-2xl font-black font-manrope text-sky-700 dark:text-sky-300">UniClinic</span>
<div className="hidden md:flex gap-6">
<a className="text-sky-700 dark:text-sky-300 font-bold border-b-2 border-sky-600 transition-all duration-300" href="#">New Visit</a>
<a className="text-slate-500 dark:text-slate-400 font-medium hover:bg-slate-100/50 transition-all duration-300 px-2 rounded" href="#">Queue</a>
<a className="text-slate-500 dark:text-slate-400 font-medium hover:bg-slate-100/50 transition-all duration-300 px-2 rounded" href="#">History</a>
</div>
</div>
<div className="flex items-center gap-6">
<div className="relative group">
<button className="p-2 text-slate-500 hover:text-sky-600 transition-colors">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
</button>
<span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
</div>
<button className="p-2 text-slate-500 hover:text-sky-600 transition-colors">
<span className="material-symbols-outlined" data-icon="settings">settings</span>
</button>
<div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-sky-100">
<img className="w-full h-full object-cover" data-alt="professional portrait of a female nurse with a kind smile wearing white clinical attire in a bright office" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3HJiRRfm8r8vcK-_P5uIsrir5eQ11DGyyYgNplK7PaxlzVfcNpp1rqjy_fQc07wbQ8jbBxM7C9mwZlI60s9ZVtClS1wqcPCeYCTdf3X4OnOsxxyTkhAnabNnN77s7nUb1QR5egfP9khJmpPRbGdaK__urWGFCJSW6So7xaTPIBVNZuXAHNyVtJJuwl0QwvhLBYhLBf3BuV6qhVjZ0x1mlgdHVaok2IEjPy6uSz6HUamJu7mHjtjz4MLQh8p0IJ4iH8uXe5DPCLYs" />
</div>
</div>
</header>

<div className="max-w-6xl mx-auto px-8 py-16">
<div className="mb-12">
<h2 className="text-6xl font-extrabold font-headline tracking-tighter text-on-surface mb-2">Record Visit.</h2>
<p className="text-on-surface-variant text-lg">Detailed clinical documentation for school health assessment.</p>
</div>

<div className="grid grid-cols-12 gap-8 items-start">

<div className="col-span-12 lg:col-span-8 space-y-8">
<section className="bg-surface-container-lowest rounded-xl p-10 shadow-sm">
<div className="flex justify-between items-center mb-10">
<h3 className="text-xl font-bold font-headline flex items-center gap-3">
<span className="material-symbols-outlined text-primary" data-icon="clinical_notes">clinical_notes</span>
                                Clinical Details
                            </h3>
<span className="px-4 py-1.5 bg-tertiary-container text-on-tertiary-container rounded-full text-xs font-bold uppercase tracking-wider">Session ID: 4921-X</span>
</div>
<div className="space-y-10">

<div>
<label className="block text-sm font-bold text-on-surface-variant mb-3 uppercase tracking-widest">Reason for Visit</label>
<textarea className="w-full bg-surface-container-highest border-none rounded-lg focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/50 p-6 text-on-surface font-body" placeholder="Describe the primary complaint or reason for the student's arrival..." rows="3"></textarea>
</div>

<div>
<label className="block text-sm font-bold text-on-surface-variant mb-3 uppercase tracking-widest">Initial Diagnosis &amp; Observation</label>
<textarea className="w-full bg-surface-container-highest border-none rounded-lg focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/50 p-6 text-on-surface font-body" placeholder="Enter clinical observations, vital signs, and preliminary assessment..." rows="5"></textarea>
</div>
</div>
</section>
<div className="flex justify-end gap-4">
<button className="px-8 py-4 text-on-surface-variant font-semibold hover:bg-surface-container transition-colors rounded-full">Cancel</button>
<button className="px-10 py-4 bg-primary text-on-primary font-bold rounded-full shadow-lg shadow-primary/20 flex items-center gap-3 hover:scale-95 transition-transform duration-200">
<span className="material-symbols-outlined" data-icon="save" style={{ fontVariationSettings: '\'FILL\' 1' }}>save</span>
                            Complete Record
                        </button>
</div>
</div>

<div className="col-span-12 lg:col-span-4 space-y-8">

<div className="bg-surface-container-low rounded-xl p-8 space-y-8">
<div>
<label className="block text-sm font-bold text-on-surface-variant mb-3 uppercase tracking-widest">Student</label>
<div className="relative group">
<select className="w-full appearance-none bg-surface-container-lowest border-none rounded-lg py-4 pl-6 pr-12 focus:ring-2 focus:ring-primary/20 transition-all text-on-surface font-semibold cursor-pointer">
<option>Select Student</option>
<option>Benjamin Cooper (Gr. 10-A)</option>
<option>Elena Rodriguez (Gr. 8-B)</option>
<option>Marcus Wright (Gr. 12-C)</option>
</select>
<span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline" data-icon="expand_more">expand_more</span>
</div>
</div>
<div>
<label className="block text-sm font-bold text-on-surface-variant mb-3 uppercase tracking-widest">Attending Staff</label>
<div className="relative group">
<select className="w-full appearance-none bg-surface-container-lowest border-none rounded-lg py-4 pl-6 pr-12 focus:ring-2 focus:ring-primary/20 transition-all text-on-surface font-semibold cursor-pointer">
<option selected="">Nurse Sarah Miller</option>
<option>Dr. Julian Thorne</option>
<option>Nurse Lisa Chen</option>
</select>
<span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline" data-icon="expand_more">expand_more</span>
</div>
</div>
<div className="pt-4 space-y-4 border-t border-outline-variant/15">
<div className="flex justify-between items-center">
<span className="text-sm font-medium text-on-surface-variant">Date</span>
<span className="font-bold text-on-surface">Oct 24, 2023</span>
</div>
<div className="flex justify-between items-center">
<span className="text-sm font-medium text-on-surface-variant">Arrival Time</span>
<span className="font-bold text-on-surface">10:14 AM</span>
</div>
</div>
</div>

<div className="bg-surface-container-highest rounded-xl p-8">
<label className="block text-sm font-bold text-on-surface-variant mb-4 uppercase tracking-widest">Triage Status</label>
<div className="space-y-3">
<button className="w-full flex items-center justify-between p-4 bg-surface-container-lowest rounded-lg border-2 border-primary/40 shadow-sm">
<div className="flex items-center gap-3">
<span className="w-3 h-3 rounded-full bg-primary animate-pulse"></span>
<span className="font-bold text-primary">In-Consultation</span>
</div>
<span className="material-symbols-outlined text-primary" data-icon="check_circle" style={{ fontVariationSettings: '\'FILL\' 1' }}>check_circle</span>
</button>
<button className="w-full flex items-center justify-between p-4 bg-surface-container-lowest/50 rounded-lg hover:bg-surface-container-lowest transition-colors">
<div className="flex items-center gap-3">
<span className="w-3 h-3 rounded-full bg-error-container"></span>
<span className="font-bold text-on-surface-variant">Emergency Referral</span>
</div>
</button>
<button className="w-full flex items-center justify-between p-4 bg-surface-container-lowest/50 rounded-lg hover:bg-surface-container-lowest transition-colors">
<div className="flex items-center gap-3">
<span className="w-3 h-3 rounded-full bg-outline-variant"></span>
<span className="font-bold text-on-surface-variant">Observed &amp; Released</span>
</div>
</button>
</div>
</div>

<div className="h-64 rounded-xl overflow-hidden shadow-sm relative group">
<img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="clean and bright modern school clinic with white cabinets and soft blue accents creating a calming atmosphere" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvTk7n7uFfpu0i9xOSrLV_B1sZxMgo2Cjs5RfPYbVoNw6_Dng6hQvrsrEtWeyknUxj20zbYrMqQZ65ID-4cYuZ38A-iBvGCbEMIO3jLA1cwYfWcTexXvpygIvsXyr-vYqrR_la_o5A2G_QatS_Kxi_tHAN_30uL9Olb3W_8gz__GGPtQziIzK2_xaFFi7HhYIXVZ9uD0sZpXdWumO_6H3-wGpawqDOpjQj2ujkoABbUZckQ0GOv14bkoIYQU6MF7NGvkb508Lzv9M" />
<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
<p className="text-white text-sm font-medium">Facility Wing A - Station 02</p>
</div>
</div>
</div>
</div>
</div>
</main>

        </>
    );
};

export default AddEditVisit;
