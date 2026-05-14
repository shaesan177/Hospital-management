import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Setup moment localizer
const localizer = momentLocalizer(moment);

interface Leave {
  _id?: string;
  leaveDate: string | Date;
  reason: string;
  leaveDays: number;
  type: string;
}

const Holidays: React.FC = () => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [upcomingLeaves, setUpcomingLeaves] = useState<Leave[]>([]);
  const [view, setView] = useState<any>(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const [formData, setFormData] = useState({
    leaveDate: '',
    reason: '',
    leaveDays: 1
  });

  const fetchLeaves = async () => {
    try {
      const [allRes, upcomingRes] = await Promise.all([
        axios.get('http://localhost:5000/api/leaves'),
        axios.get('http://localhost:5000/api/leaves/upcoming')
      ]);
      setLeaves(allRes.data);
      setUpcomingLeaves(upcomingRes.data);
    } catch (error) {
      console.error('Error fetching leaves:', error);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleAddLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/leaves/add', formData);
      setIsModalOpen(false);
      setFormData({ leaveDate: '', reason: '', leaveDays: 1 });
      await fetchLeaves();
    } catch (error) {
      console.error('Error adding leave:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLeave = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this holiday?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/leaves/${id}`);
      setSelectedEvent(null);
      await fetchLeaves();
    } catch (error) {
      console.error('Error deleting leave:', error);
    }
  };

  // Convert leaves to separate events for each day
  const events = leaves.flatMap(leave => {
    const start = moment(leave.leaveDate);
    const dayEvents = [];
    for (let i = 0; i < leave.leaveDays; i++) {
      const currentDay = moment(start).add(i, 'days').toDate();
      dayEvents.push({
        id: `${leave._id}-${i}`,
        title: leave.reason,
        start: currentDay,
        end: currentDay,
        allDay: true,
        resource: leave
      });
    }
    return dayEvents;
  });

  const CustomEvent = ({ event }: any) => (
    <div className="flex items-center justify-center h-full w-full">
      <div className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-sm shadow-red-500/40 animate-pulse" />
    </div>
  );

  const eventStyleGetter = () => {
    return {
      style: {
        backgroundColor: 'transparent',
        border: 'none',
        display: 'block',
        height: '100%',
        padding: '0'
      }
    };
  };

  const YearView = ({ date, events, onSelectEvent }: any) => {
    const year = moment(date).year();
    const months = moment.months();

    return (
      <div className="grid grid-cols-3 gap-6 p-6 h-full overflow-y-auto custom-scrollbar bg-slate-50/30">
        {months.map((month, idx) => {
          const monthStart = moment([year, idx]);
          const daysInMonth = monthStart.daysInMonth();
          const firstDay = monthStart.day();
          const days = [];
          
          for (let i = 0; i < firstDay; i++) days.push(null);
          for (let i = 1; i <= daysInMonth; i++) days.push(i);

          return (
            <div key={month} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="text-sm font-black text-[#003896] mb-3 uppercase tracking-widest border-b border-slate-50 pb-2">{month}</h4>
              <div className="grid grid-cols-7 gap-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                  <div key={d} className="text-[9px] font-black text-slate-300 text-center py-1">{d}</div>
                ))}
                {days.map((day, i) => {
                  if (day === null) return <div key={`empty-${i}`} className="h-6 w-6" />;
                  
                  const currentFullDate = moment([year, idx, day]);
                  const dayEvents = events.filter((e: any) => 
                    moment(e.start).isSame(currentFullDate, 'day')
                  );

                  return (
                    <div 
                      key={day} 
                      className="h-6 w-6 flex flex-col items-center justify-center relative cursor-pointer group"
                      onClick={() => dayEvents.length > 0 && onSelectEvent(dayEvents[0])}
                    >
                      <span className={`text-[10px] font-bold ${dayEvents.length > 0 ? 'text-[#003896]' : 'text-slate-500'}`}>
                        {day}
                      </span>
                      {dayEvents.length > 0 && (
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full absolute bottom-0.5 group-hover:scale-125 transition-transform" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Layout title="HMS Portal" searchPlaceholder="Search holidays...">
      <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              <span>ADMIN</span>
              <span className="text-slate-300">/</span>
              <span className="text-[#003896]">GOVERNMENT HOLIDAYS</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mb-1">Leave Management Calendar</h1>
            <p className="text-sm font-medium text-slate-500">Manage statutory government holidays and hospital-wide leave schedules.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-[#003896] rounded-xl text-sm font-bold text-white hover:bg-[#002d7a] transition-all shadow-lg shadow-blue-900/20 active:scale-95"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
              ADD UPCOMING LEAVE
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Main Calendar Content */}
          <div className="col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-black text-slate-900">
                  {view === 'year' ? moment(date).format('YYYY') : moment(date).format('MMMM YYYY')}
                </h3>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setDate(moment(date).subtract(1, view === 'year' ? 'year' : view === Views.WEEK ? 'week' : 'month').toDate())}
                    className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-[#003896] transition-all border border-transparent hover:border-slate-200"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
                  </button>
                  <button 
                    onClick={() => setDate(new Date())}
                    className="px-3 py-1 text-[10px] font-black text-slate-500 hover:text-[#003896] uppercase"
                  >
                    Today
                  </button>
                  <button 
                    onClick={() => setDate(moment(date).add(1, view === 'year' ? 'year' : view === Views.WEEK ? 'week' : 'month').toDate())}
                    className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-[#003896] transition-all border border-transparent hover:border-slate-200"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </button>
                </div>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button 
                  onClick={() => setView(Views.MONTH)}
                  className={`px-5 py-2 rounded-lg text-xs font-black transition-all ${view === Views.MONTH ? 'bg-white text-[#003896] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Month
                </button>
                <button 
                  onClick={() => setView(Views.WEEK)}
                  className={`px-5 py-2 rounded-lg text-xs font-black transition-all ${view === Views.WEEK ? 'bg-white text-[#003896] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Week
                </button>
                <button 
                  onClick={() => setView('year')}
                  className={`px-5 py-2 rounded-lg text-xs font-black transition-all ${view === 'year' ? 'bg-white text-[#003896] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Year
                </button>
              </div>
            </div>

            <div className="h-[600px] overflow-hidden">
              {view === 'year' ? (
                <YearView 
                  date={date} 
                  events={events} 
                  onSelectEvent={(event: any) => setSelectedEvent(event.resource)} 
                />
              ) : (
                <div className="h-full p-6">
                  <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    view={view}
                    onView={v => setView(v)}
                    date={date}
                    onNavigate={d => setDate(d)}
                    eventPropGetter={eventStyleGetter}
                    components={{
                      event: CustomEvent
                    }}
                    onSelectEvent={(event) => setSelectedEvent(event.resource)}
                    toolbar={false}
                    className="custom-calendar"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Upcoming Leaves */}
          <div className="col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col max-h-[700px]">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-lg font-black text-slate-900">Upcoming Government Holidays</h3>
                <span className="px-3 py-1 bg-blue-50 text-[10px] font-black text-[#003896] rounded-full border border-blue-100">
                  {upcomingLeaves.length} TOTAL
                </span>
              </div>
              <div className="p-4 overflow-y-auto custom-scrollbar">
                {upcomingLeaves.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 font-medium italic">No upcoming holidays scheduled</div>
                ) : (
                  upcomingLeaves.map((leave, idx) => (
                    <div key={idx} className="p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 transition-all mb-3 group cursor-default relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-[#003896] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-black text-slate-900 leading-tight group-hover:text-[#003896] transition-colors">{leave.reason}</h4>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[8px] font-black tracking-wider uppercase shrink-0 ml-2">
                          Confirmed
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                          <span>{moment(leave.leaveDate).format('DD MMM YYYY')}</span>
                        </div>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <div className="flex items-center gap-1.5 text-[#003896]">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                          <span>{leave.leaveDays} Day{leave.leaveDays > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Policy Card */}
            <div className="bg-[#003896] rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-blue-900/30">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <div className="relative z-10">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-6 backdrop-blur-md">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                </div>
                <h3 className="text-xl font-black mb-4">Holiday Policy</h3>
                <p className="text-sm font-medium text-blue-100/80 leading-relaxed mb-6">
                  Government holidays are mandatory non-working days for non-essential staff. Essential medical staff follow the duty roster.
                </p>
                <button className="text-xs font-black text-white hover:text-blue-200 transition-colors uppercase tracking-widest flex items-center gap-2">
                  Read Full Policy <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Leave Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-xl font-black text-slate-900">Add Upcoming Leave</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-slate-600 transition-all"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <form onSubmit={handleAddLeave} className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Leave Date</label>
                <input 
                  type="date" 
                  required
                  value={formData.leaveDate}
                  onChange={e => setFormData({...formData, leaveDate: e.target.value})}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003896] focus:bg-white transition-all text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Reason for Leave</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Independence Day"
                  value={formData.reason}
                  onChange={e => setFormData({...formData, reason: e.target.value})}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003896] focus:bg-white transition-all text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Number of Leave Days</label>
                <input 
                  type="number" 
                  min="1"
                  required
                  value={formData.leaveDays}
                  onChange={e => setFormData({...formData, leaveDays: parseInt(e.target.value)})}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003896] focus:bg-white transition-all text-sm font-bold"
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#003896] text-white rounded-2xl text-sm font-black shadow-lg shadow-blue-900/20 hover:bg-[#002d7a] transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
              >
                {loading ? 'Adding...' : 'Confirm Leave'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Event Details Modal (Clicking a highlighted date) */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mb-6 text-red-600">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-2">{selectedEvent.reason}</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-3 border-b border-slate-50">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date</span>
                  <span className="text-sm font-black text-slate-700">{moment(selectedEvent.leaveDate).format('DD MMMM YYYY')}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-50">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Duration</span>
                  <span className="text-sm font-black text-[#003896]">{selectedEvent.leaveDays} Day{selectedEvent.leaveDays > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Type</span>
                  <span className="text-xs font-black text-slate-700 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-tighter">{selectedEvent.type}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleDeleteLeave(selectedEvent._id)}
                  className="flex-1 py-3 border border-red-200 text-red-600 rounded-xl text-[10px] font-black uppercase hover:bg-red-50 transition-all"
                >
                  Delete
                </button>
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase hover:bg-slate-200 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-calendar .rbc-month-view {
          border: none;
          border-radius: 0;
        }
        .custom-calendar .rbc-header {
          padding: 12px;
          font-size: 10px;
          font-weight: 900;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border-bottom: 1px solid #f1f5f9;
        }
        .custom-calendar .rbc-day-bg {
          border-right: 1px solid #f8fafc;
        }
        .custom-calendar .rbc-month-row {
          border-top: 1px solid #f8fafc;
        }
        .custom-calendar .rbc-off-range-bg {
          background-color: #f8fafc;
        }
        .custom-calendar .rbc-today {
          background-color: #f0f9ff;
        }
        .custom-calendar .rbc-event {
          outline: none !important;
        }
        .custom-calendar .rbc-event:focus {
          outline: none !important;
        }
        .custom-calendar .rbc-show-more {
          font-size: 9px;
          font-weight: 900;
          color: #003896;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </Layout>
  );
};

export default Holidays;
