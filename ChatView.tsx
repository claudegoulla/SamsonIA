import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Sparkles, 
  Bot, 
  User as UserIcon, 
  Download, 
  Search, 
  Cpu, 
  Clock, 
  Zap, 
  MessageSquare,
  RefreshCw,
  Share2
} from 'lucide-react';
import { ChatSession, ChatMessage, UserSettings } from '../types';
import { SpeechHandler, speakText, stopSpeaking } from '../lib/speech';
import { getSamsonMemory, saveSamsonMemory } from '../lib/storage';
interface ChatViewProps {
  sessions: ChatSession[];
  activeSessionId: string;
  setActiveSessionId: (id: string) => void;
  onNewSession: (initialPrompt?: string) => void;
  onDeleteSession: (id: string) => void;
  onSendMessage: (sessionId: string, message: string, model: string) => Promise<void>;
  settings: UserSettings;
  isGenerating: boolean;
}

export const ChatView: React.FC<ChatViewProps> = ({
  sessions,
  activeSessionId,
  setActiveSessionId,
  onNewSession,
  onDeleteSession,
  onSendMessage,
  settings,
  isGenerating,
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState<string>(settings.defaultModel || 'gemini-3.6-flash');
  const [isListening, setIsListening] = useState(false);
  const [speechHandler] = useState(() => new SpeechHandler());
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
const [memory, setMemory] = useState<string[]>(getSamsonMemory());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages, isGenerating]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isGenerating) return;

    const text = inputMessage;

    const newMemory = [...memory, text];
    setMemory(newMemory);
    saveSamsonMemory(newMemory);

    setInputMessage('');
    await onSendMessage(activeSession?.id || '', text, selectedModel);
  };

  const toggleListening = () => {
    if (isListening) {
      speechHandler.stopListening();
      setIsListening(false);
    } else {
      speechHandler.startListening(
        (text, isFinal) => {
          setInputMessage(text);
          if (isFinal) {
            setIsListening(false);
          }
        },
        (err) => {
          console.warn('Speech Recognition error:', err);
          setIsListening(false);
        },
        () => {
          setIsListening(false);
        }
      );
      setIsListening(true);
    }
  };

  const handleCopyCodeOrText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleReadAloud = async (message: ChatMessage) => {
    if (speakingMsgId === message.id) {
      stopSpeaking();
      setSpeakingMsgId(null);
    } else {
      setSpeakingMsgId(message.id);
      await speakText(message.text, settings.selectedVoice, settings.speechRate);
      setSpeakingMsgId(null);
    }
  };

  const handleExportSession = () => {
    if (!activeSession) return;
    const jsonStr = JSON.stringify(activeSession, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `samson_chat_${activeSession.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-6rem)] gap-4 overflow-hidden animate-fadeIn">
      {/* Left Chat History Sidebar */}
      <div className="w-64 md:w-72 flex flex-col bg-[#070B19]/80 rounded-2xl border border-cyan-500/20 shadow-xl overflow-hidden hidden md:flex">
        {/* Header & New Chat */}
        <div className="p-3 border-b border-cyan-500/15 space-y-2">
          <button
            onClick={() => onNewSession()}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat Session</span>
          </button>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900/80 border border-cyan-500/20 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {filteredSessions.map((s) => {
            const isActive = s.id === activeSession?.id;
            return (
              <div
                key={s.id}
                onClick={() => setActiveSessionId(s.id)}
                className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <MessageSquare className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span className="text-xs truncate">{s.title || 'Untitled Chat'}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(s.id);
                  }}
                  className="p-1 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete Session"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col bg-[#070B19]/90 rounded-2xl border border-cyan-500/20 shadow-2xl overflow-hidden">
        {/* Top Chat Toolbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-cyan-500/15 bg-[#0B132B]/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-900/80 border border-cyan-500/30 px-3 py-1 rounded-xl">
              <Bot className="w-4 h-4 text-cyan-400" />
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-transparent text-xs font-mono font-bold text-cyan-300 focus:outline-none cursor-pointer"
              >
                <option value="gemini-3.6-flash" className="bg-slate-900 text-slate-200">
                  Gemini 3.6 Flash (Fast & Smart)
                </option>
                <option value="gemini-3.1-pro-preview" className="bg-slate-900 text-slate-200">
                  Gemini 3.1 Pro (Deep Reasoning)
                </option>
              </select>
            </div>

            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              {activeSession?.messages?.length || 0} messages
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportSession}
              className="p-2 rounded-xl bg-slate-900/60 border border-cyan-500/20 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 text-xs transition-all flex items-center gap-1.5"
              title="Export Conversation"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Export</span>
            </button>

            <button
              onClick={() => onNewSession()}
              className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs hover:bg-cyan-500/30 transition-all md:hidden"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
          {activeSession?.messages?.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Bot className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold font-mono text-slate-100">
                SamsonIA Neural Assistant
              </h3>
              <p className="text-xs md:text-sm text-slate-400 max-w-md">
                Ask any question, brainstorm ideas, request code refactoring, or ask for complex reasoning. Powered by Gemini 3.6.
              </p>
            </div>
          ) : (
            activeSession?.messages?.map((msg) => {
              const isAi = msg.sender === 'ai';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-4xl ${isAi ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold border ${
                    isAi 
                      ? 'bg-cyan-950 text-cyan-400 border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]' 
                      : 'bg-blue-900 text-blue-200 border-blue-500/40'
                  }`}>
                    {isAi ? <Bot className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                  </div>

                  {/* Message Box */}
                  <div className={`space-y-2 max-w-[85%] ${isAi ? 'items-start' : 'items-end'}`}>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed border ${
                      isAi
                        ? 'bg-[#0B132B]/90 border-cyan-500/25 text-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
                        : 'bg-gradient-to-r from-blue-600 to-cyan-600 border-cyan-400/30 text-slate-950 font-medium shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                    }`}>
                      {/* Markdown rendered simple preview */}
                      <div className="whitespace-pre-wrap font-sans">
                        {msg.text}
                      </div>
                    </div>

                    {/* Metadata & Actions */}
                    <div className={`flex items-center gap-3 text-[10px] font-mono text-slate-400 px-1 ${
                      isAi ? 'justify-start' : 'justify-end'
                    }`}>
                      <span>{msg.timestamp}</span>

                      {isAi && (
                        <>
                          {msg.latencyMs && (
                            <span className="flex items-center gap-1 text-cyan-400/80">
                              <Clock className="w-3 h-3" />
                              {msg.latencyMs}ms
                            </span>
                          )}

                          {msg.tokenCount && (
                            <span className="flex items-center gap-1 text-slate-400">
                              <Zap className="w-3 h-3 text-amber-400" />
                              ~{msg.tokenCount} tok
                            </span>
                          )}

                          <button
                            onClick={() => handleCopyCodeOrText(msg.text, msg.id)}
                            className="p-1 hover:text-cyan-300 transition-colors"
                            title="Copy text"
                          >
                            {copiedMsgId === msg.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <button
                            onClick={() => handleReadAloud(msg)}
                            className={`p-1 transition-colors ${
                              speakingMsgId === msg.id ? 'text-amber-400 animate-pulse' : 'hover:text-cyan-300'
                            }`}
                            title="Read Out Loud (TTS)"
                          >
                            {speakingMsgId === msg.id ? (
                              <VolumeX className="w-3.5 h-3.5" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {isGenerating && (
            <div className="flex gap-3 mr-auto max-w-2xl">
              <div className="w-8 h-8 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/40 flex items-center justify-center animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-[#0B132B]/90 border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                <span>SamsonIA Neural Core synthesizing response...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Input Area */}
        <form onSubmit={handleSend} className="p-4 border-t border-cyan-500/15 bg-[#0B132B]/60 space-y-2">
          <div className="relative flex items-center bg-slate-900/90 rounded-2xl border border-cyan-500/30 p-2 focus-within:border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.08)]">
            <textarea
              rows={1}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={isListening ? "Listening... Speak now..." : "Message SamsonIA... (Press Enter to send)"}
              className="flex-1 bg-transparent px-3 py-1.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none font-sans"
            />

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2.5 rounded-xl border transition-all ${
                  isListening
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/50 animate-pulse'
                    : 'bg-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/30 border-transparent'
                }`}
                title={isListening ? "Stop Voice Input" : "Start Voice Input"}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                type="submit"
                disabled={!inputMessage.trim() || isGenerating}
                className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 px-2 font-mono">
            <span>Model: {selectedModel}</span>
            <span>Shift + Enter for new line</span>
          </div>
        </form>
      </div>
    </div>
  );
};
