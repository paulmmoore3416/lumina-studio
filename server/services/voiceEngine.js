/**
 * Voice Engine Service - ElevenLabs Integration
 * Advanced text-to-speech with voice cloning and emotion control
 */

import axios from 'axios';
import FormData from 'form-data';

class VoiceEngine {
  constructor() {
    this.apiKey = process.env.ELEVENLABS_API_KEY;
    this.apiUrl = 'https://api.elevenlabs.io/v1';
    this.mockMode = !this.apiKey || process.env.ENABLE_MOCK_MODE === 'true';
    
    // Premium voice IDs from ElevenLabs
    this.voices = {
      rachel: '21m00Tcm4TlvDq8ikWAM', // Calm, professional female
      adam: 'pNInz6obpgDQGcFmaJgB', // Deep, authoritative male
      bella: 'EXAVITQu4vr4xnSDxMaL', // Warm, friendly female
      josh: 'TxGEqnHWrfWFTfGW9XjX', // Young, energetic male
      sam: 'yoZ06aMxZJJ28mfd3POQ', // Neutral, versatile
      antoni: 'ErXwobaYiN019PkySvjV', // Articulate, clear
      elli: 'MF3mGyEYCl7XYWbV9V6O', // Youthful, expressive
      domi: 'AZnzlk1XvdvUeBnXmlld', // Strong, confident
      nicole: 'piTKgcLEGmPE4e6mEKli', // Smooth, sophisticated
      glinda: 'z9fAnlkpzviPz146aGWa' // Ethereal, mystical
    };
  }

