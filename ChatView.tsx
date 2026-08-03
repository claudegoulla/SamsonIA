import React, { useState, useRef, useEffect } from "react";
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
  Bot,
  User as UserIcon,
  Download,
  Search,
  Clock,
  Zap,
  MessageSquare,
  RefreshCw
} from "lucide-react";

import { ChatSession, ChatMessage, UserSettings } from "./types";
import { SpeechHandler, speakText, stopSpeaking } from "./speech";
import { getSamsonMemory, saveSamsonMemory } from "./storage";

interface ChatViewProps {
  sessions: ChatSession[];
  activeSessionId: string;
  setActiveSessionId: (id: string) => void;
  onNewSession: (initialPrompt?: string) => void;
  onDeleteSession: (id: string) => void;
  onSendMessage: (
    sessionId: string,
    message: string,
    model: string
  ) => Promise<void>;
  settings: UserSettings;
  isGenerating: boolean;
}

export default function ChatView({
  sessions,
  activeSessionId,
  setActiveSessionId,
  onNewSession,
  onDeleteSession,
  onSendMessage,
  settings,
  isGenerating,
}: ChatViewProps) {

  // ===========================
  // MODE AUTO
  // ===========================

  const selectedModel = "auto";

  // ===========================
  // STATES
  // ===========================

  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  const [memory, setMemory] =
    useState<string[]>(getSamsonMemory());

  const [speechHandler] =
    useState(() => new SpeechHandler());

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  const activeSession =
    sessions.find(
      s => s.id === activeSessionId
    ) || sessions[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [activeSession?.messages, isGenerating]);

  async function handleSend(
    e?: React.FormEvent
  ) {
    if (e) e.preventDefault();

    if (
      !inputMessage.trim() ||
      isGenerating
    ) return;

    const text = inputMessage;

    const newMemory = [
      ...memory,
      text,
    ];

    setMemory(newMemory);
    saveSamsonMemory(newMemory);

    setInputMessage("");

    await onSendMessage(
      activeSession?.id || "",
      text,
      selectedModel
    );
  }

  function toggleListening() {

    if (isListening) {

      speechHandler.stopListening();

      setIsListening(false);

      return;

    }

    speechHandler.startListening(

      (text, isFinal) => {

        setInputMessage(text);

        if (isFinal)
          setIsListening(false);

      },

      () => {

        setIsListening(false);

      },

      () => {

        setIsListening(false);

      }

    );

    setIsListening(true);

  }
  {/* ============================
    SIDEBAR - HISTORIQUE
============================ */}

<div className="w-72 hidden lg:flex flex-col bg-[#070B19] border-r border-cyan-500/20">

  {/* Nouveau Chat */}

  <div className="p-4">

    <button
      onClick={() => onNewSession()}
      className="w-full h-12 rounded-xl bg-cyan-500 hover:bg-cyan-400 transition-all text-black font-bold flex items-center justify-center gap-2"
    >
      <Plus className="w-5 h-5" />
      Nouveau Chat
    </button>

  </div>

  {/* Recherche */}

  <div className="px-4 pb-4">

    <div className="relative">

      <Search className="absolute left-3 top-3 w-4 h-4 text-cyan-400" />

      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Rechercher une conversation..."
        className="w-full h-11 rounded-xl bg-slate-900 border border-cyan-500/20 pl-10 pr-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
      />

    </div>

  </div>

  {/* Liste des conversations */}

  <div className="flex-1 overflow-y-auto px-2 pb-3">

    {filteredSessions.map((session) => {

      const active = session.id === activeSession?.id;

      return (

        <div
          key={session.id}
          onClick={() => setActiveSessionId(session.id)}
          className={`group rounded-xl p-3 mb-2 cursor-pointer transition-all ${
            active
              ? "bg-cyan-500/20 border border-cyan-500/40"
              : "hover:bg-slate-800 border border-transparent"
          }`}
        >

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2 flex-1 overflow-hidden">

              <MessageSquare className="w-4 h-4 text-cyan-400 flex-shrink-0" />

              <span className="truncate text-sm text-white">
                {session.title || "Nouvelle discussion"}
              </span>

            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteSession(session.id);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4 text-red-400 hover:text-red-300" />
            </button>

          </div>

          <div className="mt-2 flex justify-between text-[11px] text-slate-500">

            <span>{session.messages.length} messages</span>

            <span>
              {session.messages.at(-1)?.timestamp || ""}
            </span>

          </div>

        </div>

      );
   </div>

</div>
  {/* ============================
    EN-TÊTE PRINCIPAL
============================ */}

<div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/20 bg-[#0B132B]">

  {/* Logo SamsonIA */}

  <div className="flex items-center gap-4">

    <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">

      <Bot className="w-6 h-6 text-cyan-400" />

    </div>

    <div>

      <h2 className="text-white text-lg font-bold">
        SamsonIA
      </h2>

      <p className="text-cyan-300 text-xs">
        🧠 Intelligence Artificielle Autonome
      </p>

    </div>

  </div>

  {/* Mode Auto */}

  <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30">

    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>

    <span className="text-cyan-300 font-bold text-sm">
      🚀 MODE AUTO
    </span>

  </div>

  {/* Boutons */}

  <div className="flex items-center gap-2">

    <button
      onClick={handleExportSession}
      className="h-10 px-4 rounded-xl bg-slate-900 border border-cyan-500/20 hover:border-cyan-400 text-cyan-300 transition-all flex items-center gap-2"
    >
      <Download className="w-4 h-4" />
      <span className="hidden md:block">
        Exporter
      </span>
    </button>

    <button
      onClick={() => onNewSession()}
      className="h-10 px-4 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-all flex items-center gap-2"
    >
      <Plus className="w-4 h-4" />
      <span className="hidden md:block">
        Nouveau
      </span>
    </button>

  </div>

</div>

{/* ============================
    BIENVENUE
============================ */}

{activeSession?.messages.length === 0 && (

<div className="flex flex-col items-center justify-center h-full text-center px-8">

  <div className="w-24 h-24 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-8">

    <Bot className="w-12 h-12 text-cyan-400" />

  </div>

  <h1 className="text-4xl font-bold text-white mb-4">
    Bonjour 👋
  </h1>

  <h2 className="text-2xl text-cyan-300 mb-6">
    Je suis SamsonIA
  </h2>

  <p className="max-w-2xl text-slate-400 leading-8">

    Pose n'importe quelle question.

    SamsonIA analysera automatiquement ta demande
    et choisira la meilleure intelligence artificielle
    sans jamais afficher le modèle utilisé.

  </p>

</div>

)}
  {/* =========================
    TOP TOOLBAR (MODE AUTO)
========================= */}

<div className="flex items-center justify-between px-5 py-3 border-b border-cyan-500/15 bg-[#0B132B]/60 backdrop-blur-xl">

  <div className="flex items-center gap-3">

    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
      <Bot className="w-6 h-6 text-white" />
    </div>

    <div>
      <h2 className="text-lg font-bold text-white">
        SamsonIA
      </h2>

      <p className="text-xs text-cyan-300 flex items-center gap-2">

        <Sparkles className="w-3 h-3" />

        🚀 Mode Auto Intelligent

      </p>
    </div>

  </div>

  <div className="flex items-center gap-2">

    <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10">

      <Cpu className="w-4 h-4 text-cyan-300 animate-pulse" />

      <span className="text-xs text-cyan-200 font-semibold">
        IA sélectionnée automatiquement
      </span>

    </div>

    <button
      onClick={handleExportSession}
      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
    >
      <Download className="w-4 h-4 text-cyan-300" />
    </button>

    <button
      onClick={() => onNewSession()}
      className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 transition text-black"
    >
      <Plus className="w-4 h-4" />
    </button>

  </div>

</div>
  {/* =========================
      ZONE DE SAISIE PREMIUM
========================= */}

<form
  onSubmit={handleSend}
  className="border-t border-cyan-500/20 bg-[#09111F]/95 backdrop-blur-xl p-4"
>

  <div className="rounded-3xl border border-cyan-500/30 bg-slate-900/80 shadow-[0_0_30px_rgba(0,255,255,.08)]">

    <textarea
      rows={2}
      value={inputMessage}
      onChange={(e) => setInputMessage(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleSend();
        }
      }}
      placeholder="💬 Posez votre question à SamsonIA..."
      className="w-full bg-transparent resize-none outline-none p-5 text-slate-100 placeholder-slate-500 text-[15px]"
    />

    <div className="flex items-center justify-between px-4 pb-4">

      <div className="flex items-center gap-2">

        {/* Micro */}
        <button
          type="button"
          onClick={toggleListening}
          className={`w-11 h-11 rounded-xl flex items-center justify-center transition ${
            isListening
              ? "bg-red-500 text-white animate-pulse"
              : "bg-slate-800 hover:bg-slate-700 text-cyan-300"
          }`}
        >
          {isListening ? (
            <MicOff className="w-5 h-5" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </button>

      </div>

      <div className="flex items-center gap-3">

        <span className="hidden md:flex items-center gap-2 text-xs text-cyan-300 font-medium">

          <Sparkles className="w-4 h-4" />

          🚀 SamsonIA choisit automatiquement la meilleure IA

        </span>

        <button
          type="submit"
          disabled={!inputMessage.trim() || isGenerating}
          className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-black disabled:opacity-40 hover:scale-105 transition"
        >
          <Send className="w-5 h-5" />
        </button>

      </div>

    </div>

  </div>

</form>

    
