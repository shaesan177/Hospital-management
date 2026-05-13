import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import loginBg from '../assets/login-bg.png';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen w-full font-sans overflow-hidden">
      <div 
        className="hidden lg:flex flex-1 relative items-center p-16 text-white bg-cover bg-center"
        // style={{ backgroundImage: `url(${loginBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#003896]/90 to-[#003896]/70"></div>
        <div className="relative z-10 max-w-lg">
          <div className="w-16 h-16 mb-8">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 7H17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 11H17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 15H11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="15.5" cy="15.5" r="2.5" stroke="white" strokeWidth="2"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold leading-tight mb-6">Gomathi Speciality Hospital</h1>
          <p className="text-lg opacity-90 mb-12">
            Integrated hospital management designed for the highest clinical standards. 
            Access patient records, manage workflows, and deliver excellence in healthcare.
          </p>
          <div className="flex items-center gap-8">
            <div>
              <div className="text-2xl font-bold">99.9%</div>
              <div className="text-xs font-semibold opacity-80 tracking-widest uppercase">UPTIME</div>
            </div>
            <div className="w-px h-10 bg-white/30"></div>
            <div>
              <div className="text-2xl font-bold">Gov</div>
              <div className="text-xs font-semibold opacity-80 tracking-widest uppercase">CERTIFIED</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-[0_0_100%] lg:flex-[0_0_50%] bg-white flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-[440px]">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C12 22 20 18 20 12V5L12 2 L4 5V12C4 18 12 22 12 22Z" fill="#003896" stroke="#003896" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 12H15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 9V15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-2xl font-bold text-[#003896]">GSH Portal</span>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h2>
            <p className="text-slate-500">Please enter your clinical credentials to continue.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email or Username</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-400">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </span>
                <input 
                  type="text" 
                  className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-lg text-base transition-all focus:outline-none focus:border-[#003896] focus:ring-4 focus:ring-[#003896]/10"
                  placeholder="e.g. j.doe@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <a href="#" className="text-xs font-bold text-[#003896] hover:underline">Forgot password?</a>
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-400">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </span>
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="w-full pl-12 pr-12 py-3.5 border border-slate-200 rounded-lg text-base transition-all focus:outline-none focus:border-[#003896] focus:ring-4 focus:ring-[#003896]/10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <button 
                  type="button" 
                  className="absolute right-4 text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" id="remember" className="w-4.5 h-4.5 cursor-pointer rounded border-slate-300 text-[#003896] focus:ring-[#003896]" />
              <label htmlFor="remember" className="text-sm text-slate-500 cursor-pointer">Remember this device for 30 days</label>
            </div>

            <button type="submit" className="w-full bg-[#003896] hover:bg-[#002d7a] text-white py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors mt-4">
              Secure Login <span>→</span>
            </button>
          </form>

          <div className="flex items-center my-10">
            <div className="flex-1 border-b border-slate-200"></div>
            <span className="px-4 text-[10px] font-bold text-slate-400 tracking-widest uppercase">SUPPORT</span>
            <div className="flex-1 border-b border-slate-200"></div>
          </div>

          <div className="bg-slate-50 rounded-xl p-6 flex gap-4 mb-12">
            <div className="w-6 h-6 flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="#003896" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">New to the system? Contact your department administrator or IT helpdesk for access credentials.</p>
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-500 font-medium">
            <div className="flex gap-6">
              <a href="#" className="hover:text-slate-900">Privacy Policy</a>
              <a href="#" className="hover:text-slate-900">Terms of Use</a>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              System Status: Optimal
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