  /**
   * Generate speech from text with advanced options
   */
  async generateSpeech(text, options = {}) {
    const {
      voice = 'rachel',
      stability = 0.5,
      similarityBoost = 0.75,
      style = 0.0,
      useSpeakerBoost = true,
      emotion = 'neutral',
      speed = 1.0
    } = options;

    if (this.mockMode) {
      return this.mockSpeechGeneration(text, options);
    }

    try {
      const voiceId = this.voices[voice] || this.voices.rachel;
      
      const response = await axios.post(
        `${this.apiUrl}/text-to-speech/${voiceId}`,
        {
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: stability,
            similarity_boost: similarityBoost,
            style: style,
            use_speaker_boost: useSpeakerBoost
          }
        },
        {
          headers: {
            'Accept': 'audio/mpeg',
            'xi-api-key': this.apiKey,
            'Content-Type': 'application/json'
          },
          responseType: 'arraybuffer'
        }
      );

      return {
        audio: Buffer.from(response.data),
        format: 'mp3',
        duration: this.estimateDuration(text, speed),
        voice: voice,
        metadata: {
          text: text,
          voice: voice,
          emotion: emotion,
          generatedAt: new Date().toISOString(),
          model: 'eleven_multilingual_v2'
        }
      };
    } catch (error) {
      console.error('ElevenLabs API error:', error.response?.data || error.message);
      return this.mockSpeechGeneration(text, options);
    }
  }

  /**
   * Generate speech with emotion control
   */
  async generateEmotionalSpeech(text, emotion = 'neutral', voice = 'rachel') {
    const emotionSettings = {
      neutral: { stability: 0.5, similarityBoost: 0.75, style: 0.0 },
      excited: { stability: 0.3, similarityBoost: 0.85, style: 0.5 },
      calm: { stability: 0.7, similarityBoost: 0.65, style: 0.2 },
      dramatic: { stability: 0.4, similarityBoost: 0.9, style: 0.8 },
      mysterious: { stability: 0.6, similarityBoost: 0.7, style: 0.6 },
      energetic: { stability: 0.2, similarityBoost: 0.8, style: 0.7 },
      sad: { stability: 0.8, similarityBoost: 0.6, style: 0.3 },
      angry: { stability: 0.3, similarityBoost: 0.9, style: 0.9 }
    };

    const settings = emotionSettings[emotion] || emotionSettings.neutral;
    
    return await this.generateSpeech(text, {
      voice,
      ...settings,
      emotion
    });
  }

  /**
   * Generate narration for stories
   */
  async generateNarration(storyText, options = {}) {
    const {
      voice = 'antoni',
      chapterize = true,
      addPauses = true
    } = options;

    let processedText = storyText;

    if (addPauses) {
      // Add natural pauses at punctuation
      processedText = processedText
        .replace(/\./g, '.<break time="0.5s"/>')
        .replace(/,/g, ',<break time="0.3s"/>')
        .replace(/\?/g, '?<break time="0.7s"/>')
        .replace(/!/g, '!<break time="0.7s"/>');
    }

    return await this.generateSpeech(processedText, {
      voice,
      stability: 0.6,
      similarityBoost: 0.8,
      style: 0.4,
      emotion: 'narrative'
    });
  }

  /**
   * Get available voices
   */
  async getAvailableVoices() {
    if (this.mockMode) {
      return Object.keys(this.voices).map(key => ({
        id: key,
        name: key.charAt(0).toUpperCase() + key.slice(1),
        description: this.getVoiceDescription(key),
        category: this.getVoiceCategory(key)
      }));
    }

    try {
      const response = await axios.get(`${this.apiUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey
        }
      });

      return response.data.voices.map(voice => ({
        id: voice.voice_id,
        name: voice.name,
        description: voice.description || 'Professional voice',
        category: voice.category || 'general'
      }));
    } catch (error) {
      console.error('Error fetching voices:', error);
      return this.getAvailableVoices(); // Return mock voices
    }
  }

  /**
   * Convert text to phonetic pronunciation guide
   */
  generatePronunciationGuide(text) {
    // Add pronunciation hints for complex words
    const pronunciationMap = {
      'VividForge': '<phoneme alphabet="ipa" ph="ˈvɪvɪd fɔːrdʒ">VividForge</phoneme>',
      'watsonx': '<phoneme alphabet="ipa" ph="ˈwɒtsənˌɛks">watsonx</phoneme>',
      'Granite': '<phoneme alphabet="ipa" ph="ˈɡrænɪt">Granite</phoneme>'
    };

    let processedText = text;
    for (const [word, phoneme] of Object.entries(pronunciationMap)) {
      const regex = new RegExp(word, 'gi');
      processedText = processedText.replace(regex, phoneme);
    }

    return processedText;
  }

  // Helper methods

  estimateDuration(text, speed = 1.0) {
    // Average speaking rate: 150 words per minute
    const words = text.split(/\s+/).length;
    const minutes = words / 150;
    const seconds = (minutes * 60) / speed;
    return Math.ceil(seconds);
  }

  getVoiceDescription(voiceKey) {
    const descriptions = {
      rachel: 'Calm, professional female voice - perfect for narration',
      adam: 'Deep, authoritative male voice - ideal for serious content',
      bella: 'Warm, friendly female voice - great for welcoming messages',
      josh: 'Young, energetic male voice - excellent for dynamic content',
      sam: 'Neutral, versatile voice - suitable for any content',
      antoni: 'Articulate, clear voice - perfect for storytelling',
      elli: 'Youthful, expressive voice - great for creative content',
      domi: 'Strong, confident voice - ideal for impactful messages',
      nicole: 'Smooth, sophisticated voice - perfect for elegant content',
      glinda: 'Ethereal, mystical voice - excellent for fantasy narratives'
    };
    return descriptions[voiceKey] || 'Professional voice';
  }

  getVoiceCategory(voiceKey) {
    const categories = {
      rachel: 'professional',
      adam: 'authoritative',
      bella: 'friendly',
      josh: 'energetic',
      sam: 'neutral',
      antoni: 'narrative',
      elli: 'creative',
      domi: 'confident',
      nicole: 'sophisticated',
      glinda: 'mystical'
    };
    return categories[voiceKey] || 'general';
  }

  mockSpeechGeneration(text, options) {
    return {
      audio: Buffer.from('mock-audio-data'),
      format: 'mp3',
      duration: this.estimateDuration(text, options.speed || 1.0),
      voice: options.voice || 'rachel',
      metadata: {
        text: text,
        voice: options.voice || 'rachel',
        emotion: options.emotion || 'neutral',
        generatedAt: new Date().toISOString(),
        model: 'mock-voice-engine',
        note: 'Mock mode - add ELEVENLABS_API_KEY to .env for real voice generation'
      }
    };
  }

  getStatus() {
    return {
      mockMode: this.mockMode,
      configured: !!this.apiKey,
      availableVoices: Object.keys(this.voices).length,
      ready: this.mockMode || !!this.apiKey
    };
  }
}

export default new VoiceEngine();

// Made with Bob - Advanced Voice Generation