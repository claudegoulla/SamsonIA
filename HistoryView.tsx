import React, { useState } from 'react';
import { 
  History, 
  Search, 
  MessageSquare, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Trash2, 
  Download, 
  ExternalLink,
  Filter
} from 'lucide-react';
import { ChatSession, GeneratedImage, GeneratedVideo, ActiveView } from '../types';

interface HistoryViewProps {
  chats: ChatSession[];
  images: GeneratedImage[];
  videos: GeneratedVideo[];
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onDeleteImage: (id: string) => void;
  onDeleteVideo: (id: string) => void;
  setActiveView: (view: ActiveView) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  chats,
  images,
  videos,
  onSelectChat,
  onDeleteChat,
  onDeleteImage,
  onDeleteVideo,
  setActiveView,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'chats' | 'images' | 'videos'>('all');
  const [search, setSearch] = useState('');

  const filteredChats = chats.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const filteredImages = images.filter((i) =>
    i.prompt.toLowerCase().includes(search.toLowerCase())
  );

  const filteredVideos = videos.filter((v) =>
    v.prompt.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportAll = () => {
    const payload = { chats, images, videos };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `samsonia_full_archive_${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="space-y-8 pb-12 animate-fadeIn">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0B132B]/80 border border-cyan-500/20 shadow-xl">
        <div>
          <h2 className="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
            <History className="w-6 h-6 text-cyan-400" />
            <span>Archive & Generation History</span>
          </h2>
          <p className="text-xs text-slate-400">
            Search, filter, export, and manage your saved chat threads, artwork, and video renders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportAll}
            className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold hover:bg-cyan-500/30 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Archive (JSON)</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-cyan-500/20 w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Activity' },
            { id: 'chats', label: `Chats (${chats.length})` },
            { id: 'images', label: `Images (${images.length})` },
            { id: 'videos', label: `Videos (${videos.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search prompt or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900/90 border border-cyan-500/20 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Content Grid */}
      <div className="space-y-6">
        {/* Chats Section */}
        {(activeTab === 'all' || activeTab === 'chats') && filteredChats.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span>Chat Conversations ({filteredChats.length})</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredChats.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    onSelectChat(c.id);
                    setActiveView('chat');
                  }}
                  className="p-4 rounded-2xl bg-[#0B132B]/60 border border-cyan-500/20 hover:border-cyan-400 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="space-y-1 min-w-0 flex-1 pr-4">
                    <h4 className="text-sm font-bold text-slate-200 group-hover:text-cyan-300 truncate">
                      {c.title}
                    </h4>
                    <p className="text-xs text-slate-400 font-mono">
                      {c.messages.length} messages | {new Date(c.updatedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(c.id);
                      }}
                      className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Delete Chat"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ExternalLink className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Images Section */}
        {(activeTab === 'all' || activeTab === 'images') && filteredImages.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              <span>Generated Artwork ({filteredImages.length})</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredImages.map((img) => (
                <div
                  key={img.id}
                  onClick={() => setActiveView('image')}
                  className="p-3 rounded-2xl bg-[#0B132B]/60 border border-purple-500/20 hover:border-purple-400 cursor-pointer transition-all space-y-2 group"
                >
                  <div className="aspect-video bg-black rounded-xl overflow-hidden">
                    <img
                      src={img.url}
                      alt={img.prompt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-1 italic">
                    "{img.prompt}"
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{img.style}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteImage(img.id);
                      }}
                      className="text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Videos Section */}
        {(activeTab === 'all' || activeTab === 'videos') && filteredVideos.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <VideoIcon className="w-4 h-4" />
              <span>Rendered Videos ({filteredVideos.length})</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredVideos.map((vid) => (
                <div
                  key={vid.id}
                  onClick={() => setActiveView('video')}
                  className="p-3 rounded-2xl bg-[#0B132B]/60 border border-emerald-500/20 hover:border-emerald-400 cursor-pointer transition-all space-y-2 group"
                >
                  <div className="aspect-video bg-black rounded-xl overflow-hidden relative">
                    <img
                      src={vid.thumbnailUrl}
                      alt={vid.prompt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-1 italic">
                    "{vid.prompt}"
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{vid.duration}s | {vid.resolution}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteVideo(vid.id);
                      }}
                      className="text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
