import React from 'react';
import Layout from '../components/Layout';

const Holidays: React.FC = () => {
  const holidays = [
    { name: 'Columbus Day', date: 'Oct 14, 2024', day: 'Monday', type: 'FEDERAL' },
    { name: 'National Health Day', date: 'Oct 11, 2024', day: 'Friday', type: 'LOCAL' },
    { name: 'Veterans Day', date: 'Nov 11, 2024', day: 'Monday', type: 'FEDERAL' },
    { name: 'Thanksgiving Day', date: 'Nov 28, 2024', day: 'Thursday', type: 'FEDERAL' },
    { name: 'Christmas Day', date: 'Dec 25, 2024', day: 'Wednesday', type: 'FEDERAL' },
  ];

  const calendarDays = [
    { date: 29, month: 'prev' }, { date: 30, month: 'prev' }, { date: 1, month: 'curr' }, { date: 2, month: 'curr' }, { date: 3, month: 'curr' }, { date: 4, month: 'curr' }, { date: 5, month: 'curr' },
    { date: 6, month: 'curr' }, { date: 7, month: 'curr' }, { date: 8, month: 'curr' }, { date: 9, month: 'curr' }, { date: 10, month: 'curr' }, { date: 11, month: 'curr', holiday: 'NATIONAL HEALTH DAY', type: 'local' }, { date: 12, month: 'curr' },
    { date: 13, month: 'curr' }, { date: 14, month: 'curr', holiday: 'COLUMBUS DAY', type: 'federal' }, { date: 15, month: 'curr' }, { date: 16, month: 'curr' }, { date: 17, month: 'curr' }, { date: 18, month: 'curr' }, { date: 19, month: 'curr' },
    { date: 20, month: 'curr' }, { date: 21, month: 'curr' }, { date: 22, month: 'curr' }, { date: 23, month: 'curr' }, { date: 24, month: 'curr' }, { date: 25, month: 'curr' }, { date: 26, month: 'curr' },
    { date: 27, month: 'curr' }, { date: 28, month: 'curr' }, { date: 29, month: 'curr' }, { date: 30, month: 'curr' }, { date: 31, month: 'curr', holiday: 'HALLOWEEN (CUSTOM)', type: 'custom' }, { date: 1, month: 'next' }, { date: 2, month: 'next' },
  ];

  return (
    <Layout title="HMS Portal" searchPlaceholder="Search holidays...">
      <div className="max-w-[1400px] mx-auto">
        {/* Breadcrumbs & Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              <span>ADMIN</span>
              <span className="text-slate-300">/</span>
              <span className="text-[#003896]">GOVERNMENT HOLIDAYS</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mb-1">2024 Holiday Calendar</h1>
            <p className="text-sm font-medium text-slate-500">View and manage statutory government holidays and hospital-specific observances.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9V2h12v7"></path><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
              PRINT CALENDAR
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#003896] rounded-xl text-sm font-bold text-white hover:bg-[#002d7a] transition-all shadow-lg shadow-blue-900/20">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
              ADD CUSTOM HOLIDAY
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Main Calendar Content */}
          <div className="col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-black text-slate-900">October 2024</h3>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-colors">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
                  </button>
                  <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-colors">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </button>
                </div>
              </div>
              <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                <button className="px-5 py-2 bg-white rounded-lg text-xs font-black text-[#003896] shadow-sm">Month</button>
                <button className="px-5 py-2 text-xs font-black text-slate-400 hover:text-slate-600">Week</button>
                <button className="px-5 py-2 text-xs font-black text-slate-400 hover:text-slate-600">Year</button>
              </div>
            </div>

            <div className="grid grid-cols-7 border-b border-slate-100">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                <div key={day} className="py-4 text-center text-[10px] font-black text-slate-400 tracking-widest border-r border-slate-50 last:border-r-0">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 grid-rows-5 h-[600px]">
              {calendarDays.map((day, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 border-r border-b border-slate-50 last:border-r-0 relative transition-colors hover:bg-slate-50/50 ${
                    day.month !== 'curr' ? 'bg-slate-50/30' : ''
                  }`}
                >
                  <span className={`text-sm font-bold ${
                    day.month !== 'curr' ? 'text-slate-300' : 'text-slate-500'
                  } ${day.holiday ? 'text-[#003896]' : ''}`}>
                    {day.date}
                  </span>
                  
                  {day.holiday && (
                    <div className={`mt-2 p-2 rounded-lg border-l-4 ${
                      day.type === 'federal' ? 'bg-blue-50 border-blue-500' :
                      day.type === 'local' ? 'bg-amber-50 border-amber-400' :
                      'bg-rose-50 border-rose-500'
                    }`}>
                      <p className={`text-[9px] font-black leading-tight uppercase ${
                        day.type === 'federal' ? 'text-blue-700' :
                        day.type === 'local' ? 'text-amber-700' :
                        'text-rose-700'
                      }`}>
                        {day.holiday}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900">Upcoming List</h3>
                <span className="px-2 py-1 bg-blue-50 text-[10px] font-black text-[#003896] rounded-md border border-blue-100">2024</span>
              </div>
              <div className="p-2">
                {holidays.map((holiday, idx) => (
                  <div key={idx} className="p-4 rounded-2xl hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer">
                    <div>
                      <h4 className="text-sm font-black text-slate-900 mb-1">{holiday.name}</h4>
                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                        <span>{holiday.date}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span>{holiday.day}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-[9px] font-black tracking-wider border ${
                      holiday.type === 'FEDERAL' 
                        ? 'bg-blue-50 text-blue-600 border-blue-100' 
                        : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {holiday.type}
                    </span>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-slate-50">
                <button className="w-full py-3 text-xs font-black text-[#003896] hover:bg-blue-50 rounded-xl transition-all tracking-wider uppercase">
                  View All Holidays
                </button>
              </div>
            </div>

            <div className="bg-[#1e3a8a] rounded-3xl p-8 text-white relative overflow-hidden">
              {/* Abstract background shape */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              
              <div className="relative z-10">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                </div>
                <h3 className="text-xl font-black mb-4">Holiday Policy</h3>
                <p className="text-sm font-medium text-blue-100/80 leading-relaxed mb-8">
                  All permanent staff are entitled to 1.5x pay rate on Federal holidays. Custom local holidays require prior department approval.
                </p>
                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-blue-200/60 uppercase tracking-widest mb-1">Next: Columbus Day</p>
                    <p className="text-xs font-black text-white">IN 4 DAYS</p>
                  </div>
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Holidays;
