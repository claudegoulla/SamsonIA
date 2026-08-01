import React, { useState, useEffect } from 'react';
import { ActiveView, User, ChatSession, GeneratedImage, GeneratedVideo, UserSettings, SystemLog } from './types';
import { 
  getStoredUser, 
  saveStoredUser, 
  getStoredSettings, 
  saveStoredSettings, 
  getStoredChats, 
  saveStoredChats, 
  getStoredImages, 
  saveStoredImages, 
  getStoredVideos, 
  saveStoredVideos, 
  getStoredLogs, 
 addSystemLog
} from './storage';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { ChatView } from './components/ChatView';
import { ImageStudioView } from './components/ImageStudioView';
import { VideoStudioView } from './components/VideoStudioView';
import { HistoryView } from './components/HistoryView';
import { ProfileView } from './components/ProfileView';
import { SettingsView } from './components/SettingsView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { AuthModal } from './components/AuthModal';
import { speakText } from './lib/speech';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(() => getStoredUser());
  const [settings, setSettings] = useState<UserSettings>(() => getStoredSettings());
  const [sessions, setSessions] = useState<ChatSession[]>(() => getStoredChats());
  const [activeSessionId, setActiveSessionId] = useState<string>(() => getStoredChats()[0]?.id || 'chat_1');
  const [images, setImages] = useState<GeneratedImage[]>(() => getStoredImages());
  const [videos, setVideos] = useState<GeneratedVideo[]>(() => getStoredVideos());
  const [logs, setLogs] = useState<SystemLog[]>(() => getStoredLogs());
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [audioMuted, setAudioMuted] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Auto save sessions when state updates
  useEffect(() => {
    saveStoredChats(sessions);
  }, [sessions]);

  // Auto save images when state updates
  useEffect(() => {
    saveStoredImages(images);
  }, [images]);

  // Auto save videos when state updates
  useEffect(() => {
    saveStoredVideos(videos);
  }, [videos]);

  // Handle new chat creation
  const handleNewSession = (initialPrompt?: string) => {
    const newSession: ChatSession = {
      id: 'chat_' + Date.now(),
      title: initialPrompt ? initialPrompt.slice(0, 30) + '...' : 'New Chat Session',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      model: settings.defaultModel,
      messages: initialPrompt
        ? [
            {
              id: 'msg_' + Date.now(),
              sender: 'user',
              text: initialPrompt,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]
        : [],
    };

    const updated = [newSession, ...sessions];
    setSessions(updated);
    setActiveSessionId(newSession.id);

    if (initialPrompt) {
      handleSendMessage(newSession.id, initialPrompt, settings.defaultModel);
    }
  };

  // Handle sending a chat message to server
  const handleSendMessage = async (sessionId: string, messageText: string, model: string) => {
    setIsGenerating(true);

    // 1. Append User Message
    const userMsg = {
      id: 'msg_' + Date.now(),
      sender: 'user' as const,
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setSessions((prevSessions) =>
      prevSessions.map((s) => {
        if (s.id === sessionId) {
          const title = s.messages.length === 0 ? messageText.slice(0, 32) + '...' : s.title;
          return {
            ...s,
            title,
            updatedAt: new Date().toISOString(),
            messages: [...s.messages, userMsg],
          };
        }
        return s;
      })
    );

    // 2. Query Express Server Endpoint
    try {
      const activeSessionObj = sessions.find((s) => s.id === sessionId);
      const history = activeSessionObj ? activeSessionObj.messages : [];

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          model,
          systemPrompt: settings.systemPrompt,
          history,
        }),
      });

      const data = await res.json();

      const aiMsg = {
        id: 'msg_' + (Date.now() + 1),
        sender: 'ai' as const,
        text: data.text || 'Response received.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed,
        latencyMs: data.latencyMs,
        tokenCount: data.tokenCount,
      };

      setSessions((prevSessions) =>
        prevSessions.map((s) => {
          if (s.id === sessionId) {
            return {
              ...s,
              updatedAt: new Date().toISOString(),
              messages: [...s.messages, aiMsg],
            };
          }
          return s;
        })
      );

      // Log activity
      const log = addSystemLog({
        level: 'SUCCESS',
        module: 'AIChat',
        message: `Processed prompt with ${data.modelUsed} (${data.latencyMs}ms)`,
      });
      setLogs((prev) => [log, ...prev]);

      // Auto-speech output if enabled
      if (settings.autoSpeechOutput && !audioMuted) {
        speakText(data.text, settings.selectedVoice, settings.speechRate);
      }
    } catch (err: any) {
      console.error('Send message error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Image Generation
  const handleGenerateImage = async (
    prompt: string,
    aspectRatio: string,
    style: string,
    resolution: string
  ) => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, aspectRatio, style, resolution }),
      });

      const data = await res.json();

      const newImage: GeneratedImage = {
        id: 'img_' + Date.now(),
        prompt: data.prompt || prompt,
        enhancedPrompt: data.enhancedPrompt,
        url: data.url,
        aspectRatio: data.aspectRatio || aspectRatio,
        style: data.style || style,
        resolution: data.resolution || resolution,
        createdAt: new Date().toISOString(),
        model: data.model || 'gemini-3.1-flash-image',
      };

      setImages((prev) => [newImage, ...prev]);

      const log = addSystemLog({
        level: 'SUCCESS',
        module: 'ImageStudio',
        message: `Synthesized image for: "${prompt.slice(0, 30)}..."`,
      });
      setLogs((prev) => [log, ...prev]);
    } catch (err: any) {
      console.error('Image Generation Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Video Generation
  const handleGenerateVideo = async (
    prompt: string,
    duration: number,
    cameraMotion: string,
    resolution: string,
    fps: number,
    soundtrack: string
  ) => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, duration, cameraMotion, resolution, fps, soundtrack }),
      });

      const data = await res.json();

      const newVideo: GeneratedVideo = {
        id: 'vid_' + Date.now(),
        prompt: data.prompt || prompt,
        url: data.url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnailUrl: data.thumbnailUrl || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
        duration: data.duration || duration,
        cameraMotion: data.cameraMotion || cameraMotion,
        resolution: data.resolution || resolution,
        fps: data.fps || fps,
        soundtrack: data.soundtrack || soundtrack,
        createdAt: new Date().toISOString(),
        status: 'completed',
      };

      setVideos((prev) => [newVideo, ...prev]);

      const log = addSystemLog({
        level: 'SUCCESS',
        module: 'VideoStudio',
        message: `Rendered Veo motion video for: "${prompt.slice(0, 30)}..."`,
      });
      setLogs((prev) => [log, ...prev]);
    } catch (err: any) {
      console.error('Video Generation Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteChat = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleDeleteImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleDeleteVideo = (id: string) => {
    setVideos((prev) => prev.filter((vid) => vid.id !== id));
  };

  const handleSaveSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    saveStoredSettings(newSettings);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    saveStoredUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    saveStoredUser(null);
  };

  return (
    <div className="min-h-screen bg-[#070B19] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Background Subtle Gradient & Grid */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0B132B] via-[#070B19] to-[#040711] pointer-events-none -z-10" />

      {/* Sidebar Navigation */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Header */}
      <Header
        activeView={activeView}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        setActiveView={setActiveView}
        audioMuted={audioMuted}
        setAudioMuted={setAudioMuted}
        sidebarCollapsed={sidebarCollapsed}
      />

      {/* Main View Container */}
      <main
        className={`pt-24 px-4 md:px-8 transition-all duration-300 min-h-screen ${
          sidebarCollapsed ? 'pl-24' : 'pl-72'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {activeView === 'home' && (
            <HomePage
              setActiveView={setActiveView}
              recentChats={sessions}
              recentImages={images}
              recentVideos={videos}
              onStartNewChat={(p) => handleNewSession(p)}
            />
          )}

          {activeView === 'chat' && (
            <ChatView
              sessions={sessions}
              activeSessionId={activeSessionId}
              setActiveSessionId={setActiveSessionId}
              onNewSession={handleNewSession}
              onDeleteSession={handleDeleteChat}
              onSendMessage={handleSendMessage}
              settings={settings}
              isGenerating={isGenerating}
            />
          )}

          {activeView === 'image' && (
            <ImageStudioView
              images={images}
              onGenerateImage={handleGenerateImage}
              onDeleteImage={handleDeleteImage}
              isGenerating={isGenerating}
              settings={settings}
            />
          )}

          {activeView === 'video' && (
            <VideoStudioView
              videos={videos}
              onGenerateVideo={handleGenerateVideo}
              onDeleteVideo={handleDeleteVideo}
              isGenerating={isGenerating}
              settings={settings}
            />
          )}

          {activeView === 'history' && (
            <HistoryView
              chats={sessions}
              images={images}
              videos={videos}
              onSelectChat={(id) => setActiveSessionId(id)}
              onDeleteChat={handleDeleteChat}
              onDeleteImage={handleDeleteImage}
              onDeleteVideo={handleDeleteVideo}
              setActiveView={setActiveView}
            />
          )}

          {activeView === 'profile' && (
            <ProfileView
              currentUser={currentUser}
              images={images}
              videos={videos}
              setActiveView={setActiveView}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />
          )}

          {activeView === 'settings' && (
            <SettingsView
              settings={settings}
              onSaveSettings={handleSaveSettings}
            />
          )}

          {activeView === 'admin' && (
            <AdminDashboardView logs={logs} />
          )}
        </div>
      </main>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </div>
  );
}
