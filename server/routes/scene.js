import express from 'express';
import aiEngine from '../services/aiEngine.js';

const router = express.Router();

/**
 * Generate interactive scene
 * POST /api/scene/generate
 */
router.post('/generate', async (req, res) => {
  try {
    const { prompt, sceneType, complexity, interactivity } = req.body;

    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({
        error: 'Prompt is required',
        timestamp: new Date().toISOString()
      });
    }

    const result = await aiEngine.generateScene(prompt, {
      sceneType: sceneType || 'interactive',
      complexity: complexity || 'medium',
      interactivity: interactivity || 'high'
    });

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Scene generation error:', error);
    res.status(500).json({
      error: 'Failed to generate scene',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get scene templates
 * GET /api/scene/templates
 */
router.get('/templates', (req, res) => {
  const templates = [
    {
      id: 'dialogue-scene',
      name: 'Dialogue Scene',
      description: 'Character-driven conversation with branching choices',
      elements: ['characters', 'dialogue', 'choices', 'consequences'],
      interactivity: 'high'
    },
    {
      id: 'exploration-scene',
      name: 'Exploration Scene',
      description: 'Environment discovery with interactive objects',
      elements: ['environment', 'objects', 'discoveries', 'secrets'],
      interactivity: 'medium'
    },
    {
      id: 'action-scene',
      name: 'Action Scene',
      description: 'Dynamic sequence with time-sensitive decisions',
      elements: ['action', 'timing', 'consequences', 'outcomes'],
      interactivity: 'high'
    },
    {
      id: 'puzzle-scene',
      name: 'Puzzle Scene',
      description: 'Problem-solving challenge with multiple solutions',
      elements: ['puzzle', 'clues', 'solutions', 'rewards'],
      interactivity: 'high'
    },
    {
      id: 'cinematic-scene',
      name: 'Cinematic Scene',
      description: 'Story-focused sequence with minimal interaction',
      elements: ['narrative', 'visuals', 'atmosphere', 'pacing'],
      interactivity: 'low'
    }
  ];

  res.json({
    success: true,
    data: templates,
    timestamp: new Date().toISOString()
  });
});

/**
 * Get interaction types
 * GET /api/scene/interactions
 */
router.get('/interactions', (req, res) => {
  const interactions = [
    {
      id: 'click',
      name: 'Click',
      description: 'Simple click/tap interaction',
      complexity: 'low'
    },
    {
      id: 'hover',
      name: 'Hover',
      description: 'Mouse hover reveals information',
      complexity: 'low'
    },
    {
      id: 'drag',
      name: 'Drag',
      description: 'Drag and drop objects',
      complexity: 'medium'
    },
    {
      id: 'choice',
      name: 'Choice',
      description: 'Select from multiple options',
      complexity: 'medium'
    },
    {
      id: 'sequence',
      name: 'Sequence',
      description: 'Perform actions in specific order',
      complexity: 'high'
    },
    {
      id: 'timing',
      name: 'Timing',
      description: 'Time-sensitive interactions',
      complexity: 'high'
    }
  ];

  res.json({
    success: true,
    data: interactions,
    timestamp: new Date().toISOString()
  });
});

export default router;

// Made with Bob
