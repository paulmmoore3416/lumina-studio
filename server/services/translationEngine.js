/**
 * VividForge Translation Engine
 * Advanced multi-language translation with IBM watsonx.ai Granite models
 * Supports 12 languages with cultural localization, pronunciation guides, and TTS
 */

import { WatsonXAI } from '@ibm-cloud/watsonx-ai';

const SUPPORTED_LANGUAGES = {
  auto: { name: 'Auto-detect', flag: '🌐', bcp47: 'en-US' },
  en: { name: 'English', flag: '🇺🇸', bcp47: 'en-US' },
  es: { name: 'Spanish', flag: '🇪🇸', bcp47: 'es-ES' },
  ar: { name: 'Arabic', flag: '🇸🇦', bcp47: 'ar-SA', rtl: true },
  ja: { name: 'Japanese', flag: '🇯🇵', bcp47: 'ja-JP' },
  'zh-CN': { name: 'Chinese (Simplified)', flag: '🇨🇳', bcp47: 'zh-CN' },
  'zh-TW': { name: 'Chinese (Traditional)', flag: '🇹🇼', bcp47: 'zh-TW' },
  uk: { name: 'Ukrainian', flag: '🇺🇦', bcp47: 'uk-UA' },
  ru: { name: 'Russian', flag: '🇷🇺', bcp47: 'ru-RU' },
  pcm: { name: 'Nigerian Pidgin', flag: '🇳🇬', bcp47: 'en-NG' },
  ko: { name: 'Korean', flag: '🇰🇷', bcp47: 'ko-KR' },
  fa: { name: 'Farsi (Persian)', flag: '🇮🇷', bcp47: 'fa-IR', rtl: true }
};

const ROMANIZE_LANGS = new Set(['ja', 'zh-CN', 'zh-TW', 'ar', 'ko', 'fa', 'ru', 'uk']);

class TranslationEngine {
  constructor() {
    this.watsonxConfigured = !!(
      process.env.WATSONX_API_KEY &&
      process.env.WATSONX_PROJECT_ID
    );

    if (this.watsonxConfigured) {
      this.watsonxAI = WatsonXAI.newInstance({
        version: '2024-05-31',
        serviceUrl: process.env.WATSONX_URL || 'https://us-south.ml.cloud.ibm.com'
      });
    }
  }

  /**
   * Translate text between languages with advanced options
   */
  async translateText(options) {
    const {
      text,
      sourceLang = 'auto',
      targetLang,
      formality = 'neutral',
      style = 'default',
      length = 'auto',
      domain = '',
      context = []
    } = options;

    // Validation
    if (!text || text.length === 0) {
      throw new Error('Text is required');
    }
    if (text.length > 4000) {
      throw new Error('Text too long (max 4000 characters)');
    }
    if (!targetLang || targetLang === 'auto') {
      throw new Error('Target language must be specified');
    }
    if (!SUPPORTED_LANGUAGES[targetLang]) {
      throw new Error(`Unsupported target language: ${targetLang}`);
    }

    // Use mock mode if watsonx not configured
    if (!this.watsonxConfigured) {
      return this._mockTranslation(text, sourceLang, targetLang);
    }

    try {
      const sourceName = SUPPORTED_LANGUAGES[sourceLang]?.name || sourceLang;
      const targetName = SUPPORTED_LANGUAGES[targetLang].name;
      const needRomanization = ROMANIZE_LANGS.has(targetLang);

      // Build context block if provided
      const contextBlock = context && context.length > 0
        ? `\n\nPrior conversation (for context only — do not translate this):\n${context.map(c => `${c.role}: ${c.text}`).join('\n')}`
        : '';

      // Build translation prompt
      const prompt = `You are a world-class professional translator and cultural localizer. You translate with high fidelity, preserving tone, register, idiom, and intent.

Translate the following text from ${sourceName} to ${targetName}.
Register/formality: ${formality}.
Style: ${style} (default = balanced; literal = word-for-word; idiomatic = natural native phrasing; business = polished professional; literary = expressive/elegant; technical = precise terminology; casual-chat = friendly informal).
Length preference: ${length} (auto = match source; concise = shortest accurate rendering; detailed = expanded for clarity).
${domain ? `Subject domain (use accurate terminology): ${domain}.\n` : ''}
Preserve tone, idioms, emojis, and formatting. Localize culturally where natural; do not literally translate idioms when a native equivalent exists.
If the source language was set to auto-detect, detect it.

Return STRICT JSON with this shape:
{
  "translation": string,
  "detected_source": string,
  "transliteration": string|null,
  "alternatives": [{"text": string, "note": string}],
  "notes": string|null,
  "pronunciation": {
    "ipa": string,
    "syllables": [{"text": string, "phonetic": string, "stress": "primary"|"secondary"|"none"}],
    "guide": string,
    "tips": string|null
  }
}${contextBlock}

Text to translate:
"""
${text}
"""`;

      // Call IBM watsonx.ai
      const response = await this.watsonxAI.generateText({
        input: prompt,
        modelId: process.env.WATSONX_MODEL_ID || 'ibm/granite-3-8b-instruct',
        projectId: process.env.WATSONX_PROJECT_ID,
        parameters: {
          max_new_tokens: 2000,
          temperature: 0.2,
          top_p: 0.95,
          top_k: 50
        }
      });

      const generatedText = response.result.results[0].generated_text;
      
      // Parse JSON response
      let parsed;
      try {
        parsed = JSON.parse(generatedText);
      } catch {
        // Try to extract JSON from response
        const match = generatedText.match(/\{[\s\S]*\}/);
        parsed = match ? JSON.parse(match[0]) : { translation: generatedText };
      }

      return {
        translation: String(parsed.translation || '').trim(),
        detectedSource: String(parsed.detected_source || sourceLang),
        transliteration: needRomanization ? (parsed.transliteration || null) : null,
        alternatives: Array.isArray(parsed.alternatives) ? parsed.alternatives.slice(0, 3) : [],
        notes: parsed.notes || null,
        pronunciation: parsed.pronunciation ? {
          ipa: String(parsed.pronunciation.ipa || ''),
          syllables: Array.isArray(parsed.pronunciation.syllables)
            ? parsed.pronunciation.syllables.slice(0, 40).map(s => ({
                text: String(s.text || ''),
                phonetic: String(s.phonetic || ''),
                stress: (s.stress === 'primary' || s.stress === 'secondary') ? s.stress : 'none'
              }))
            : [],
          guide: String(parsed.pronunciation.guide || ''),
          tips: parsed.pronunciation.tips || null
        } : null
      };

    } catch (error) {
      console.error('Translation error:', error);
      throw new Error(`Translation failed: ${error.message}`);
    }
  }

