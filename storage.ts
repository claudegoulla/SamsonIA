import { User, ChatSession, GeneratedImage, GeneratedVideo, UserSettings, SystemLog } from '../types';

const STORAGE_KEYS = {
  CURRENT_USER: 'samson_current_user',
  USERS: 'samson_registered_users',
  CHAT_SESSIONS: 'samson_chat_sessions',
  MEMORY: 'samson_memory',
  GENERATED_IMAGES: 'samson_generated_images',
  GENERATED_VIDEOS: 'samson_generated_videos',
  SETTINGS: 'samson_user_settings',
  SYSTEM_LOGS: 'samson_system_logs',
};

export const DEFAULT_USER: User = {
  id: 'usr_samson_admin',
  name: 'Samson Leader',
  email: 'admin@samson.ai',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  role: 'admin',
  plan: 'Enterprise Admin',
  tokenUsage: 142850,
  tokensLimit: 1000000,
  imagesGenerated: 48,
  videosGenerated: 19,
  createdAt: '2026-01-15',
};

export const DEFAULT_SETTINGS: UserSettings = {
  defaultModel: 'gemini-3.6-flash',
  autoSpeechOutput: false,
  selectedVoice: 'Kore',
  speechRate: 1.0,
  accentColor: 'cyan',
  systemPrompt: 'You are SamsonIA, an advanced futuristic AI assistant designed for high-performance reasoning, creative visual studio tasks, and multi-modal problem solving.',
  defaultImageAspect: '16:9',
  defaultVideoResolution: '1080p',
  streamSpeed: 'fast',
};

const INITIAL_CHATS: ChatSession[] = [
  {
    id: 'chat_1',
    title: 'Quantum Neural Architectures Overview',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    model: 'gemini-3.6-flash',
    pinned: true,
    tags: ['AI Research', 'Quantum'],
    messages: [
      {
        id: 'msg_1',
        sender: 'user',
        text: 'Can you summarize how quantum entanglement improves neural network gradient estimation?',
        timestamp: new Date(Date.now() - 3600000 * 2.1).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      {
        id: 'msg_2',
        sender: 'ai',
        text: '### Quantum Neural Gradient Estimation\n\nQuantum entanglement allows parameter sampling across multi-dimensional Hilbert spaces simultaneously.\n\n1. **Superposition Acceleration**: Evaluates cost function gradients across $2^N$ states in $O(\\sqrt{N})$ iterations.\n2. **Noise Resilience**: Entangled qubit pairs cancel out thermal Decoherence via quantum error mitigation layers.\n3. **Barren Plateau Reduction**: Entangled ansatz topology prevents vanishing gradient manifolds during backpropagation.',
        timestamp: new Date(Date.now() - 3600000 * 2.05).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: 'gemini-3.6-flash',
        latencyMs: 340,
        tokenCount: 142,
      },
    ],
  },
  {
    id: 'chat_2',
    title: 'Futuristic Cyberpunk UI Palette Design',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    model: 'gemini-3.1-pro-preview',
    pinned: false,
    tags: ['Design', 'UI/UX'],
    messages: [
      {
        id: 'msg_3',
        sender: 'user',
        text: 'Give me hex codes for a high-contrast dark blue cyberpunk theme with electric neon highlights.',
        timestamp: new Date(Date.now() - 3600000 * 24.1).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      {
        id: 'msg_4',
        sender: 'ai',
        text: 'Here is the recommended **SamsonIA Cybernetic Palette**:\n\n```json\n{\n  "bgPrimary": "#070B19",\n  "bgSurface": "#0B132B",\n  "cardGlass": "rgba(28, 37, 65, 0.4)",\n  "electricCyan": "#00F0FF",\n  "neonPurple": "#9D4EDD",\n  "plasmaEmerald": "#00FF88",\n  "textPrimary": "#F8FAFC",\n  "textMuted": "#94A3B8"\n}\n```\n\nPaired with `backdrop-filter: blur(16px)` and subtle 1px cyan borders, this achieves optimal legibility and futuristic depth.',
        timestamp: new Date(Date.now() - 3600000 * 24).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: 'gemini-3.1-pro-preview',
        latencyMs: 480,
        tokenCount: 188,
      },
    ],
  },
];

const INITIAL_IMAGES: GeneratedImage[] = [
  {
    id: 'img_1',
    prompt: 'Futuristic neon metropolis with flying vehicles, holographic blue towers, rain-slicked reflective glass, cinematic wide angle, 8k resolution',
    enhancedPrompt: 'A hyper-detailed cybernetic metropolis at midnight, illuminated by electric cyan and magenta holograms, wet dark pavement reflecting soaring glowing megastructures, ultra-detailed 8K Octane Render',
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: '16:9',
    style: 'Sci-Fi Concept',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    resolution: '1K',
    model: 'gemini-3.1-flash-image',
  },
  {
    id: 'img_2',
    prompt: 'An AI humanoid robot with glowing crystalline neural core, dark obsidian armor plating, sleek blue luminescence',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: '1:1',
    style: 'Hyper-Detailed 3D',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    resolution: '2K',
    model: 'gemini-3.1-flash-image',
  },
  {
    id: 'img_3',
    prompt: 'Abstract quantum computing energy field with swirling cyan light threads and dark blue grid background',
    url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: '16:9',
    style: 'Synthwave',
    createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    resolution: '1K',
    model: 'gemini-3.1-flash-lite-image',
  },
];

const INITIAL_VIDEOS: GeneratedVideo[] = [
  {
    id: 'vid_1',
    prompt: 'A sleek futuristic starship emerging from a blue warp rift above a neon planet',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
    duration: 5,
    cameraMotion: 'Cinematic Orbit',
    resolution: '1080p',
    fps: 60,
    soundtrack: 'Sci-Fi Pulse',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    status: 'completed',
  },
  {
    id: 'vid_2',
    prompt: 'Glowing liquid energy flowing through intricate cybernetic circuit pathways in macro slow motion',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&q=80&w=800',
    duration: 5,
    cameraMotion: 'Zoom In',
    resolution: '1080p',
    fps: 30,
    soundtrack: 'Cybernetic Beats',
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    status: 'completed',
  },
];

const INITIAL_LOGS: SystemLog[] = [
  { id: 'log_1', timestamp: new Date(Date.now() - 120000).toLocaleTimeString(), level: 'SUCCESS', module: 'AI-Engine', message: 'Gemini 3.6 Flash pipeline initialized on primary node.' },
  { id: 'log_2', timestamp: new Date(Date.now() - 90000).toLocaleTimeString(), level: 'INFO', module: 'AuthService', message: 'User Samson Leader authenticated (role: admin).' },
  { id: 'log_3', timestamp: new Date(Date.now() - 45000).toLocaleTimeString(), level: 'INFO', module: 'ImageStudio', message: 'Render engine warm-up complete. Latency ~410ms.' },
  { id: 'log_4', timestamp: new Date(Date.now() - 15000).toLocaleTimeString(), level: 'SUCCESS', module: 'VoiceSynthesizer', message: 'Gemini TTS voice model Kore loaded with sample rate 24kHz.' },
];

export function getStoredUser(): User {
  const cached = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (cached) {
    try { return JSON.parse(cached); } catch (e) { console.error(e); }
  }
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEFAULT_USER));
  return DEFAULT_USER;
}

