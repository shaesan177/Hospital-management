import React, { useState, useEffect, useMemo } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

const Overtime: React.FC = () => {
  const [musterData, setMusterData] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ totalHours: 0, totalPayout: 0, pendingApprovals: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Form State
  const [formData, setFormData] = useState({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    hours: '',
    task: '',
    status: 'Pending'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [musterRes, statsRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/overtime/muster-roll?month=${selectedMonth}&year=${selectedYear}`),
        axios.get(`http://localhost:5000/api/overtime/stats?month=${selectedMonth}&year=${selectedYear}`)
      ]);
      setMusterData(musterRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching overtime data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);

  const filteredMusterData = useMemo(() => {
    return musterData.filter(item => 
      item.employee.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.employee.registerId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [musterData, searchQuery]);

  const handleApproveAll = async () => {
    try {
      await axios.post('http://localhost:5000/api/overtime/approve-all');
      alert('All pending overtime approved');
      fetchData();
    } catch (error) {
      console.error('Error approving all:', error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/overtime', formData);
      alert('Overtime updated');
      fetchData();
      setFormData({ ...formData, hours: '', task: '' });
    } catch (error) {
      console.error('Error updating overtime:', error);
    }
  };

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const daysArray = Array.from({ length: Math.min(daysInMonth, 7) }, (_, i) => (i + 1).toString().padStart(2, '0')); // Display first 7 days for UI space

  return (
    <Layout title="GOMATHY SPECIALITY" searchPlaceholder="Search functionality..." onSearch={setSearchQuery}>
      <div className="space-y-8 pb-12">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Overtime Muster Roll</h1>
            <p className="text-slate-500 text-sm font-medium">
              Monthly attendance and overtime validation for payroll processing.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors">
              <DownloadIcon />
              Export (Excel)
            </button>
            <button 
              onClick={handleApproveAll}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#003896] text-white rounded-lg text-sm font-bold hover:bg-[#002d7a] transition-colors"
            >
              <CheckDoubleIcon />
              Approve All Pending
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><SearchIconSmall /></div>
            <input
              type="text"
              placeholder="Search by Employee Name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-[#003896] transition-colors"
            />
          </div>
          <div className="md:col-span-3">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Year Selection</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><CalendarIconSmall /></div>
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium outline-none appearance-none"
              >
                {[2024, 2025, 2026].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="md:col-span-3">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Month Selection</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><CalendarIconSmall /></div>
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium outline-none appearance-none"
              >
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m, i) => (
                  <option key={m} value={i}>{m}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total OT Hours"
            value={stats.totalHours.toFixed(1)}
            unit="Hrs"
            subValue="+12% from Sept"
            subValueColor="text-emerald-500"
            trendIcon={<TrendingUpIcon />}
            icon={<ClockIconLarge />}
            iconBg="bg-blue-50 text-[#003896]"
          />
          <StatCard
            title="Total OT Payout"
            value={`₹${stats.totalPayout.toLocaleString()}`}
            subValue="Estimated for current cycle"
            subValueColor="text-slate-400"
            icon={<WalletIcon />}
            iconBg="bg-blue-50 text-[#003896]"
          />
          <StatCard
            title="Pending Approvals"
            value={stats.pendingApprovals}
            unit="Items"
            subValue="Requires immediate action"
            subValueColor="text-red-500"
            icon={<FileAlertIcon />}
            iconBg="bg-red-50 text-red-500"
          />
        </div>

        {/* Muster Roll Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-blue-50 text-[#003896] rounded-md"><TableIcon /></div>
              <h3 className="text-lg font-bold text-slate-800">Muster Roll Data</h3>
            </div>
            <div className="flex items-center gap-6">
              <LegendItem color="bg-emerald-500" label="Regular Shift" icon={<CheckSmallIcon />} />
              <LegendItem color="bg-blue-500" label="Overtime (+h)" />
              <LegendItem color="bg-slate-200" label="Holiday/Off" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-r border-slate-100 w-[300px]">Employee Information</th>
                  {daysArray.map(day => (
                    <th key={day} className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-r border-slate-100 text-center">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan={daysArray.length + 1} className="p-10 text-center text-slate-400">Loading muster roll...</td></tr>
                ) : filteredMusterData.map((item) => (
                  <MusterRow
                    key={item.employee._id}
                    name={item.employee.name}
                    id={item.employee.registerId}
                    role={item.employee.designation}
                    avatar={item.employee.name.charAt(0)}
                    days={item.dailyOT.slice(0, 7).map((d: any) => d ? { type: d.status === 'Approved' ? 'ot' : 'pending', value: `+${d.hours}h` } : { type: 'regular' })}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 h-full">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-900">Approval Status Summary</h3>
                <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-wider rounded-md">Filter: All Depts</span>
              </div>

              <div className="space-y-4">
                <StatusItem dot="bg-emerald-500" label="Approved for Payout" count={`${musterData.filter(m => m.dailyOT.some((d: any) => d?.status === 'Approved')).length} Employees`} />
                <StatusItem dot="bg-orange-500" label="Pending Dept Head Approval" count={`${stats.pendingApprovals} Employees`} />
                <StatusItem dot="bg-red-500" label="Flagged/Rejected" count="0 Employees" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-8">OverTime Muster Roll Entry</h3>

              <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Worker Selection</label>
                  <select 
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#003896] transition-colors text-sm"
                    required
                  >
                    <option value="">Select an employee...</option>
                    {musterData.map(m => (
                      <option key={m.employee._id} value={m.employee._id}>{m.employee.name} ({m.employee.registerId})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#003896] transition-colors text-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.hours}
                    onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                    placeholder="e.g. 4"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#003896] transition-colors text-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Task/Reason</label>
                  <input
                    type="text"
                    value={formData.task}
                    onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                    placeholder="Emergency Surgery Support"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#003896] transition-colors text-sm"
                  />
                </div>
                <div className="md:col-span-2 pt-4 flex justify-end">
                  <button type="submit" className="px-12 py-3.5 bg-[#003896] text-white rounded-xl text-sm font-bold hover:bg-[#002d7a] transition-colors">
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Sub-components
const StatCard = ({ title, value, unit, subValue, subValueColor, trendIcon, icon, iconBg }: any) => (
  <div className="bg-white p-8 rounded-2xl border border-slate-200 h-[180px] flex flex-col justify-between">
    <div className="flex justify-between items-start">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${iconBg}`}>
        {icon}
      </div>
      <div className="text-right">
        <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">{title}</span>
        <div className="flex items-baseline justify-end gap-1">
          <h3 className="text-3xl font-black text-slate-900 leading-none mt-1">{value}</h3>
          {unit && <span className="text-sm font-bold text-slate-400">{unit}</span>}
        </div>
      </div>
    </div>
    <div className="flex items-center gap-2">
      {trendIcon && <span className={subValueColor}>{trendIcon}</span>}
      <span className={`text-xs font-bold ${subValueColor}`}>{subValue}</span>
    </div>
  </div>
);

const MusterRow = ({ name, id, role, avatar, days }: any) => (
  <tr className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
    <td className="px-6 py-5 border-r border-slate-100">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 border border-slate-200">
          {avatar}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-900">{name}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{id} • {role}</span>
        </div>
      </div>
    </td>
    {days.map((day: any, i: number) => (
      <td key={i} className="px-6 py-5 border-r border-slate-100 text-center">
        <div className="flex justify-center items-center h-full">
          {day.type === 'regular' && (
            <div className="text-emerald-500">
              <CheckSmallIcon />
            </div>
          )}
          {day.type === 'ot' && (
            <span className="px-3 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg border border-blue-100">
              {day.value}
            </span>
          )}
          {day.type === 'pending' && (
            <span className="px-3 py-1.5 bg-orange-50 text-orange-600 text-[10px] font-black rounded-lg border border-orange-100">
              {day.value}
            </span>
          )}
        </div>
      </td>
    ))}
  </tr>
);

const LegendItem = ({ color, label, icon }: any) => (
  <div className="flex items-center gap-2">
    <div className={`w-4 h-4 rounded ${color} flex items-center justify-center text-[8px] text-white`}>
      {icon}
    </div>
    <span className="text-xs font-bold text-slate-500 whitespace-nowrap">{label}</span>
  </div>
);

const StatusItem = ({ dot, label, count }: any) => (
  <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
    <div className="flex items-center gap-3">
      <div className={`w-3 h-3 rounded-full ${dot}`}></div>
      <span className="text-sm font-bold text-slate-700">{label}</span>
    </div>
    <span className="text-sm font-black text-slate-900">{count}</span>
  </div>
);

// Icons
const DownloadIcon = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>;
const CheckDoubleIcon = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="7 13 12 18 22 8" /><polyline points="2 13 7 18 17 8" /></svg>;
const SearchIconSmall = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
const CalendarIconSmall = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
const TrendingUpIcon = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>;
const ClockIconLarge = () => <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const WalletIcon = () => <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>;
const FileAlertIcon = () => <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="18.01" /><line x1="12" y1="12" x2="12" y2="15" /></svg>;
const TableIcon = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /><line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" /></svg>;
const CheckSmallIcon = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>;

export default Overtime;
