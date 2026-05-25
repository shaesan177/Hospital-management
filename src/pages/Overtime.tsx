import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

const Overtime: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);

  const hoursArray = [
    '12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM',
    '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'
  ];

  // Form State
  const [formData, setFormData] = useState({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    hours: '',
    startTime: '',
    endTime: '',
    task: '',
    status: 'Pending'
  });

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}`}/api/attendance?date=${selectedDate}`);
      setAttendanceRecords(response.data);
    } catch (error) {
      console.error('Error fetching attendance for timeline:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate]);

  const getDecimalTimeRelative = (isoString: string, baseDateStr: string) => {
    if (!isoString || isoString === '—' || isoString === 'Pending') return null;
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return null;
    const [year, month, day] = baseDateStr.split('-');
    const baseDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    baseDate.setHours(0,0,0,0);
    return (date.getTime() - baseDate.getTime()) / (1000 * 60 * 60);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/overtime`, formData);
      alert('Overtime updated');
      fetchAttendance();
      setFormData({ ...formData, hours: '', task: '', startTime: '', endTime: '' });
    } catch (error) {
      console.error('Error updating overtime:', error);
    }
  };

  return (
    <Layout title="GOMATHY SPECIALITY" searchPlaceholder="Search functionality..." onSearch={() => {}}>
      <div className="space-y-8 pb-12 min-w-0 w-full">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Overtime Tracking</h1>
            <p className="text-slate-500 text-sm font-medium">
              View daily attendance and overtime records by date.
            </p>
          </div>
        </div>

        {/* Daily Time Log Timeline */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden w-full shadow-lg shadow-slate-200/40">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 text-orange-600 rounded-xl"><ClockIconLarge /></div>
              <div>
                <h3 className="text-lg font-black text-slate-800">Daily Attendance & Overtime Timeline</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Viewing entry and exit points for {selectedDate}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
              <div className="flex flex-wrap items-center gap-2 sm:mr-4">
                <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase"><div className="w-2.5 h-2.5 rounded-sm bg-emerald-400"></div> Normal Shift</span>
                <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase sm:ml-2"><div className="w-2.5 h-2.5 rounded-sm bg-orange-400"></div> Overtime</span>
              </div>
              <div className="w-full sm:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Select Date</label>
                <input 
                  type="date" 
                  value={selectedDate} 
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full sm:w-auto px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-[#003896] shadow-sm"
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100 sticky left-0 bg-white z-20 w-[200px] shadow-[2px_0_5px_rgba(0,0,0,0.02)]">Employee</th>
                  {hoursArray.map(hour => (
                    <th key={hour} className={`px-1 py-5 text-[9px] font-black uppercase tracking-widest border-r border-slate-100 text-center w-[45px] ${hour.includes('8 PM') || hour.includes('9 PM') || hour.includes('10 PM') || hour.includes('11 PM') ? 'text-orange-500 bg-orange-50/30' : 'text-slate-400'}`}>
                      {hour}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan={25} className="p-12 text-center text-slate-400 font-bold">Loading attendance records...</td></tr>
                ) : attendanceRecords.length === 0 ? (
                  <tr><td colSpan={25} className="p-12 text-center text-slate-400 font-bold">No attendance records found for this date.</td></tr>
                ) : attendanceRecords.map((record) => {
                  const entryHour = getDecimalTimeRelative(record.checkIn, selectedDate);
                  const exitHour = getDecimalTimeRelative(record.checkOut, selectedDate);
                  const bStartHour = getDecimalTimeRelative(record.breakStart, selectedDate);
                  const bEndHour = getDecimalTimeRelative(record.breakEnd, selectedDate);

                  let intervals: {start: number, end: number}[] = [];
                  if (entryHour !== null && exitHour !== null) {
                    if (bStartHour !== null && bEndHour !== null) {
                      intervals.push({ start: entryHour, end: bStartHour });
                      intervals.push({ start: bEndHour, end: exitHour });
                    } else {
                      intervals.push({ start: entryHour, end: exitHour });
                    }
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
                    <tr key={record.employee._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 border-r border-slate-100 sticky left-0 bg-white group-hover:bg-slate-50 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.02)] transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 border border-slate-200">
                            {record.employee.name.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-slate-900">{record.employee.name}</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{record.employee.registerId}</span>
                          </div>
                        </div>
                      </td>
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

                          // Determine night shift
                          if (inv.start >= 18 || inv.end <= 8 || inv.end > 24 || inv.start < 0) {
                            isNightBlock = true;
                          }
                        }

                        return (
                          <td key={h} className={`border-r border-slate-50 text-center p-1 h-14 min-w-[45px] relative`}>
                            <div className="absolute inset-y-2 left-1 right-1 bg-slate-100 rounded-md overflow-hidden shadow-inner group-hover:bg-slate-200/50 transition-colors flex">
                              {isVisuallyActive && !isVisuallyOT && (
                                <div 
                                  className={`transition-all duration-500 w-full ${isNightBlock ? 'bg-gradient-to-r from-indigo-400 to-purple-500' : 'bg-gradient-to-r from-emerald-400 to-green-500'}`}
                                />
                              )}
                              {isVisuallyActive && isVisuallyOT && (
                                <div 
                                  className={`transition-all duration-500 w-full bg-gradient-to-r from-orange-400 to-amber-500`}
                                />
                              )}
                              {(fractionRegForTooltip > 0 || fractionOTForTooltip > 0) && (
                                <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-slate-700/50 z-10 pointer-events-none">
                                  {((fractionRegForTooltip + fractionOTForTooltip) * 60).toFixed(0)}m
                                </span>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Overtime Entry Form */}
        <div className="bg-white rounded-[2rem] border border-slate-200 p-10 shadow-xl shadow-slate-200/50">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl"><ClockIconLarge /></div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">Record Overtime Entry</h3>
              <p className="text-sm font-medium text-slate-500">Manually log additional overtime hours for staff.</p>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee Selection</label>
              <select 
                value={formData.employeeId}
                onChange={(e) => {
                  const empId = e.target.value;
                  const record = attendanceRecords.find(r => r.employee._id === empId);
                  setFormData({ 
                    ...formData, 
                    employeeId: empId,
                    hours: record && record.otHours ? record.otHours.toString() : ''
                  });
                }}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#003896] focus:bg-white transition-all text-sm font-bold"
                required
              >
                <option value="">Select an employee...</option>
                {attendanceRecords.map(record => (
                  <option key={record.employee._id} value={record.employee._id}>{record.employee.name} ({record.employee.registerId})</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#003896] focus:bg-white transition-all text-sm font-bold"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hours</label>
              <input
                type="number"
                step="0.5"
                value={formData.hours}
                onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                placeholder="e.g. 4"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#003896] focus:bg-white transition-all text-sm font-bold"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">OT Start Time</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#003896] focus:bg-white transition-all text-sm font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">OT End Time</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#003896] focus:bg-white transition-all text-sm font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Task/Reason</label>
              <input
                type="text"
                value={formData.task}
                onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                placeholder="Emergency Surgery Support"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#003896] focus:bg-white transition-all text-sm font-bold"
              />
            </div>
            <div className="lg:col-span-3 pt-4 flex justify-end">
              <button type="submit" className="px-16 py-4 bg-orange-500 text-white rounded-2xl text-sm font-black shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all active:scale-95 uppercase tracking-widest">
                Update Overtime
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};


// Icons
const ClockIconLarge = () => <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;

export default Overtime;
