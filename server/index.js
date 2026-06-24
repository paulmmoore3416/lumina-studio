import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import storyRoutes from './routes/story.js';
import visualRoutes from './routes/visual.js';
import sceneRoutes from './routes/scene.js';
import collaborationRoutes from './routes/collaboration.js';
import voiceRoutes from './routes/voice.js';
import videoRoutes from './routes/video.js';
import translationRoutes from './routes/translation.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'VividForge Studio API',
    version: '2.0.0',
    features: {
      story: true,
      visual: true,
      scene: true,
      collaboration: true,
      voice: true,
      video: true,
      watsonx: !!process.env.WATSONX_API_KEY,
      elevenlabs: !!process.env.ELEVENLABS_API_KEY
    }
  });
});

// API Routes
app.use('/api/story', storyRoutes);
app.use('/api/visual', visualRoutes);
app.use('/api/scene', sceneRoutes);
app.use('/api/collaboration', collaborationRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/translation', translationRoutes);

// Serve generated content
app.use('/generated', express.static(join(__dirname, '../public/generated')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 VividForge Studio API running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🎨 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🎙️ Voice Generation: ${process.env.ELEVENLABS_API_KEY ? 'Enabled' : 'Mock Mode'}`);
  console.log(`🎬 Video Generation: Enabled`);
  console.log(`🤖 IBM watsonx.ai: ${process.env.WATSONX_API_KEY ? 'Configured' : 'Mock Mode'}`);
});

export default app;

// Made with Bob - VividForge Studio Enhanced
