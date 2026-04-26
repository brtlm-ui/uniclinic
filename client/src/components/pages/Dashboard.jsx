import React, { useState } from 'react';
import Sidebar from '../navbar/Sidebar';
import Header from '../navbar/Header';

const monthlyData = [
    { month: 'Jan', height: 45, count: 312 },
    { month: 'Feb', height: 65, count: 408 },
    { month: 'Mar', height: 85, count: 521 },
    { month: 'Apr', height: 55, count: 360 },
    { month: 'May', height: 100, count: 628 },
    { month: 'Jun', height: 70, count: 445 },
    { month: 'Jul', height: 40, count: 284 },
    { month: 'Aug', height: 60, count: 392 },
    { month: 'Sep', height: 80, count: 498 },
    { month: 'Oct', height: 90, count: 572 },
    { month: 'Nov', height: 50, count: 330 },
    { month: 'Dec', height: 35, count: 241 },
];

const weeklyData = [
    { month: 'Mon', height: 55, count: 48 },
    { month: 'Tue', height: 80, count: 72 },
    { month: 'Wed', height: 100, count: 91 },
    { month: 'Thu', height: 65, count: 58 },
    { month: 'Fri', height: 90, count: 82 },
    { month: 'Sat', height: 30, count: 24 },
    { month: 'Sun', height: 15, count: 10 },
];

