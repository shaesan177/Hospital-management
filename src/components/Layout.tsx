import React from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  searchPlaceholder?: string;
  headerActions?: React.ReactNode;
  onSearch?: (query: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, title, searchPlaceholder = "Search...", headerActions, onSearch }) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40 w-full">
        <div className="flex items-center gap-12">
          <h1 className="text-lg font-black text-[#003896] tracking-tight">{title}</h1>
          <div className="flex items-center bg-slate-50 border border-slate-100 px-4 py-2 rounded-lg w-[380px] gap-3 focus-within:border-[#003896] focus-within:bg-white transition-all">
            <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              placeholder={searchPlaceholder} 
              className="bg-transparent border-none outline-none w-full text-sm font-medium" 
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          {headerActions && (
            <div className="flex items-center border-r border-slate-200 pr-6">
              {headerActions}
            </div>
          )}
          <div className="flex items-center gap-2 border-r border-slate-200 pr-6 mr-2">
            <button className="p-2 text-slate-400 hover:text-[#003896] transition-colors relative">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="p-2 text-slate-400 hover:text-[#003896] transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1-2.83 0l-.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            </button>
          </div>
          
          <button className="text-sm font-bold text-[#003896] hover:underline mr-2">Help</button>
          
          <div className="flex items-center gap-3 pl-4">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-blue-100 border border-slate-200 flex items-center justify-center text-blue-700 font-bold text-lg">
              {(() => {
                const userString = localStorage.getItem('user');
                const user = userString ? JSON.parse(userString) : { name: 'Admin' };
                return user.name.charAt(0).toUpperCase();
              })()}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 ml-[260px] p-8 pt-6 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
