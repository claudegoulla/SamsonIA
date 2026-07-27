export type ActiveView = 
  | 'home' 
  | 'chat' 
  | 'image' 
  | 'video' 
  | 'history' 
  | 'profile' 
  | 'settings' 
  | 'admin';

export type UserRole = 'user' | 'admin' | 'pro';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  plan: 'Free AI' | 'Samson Core Pro' | 'Enterprise Admin';
  tokenUsage: number;
  tokensLimit: number;
  imagesGenerated: number;
  videosGenerated: number;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  modelUsed?: string;
  latencyMs?: number;
  tokenCount?: number;
  imageUrl?: string;
  audioUrl?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  model: string;
  messages: ChatMessage[];
  pinned?: boolean;
  tags?: string[];
}

export interface GeneratedImage {
  id: string;
  prompt: string;
  enhancedPrompt?: string;
  url: string;
  aspectRatio: string;
  style: string;
  createdAt: string;
  resolution: string;
  model: string;
}

export interface GeneratedVideo {
  id: string;
  prompt: string;
  url: string;
  thumbnailUrl: string;
  duration: number; // in seconds
  cameraMotion: string;
  resolution: string;
  fps: number;
  soundtrack: string;
  createdAt: string;
  status: 'processing' | 'completed' | 'failed';
  progress?: number;
}

export interface UserSettings {
  defaultModel: string;
  autoSpeechOutput: boolean;
  selectedVoice: string; // 'Kore' | 'Puck' | 'Zephyr' | 'Fenrir' | 'Charon'
  speechRate: number;
  accentColor: 'cyan' | 'purple' | 'emerald' | 'amber';
  systemPrompt: string;
  defaultImageAspect: string;
  defaultVideoResolution: string;
  apiKeyOverwrite?: string;
  streamSpeed: 'fast' | 'normal' | 'relaxed';
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
  module: string;
  message: string;
}

export interface AdminStats {
  totalUsers: number;
  activeToday: number;
  apiRequests24h: number;
  totalTokensUsed: number;
  generatedImagesTotal: number;
  generatedVideosTotal: number;
  serverUptime: string;
  cpuLoad: number;
  gpuMemoryUsed: number;
  activeNode: string;
  tokenChartData: { time: string; tokens: number; requests: number }[];
  modelPopularity: { name: string; percentage: number; color: string }[];
}
