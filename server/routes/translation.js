/**
 * VividForge Translation API Routes
 * Multi-language translation with pronunciation and TTS support
 */

import express from 'express';
import translationEngine from '../services/translationEngine.js';

const router = express.Router();

/**
 * POST /api/translation/translate
 * Translate text between languages
 */
router.post('/translate', async (req, res) => {
  try {
    const {
      text,
      sourceLang,
      targetLang,
      formality,
      style,
      length,
      domain,
      context
    } = req.body;

    // Validate required fields
    if (!text) {
      return res.status(400).json({
        error: 'Text is required',
        timestamp: new Date().toISOString()
      });
    }

    if (!targetLang) {
      return res.status(400).json({
        error: 'Target language is required',
        timestamp: new Date().toISOString()
      });
    }

    // Perform translation
    const result = await translationEngine.translateText({
      text,
      sourceLang: sourceLang || 'auto',
      targetLang,
      formality: formality || 'neutral',
      style: style || 'default',
      length: length || 'auto',
      domain: domain || '',
      context: context || []
    });

    res.json({
      success: true,
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({
      error: error.message || 'Translation failed',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/translation/languages
 * Get list of supported languages
 */
router.get('/languages', (req, res) => {
  try {
    const languages = translationEngine.getSupportedLanguages();
    res.json({
      success: true,
      languages,
      count: languages.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching languages:', error);
    res.status(500).json({
      error: 'Failed to fetch languages',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * POST /api/translation/detect
 * Detect language of text
 */
router.post('/detect', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        error: 'Text is required',
        timestamp: new Date().toISOString()
      });
    }

    const result = await translationEngine.detectLanguage(text);

    res.json({
      success: true,
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Language detection error:', error);
    res.status(500).json({
      error: 'Language detection failed',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * POST /api/translation/batch
 * Translate multiple texts at once
 */
router.post('/batch', async (req, res) => {
  try {
    const { texts, sourceLang, targetLang, options } = req.body;

    if (!Array.isArray(texts) || texts.length === 0) {
      return res.status(400).json({
        error: 'Texts array is required',
        timestamp: new Date().toISOString()
      });
    }

    if (texts.length > 10) {
      return res.status(400).json({
        error: 'Maximum 10 texts per batch',
        timestamp: new Date().toISOString()
      });
    }

    if (!targetLang) {
      return res.status(400).json({
        error: 'Target language is required',
        timestamp: new Date().toISOString()
      });
    }

    // Translate all texts
    const results = await Promise.all(
      texts.map(text =>
        translationEngine.translateText({
          text,
          sourceLang: sourceLang || 'auto',
          targetLang,
          ...options
        }).catch(error => ({
          error: error.message,
          text
        }))
      )
    );

    res.json({
      success: true,
      results,
      count: results.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Batch translation error:', error);
    res.status(500).json({
      error: 'Batch translation failed',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;

// Made with Bob
