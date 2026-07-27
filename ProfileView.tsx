import React from 'react';
import { 
  User as UserIcon, 
  Zap, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  ShieldCheck, 
  Calendar, 
  Award, 
  BarChart3, 
  Key, 
  Settings,
  Sparkles
} from 'lucide-react';
import { User, GeneratedImage, GeneratedVideo, ActiveView } from '../types';

interface ProfileViewProps {
  currentUser: User | null;
  images: GeneratedImage[];
  videos: GeneratedVideo[];
  setActiveView: (view: ActiveView) => void;
  onOpenAuth: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  images,
  videos,
  setActiveView,
  onOpenAuth,
}) => {
  if (!currentUser) {
    return (
      <div className="p-12 text-center space-y-4">
        <UserIcon className="w-16 h-16 mx-auto text-slate-600" />
        <h2 className="text-xl font-bold text-slate-200">No User Session Found</h2>
        <button
          onClick={onOpenAuth}
          className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  const tokenPercentage = Math.min(100, Math.round((currentUser.tokenUsage / currentUser.tokensLimit) * 100));

  return (
    <div className="space-y-8 pb-12 animate-fadeIn">
      {/* Profile Card Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-[#0B132B] via-[#1C2541]/70 to-[#070B19] border border-cyan-500/30 shadow-[0_0_40px_rgba(0,240,255,0.1)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-24 h-24 rounded-2xl object-cover border-2 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.4)]"
            referrerPolicy="no-referrer"
          />

          <div className="space-y-1">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <h2 className="text-2xl font-bold font-mono text-slate-100">
                {currentUser.name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40 uppercase">
                {currentUser.role}
              </span>
            </div>

            <p className="text-xs text-slate-400 font-mono">
              {currentUser.email}
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 font-mono justify-center md:justify-start">
              <span className="flex items-center gap-1">
                <Award className="w-4 h-4 text-amber-400" />
                {currentUser.plan}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-cyan-400" />
                Member since {currentUser.createdAt}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('settings')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs font-bold text-cyan-300 hover:bg-slate-800 transition-all flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            <span>Account Settings</span>
          </button>
        </div>
      </div>

      {/* Usage Telemetry Meter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Token Usage */}
        <div className="p-6 rounded-2xl bg-[#0B132B]/80 border border-cyan-500/20 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              Token Usage
            </span>
            <span className="text-cyan-300 font-bold">{tokenPercentage}%</span>
          </div>

          <div className="text-2xl font-bold font-mono text-slate-100">
            {currentUser.tokenUsage.toLocaleString()} <span className="text-xs text-slate-400">/ {currentUser.tokensLimit.toLocaleString()}</span>
          </div>

          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-cyan-500/20">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full transition-all duration-500"
              style={{ width: `${tokenPercentage}%` }}
            />
          </div>
        </div>

        {/* Images Generated */}
        <div className="p-6 rounded-2xl bg-[#0B132B]/80 border border-purple-500/20 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-purple-400" />
              Artwork Generated
            </span>
            <span className="text-purple-300 font-bold">Studio Active</span>
          </div>

          <div className="text-2xl font-bold font-mono text-slate-100">
            {images.length} <span className="text-xs text-slate-400">Creations Saved</span>
          </div>

          <p className="text-[11px] text-slate-400 font-mono">
            High-res synthesis node enabled
          </p>
        </div>

        {/* Videos Generated */}
        <div className="p-6 rounded-2xl bg-[#0B132B]/80 border border-emerald-500/20 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1.5">
              <VideoIcon className="w-4 h-4 text-emerald-400" />
              Videos Synthesized
            </span>
            <span className="text-emerald-300 font-bold">Veo Engine</span>
          </div>

          <div className="text-2xl font-bold font-mono text-slate-100">
            {videos.length} <span className="text-xs text-slate-400">Videos Rendered</span>
          </div>

          <p className="text-[11px] text-slate-400 font-mono">
            60FPS camera motion rendering
          </p>
        </div>
      </div>

      {/* Saved Media Gallery */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold font-mono text-slate-200 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>My Saved Multi-Modal Portfolio</span>
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.slice(0, 4).map((img) => (
            <div key={img.id} className="aspect-square rounded-xl overflow-hidden border border-purple-500/30 bg-black">
              <img
                src={img.url}
                alt={img.prompt}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
