import React from 'react';
import { 
  Bot, 
  Sparkles, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  History, 
  User as UserIcon, 
  Settings as SettingsIcon, 
  ShieldCheck, 
  LogOut, 
  LogIn, 
  ChevronLeft, 
  ChevronRight, 
  Cpu,
  Zap
} from 'lucide-react';
import { ActiveView, User } from '../types';

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  accentColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  currentUser,
  onOpenAuth,
  collapsed,
  setCollapsed,
}) => {
  const navItems = [
    { id: 'home', label: 'Overview', icon: Zap },
    { id: 'chat', label: 'AI Chat Studio', icon: Bot, badge: 'v3.6' },
    { id: 'image', label: 'Image Studio', icon: ImageIcon, badge: '1K-4K' },
    { id: 'video', label: 'Video Studio', icon: VideoIcon, badge: 'Veo' },
    { id: 'history', label: 'History & Archive', icon: History },
    { id: 'profile', label: 'User Profile', icon: UserIcon },
    { id: 'settings', label: 'System Settings', icon: SettingsIcon },
  ];

  if (currentUser?.role === 'admin') {
    navItems.push({ id: 'admin', label: 'Admin Command', icon: ShieldCheck, badge: 'Live' });
  }

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 flex flex-col bg-[#070B19]/90 backdrop-blur-xl border-r border-cyan-500/20 shadow-[0_0_30px_rgba(0,240,255,0.05)] ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo & Brand Header */}
      <div className="flex items-center justify-between h-20 px-4 border-b border-cyan-500/10">
        <div 
          onClick={() => setActiveView('home')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-[1px] shadow-[0_0_15px_rgba(0,240,255,0.4)] group-hover:shadow-[0_0_25px_rgba(0,240,255,0.7)] transition-all">
            <div className="flex items-center justify-center w-full h-full bg-[#070B19] rounded-[11px]">
              <Cpu className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-200 to-indigo-300 font-mono">
                SAMSON<span className="text-cyan-400">.AI</span>
              </span>
              <span className="text-[10px] text-cyan-400/70 tracking-widest uppercase font-semibold">
                NEURAL CORE V3.6
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors border border-transparent hover:border-cyan-500/30"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as ActiveView)}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 via-blue-600/10 to-transparent text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.15)] font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 hover:border-slate-700/50 border border-transparent'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-300'}`}>
                <Icon className="w-5 h-5" />
              </div>

              {!collapsed && (
                <div className="flex items-center justify-between flex-1 min-w-0">
                  <span className="text-sm truncate">{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-mono font-medium rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}

              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#0B132B] text-cyan-300 text-xs font-medium rounded-lg border border-cyan-500/30 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Launch Pro Button */}
      {!collapsed && (
        <div className="px-3 mb-4">
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-cyan-950/60 to-blue-950/60 border border-cyan-500/30 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-400/10 rounded-full blur-xl group-hover:bg-cyan-400/20 transition-all" />
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-cyan-300 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Samson Core Pro</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">
              Unlimited multi-modal processing node enabled.
            </p>
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-cyan-500/20">
              <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full w-[78%]" />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>Usage</span>
              <span>142K / 1M Tokens</span>
            </div>
          </div>
        </div>
      )}

      {/* User Footer / Auth Control */}
      <div className="p-3 border-t border-cyan-500/10 bg-[#040711]/60">
        {currentUser ? (
          <div className="flex items-center justify-between gap-2">
            <div 
              onClick={() => setActiveView('profile')}
              className="flex items-center gap-2.5 min-w-0 cursor-pointer group flex-1 p-1.5 rounded-lg hover:bg-slate-800/40 transition-colors"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-full object-cover border border-cyan-400/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                referrerPolicy="no-referrer"
              />
              {!collapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-200 truncate group-hover:text-cyan-300">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono uppercase truncate">
                    {currentUser.role}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={onOpenAuth}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              title="Logout / Switch Account"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-medium text-xs transition-all shadow-[0_0_15px_rgba(0,240,255,0.1)]"
          >
            <LogIn className="w-4 h-4" />
            {!collapsed && <span>Authenticate</span>}
          </button>
        )}
      </div>
    </aside>
  );
};
