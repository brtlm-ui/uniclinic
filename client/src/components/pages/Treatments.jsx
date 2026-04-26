import React from 'react';
import Sidebar from '../navbar/Sidebar';
import Header from '../navbar/Header';

const Treatments = () => {
    return (
        <>
            <Sidebar />
            <main className="ml-72 min-h-screen pt-0 pb-12">
                <Header hasSearch={true} searchPlaceholder="Search Treatment Records"/>
                <section className="px-8 pt-10 mb-20 flex justify-between items-end">
                    <div className="max-w-2xl">
                        <span className="text-primary font-bold tracking-widest text-xs uppercase mb-4 block">Medical Administration</span>
                        <h1 className="text-6xl font-extrabold tracking-tight text-on-surface leading-tight">
                            Treatment <br /> <span className="text-outline-variant/60 italic">Records</span>
                        </h1>
                        <p className="mt-8 text-on-surface-variant text-lg leading-relaxed font-medium">
                            Comprehensive log of all medical interventions, triage protocols, and supervised clinical administrations performed within the facility.
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-6">
                        <div className="flex -space-x-4">
                            <img className="w-14 h-14 rounded-full border-4 border-surface object-cover" data-alt="professional female doctor with stethoscope in clean medical setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC43f_KGDl_itounXx-ubVmYYNlfNzuLGQA4dQ8iQq6g2Hhw9zINFR_KA4D5IPhTylg8pgVaIdvXd_wuExUxCBgRxX-zeGG3Z_bz4umYaUKxUI_Z8gPc99Ps-GZLqJ_Pvj4afKPyUoVJ6clhkjOzgMj7I_oTmVs1kGMW2nK7ELAmtviSDbJb-gXpqrlUYC75AdLGBY5Vvon5uB8lJMrpF0K6J-AKFyZDezzuY_ayAqsfaZUJ0QdU62Aor9GybOgIqGdS0zeAbLlwDE" />
                            <img className="w-14 h-14 rounded-full border-4 border-surface object-cover" data-alt="confident male physician in white coat smiling in modern clinic" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBURo547Bki2RS8swMUBv-5gBiUpjo4JKy0w0NghRMCxzwHWQP1YKPoV86EA_KmeaKivOhypmixbQhdqr84XR0xzxktK7oy03HuSWgQsp8p3MuJ9NdjZUDJjZSo91IP6hOwj2Ct-33Xq2M01fIWhtAER0Ju4pFZY0uehG1Cdvwbl76DirOvKYnIfUDYZ29gZ3dHmqR1Qcf9f6U7G0KFAnYwZ54wOW95JgsxX_BArJfZ9KP5LBsO_5IuebmJg-P4Jf-4wXZSJ6rWLHI" />
                            <div className="w-14 h-14 rounded-full border-4 border-surface bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-sm">+4</div>
                        </div>
                        <button className="bg-primary text-on-primary px-10 py-4 rounded-full font-bold shadow-xl shadow-primary/20 flex items-center gap-3 active:scale-95 transition-all">
                            <span className="material-symbols-outlined">add</span>
                            New Record
                        </button>
                    </div>
                </section>

                <section className="px-8 grid grid-cols-12 gap-8 mb-16">
                    <div className="col-span-8 bg-surface-container-lowest rounded-xl p-10 flex items-center gap-12 shadow-sm">
                        <div className="h-32 w-32 rounded-full border-[10px] border-primary-fixed flex items-center justify-center">
                            <span className="text-3xl font-black text-primary">88%</span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Daily Completion</h3>
                            <p className="text-on-surface-variant max-w-sm">Treatment records updated within 1 hour of patient visit. Maintaining high clinical compliance.</p>
                        </div>
                    </div>
                    <div className="col-span-4 bg-tertiary-container rounded-xl p-10 flex flex-col justify-between text-on-tertiary-container">
                        <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: '\'FILL\' 1' }}>analytics</span>
                        <div>
                            <div className="text-4xl font-black">1,240</div>
                            <div className="font-bold opacity-80">Treatments This Month</div>
                        </div>
                    </div>
                </section>

                <div className="px-8 bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
                    <div className="p-8 flex justify-between items-center bg-surface-container-low/30">
                        <div className="relative w-96">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
                            <input className="w-full pl-12 pr-4 py-3 bg-surface rounded-full border-none focus:ring-2 focus:ring-primary/20 transition-all text-sm" placeholder="Search treatment logs..." type="text" />
                        </div>
                        <div className="flex gap-4">
                            <button className="p-3 rounded-full hover:bg-surface-variant transition-colors">
                                <span className="material-symbols-outlined text-on-surface-variant">filter_list</span>
                            </button>
                            <button className="p-3 rounded-full hover:bg-surface-variant transition-colors">
                                <span className="material-symbols-outlined text-on-surface-variant">download</span>
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-container-low/50">
                                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-outline">Treatment ID</th>
                                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-outline">Visit ID</th>
                                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-outline">Treatment Given</th>
                                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-outline">Notes</th>
                                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-outline text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-container">

                                <tr className="group hover:bg-surface-container-low transition-colors">
                                    <td className="px-8 py-6 font-bold text-primary">TR-8821</td>
                                    <td className="px-8 py-6 text-on-surface-variant font-mono text-sm">VST-44910</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-primary text-lg">medical_information</span>
                                            </div>
                                            <span className="font-bold">Nebulization Therapy</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-on-surface-variant max-w-xs truncate">Administered 2.5mg Albuterol via nebulizer for acute respiratory distress.</td>
                                    <td className="px-8 py-6 text-right">
                                        <span className="bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full text-xs font-bold">COMPLETED</span>
                                    </td>
                                </tr>

                                <tr className="group hover:bg-surface-container-low transition-colors">
                                    <td className="px-8 py-6 font-bold text-primary">TR-8822</td>
                                    <td className="px-8 py-6 text-on-surface-variant font-mono text-sm">VST-44912</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-tertiary-container/20 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-tertiary text-lg">healing</span>
                                            </div>
                                            <span className="font-bold">Wound Debridement</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-on-surface-variant max-w-xs truncate">Cleaned and dressed grade 2 abrasion on right knee. Applied sterile gauze.</td>
                                    <td className="px-8 py-6 text-right">
                                        <span className="bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full text-xs font-bold">COMPLETED</span>
                                    </td>
                                </tr>

                                <tr className="group hover:bg-surface-container-low transition-colors">
                                    <td className="px-8 py-6 font-bold text-primary">TR-8823</td>
                                    <td className="px-8 py-6 text-on-surface-variant font-mono text-sm">VST-44915</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-error-container/10 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-error text-lg">emergency</span>
                                            </div>
                                            <span className="font-bold">Anaphylaxis Protocol</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-on-surface-variant max-w-xs truncate">Emergency EpiPen injection (0.3mg) followed by antihistamines. 911 called.</td>
                                    <td className="px-8 py-6 text-right">
                                        <span className="bg-error-container text-on-error-container px-4 py-1.5 rounded-full text-xs font-bold">URGENT</span>
                                    </td>
                                </tr>

                                <tr className="group hover:bg-surface-container-low transition-colors">
                                    <td className="px-8 py-6 font-bold text-primary">TR-8824</td>
                                    <td className="px-8 py-6 text-on-surface-variant font-mono text-sm">VST-44918</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-primary text-lg">thermometer</span>
                                            </div>
                                            <span className="font-bold">Fever Management</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-on-surface-variant max-w-xs truncate">Acetaminophen 500mg provided. Student monitored in recovery room.</td>
                                    <td className="px-8 py-6 text-right">
                                        <span className="bg-surface-variant text-on-surface-variant px-4 py-1.5 rounded-full text-xs font-bold">PENDING</span>
                                    </td>
                                </tr>

                                <tr className="group hover:bg-surface-container-low transition-colors">
                                    <td className="px-8 py-6 font-bold text-primary">TR-8825</td>
                                    <td className="px-8 py-6 text-on-surface-variant font-mono text-sm">VST-44921</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-tertiary-container/20 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-tertiary text-lg">pill</span>
                                            </div>
                                            <span className="font-bold">Insulin Injection</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-on-surface-variant max-w-xs truncate">Supervised self-administration of 4 units Humalog as per meal plan.</td>
                                    <td className="px-8 py-6 text-right">
                                        <span className="bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full text-xs font-bold">COMPLETED</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="p-8 border-t border-surface-container flex justify-between items-center">
                        <span className="text-sm font-medium text-on-surface-variant">Showing 5 of 1,240 records</span>
                        <div className="flex gap-2">
                            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-variant text-on-surface transition-colors">
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-on-primary font-bold shadow-md">1</button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-variant text-on-surface transition-colors">2</button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-variant text-on-surface transition-colors">3</button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-variant text-on-surface transition-colors">
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>

                <section className="px-8 mt-20 grid grid-cols-2 gap-12">
                    <div className="relative overflow-hidden rounded-xl h-80 group">
                        <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="clean bright medical office with modern equipment and natural light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMVTf6Ppj5T8tKS6Z3iKpBETEuYOL8ZouT3Bq2PqneigqxGTTE-vcEj4pjvoXPHoi4oKO9jSg8e0tLf8tFAVMfvpdIVBWyitUll4jxPTAONbLUDDsWi2ykCzq9pk5Gr4Brq5L2hNdXVLx5ChHaS8-hwWyVwsMR7lThLOOkulFpDp_eIBQdZLceDrRwuQKQO15HycNB8S9xR9C1K0JS4F5yDqX5fdNyGEYB9VrUpYFWtqUQYRL0fPrqWuTcvithV790eXUjR953sGQ" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-10 flex flex-col justify-end">
                            <h4 className="text-white text-2xl font-bold mb-2">Clinic Best Practices</h4>
                            <p className="text-white/70">Review the updated 2024 protocols for treatment documentation and patient privacy.</p>
                        </div>
                    </div>
                    <div className="bg-primary-container/10 rounded-xl p-10 border border-primary-container/20">
                        <div className="flex items-center gap-4 mb-6 text-primary">
                            <span className="material-symbols-outlined text-4xl">verified_user</span>
                            <h4 className="text-2xl font-bold">Compliance Audit</h4>
                        </div>
                        <p className="text-on-surface-variant leading-relaxed mb-8">
                            Your records are currently 100% compliant with the state healthcare standards for educational institutions. Your last audit was 4 days ago.
                        </p>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-3 bg-surface-container rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full w-full"></div>
                            </div>
                            <span className="font-bold text-primary">Excellent</span>
                        </div>
                    </div>
                </section>
            </main>

        </>
    );
};

export default Treatments;