export function saveStoredUser(user: User | null): void {
  if (!user) {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  } else {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }
}

export function getStoredSettings(): UserSettings {
  const cached = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (cached) {
    try { return JSON.parse(cached); } catch (e) { console.error(e); }
  }
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  return DEFAULT_SETTINGS;
}

export function saveStoredSettings(settings: UserSettings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export function getStoredChats(): ChatSession[] {
  const cached = localStorage.getItem(STORAGE_KEYS.CHAT_SESSIONS);
  if (cached) {
    try { return JSON.parse(cached); } catch (e) { console.error(e); }
  }
  localStorage.setItem(STORAGE_KEYS.CHAT_SESSIONS, JSON.stringify(INITIAL_CHATS));
  return INITIAL_CHATS;
}

export function saveStoredChats(chats: ChatSession[]): void {
  localStorage.setItem(STORAGE_KEYS.CHAT_SESSIONS, JSON.stringify(chats));
}

export function getStoredImages(): GeneratedImage[] {
  const cached = localStorage.getItem(STORAGE_KEYS.GENERATED_IMAGES);
  if (cached) {
    try { return JSON.parse(cached); } catch (e) { console.error(e); }
  }
  localStorage.setItem(STORAGE_KEYS.GENERATED_IMAGES, JSON.stringify(INITIAL_IMAGES));
  return INITIAL_IMAGES;
}

export function saveStoredImages(images: GeneratedImage[]): void {
  localStorage.setItem(STORAGE_KEYS.GENERATED_IMAGES, JSON.stringify(images));
}

export function getStoredVideos(): GeneratedVideo[] {
  const cached = localStorage.getItem(STORAGE_KEYS.GENERATED_VIDEOS);
  if (cached) {
    try { return JSON.parse(cached); } catch (e) { console.error(e); }
  }
  localStorage.setItem(STORAGE_KEYS.GENERATED_VIDEOS, JSON.stringify(INITIAL_VIDEOS));
  return INITIAL_VIDEOS;
}

export function saveStoredVideos(videos: GeneratedVideo[]): void {
  localStorage.setItem(STORAGE_KEYS.GENERATED_VIDEOS, JSON.stringify(videos));
}

export function getStoredLogs(): SystemLog[] {
  const cached = localStorage.getItem(STORAGE_KEYS.SYSTEM_LOGS);
  if (cached) {
    try { return JSON.parse(cached); } catch (e) { console.error(e); }
  }
  localStorage.setItem(STORAGE_KEYS.SYSTEM_LOGS, JSON.stringify(INITIAL_LOGS));
  return INITIAL_LOGS;
}

export function addSystemLog(log: Omit<SystemLog, 'id' | 'timestamp'>): SystemLog {
  const current = getStoredLogs();
  const newLog: SystemLog = {
    ...log,
    id: 'log_' + Date.now(),
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };
  const updated = [newLog, ...current].slice(0, 50);
  localStorage.setItem(STORAGE_KEYS.SYSTEM_LOGS, JSON.stringify(updated));
  return newLog;
}

export function getSamsonMemory(): string[] {
  const memory = localStorage.getItem(STORAGE_KEYS.MEMORY);

  if (memory) {
    try {
      return JSON.parse(memory);
    } catch (e) {
      console.error(e);
    }
  }

  localStorage.setItem(STORAGE_KEYS.MEMORY, JSON.stringify([]));
  return [];
}

export function saveSamsonMemory(memory: string[]): void {
  localStorage.setItem(
    STORAGE_KEYS.MEMORY,
    JSON.stringify(memory)
  );
}
