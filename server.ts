import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Modality } from '@google/genai';
import OpenAI from 'openai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Gemini
  const getGeminiClient = () => {
    return new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || 'DUMMY_KEY',
    });
  };

  // OpenRouter (GPT, Claude, Mistral, DeepSeek, Qwen, Kimi...)
  const getOpenRouterClient = () => {
    return new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
    });
  };

  // Choix automatique du fournisseur
  const isOpenRouterModel = (model: string) => {
    return (
      model.startsWith('openai/') ||
      model.startsWith('anthropic/') ||
      model.startsWith('mistralai/') ||
      model.startsWith('deepseek/') ||
      model.startsWith('meta-llama/') ||
      model.startsWith('qwen/') ||
      model.startsWith('moonshotai/')
    );
  };


  // Santé du serveur
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'online',
      system: 'SamsonIA Neural Core',
      timestamp: new Date().toISOString(),
      gemini: !!process.env.GEMINI_API_KEY,
      openrouter: !!process.env.OPENROUTER_API_KEY,
    });
  });


  // Statistiques admin
  app.get('/api/admin/stats', (req, res) => {
    res.json({
      totalUsers: 1482,
      activeToday: 319,
      apiRequests24h: 18420,
      totalTokensUsed: 1482900,
      generatedImagesTotal: 3410,
      generatedVideosTotal: 890,
      serverUptime: '99.98%',
      activeNode: 'SamsonIA-Core',
    });
  });
  // 3. AI Chat Endpoint
app.post('/api/chat', async (req, res) => {
  const startTime = Date.now();

  try {
    const {
      message,
      model = 'google/gemini-2.0-flash',
      systemPrompt,
      history = []
    } = req.body;

    if (!message) {
      return res.status(400).json({
        error: 'Message required'
      });
    }

    let replyText = '';
    let modelUsed = model;

    // OPENROUTER : GPT, Claude, Mistral, DeepSeek, Qwen, Kimi...
    if (isOpenRouterModel(model)) {

      const openrouter = getOpenRouterClient();

      const response = await openrouter.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content:
              systemPrompt ||
              'Tu es SamsonIA, une intelligence artificielle avancée.'
          },

          ...history.map((msg: any) => ({
            role:
              msg.sender === 'user'
                ? 'user'
                : 'assistant',
            content: msg.text,
          })),

          {
            role: 'user',
            content: message,
          }
        ],
      });

      replyText =
        response.choices[0]?.message?.content ||
        'Aucune réponse reçue.';

    } else {

      // GEMINI
      const gemini = getGeminiClient();

      const contents = history.map((msg: any) => ({
        role:
          msg.sender === 'user'
            ? 'user'
            : 'model',
        parts: [
          {
            text: msg.text
          }
        ],
      }));

      contents.push({
        role: 'user',
        parts: [
          {
            text: message
          }
        ],
      });


      const response =
        await gemini.models.generateContent({
          model:
            model.includes('pro')
              ? 'gemini-2.0-pro'
              : 'gemini-2.0-flash',

          contents,

          config: {
            systemInstruction:
              systemPrompt ||
              'Tu es SamsonIA, une IA futuriste.',
            temperature: 0.7,
          },
        });


      replyText =
        response.text ||
        'Aucune réponse Gemini reçue.';
    }


    const latencyMs = Date.now() - startTime;

    res.json({
      text: replyText,
      modelUsed,
      latencyMs,
      tokenCount:
        Math.ceil(
          (message.length + replyText.length) / 4
        ),
    });


  } catch (error: any) {

    console.error(
      'SamsonIA Chat Error:',
      error
    );

    res.status(500).json({
      error:
        error.message ||
        'Erreur serveur SamsonIA'
    });
  }
});
  // 4. Image Generation
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: 'Prompt image requis'
      });
    }

    res.json({
      url: '',
      prompt,
      model: 'SamsonIA Image Studio'
    });

  } catch (error:any) {
    res.status(500).json({
      error: error.message
    });
  }
});


// 5. Video Generation
app.post('/api/generate-video', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: 'Prompt vidéo requis'
      });
    }

    res.json({
      id: 'video_' + Date.now(),
      prompt,
      status: 'processing',
      model: 'SamsonIA Video Engine'
    });

  } catch (error:any) {
    res.status(500).json({
      error: error.message
    });
  }
});


// 6. Text To Speech
app.post('/api/tts', async (req, res) => {
  try {

    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        error: 'Texte requis'
      });
    }

    res.json({
      message: 'TTS prêt',
      text
    });

  } catch(error:any){

    res.status(500).json({
      error:error.message
    });

  }
});


// Vite
if (process.env.NODE_ENV !== 'production') {

  const vite = await createViteServer({
    server:{
      middlewareMode:true
    },
    appType:'spa'
  });

  app.use(vite.middlewares);

} else {

  const distPath = path.join(process.cwd(),'dist');

  app.use(express.static(distPath));

  app.get('*',(req,res)=>{
    res.sendFile(
      path.join(distPath,'index.html')
    );
  });

}


// Start Server
app.listen(PORT,'0.0.0.0',()=>{
  console.log(
    `SamsonIA Server running on port ${PORT}`
  );
});

}

startServer();
