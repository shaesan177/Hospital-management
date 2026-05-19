import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    registerId: '',
    department: 'NURSING',
    designation: '',
    status: 'ON-DUTY',
    fatherName: '',
    sex: 'Male'
  });

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/employees`);
      const data = await response.json();
      setEmployees(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      name: '',
      email: '',
      registerId: '',
      department: 'NURSING',
      designation: '',
      status: 'ON-DUTY',
      fatherName: '',
      sex: 'Male'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (emp: any) => {
    setIsEditing(true);
    setEditingId(emp._id);
    setFormData({
      name: emp.name,
      email: emp.email,
      registerId: emp.registerId,
      department: emp.department,
      designation: emp.designation,
      status: emp.status,
      fatherName: emp.fatherName || '',
      sex: emp.sex || 'Male'
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}`}/api/employees/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchEmployees();
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEditing
        ? `${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}`}/api/employees/${editingId}`
        : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/employees`;

      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchEmployees();
        setFormData({
          name: '',
          email: '',
          registerId: '',
          department: 'NURSING',
          designation: '',
          status: 'ON-DUTY',
          fatherName: '',
          sex: 'Male'
        });
      }
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'adding'} employee:`, error);
    }
  };

  return (
    <Layout title="Employee Management" searchPlaceholder="Search employee by names.. , id or department">
      <div className="space-y-6">
        {/* Top Banner */}
        <div className="bg-[#003896] rounded-2xl p-6 md:p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-lg shadow-[#003896]/10">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 md:w-8 md:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">Employee Directory</h1>
              <p className="text-white/70 text-xs md:text-sm font-medium">Managing {employees.length} Active Medical & Administrative Staff</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full md:w-auto">
            <div className="text-left sm:text-center px-0 sm:px-6 border-none sm:border-r border-white/20 w-full sm:w-auto flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-center">
              <span className="text-[10px] font-bold text-white/50 block tracking-widest uppercase mb-0 sm:mb-1">TOTAL ON-DUTY</span>
              <span className="text-2xl font-bold">{employees.filter(e => e.status === 'ON-DUTY').length}</span>
            </div>
            <button
              onClick={openAddModal}
              className="w-full sm:w-auto bg-white text-[#003896] px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors flex justify-center items-center"
            >
              + Add New Employee
            </button>
          </div>
        </div>

        {/* Filter Bar and Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Employee Name</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Register ID</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Designation</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-10 text-slate-400">Loading staff members...</td></tr>
              ) : employees.map((emp, i) => (
                <tr key={emp._id || i} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="text-sm font-bold text-slate-900">{emp.name}</div>
                        <div className="text-[10px] font-medium text-slate-400">{emp.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-600">{emp.registerId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-50 text-[#003896] rounded-md text-[10px] font-bold whitespace-nowrap">{emp.department}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">
                    {emp.designation}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full animate-pulse ${emp.status === 'ON-DUTY' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                      <span className={`text-[10px] font-bold tracking-wide uppercase ${emp.status === 'ON-DUTY' ? 'text-emerald-600' : 'text-red-600'}`}>{emp.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link to={`/employee-profile/${emp._id}`} title="View Profile" className="p-2 text-slate-400 hover:text-[#003896] transition-colors">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                      </Link>
                      <button onClick={() => openEditModal(emp)} title="Edit Employee" className="p-2 text-slate-400 hover:text-amber-500 transition-colors">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                      </button>
                      <button onClick={() => handleDelete(emp._id)} title="Delete Employee" className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Employee Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="bg-[#003896] p-6 text-white flex justify-between items-center">
                <h2 className="text-xl font-bold">{isEditing ? 'Edit Employee Profile' : 'Register New Employee'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/10 p-2 rounded-lg transition-colors">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-h-[80vh] overflow-y-auto">
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
                <div className="col-span-1 md:col-span-2 flex flex-col sm:flex-row gap-4 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 px-6 py-3 bg-[#003896] text-white rounded-xl font-bold hover:bg-[#002d7a] transition-colors shadow-lg shadow-[#003896]/20">
                    {isEditing ? 'Save Changes' : 'Register Staff'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Employees;
