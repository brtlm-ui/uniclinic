import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Sidebar from '../navbar/Sidebar';
import Header from '../navbar/Header';
import { config, endpoints } from '../config/config';

const Reports = () => {
    const [visits, setVisits] = useState([]);
    const [medStats, setMedStats] = useState([]);
    const [dashSummary, setDashSummary] = useState({});
    const [students, setStudents] = useState([]);
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dateFrom, setDateFrom] = useState(() => {
        const d = new Date(); d.setDate(d.getDate() - 29); return d.toISOString().slice(0, 10);
    });
    const [dateTo, setDateTo] = useState(() => new Date().toISOString().slice(0, 10));

    // ── Print helper ──────────────────────────────────────────────────────────
    const openPrintWindow = (title, bodyHtml) => {
        const w = window.open('', '_blank');
        w.document.write(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #111; padding: 32px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start;
              border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 24px; }
    .clinic-name { font-size: 26px; font-weight: 800; color: #0066CC; }
    .clinic-sub  { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: .1em; margin-top: 4px; }
    .meta { text-align: right; font-size: 12px; color: #555; }
    h2 { font-size: 20px; font-weight: 700; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px; }
    thead tr { background: #0066CC; color: #fff; }
    thead th { padding: 10px 14px; text-align: left; font-weight: 600; }
    tbody tr:nth-child(even) { background: #f8fafc; }
    td { padding: 9px 14px; border-bottom: 1px solid #e2e8f0; }
    .sig { margin-top: 48px; border-top: 1px solid #94a3b8; padding-top: 8px; width: 220px; font-size: 11px; color: #555; }
    .footer { margin-top: 32px; font-size: 10px; color: #aaa; text-align: right; }
    @media print { body { padding: 16px; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="clinic-name">University Clinic</div>
      <div class="clinic-sub">Institutional Health Services</div>
    </div>
    <div class="meta">
      <div><strong>${title}</strong></div>
      <div>Generated: ${new Date().toLocaleString()}</div>
    </div>
  </div>
  ${bodyHtml}
  <div class="sig">Authorized Signature / Chief Medical Officer</div>
  <div class="footer">UniClinic Management System &bull; Internal Document</div>
  <script>window.onload = () => { window.print(); }<\/script>
</body>
</html>`);
        w.document.close();
    };

    const tableHtml = (heads, rows, accentColor = '#0066CC') => {
        const ths = heads.map(h => `<th style="background:${accentColor}">${h}</th>`).join('');
        const trs = rows.map(r =>
            `<tr>${r.map(c => `<td>${c ?? 'N/A'}</td>`).join('')}</tr>`
        ).join('');
        return `<table><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>`;
    };

    const printAnalytics = () => {
        const periodLine = `Reporting Period: ${fmtLabel(dateFrom)} — ${fmtLabel(dateTo)}`;
        const kpiTable = tableHtml(
            ['Metric', 'Value'],
            [
                ['Total Consultations', totalConsultations.toLocaleString()],
                ['Units Dispensed', unitsDispensed.toLocaleString()],
                ['Avg. Daily Volume', `${avgCount} patients/day`],
                ['Peak Volume', `${maxCount} patients`],
                ['Critical Stock Alerts', String(lowStockCount)],
            ]
        );
        const diagSection = topDiagnoses.length > 0
            ? `<h2>Top Reasons for Visit</h2>${tableHtml(['Reason', 'Cases', 'Share'], topDiagnoses.map(({ name, count, pct }) => [name, String(count), `${pct}%`]), '#3498DB')}`
            : '';
        const medSection = topMeds.length > 0
            ? `<h2>Medicine Dispensation</h2>${tableHtml(['Medication', 'Units', 'Share'], topMeds.map(({ name, volume }) => { const pct = unitsDispensed > 0 ? Math.round((volume / unitsDispensed) * 100) : 0; return [name, volume.toLocaleString(), `${pct}%`]; }), '#8E44AD')}`
            : '';
        openPrintWindow('Clinical Analytics', `<p style="margin-bottom:20px;color:#555;font-size:13px">${periodLine}</p><h2>Summary Metrics</h2>${kpiTable}${diagSection}${medSection}`);
    };

    const printStaff = () => {
        const body = tableHtml(
            ['Full Name', 'Role', 'Username', 'Last Active'],
            staff.map(s => [s.name, s.role?.toUpperCase(), s.username, s.last_active || 'N/A']),
            '#003366'
        );
        openPrintWindow('Staff Compliance & Registry', `<h2>Staff Registry</h2>${body}`);
    };

    const printStudents = () => {
        const body = tableHtml(
            ['ID Number', 'Full Name', 'Course', 'Year'],
            students.map(s => [s.student_number, `${s.first_name} ${s.last_name}`, s.course, s.year_level])
        );
        openPrintWindow('Student Health Registry', `<h2>Student Registry</h2>${body}`);
    };

    const printVisits = () => {
        const body = tableHtml(
            ['Student', 'Date', 'Reason', 'Status'],
            visits.map(v => [v.student_name, v.visit_date?.slice(0, 10), v.reason, v.status?.toUpperCase()]),
            '#323232'
        );
        openPrintWindow('Visit Encounter Registry', `<h2>Visit Log</h2>${body}`);
    };

    // ── PDF Download helpers ──────────────────────────────────────────────────
    const pdfHeader = (pdf, title, subtitle) => {
        const margin = 20;
        pdf.setFontSize(22);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 102, 204);
        pdf.text('University Clinic', margin, 20);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(120);
        pdf.text('Institutional Health Services', margin, 27);
        pdf.setDrawColor(200);
        pdf.line(margin, 31, pdf.internal.pageSize.getWidth() - margin, 31);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0);
        pdf.text(title, margin, 42);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100);
        pdf.text(subtitle, margin, 50);
        return 60;
    };

    const downloadPdfAnalytics = () => {
        try {
          const pdf = new jsPDF('p', 'mm', 'a4');
        const margin = 20;
        let y = pdfHeader(pdf, 'Clinical Analytics Report', `Period: ${fmtLabel(dateFrom)} — ${fmtLabel(dateTo)}`);
          pdf.autoTable({
            startY: y,
            head: [['Metric', 'Value']],
            body: [
                ['Total Consultations', totalConsultations.toLocaleString()],
                ['Units Dispensed', unitsDispensed.toLocaleString()],
                ['Avg. Daily Volume', `${avgCount} patients/day`],
                ['Peak Volume', `${maxCount} patients`],
                ['Critical Stock Alerts', String(lowStockCount)],
            ],
            headStyles: { fillColor: [0, 102, 204] },
            margin: { left: margin, right: margin },
        });
        y = pdf.lastAutoTable.finalY + 12;
        if (topDiagnoses.length > 0) {
            pdf.setFontSize(13); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(0);
            pdf.text('Top Reasons for Visit', margin, y); y += 6;
            pdf.autoTable({
                startY: y,
                head: [['Reason', 'Cases', 'Share']],
                body: topDiagnoses.map(({ name, count, pct }) => [name, String(count), `${pct}%`]),
                headStyles: { fillColor: [52, 152, 219] },
                margin: { left: margin, right: margin },
            });
            y = pdf.lastAutoTable.finalY + 12;
        }
        if (topMeds.length > 0) {
            if (y > 240) { pdf.addPage(); y = 20; }
            pdf.setFontSize(13); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(0);
            pdf.text('Medicine Dispensation', margin, y); y += 6;
            pdf.autoTable({
                startY: y,
                head: [['Medication', 'Units', 'Share']],
                body: topMeds.map(({ name, volume }) => {
                    const pct = unitsDispensed > 0 ? Math.round((volume / unitsDispensed) * 100) : 0;
                    return [name, volume.toLocaleString(), `${pct}%`];
                }),
                headStyles: { fillColor: [142, 68, 173] },
                margin: { left: margin, right: margin },
            });
        }
        pdf.save(`UniClinic_Analytics_${new Date().toISOString().slice(0, 10)}.pdf`);
        } catch (err) {
          console.error('PDF Analytics Error:', err);
          alert('Failed to generate PDF. Check console for details.');
        }
    };

    const downloadPdfStaff = () => {
        try {
          const pdf = new jsPDF('p', 'mm', 'a4');
        const margin = 20;
        const y = pdfHeader(pdf, 'Staff Compliance & Registry', `Generated: ${new Date().toLocaleString()}`);
        pdf.autoTable({
            startY: y,
            head: [['Full Name', 'Role', 'Username', 'Last Active']],
            body: staff.map(s => [s.name, s.role?.toUpperCase(), s.username, s.last_active || 'N/A']),
            headStyles: { fillColor: [0, 51, 102] },
            margin: { left: margin, right: margin },
        });
        pdf.save(`Staff_Compliance_${new Date().toISOString().slice(0, 10)}.pdf`);
        } catch (err) {
          console.error('PDF Staff Error:', err);
          alert('Failed to generate PDF. Check console for details.');
        }
    };

    const downloadPdfStudents = () => {
        try {
          const pdf = new jsPDF('p', 'mm', 'a4');
        const margin = 20;
        const y = pdfHeader(pdf, 'Student Health Registry', `Generated: ${new Date().toLocaleString()}`);
        pdf.autoTable({
            startY: y,
            head: [['ID Number', 'Full Name', 'Course', 'Year']],
            body: students.map(s => [s.student_number, `${s.first_name} ${s.last_name}`, s.course, s.year_level]),
            headStyles: { fillColor: [0, 102, 204] },
            margin: { left: margin, right: margin },
        });
        pdf.save(`Student_Registry_${new Date().toISOString().slice(0, 10)}.pdf`);
        } catch (err) {
          console.error('PDF Students Error:', err);
          alert('Failed to generate PDF. Check console for details.');
        }
    };

    const downloadPdfVisits = () => {
        try {
          const pdf = new jsPDF('p', 'mm', 'a4');
        const margin = 20;
        const y = pdfHeader(pdf, 'Visit Encounter Registry', `Generated: ${new Date().toLocaleString()}`);
        pdf.autoTable({
            startY: y,
            head: [['Student', 'Date', 'Reason', 'Status']],
            body: visits.map(v => [v.student_name, v.visit_date?.slice(0, 10), v.reason, v.status?.toUpperCase()]),
            headStyles: { fillColor: [50, 50, 50] },
            margin: { left: margin, right: margin },
        });
        pdf.save(`Visit_Registry_${new Date().toISOString().slice(0, 10)}.pdf`);
        } catch (err) {
          console.error('PDF Visits Error:', err);
          alert('Failed to generate PDF. Check console for details.');
        }
    };

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [v, m, d, s, st] = await Promise.all([
                    axios.get(`${config.uniClinicAPI}${endpoints.visits}`),
                    axios.get(`${config.uniClinicAPI}${endpoints.statistics.medicines}`),
                    axios.get(`${config.uniClinicAPI}${endpoints.statistics.dashboard}`),
                    axios.get(`${config.uniClinicAPI}${endpoints.students}`),
                    axios.get(`${config.uniClinicAPI}${endpoints.staff}`)
                ]);
                setVisits(v.data);
                setMedStats(m.data);
                setDashSummary(d.data);
                setStudents(s.data);
                setStaff(st.data);
            } catch (err) {
                console.error('Fetch Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    // ── Date helpers ──────────────────────────────────────────────────────────
    const today = new Date();
    const toISO = (d) => d.toISOString().slice(0, 10);
    const fmtLabel = (iso) => new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: '2-digit' });

    // ── Date range from selected from/to ─────────────────────────────────────
    const dateRange = (() => {
        const arr = [];
        const cur = new Date(dateFrom + 'T00:00:00');
        const end = new Date(dateTo + 'T00:00:00');
        while (cur <= end) { arr.push(toISO(new Date(cur))); cur.setDate(cur.getDate() + 1); }
        return arr;
    })();

    const filteredVisits = visits.filter(v => {
        const d = v.visit_date?.slice(0, 10);
        return d && d >= dateFrom && d <= dateTo;
    });

    // ── Daily volume ──────────────────────────────────────────────────────────
    const dailyCounts = dateRange.map(date => ({
        date,
        count: filteredVisits.filter(v => v.visit_date?.slice(0, 10) === date).length,
    }));
    const maxCount = Math.max(...dailyCounts.map(d => d.count), 1);
    const avgCount = dateRange.length > 0
        ? Math.round(dailyCounts.reduce((s, d) => s + d.count, 0) / dateRange.length)
        : 0;

    // ── Summary stats ─────────────────────────────────────────────────────────
    const totalConsultations = filteredVisits.length;
    const unitsDispensed     = medStats.reduce((s, m) => s + (Number(m.total_dispensed) || 0), 0);
    const lowStockCount      = Number(dashSummary.low_stock_count) || 0;

    // ── Top reasons for visit (filtered) ─────────────────────────────────────
    const reasonTally = {};
    filteredVisits.forEach(v => {
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

          <div className="bg-surface-container-low p-4 rounded-2xl flex items-center gap-3 shadow-sm">
            <span className="material-symbols-outlined text-primary text-xl flex-shrink-0">calendar_today</span>
            <input
              type="date"
              value={dateFrom}
              max={dateTo}
              onChange={e => setDateFrom(e.target.value)}
              className="bg-transparent text-sm font-semibold text-on-surface outline-none cursor-pointer"
            />
            <span className="text-on-surface-variant font-bold">—</span>
            <input
              type="date"
              value={dateTo}
              min={dateFrom}
              max={toISO(today)}
              onChange={e => setDateTo(e.target.value)}
              className="bg-transparent text-sm font-semibold text-on-surface outline-none cursor-pointer"
            />
          </div>
        </section>
        {/* Master Report Grid */}
        <section className="px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
                { title: 'Clinical Analytics', desc: 'Overall performance and diagnostic trends', icon: 'analytics', color: 'bg-primary', action: printAnalytics, download: downloadPdfAnalytics },
                { title: 'Staff Compliance', desc: 'Clinical personnel status and activity', icon: 'verified_user', color: 'bg-tertiary', action: printStaff, download: downloadPdfStaff },
                { title: 'Student Registry', desc: 'Complete health records directory', icon: 'group', color: 'bg-secondary', action: printStudents, download: downloadPdfStudents },
                { title: 'Visit Encounters', desc: 'Detailed log of all patient visits', icon: 'calendar_month', color: 'bg-slate-700', action: printVisits, download: downloadPdfVisits },
            ].map(r => (
                <div key={r.title} className="bg-surface-container-lowest rounded-3xl p-8 editorial-shadow border border-outline-variant/10 group hover:-translate-y-2 transition-all flex flex-col">
                    <div className={`w-14 h-14 ${r.color} text-on-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-on-surface/5`}>
                        <span className="material-symbols-outlined text-3xl">{r.icon}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{r.title}</h3>
                    <p className="text-sm text-on-surface-variant mb-6 leading-relaxed flex-1">{r.desc}</p>
                    <div className="flex flex-col gap-2 mt-auto">
                        <button
                            onClick={r.action}
                            className="w-full py-3 bg-primary text-on-primary rounded-full font-bold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-base">print</span>
                            Print Report
                        </button>
                        <button
                            onClick={r.download}
                            className="w-full py-3 bg-surface-container text-on-surface rounded-full font-bold text-sm hover:bg-surface-container-high transition-all flex items-center justify-center gap-2 border border-outline-variant/30"
                        >
                            <span className="material-symbols-outlined text-base">download</span>
                            Download PDF
                        </button>
                    </div>
                </div>
            ))}
        </section>

        <section className="px-8 mb-12">
            <div className="bg-surface-container-lowest rounded-3xl p-8 editorial-shadow border border-outline-variant/10">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-black font-headline">Operational Statistics</h2>
                        <p className="text-on-surface-variant text-sm">Real-time health service metrics and pharmacy utilization</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-bold text-outline-variant uppercase tracking-widest mb-1">Today's Load</p>
                        <p className="text-2xl font-black text-primary">{(visits.filter(v => v.visit_date?.slice(0, 10) === today.toISOString().slice(0, 10)).length)} <span className="text-sm font-medium text-on-surface-variant">patients</span></p>
                    </div>
                </div>
            </div>
        </section>

        <section className="px-8 grid grid-cols-12 gap-8 mb-16">

          <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-xl p-10 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-12">
              <div>
                <h4 className="font-headline text-2xl font-bold text-on-surface mb-1">Daily Patient Volume</h4>
                <p className="text-on-surface-variant text-sm font-medium">Monitoring clinic footfall from {fmtLabel(dateFrom)} to {fmtLabel(dateTo)}</p>
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
              {(() => {
                const n = dateRange.length;
                if (n === 0) return null;
                return [...new Set([0, Math.floor(n / 3), Math.floor(2 * n / 3), n - 1])]
                  .map(i => <span key={dateRange[i]}>{fmtLabel(dateRange[i])}</span>);
              })()}
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

    </>
  );
};

export default Reports;
