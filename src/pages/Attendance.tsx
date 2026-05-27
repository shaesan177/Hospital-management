import React, { useState, useEffect, useMemo } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

const Attendance: React.FC = () => {
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  const formatTimeTo12h = (isoString: string) => {
    if (!isoString || isoString === '—' || isoString === 'Pending') return '—';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatTimeForInput = (isoString: string) => {
    if (!isoString || isoString === '—' || isoString === 'Pending') return '';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const getDecimalTimeRelative = (isoString: string, baseDateStr: string) => {
    if (!isoString || isoString === '—' || isoString === 'Pending') return null;
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return null;
    const [year, month, day] = baseDateStr.split('-');
    const baseDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    baseDate.setHours(0, 0, 0, 0);
    return (date.getTime() - baseDate.getTime()) / (1000 * 60 * 60);
  };

  const [formData, setFormData] = useState({
    employeeId: '',
    natureOfWork: '',
    checkIn: '',
    checkOut: '',
    status: 'PRESENT'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}`}/api/attendance?date=${selectedDate}`);
      setAttendanceData(response.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const filteredData = useMemo(() => {
    return attendanceData.filter(item => {
      const matchesSearch = item.employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.employee.registerId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === 'All Status' || item.completionStatus === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [attendanceData, searchQuery, selectedStatus]);

  const stats = useMemo(() => {
    const present = attendanceData.filter(item => item.status === 'PRESENT').length;
    const totalOT = attendanceData.reduce((acc, item) => acc + (item.otHours || 0), 0);
    const incomplete = attendanceData.filter(item => item.status === 'PRESENT' && item.completionStatus === 'Incomplete').length;
    return { present, totalOT, incomplete };
  }, [attendanceData]);

  const handleManualEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeId) {
      alert('Please select an employee');
      return;
    }

    const checkInDec = formData.checkIn ? parseInt(formData.checkIn.replace(':', '')) : 0;
    const checkOutDec = formData.checkOut ? parseInt(formData.checkOut.replace(':', '')) : 0;

    const isCheckOutNextDay = Boolean(formData.checkOut && checkOutDec < checkInDec);

    const createDateStr = (timeStr: string, isNextDay: boolean = false) => {
      if (!timeStr) return null;
      const [year, month, day] = selectedDate.split('-');
      const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const [h, m] = timeStr.split(':');
      d.setHours(parseInt(h), parseInt(m), 0, 0);
      if (isNextDay) d.setDate(d.getDate() + 1);
      return d.toISOString();
    };

    try {
      const payload = {
        ...formData,
        checkIn: createDateStr(formData.checkIn, false),
        checkOut: createDateStr(formData.checkOut, isCheckOutNextDay),
        date: selectedDate
      };

      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/attendance`, payload);
      alert('Attendance updated successfully');
      fetchData();
      setFormData({
        employeeId: '',
        natureOfWork: '',
        checkIn: '',
        checkOut: '',
        status: 'PRESENT'
      });
    } catch (error) {
      console.error('Error updating attendance:', error);
      alert('Error updating attendance');
    }
  };

  return (
    <Layout title="GOMATHY SPECIALITY" searchPlaceholder="Search employees..." onSearch={setSearchQuery}>
      <div className="space-y-8 pb-12">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">Staff Attendance</h1>
            <p className="text-slate-500 text-sm font-medium">
              Manage daily shifts, break times, and automated overtime calculations for hospital staff.
            </p>
          </div>
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Date</label>
              <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl min-w-[200px] shadow-sm">
                <CalendarIcon />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="text-sm font-bold outline-none w-full bg-transparent"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Completion Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl min-w-[180px] text-sm font-bold outline-none appearance-none shadow-sm"
              >
                <option>All Status</option>
                <option>Completed</option>
                <option>Incomplete</option>
                <option>Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Today's Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SummaryCard
            title="Present Staff"
            value={stats.present}
            subtitle="Currently on duty"
            icon={<UsersIcon />}
            iconBg="bg-blue-50 text-[#003896]"
          />
          <SummaryCard
            title="Total OT Hours"
            value={stats.totalOT.toFixed(1)}
            subtitle="Extra hours recorded today"
            unit="Hrs"
            icon={<ClockIconLarge />}
            iconBg="bg-emerald-50 text-emerald-600"
          />
          <SummaryCard
            title="Incomplete Entries"
            value={stats.incomplete}
            subtitle="Requires checkout or break-end"
            icon={<AlertIcon />}
            iconBg="bg-orange-50 text-orange-500"
            warning={stats.incomplete > 0}
          />
        </div>

        {/* Attendance Table */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
            <h3 className="text-xl font-black text-slate-900">Shift Roster & Calculations</h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-400 uppercase">Standard: 10.0 Hrs</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100">Employee</th>
                  <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Shift Type</th>
                  <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Dates</th>
                  <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Check-In</th>
                  <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Check-Out</th>
                  <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Total Hours</th>
                  <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">OT Hours</th>
                  <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center min-w-[320px]">Shift Timeline (24H)</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan={9} className="p-12 text-center text-slate-400 font-bold">Loading records...</td></tr>
                ) : filteredData.length === 0 ? (
                  <tr><td colSpan={9} className="p-12 text-center text-slate-400 font-bold">No records found for this selection</td></tr>
                ) : filteredData.map((item) => (
                  <tr key={item.employee._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 border-r border-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-black text-slate-500 border border-slate-200">
                          {item.employee.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-900">{item.employee.name}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{item.employee.designation}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {(() => {
                        const h = item.checkIn ? new Date(item.checkIn).getHours() : null;
                        if (h === null) return <span className="text-slate-300">—</span>;
                        const shiftType = h >= 6 && h < 14 ? 'Day Shift' : h >= 14 && h < 22 ? 'Evening Shift' : 'Night Shift';
                        const sColor = shiftType === 'Night Shift' ? 'text-indigo-600 bg-indigo-50 border-indigo-200' : shiftType === 'Evening Shift' ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-emerald-600 bg-emerald-50 border-emerald-200';
                        return <span className={`px-2 py-1 rounded-md text-[9px] font-black tracking-widest border ${sColor} whitespace-nowrap`}>{shiftType}</span>;
                      })()}
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-bold text-slate-600 whitespace-nowrap">
                      {(() => {
                        if (!item.checkIn) return '—';
                        const startD = new Date(item.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        if (!item.checkOut) return startD;
                        const endD = new Date(item.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        return startD === endD ? startD : `${startD} - ${endD}`;
                      })()}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="text-sm font-bold text-slate-700">{formatTimeTo12h(item.checkIn)}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="text-sm font-bold text-slate-700">{formatTimeTo12h(item.checkOut)}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="text-sm font-black text-[#003896]">{item.totalHours.toFixed(1)}h</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {item.otHours > 0 ? (
                        <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[11px] font-black rounded-lg border border-orange-100">
                          +{item.otHours.toFixed(1)}h
                        </span>
                      ) : <span className="text-slate-300 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-4">
                      {(() => {
                        const entryHour = getDecimalTimeRelative(item.checkIn, selectedDate);
                        const exitHour = getDecimalTimeRelative(item.checkOut, selectedDate);

                        let intervals: { start: number, end: number }[] = [];
                        if (entryHour !== null && exitHour !== null) {
                          intervals.push({ start: entryHour, end: exitHour });
                        }

                        let otThreshold = Infinity;
                        let accumulated = 0;
                        for (let i = 0; i < intervals.length; i++) {
                          const duration = intervals[i].end - intervals[i].start;
                          if (accumulated + duration > 10) {
                            otThreshold = intervals[i].start + (10 - accumulated);
                            break;
                          }
                          accumulated += duration;
                        }

                        return (
                          <div className="flex items-center gap-[2px] justify-center">
                            {Array.from({ length: 24 }).map((_, h) => {
                              let fractionRegForTooltip = 0;
                              let fractionOTForTooltip = 0;
                              let isVisuallyActive = false;
                              let isVisuallyOT = false;
                              let isNightBlock = false;

                              for (const inv of intervals) {
                                const overlapStart = Math.max(h, inv.start);
                                const overlapEnd = Math.min(h + 1, inv.end);
                                if (overlapEnd > overlapStart) {
                                  if (overlapEnd <= otThreshold) {
                                    fractionRegForTooltip += (overlapEnd - overlapStart);
                                  } else if (overlapStart >= otThreshold) {
                                    fractionOTForTooltip += (overlapEnd - overlapStart);
                                  } else {
                                    fractionRegForTooltip += (otThreshold - overlapStart);
                                    fractionOTForTooltip += (overlapEnd - otThreshold);
                                  }
                                }

                                if (h >= Math.floor(inv.start) && h <= Math.floor(inv.end)) {
                                  isVisuallyActive = true;
                                  if (h >= Math.floor(otThreshold)) {
                                    isVisuallyOT = true;
                                  }
                                }

                                if (inv.start >= 18 || inv.end <= 8 || inv.end > 24 || inv.start < 0) {
                                  isNightBlock = true;
                                }
                              }

                              return (
                                <div key={h} className="relative w-3 h-5 bg-slate-100 rounded-sm overflow-hidden flex-shrink-0 shadow-inner group flex">
                                  {isVisuallyActive && !isVisuallyOT && (
                                    <div 
                                      className={`transition-all duration-300 w-full ${isNightBlock ? 'bg-indigo-400' : 'bg-emerald-400'}`}
                                    />
                                  )}
                                  {isVisuallyActive && isVisuallyOT && (
                                    <div 
                                      className={`transition-all duration-300 w-full bg-orange-400`}
                                    />
                                  )}
                                  <div className="absolute opacity-0 group-hover:opacity-100 bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-slate-800 text-white text-[8px] font-bold rounded pointer-events-none whitespace-nowrap z-50">
                                    {h}:00 - {h+1}:00 (Reg: {(fractionRegForTooltip * 60).toFixed(0)}m, OT: {(fractionOTForTooltip * 60).toFixed(0)}m)
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <StatusBadge status={item.completionStatus} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Manual Entry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-12 bg-white rounded-[2rem] border border-slate-200 p-10 shadow-xl shadow-slate-200/50">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-blue-50 text-[#003896] rounded-2xl"><EditIcon /></div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">Attendance Log Entry</h3>
                <p className="text-sm font-medium text-slate-500">Record check-in/out and break times for the selected date.</p>
              </div>
            </div>

            <form onSubmit={handleManualEntry} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="space-y-2 lg:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Staff Member</label>
                <select
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#003896] focus:bg-white transition-all text-sm font-bold"
                  value={formData.employeeId}
                  onChange={(e) => {
                    const empId = e.target.value;
                    const record = attendanceData.find(item => item.employee._id === empId);
                    setFormData({
                      ...formData,
                      employeeId: empId,
                      natureOfWork: record ? record.natureOfWork : '',
                      checkIn: record ? formatTimeForInput(record.checkIn) : '',
                      checkOut: record ? formatTimeForInput(record.checkOut) : '',
                      status: record ? record.status : 'PRESENT'
                    });
                  }}
                  required
                >
                  <option value="">Select an employee...</option>
                  {attendanceData.map(item => (
                    <option key={item.employee._id} value={item.employee._id}>
                      {item.employee.name} ({item.employee.registerId})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 lg:col-span-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shift Status</label>
                <select
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#003896] focus:bg-white transition-all text-sm font-bold"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="PRESENT">Present</option>
                  <option value="ABSENT">Absent</option>
                </select>
              </div>

              <div className="space-y-2 lg:col-span-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nature of Work</label>
                <input
                  type="text"
                  value={formData.natureOfWork}
                  onChange={(e) => setFormData({ ...formData, natureOfWork: e.target.value })}
                  placeholder="e.g. Ward Duty"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#003896] focus:bg-white transition-all text-sm font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Check-In</label>
                <input
                  type="time"
                  value={formData.checkIn}
                  onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#003896] focus:bg-white transition-all text-sm font-bold"
                />
              </div>



              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Check-Out</label>
                <input
                  type="time"
                  value={formData.checkOut}
                  onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#003896] focus:bg-white transition-all text-sm font-bold"
                />
              </div>

              <div className="lg:col-span-4 pt-6 flex justify-end">
                <button
                  type="submit"
                  className="px-16 py-4 bg-[#003896] text-white rounded-2xl text-sm font-black shadow-xl shadow-blue-900/20 hover:bg-[#002d7a] transition-all active:scale-95 uppercase tracking-widest"
                >
                  Update Log
                </button>
              </div>
            </form>

            {/* Live Preview Section */}
            {(formData.checkIn || formData.checkOut) && (
              <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-wrap gap-8 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Est. Total Hours</span>
                  <p className="text-lg font-black text-slate-900">
                    {(() => {
                      const start = formData.checkIn ? parseInt(formData.checkIn.split(':')[0]) + parseInt(formData.checkIn.split(':')[1]) / 60 : 0;
                      const end = formData.checkOut ? parseInt(formData.checkOut.split(':')[0]) + parseInt(formData.checkOut.split(':')[1]) / 60 : 0;
                      let diff = end - start;
                      if (diff < 0) diff += 24;
                      return diff.toFixed(1);
                    })()}h
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-[#003896] uppercase">Est. Net Hours</span>
                  <p className="text-lg font-black text-[#003896]">
                    {(() => {
                      const s1 = formData.checkIn ? parseInt(formData.checkIn.split(':')[0]) + parseInt(formData.checkIn.split(':')[1]) / 60 : 0;
                      const e1 = formData.checkOut ? parseInt(formData.checkOut.split(':')[0]) + parseInt(formData.checkOut.split(':')[1]) / 60 : 0;
                      let total = e1 - s1; if (total < 0) total += 24;
                      return Math.max(0, total).toFixed(1);
                    })()}h
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-orange-500 uppercase">Est. OT Hours</span>
                  <p className="text-lg font-black text-orange-500">
                    {(() => {
                      const s1 = formData.checkIn ? parseInt(formData.checkIn.split(':')[0]) + parseInt(formData.checkIn.split(':')[1]) / 60 : 0;
                      const e1 = formData.checkOut ? parseInt(formData.checkOut.split(':')[0]) + parseInt(formData.checkOut.split(':')[1]) / 60 : 0;
                      let total = e1 - s1; if (total < 0) total += 24;
                      const net = Math.max(0, total);
                      const ot = Math.max(0, net - 10);
                      return ot.toFixed(1);
                    })()}h
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Sub-components
const SummaryCard = ({ title, value, subtitle, unit, icon, iconBg, warning }: any) => (
  <div className={`bg-white p-8 rounded-[2rem] border ${warning ? 'border-orange-200' : 'border-slate-200'} shadow-sm flex flex-col justify-between h-[180px] hover:shadow-lg transition-shadow`}>
    <div className="flex justify-between items-start">
      <div className="space-y-1">
        <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">{title}</span>
        <div className="flex items-baseline gap-1">
          <h3 className={`text-4xl font-black ${warning ? 'text-orange-500' : 'text-slate-900'} leading-none`}>{value}</h3>
          {unit && <span className="text-sm font-black text-slate-400">{unit}</span>}
        </div>
      </div>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${iconBg}`}>
        {icon}
      </div>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-slate-400">{subtitle}</span>
    </div>
  </div>
);

const StatusBadge = ({ status }: any) => {
  const styles: any = {
    Completed: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    Incomplete: 'bg-orange-50 text-orange-600 border-orange-100',
    Pending: 'bg-slate-50 text-slate-400 border-slate-100',
  };

  return (
    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${styles[status]}`}>
      {status}
    </span>
  );
};

// Icons
const CalendarIcon = () => <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
const UsersIcon = () => <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const ClockIconLarge = () => <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const AlertIcon = () => <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>;
const EditIcon = () => <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;

export default Attendance;
