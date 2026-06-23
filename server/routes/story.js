import express from 'express';
import aiEngine from '../services/aiEngine.js';

const router = express.Router();

/**
 * Generate a new story based on prompt
 * POST /api/story/generate
 */
router.post('/generate', async (req, res) => {
  try {
    const { prompt, genre, tone, length, style } = req.body;

    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({
        error: 'Prompt is required',
        timestamp: new Date().toISOString()
      });
    }

    const result = await aiEngine.generateStory(prompt, {
      genre: genre || 'fantasy',
      tone: tone || 'adventurous',
      length: length || 'medium',
      style: style || 'narrative'
    });

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Story generation error:', error);
    res.status(500).json({
      error: 'Failed to generate story',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Enhance existing story content
 * POST /api/story/enhance
 */
router.post('/enhance', async (req, res) => {
  try {
    const { content, enhancementType } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        error: 'Content is required',
        timestamp: new Date().toISOString()
      });
    }

    const result = await aiEngine.enhanceContent(
      content,
      enhancementType || 'general'
    );

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Enhancement error:', error);
    res.status(500).json({
      error: 'Failed to enhance content',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get creative suggestions
 * POST /api/story/suggestions
 */
router.post('/suggestions', async (req, res) => {
  try {
    const { context, count } = req.body;

    const suggestions = await aiEngine.generateSuggestions(
      context || '',
      count || 3
    );

    res.json({
      success: true,
      data: suggestions,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({
      error: 'Failed to generate suggestions',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get story templates
 * GET /api/story/templates
 */
router.get('/templates', (req, res) => {
  const templates = [
    {
      id: 'hero-journey',
      name: "Hero's Journey",
      description: 'Classic narrative structure following a protagonist through transformation',
      genre: 'fantasy',
      structure: ['Ordinary World', 'Call to Adventure', 'Trials', 'Transformation', 'Return']
    },
    {
      id: 'mystery-reveal',
      name: 'Mystery Reveal',
      description: 'Gradual unveiling of secrets and hidden truths',
      genre: 'mystery',
      structure: ['Setup', 'Clues', 'Red Herrings', 'Revelation', 'Resolution']
    },
    {
      id: 'romance-arc',
      name: 'Romance Arc',
      description: 'Emotional journey of connection and relationship development',
      genre: 'romance',
      structure: ['Meeting', 'Attraction', 'Conflict', 'Growth', 'Union']
    },
    {
      id: 'thriller-chase',
      name: 'Thriller Chase',
      description: 'High-stakes pursuit with escalating tension',
      genre: 'thriller',
      structure: ['Inciting Incident', 'Escalation', 'Complications', 'Climax', 'Resolution']
    }
  ];

  res.json({
    success: true,
    data: templates,
    timestamp: new Date().toISOString()
  });
});

export default router;

// Made with Bob
