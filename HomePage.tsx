import React from 'react';
import { 
  Bot, 
  Sparkles, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Zap, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Activity, 
  Flame, 
  Clock,
  ExternalLink
} from 'lucide-react';
import { ActiveView, GeneratedImage, GeneratedVideo, ChatSession } from '../types';

interface HomePageProps {
  setActiveView: (view: ActiveView) => void;
  recentChats: ChatSession[];
  recentImages: GeneratedImage[];
  recentVideos: GeneratedVideo[];
  onStartNewChat: (prompt?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  setActiveView,
  recentChats,
  recentImages,
  recentVideos,
  onStartNewChat,
}) => {
  const quickPrompts = [
    {
      title: 'Quantum Computing Brief',
      category: 'Chat',
      prompt: 'Explain quantum supremacy and topological qubits in simple terms with key mathematical principles.',
      view: 'chat',
      icon: Bot,
      color: 'from-cyan-500/20 to-blue-600/20 border-cyan-500/40',
    },
    {
      title: 'Cyberpunk Metropolis 8K',
      category: 'Image Studio',
      prompt: 'A futuristic midnight city with glowing blue holographic structures, wet asphalt reflections, and soaring airships, cinematic 8k',
      view: 'image',
      icon: ImageIcon,
      color: 'from-purple-500/20 to-pink-600/20 border-purple-500/40',
    },
    {
      title: 'Starship Warp Orbit',
      category: 'Video Studio',
      prompt: 'A sleek metallic starship emerging from a cyan hyper-space portal above a glowing ringed planet',
      view: 'video',
      icon: VideoIcon,
      color: 'from-emerald-500/20 to-teal-600/20 border-emerald-500/40',
    },
  ];

  return (
    <div className="space-y-8 pb-12 animate-fadeIn">
      {/* Hero Banner */}
      <div className="relative rounded-3xl p-8 md:p-10 bg-gradient-to-br from-[#0B132B] via-[#1C2541]/70 to-[#070B19] border border-cyan-500/30 overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.1)]">
        {/* Futuristic Grid & Glow Backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Cpu className="w-72 h-72 text-cyan-400" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>SAMSONIA MULTI-MODAL SUITE V3.6</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-100 font-mono">
            Next-Gen AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-300 to-purple-400">Intelligence & Visual Creation</span>
          </h1>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed font-sans">
            Seamlessly converse with Gemini 3.6 Flash, synthesize ultra-detailed 4K artwork, and render cinematic AI video with full voice input and text-to-speech integration.
          </p>

          {/* Quick Metrics */}
          <div className="pt-2 flex flex-wrap gap-6 text-xs font-mono text-slate-300 border-t border-cyan-500/15">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Response Speed: <strong className="text-cyan-300">340ms</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Active Model: <strong className="text-cyan-300">Gemini 3.6 Flash</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Render Engine: <strong className="text-cyan-300">Veo / Gemini Studio</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Core Direct Launch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Start Chat */}
        <div 
          onClick={() => setActiveView('chat')}
          className="group relative p-6 rounded-2xl bg-[#0B132B]/80 hover:bg-[#0B132B] border border-cyan-500/20 hover:border-cyan-400 transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.2)] overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-400/20 transition-all" />
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-500/30">
              Conversational AI
            </span>
          </div>

          <h3 className="text-xl font-bold text-slate-100 group-hover:text-cyan-300 transition-colors font-mono mb-2">
            Start Chat
          </h3>
          <p className="text-xs text-slate-400 mb-6 line-clamp-2">
            Ask complex questions, analyze code, summarize research, and synthesize ideas with Gemini 3.6 Flash.
          </p>

          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
            <span>Launch Chat Studio</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Generate Image */}
        <div 
          onClick={() => setActiveView('image')}
          className="group relative p-6 rounded-2xl bg-[#0B132B]/80 hover:bg-[#0B132B] border border-purple-500/20 hover:border-purple-400 transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_30px_rgba(157,78,221,0.2)] overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-400/20 transition-all" />
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 group-hover:scale-110 transition-transform">
              <ImageIcon className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-mono text-purple-300 bg-purple-950/80 px-2.5 py-1 rounded-full border border-purple-500/30">
              Image Studio
            </span>
          </div>

          <h3 className="text-xl font-bold text-slate-100 group-hover:text-purple-300 transition-colors font-mono mb-2">
            Generate Image
          </h3>
          <p className="text-xs text-slate-400 mb-6 line-clamp-2">
            Create photorealistic artwork, 3D renders, and cyberpunk illustrations in resolutions up to 4K.
          </p>

          <div className="flex items-center gap-2 text-xs font-bold text-purple-400 group-hover:translate-x-1 transition-transform">
            <span>Open Image Studio</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Generate Video */}
        <div 
          onClick={() => setActiveView('video')}
          className="group relative p-6 rounded-2xl bg-[#0B132B]/80 hover:bg-[#0B132B] border border-emerald-500/20 hover:border-emerald-400 transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_30px_rgba(0,255,136,0.2)] overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-400/20 transition-all" />
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 group-hover:scale-110 transition-transform">
              <VideoIcon className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30">
              Veo Video Engine
            </span>
          </div>

          <h3 className="text-xl font-bold text-slate-100 group-hover:text-emerald-300 transition-colors font-mono mb-2">
            Generate Video
          </h3>
          <p className="text-xs text-slate-400 mb-6 line-clamp-2">
            Synthesize high-definition motion video with custom camera vectors, frame rate, and soundtracks.
          </p>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
            <span>Open Video Studio</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Quick Prompt Starters */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-200 font-mono flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Instant Prompt Starters</span>
          </h2>
          <span className="text-xs text-slate-400">Click any card to launch immediately</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickPrompts.map((starter, i) => {
            const Icon = starter.icon;
            return (
              <div
                key={i}
                onClick={() => {
                  if (starter.view === 'chat') {
                    onStartNewChat(starter.prompt);
                    setActiveView('chat');
                  } else {
                    setActiveView(starter.view as ActiveView);
                  }
                }}
                className={`p-4 rounded-xl bg-slate-900/60 border hover:bg-slate-800/80 transition-all cursor-pointer group flex flex-col justify-between ${starter.color}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-wider">
                      {starter.category}
                    </span>
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-cyan-300 transition-colors" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-200 mb-1 group-hover:text-cyan-300 transition-colors">
                    {starter.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 italic">
                    "{starter.prompt}"
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-cyan-400 font-medium">
                  <span>Execute Prompt</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Generations Gallery Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Images */}
        <div className="p-6 rounded-2xl bg-[#0B132B]/60 border border-cyan-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-200 font-mono flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-purple-400" />
              <span>Recent Image Creations</span>
            </h3>
            <button
              onClick={() => setActiveView('image')}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-mono"
            >
              <span>View Gallery</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {recentImages.slice(0, 3).map((img) => (
              <div
                key={img.id}
                onClick={() => setActiveView('image')}
                className="group relative aspect-square rounded-xl overflow-hidden border border-cyan-500/30 cursor-pointer"
              >
                <img
                  src={img.url}
                  alt={img.prompt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                  <span className="text-[10px] text-slate-200 line-clamp-1">
                    {img.prompt}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Videos */}
        <div className="p-6 rounded-2xl bg-[#0B132B]/60 border border-cyan-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-200 font-mono flex items-center gap-2">
              <VideoIcon className="w-4 h-4 text-emerald-400" />
              <span>Recent Video Creations</span>
            </h3>
            <button
              onClick={() => setActiveView('video')}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-mono"
            >
              <span>View Studio</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {recentVideos.slice(0, 2).map((vid) => (
              <div
                key={vid.id}
                onClick={() => setActiveView('video')}
                className="group relative aspect-video rounded-xl overflow-hidden border border-emerald-500/30 cursor-pointer"
              >
                <img
                  src={vid.thumbnailUrl}
                  alt={vid.prompt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/80 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <VideoIcon className="w-4 h-4 ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-[10px] text-slate-200 font-mono bg-black/60 px-2 py-0.5 rounded">
                  <span className="truncate max-w-[100px]">{vid.prompt}</span>
                  <span>{vid.duration}s</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
