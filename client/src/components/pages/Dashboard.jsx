import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../navbar/Sidebar';
import Header from '../navbar/Header';
import { config, endpoints } from '../config/config';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/** Build monthly bar data from the /statistics/monthly-trends payload */
function buildMonthlyData(trends) {
    const year = new Date().getFullYear();
    const counts = Array(12).fill(0);
    trends.forEach(t => {
        const [y, m] = t.month.split('-').map(Number);
        if (y === year) counts[m - 1] = t.total_visits;
    });
    const max = Math.max(...counts, 1);
    return MONTH_NAMES.map((month, i) => ({ month, count: counts[i], height: Math.round((counts[i] / max) * 100) }));
}

/** Build weekly bar data from the /statistics/visits payload */
function buildWeeklyData(visits) {
    const today = new Date();
    const dow = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));
    startOfWeek.setHours(0, 0, 0, 0);
    const counts = Array(7).fill(0);
    visits.forEach(v => {
        const d = new Date(v.visit_date);
        d.setHours(0, 0, 0, 0);
        const diff = Math.round((d - startOfWeek) / 86400000);
        if (diff >= 0 && diff < 7) counts[diff]++;
    });
    const max = Math.max(...counts, 1);
    return DAY_NAMES.map((day, i) => ({ month: day, count: counts[i], height: Math.round((counts[i] / max) * 100) }));
}