  /**
   * Mock translation for development/demo
   */
  _mockTranslation(text, sourceLang, targetLang) {
    const targetName = SUPPORTED_LANGUAGES[targetLang].name;
    const needRomanization = ROMANIZE_LANGS.has(targetLang);

    return {
      translation: `[${targetName} translation of: "${text}"]`,
      detectedSource: sourceLang === 'auto' ? 'en' : sourceLang,
      transliteration: needRomanization ? `[Romanization of ${targetName} text]` : null,
      alternatives: [
        { text: `[Alternative 1 in ${targetName}]`, note: 'More formal variant' },
        { text: `[Alternative 2 in ${targetName}]`, note: 'Casual variant' }
      ],
      notes: `Mock translation to ${targetName}. Configure IBM watsonx.ai for real translations.`,
      pronunciation: {
        ipa: '[IPA transcription]',
        syllables: [
          { text: 'mock', phonetic: 'mɑk', stress: 'primary' },
          { text: 'trans', phonetic: 'træns', stress: 'secondary' },
          { text: 'la', phonetic: 'lə', stress: 'none' },
          { text: 'tion', phonetic: 'ʃən', stress: 'none' }
        ],
        guide: 'MAHK trans-LAY-shun',
        tips: 'This is a mock pronunciation guide'
      }
    };
  }

  /**
   * Get list of supported languages
   */
  getSupportedLanguages() {
    return Object.entries(SUPPORTED_LANGUAGES).map(([code, info]) => ({
      code,
      ...info
    }));
  }

  /**
   * Detect language of text
   */
  async detectLanguage(text) {
    if (!this.watsonxConfigured) {
      return { code: 'en', name: 'English', confidence: 0.95 };
    }

    try {
      const prompt = `Detect the language of the following text and return ONLY a JSON object with this exact format:
{"language_code": "ISO-639-1 code", "language_name": "Full language name", "confidence": 0.0-1.0}

Text: "${text.slice(0, 500)}"`;

      const response = await this.watsonxAI.generateText({
        input: prompt,
        modelId: process.env.WATSONX_MODEL_ID || 'ibm/granite-3-8b-instruct',
        projectId: process.env.WATSONX_PROJECT_ID,
        parameters: {
          max_new_tokens: 100,
          temperature: 0.1
        }
      });

      const result = JSON.parse(response.result.results[0].generated_text);
      return {
        code: result.language_code,
        name: result.language_name,
        confidence: result.confidence
      };
    } catch (error) {
      console.error('Language detection error:', error);
      return { code: 'en', name: 'English', confidence: 0.5 };
    }
  }
}

// Export singleton instance
export default new TranslationEngine();

// Made with Bob
