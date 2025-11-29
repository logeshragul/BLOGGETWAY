import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth';
import { Lock, ArrowLeft, ShieldAlert, KeyRound, ChevronRight } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [lockout, setLockout] = useState<{isLocked: boolean, remaining: number}>({ isLocked: false, remaining: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    // Check lockout status immediately
    updateLockoutStatus();
    
    // Update countdown every second
    const interval = setInterval(updateLockoutStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const updateLockoutStatus = () => {
    const status = authService.getLockoutStatus();
    setLockout(status);
    if (!status.isLocked && lockout.isLocked) {
      setError(''); // Clear error if lockout just expired
    }
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.ceil(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockout.isLocked) return;

    if (authService.login(password)) {
      navigate('/admin');
    } else {
      const currentAttempts = authService.getFailedAttempts();
      const status = authService.getLockoutStatus();
      
      if (status.isLocked) {
        setLockout(status);
        setError(`Access suspended due to too many failed attempts.`);
      } else {
        setError(`Invalid password. ${5 - currentAttempts} attempts remaining.`);
      }
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 z-0">
         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900"></div>
         <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
         <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <Link 
          to="/" 
          className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors group text-sm font-medium"
        >
          <div className="w-8 h-8 rounded-full bg-slate-800/50 flex items-center justify-center mr-2 group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-all">
             <ArrowLeft size={16} />
          </div>
          Back to Blog
        </Link>

        <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl animate-scale-in">
          <div className="text-center mb-8">
            <div className={`w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg transition-colors ${lockout.isLocked ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
              {lockout.isLocked ? <ShieldAlert size={32} /> : <Lock size={32} />}
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Admin Portal</h1>
            <p className="text-slate-400 text-sm">Secure access for site administrators</p>
          </div>

          {lockout.isLocked ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center animate-fade-in">
              <h3 className="text-red-400 font-bold mb-2">Account Temporarily Locked</h3>
              <p className="text-red-200/70 text-sm mb-4">Too many failed attempts. Please wait before trying again.</p>
              <div className="text-2xl font-mono font-bold text-white bg-slate-900/50 py-2 rounded-lg">
                {formatTime(lockout.remaining)}
              </div>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">Password</label>
                <div className="relative group">
                  <KeyRound className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:bg-slate-900/70"
                    placeholder="Enter admin password"
                    autoFocus
                  />
                </div>
                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-xs mt-2 bg-red-900/20 p-2 rounded-lg border border-red-900/30 animate-shake">
                    <ShieldAlert size={12} /> {error}
                  </div>
                )}
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-900/30 hover:shadow-blue-900/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group"
              >
                <span>Access Dashboard</span>
                <ChevronRight size={18} className="opacity-70 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          )}
        </div>

        <div className="mt-8 text-center">
           <p className="text-slate-500 text-xs">
             Protected by BlogGetWay SecureAuth™ &bull; v1.3.0
           </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;