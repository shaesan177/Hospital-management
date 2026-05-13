import React from 'react';
import Layout from '../components/Layout';

const Admin: React.FC = () => {
  return (
    <Layout title="Admin Control Panel" searchPlaceholder="Search audit logs...">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        <div className="col-span-full mb-4">
          <h1 className="text-3xl font-bold mb-2">Administrative Overview</h1>
          <p className="text-slate-500 text-sm font-medium">Manage system roles, permissions, and monitor security activity across the HMS network.</p>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="TOTAL ACTIVE USERS" value="1,284" trend="+2.4% ↑" trendType="up" icon={<UsersIcon />} />
            <StatCard title="ACTIVE ROLES" value="12" trend="Static" trendType="neutral" icon={<ShieldIcon />} />
            <StatCard title="PERMISSION CHANGES" value="42" trend="3 Alerts ⚠️" trendType="down" icon={<KeyIcon />} />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#003896]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                <h3 className="text-sm font-bold text-slate-700">Role Management</h3>
              </div>
              <button className="px-4 py-2 bg-[#003896] text-white rounded-lg text-xs font-bold hover:bg-[#002d7a]">
                + Create New Role
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Role Name</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Users</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <RoleRow name="Super Administrator" color="bg-red-500" users="4" description="Full system access, including financial and security configurations." />
                  <RoleRow name="Senior Physician" color="bg-blue-500" users="86" description="Medical record oversight, prescription authorization, and staff schedules." />
                  <RoleRow name="Medical Staff" color="bg-emerald-500" users="412" description="Standard access to patient records, diagnostics, and appointments." />
                  <RoleRow name="Billing Admin" color="bg-orange-500" users="18" description="Insurance processing, invoicing, and financial reporting modules." />
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-slate-50 flex justify-between items-center text-xs font-bold">
              <span className="text-slate-400">Showing 4 of 12 system roles</span>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">Previous</button>
                <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">Next</button>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <h3 className="text-sm font-bold">Security Audit Log</h3>
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
              </button>
            </div>
            <div className="space-y-6">
              <AuditItem icon={<AlertIcon />} bg="bg-red-50 text-red-500" title="Failed Login Attempt" meta="Admin-12 Account | IP: 192.168.1.104" time="2 mins ago" />
              <AuditItem icon={<EditIcon />} bg="bg-blue-50 text-blue-500" title="Permission Changed" meta='Role "Staff" modified by Dr. Sarah Smith' time="15 mins ago" />
              <AuditItem icon={<CheckIcon />} bg="bg-emerald-50 text-emerald-500" title="System Backup Completed" meta="Automated Weekly Backup (Encrypted)" time="1 hour ago" />
              <AuditItem icon={<UsersIcon />} bg="bg-slate-50 text-slate-500" title="New User Created" meta="Dr. James Wilson (Physician Role)" time="3 hours ago" />
              <AuditItem icon={<SettingsIcon />} bg="bg-slate-50 text-slate-500" title="API Key Regenerated" meta="Legacy billing service integration" time="5 hours ago" />
            </div>
            <button className="w-full mt-8 pt-6 border-t border-slate-100 text-[10px] font-bold text-[#003896] flex items-center justify-center gap-2 hover:opacity-80 transition-opacity">
              View Detailed Security Report <span>→</span>
            </button>
          </div>
          
          <div className="flex justify-center pt-4">
            <button className="w-12 h-12 bg-[#003896] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#003896]/20 hover:scale-105 transition-transform">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            </button>
          </div>
        </aside>
      </div>
    </Layout>
  );
};

const StatCard = ({ title, value, trend, trendType, icon }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200">
    <div className="flex justify-between items-center mb-6">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-100 text-[#003896]">{icon}</div>
      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${trendType === 'up' ? 'bg-emerald-50 text-emerald-600' : trendType === 'down' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'}`}>{trend}</span>
    </div>
    <div className="space-y-1">
      <span className="text-[10px] font-bold text-slate-400 tracking-wider">{title}</span>
      <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
    </div>
  </div>
);

const RoleRow = ({ name, color, users, description }: any) => (
  <tr className="hover:bg-slate-50 transition-colors">
    <td className="px-6 py-5">
      <div className="flex items-center gap-3">
        <span className={`w-2 h-2 rounded-full ${color}`}></span>
        <span className="text-sm font-bold text-slate-900">{name}</span>
      </div>
    </td>
    <td className="px-6 py-5">
      <p className="text-xs text-slate-500 max-w-[300px] leading-relaxed">{description}</p>
    </td>
    <td className="px-6 py-5">
      <span className="text-sm font-bold text-slate-700">{users}</span>
    </td>
    <td className="px-6 py-5 text-right">
      <div className="flex justify-end gap-4">
        <button className="text-xs font-bold text-[#003896] hover:underline">Edit</button>
        <button className="text-slate-300 hover:text-red-500 transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
        </button>
      </div>
    </td>
  </tr>
);

const AuditItem = ({ icon, bg, title, meta, time }: any) => (
  <div className="flex gap-4">
    <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${bg}`}>{icon}</div>
    <div className="flex-1 space-y-1">
      <h4 className="text-[11px] font-bold text-slate-900 leading-tight">{title}</h4>
      <p className="text-[10px] font-medium text-slate-400 leading-tight">{meta}</p>
      <p className="text-[10px] font-bold text-slate-300">{time}</p>
    </div>
  </div>
);

// Icons
const UsersIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const ShieldIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
const KeyIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.778-7.778zM12 7l.4 3.3 3.3.4.4 3.3 3.3.4" /></svg>;
const AlertIcon = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>;
const EditIcon = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
const CheckIcon = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>;
const SettingsIcon = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1-2.83 0l-.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>;

export default Admin;
