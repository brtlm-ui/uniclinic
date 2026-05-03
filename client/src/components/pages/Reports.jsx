import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../navbar/Sidebar';
import Header from '../navbar/Header';
import { config, endpoints } from '../config/config';

const Reports = () => {
    const [visits, setVisits] = useState([]);
    const [medStats, setMedStats] = useState([]);
    const [dashSummary, setDashSummary] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [vRes, mRes, dRes] = await Promise.all([
                    axios.get(`${config.uniClinicAPI}${endpoints.statistics.visits}`),
                    axios.get(`${config.uniClinicAPI}${endpoints.statistics.medicines}`),
                    axios.get(`${config.uniClinicAPI}${endpoints.statistics.dashboard}`),
                ]);
                setVisits(vRes.data);
                setMedStats(mRes.data);
                setDashSummary(dRes.data);
            } catch (err) {
                console.error('Failed to load report data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    // ── Date range: last 30 days ──────────────────────────────────────────────
    const today = new Date();
    const last30 = Array.from({ length: 30 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (29 - i));
        return d.toISOString().slice(0, 10);
    });
    const fmtLabel = (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: '2-digit' });

    // ── Daily volume ──────────────────────────────────────────────────────────
    const dailyCounts = last30.map(date => ({
        date,
        count: visits.filter(v => v.visit_date?.slice(0, 10) === date).length,
    }));
    const maxCount = Math.max(...dailyCounts.map(d => d.count), 1);
    const avgCount = Math.round(dailyCounts.reduce((s, d) => s + d.count, 0) / 30);

    // ── Summary stats from server aggregation ────────────────────────────────
    const totalConsultations = Number(dashSummary.total_visits) || 0;
    const unitsDispensed     = medStats.reduce((s, m) => s + (Number(m.total_dispensed) || 0), 0);
    const lowStockCount      = Number(dashSummary.low_stock_count) || 0;

    // ── Top reasons for visit ─────────────────────────────────────────────────
    const reasonTally = {};
    visits.forEach(v => {
        const r = (v.reason || '').trim();
        if (r) reasonTally[r] = (reasonTally[r] || 0) + 1;
    });
    const topDiagnoses = Object.entries(reasonTally)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name, count]) => ({
            name,
            count,
            pct: totalConsultations > 0 ? Math.round((count / totalConsultations) * 100) : 0,
        }));

    // ── Top prescribed medicines — from server-aggregated medicine stats ──────
    const topMeds = [...medStats]
        .filter(m => m.total_dispensed > 0)
        .sort((a, b) => b.total_dispensed - a.total_dispensed)
        .slice(0, 4)
        .map(m => ({ name: m.medicine_name, volume: Number(m.total_dispensed) }));

    // ── Critical stock alert — lowest stock from medicine stats ──────────────
    const criticalMed = [...medStats]
        .filter(m => m.stock_quantity !== null && m.stock_quantity !== undefined)
        .sort((a, b) => a.stock_quantity - b.stock_quantity)[0];

    if (loading) {
        return (
            <>
                <Sidebar />
                <main className="ml-72 min-h-screen flex items-center justify-center">
                    <span className="text-on-surface-variant text-lg">Loading report data...</span>
                </main>
            </>
        );
    }

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
              <span className="material-symbols-outlined mr-2 text-xl">calendar_today</span>
              <span className="text-sm">{fmtLabel(last30[0])}, {today.getFullYear()} — {fmtLabel(last30[29])}, {today.getFullYear()}</span>
            </div>
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
                  <span className="text-xs font-bold text-on-surface-variant">AVERAGE: {avgCount}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-tertiary-container rounded-full mr-2"></span>
                  <span className="text-xs font-bold text-on-surface-variant">PEAK: {maxCount}</span>
                </div>
              </div>
            </div>

            <div className="h-64 flex items-end justify-between gap-1">
              {dailyCounts.map(({ date, count }) => {
                const heightPct = Math.max(4, Math.round((count / maxCount) * 100));
                const isMax = count === maxCount && count > 0;
                return (
                  <div
                    key={date}
                    className={`w-full rounded-t-lg transition-all ${isMax ? 'bg-primary' : count > 0 ? 'bg-primary/30' : 'bg-surface-container'}`}
                    style={{ height: `${heightPct}%` }}
                    title={`${fmtLabel(date)}: ${count} visit${count !== 1 ? 's' : ''}`}
                  />
                );
              })}
            </div>
            <div className="flex justify-between mt-4 text-[10px] font-bold text-outline uppercase tracking-widest">
              <span>{fmtLabel(last30[0])}</span>
              <span>{fmtLabel(last30[9])}</span>
              <span>{fmtLabel(last30[19])}</span>
              <span>{fmtLabel(last30[29])}</span>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
            <div className="flex-1 bg-primary text-on-primary rounded-xl p-8 flex flex-col justify-between shadow-xl shadow-primary/10">
              <span className="material-symbols-outlined text-4xl">medical_information</span>
              <div>
                <h5 className="text-4xl font-headline font-extrabold mb-1">{totalConsultations.toLocaleString()}</h5>
                <p className="text-on-primary/70 text-sm font-semibold uppercase tracking-wider">Total Consultations</p>
              </div>
            </div>
            <div className="flex-1 bg-tertiary-container text-on-tertiary-container rounded-xl p-8 flex flex-col justify-between">
              <span className="material-symbols-outlined text-4xl">medication_liquid</span>
              <div>
                <h5 className="text-4xl font-headline font-extrabold mb-1">{unitsDispensed.toLocaleString()}</h5>
                <p className="text-on-tertiary-container/70 text-sm font-semibold uppercase tracking-wider">Units Dispensed</p>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-6 bg-surface-container-lowest rounded-xl p-10 shadow-sm">
            <h4 className="font-headline text-2xl font-bold text-on-surface mb-8">Top Reasons for Visit</h4>
            {topDiagnoses.length === 0 ? (
              <p className="text-on-surface-variant text-sm">No visit data available.</p>
            ) : (
              <div className="space-y-6">
                {topDiagnoses.map(({ name, count, pct }) => (
                  <div key={name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center mr-4 flex-shrink-0">
                        <span className="material-symbols-outlined text-on-secondary-container text-xl">stethoscope</span>
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">{name}</p>
                        <p className="text-xs text-on-surface-variant font-medium">{count} Case{count !== 1 ? 's' : ''} Reported</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <span className="block font-bold text-primary">{pct}%</span>
                      <div className="w-24 h-1.5 bg-surface-variant rounded-full mt-1">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="col-span-12 md:col-span-6 bg-surface-container-lowest rounded-xl p-10 shadow-sm border border-outline-variant/10">
            <h4 className="font-headline text-2xl font-bold text-on-surface mb-8">Stock Utilization</h4>
            {topMeds.length === 0 ? (
              <p className="text-on-surface-variant text-sm">No prescription data available.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-surface-variant">
                      <th className="pb-4 font-headline text-xs font-bold text-outline-variant uppercase tracking-widest">Medication</th>
                      <th className="pb-4 font-headline text-xs font-bold text-outline-variant uppercase tracking-widest">Volume</th>
                      <th className="pb-4 font-headline text-xs font-bold text-outline-variant uppercase tracking-widest">Share</th>
                    </tr>
                  </thead>
                  <tbody className="font-body text-sm">
                    {topMeds.map(({ name, volume }) => {
                      const pct = unitsDispensed > 0 ? Math.round((volume / unitsDispensed) * 100) : 0;
                      return (
                        <tr key={name}>
                          <td className="py-5 font-semibold text-on-surface">{name}</td>
                          <td className="py-5 text-on-surface-variant">{volume.toLocaleString()} units</td>
                          <td className="py-5">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-surface-variant rounded-full">
                                <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }}></div>
                              </div>
                              <span className="text-xs font-bold text-primary">{pct}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <section className="mx-8 mb-8 bg-surface-container-high rounded-xl p-12 overflow-hidden relative">
          {criticalMed ? (
            <div className="relative z-10 max-w-lg">
              <h4 className="font-headline text-3xl font-bold text-on-surface mb-4">Critical Stock Alert</h4>
              <p className="text-on-surface-variant font-body mb-2">
                <span className="font-bold text-error">&ldquo;{criticalMed.name}&rdquo;</span> has only{' '}
                <span className="font-bold text-error">{criticalMed.stock_quantity} unit{criticalMed.stock_quantity !== 1 ? 's' : ''}</span> remaining.
                {criticalMed.stock_quantity <= 20
                  ? ' Stock is below the safety threshold — immediate requisition is recommended.'
                  : ' Monitor this item closely and restock as needed.'}
              </p>
              <p className="text-xs text-on-surface-variant mb-8">
                {lowStockCount} medicine{lowStockCount !== 1 ? 's' : ''} currently below the 20-unit threshold.
              </p>
              <button className="bg-primary text-on-primary px-8 py-4 rounded-full font-bold text-sm shadow-lg shadow-primary/20 flex items-center group">
                Order Supplies
                <span className="material-symbols-outlined ml-3 group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
          ) : (
            <div className="relative z-10 max-w-lg">
              <h4 className="font-headline text-3xl font-bold text-on-surface mb-4">Stock Status</h4>
              <p className="text-on-surface-variant font-body mb-8">All medicines are currently within acceptable stock levels. Continue monitoring inventory regularly.</p>
            </div>
          )}
          <div className="absolute top-0 right-0 h-full w-1/3 overflow-hidden opacity-50 pointer-events-none">
            <img className="h-full w-full object-cover" alt="Medical supplies" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiwCW0CJwg3w-3ZCGUajuBrxn0bKxwtuOBFtcRkF9UonOnCCWxAkRnwhG2d34D6-87nlakytRuGL5OF1NO4kYUj7abWCwThNHiGd6l-sSs1TrIOYkVHRJzDwBhSxX7skCusR7mOZCVTyUPrpOF3fbO6GZUDXlHX4mg95MbRxBuI-EoMiSo0FzfeGt3TPME9HGVAf9xNrV8H2JF_SEIhd_mLVkV4MmOYW-6e57f_7M1GP_pg3g2wBv744a1bg1OUL-BCAK5mjgKJbY" />
          </div>
        </section>
      </main>

      <button className="fixed bottom-12 right-12 w-20 h-20 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform z-50">
        <span className="material-symbols-outlined text-3xl">picture_as_pdf</span>
      </button>

    </>
  );
};

export default Reports;
