/**
 * Voice Generation Routes
 * API endpoints for ElevenLabs text-to-speech integration
 */

import express from 'express';
import voiceEngine from '../services/voiceEngine.js';

const router = express.Router();

/**
 * POST /api/voice/generate
 * Generate speech from text
 */
router.post('/generate', async (req, res) => {
  try {
    const { text, voice, emotion, options } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (text.length > 5000) {
      return res.status(400).json({ error: 'Text too long (max 5000 characters)' });
    }

    const result = await voiceEngine.generateSpeech(text, {
      voice: voice || 'rachel',
      ...options
    });

    // Return audio as base64 for easy client-side handling
    res.json({
      audio: result.audio.toString('base64'),
      format: result.format,
      duration: result.duration,
      voice: result.voice,
      metadata: result.metadata
    });
  } catch (error) {
    console.error('Voice generation error:', error);
    res.status(500).json({ error: 'Failed to generate speech' });
  }
});

/**
 * POST /api/voice/emotional
 * Generate speech with emotion control
 */
router.post('/emotional', async (req, res) => {
  try {
    const { text, emotion, voice } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const result = await voiceEngine.generateEmotionalSpeech(
      text,
      emotion || 'neutral',
      voice || 'rachel'
    );

    res.json({
      audio: result.audio.toString('base64'),
      format: result.format,
      duration: result.duration,
      voice: result.voice,
      metadata: result.metadata
    });
  } catch (error) {
    console.error('Emotional speech generation error:', error);
    res.status(500).json({ error: 'Failed to generate emotional speech' });
  }
});

/**
 * POST /api/voice/narration
 * Generate narration for stories
 */
router.post('/narration', async (req, res) => {
  try {
    const { text, voice, options } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const result = await voiceEngine.generateNarration(text, {
      voice: voice || 'antoni',
      ...options
    });

    res.json({
      audio: result.audio.toString('base64'),
      format: result.format,
      duration: result.duration,
      voice: result.voice,
      metadata: result.metadata
    });
  } catch (error) {
    console.error('Narration generation error:', error);
    res.status(500).json({ error: 'Failed to generate narration' });
  }
});

/**
 * GET /api/voice/voices
 * Get available voices
 */
router.get('/voices', async (req, res) => {
  try {
    const voices = await voiceEngine.getAvailableVoices();
    res.json({ voices });
  } catch (error) {
    console.error('Error fetching voices:', error);
    res.status(500).json({ error: 'Failed to fetch voices' });
  }
});

/**
 * GET /api/voice/status
 * Get voice engine status
 */
router.get('/status', (req, res) => {
  const status = voiceEngine.getStatus();
  res.json(status);
});

export default router;

// Made with Bob - Voice Generation API