const Dashboard = () => {
    const navigate = useNavigate();
    const [chartMode, setChartMode] = useState('monthly');
    const [hoveredBar, setHoveredBar] = useState(null);

    const emptyMonthly = MONTH_NAMES.map(m => ({ month: m, count: 0, height: 0 }));
    const emptyWeekly = DAY_NAMES.map(m => ({ month: m, count: 0, height: 0 }));

    const [stats, setStats] = useState({
        studentCount: 0, todayVisits: 0, totalVisits: 0, lowStockCount: 0,
        outOfStockCount: 0, totalStaff: 0, totalPrescriptions: 0,
        recentVisits: [], monthlyData: emptyMonthly, weeklyData: emptyWeekly,
        peakMonthName: '—', peakMonthCount: 0, monthlyAvg: 0,
    });

    const chartData = chartMode === 'monthly' ? stats.monthlyData : stats.weeklyData;

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Use statistics endpoints — server does the aggregation
                const [dashRes, trendsRes, visitsRes] = await Promise.all([
                    axios.get(`${config.uniClinicAPI}${endpoints.statistics.dashboard}`),
                    axios.get(`${config.uniClinicAPI}${endpoints.statistics.monthlyTrends}`),
                    axios.get(`${config.uniClinicAPI}${endpoints.statistics.visits}`),
                ]);

                const dash   = dashRes.data;
                const trends = trendsRes.data;
                const visits = visitsRes.data;

                const today = new Date().toDateString();
                const todayVisits = visits.filter(v => new Date(v.visit_date).toDateString() === today).length;

                const recentVisits = [...visits]
                    .sort((a, b) => new Date(b.visit_date) - new Date(a.visit_date))
                    .slice(0, 5);

                const monthlyData = buildMonthlyData(trends);
                const weeklyData  = buildWeeklyData(visits);

                const peakIdx = monthlyData.reduce((best, d, i) => d.count > monthlyData[best].count ? i : best, 0);
                const peakMonthName  = monthlyData[peakIdx].count > 0 ? `${MONTH_NAMES[peakIdx]} ${new Date().getFullYear()}` : '—';
                const peakMonthCount = monthlyData[peakIdx].count;

                setStats({
                    studentCount:       Number(dash.total_students)      || 0,
                    todayVisits,
                    totalVisits:        Number(dash.total_visits)         || 0,
                    lowStockCount:      Number(dash.low_stock_count)      || 0,
                    outOfStockCount:    Number(dash.out_of_stock_count)   || 0,
                    totalStaff:         Number(dash.total_staff)          || 0,
                    totalPrescriptions: Number(dash.total_prescriptions)  || 0,
                    monthlyAvg:         Number(dash.avg_monthly_visits)   || 0,
                    recentVisits,
                    monthlyData,
                    weeklyData,
                    peakMonthName,
                    peakMonthCount,
                });
            } catch {
                // silently fail — dashboard stats are non-critical
            }
        };
        fetchStats();
    }, []);

    const user = (() => { try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; } })();
    const userName = user.name || 'Doctor';

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
                                Good morning, <span className="text-primary">{userName}.</span>
                            </h1>
                            <p className="mt-3 text-on-surface-variant text-lg font-medium">Today has <span className="font-bold text-on-surface">{stats.todayVisits} visit{stats.todayVisits !== 1 ? 's' : ''}</span> recorded so far.</p>
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
                            <div className="text-7xl font-black mt-4">{stats.studentCount.toLocaleString()}</div>
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
                                <div className="text-4xl font-bold mb-1">{stats.todayVisits}</div>
                                <div className="text-on-surface-variant font-medium text-sm">Visits Today</div>
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
                                <div className="text-4xl font-bold mb-1">{stats.totalVisits.toLocaleString()}</div>
                                <div className="text-on-surface-variant font-medium text-sm">Total Visits</div>
                            </div>
                        </div>
                        <div className="col-span-2 bg-error-container/10 p-8 rounded-xl flex items-center justify-between border border-error-container/20">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-full bg-error-container flex items-center justify-center text-on-error-container">
                                    <span className="material-symbols-outlined text-3xl" data-icon="warning" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-error-dim">Low Stock Alert</h3>
                                    <p className="text-error-dim opacity-70">{stats.lowStockCount > 0 ? `${stats.lowStockCount} essential medicine${stats.lowStockCount !== 1 ? 's' : ''} require immediate restocking.` : 'All medicines are sufficiently stocked.'}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/medicines')}
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
                                    {chartMode === 'monthly' ? `Monthly visit totals for ${new Date().getFullYear()} — 12 months overview` : 'Daily visit totals — current week'}
                                </p>
                            </div>
                            <div className="flex items-center gap-6">
                                {/* Legend */}
                                <div className="hidden lg:flex items-center gap-5 text-xs font-bold text-on-surface-variant">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-primary inline-block"></span>
                                        {chartMode === 'monthly' ? 'Peak Month' : 'Peak Day'}
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
                            {(() => {
                                const chartMax = Math.max(...chartData.map(x => x.count), 1);
                                const ticks = [1, 0.75, 0.5, 0.25];
                                return (
                                    <div className="absolute inset-x-2 top-0 bottom-10 flex flex-col justify-between pointer-events-none">
                                        {ticks.map(t => (
                                            <div key={t} className="flex items-center gap-3">
                                                <span className="text-[10px] font-bold text-on-surface-variant/50 w-8 text-right flex-shrink-0">
                                                    {Math.round(chartMax * t)}
                                                </span>
                                                <div className="flex-1 border-t border-surface-container-high border-dashed"></div>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })()}

                            {/* Bars */}
                            <div className="absolute inset-x-2 top-0 bottom-10 flex items-end gap-3 pl-12">
                                {chartData.map((d, i) => {
                                    const isPeak = d.height === Math.max(...chartData.map(x => x.height));
                                    return (
                                        <div
                                            key={d.month}
                                            className="flex-1 h-full flex flex-col items-center gap-1 group cursor-pointer"
                                            onMouseEnter={() => setHoveredBar(i)}
                                            onMouseLeave={() => setHoveredBar(null)}
                                        >
                                            {/* Tooltip */}
                                            <div className={`relative transition-all duration-200 flex-shrink-0 ${hoveredBar === i ? 'opacity-100 -translate-y-1' : 'opacity-0'}`}>
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-on-surface text-surface-container-lowest text-[11px] font-bold rounded-lg px-3 py-1.5 whitespace-nowrap shadow-xl">
                                                    {d.count} visits
                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-on-surface rotate-45 -mt-1"></div>
                                                </div>
                                            </div>
                                            {/* Bar container */}
                                            <div className="w-full flex-1 bg-surface-container-high rounded-full overflow-hidden relative">
                                                <div
                                                    className={`absolute bottom-0 w-full transition-all duration-700 ${isPeak ? 'bg-primary shadow-lg shadow-primary/30' : 'bg-primary-container group-hover:bg-primary/60'}`}
                                                    style={{ height: `${d.height}%`, borderRadius: 'inherit' }}
                                                ></div>
                                            </div>
                                            <span className={`text-[11px] font-bold uppercase tracking-wider flex-shrink-0 ${isPeak ? 'text-primary' : 'text-on-surface-variant'}`}>{d.month}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Chart footer stats */}
                        {chartMode === 'monthly' ? (
                            <div className="mt-6 pt-6 border-t border-surface-container grid grid-cols-3 gap-6">
                                {[
                                    { label: 'Peak Month', value: stats.peakMonthName, sub: `${stats.peakMonthCount} visits` },
                                    { label: 'Monthly Average', value: `${stats.monthlyAvg} visits`, sub: 'across 12 months' },
                                    { label: 'Total Visits', value: stats.totalVisits.toLocaleString(), sub: 'all time' },
                                ].map(s => (
                                    <div key={s.label}>
                                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">{s.label}</p>
                                        <p className="font-bold text-on-surface">{s.value}</p>
                                        <p className="text-xs text-on-surface-variant">{s.sub}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="mt-6 pt-6 border-t border-surface-container grid grid-cols-3 gap-6">
                                {(() => {
                                    const wd = stats.weeklyData;
                                    const peakDay = wd.reduce((best, d) => d.count > best.count ? d : best, wd[0] || { month: '—', count: 0 });
                                    const weekTotal = wd.reduce((s, d) => s + d.count, 0);
                                    const dailyAvg = Math.round(weekTotal / 7);
                                    return [
                                        { label: 'Peak Day', value: peakDay.month, sub: `${peakDay.count} visits` },
                                        { label: 'Daily Average', value: `${dailyAvg} visits`, sub: 'this week' },
                                        { label: 'Week Total', value: weekTotal.toString(), sub: 'visits this week' },
                                    ].map(s => (
                                        <div key={s.label}>
                                            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">{s.label}</p>
                                            <p className="font-bold text-on-surface">{s.value}</p>
                                            <p className="text-xs text-on-surface-variant">{s.sub}</p>
                                        </div>
                                    ));
                                })()}
                            </div>
                        )}
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
                                {stats.recentVisits.length === 0 ? (
                                    <tr><td colSpan={5} className="px-8 py-10 text-center text-on-surface-variant">No visits yet.</td></tr>
                                ) : stats.recentVisits.map(row => {
                                    const initials = (row.student_name || '??').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
                                    const statusStyle = row.status === 'completed'
                                        ? { bg: 'bg-primary-container/20', fg: 'text-primary', dot: 'bg-primary', label: 'Completed' }
                                        : { bg: 'bg-secondary-container/30', fg: 'text-on-surface-variant', dot: 'bg-on-surface-variant', label: 'Ongoing' };
                                    const dateStr = row.visit_date ? new Date(row.visit_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
                                    const timeStr = row.visit_time ? row.visit_time.slice(0, 5) : '—';
                                    return (
                                        <tr key={row.visit_id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary-container font-bold text-xs">{initials}</div>
                                                    <span className="font-semibold">{row.student_name || `Student #${row.student_id}`}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-sm">{dateStr}</div>
                                                <div className="text-xs text-on-surface-variant font-medium">{timeStr}</div>
                                            </td>
                                            <td className="px-8 py-6"><span className="text-sm font-medium">{row.reason || '—'}</span></td>
                                            <td className="px-8 py-6">
                                                <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full ${statusStyle.bg} ${statusStyle.fg} font-bold text-[10px] uppercase`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
                                                    {statusStyle.label}
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
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </>
    );
};

export default Dashboard;
