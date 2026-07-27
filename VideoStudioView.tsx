import React, { useState } from 'react';
import { 
  Video as VideoIcon, 
  Sparkles, 
  Play, 
  Pause, 
  Download, 
  Film, 
  Camera, 
  Clock, 
  Music, 
  RefreshCw, 
  Sliders, 
  Volume2, 
  VolumeX, 
  Trash2,
  Maximize2
} from 'lucide-react';
import { GeneratedVideo, UserSettings } from '../types';

interface VideoStudioViewProps {
  videos: GeneratedVideo[];
  onGenerateVideo: (
    prompt: string,
    duration: number,
    cameraMotion: string,
    resolution: string,
    fps: number,
    soundtrack: string
  ) => Promise<void>;
  onDeleteVideo: (id: string) => void;
  isGenerating: boolean;
  settings: UserSettings;
}

export const VideoStudioView: React.FC<VideoStudioViewProps> = ({
  videos,
  onGenerateVideo,
  onDeleteVideo,
  isGenerating,
  settings,
}) => {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState<number>(5);
  const [cameraMotion, setCameraMotion] = useState('Cinematic Orbit');
  const [resolution, setResolution] = useState(settings.defaultVideoResolution || '1080p');
  const [fps, setFps] = useState<number>(60);
  const [soundtrack, setSoundtrack] = useState('Sci-Fi Pulse');
  const [activePreviewVideo, setActivePreviewVideo] = useState<GeneratedVideo | null>(videos[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const cameraOptions = [
    'Cinematic Orbit',
    'Pan Right',
    'Zoom In Fast',
    'Drone Flythrough',
    'Static Macro',
  ];

  const soundtrackOptions = [
    'Sci-Fi Pulse',
    'Cybernetic Beats',
    'Atmospheric Ambient',
    'Silent Vacuum',
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    await onGenerateVideo(prompt, duration, cameraMotion, resolution, fps, soundtrack);
  };

  return (
    <div className="space-y-8 pb-12 animate-fadeIn">
      {/* Studio Header & Form */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#0B132B] via-[#1C2541]/80 to-[#070B19] border border-emerald-500/30 shadow-[0_0_40px_rgba(0,255,136,0.15)] space-y-6">
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <VideoIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-mono text-slate-100">
                Veo AI Video Generation Studio
              </h2>
              <p className="text-xs text-slate-400">
                Synthesize motion sequences, keyframe dynamics, and audio soundscapes
              </p>
            </div>
          </div>

          <span className="px-3 py-1 text-xs font-mono font-medium rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 hidden sm:inline">
            ENGINE: VEO-3.1-LITE
          </span>
        </div>

        <form onSubmit={handleGenerate} className="space-y-6">
          {/* Prompt */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-slate-200">
              VIDEO MOTION PROMPT
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A futuristic starship warping out of hyperspace over a ringed planet at sunrise, motion blur, 60fps cinematic..."
              className="w-full bg-slate-900/90 rounded-2xl border border-emerald-500/30 p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-sans resize-none"
            />
          </div>

          {/* Controls: Camera, Duration, Resolution, FPS, Soundtrack */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Camera Motion */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-emerald-400" />
                <span>Camera Motion</span>
              </label>
              <select
                value={cameraMotion}
                onChange={(e) => setCameraMotion(e.target.value)}
                className="w-full bg-slate-900 border border-emerald-500/30 rounded-xl p-2.5 text-xs text-emerald-300 focus:outline-none focus:border-emerald-400 cursor-pointer"
              >
                {cameraOptions.map((cam) => (
                  <option key={cam} value={cam}>{cam}</option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Duration (s)</span>
              </label>
              <div className="flex gap-2">
                {[3, 5, 10].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`flex-1 py-2 text-xs font-mono rounded-xl border transition-all ${
                      duration === d
                        ? 'bg-emerald-500/30 text-emerald-300 border-emerald-400 font-bold shadow-[0_0_10px_rgba(0,255,136,0.3)]'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {d}s
                  </button>
                ))}
              </div>
            </div>

            {/* Resolution & FPS */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-purple-400" />
                <span>Resolution / FPS</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="flex-1 bg-slate-900 border border-emerald-500/30 rounded-xl p-2 text-xs text-slate-200"
                >
                  <option value="720p">720p</option>
                  <option value="1080p">1080p</option>
                  <option value="4K">4K</option>
                </select>
                <select
                  value={fps}
                  onChange={(e) => setFps(Number(e.target.value))}
                  className="w-20 bg-slate-900 border border-emerald-500/30 rounded-xl p-2 text-xs text-slate-200"
                >
                  <option value={24}>24fps</option>
                  <option value={30}>30fps</option>
                  <option value={60}>60fps</option>
                </select>
              </div>
            </div>

            {/* Soundtrack */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-amber-400" />
                <span>Audio Track</span>
              </label>
              <select
                value={soundtrack}
                onChange={(e) => setSoundtrack(e.target.value)}
                className="w-full bg-slate-900 border border-emerald-500/30 rounded-xl p-2.5 text-xs text-amber-300 focus:outline-none focus:border-emerald-400 cursor-pointer"
              >
                {soundtrackOptions.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-bold text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(0,255,136,0.3)] hover:shadow-[0_0_45px_rgba(0,255,136,0.6)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Rendering Motion Frames (Veo Engine)...</span>
              </>
            ) : (
              <>
                <Film className="w-5 h-5" />
                <span>Synthesize Video Sequence</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Primary Video Player Stage */}
      {activePreviewVideo && (
        <div className="p-6 rounded-3xl bg-[#070B19] border border-emerald-500/30 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-mono font-bold text-emerald-400 flex items-center gap-2">
              <VideoIcon className="w-4 h-4" />
              <span>ACTIVE PREVIEW STAGE</span>
            </h3>

            <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
              <span>{activePreviewVideo.resolution}</span>
              <span>{activePreviewVideo.fps} FPS</span>
              <span className="text-emerald-400">{activePreviewVideo.duration}s</span>
            </div>
          </div>

          {/* Player Display */}
          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-emerald-500/20 group">
            <video
              src={activePreviewVideo.url}
              controls
              autoPlay={isPlaying}
              muted={isMuted}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-mono text-slate-300">
            <p className="italic text-slate-300">
              "{activePreviewVideo.prompt}"
            </p>

            <a
              href={activePreviewVideo.url}
              download="samson_video.mp4"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-all flex items-center justify-center gap-2 w-fit"
            >
              <Download className="w-4 h-4" />
              <span>Download MP4</span>
            </a>
          </div>
        </div>
      )}

      {/* Video Archive Gallery */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold font-mono text-slate-200 flex items-center gap-2">
          <Film className="w-5 h-5 text-emerald-400" />
          <span>Rendered Video Library</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((vid) => (
            <div
              key={vid.id}
              onClick={() => setActivePreviewVideo(vid)}
              className={`group relative rounded-2xl bg-[#0B132B]/80 border overflow-hidden cursor-pointer transition-all ${
                activePreviewVideo?.id === vid.id
                  ? 'border-emerald-400 shadow-[0_0_20px_rgba(0,255,136,0.3)]'
                  : 'border-emerald-500/20 hover:border-emerald-500/50'
              }`}
            >
              <div className="relative aspect-video bg-black">
                <img
                  src={vid.thumbnailUrl}
                  alt={vid.prompt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 ml-0.5" />
                  </div>
                </div>

                <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/70 text-emerald-300 border border-emerald-500/30">
                  {vid.duration}s | {vid.resolution}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <p className="text-xs text-slate-300 line-clamp-2 italic">
                  "{vid.prompt}"
                </p>

                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 border-t border-slate-800 pt-2">
                  <span className="text-emerald-400">{vid.cameraMotion}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteVideo(vid.id);
                    }}
                    className="p-1 hover:text-rose-400 transition-colors"
                    title="Delete Video"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
