import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/dashboard/stats`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Layout title="Overview Dashboard">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003896]"></div>
        </div>
      </Layout>
    );
  }

  const { stats, attendanceTrend, overtimeAnalytics, upcomingHolidays } = data || {};

  // Map attendance trend to days of week
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayName = days[d.getDay()];
    const record = attendanceTrend?.find((r: any) => r._id === dateStr);
    return { day: dayName, count: record ? record.count : 0 };
  });

  const maxAttendance = Math.max(...last7Days.map(d => d.count), 1);

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
            <StatCard title="TOTAL EMPLOYEES" value={stats?.totalEmployees || 0} trend="+2.4%" trendType="up" update="Updated just now" icon={<EmployeesIcon />} />
            <StatCard title="PRESENT TODAY" value={stats?.presentToday || 0} trend={`${Math.round((stats?.presentToday / (stats?.totalEmployees || 1)) * 100)}% Rate`} trendType="neutral" update="Daily Attendance" icon={<CheckIcon />} iconBg="bg-emerald-50 text-emerald-500" valueColor="text-emerald-500" />
            <StatCard title="ON LEAVE" value={stats?.onLeave || 0} trend="Active Requests" trendType="down" update="Current Status" icon={<ClockIcon />} iconBg="bg-orange-50 text-orange-500" valueColor="text-orange-500" />
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
              {last7Days.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-4 flex-1">
                  <div className="w-10 bg-slate-100 rounded-md relative h-[150px] flex items-end">
                    <div 
                      className={`w-full rounded-md transition-all duration-500 ${i === 6 ? 'bg-[#003896]' : 'bg-slate-200'}`} 
                      style={{ height: `${(d.count / maxAttendance) * 100}%` }}
                    >
                      {i === 6 && d.count > 0 && (
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#003896] text-white px-3 py-1 rounded text-[10px] font-bold whitespace-nowrap">
                          {d.count} today
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">{d.day}</span>
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
              {overtimeAnalytics?.length > 0 ? (
                overtimeAnalytics.map((item: any, idx: number) => (
                  <OvertimeItem key={idx} name={item._id} value={item.totalHours} limit={200} color={idx === 0 ? "bg-red-500" : "bg-[#003896]"} textColor={idx === 0 ? "text-red-500" : "text-[#003896]"} />
                ))
              ) : (
                <p className="text-sm text-slate-400">No overtime data available</p>
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                <h3 className="text-sm font-bold">Upcoming Leaves</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">Approved</span>
            </div>
            <div className="space-y-6">
              {upcomingHolidays?.length > 0 ? (
                upcomingHolidays.map((h: any, idx: number) => (
                  <HolidayItem 
                    key={idx} 
                    month={new Date(h.date).toLocaleString('default', { month: 'short' }).toUpperCase()} 
                    day={new Date(h.date).getDate().toString()} 
                    name={h.name} 
                    type={h.type} 
                  />
                ))
              ) : (
                <p className="text-sm text-slate-400">No upcoming leaves</p>
              )}
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
