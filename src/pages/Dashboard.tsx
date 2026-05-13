import React from 'react';
import Layout from '../components/Layout';

const Dashboard: React.FC = () => {
  return (
    <Layout title="Overview Dashboard" searchPlaceholder="Search employees, records, or reports...">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        <div className="col-span-full flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Hospital Overview</h1>
            <p className="text-slate-500 text-sm font-medium">Real-time performance and resource metrics for HMS Medical Center.</p>
          </div>
          <div className="flex gap-4">
            <button className="px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-50">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Export Data
            </button>
            <button className="px-4 py-2.5 bg-[#003896] text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#002d7a]">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              New Entry
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="TOTAL EMPLOYEES" value="1,248" trend="+2.4% ↑" trendType="up" update="Updated 5m ago" icon={<EmployeesIcon />} />
            <StatCard title="PRESENT TODAY" value="1,142" trend="92% Rate" trendType="neutral" update="Daily Attendance" icon={<CheckIcon />} iconBg="bg-emerald-50 text-emerald-500" valueColor="text-emerald-500" />
            <StatCard title="ON LEAVE" value="86" trend="+12 ⚠️" trendType="down" update="Active Requests" icon={<ClockIcon />} iconBg="bg-orange-50 text-orange-500" valueColor="text-orange-500" />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-lg font-bold">Attendance Trend</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Daily attendance rates across all departments</p>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button className="px-3 py-1.5 text-[10px] font-bold text-slate-500">WEEKLY</button>
                <button className="px-3 py-1.5 text-[10px] font-bold bg-white text-slate-900 rounded-md shadow-sm">MONTHLY</button>
              </div>
            </div>
            <div className="flex items-end justify-between h-[200px] pt-4">
              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, i) => (
                <div key={day} className="flex flex-col items-center gap-4 flex-1">
                  <div className="w-10 bg-slate-100 rounded-md relative h-[150px] flex items-end">
                    <div 
                      className={`w-full rounded-md transition-all duration-500 ${day === 'FRI' ? 'bg-[#003896]' : 'bg-slate-100'}`} 
                      style={{ height: `${[40, 60, 80, 90, 100, 70, 50][i]}%` }}
                    >
                      {day === 'FRI' && (
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#003896] text-white px-3 py-1 rounded text-[10px] font-bold whitespace-nowrap">
                          92% today
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">{day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-bold">Overtime Analytics</h3>
              <a href="#" className="text-sm font-bold text-[#003896]">Details</a>
            </div>
            <div className="space-y-6">
              <OvertimeItem name="Nursing Department" value={184} limit={200} color="bg-red-500" textColor="text-red-500" />
              <OvertimeItem name="Surgery & Trauma" value={112} limit={200} color="bg-[#003896]" textColor="text-[#003896]" />
              <OvertimeItem name="Radiology" value={64} limit={200} color="bg-[#003896]" textColor="text-[#003896]" />
              <OvertimeItem name="Emergency Services" value={52} limit={200} color="bg-[#003896]" textColor="text-[#003896]" />
            </div>
          </div>
        </div>

        <aside className="space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                <h3 className="text-sm font-bold">Upcoming Holidays</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">Q4 2024</span>
            </div>
            <div className="space-y-6">
              <HolidayItem month="DEC" day="25" name="Christmas Day" type="Global Medical Holiday" />
              <HolidayItem month="JAN" day="01" name="New Year's Day" type="Public Holiday" />
              <HolidayItem month="FEB" day="14" name="Foundation Day" type="Internal Hospital Holiday" />
            </div>
          </div>
        </aside>
      </div>
    </Layout>
  );
};

// Sub-components
const StatCard = ({ title, value, trend, trendType, update, icon, iconBg = "bg-slate-100 text-[#003896]", valueColor = "text-slate-900" }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200">
    <div className="flex justify-between items-center mb-6">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>{icon}</div>
      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${trendType === 'up' ? 'bg-emerald-50 text-emerald-600' : trendType === 'down' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'}`}>{trend}</span>
    </div>
    <div className="space-y-1">
      <span className="text-[10px] font-bold text-slate-400 tracking-wider">{title}</span>
      <h3 className={`text-3xl font-bold ${valueColor}`}>{value}</h3>
      <p className="text-[10px] font-medium text-slate-400">{update}</p>
    </div>
  </div>
);

const OvertimeItem = ({ name, value, limit, color, textColor }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between text-xs font-bold">
      <span className="text-slate-700">{name}</span>
      <span className={textColor}>{value}h <span className="text-slate-400 font-medium">/ {limit}h</span></span>
    </div>
    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${(value / limit) * 100}%` }}></div>
    </div>
  </div>
);

const HolidayItem = ({ month, day, name, type }: any) => (
  <div className="flex items-center gap-4">
    <div className="w-12 h-12 bg-red-50 rounded-xl flex flex-col items-center justify-center text-red-500">
      <span className="text-[10px] font-bold leading-none mb-1">{month}</span>
      <span className="text-lg font-bold leading-none">{day}</span>
    </div>
    <div className="flex flex-col">
      <h4 className="text-sm font-bold leading-tight">{name}</h4>
      <p className="text-[10px] font-medium text-slate-500">{type}</p>
    </div>
  </div>
);

const EmployeesIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" /></svg>;
const CheckIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>;
const ClockIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18.36 6.64a9 9 0 1 1-12.73 0" /><line x1="12" y1="2" x2="12" y2="12" /></svg>;

export default Dashboard;
