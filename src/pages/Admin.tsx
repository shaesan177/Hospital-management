import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

const Admin: React.FC = () => {
  const [stats, setStats] = useState({ totalUsers: 0, activeRoles: 0, permissionChanges: 0 });
  const [employees, setEmployees] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [accessForm, setAccessForm] = useState({
    employeeId: '',
    role: 'staff',
    password: ''
  });
  const [accessMessage, setAccessMessage] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, employeesRes, logsRes] = await Promise.all([
        fetch('http://localhost:5000/api/admin/stats'),
        fetch('http://localhost:5000/api/employees'),
        fetch('http://localhost:5000/api/admin/audit-logs')
      ]);

      const statsData = await statsRes.json();
      const employeesData = await employeesRes.json();
      const logsData = await logsRes.json();

      setStats(statsData);
      setEmployees(employeesData);
      setAuditLogs(logsData);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGrantAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccessMessage('');
    const employee = employees.find(emp => emp._id === accessForm.employeeId);
    if (!employee) return;

    try {
      await axios.post('http://localhost:5000/api/admin/give-access', {
        email: employee.email,
        name: employee.name,
        password: accessForm.password,
        role: accessForm.role
      });
      setAccessMessage('Access granted successfully!');
      setAccessForm({ employeeId: '', role: 'staff', password: '' });
      fetchData(); // refresh audit logs
    } catch (error: any) {
      setAccessMessage(error.response?.data?.message || 'Error granting access');
    }
  };

  return (
    <Layout title="Admin Control Panel" searchPlaceholder="Search audit logs...">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        <div className="col-span-full mb-4">
          <h1 className="text-3xl font-bold mb-2">Administrative Overview</h1>
          <p className="text-slate-500 text-sm font-medium">Manage system roles, permissions, and monitor security activity across the HMS network.</p>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="TOTAL ACTIVE USERS" value={stats.totalUsers} trend="+2.4%" trendType="up" icon={<UsersIcon />} />
            <StatCard title="ACTIVE ROLES" value={stats.activeRoles} trend="Static" trendType="neutral" icon={<ShieldIcon />} />
            <StatCard title="PERMISSION CHANGES" value={stats.permissionChanges} trend="Alerts active" trendType="down" icon={<KeyIcon />} />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#003896]/10 flex items-center justify-center text-[#003896]">
                  <KeyIcon />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Access Management</h3>
                  <p className="text-xs font-bold text-slate-500">Grant system access to existing employees</p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              {accessMessage && (
                <div className={`p-4 mb-6 rounded-lg text-sm font-bold ${accessMessage.includes('successfully') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                  {accessMessage}
                </div>
              )}
              <form onSubmit={handleGrantAccess} className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Employee</label>
                    <select 
                      value={accessForm.employeeId}
                      onChange={(e) => setAccessForm({...accessForm, employeeId: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#003896] focus:bg-white transition-all text-sm font-bold"
                      required
                    >
                      <option value="">Choose an employee...</option>
                      {employees.map(emp => (
                        <option key={emp._id} value={emp._id}>{emp.name} ({emp.registerId})</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assign Role</label>
                    <select 
                      value={accessForm.role}
                      onChange={(e) => setAccessForm({...accessForm, role: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#003896] focus:bg-white transition-all text-sm font-bold"
                    >
                      <option value="staff">Staff (Basic Access)</option>
                      <option value="manager">Manager (Elevated Access)</option>
                      <option value="admin">Administrator (Full Access)</option>
                    </select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Temporary Password</label>
                    <input 
                      type="text"
                      value={accessForm.password}
                      onChange={(e) => setAccessForm({...accessForm, password: e.target.value})}
                      placeholder="Enter a secure temporary password"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#003896] focus:bg-white transition-all text-sm font-bold"
                      required
                      minLength={5}
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button type="submit" className="px-8 py-4 bg-[#003896] hover:bg-[#002d7a] text-white rounded-xl text-sm font-black shadow-lg shadow-[#003896]/20 transition-all uppercase tracking-wider flex items-center gap-2">
                    <KeyIcon /> Grant System Access
                  </button>
                </div>
              </form>
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
              <button onClick={fetchData} className="text-slate-400 hover:text-slate-600">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
              </button>
            </div>
            <div className="space-y-6">
              {loading ? (
                <p className="text-xs text-slate-400 text-center">Loading logs...</p>
              ) : auditLogs.map((log: any) => (
                <AuditItem 
                  key={log._id}
                  icon={log.status === 'FAILURE' ? <AlertIcon /> : log.type === 'PERMISSION' ? <EditIcon /> : log.type === 'BACKUP' ? <CheckIcon /> : log.type === 'USER_CREATE' ? <UsersIcon /> : <SettingsIcon />} 
                  bg={log.status === 'FAILURE' ? 'bg-red-50 text-red-500' : log.status === 'WARNING' ? 'bg-orange-50 text-orange-500' : 'bg-emerald-50 text-emerald-500'} 
                  title={log.title} 
                  meta={log.meta} 
                  time={new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                />
              ))}
            </div>
            <button className="w-full mt-8 pt-6 border-t border-slate-100 text-[10px] font-bold text-[#003896] flex items-center justify-center gap-2 hover:opacity-80 transition-opacity">
              View Detailed Security Report <span>-&gt;</span>
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
