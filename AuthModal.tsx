import React, { useState } from 'react';
import { 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  X, 
  User as UserIcon, 
  Mail, 
  Lock, 
  LogOut,
  Sparkles,
  Check
} from 'lucide-react';
import { User } from '../types';
import { DEFAULT_USER } from '../lib/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleDemoAdmin = () => {
    onLogin(DEFAULT_USER);
    onClose();
  };

  const handleDemoUser = () => {
    const regularUser: User = {
      id: 'usr_samson_standard',
      name: 'Samson Member',
      email: 'user@samson.ai',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
      role: 'user',
      plan: 'Samson Core Pro',
      tokenUsage: 28400,
      tokensLimit: 500000,
      imagesGenerated: 12,
      videosGenerated: 4,
      createdAt: new Date().toLocaleDateString(),
    };
    onLogin(regularUser);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const newUser: User = {
      id: 'usr_' + Date.now(),
      name: name.trim() || email.split('@')[0],
      email: email.trim(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      role: 'user',
      plan: 'Samson Core Pro',
      tokenUsage: 0,
      tokensLimit: 500000,
      imagesGenerated: 0,
      videosGenerated: 0,
      createdAt: new Date().toLocaleDateString(),
    };

    onLogin(newUser);
    onClose();
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 flex items-center justify-center animate-fadeIn"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#070B19] rounded-3xl border border-cyan-500/30 p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {currentUser ? (
          /* Logout confirmation view */
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center">
              <UserIcon className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold font-mono text-slate-100">
                {currentUser.name}
              </h3>
              <p className="text-xs text-slate-400 font-mono">{currentUser.email}</p>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30 uppercase mt-2">
                Role: {currentUser.role}
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full py-3 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold hover:bg-rose-500/30 transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Disconnect Session (Sign Out)</span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-slate-900 text-slate-300 text-xs font-bold hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          /* Login or Register Form */
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>SAMSONIA AUTHENTICATION</span>
              </div>
              <h3 className="text-2xl font-bold font-mono text-slate-100">
                {mode === 'login' ? 'Access Samson AI' : 'Create New Account'}
              </h3>
            </div>

            {/* One-Click Quick Demo Login Buttons */}
            <div className="p-4 rounded-2xl bg-[#0B132B] border border-cyan-500/20 space-y-2 text-center">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                Instant One-Click Demo Auth
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleDemoAdmin}
                  className="py-2 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold font-mono transition-all"
                >
                  Admin Session
                </button>
                <button
                  onClick={handleDemoUser}
                  className="py-2 px-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-bold font-mono transition-all"
                >
                  Pro Member
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Display Name</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="Samson Leader"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="user@samson.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] transition-all"
              >
                {mode === 'login' ? 'Authenticate' : 'Create Account'}
              </button>
            </form>

            <div className="text-center text-xs text-slate-400">
              {mode === 'login' ? (
                <span>
                  Don't have an account?{' '}
                  <button
                    onClick={() => setMode('register')}
                    className="text-cyan-400 font-bold hover:underline"
                  >
                    Register
                  </button>
                </span>
              ) : (
                <span>
                  Already registered?{' '}
                  <button
                    onClick={() => setMode('login')}
                    className="text-cyan-400 font-bold hover:underline"
                  >
                    Sign In
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
