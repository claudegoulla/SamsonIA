import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Save, 
  Volume2, 
  Bot, 
  Palette, 
  Key, 
  Sliders, 
  Sparkles, 
  Check, 
  RefreshCw 
} from 'lucide-react';
import { UserSettings } from '../types';

interface SettingsViewProps {
  settings: UserSettings;
  onSaveSettings: (newSettings: UserSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
}) => {
  const [formState, setFormState] = useState<UserSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formState);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const voiceOptions = ['Kore', 'Puck', 'Zephyr', 'Fenrir', 'Charon'];

  return (
    <div className="space-y-8 pb-12 animate-fadeIn max-w-4xl mx-auto">
      {/* Settings Header */}
      <div className="p-6 rounded-3xl bg-[#0B132B]/80 border border-cyan-500/20 shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-cyan-400" />
            <span>SamsonIA Configuration & Settings</span>
          </h2>
          <p className="text-xs text-slate-400">
            Customize AI model defaults, speech synthesis parameters, custom system prompts, and UI accents.
          </p>
        </div>

        {savedSuccess && (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold animate-fadeIn">
            <Check className="w-4 h-4" />
            Settings Saved
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: AI Model & Reasoning */}
        <div className="p-6 rounded-2xl bg-[#0B132B]/60 border border-cyan-500/20 space-y-4">
          <h3 className="text-sm font-mono font-bold text-cyan-400 flex items-center gap-2 border-b border-slate-800 pb-2">
            <Bot className="w-4 h-4" />
            <span>AI Reasoning & Default Models</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-300">Default Chat Model</label>
              <select
                value={formState.defaultModel}
                onChange={(e) => setFormState({ ...formState, defaultModel: e.target.value })}
                className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2.5 text-xs text-cyan-300 focus:outline-none focus:border-cyan-400"
              >
                <option value="gemini-3.6-flash">Gemini 3.6 Flash (Recommended - Ultra Fast)</option>
                <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Deep STEM Reasoning)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-300">Stream Processing Speed</label>
              <select
                value={formState.streamSpeed}
                onChange={(e) => setFormState({ ...formState, streamSpeed: e.target.value as any })}
                className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2.5 text-xs text-slate-200"
              >
                <option value="fast">High Velocity (Real-time)</option>
                <option value="normal">Standard Synchronous</option>
                <option value="relaxed">Relaxed Precision</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-300">
              Custom AI System Instruction / Persona
            </label>
            <textarea
              rows={3}
              value={formState.systemPrompt}
              onChange={(e) => setFormState({ ...formState, systemPrompt: e.target.value })}
              className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 font-sans"
            />
          </div>
        </div>

        {/* Section 2: Speech & Voice Output */}
        <div className="p-6 rounded-2xl bg-[#0B132B]/60 border border-cyan-500/20 space-y-4">
          <h3 className="text-sm font-mono font-bold text-amber-400 flex items-center gap-2 border-b border-slate-800 pb-2">
            <Volume2 className="w-4 h-4" />
            <span>Voice & Text-To-Speech Output</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-300">Gemini Voice Model</label>
              <select
                value={formState.selectedVoice}
                onChange={(e) => setFormState({ ...formState, selectedVoice: e.target.value })}
                className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2.5 text-xs text-amber-300 focus:outline-none"
              >
                {voiceOptions.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-300">Speech Rate ({formState.speechRate}x)</label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={formState.speechRate}
                onChange={(e) => setFormState({ ...formState, speechRate: parseFloat(e.target.value) })}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            <div className="space-y-2 flex flex-col justify-end">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-slate-200">
                <input
                  type="checkbox"
                  checked={formState.autoSpeechOutput}
                  onChange={(e) => setFormState({ ...formState, autoSpeechOutput: e.target.checked })}
                  className="rounded border-cyan-500/30 bg-slate-900 text-cyan-400 focus:ring-0"
                />
                <span>Auto-read out responses</span>
              </label>
            </div>
          </div>
        </div>

        {/* Section 3: Appearance & UI Theme */}
        <div className="p-6 rounded-2xl bg-[#0B132B]/60 border border-cyan-500/20 space-y-4">
          <h3 className="text-sm font-mono font-bold text-purple-400 flex items-center gap-2 border-b border-slate-800 pb-2">
            <Palette className="w-4 h-4" />
            <span>Studio Defaults & UI Accent</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-300">Theme Glow Accent</label>
              <div className="flex gap-3">
                {[
                  { id: 'cyan', color: 'bg-cyan-400 border-cyan-300' },
                  { id: 'purple', color: 'bg-purple-500 border-purple-400' },
                  { id: 'emerald', color: 'bg-emerald-400 border-emerald-300' },
                  { id: 'amber', color: 'bg-amber-400 border-amber-300' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFormState({ ...formState, accentColor: item.id as any })}
                    className={`w-8 h-8 rounded-full ${item.color} border-2 transition-transform ${
                      formState.accentColor === item.id ? 'scale-125 ring-2 ring-white' : 'opacity-60'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-300">Default Image Aspect</label>
              <select
                value={formState.defaultImageAspect}
                onChange={(e) => setFormState({ ...formState, defaultImageAspect: e.target.value })}
                className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2.5 text-xs text-slate-200"
              >
                <option value="16:9">16:9 Landscape</option>
                <option value="1:1">1:1 Square</option>
                <option value="9:16">9:16 Portrait</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-300">Default Video Resolution</label>
              <select
                value={formState.defaultVideoResolution}
                onChange={(e) => setFormState({ ...formState, defaultVideoResolution: e.target.value })}
                className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-2.5 text-xs text-slate-200"
              >
                <option value="1080p">1080p Full HD</option>
                <option value="720p">720p HD</option>
                <option value="4K">4K Ultra HD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:shadow-[0_0_40px_rgba(0,240,255,0.7)] transition-all flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          <span>Save System Preferences</span>
        </button>
      </form>
    </div>
  );
};
