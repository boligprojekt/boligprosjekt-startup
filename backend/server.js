import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import { analyzeImage, generateImage } from './services/ai.js';
import { streamAnalysis } from './services/stream.js';

// Last miljøvariabler
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================
// MIDDLEWARE
// ============================================

// CORS - tillat requests fra frontend
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:3000',
  'https://boligprosjekt.io',
  'https://www.boligprosjekt.io'
];

app.use(cors({
  origin: (origin, callback) => {
    // Tillat requests uten origin (f.eks. mobile apps, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Multer for bildeopplasting (maks 10MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Kun bildefiler er tillatt'));
    }
  }
});

// ============================================
// ROUTES
// ============================================

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'BoligProsjekt AI Backend',
    version: '1.0.0'
  });
});

// Analyser bilde (standard respons)
app.post('/api/analyze', upload.single('image'), async (req, res) => {
  try {
    console.log('📸 Mottok bildeopplasting');
    
    if (!req.file) {
      return res.status(400).json({ error: 'Ingen bilde lastet opp' });
    }

    const { style, budget, description } = req.body;
    
    console.log('🔍 Starter bildeanalyse...');
    console.log(`   Stil: ${style}`);
    console.log(`   Budsjett: ${budget} kr`);
    console.log(`   Beskrivelse: ${description || 'Ingen'}`);

    // Analyser bilde med Claude Opus
    const analysis = await analyzeImage(req.file.buffer, {
      style,
      budget: parseInt(budget),
      description
    });

    console.log('✅ Analyse fullført');

    res.json({
      success: true,
      analysis: analysis.text,
      metadata: analysis.metadata
    });

  } catch (error) {
    console.error('❌ Feil ved bildeanalyse:', error);
    res.status(500).json({
      error: 'Bildeanalyse feilet',
      message: error.message
    });
  }
});

// Analyser bilde (streaming respons)
app.post('/api/analyze-stream', upload.single('image'), async (req, res) => {
  try {
    console.log('📸 Mottok bildeopplasting (streaming)');
    
    if (!req.file) {
      return res.status(400).json({ error: 'Ingen bilde lastet opp' });
    }

    const { style, budget, description } = req.body;

    // Sett opp Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    console.log('🌊 Starter streaming analyse...');

    // Stream analyse fra Claude
    await streamAnalysis(req.file.buffer, {
      style,
      budget: parseInt(budget),
      description
    }, (chunk) => {
      // Send chunk til frontend
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    });

    res.write('data: [DONE]\n\n');
    res.end();

  } catch (error) {
    console.error('❌ Feil ved streaming:', error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

// Chat med Claude (streaming)
app.post('/api/chat-stream', async (req, res) => {
  try {
    const { messages, context } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages mangler' });
    }

    console.log('💬 Chat request mottatt');
    console.log(`   Meldinger: ${messages.length}`);
    console.log(`   Context: ${context || 'none'}`);

    // Sett opp Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Import chat service
    const { streamChat } = await import('./services/chat.js');

    // Stream chat fra Claude
    await streamChat(messages, { context }, (chunk) => {
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    });

    res.write('data: [DONE]\n\n');
    res.end();

  } catch (error) {
    console.error('❌ Feil ved chat:', error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

// Generer bilde med DALL-E
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt, style, budget } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt mangler' });
    }

    console.log('🎨 Genererer bilde med DALL-E...');

    const imageUrl = await generateImage(prompt, { style, budget });

    res.json({
      success: true,
      imageUrl
    });

  } catch (error) {
    console.error('❌ Feil ved bildegenerering:', error);
    res.status(500).json({
      error: 'Bildegenerering feilet',
      message: error.message
    });
  }
});

// ============================================
// ERROR HANDLING
// ============================================

app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log('🚀 BoligProsjekt AI Backend startet!');
  console.log(`   Port: ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Claude API: ${process.env.ANTHROPIC_API_KEY ? '✅ Konfigurert' : '❌ Mangler'}`);
  console.log(`   OpenAI API: ${process.env.OPENAI_API_KEY ? '✅ Konfigurert' : '❌ Mangler'}`);
  console.log('');
  console.log('📡 Endpoints:');
  console.log(`   GET  /health`);
  console.log(`   POST /api/analyze`);
  console.log(`   POST /api/analyze-stream`);
  console.log(`   POST /api/chat-stream`);
  console.log(`   POST /api/generate-image`);
  console.log('');
  console.log('🌐 Frontend URLs:');
  console.log(`   Chat: http://localhost:${PORT === 3001 ? '8080' : '3000'}/ai-chat.html`);
});

