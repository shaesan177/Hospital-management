import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

interface Employee {
  _id: string;
  name: string;
  email: string;
  registerId: string;
  department: string;
  designation: string;
  status: string;
  fatherName: string;
  sex: string;
  createdAt?: string;
  basicSalary?: number;
  workingHoursPerDay?: number;
  otRatePerHour?: number;
  deductionRatePerHour?: number;
}

const EmployeeProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPayroll, setCurrentPayroll] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState<any[]>([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    registerId: '',
    department: 'NURSING',
    designation: '',
    status: 'ON-DUTY',
    fatherName: '',
    sex: 'Male',
    basicSalary: 0,
    workingHoursPerDay: 10,
    otRatePerHour: 0,
    deductionRatePerHour: 0
  });

  const fetchEmployee = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}`}/api/employees/${id}`);
      if (response.ok) {
        const data = await response.json();
        setEmployee(data);
        setFormData({
          name: data.name,
          email: data.email,
          registerId: data.registerId,
          department: data.department,
          designation: data.designation,
          status: data.status,
          fatherName: data.fatherName || '',
          sex: data.sex || 'Male',
          basicSalary: data.basicSalary || 0,
          workingHoursPerDay: data.workingHoursPerDay || 10,
          otRatePerHour: data.otRatePerHour || 0,
          deductionRatePerHour: data.deductionRatePerHour || 0
        });
      } else {
        console.error('Failed to fetch employee');
      }
    } catch (error) {
      console.error('Error fetching employee details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayroll = async () => {
    try {
      const d = new Date();
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payroll?month=${d.getMonth()}&year=${d.getFullYear()}`);
      if (response.ok) {
        const data = await response.json();
        const myPayroll = data.find((p: any) => p.employeeId === id);
        setCurrentPayroll(myPayroll);
      }
    } catch (error) {
      console.error('Error fetching payroll data:', error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchEmployee();
      fetchPayroll();
    }
  }, [id]);

  const fetchAttendanceHistory = async () => {
    setAttendanceLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/attendance/history/${id}`);
      if (response.ok) {
        const data = await response.json();
        setAttendanceHistory(data);
      }
    } catch (error) {
      console.error('Error fetching attendance history:', error);
    } finally {
      setAttendanceLoading(false);
    }
  };

  const handleOpenAttendanceReport = () => {
    fetchAttendanceHistory();
    setIsAttendanceModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}`}/api/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchEmployee();
      }
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}`}/api/employees/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          navigate('/employees');
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  if (loading) {
    return (
      <Layout title="Employee Profile">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#003896] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium">Loading employee details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!employee) {
    return (
      <Layout title="Employee Profile">
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Employee Not Found</h2>
          <p className="text-slate-500 mb-8">The employee profile you are looking for does not exist or has been removed.</p>
          <button
            onClick={() => navigate('/employees')}
            className="bg-[#003896] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#002d7a] transition-all"
          >
            Back to Directory
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title="Employee Profile"
      headerActions={
        <button
          onClick={() => navigate('/employees')}
          className="flex items-center gap-2 text-slate-600 hover:text-[#003896] font-bold text-sm transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Back to Directory
        </button>
      }
    >
      <div className="space-y-6 max-w-5xl">
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="h-32 bg-gradient-to-r from-[#003896] to-[#0052d4]"></div>
          <div className="px-8 pb-8">
            <div className="flex justify-between items-end -mt-12 mb-6">
              <div className="flex items-end gap-6">
                <div className="w-32 h-32 rounded-3xl bg-white p-2 shadow-xl border border-slate-100">
                  <div className="w-full h-full rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden">
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${employee.name}&backgroundColor=003896`}
                      alt={employee.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="pb-2">
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">{employee.name}</h1>
                  <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">{employee.designation}</p>
                </div>
              </div>
              <div className="flex gap-3 pb-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-2.5 bg-[#003896] text-white rounded-xl font-bold text-sm hover:bg-[#002d7a] transition-all shadow-lg shadow-[#003896]/20"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2.5 bg-slate-50 text-slate-400 border border-slate-200 rounded-xl hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" /></svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-6 pt-6 border-t border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">REGISTER ID</span>
                <span className="text-sm font-bold text-slate-700">{employee.registerId}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">DEPARTMENT</span>
                <span className="px-2.5 py-1 bg-blue-50 text-[#003896] rounded-md text-[10px] font-bold inline-block">{employee.department}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">STATUS</span>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${employee.status === 'ON-DUTY' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                  <span className={`text-xs font-bold ${employee.status === 'ON-DUTY' ? 'text-emerald-600' : 'text-red-600'}`}>{employee.status}</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">JOINING DATE</span>
                <span className="text-sm font-bold text-slate-700">{employee.createdAt ? new Date(employee.createdAt).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-[#003896]">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
              </div>

              <div className="grid grid-cols-2 gap-y-8 gap-x-12">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Full Legal Name</span>
                  <p className="text-sm font-bold text-slate-700">{employee.name}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Email Address</span>
                  <p className="text-sm font-bold text-slate-700">{employee.email}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Father's Name</span>
                  <p className="text-sm font-bold text-slate-700">{employee.fatherName || 'Not Specified'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Gender</span>
                  <p className="text-sm font-bold text-slate-700">{employee.sex}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-[#003896]">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Employment Details</h3>
              </div>

              <div className="grid grid-cols-2 gap-y-8 gap-x-12">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Current Department</span>
                  <p className="text-sm font-bold text-slate-700">{employee.department}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Job Title / Designation</span>
                  <p className="text-sm font-bold text-slate-700">{employee.designation}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Employee ID</span>
                  <p className="text-sm font-bold text-slate-700">{employee.registerId}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Reporting To</span>
                  <p className="text-sm font-bold text-slate-700">Head of {employee.department}</p>
                </div>
              </div>
            </div>

            {/* Payroll Configuration */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Payroll Configuration</h3>
              </div>

              <div className="grid grid-cols-2 gap-y-8 gap-x-12">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Monthly Salary</span>
                  <p className="text-sm font-bold text-slate-700">₹{(employee.basicSalary || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Working Hrs / Day</span>
                  <p className="text-sm font-bold text-slate-700">{employee.workingHoursPerDay || 10} Hours</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">OT Amount / Hr</span>
                  <p className="text-sm font-bold text-slate-700">₹{(employee.otRatePerHour || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Deduction / Hr</span>
                  <p className="text-sm font-bold text-slate-700">₹{(employee.deductionRatePerHour || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                </div>
              </div>
            </div>

            {/* Current Month Earnings */}
            {currentPayroll && (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Current Month Earnings (Est.)</h3>
              </div>

              <div className="grid grid-cols-3 gap-y-8 gap-x-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total OT Hrs</span>
                  <p className="text-sm font-bold text-[#003896]">{currentPayroll.otHours?.toFixed(1) || '0.0'}h</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total OT Amount</span>
                  <p className="text-sm font-bold text-slate-700">₹{(currentPayroll.otPay || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Net Payable</span>
                  <p className="text-sm font-black text-emerald-600">₹{(currentPayroll.net || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                </div>
              </div>
            </div>
            )}
          </div>

          {/* Quick Stats / Actions */}
          <div className="space-y-6">
            <div className="bg-[#003896] rounded-3xl p-8 text-white shadow-lg shadow-[#003896]/20">
              <h4 className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-6">Attendance Overview</h4>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-2xl font-bold">94%</span>
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Monthly Rate</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-[94%] h-full bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <span className="block text-[10px] font-bold text-white/40 uppercase mb-1">Present</span>
                    <span className="text-xl font-bold">22</span>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <span className="block text-[10px] font-bold text-white/40 uppercase mb-1">Leaves</span>
                    <span className="text-xl font-bold">02</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <h4 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-6">Quick Actions</h4>
              <div className="space-y-3">
                <button onClick={handleOpenAttendanceReport} className="w-full py-3 px-4 bg-slate-50 text-slate-700 rounded-xl text-sm font-bold text-left hover:bg-slate-100 transition-colors flex items-center justify-between group">
                  View Attendance Report
                  <svg className="w-4 h-4 text-slate-300 group-hover:text-[#003896] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
                </button>
                <button className="w-full py-3 px-4 bg-slate-50 text-slate-700 rounded-xl text-sm font-bold text-left hover:bg-slate-100 transition-colors flex items-center justify-between group">
                  Generate Salary Slip
                  <svg className="w-4 h-4 text-slate-300 group-hover:text-[#003896] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
                </button>
                <button className="w-full py-3 px-4 bg-slate-50 text-slate-700 rounded-xl text-sm font-bold text-left hover:bg-slate-100 transition-colors flex items-center justify-between group">
                  View Overtime Logs
                  <svg className="w-4 h-4 text-slate-300 group-hover:text-[#003896] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
                </button>
                <button className="w-full py-3 px-4 bg-slate-50 text-slate-700 rounded-xl text-sm font-bold text-left hover:bg-slate-100 transition-colors flex items-center justify-between group">
                  Holiday History
                  <svg className="w-4 h-4 text-slate-300 group-hover:text-[#003896] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="bg-[#003896] p-6 text-white flex justify-between items-center">
                <h2 className="text-xl font-bold">Edit Employee Profile</h2>
                <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/10 p-2 rounded-lg transition-colors">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                  <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#003896] text-sm font-medium" placeholder="e.g. Dr. Jane Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#003896] text-sm font-medium" placeholder="jane@hms.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Register ID</label>
                  <input required name="registerId" value={formData.registerId} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#003896] text-sm font-medium" placeholder="HMS-REG-XXXX" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Department</label>
                  <select name="department" value={formData.department} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#003896] text-sm font-medium">
                    <option>NURSING</option>
                    <option>MANAGER</option>
                    <option>ADMIN</option>
                    <option>OT ASSISTANT</option>
                    <option>WARD ASSISTANT</option>
                    <option>LAB TECHNICIAN</option>
                    <option>PHARMACY ASSISTANT</option>
                    <option>RECEPTIONIST</option>
                    <option>WATCHMAN</option>
                    <option>SWEEPER</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Designation</label>
                  <input required name="designation" value={formData.designation} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#003896] text-sm font-medium" placeholder="e.g. Senior Consultant" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Father's Name</label>
                  <input name="fatherName" value={formData.fatherName} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#003896] text-sm font-medium" placeholder="Father's Name" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sex</label>
                  <select name="sex" value={formData.sex} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#003896] text-sm font-medium">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#003896] text-sm font-medium">
                    <option>ON-DUTY</option>
                    <option>OFF-DUTY</option>
                    <option>ON-LEAVE</option>
                  </select>
                </div>
                
                {/* Payroll Config Inputs */}
                <div className="col-span-2 mt-4 pt-4 border-t border-slate-100"><h3 className="text-sm font-bold text-slate-900">Payroll Configuration</h3></div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monthly Base Salary</label>
                  <input type="number" name="basicSalary" value={formData.basicSalary} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#003896] text-sm font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Working Hours / Day</label>
                  <input type="number" name="workingHoursPerDay" value={formData.workingHoursPerDay} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#003896] text-sm font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">OT Rate / Hour</label>
                  <input type="number" name="otRatePerHour" value={formData.otRatePerHour} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#003896] text-sm font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Deduction Rate / Hour</label>
                  <input type="number" name="deductionRatePerHour" value={formData.deductionRatePerHour} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#003896] text-sm font-medium" />
                </div>
                <div className="col-span-2 flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 px-6 py-3 bg-[#003896] text-white rounded-xl font-bold hover:bg-[#002d7a] transition-colors shadow-lg shadow-[#003896]/20">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Attendance Report Modal */}
        {isAttendanceModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
              <div className="bg-[#003896] p-6 text-white flex justify-between items-center shrink-0">
                <h2 className="text-xl font-bold">Attendance Report - {employee.name}</h2>
                <button onClick={() => setIsAttendanceModalOpen(false)} className="hover:bg-white/10 p-2 rounded-lg transition-colors">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                {attendanceLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="w-8 h-8 border-4 border-[#003896] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : attendanceHistory.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 font-medium">No attendance records found for this employee.</div>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                        <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                        <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Check In</th>
                        <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Check Out</th>
                        <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Hrs</th>
                        <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">OT Hrs</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {attendanceHistory.map((record) => (
                        <tr key={record._id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-sm font-bold text-slate-900">{new Date(record.date).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${record.status === 'PRESENT' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                              {record.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600 font-medium">{record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '—'}</td>
                          <td className="px-4 py-3 text-sm text-slate-600 font-medium">{record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '—'}</td>
                          <td className="px-4 py-3 text-sm font-bold text-[#003896]">{record.totalHours ? record.totalHours.toFixed(1) + 'h' : '—'}</td>
                          <td className="px-4 py-3 text-sm font-bold text-orange-500">{record.otHours ? '+' + record.otHours.toFixed(1) + 'h' : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EmployeeProfile;
