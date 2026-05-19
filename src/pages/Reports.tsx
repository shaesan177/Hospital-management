import React from 'react';
import Layout from '../components/Layout';

const Reports: React.FC = () => {
  const topStats = [
    { label: 'TOTAL HEADCOUNT', value: '1,284', trend: '+2.4%', detail1: 'Active: 1,210', detail2: 'On Leave: 74', color: 'text-emerald-500' },
    { label: 'AVG. ATTENDANCE', value: '94.2%', trend: '-0.8%', detail1: 'Target: 95%', detail2: 'Variance: -0.8%', color: 'text-rose-500' },
    { label: 'MONTHLY PAYROLL', value: '₹2.4M', trend: '+4.1%', detail1: 'Salary: ₹2.1M', detail2: 'Bonus: ₹0.3M', color: 'text-emerald-500' },
    { label: 'OVERTIME COST', value: '₹142K', trend: '+12%', detail1: 'Budget: ₹150K', detail2: 'Remaining: ₹8K', color: 'text-amber-500' },
  ];

  const departmentalBreakdown = [
    { name: 'Cardiology Unit', staff: 124, efficiency: '98.2%', budget: 82, color: 'bg-emerald-500' },
    { name: 'Emergency Room', staff: 240, efficiency: '94.5%', budget: 95, color: 'bg-blue-600' },
    { name: 'Neurology Dept.', staff: 82, efficiency: '88.1%', budget: 64, color: 'bg-amber-500' },
    { name: 'Radiology Services', staff: 56, efficiency: '92.0%', budget: 78, color: 'bg-emerald-400' },
    { name: 'Outpatient Clinic', staff: 185, efficiency: '76.4%', budget: 42, color: 'bg-slate-400' },
  ];

  const overtimeAnalysis = [
    { ref: '#Oi -4921', unit: 'Emergency Services', hours: '42.5 hrs', cost: '₹12,450', intensity: 'CRITICAL', intensityColor: 'bg-rose-50 text-rose-600 border-rose-100' },
    { ref: '#Oi -4882', unit: 'Surgical Theatre', hours: '38.0 hrs', cost: '₹11,200', intensity: 'HIGH', intensityColor: 'bg-orange-50 text-orange-600 border-orange-100' },
    { ref: '#Oi -4876', unit: 'Nursing Support', hours: '112.5 hrs', cost: '₹8,900', intensity: 'STANDARD', intensityColor: 'bg-blue-50 text-blue-600 border-blue-100' },
    { ref: '#Oi -4860', unit: 'Admin Ops', hours: '12.0 hrs', cost: '₹1,450', intensity: 'LOW', intensityColor: 'bg-slate-50 text-slate-500 border-slate-100' },
    { ref: '#Oi -4855', unit: 'ICU Night Shift', hours: '28.5 hrs', cost: '₹7,200', intensity: 'HIGH', intensityColor: 'bg-orange-50 text-orange-600 border-orange-100' },
  ];

  return (
    <Layout title="HMS Portal" searchPlaceholder="Search analytics...">
      <div className="max-w-[1400px] mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              <span>ADMIN CONSOLE</span>
              <span className="text-slate-300">&gt;</span>
              <span className="text-[#003896]">REPORTS & ANALYTICS</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-1">Organizational Analytics</h1>
            <p className="text-sm font-medium text-slate-500">Real-time performance metrics and personnel utilization reports.</p>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm cursor-pointer hover:bg-slate-50 transition-all">
              <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <span className="text-xs font-black text-slate-700">Last 30 Days</span>
              <svg className="w-3 h-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#003896] rounded-xl text-sm font-bold text-white hover:bg-[#002d7a] transition-all shadow-lg shadow-blue-900/20">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Export PDF
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              Export CSV
            </button>
          </div>
        </div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {topStats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">{stat.label}</span>
                <div className={`flex items-center gap-1 text-[10px] font-black ${stat.color}`}>
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                  {stat.trend}
                </div>
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4">{stat.value}</h3>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <span className="text-[11px] font-bold text-slate-400">{stat.detail1}</span>
                <span className="text-[11px] font-bold text-slate-400">{stat.detail2}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Middle Section: Trends and Departmental Breakdown */}
        <div className="grid grid-cols-12 gap-8 mb-8">
          <div className="col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-lg font-black text-slate-900">Workforce Productivity Trend</h3>
                <p className="text-xs font-medium text-slate-400">Efficiency score based on KPIs and output</p>
              </div>
              <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                <button className="px-4 py-1.5 bg-white rounded-lg text-[10px] font-black text-[#003896] shadow-sm">Day</button>
                <button className="px-4 py-1.5 text-[10px] font-black text-slate-400 hover:text-slate-600">Week</button>
                <button className="px-4 py-1.5 text-[10px] font-black text-slate-400 hover:text-slate-600">Month</button>
              </div>
            </div>
            <div className="h-[300px] relative">
              {/* Simplified chart representation */}
              <div className="absolute inset-0 flex items-end justify-between px-2">
                {[40, 60, 45, 70, 55, 80, 65].map((h, i) => (
                  <div key={i} className="w-12 bg-slate-50 rounded-t-lg relative group">
                    <div className="absolute bottom-0 left-0 right-0 bg-[#003896]/10 rounded-t-lg transition-all group-hover:bg-[#003896]/20" style={{ height: `${h}%` }}></div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-[#003896] h-[2px] mb-[h%]"></div>
                  </div>
                ))}
              </div>
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="border-t border-slate-50 w-full h-0"></div>
                ))}
              </div>
            </div>
            <div className="flex justify-between mt-4 px-2">
              {['08 NOV', '09 NOV', '10 NOV', '11 NOV', '12 NOV', '13 NOV', 'TODAY'].map(d => (
                <span key={d} className="text-[10px] font-black text-slate-400">{d}</span>
              ))}
            </div>
          </div>

          <div className="col-span-5 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">Departmental Breakdown</h3>
                <p className="text-xs font-medium text-slate-400">Metrics by medical unit</p>
              </div>
              <button className="text-[11px] font-black text-[#003896] hover:underline flex items-center gap-1">
                View Detailed Log
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </button>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Department</th>
                  <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Staff</th>
                  <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Efficiency</th>
                  <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Budget Utilization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {departmentalBreakdown.map((dept, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-xs font-black text-slate-900">{dept.name}</td>
                    <td className="px-4 py-4 text-xs font-bold text-slate-500 text-center">{dept.staff}</td>
                    <td className="px-4 py-4 text-xs font-black text-emerald-500 text-center">{dept.efficiency}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${dept.color}`} style={{ width: `${dept.budget}%` }}></div>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 w-6 text-right">{dept.budget}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Section: Staff Distribution and Overtime Analysis */}
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
            <h3 className="text-lg font-black text-slate-900 mb-8">Staff Distribution</h3>
            <div className="relative w-48 h-48 mx-auto mb-10">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="#f1f5f9" strokeWidth="4"></circle>
                <circle cx="18" cy="18" r="16" fill="none" stroke="#003896" strokeWidth="4" strokeDasharray="70, 100" strokeDashoffset="25"></circle>
                <circle cx="18" cy="18" r="16" fill="none" stroke="#2563eb" strokeWidth="4" strokeDasharray="20, 100" strokeDashoffset="-45"></circle>
                <circle cx="18" cy="18" r="16" fill="none" stroke="#cbd5e1" strokeWidth="4" strokeDasharray="10, 100" strokeDashoffset="-65"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-900 leading-none">1,284</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Employees</span>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Medical Staff', value: '70%', color: 'bg-[#003896]' },
                { label: 'Administrative', value: '20%', color: 'bg-[#2563eb]' },
                { label: 'Support Services', value: '10%', color: 'bg-[#cbd5e1]' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-xs font-bold text-slate-600">{item.label}</span>
                  </div>
                  <span className="text-xs font-black text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">Overtime Cost Analysis</h3>
                <p className="text-xs font-medium text-slate-400">Recent high-impact overtime incidents</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input type="text" placeholder="Search by Department..." className="bg-slate-50 border border-slate-100 pl-10 pr-4 py-2 rounded-xl text-xs font-medium w-64 outline-none focus:border-[#003896] transition-all" />
                  <svg className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
                <button className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition-all">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                </button>
              </div>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Reference</th>
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Dept. / Unit</th>
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Hours</th>
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Est. Cost</th>
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Intensity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {overtimeAnalysis.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-5 text-xs font-bold text-slate-500">{item.ref}</td>
                    <td className="px-6 py-5 text-xs font-black text-slate-900">{item.unit}</td>
                    <td className="px-6 py-5 text-xs font-bold text-slate-500 text-center">{item.hours}</td>
                    <td className="px-6 py-5 text-xs font-black text-slate-900 text-right">{item.cost}</td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-2 py-1 rounded-md text-[8px] font-black tracking-widest border ${item.intensityColor}`}>
                        {item.intensity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
