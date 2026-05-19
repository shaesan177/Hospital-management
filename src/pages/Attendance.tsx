import React, { useState, useEffect, useMemo } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

const Attendance: React.FC = () => {
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  
  // Helpers to convert between 12h (backend) and 24h (input type="time")
  const formatTimeTo12h = (time24: string) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    let h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    return `${h.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };

  const formatTimeForInput = (time12h: string) => {
    if (!time12h || time12h === '—' || time12h === 'Pending' || time12h === '-') return '';
    const parts = time12h.split(' ');
    if (parts.length !== 2) return '';
    const [time, modifier] = parts;
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = (parseInt(hours, 10) + 12).toString();
    return `${hours.padStart(2, '0')}:${minutes}`;
  };

  const getDecimalTime = (timeStr: string) => {
    if (!timeStr || timeStr === '—' || timeStr === 'Pending' || timeStr === '-' || timeStr === '—') return null;
    if (timeStr.includes('AM') || timeStr.includes('PM')) {
      const parts = timeStr.split(' ');
      const [time, modifier] = parts;
      let [hours, minutes] = time.split(':').map(Number);
      if (hours === 12) hours = 0;
      if (modifier === 'PM') hours += 12;
      return hours + (minutes || 0) / 60;
    } else {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours + (minutes || 0) / 60;
    }
  };

  // Form State
  const [formData, setFormData] = useState({
    employeeId: '',
    natureOfWork: '',
    checkIn: '',
    breakStart: '',
    breakEnd: '',
    checkOut: '',
    status: 'PRESENT'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/attendance?date=${selectedDate}`);
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

    // Validation
    const checkInDec = formData.checkIn ? parseInt(formData.checkIn.replace(':', '')) : 0;
    const checkOutDec = formData.checkOut ? parseInt(formData.checkOut.replace(':', '')) : 0;
    const breakStartDec = formData.breakStart ? parseInt(formData.breakStart.replace(':', '')) : 0;
    const breakEndDec = formData.breakEnd ? parseInt(formData.breakEnd.replace(':', '')) : 0;

    if (formData.checkIn && formData.checkOut && checkOutDec < checkInDec) {
      alert('Check-out cannot be before check-in');
      return;
    }
    if (formData.breakStart && formData.breakEnd && breakEndDec < breakStartDec) {
      alert('Break-end cannot be before break-start');
      return;
    }

    try {
      const payload = {
        ...formData,
        checkIn: formatTimeTo12h(formData.checkIn),
        breakStart: formatTimeTo12h(formData.breakStart),
        breakEnd: formatTimeTo12h(formData.breakEnd),
        checkOut: formatTimeTo12h(formData.checkOut),
        date: selectedDate
      };

      await axios.post('http://localhost:5000/api/attendance', payload);
      alert('Attendance updated successfully');
      fetchData();
      setFormData({
        employeeId: '',
        natureOfWork: '',
        checkIn: '',
        breakStart: '',
        breakEnd: '',
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
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-400 uppercase">Standard: 12.0 Hrs</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100">Employee</th>
                  <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Check-In</th>
                  <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Break</th>
                  <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Check-Out</th>
                  <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Break Dur.</th>
                  <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Net Worked</th>
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
                      <span className="text-sm font-bold text-slate-700">{item.checkIn}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-bold text-slate-400">S: {item.breakStart}</span>
                        <span className="text-[10px] font-bold text-slate-400">E: {item.breakEnd}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="text-sm font-bold text-slate-700">{item.checkOut}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="text-sm font-black text-slate-500">{item.breakDuration.toFixed(1)}h</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-black text-[#003896]">{item.netHours.toFixed(1)}h</span>
                        <span className="text-[8px] font-black text-slate-300 uppercase">Gross: {item.totalHours.toFixed(1)}h</span>
                      </div>
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
                        const entryHour = getDecimalTime(item.checkIn);
                        const exitHour = getDecimalTime(item.checkOut);
                        const bStartHour = getDecimalTime(item.breakStart);
                        const bEndHour = getDecimalTime(item.breakEnd);

                        let intervals: {start: number, end: number, isNextDay: boolean}[] = [];
                        if (entryHour !== null && exitHour !== null) {
                          const addInterval = (s: number, e: number, nextDay: boolean) => {
                            if (e < s) {
                              intervals.push({ start: s, end: 24, isNextDay: nextDay });
                              intervals.push({ start: 0, end: e, isNextDay: true });
                            } else {
                              intervals.push({ start: s, end: e, isNextDay: nextDay });
                            }
                          };

                          if (bStartHour !== null && bEndHour !== null) {
                            const bStartNextDay = bStartHour < entryHour;
                            const bEndNextDay = bEndHour < bStartHour || (bStartNextDay && bEndHour >= bStartHour);
                            
                            addInterval(entryHour, bStartHour, false);
                            addInterval(bEndHour, exitHour, bEndNextDay);
                          } else {
                            addInterval(entryHour, exitHour, false);
                          }
                        }

                        return (
                           <div className="flex items-center gap-[2px] justify-center">
                              {Array.from({ length: 24 }).map((_, h) => {
                                let fraction = 0;
                                let isNextDayBlock = false;
                                for (const inv of intervals) {
                                  const overlapStart = Math.max(h, inv.start);
                                  const overlapEnd = Math.min(h + 1, inv.end);
                                  if (overlapEnd > overlapStart) {
                                    fraction += (overlapEnd - overlapStart);
                                    if (inv.isNextDay) isNextDayBlock = true;
                                  }
                                }
                                
                                const isOT = h >= 20;

                                return (
                                  <div key={h} className="relative w-3 h-5 bg-slate-100 rounded-sm overflow-hidden flex-shrink-0 shadow-inner group">
                                    {fraction > 0 && (
                                      <div 
                                        className={`absolute top-0 bottom-0 left-0 transition-all duration-300 ${isNextDayBlock ? 'bg-indigo-400' : isOT ? 'bg-orange-400' : 'bg-emerald-400'}`}
                                        style={{ width: `${fraction * 100}%` }}
                                      />
                                    )}
                                    {/* Tooltip for hover */}
                                    <div className="absolute opacity-0 group-hover:opacity-100 bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-slate-800 text-white text-[8px] font-bold rounded pointer-events-none whitespace-nowrap z-50">
                                      {h}:00 - {h+1}:00 ({fraction > 0 ? (fraction * 60).toFixed(0) + 'm' : 'Empty'})
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
                      breakStart: record ? formatTimeForInput(record.breakStart) : '',
                      breakEnd: record ? formatTimeForInput(record.breakEnd) : '',
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
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
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
                  onChange={(e) => setFormData({...formData, natureOfWork: e.target.value})}
                  placeholder="e.g. Ward Duty" 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#003896] focus:bg-white transition-all text-sm font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Check-In</label>
                <input 
                  type="time" 
                  value={formData.checkIn}
                  onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#003896] focus:bg-white transition-all text-sm font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Break Start</label>
                <input 
                  type="time" 
                  value={formData.breakStart}
                  onChange={(e) => setFormData({...formData, breakStart: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#003896] focus:bg-white transition-all text-sm font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Break End</label>
                <input 
                  type="time" 
                  value={formData.breakEnd}
                  onChange={(e) => setFormData({...formData, breakEnd: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#003896] focus:bg-white transition-all text-sm font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Check-Out</label>
                <input 
                  type="time" 
                  value={formData.checkOut}
                  onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
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
                      const start = formData.checkIn ? parseInt(formData.checkIn.split(':')[0]) + parseInt(formData.checkIn.split(':')[1])/60 : 0;
                      const end = formData.checkOut ? parseInt(formData.checkOut.split(':')[0]) + parseInt(formData.checkOut.split(':')[1])/60 : 0;
                      let diff = end - start;
                      if (diff < 0) diff += 24;
                      return diff.toFixed(1);
                    })()}h
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Est. Break Dur.</span>
                  <p className="text-lg font-black text-slate-900">
                    {(() => {
                      const start = formData.breakStart ? parseInt(formData.breakStart.split(':')[0]) + parseInt(formData.breakStart.split(':')[1])/60 : 0;
                      const end = formData.breakEnd ? parseInt(formData.breakEnd.split(':')[0]) + parseInt(formData.breakEnd.split(':')[1])/60 : 0;
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
                      const s1 = formData.checkIn ? parseInt(formData.checkIn.split(':')[0]) + parseInt(formData.checkIn.split(':')[1])/60 : 0;
                      const e1 = formData.checkOut ? parseInt(formData.checkOut.split(':')[0]) + parseInt(formData.checkOut.split(':')[1])/60 : 0;
                      let total = e1 - s1; if (total < 0) total += 24;
                      const s2 = formData.breakStart ? parseInt(formData.breakStart.split(':')[0]) + parseInt(formData.breakStart.split(':')[1])/60 : 0;
                      const e2 = formData.breakEnd ? parseInt(formData.breakEnd.split(':')[0]) + parseInt(formData.breakEnd.split(':')[1])/60 : 0;
                      let brk = e2 - s2; if (brk < 0) brk += 24;
                      return Math.max(0, total - brk).toFixed(1);
                    })()}h
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-orange-500 uppercase">Est. OT Hours</span>
                  <p className="text-lg font-black text-orange-500">
                    {(() => {
                      const s1 = formData.checkIn ? parseInt(formData.checkIn.split(':')[0]) + parseInt(formData.checkIn.split(':')[1])/60 : null;
                      const e1 = formData.checkOut ? parseInt(formData.checkOut.split(':')[0]) + parseInt(formData.checkOut.split(':')[1])/60 : null;
                      if (s1 === null || e1 === null) return '0.0';
                      let ot = 0;
                      if (e1 >= s1) {
                        const overlapStart = Math.max(s1, 8);
                        const overlapEnd = Math.min(e1, 20);
                        const overlap = Math.max(0, overlapEnd - overlapStart);
                        ot = (e1 - s1) - overlap;
                      } else {
                        const overlapStart1 = Math.max(s1, 8);
                        const overlapEnd1 = Math.min(24, 20);
                        const overlap1 = Math.max(0, overlapEnd1 - overlapStart1);
                        const overlapStart2 = Math.max(0, 8);
                        const overlapEnd2 = Math.min(e1, 20);
                        const overlap2 = Math.max(0, overlapEnd2 - overlapStart2);
                        ot = ((24 - s1) - overlap1) + (e1 - overlap2);
                      }
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
