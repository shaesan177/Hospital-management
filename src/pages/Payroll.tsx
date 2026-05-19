import React from 'react';
import Layout from '../components/Layout';

const Payroll: React.FC = () => {
  const employees = [
    { name: 'Sarah Jenkins', role: 'Chief Administrator', basic: '₹8,500.00', ot: '₹0.00', allowances: '₹1,200.00', gross: '₹9,700.00', deductions: '(₹2,425.00)', net: '₹7,275.00', status: 'PENDING', initial: 'SJ', color: 'bg-blue-100 text-blue-600' },
    { name: 'Michael Lee', role: 'Senior Nurse (ER)', basic: '₹5,200.00', ot: '₹1,450.00', allowances: '₹850.00', gross: '₹7,500.00', deductions: '(₹1,875.00)', net: '₹5,625.00', status: 'APPROVED', initial: 'ML', color: 'bg-emerald-100 text-emerald-600' },
    { name: 'Alice Wong', role: 'Radiology Tech', basic: '₹4,800.00', ot: '₹320.00', allowances: '₹600.00', gross: '₹5,720.00', deductions: '(₹1,430.00)', net: '₹4,290.00', status: 'APPROVED', initial: 'AW', color: 'bg-purple-100 text-purple-600' },
    { name: 'Robert Brown', role: 'IT Support Specialist', basic: '₹4,200.00', ot: '₹840.00', allowances: '₹400.00', gross: '₹5,440.00', deductions: '(₹1,360.00)', net: '₹4,080.00', status: 'ON HOLD', initial: 'RB', color: 'bg-slate-100 text-slate-600' },
  ];

  const stats = [
    { label: 'TOTAL GROSS', value: '₹1,452,890.00', trend: '+2.4% vs last month', icon: <TrendIcon />, color: 'text-emerald-500' },
    { label: 'OT PAYMENTS', value: '₹84,120.50', trend: '4.8% of total payroll', icon: <ClockIcon />, color: 'text-orange-500' },
    { label: 'TOTAL DEDUCTIONS', value: '₹312,450.25', trend: 'Taxes, Insurance, PF', icon: <FileTextIcon />, color: 'text-rose-500' },
    { label: 'NET PAYABLE', value: '₹1,140,439.75', trend: '1,248 Recipients', icon: <CheckCircleIcon />, color: 'text-blue-500' },
  ];

  return (
    <Layout title="Register of Wages" searchPlaceholder="Search employee...">
      <div className="max-w-[1400px] mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              <span>FINANCIAL MANAGEMENT</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900">October 2024 Payroll Cycle</h1>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button className="flex justify-center items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm w-full sm:w-auto">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Export Register
            </button>
            <button className="flex justify-center items-center gap-2 px-5 py-2.5 bg-[#003896] rounded-xl text-sm font-bold text-white hover:bg-[#002d7a] transition-all shadow-lg shadow-blue-900/20 w-full sm:w-auto">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="4" width="18" height="16" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
              Process Payments
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-[#003896] transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">{stat.label}</span>
                <div className={`${stat.color} p-1`}>{stat.icon}</div>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-1">{stat.value}</h3>
              <p className={`text-[11px] font-bold ${idx === 0 ? 'text-emerald-500' : 'text-slate-400'}`}>{stat.trend}</p>
            </div>
          ))}
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">
          <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">Wage Register Detail</h3>
              <p className="text-xs font-medium text-slate-400">Complete breakdown of earnings and deductions for the current period</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-auto">
                <select className="w-full appearance-none bg-slate-50 border border-slate-100 px-4 py-2 pr-10 rounded-xl text-xs font-black text-slate-600 outline-none focus:border-[#003896] transition-all cursor-pointer">
                  <option>All Departments</option>
                  <option>Nursing</option>
                  <option>Administration</option>
                  <option>IT Support</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>
              <button className="flex w-full sm:w-auto justify-center items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-[#003896] hover:bg-slate-50 transition-all">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                Advanced Filters
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest min-w-[200px]">Employee & Role</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right min-w-[100px]">Basic Pay</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right min-w-[100px]">OT Pay</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right min-w-[100px]">Allowances</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right min-w-[100px]">Gross Pay</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right min-w-[100px]">Deductions</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right min-w-[120px]">Net Payable</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center min-w-[100px]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {employees.map((emp, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl shrink-0 ${emp.color} flex items-center justify-center text-xs font-black`}>
                          {emp.initial}
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900 leading-none mb-1">{emp.name}</h4>
                          <p className="text-[10px] font-bold text-slate-400">{emp.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-slate-700 text-right">{emp.basic}</td>
                    <td className="px-6 py-5 text-sm font-bold text-slate-700 text-right">{emp.ot}</td>
                    <td className="px-6 py-5 text-sm font-bold text-slate-700 text-right">{emp.allowances}</td>
                    <td className="px-6 py-5 text-sm font-black text-slate-900 text-right">{emp.gross}</td>
                    <td className="px-6 py-5 text-sm font-bold text-rose-500 text-right">{emp.deductions}</td>
                    <td className="px-6 py-5 text-sm font-black text-[#003896] text-right">{emp.net}</td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-2 py-1 rounded-md text-[9px] font-black tracking-wider border ${emp.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          emp.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                            'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {/* Sub-totals row */}
                <tr className="bg-slate-50/80">
                  <td className="px-6 py-5">
                    <h4 className="text-base font-black text-slate-900">Sub-totals (Page)</h4>
                  </td>
                  <td className="px-6 py-5 text-sm font-black text-slate-900 text-right">₹22,700.00</td>
                  <td className="px-6 py-5 text-sm font-black text-slate-900 text-right">₹2,610.00</td>
                  <td className="px-6 py-5 text-sm font-black text-slate-900 text-right">₹3,050.00</td>
                  <td className="px-6 py-5 text-sm font-black text-slate-900 text-right">₹28,360.00</td>
                  <td className="px-6 py-5 text-sm font-black text-rose-600 text-right">(₹7,090.00)</td>
                  <td className="px-6 py-5 text-base font-black text-[#003896] text-right">₹21,270.00</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 md:p-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs font-bold text-slate-400 text-center sm:text-left">Displaying 25 of 1,248 Employee Records</p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">Rows per page:</span>
                <select className="bg-transparent text-xs font-black text-slate-600 outline-none">
                  <option>25</option>
                  <option>50</option>
                  <option>100</option>
                </select>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <button className="w-8 h-8 rounded-lg bg-[#003896] text-white text-xs font-black shadow-sm shadow-blue-900/20">1</button>
                <button className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-600 text-xs font-black hidden sm:block">2</button>
                <button className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-600 text-xs font-black hidden sm:block">3</button>
                <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Checks Section */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-6 bg-amber-100 rounded-md flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <h3 className="text-sm font-black text-slate-400 tracking-widest uppercase">COMPLIANCE & AUDIT CHECKS</h3>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h4 className="text-sm font-bold text-emerald-900">Minimum Wage Compliance Verification Passed</h4>
              </div>
              <span className="px-3 py-1 bg-white rounded-lg text-[9px] font-black text-emerald-600 border border-emerald-100 uppercase tracking-wider shrink-0 w-full sm:w-auto text-center">AUTOMATIC</span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-blue-50/50 rounded-2xl border border-blue-100 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                </div>
                <h4 className="text-sm font-bold text-blue-900">Tax Bracket Updates Applied for Q4 2024</h4>
              </div>
              <button className="px-3 py-1 bg-white rounded-lg text-[9px] font-black text-blue-600 border border-blue-100 uppercase tracking-wider shrink-0 w-full sm:w-auto">VIEW LOGS</button>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-amber-50/50 rounded-2xl border border-amber-100 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                </div>
                <h4 className="text-sm font-bold text-amber-900">14 Overtime records exceed standard threshold (Pending Approval)</h4>
              </div>
              <button className="px-3 py-1 bg-white rounded-lg text-[9px] font-black text-amber-600 border border-amber-100 uppercase tracking-wider shrink-0 w-full sm:w-auto">REVIEW</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Icons
const TrendIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>;
const ClockIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const FileTextIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
const CheckCircleIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;

export default Payroll;
