import React from 'react';
import { 
  Activity, 
  Volume2, 
  VolumeX, 
  Search, 
  Bell, 
  User as UserIcon,
  Sparkles
} from 'lucide-react';
import { ActiveView, User } from '../types';

interface HeaderProps {
  activeView: ActiveView;
  currentUser: User | null;
  onOpenAuth: () => void;
  setActiveView: (view: ActiveView) => void;
  audioMuted: boolean;
  setAudioMuted: (muted: boolean) => void;
  sidebarCollapsed: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  currentUser,
  onOpenAuth,
  setActiveView,
  audioMuted,
  setAudioMuted,
  sidebarCollapsed,
}) => {
  const getViewTitle = () => {
    switch (activeView) {
      case 'home':
        return 'Control Overview & AI Studio Hub';
      case 'chat':
        return 'ChatGPT-3.6 Neural Chat Workspace';
      case 'image':
        return 'AI Image Generation Studio';
      case 'video':
        return 'Veo AI Video Generation Studio';
      case 'history':
        return 'Conversation Archive & Generations';
      case 'profile':
        return 'User Account & Usage Telemetry';
      case 'settings':
        return 'System Preferences & Model Tuning';
      case 'admin':
        return 'Executive Command & System Diagnostics';
      default:
        return 'SamsonIA';
    }
  };

  return (
    <header 
      className={`fixed top-0 right-0 z-30 h-20 bg-[#070B19]/80 backdrop-blur-md border-b border-cyan-500/15 flex items-center justify-between px-6 transition-all duration-300 ${
        sidebarCollapsed ? 'left-20' : 'left-64'
      }`}
    >
      {/* Title & Status */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-slate-100 flex items-center gap-2 font-mono">
            {getViewTitle()}
          </h1>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SYSTEM ONLINE
            </span>
            <span className="text-[11px] font-mono text-cyan-400/80 hidden sm:inline">
              Node: Samson-V100 | Ping: 12ms
            </span>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Quick Search */}
        <button
          onClick={() => setActiveView('history')}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-cyan-500/20 text-slate-400 text-xs hover:text-cyan-300 hover:border-cyan-500/40 transition-all shadow-inner"
        >
          <Search className="w-3.5 h-3.5 text-cyan-400" />
          <span>Search archive...</span>
          <kbd className="px-1.5 py-0.5 text-[9px] bg-slate-800 rounded font-mono text-slate-300">
            ⌘K
          </kbd>
        </button>

        {/* Audio Mute Toggle */}
        <button
          onClick={() => setAudioMuted(!audioMuted)}
          className={`p-2 rounded-xl border transition-all ${
            audioMuted 
              ? 'bg-rose-950/40 text-rose-400 border-rose-500/30' 
              : 'bg-slate-900/60 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/10'
          }`}
          title={audioMuted ? "Audio Muted (Click to Unmute)" : "Audio Enabled"}
        >
          {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <button
          onClick={() => setActiveView('history')}
          className="relative p-2 rounded-xl bg-slate-900/60 border border-cyan-500/20 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-all"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.8)] animate-pulse" />
        </button>

        {/* User Quick Button */}
        {currentUser ? (
          <button
            onClick={() => setActiveView('profile')}
            className="flex items-center gap-2.5 p-1 pl-2.5 rounded-xl bg-slate-900/60 border border-cyan-500/30 hover:border-cyan-400 transition-all group"
          >
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">
                {currentUser.plan}
              </span>
            </div>
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-lg object-cover border border-cyan-400/40 shadow-[0_0_8px_rgba(0,240,255,0.3)]"
              referrerPolicy="no-referrer"
            />
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] transition-all"
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