const Dashboard = () => {
    const [chartMode, setChartMode] = useState('monthly');
    const chartData = chartMode === 'monthly' ? monthlyData : weeklyData;
    const [hoveredBar, setHoveredBar] = useState(null);

    return (
        <>
            <Sidebar />
            <main className="ml-72 min-h-screen pt-0 pb-16">
                <Header hasSearch={false} />

                {/* Welcome Hero */}
                <section className="px-8 pt-10 mb-10">
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-primary font-bold tracking-widest text-xs uppercase mb-3">Clinical Serenity Dashboard</p>
                            <h1 className="font-manrope text-5xl font-black text-on-surface tracking-tight leading-tight">
                                Good morning, <span className="text-primary">Dr. Sarah Miller.</span>
                            </h1>
                            <p className="mt-3 text-on-surface-variant text-lg font-medium">Today is a busy day with <span className="font-bold text-on-surface">14 scheduled check-ups</span>. Stay sharp.</p>
                        </div>
                        <div className="hidden xl:flex items-center gap-3 bg-surface-container-lowest rounded-2xl px-6 py-4 shadow-sm">
                            <span className="material-symbols-outlined text-primary text-2xl" data-icon="calendar_today">calendar_today</span>
                            <div>
                                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Today</p>
                                <p className="font-bold text-on-surface">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stat Cards */}
                <section className="px-8 grid grid-cols-12 gap-8 mb-10">
                    <div className="col-span-12 lg:col-span-5 bg-primary rounded-xl p-10 text-on-primary relative overflow-hidden flex flex-col justify-between min-h-[320px]">
                        <div className="relative z-10">
                            <span className="text-primary-container font-bold text-sm tracking-widest uppercase">Student Population</span>
                            <div className="text-7xl font-black mt-4">1,248</div>
                        </div>
                        <div className="relative z-10 flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 w-fit">
                            <span className="material-symbols-outlined text-primary-container" data-icon="trending_up">trending_up</span>
                            <span className="text-sm font-medium">2.4% increase from last semester</span>
                        </div>
                        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary-dim rounded-full opacity-50"></div>
                        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-primary-container/20 rounded-full blur-3xl"></div>
                    </div>

                    <div className="col-span-12 lg:col-span-7 grid grid-cols-2 gap-8">
                        <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div className="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary" data-icon="event_available">event_available</span>
                                </div>
                                <span className="text-xs font-bold text-on-surface-variant">TODAY</span>
                            </div>
                            <div>
                                <div className="text-4xl font-bold mb-1">32</div>
                                <div className="text-on-surface-variant font-medium text-sm">Scheduled Visits</div>
                            </div>
                        </div>
                        <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm flex flex-col justify-between border-l-4 border-primary">
                            <div className="flex justify-between items-start">
                                <div className="w-12 h-12 rounded-2xl bg-primary-fixed-dim flex items-center justify-center">
                                    <span className="material-symbols-outlined text-on-primary-container" data-icon="history">history</span>
                                </div>
                                <span className="text-xs font-bold text-on-surface-variant">TOTAL</span>
                            </div>
                            <div>
                                <div className="text-4xl font-bold mb-1">4,892</div>
                                <div className="text-on-surface-variant font-medium text-sm">Visits this Year</div>
                            </div>
                        </div>
                        <div className="col-span-2 bg-error-container/10 p-8 rounded-xl flex items-center justify-between border border-error-container/20">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-full bg-error-container flex items-center justify-center text-on-error-container">
                                    <span className="material-symbols-outlined text-3xl" data-icon="warning" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-error-dim">Low Stock Alert</h3>
                                    <p className="text-error-dim opacity-70">8 essential medicines require immediate restocking.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => window.location.hash = '/medicines'}
                                className="bg-error-dim text-white px-8 py-4 rounded-full font-bold text-sm hover:scale-105 transition-transform"
                            >
                                Manage Inventory
                            </button>
                        </div>
                    </div>
                </section>

                {/* Visits Analysis - Full Width Expanded Chart */}
                <section className="px-8 mb-10">
                    <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-10">
                        <div className="flex items-end justify-between mb-10">
                            <div>
                                <h2 className="text-3xl font-extrabold tracking-tight mb-1">Visits Analysis</h2>
                                <p className="text-on-surface-variant font-medium">
                                    {chartMode === 'monthly' ? 'Monthly volume trends for 2024 — 12 months overview' : 'Weekly footfall breakdown — current week'}
                                </p>
                            </div>
                            <div className="flex items-center gap-6">
                                {/* Legend */}
                                <div className="hidden lg:flex items-center gap-5 text-xs font-bold text-on-surface-variant">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-primary inline-block"></span>
                                        Peak Month
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-primary-container inline-block"></span>
                                        Regular
                                    </div>
                                </div>
                                <div className="flex bg-surface-container rounded-full p-1">
                                    <button
                                        onClick={() => setChartMode('monthly')}
                                        className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${chartMode === 'monthly' ? 'bg-white shadow-sm text-on-surface' : 'text-on-surface-variant'}`}
                                    >Monthly</button>
                                    <button
                                        onClick={() => setChartMode('weekly')}
                                        className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${chartMode === 'weekly' ? 'bg-white shadow-sm text-on-surface' : 'text-on-surface-variant'}`}
                                    >Weekly</button>
                                </div>
                            </div>
                        </div>

                        {/* Chart — taller, full width */}
                        <div className="relative h-72 flex items-end gap-3 px-2 pb-2">
                            {/* Y-axis grid lines */}
                            <div className="absolute inset-x-2 top-0 bottom-10 flex flex-col justify-between pointer-events-none">
                                {[100, 75, 50, 25].map(pct => (
                                    <div key={pct} className="flex items-center gap-3">
                                        <span className="text-[10px] font-bold text-on-surface-variant/50 w-8 text-right flex-shrink-0">{pct}%</span>
                                        <div className="flex-1 border-t border-surface-container-high border-dashed"></div>
                                    </div>
                                ))}
                            </div>

                            {/* Bars */}
                            <div className="absolute inset-x-2 top-0 bottom-10 flex items-end gap-3 pl-12">
                                {chartData.map((d, i) => {
                                    const isPeak = d.height === Math.max(...chartData.map(x => x.height));
                                    return (
                                        <div
                                            key={d.month}
                                            className="flex-1 flex flex-col items-center gap-3 group cursor-pointer"
                                            onMouseEnter={() => setHoveredBar(i)}
                                            onMouseLeave={() => setHoveredBar(null)}
                                        >
                                            {/* Tooltip */}
                                            <div className={`relative transition-all duration-200 ${hoveredBar === i ? 'opacity-100 -translate-y-1' : 'opacity-0'}`}>
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-on-surface text-surface-container-lowest text-[11px] font-bold rounded-lg px-3 py-1.5 whitespace-nowrap shadow-xl">
                                                    {d.count} visits
                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-on-surface rotate-45 -mt-1"></div>
                                                </div>
                                            </div>
                                            {/* Bar container */}
                                            <div className="w-full bg-surface-container-high rounded-full overflow-hidden relative" style={{ height: '100%' }}>
                                                <div
                                                    className={`absolute bottom-0 w-full rounded-t-full transition-all duration-700 ${isPeak ? 'bg-primary shadow-lg shadow-primary/30' : 'bg-primary-container group-hover:bg-primary/60'}`}
                                                    style={{ height: `${d.height}%` }}
                                                ></div>
                                            </div>
                                            <span className={`text-[11px] font-bold uppercase tracking-wider ${isPeak ? 'text-primary' : 'text-on-surface-variant'}`}>{d.month}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Chart footer stats */}
                        <div className="mt-6 pt-6 border-t border-surface-container grid grid-cols-3 gap-6">
                            {[
                                { label: 'Peak Month', value: 'May 2024', sub: '628 visits' },
                                { label: 'Monthly Average', value: '416 visits', sub: 'across 12 months' },
                                { label: 'YTD Total', value: '4,991 visits', sub: '+18% vs 2023' },
                            ].map(s => (
                                <div key={s.label}>
                                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">{s.label}</p>
                                    <p className="font-bold text-on-surface">{s.value}</p>
                                    <p className="text-xs text-on-surface-variant">{s.sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Recent Visits */}
                <section className="px-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-extrabold tracking-tight">Recent Visits</h2>
                        <button onClick={() => window.location.hash = '/visits'} className="text-primary font-bold hover:underline flex items-center gap-1">
                            View All
                            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </button>
                    </div>
                    <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-container-low">
                                    <th className="px-8 py-6 text-xs font-bold text-on-surface-variant tracking-widest uppercase">Student Name</th>
                                    <th className="px-8 py-6 text-xs font-bold text-on-surface-variant tracking-widest uppercase">Date &amp; Time</th>
                                    <th className="px-8 py-6 text-xs font-bold text-on-surface-variant tracking-widest uppercase">Reason</th>
                                    <th className="px-8 py-6 text-xs font-bold text-on-surface-variant tracking-widest uppercase">Status</th>
                                    <th className="px-8 py-6 text-xs font-bold text-on-surface-variant tracking-widest uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-container">
                                {[
                                    { initials: 'JA', bg: 'bg-tertiary-container', fg: 'text-on-tertiary-container', name: 'Julian Anderson', date: 'Oct 14, 2024', time: '09:15 AM', reason: 'Allergic Reaction', statusBg: 'bg-error-container/20', statusFg: 'text-error', statusDot: 'bg-error', status: 'Urgent' },
                                    { initials: 'EP', bg: 'bg-secondary-container', fg: 'text-on-secondary-container', name: 'Emma Peterson', date: 'Oct 14, 2024', time: '10:30 AM', reason: 'Routine Checkup', statusBg: 'bg-surface-container', statusFg: 'text-on-surface-variant', statusDot: 'bg-on-surface-variant', status: 'Scheduled' },
                                    { initials: 'LM', bg: 'bg-primary-container', fg: 'text-on-primary-container', name: 'Liam Murphy', date: 'Oct 14, 2024', time: '11:45 AM', reason: 'Sports Injury', statusBg: 'bg-primary-container/20', statusFg: 'text-primary', statusDot: 'bg-primary', status: 'Completed' },
                                ].map(row => (
                                    <tr key={row.name} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-full ${row.bg} flex items-center justify-center ${row.fg} font-bold text-xs`}>{row.initials}</div>
                                                <span className="font-semibold">{row.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-sm">{row.date}</div>
                                            <div className="text-xs text-on-surface-variant font-medium">{row.time}</div>
                                        </td>
                                        <td className="px-8 py-6"><span className="text-sm font-medium">{row.reason}</span></td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full ${row.statusBg} ${row.statusFg} font-bold text-[10px] uppercase`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${row.statusDot}`}></span>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => window.location.hash = '/visits'} className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-primary transition-all" title="View visit">
                                                    <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </>
    );
};

export default Dashboard;
