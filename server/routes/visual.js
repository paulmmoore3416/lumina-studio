import express from 'express';
import aiEngine from '../services/aiEngine.js';

const router = express.Router();

/**
 * Generate visual concept
 * POST /api/visual/generate
 */
router.post('/generate', async (req, res) => {
  try {
    const { prompt, style, mood, colorPalette, composition } = req.body;

    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({
        error: 'Prompt is required',
        timestamp: new Date().toISOString()
      });
    }

    const result = await aiEngine.generateVisualConcept(prompt, {
      style: style || 'cinematic',
      mood: mood || 'dramatic',
      colorPalette: colorPalette || 'vibrant',
      composition: composition || 'balanced'
    });

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Visual generation error:', error);
    res.status(500).json({
      error: 'Failed to generate visual concept',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get visual style presets
 * GET /api/visual/styles
 */
router.get('/styles', (req, res) => {
  const styles = [
    {
      id: 'cinematic',
      name: 'Cinematic',
      description: 'Film-inspired compositions with dramatic lighting',
      characteristics: ['Wide aspect ratio', 'Depth of field', 'Color grading']
    },
    {
      id: 'minimalist',
      name: 'Minimalist',
      description: 'Clean, simple designs with focus on essential elements',
      characteristics: ['Negative space', 'Limited palette', 'Geometric shapes']
    },
    {
      id: 'surreal',
      name: 'Surreal',
      description: 'Dreamlike imagery that defies conventional reality',
      characteristics: ['Unexpected juxtapositions', 'Symbolic elements', 'Fluid forms']
    },
    {
      id: 'photorealistic',
      name: 'Photorealistic',
      description: 'Highly detailed, lifelike representations',
      characteristics: ['Fine details', 'Natural lighting', 'Accurate textures']
    },
    {
      id: 'abstract',
      name: 'Abstract',
      description: 'Non-representational forms and colors',
      characteristics: ['Geometric patterns', 'Bold colors', 'Conceptual focus']
    },
    {
      id: 'vintage',
      name: 'Vintage',
      description: 'Nostalgic aesthetic with retro elements',
      characteristics: ['Aged textures', 'Muted colors', 'Classic composition']
    }
  ];

  res.json({
    success: true,
    data: styles,
    timestamp: new Date().toISOString()
  });
});

/**
 * Get color palette presets
 * GET /api/visual/palettes
 */
router.get('/palettes', (req, res) => {
  const palettes = [
    {
      id: 'vibrant',
      name: 'Vibrant',
      colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'],
      mood: 'energetic'
    },
    {
      id: 'muted',
      name: 'Muted',
      colors: ['#A8DADC', '#457B9D', '#1D3557', '#F1FAEE', '#E63946'],
      mood: 'calm'
    },
    {
      id: 'monochrome',
      name: 'Monochrome',
      colors: ['#2C3E50', '#34495E', '#7F8C8D', '#BDC3C7', '#ECF0F1'],
      mood: 'sophisticated'
    },
    {
      id: 'warm',
      name: 'Warm',
      colors: ['#FF6F61', '#FFB347', '#FFDA77', '#F4A460', '#E97451'],
      mood: 'inviting'
    },
    {
      id: 'cool',
      name: 'Cool',
      colors: ['#4A90E2', '#50C9CE', '#7B68EE', '#87CEEB', '#B0E0E6'],
      mood: 'serene'
    },
    {
      id: 'earth',
      name: 'Earth Tones',
      colors: ['#8B4513', '#D2691E', '#CD853F', '#DEB887', '#F5DEB3'],
      mood: 'natural'
    }
  ];

  res.json({
    success: true,
    data: palettes,
    timestamp: new Date().toISOString()
  });
});

/**
 * Get mood presets
 * GET /api/visual/moods
 */
router.get('/moods', (req, res) => {
  const moods = [
    { id: 'dramatic', name: 'Dramatic', description: 'High contrast, intense emotions' },
    { id: 'serene', name: 'Serene', description: 'Peaceful, calming atmosphere' },
    { id: 'mysterious', name: 'Mysterious', description: 'Enigmatic, intriguing ambiance' },
    { id: 'joyful', name: 'Joyful', description: 'Bright, uplifting energy' },
    { id: 'melancholic', name: 'Melancholic', description: 'Reflective, bittersweet tone' },
    { id: 'epic', name: 'Epic', description: 'Grand, awe-inspiring scale' }
  ];

  res.json({
    success: true,
    data: moods,
    timestamp: new Date().toISOString()
  });
});

export default router;

// Made with Bob
