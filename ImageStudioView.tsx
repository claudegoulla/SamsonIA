import React, { useState } from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Download, 
  Copy, 
  Check, 
  Wand2, 
  Maximize2, 
  Layers, 
  Ratio, 
  RefreshCw, 
  Trash2,
  Share2
} from 'lucide-react';
import { GeneratedImage, UserSettings } from '../types';

interface ImageStudioViewProps {
  images: GeneratedImage[];
  onGenerateImage: (prompt: string, aspectRatio: string, style: string, resolution: string) => Promise<void>;
  onDeleteImage: (id: string) => void;
  isGenerating: boolean;
  settings: UserSettings;
}

export const ImageStudioView: React.FC<ImageStudioViewProps> = ({
  images,
  onGenerateImage,
  onDeleteImage,
  isGenerating,
  settings,
}) => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('Sci-Fi Concept');
  const [selectedAspect, setSelectedAspect] = useState(settings.defaultImageAspect || '16:9');
  const [selectedResolution, setSelectedResolution] = useState('1K');
  const [selectedModalImage, setSelectedModalImage] = useState<GeneratedImage | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const stylePresets = [
    { name: 'Sci-Fi Concept', icon: '🚀' },
    { name: 'Cyberpunk', icon: '🌆' },
    { name: '8K Photorealistic', icon: '📸' },
    { name: 'Anime / Manga', icon: '🎨' },
    { name: 'Synthwave Neon', icon: '🌆' },
    { name: 'Hyper-Detailed 3D', icon: '💎' },
    { name: 'Minimalist Line Art', icon: '✒️' },
  ];

  const aspectRatios = [
    { label: '16:9 Landscape', value: '16:9' },
    { label: '1:1 Square', value: '1:1' },
    { label: '9:16 Portrait', value: '9:16' },
    { label: '4:3 Standard', value: '4:3' },
    { label: '3:4 Vertical', value: '3:4' },
  ];

  const resolutions = ['512px', '1K', '2K', '4K'];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    await onGenerateImage(prompt, selectedAspect, selectedStyle, selectedResolution);
  };

  const handleEnhancePrompt = () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);
    setTimeout(() => {
      setPrompt((prev) => `${prev}, cinematic lighting, electric cyan luminescence, hyper-detailed Octane Render, 8K resolution, masterpiece quality`);
      setIsEnhancing(false);
    }, 600);
  };

  const handleCopyPrompt = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (imageUrl: string, filename: string) => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `samson_ai_${filename.slice(0, 15).replace(/[^a-zA-Z0-9]/g, '_')}.png`;
    a.click();
  };

  return (
    <div className="space-y-8 pb-12 animate-fadeIn">
      {/* Top Generator Control Box */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#0B132B] via-[#1C2541]/80 to-[#070B19] border border-purple-500/30 shadow-[0_0_40px_rgba(157,78,221,0.15)] space-y-6">
        <div className="flex items-center justify-between border-b border-purple-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-mono text-slate-100">
                Samson Image Studio
              </h2>
              <p className="text-xs text-slate-400">
                Powered by Gemini 3.1 Flash Image Engine with up to 4K resolution synthesis
              </p>
            </div>
          </div>

          <span className="px-3 py-1 text-xs font-mono font-medium rounded-full bg-purple-950 text-purple-300 border border-purple-500/30 hidden sm:inline">
            MODEL: GEMINI-3.1-FLASH-IMAGE
          </span>
        </div>

        <form onSubmit={handleGenerate} className="space-y-6">
          {/* Prompt Area */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono font-bold text-slate-200">
                ENTER VISUAL PROMPT
              </label>
              <button
                type="button"
                onClick={handleEnhancePrompt}
                disabled={!prompt.trim() || isEnhancing}
                className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-medium disabled:opacity-50 transition-colors"
              >
                <Wand2 className={`w-3.5 h-3.5 ${isEnhancing ? 'animate-spin' : ''}`} />
                <span>Enhance Prompt with Gemini</span>
              </button>
            </div>

            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A cybernetic samurai standing on a rooftop in neo-tokyo during a rainstorm, glowing blue energy blade, photorealistic 8k..."
              className="w-full bg-slate-900/90 rounded-2xl border border-purple-500/30 p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-400 shadow-inner font-sans resize-none"
            />
          </div>

          {/* Controls: Style, Aspect Ratio, Resolution */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Style Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>Aesthetic Style</span>
              </label>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full bg-slate-900 border border-purple-500/30 rounded-xl p-2.5 text-xs text-purple-300 focus:outline-none focus:border-purple-400 cursor-pointer"
              >
                {stylePresets.map((style) => (
                  <option key={style.name} value={style.name}>
                    {style.icon} {style.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <Ratio className="w-3.5 h-3.5 text-cyan-400" />
                <span>Aspect Ratio</span>
              </label>
              <select
                value={selectedAspect}
                onChange={(e) => setSelectedAspect(e.target.value)}
                className="w-full bg-slate-900 border border-purple-500/30 rounded-xl p-2.5 text-xs text-cyan-300 focus:outline-none focus:border-purple-400 cursor-pointer"
              >
                {aspectRatios.map((aspect) => (
                  <option key={aspect.value} value={aspect.value}>
                    {aspect.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Resolution */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Target Resolution</span>
              </label>
              <div className="flex gap-1.5">
                {resolutions.map((res) => (
                  <button
                    key={res}
                    type="button"
                    onClick={() => setSelectedResolution(res)}
                    className={`flex-1 py-2 text-xs font-mono rounded-xl border transition-all ${
                      selectedResolution === res
                        ? 'bg-purple-500/30 text-purple-300 border-purple-400 font-bold shadow-[0_0_10px_rgba(157,78,221,0.3)]'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {res}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-slate-950 font-bold text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(157,78,221,0.4)] hover:shadow-[0_0_45px_rgba(157,78,221,0.7)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Synthesizing High-Res Image...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Synthesize Artwork Now</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Generated Images Gallery */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold font-mono text-slate-200 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-purple-400" />
            <span>Generated Creations Archive</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {images.length} images saved
          </span>
        </div>

        {images.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 space-y-2">
            <ImageIcon className="w-12 h-12 mx-auto text-slate-600" />
            <p className="text-sm">No images generated yet. Enter a prompt above to start creating.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img) => (
              <div
                key={img.id}
                className="group relative rounded-2xl bg-[#0B132B]/80 border border-purple-500/20 hover:border-purple-400 overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Display */}
                <div 
                  onClick={() => setSelectedModalImage(img)}
                  className="relative aspect-video bg-black cursor-pointer overflow-hidden"
                >
                  <img
                    src={img.url}
                    alt={img.prompt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button className="p-2 rounded-xl bg-purple-500/80 text-slate-950 font-bold hover:scale-110 transition-transform">
                      <Maximize2 className="w-5 h-5" />
                    </button>
                  </div>

                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/70 text-purple-300 border border-purple-500/30">
                    {img.resolution} | {img.aspectRatio}
                  </span>
                </div>

                {/* Details & Actions */}
                <div className="p-4 space-y-3">
                  <p className="text-xs text-slate-300 line-clamp-2 italic font-sans">
                    "{img.prompt}"
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono border-t border-slate-800 pt-2">
                    <span className="text-purple-400">{img.style}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyPrompt(img.prompt, img.id)}
                        className="p-1 hover:text-cyan-300 transition-colors"
                        title="Copy Prompt"
                      >
                        {copiedId === img.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleDownload(img.url, img.prompt)}
                        className="p-1 hover:text-cyan-300 transition-colors"
                        title="Download Image"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDeleteImage(img.id)}
                        className="p-1 hover:text-rose-400 transition-colors"
                        title="Delete Image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Image Preview Modal */}
      {selectedModalImage && (
        <div 
          onClick={() => setSelectedModalImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl p-4 md:p-8 flex items-center justify-center animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="max-w-5xl w-full max-h-[90vh] bg-[#070B19] rounded-3xl border border-purple-500/40 overflow-hidden shadow-2xl flex flex-col md:flex-row"
          >
            {/* Image Box */}
            <div className="flex-1 bg-black flex items-center justify-center p-4">
              <img
                src={selectedModalImage.url}
                alt={selectedModalImage.prompt}
                className="max-h-[75vh] w-auto object-contain rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Sidebar Details */}
            <div className="w-full md:w-80 p-6 bg-[#0B132B] border-l border-purple-500/20 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-purple-400">IMAGE DETAILS</span>
                  <button
                    onClick={() => setSelectedModalImage(null)}
                    className="text-slate-400 hover:text-slate-100 font-bold text-sm"
                  >
                    ✕
                  </button>
                </div>

                <div>
                  <h4 className="text-xs font-mono text-slate-400 uppercase mb-1">Prompt</h4>
                  <p className="text-xs text-slate-200 leading-relaxed italic bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    "{selectedModalImage.prompt}"
                  </p>
                </div>

                <div className="space-y-2 text-xs font-mono text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Aesthetic Style:</span>
                    <span className="text-purple-300">{selectedModalImage.style}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Aspect Ratio:</span>
                    <span className="text-cyan-300">{selectedModalImage.aspectRatio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Resolution:</span>
                    <span className="text-amber-300">{selectedModalImage.resolution}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Created:</span>
                    <span>{new Date(selectedModalImage.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-800">
                <button
                  onClick={() => {
                    setPrompt(selectedModalImage.prompt);
                    setSelectedModalImage(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-bold hover:bg-purple-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>Reuse Prompt</span>
                </button>

                <button
                  onClick={() => handleDownload(selectedModalImage.url, selectedModalImage.prompt)}
                  className="w-full py-2.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Image</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
