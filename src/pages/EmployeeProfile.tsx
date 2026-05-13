import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';

const EmployeeProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/employees/${id}`);
        const data = await response.json();
        setEmployee(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching employee:', error);
        setLoading(false);
      }
    };
    if (id) fetchEmployee();
  }, [id]);

  if (loading) return <Layout title="Loading..."><div className="p-10 text-center">Loading employee profile...</div></Layout>;
  if (!employee) return <Layout title="Not Found"><div className="p-10 text-center">Employee not found.</div></Layout>;

  return (
    <Layout 
      title="Employee Profile" 
      headerActions={
        <button 
          onClick={() => navigate('/employees')}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#003896] transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Back to Directory
        </button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
        {/* Left Sidebar */}
        <aside className="space-y-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-2xl bg-[#003896]/10 flex items-center justify-center text-3xl font-bold text-[#003896]">
                {employee.name.split(' ').map((n: any) => n[0]).join('')}
              </div>
              <span className={`absolute bottom-2 right-2 w-5 h-5 border-4 border-white rounded-full ${employee.status === 'ON-DUTY' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">{employee.name}</h2>
            <p className="text-sm font-medium text-slate-400 mb-4">{employee.designation}</p>
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wide uppercase mb-8 ${
              employee.status === 'ON-DUTY' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-[#003896]'
            }`}>
              {employee.status}
            </span>

            <div className="w-full space-y-6 text-left border-t border-slate-100 pt-8">
              <div>
                <span className="text-[10px] font-bold text-slate-400 tracking-wider block mb-1">EMPLOYEE ID</span>
                <p className="text-sm font-bold text-slate-700">{employee.registerId}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 tracking-wider block mb-1">DEPARTMENT</span>
                <p className="text-sm font-bold text-slate-700">{employee.department}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 tracking-wider block mb-1">SEX</span>
                <p className="text-sm font-bold text-slate-700">{employee.sex || 'Not Specified'}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 tracking-wider block mb-1">CONTACT DETAILS</span>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    {employee.email}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full mt-8">
              <button className="py-2.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">Edit</button>
              <button className="py-2.5 bg-[#003896] text-white rounded-lg text-xs font-bold hover:bg-[#002d7a] transition-colors">Message</button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider">Leave Summary</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-bold text-slate-700">Annual Leave</span>
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-900">11/15</span>
                    <p className="text-[10px] font-medium text-slate-400">Remaining</p>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '73%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-bold text-slate-700">Sick Leave</span>
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-900">5/8</span>
                    <p className="text-[10px] font-medium text-slate-400">Remaining</p>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: '62%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard icon={<AttendanceIcon />} label="ATTENDANCE RATE" value="98.4%" />
            <StatCard icon={<ClockIcon />} label="AVG. WORK HOURS" value="8.2h/day" />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="border-b border-slate-100">
              <nav className="flex px-6 overflow-x-auto">
                {['Attendance Log', 'Leave Requests', 'Salary & Benefits', 'Performance', 'Documents'].map((tab) => (
                  <button 
                    key={tab}
                    className={`px-6 py-5 text-sm font-bold whitespace-nowrap border-b-2 transition-all ${
                      tab === 'Attendance Log' ? 'border-[#003896] text-[#003896]' : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>
            
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-lg font-bold">Recent Attendance</h3>
                  <p className="text-xs font-medium text-slate-400 mt-1">Overview of the last 30 days of clock-in activities</p>
                </div>
              </div>

              <table className="w-full text-left">
                <thead className="border-b border-slate-100">
                  <tr>
                    <th className="py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</th>
                    <th className="py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Clock In</th>
                    <th className="py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Clock Out</th>
                    <th className="py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Work Hours</th>
                    <th className="py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <AttendanceRow date="Oct 24, 2023" in="08:45 AM" out="05:15 PM" hours="8h 30m" status="Present" statusBg="bg-emerald-50 text-emerald-600" />
                  <AttendanceRow date="Oct 23, 2023" in="08:52 AM" out="05:30 PM" hours="8h 38m" status="Present" statusBg="bg-emerald-50 text-emerald-600" />
                  <AttendanceRow date="Oct 21, 2023" in="09:15 AM" out="05:00 PM" hours="7h 45m" status="Late In" statusBg="bg-orange-50 text-orange-600" notes="Traffic delay" />
                  <AttendanceRow date="Oct 20, 2023" in="08:40 AM" out="05:20 PM" hours="8h 40m" status="Present" statusBg="bg-emerald-50 text-emerald-600" />
                </tbody>
              </table>
              <div className="mt-8 flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400">Showing recent entries</span>
                <button className="text-xs font-bold text-[#003896] hover:underline">View All Records</button>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 relative">
            <h3 className="text-lg font-bold mb-8">Work Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <ScheduleItem label="STANDARD SHIFT" title="Morning Shift (A)" meta="08:30 AM — 05:30 PM" />
              <ScheduleItem label="WEEKLY OFFS" title="Saturday & Sunday" meta="Full-time standard" />
              <ScheduleItem 
                label="LOCATION" 
                title="Main Campus" 
                meta="Building 4, Level 2" 
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const StatCard = ({ icon, label, value }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center gap-6">
    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#003896]">{icon}</div>
    <div>
      <span className="text-[10px] font-bold text-slate-400 tracking-wider">{label}</span>
      <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{value}</h3>
    </div>
  </div>
);

const AttendanceRow = ({ date, in: clockIn, out: clockOut, hours, status, statusBg, notes = "—" }: any) => (
  <tr className="group">
    <td className="py-5 text-sm font-bold text-slate-700">{date}</td>
    <td className="py-5 text-sm font-medium text-slate-500">{clockIn}</td>
    <td className="py-5 text-sm font-medium text-slate-500">{clockOut}</td>
    <td className="py-5 text-sm font-medium text-slate-400">{hours}</td>
    <td className="py-5">
      <span className={`px-2 py-1 rounded text-[10px] font-bold ${statusBg}`}>{status}</span>
    </td>
    <td className="py-5 text-right text-xs font-medium text-slate-400 italic">{notes}</td>
  </tr>
);

const ScheduleItem = ({ label, title, meta, icon }: any) => (
  <div className="space-y-3">
    <span className="text-[10px] font-bold text-slate-400 tracking-wider">{label}</span>
    <div className="flex items-center gap-3">
      {icon}
      <div>
        <h4 className="text-sm font-bold text-slate-700 leading-tight">{title}</h4>
        {meta && <p className="text-[10px] font-medium text-slate-400 mt-1">{meta}</p>}
      </div>
    </div>
  </div>
);

const AttendanceIcon = () => <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>;
const ClockIcon = () => <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;

export default EmployeeProfile;
