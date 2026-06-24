/**
 * Video Generation Routes
 * API endpoints for 6-second cinematic video generation
 */

import express from 'express';
import videoEngine from '../services/videoEngine.js';

const router = express.Router();

/**
 * POST /api/video/generate
 * Generate 6-second video from concept
 */
router.post('/generate', async (req, res) => {
  try {
    const { concept, options } = req.body;

    if (!concept) {
      return res.status(400).json({ error: 'Concept is required' });
    }

    const result = await videoEngine.generateVideo(concept, options || {});

    res.json(result);
  } catch (error) {
    console.error('Video generation error:', error);
    res.status(500).json({ error: 'Failed to generate video' });
  }
});

/**
 * POST /api/video/story
 * Generate video from story
 */
router.post('/story', async (req, res) => {
  try {
    const { story, options } = req.body;

    if (!story || !story.content) {
      return res.status(400).json({ error: 'Story content is required' });
    }

    const result = await videoEngine.generateStoryVideo(story, options || {});

    res.json(result);
  } catch (error) {
    console.error('Story video generation error:', error);
    res.status(500).json({ error: 'Failed to generate story video' });
  }
});

/**
 * POST /api/video/concept
 * Generate video from visual concept
 */
router.post('/concept', async (req, res) => {
  try {
    const { concept, options } = req.body;

    if (!concept) {
      return res.status(400).json({ error: 'Visual concept is required' });
    }

    const result = await videoEngine.generateConceptVideo(concept, options || {});

    res.json(result);
  } catch (error) {
    console.error('Concept video generation error:', error);
    res.status(500).json({ error: 'Failed to generate concept video' });
  }
});

/**
 * GET /api/video/status
 * Get video engine status
 */
router.get('/status', (req, res) => {
  const status = videoEngine.getStatus();
  res.json(status);
});

/**
 * DELETE /api/video/:videoId
 * Clean up temporary files for a video
 */
router.delete('/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    await videoEngine.cleanup(videoId);
    res.json({ message: 'Cleanup successful' });
  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({ error: 'Failed to cleanup video files' });
  }
});

export default router;

// Made with Bob - Video Generation API