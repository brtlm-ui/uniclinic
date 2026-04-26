import React from 'react';
import Sidebar from '../navbar/Sidebar';
import Header from '../navbar/Header';

const Reports = () => {
  return (
    <>
      <Sidebar />
      <main className="ml-72 min-h-screen pt-0 pb-16">
        <Header />
        <section className="px-8 pt-10 flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-on-surface-variant font-headline text-lg font-bold tracking-widest uppercase mb-4">Analytical Insights</h2>
            <h3 className="text-6xl font-headline font-extrabold text-on-surface tracking-tighter leading-none mb-6">Clinic performance &amp; health trends.</h3>
            <p className="text-on-surface-variant font-body text-lg leading-relaxed">Review comprehensive clinical data across student visits, pharmaceutical consumption, and diagnostic frequency to optimize school health services.</p>
          </div>

          <div className="bg-surface-container-low p-2 rounded-full flex items-center shadow-sm">
            <div className="flex items-center px-6 py-3 bg-surface-container-lowest rounded-full shadow-sm text-primary font-semibold">
              <span className="material-symbols-outlined mr-2 text-xl" data-icon="calendar_today">calendar_today</span>
              <span className="text-sm">Oct 01, 2023 — Oct 31, 2023</span>
            </div>
            <button className="p-3 ml-2 hover:bg-surface-variant rounded-full transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant" data-icon="tune">tune</span>
            </button>
          </div>
        </section>

        <section className="px-8 grid grid-cols-12 gap-8 mb-16">

          <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-xl p-10 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-12">
              <div>
                <h4 className="font-headline text-2xl font-bold text-on-surface mb-1">Daily Patient Volume</h4>
                <p className="text-on-surface-variant text-sm font-medium">Monitoring clinic footfall over the last 30 days</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-primary rounded-full mr-2"></span>
                  <span className="text-xs font-bold text-on-surface-variant">AVERAGE: 24</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-tertiary-container rounded-full mr-2"></span>
                  <span className="text-xs font-bold text-on-surface-variant">PEAK: 42</span>
                </div>
              </div>
            </div>

            <div className="h-64 flex items-end justify-between gap-1">
              <div className="w-full bg-primary/10 rounded-t-lg h-[40%]" title="Day 1"></div>
              <div className="w-full bg-primary/10 rounded-t-lg h-[55%]" title="Day 2"></div>
              <div className="w-full bg-primary/20 rounded-t-lg h-[30%]" title="Day 3"></div>
              <div className="w-full bg-primary/10 rounded-t-lg h-[65%]" title="Day 4"></div>
              <div className="w-full bg-primary rounded-t-lg h-[90%]" title="Day 5 - Peak"></div>
              <div className="w-full bg-primary/10 rounded-t-lg h-[45%]" title="Day 6"></div>
              <div className="w-full bg-primary/10 rounded-t-lg h-[35%]" title="Day 7"></div>
              <div className="w-full bg-primary/15 rounded-t-lg h-[50%]" title="Day 8"></div>
              <div className="w-full bg-primary/10 rounded-t-lg h-[60%]" title="Day 9"></div>
              <div className="w-full bg-primary/10 rounded-t-lg h-[25%]" title="Day 10"></div>
              <div className="w-full bg-primary/10 rounded-t-lg h-[75%]" title="Day 11"></div>
              <div className="w-full bg-primary/10 rounded-t-lg h-[55%]" title="Day 12"></div>
              <div className="w-full bg-primary/10 rounded-t-lg h-[40%]" title="Day 13"></div>
              <div className="w-full bg-primary/10 rounded-t-lg h-[45%]" title="Day 14"></div>
              <div className="w-full bg-primary/10 rounded-t-lg h-[30%]" title="Day 15"></div>
              <div className="w-full bg-primary rounded-t-lg h-[85%]" title="Day 16"></div>
              <div className="w-full bg-primary/10 rounded-t-lg h-[60%]" title="Day 17"></div>
              <div className="w-full bg-primary/10 rounded-t-lg h-[50%]" title="Day 18"></div>
              <div className="w-full bg-primary/10 rounded-t-lg h-[40%]" title="Day 19"></div>
              <div className="w-full bg-primary/10 rounded-t-lg h-[70%]" title="Day 20"></div>
            </div>
            <div className="flex justify-between mt-4 text-[10px] font-bold text-outline uppercase tracking-widest">
              <span>Oct 01</span>
              <span>Oct 10</span>
              <span>Oct 20</span>
              <span>Oct 30</span>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
            <div className="flex-1 bg-primary text-on-primary rounded-xl p-8 flex flex-col justify-between shadow-xl shadow-primary/10">
              <span className="material-symbols-outlined text-4xl" data-icon="medical_information">medical_information</span>
              <div>
                <h5 className="text-4xl font-headline font-extrabold mb-1">724</h5>
                <p className="text-on-primary/70 text-sm font-semibold uppercase tracking-wider">Total Consultations</p>
              </div>
            </div>
            <div className="flex-1 bg-tertiary-container text-on-tertiary-container rounded-xl p-8 flex flex-col justify-between">
              <span className="material-symbols-outlined text-4xl" data-icon="medication_liquid">medication_liquid</span>
              <div>
                <h5 className="text-4xl font-headline font-extrabold mb-1">1,208</h5>
                <p className="text-on-tertiary-container/70 text-sm font-semibold uppercase tracking-wider">Units Dispensed</p>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-6 bg-surface-container-lowest rounded-xl p-10 shadow-sm">
            <h4 className="font-headline text-2xl font-bold text-on-surface mb-8">Top Diagnoses</h4>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center mr-4">
                    <span className="material-symbols-outlined text-on-secondary-container text-xl" data-icon="thermometer">thermometer</span>
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">Seasonal Influenza</p>
                    <p className="text-xs text-on-surface-variant font-medium">142 Cases Reported</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block font-bold text-primary">28%</span>
                  <div className="w-24 h-1.5 bg-surface-variant rounded-full mt-1">
                    <div className="w-[28%] h-full bg-primary rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center mr-4">
                    <span className="material-symbols-outlined text-on-secondary-container text-xl" data-icon="healing">healing</span>
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">Minor Lacerations</p>
                    <p className="text-xs text-on-surface-variant font-medium">98 Cases Reported</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block font-bold text-primary">19%</span>
                  <div className="w-24 h-1.5 bg-surface-variant rounded-full mt-1">
                    <div className="w-[19%] h-full bg-primary rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center mr-4">
                    <span className="material-symbols-outlined text-on-secondary-container text-xl" data-icon="stomach">gastroenterology</span>
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">Abdominal Pain</p>
                    <p className="text-xs text-on-surface-variant font-medium">64 Cases Reported</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block font-bold text-primary">12%</span>
                  <div className="w-24 h-1.5 bg-surface-variant rounded-full mt-1">
                    <div className="w-[12%] h-full bg-primary rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-6 bg-surface-container-lowest rounded-xl p-10 shadow-sm border border-outline-variant/10">
            <h4 className="font-headline text-2xl font-bold text-on-surface mb-8">Stock Utilization</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-surface-variant">
                    <th className="pb-4 font-headline text-xs font-bold text-outline-variant uppercase tracking-widest">Medication</th>
                    <th className="pb-4 font-headline text-xs font-bold text-outline-variant uppercase tracking-widest">Volume</th>
                    <th className="pb-4 font-headline text-xs font-bold text-outline-variant uppercase tracking-widest">Trend</th>
                  </tr>
                </thead>
                <tbody className="font-body text-sm">
                  <tr>
                    <td className="py-5 font-semibold text-on-surface">Paracetamol 500mg</td>
                    <td className="py-5 text-on-surface-variant">420 tabs</td>
                    <td className="py-5">
                      <span className="inline-flex items-center text-error font-bold">
                        <span className="material-symbols-outlined text-sm mr-1" data-icon="trending_up">trending_up</span>
                        12%
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-5 font-semibold text-on-surface">Amoxicillin Syrup</td>
                    <td className="py-5 text-on-surface-variant">85 units</td>
                    <td className="py-5">
                      <span className="inline-flex items-center text-primary font-bold">
                        <span className="material-symbols-outlined text-sm mr-1" data-icon="trending_down">trending_down</span>
                        4%
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-5 font-semibold text-on-surface">Ibuprofen 200mg</td>
                    <td className="py-5 text-on-surface-variant">310 tabs</td>
                    <td className="py-5">
                      <span className="inline-flex items-center text-on-surface-variant font-bold">
                        <span className="material-symbols-outlined text-sm mr-1" data-icon="horizontal_rule">horizontal_rule</span>
                        0%
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-5 font-semibold text-on-surface">Cetirizine Liquid</td>
                    <td className="py-5 text-on-surface-variant">42 units</td>
                    <td className="py-5">
                      <span className="inline-flex items-center text-error font-bold">
                        <span className="material-symbols-outlined text-sm mr-1" data-icon="trending_up">trending_up</span>
                        22%
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="mx-8 mb-8 bg-surface-container-high rounded-xl p-12 overflow-hidden relative">
          <div className="relative z-10 max-w-lg">
            <h4 className="font-headline text-3xl font-bold text-on-surface mb-4">Critical Stock Alert</h4>
            <p className="text-on-surface-variant font-body mb-8">Supply levels for "Epinephrine Auto-Injectors" have dropped below the safety threshold. Recommend immediate requisition before the winter season begins.</p>
            <button className="bg-primary text-on-primary px-8 py-4 rounded-full font-bold text-sm shadow-lg shadow-primary/20 flex items-center group">
              Order Supplies
              <span className="material-symbols-outlined ml-3 group-hover:translate-x-1 transition-transform" data-icon="arrow_forward">arrow_forward</span>
            </button>
          </div>

          <div className="absolute top-0 right-0 h-full w-1/3 overflow-hidden opacity-50 pointer-events-none">
            <img className="h-full w-full object-cover" data-alt="abstract close-up of blue medical glass vials and scientific equipment with soft bokeh and clean medical aesthetics" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiwCW0CJwg3w-3ZCGUajuBrxn0bKxwtuOBFtcRkF9UonOnCCWxAkRnwhG2d34D6-87nlakytRuGL5OF1NO4kYUj7abWCwThNHiGd6l-sSs1TrIOYkVHRJzDwBhSxX7skCusR7mOZCVTyUPrpOF3fbO6GZUDXlHX4mg95MbRxBuI-EoMiSo0FzfeGt3TPME9HGVAf9xNrV8H2JF_SEIhd_mLVkV4MmOYW-6e57f_7M1GP_pg3g2wBv744a1bg1OUL-BCAK5mjgKJbY" />
          </div>
        </section>
      </main>

      <button className="fixed bottom-12 right-12 w-20 h-20 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform z-50">
        <span className="material-symbols-outlined text-3xl" data-icon="picture_as_pdf">picture_as_pdf</span>
      </button>

    </>
  );
};

export default Reports;
