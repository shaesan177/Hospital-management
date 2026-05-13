import React from 'react';
import Layout from '../components/Layout';

const Attendance: React.FC = () => {
  return (
    <Layout title="GOMATHY SPECIALITY" searchPlaceholder="Search employee or records...">
      <div className="space-y-8 pb-12">
        {/* Attendance Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Attendance Tracking</h1>
            <p className="text-slate-500 text-sm font-medium">
              Monitor daily hospital staff attendance, work nature, and shift hours for optimized labor management.
            </p>
          </div>
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Date</label>
              <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg min-w-[180px]">
                <CalendarIcon />
                <input type="text" defaultValue="10/27/2023" className="text-sm font-medium outline-none w-full" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Department</label>
              <select className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg min-w-[180px] text-sm font-medium outline-none appearance-none">
                <option>All Departments</option>
              </select>
            </div>
            <button className="flex items-center gap-2 px-6 py-2 bg-[#003896] text-white rounded-lg text-sm font-bold h-[42px] hover:bg-[#002d7a] transition-colors">
              <DownloadIcon />
              Export CSV
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="TOTAL WORKERS" 
            value="1,248" 
            subValue="+4% from yesterday" 
            subValueColor="text-emerald-500"
            trendIcon={<TrendingUpIcon />}
            icon={<UsersIcon />} 
            iconBg="bg-blue-50 text-[#003896]"
          />
          <StatCard 
            title="PRESENT TODAY" 
            value="1,182" 
            subValue="94.7% Attendance rate" 
            subValueColor="text-slate-400"
            icon={<CheckCircleIcon />} 
            iconBg="bg-emerald-50 text-emerald-500"
          />
          <StatCard 
            title="ABSENT/LATE" 
            value="66" 
            subValue="Requires follow-up" 
            subValueColor="text-red-500"
            icon={<AlertIcon />} 
            iconBg="bg-red-50 text-red-500"
          />
          <StatCard 
            title="ACTIVE SHIFTS" 
            value="482" 
            subValue="Current morning shift" 
            subValueColor="text-slate-400"
            icon={<ClockIcon />} 
            iconBg="bg-slate-50 text-slate-400"
          />
        </div>

        {/* Attendance Roster Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Attendance Roster</h3>
            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-400 hover:text-slate-600"><FilterIcon /></button>
              <button className="p-2 text-slate-400 hover:text-slate-600"><MoreIcon /></button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Worker Name</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Father's Name</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sex</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Nature of Work</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Entry Time</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Exit Time</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Rest</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <TableRow 
                  name="kumaran" 
                  id="#WL-4921" 
                  avatar="RJ"
                  avatarColor="bg-slate-100 text-slate-500"
                  fatherName="Suresh Kumar" 
                  sex="Male" 
                  nature="Technician" 
                  entry="08:00 AM" 
                  exit="04:30 PM" 
                  rest="60 min" 
                  status="PRESENT" 
                />
                <TableRow 
                  name="chithrakala" 
                  id="#WL-5012" 
                  avatar="AS"
                  avatarColor="bg-slate-100 text-slate-500"
                  fatherName="Kamaraj" 
                  sex="Female" 
                  nature="Ward Assistant" 
                  entry="08:15 AM" 
                  exit="04:45 PM" 
                  rest="45 min" 
                  status="PRESENT" 
                />
                <TableRow 
                  name="Hari" 
                  id="#WL-3812" 
                  avatar="MS"
                  avatarColor="bg-blue-50 text-[#003896]"
                  fatherName="Dev Sharma" 
                  sex="Male" 
                  nature="Security" 
                  entry="—" 
                  exit="—" 
                  rest="—" 
                  status="ABSENT" 
                />
                <TableRow 
                  name="Shruthi" 
                  id="#WL-9201" 
                  avatar="PD"
                  avatarColor="bg-slate-100 text-slate-500"
                  fatherName="Radha Krishnan" 
                  sex="Female" 
                  nature="Cleaner" 
                  entry="07:55 AM" 
                  exit="04:00 PM" 
                  rest="30 min" 
                  status="PRESENT" 
                />
                <TableRow 
                  name="Naveen" 
                  id="#WL-2283" 
                  avatar="AK"
                  avatarColor="bg-slate-100 text-slate-500"
                  fatherName="Radha Krishnan" 
                  sex="Male" 
                  nature="Security" 
                  entry="08:05 AM" 
                  exit="Pending" 
                  rest="45 min" 
                  status="PRESENT" 
                />
              </tbody>
            </table>
          </div>
          <div className="p-6 bg-white border-t border-slate-100 flex justify-between items-center text-sm">
            <span className="text-slate-500">Showing 1 to 5 of 1,248 workers</span>
            <div className="flex gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-400"><ChevronLeftIcon /></button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-[#003896] text-white">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-slate-50">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-slate-50">3</button>
              <span className="px-2">...</span>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-slate-50">250</button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-400"><ChevronRightIcon /></button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-1">Manual Attendance Entry</h3>
            <p className="text-slate-500 text-sm mb-8">Quickly log attendance for workers without digital badges.</p>
            
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Worker Search</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><SearchIconSmall /></div>
                  <input 
                    type="text" 
                    placeholder="Enter name or ID..." 
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-[#003896] transition-colors text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nature of Work</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-[#003896] transition-colors text-sm">
                  <option>Select Work Category</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Entry Time</label>
                <input 
                  type="text" 
                  placeholder="--:-- --" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-[#003896] transition-colors text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Exit Time</label>
                <input 
                  type="text" 
                  placeholder="--:-- --" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-[#003896] transition-colors text-sm"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Attendance Status</label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" name="status" className="hidden" defaultChecked />
                    <div className="w-5 h-5 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover:border-[#003896] transition-colors">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#003896] scale-100 transition-transform"></div>
                    </div>
                    <span className="text-sm font-medium text-slate-700">Present</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" name="status" className="hidden" />
                    <div className="w-5 h-5 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover:border-[#003896] transition-colors">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#003896] scale-0 transition-transform"></div>
                    </div>
                    <span className="text-sm font-medium text-slate-700">Absent</span>
                  </label>
                </div>
              </div>
              <div className="md:col-span-2 pt-4 flex justify-end">
                <button className="px-10 py-3 bg-[#003896] text-white rounded-xl text-sm font-bold hover:bg-[#002d7a] transition-colors">
                  Update
                </button>
              </div>
            </form>
          </div>

          <div className="bg-[#003896] rounded-2xl p-8 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">Need Support?</h3>
              <p className="text-blue-100 text-sm mb-8 leading-relaxed">
                Contact the central hospital administration for payroll discrepancies or system issues.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <PhoneIcon />
                  </div>
                  <span className="font-bold">+1 (800) 555-LABOR</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <MailIcon />
                  </div>
                  <span className="font-bold">support@medlabor.com</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 relative z-10">
              <div className="rounded-xl overflow-hidden bg-white/5 p-1">
                <img 
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400" 
                  alt="Support" 
                  className="w-full h-40 object-cover rounded-lg opacity-80"
                />
              </div>
            </div>

            {/* Decorative background circles */}
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/5 rounded-full"></div>
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-white/5 rounded-full"></div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Components
const StatCard = ({ title, value, subValue, subValueColor, trendIcon, icon, iconBg }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col justify-between h-[180px]">
    <div className="flex justify-between items-start">
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">{title}</span>
        <h3 className="text-4xl font-bold text-slate-900 leading-none">{value}</h3>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
        {icon}
      </div>
    </div>
    <div className="flex items-center gap-2">
      {trendIcon && <span className={subValueColor}>{trendIcon}</span>}
      <span className={`text-xs font-bold ${subValueColor}`}>{subValue}</span>
    </div>
  </div>
);

const TableRow = ({ name, id, avatar, avatarColor, fatherName, sex, nature, entry, exit, rest, status }: any) => (
  <tr className="hover:bg-slate-50 transition-colors">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${avatarColor}`}>
          {avatar}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-900">{name}</span>
          <span className="text-[11px] font-medium text-slate-400">{id}</span>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 text-sm font-medium text-slate-600">{fatherName}</td>
    <td className="px-6 py-4 text-sm font-medium text-slate-600">{sex}</td>
    <td className="px-6 py-4">
      <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md uppercase">
        {nature}
      </span>
    </td>
    <td className="px-6 py-4 text-sm font-bold text-slate-700">{entry}</td>
    <td className="px-6 py-4 text-sm font-bold text-slate-700">{exit}</td>
    <td className="px-6 py-4 text-sm font-medium text-slate-600">{rest}</td>
    <td className="px-6 py-4">
      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold w-fit ${
        status === 'PRESENT' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
      }`}>
        <div className={`w-1.5 h-1.5 rounded-full ${status === 'PRESENT' ? 'bg-emerald-600' : 'bg-red-600'}`}></div>
        {status}
      </span>
    </td>
  </tr>
);

// Icons
const CalendarIcon = () => <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
const DownloadIcon = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>;
const UsersIcon = () => <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const CheckCircleIcon = () => <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>;
const AlertIcon = () => <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>;
const ClockIcon = () => <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const TrendingUpIcon = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>;
const FilterIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" /></svg>;
const MoreIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>;
const ChevronLeftIcon = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>;
const ChevronRightIcon = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>;
const SearchIconSmall = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
const PhoneIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>;
const MailIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>;

export default Attendance;
