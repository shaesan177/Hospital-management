import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : { name: 'Admin', role: 'admin' };

  let navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/admin', label: 'Admin', icon: <AdminIcon /> },
    { path: '/employees', label: 'Employees', icon: <EmployeesIcon /> },
    { path: '/attendance', label: 'Attendance', icon: <AttendanceIcon /> },
    { path: '/overtime', label: 'Overtime', icon: <OvertimeIcon /> },
    { path: '/holidays', label: 'Holidays', icon: <HolidaysIcon /> },
    { path: '/payroll', label: 'Payroll', icon: <PayrollIcon /> },
    { path: '/reports', label: 'Reports', icon: <ReportsIcon /> },
  ];

  if (user.role === 'manager') {
    navItems = navItems.filter(item => 
      ['/dashboard', '/attendance', '/employees', '/overtime', '/holidays', '/payroll'].includes(item.path)
    );
  }

  return (
    <aside className="w-[260px] bg-white border-r border-slate-200 flex flex-col fixed h-screen z-20">
      <div className="p-8 flex items-center gap-3">
        <div className="w-8 h-8 bg-[#003896] rounded-md flex items-center justify-center text-white">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2v20M2 12h20" />
          </svg>
        </div>
        <div className="flex flex-col">
          <h2 className="text-sm font-bold text-[#003896] leading-none mb-1">Medical Center</h2>
          <span className="text-[10px] font-bold text-slate-400 tracking-wider">ADMIN CONSOLE</span>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              location.pathname === item.path
                ? 'bg-slate-50 text-[#003896] border-r-4 border-[#003896] rounded-r-none'
                : 'text-slate-500 hover:bg-slate-50 hover:text-[#003896]'
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto">
        <div className="p-4 mx-3 mb-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col flex-1">
            <h4 className="text-[13px] font-black text-slate-900 leading-tight truncate">{user.name}</h4>
            <p className="text-[10px] font-bold text-slate-400 tracking-tight capitalize">{user.role}</p>
          </div>
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
            title="Logout"
          >
            <LogoutIcon />
          </button>
        </div>

        <div className="p-4 mx-3 mb-6 bg-[#001d52] rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-blue-300/60 uppercase tracking-widest mb-0.5">SYSTEM HEALTH</p>
            <h4 className="text-xs font-black text-white">Stable</h4>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
        </div>
      </div>
    </aside>
  );
};

// Icons
const DashboardIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
const AdminIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const EmployeesIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>;
const AttendanceIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const OvertimeIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const HolidaysIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>;
const PayrollIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
const ReportsIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>;
const LogoutIcon = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;

export default Sidebar;
