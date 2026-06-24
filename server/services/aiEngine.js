/**
 * AI Engine Service - Enhanced with IBM watsonx.ai Integration
 * Core AI functionality for VividForge Studio
 * Combines VividForge's advanced concept generation with Lumina's multimodal capabilities
 */

import { WatsonXAI } from '@ibm-cloud/watsonx-ai';
import { IamAuthenticator } from 'ibm-cloud-sdk-core';

class AIEngine {
  constructor() {
    this.mockMode = process.env.ENABLE_MOCK_MODE === 'true';
    this.watsonxClient = null;
    this.initializeWatsonX();
  }

  /**
   * Initialize IBM watsonx.ai client
   */
  initializeWatsonX() {
    if (this.mockMode) {
      console.log('🎭 Running in mock mode');
      return;
    }

    const apiKey = process.env.WATSONX_API_KEY;
    const projectId = process.env.WATSONX_PROJECT_ID;
    const serviceUrl = process.env.WATSONX_URL || 'https://us-south.ml.cloud.ibm.com';

    if (!apiKey || !projectId) {
      console.warn('⚠️ IBM watsonx.ai credentials not configured. Running in mock mode.');
      this.mockMode = true;
      return;
    }

    try {
      const authenticator = new IamAuthenticator({ apikey: apiKey });
      this.watsonxClient = WatsonXAI.newInstance({
        version: '2024-05-31',
        serviceUrl: serviceUrl,
        authenticator: authenticator,
      });
      console.log('✅ IBM watsonx.ai initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize watsonx.ai:', error);
      this.mockMode = true;
    }
  }

  /**
   * Generate creative concept using IBM Granite models
   */
  async generateConcept(userInput, options = {}) {
    const {
      stylePreferences = [],
      additionalContext = '',
      referenceImages = []
    } = options;

    if (this.mockMode || !this.watsonxClient) {
      return this.mockConceptGeneration(userInput, options);
    }

    try {
      const systemPrompt = this.buildConceptSystemPrompt();
      const userPrompt = this.buildConceptUserPrompt(userInput, { stylePreferences, additionalContext, referenceImages });

      const response = await this.watsonxClient.generateText({
        modelId: process.env.WATSONX_MODEL_ID || 'ibm/granite-3-8b-instruct',
        input: `${systemPrompt}\n\nUser Request:\n${userPrompt}`,
        parameters: {
          max_new_tokens: 2000,
          temperature: 0.7,
          top_p: 0.9,
          top_k: 50,
          repetition_penalty: 1.1,
        },
        projectId: process.env.WATSONX_PROJECT_ID,
      });

      const generatedText = response.result.results[0].generated_text;
      return this.parseConceptResponse(generatedText, userInput);
    } catch (error) {
      console.error('Error generating concept with watsonx:', error);
      return this.mockConceptGeneration(userInput, options);
    }
  }

  /**
   * Generate story content based on prompt
   */
  async generateStory(prompt, options = {}) {
    const {
      genre = 'fantasy',
      tone = 'adventurous',
      length = 'medium',
      style = 'narrative'
    } = options;

    if (this.mockMode || !this.watsonxClient) {
      return this.mockStoryGeneration(prompt, { genre, tone, length, style });
    }

    try {
      const systemPrompt = `You are an expert storyteller and creative writer. Generate compelling narratives that captivate readers with vivid descriptions, engaging characters, and meaningful plots.`;
      const userPrompt = `Write a ${length} ${genre} story with a ${tone} tone in ${style} style about: ${prompt}`;

      const response = await this.watsonxClient.generateText({
        modelId: process.env.WATSONX_MODEL_ID || 'ibm/granite-3-8b-instruct',
        input: `${systemPrompt}\n\n${userPrompt}`,
        parameters: {
          max_new_tokens: 1500,
          temperature: 0.8,
          top_p: 0.9,
          top_k: 50,
          repetition_penalty: 1.1,
        },
        projectId: process.env.WATSONX_PROJECT_ID,
      });

      const content = response.result.results[0].generated_text;
      return {
        content,
        metadata: {
          genre,
          tone,
          wordCount: content.split(' ').length,
          generatedAt: new Date().toISOString(),
          model: 'ibm-granite-3-8b-instruct'
        },
        suggestions: await this.generateSuggestions(content, 3)
      };
    } catch (error) {
      console.error('Error generating story:', error);
      return this.mockStoryGeneration(prompt, { genre, tone, length, style });
    }
  }

  /**
   * Generate visual concepts and descriptions
   */
  async generateVisualConcept(prompt, options = {}) {
    const {
      style = 'cinematic',
      mood = 'dramatic',
      colorPalette = 'vibrant',
      composition = 'balanced'
    } = options;

    if (this.mockMode || !this.watsonxClient) {
      return this.mockVisualGeneration(prompt, { style, mood, colorPalette, composition });
    }

    try {
      const systemPrompt = `You are an expert visual designer and concept artist. Create detailed visual concepts with specific color palettes, composition guidelines, and technical specifications.`;
      const userPrompt = `Create a visual concept for: ${prompt}\nStyle: ${style}\nMood: ${mood}\nColor Palette: ${colorPalette}\nComposition: ${composition}`;

      const response = await this.watsonxClient.generateText({
        modelId: process.env.WATSONX_MODEL_ID || 'ibm/granite-3-8b-instruct',
        input: `${systemPrompt}\n\n${userPrompt}`,
        parameters: {
          max_new_tokens: 1200,
          temperature: 0.7,
          top_p: 0.9,
          top_k: 50,
          repetition_penalty: 1.1,
        },
        projectId: process.env.WATSONX_PROJECT_ID,
      });

      const description = response.result.results[0].generated_text;
      return this.parseVisualConcept(description, { style, mood, colorPalette, composition });
    } catch (error) {
      console.error('Error generating visual concept:', error);
      return this.mockVisualGeneration(prompt, { style, mood, colorPalette, composition });
    }
  }

  /**
   * Generate interactive scene elements
   */
  async generateScene(prompt, options = {}) {
    const {
      sceneType = 'interactive',
      complexity = 'medium',
      interactivity = 'high'
    } = options;

    if (this.mockMode || !this.watsonxClient) {
      return this.mockSceneGeneration(prompt, { sceneType, complexity, interactivity });
    }

    try {
      const systemPrompt = `You are an expert in interactive storytelling and game design. Create immersive scenes with dynamic elements, branching narratives, and engaging interactions.`;
      const userPrompt = `Create an interactive scene for: ${prompt}\nType: ${sceneType}\nComplexity: ${complexity}\nInteractivity: ${interactivity}`;

      const response = await this.watsonxClient.generateText({
        modelId: process.env.WATSONX_MODEL_ID || 'ibm/granite-3-8b-instruct',
        input: `${systemPrompt}\n\n${userPrompt}`,
        parameters: {
          max_new_tokens: 1500,
          temperature: 0.7,
          top_p: 0.9,
          top_k: 50,
          repetition_penalty: 1.1,
        },
        projectId: process.env.WATSONX_PROJECT_ID,
      });

      const sceneData = response.result.results[0].generated_text;
      return this.parseSceneData(sceneData, { sceneType, complexity, interactivity });
    } catch (error) {
      console.error('Error generating scene:', error);
      return this.mockSceneGeneration(prompt, { sceneType, complexity, interactivity });
    }
  }

  /**
   * Enhance and refine existing content
   */
  async enhanceContent(content, enhancementType = 'general') {
    if (this.mockMode || !this.watsonxClient) {
      return this.mockContentEnhancement(content, enhancementType);
    }

    try {
      const systemPrompt = `You are an expert editor and content enhancer. Improve the given content while maintaining its core message and style.`;
      const userPrompt = `Enhance this content (${enhancementType} enhancement):\n\n${content}`;

      const response = await this.watsonxClient.generateText({
        modelId: process.env.WATSONX_MODEL_ID || 'ibm/granite-3-8b-instruct',
        input: `${systemPrompt}\n\n${userPrompt}`,
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.6,
          top_p: 0.9,
          top_k: 50,
          repetition_penalty: 1.1,
        },
        projectId: process.env.WATSONX_PROJECT_ID,
      });

      const improved = response.result.results[0].generated_text;
      return {
        improved,
        changes: ['Enhanced with AI-powered improvements', 'Maintained original style and intent']
      };
    } catch (error) {
      console.error('Error enhancing content:', error);
      return this.mockContentEnhancement(content, enhancementType);
    }
  }

  /**
   * Generate creative suggestions and alternatives
   */
  async generateSuggestions(context, count = 3) {
    if (this.mockMode || !this.watsonxClient) {
      return this.mockSuggestions(count);
    }

    try {
      const systemPrompt = `You are a creative consultant. Provide ${count} specific, actionable suggestions to improve or expand the given content.`;
      const userPrompt = `Context: ${context.substring(0, 500)}...\n\nProvide ${count} creative suggestions.`;

      const response = await this.watsonxClient.generateText({
        modelId: process.env.WATSONX_MODEL_ID || 'ibm/granite-3-8b-instruct',
        input: `${systemPrompt}\n\n${userPrompt}`,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.8,
          top_p: 0.9,
          top_k: 50,
          repetition_penalty: 1.1,
        },
        projectId: process.env.WATSONX_PROJECT_ID,
      });

      const suggestionsText = response.result.results[0].generated_text;
      return this.parseSuggestions(suggestionsText, count);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      return this.mockSuggestions(count);
    }
  }

  // Helper methods for building prompts

  buildConceptSystemPrompt() {
    return `You are an expert creative director, concept artist, and design strategist with deep knowledge of visual arts, design principles, and creative workflows.

Your role is to transform brief creative ideas into detailed, actionable concepts that visual artists and designers can immediately use in their work.

When generating concepts, you must:
1. Provide rich, detailed descriptions that capture the essence and mood
2. Suggest specific visual elements: colors, composition, lighting, textures
3. Create optimized prompts for AI image generation tools
4. Reference relevant artistic movements, techniques, and inspirations
5. Consider technical execution and practical constraints
6. Maintain a balance between creative vision and feasibility

Always structure your responses as valid JSON with the following format:
{
  "title": "Concept title",
  "coreDescription": "2-3 paragraph detailed description",
  "visualStyle": "Specific style description",
  "mood": "Emotional tone and atmosphere",
  "colorPalette": {
    "primary": [{"name": "Color name", "hex": "#RRGGBB", "usage": "Where/how to use"}],
    "secondary": [...],
    "accent": [...]
  },
  "composition": {
    "layout": "Layout description",
    "focusPoints": ["Point 1", "Point 2"],
    "balance": "Balance description",
    "rhythm": "Rhythm description"
  },
  "imagePrompts": [
    {
      "prompt": "Detailed image generation prompt",
      "style": "Style specification",
      "aspectRatio": "16:9 or 1:1 or 9:16",
      "technicalParams": {"quality": "high", "lighting": "natural"}
    }
  ],
  "moodBoard": [
    {"type": "color|texture|reference|typography", "content": "Content", "description": "Description"}
  ],
  "technicalNotes": ["Note 1", "Note 2"],
  "inspirationReferences": [
    {"title": "Reference", "description": "Why relevant", "type": "artist|movement|technique|work"}
  ]
}`;
  }

  buildConceptUserPrompt(userInput, options) {
    let prompt = `Create a detailed creative concept for:\n"${userInput}"`;
    
    if (options.stylePreferences && options.stylePreferences.length > 0) {
      prompt += `\n\nStyle preferences: ${options.stylePreferences.join(', ')}`;
    }
    
    if (options.additionalContext) {
      prompt += `\n\nAdditional context: ${options.additionalContext}`;
    }
    
    if (options.referenceImages && options.referenceImages.length > 0) {
      prompt += `\n\nReference images provided: ${options.referenceImages.length}`;
    }
    
    return prompt;
  }

  parseConceptResponse(text, userInput) {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const conceptData = JSON.parse(jsonMatch[0]);
        return {
          id: this.generateId(),
          title: conceptData.title || 'Untitled Concept',
          description: userInput,
          userInput: userInput,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...conceptData,
          metadata: {
            model: 'ibm-granite-3-8b-instruct',
            generatedAt: new Date().toISOString()
          }
        };
      }
    } catch (error) {
      console.error('Error parsing concept response:', error);
    }
    
    return this.mockConceptGeneration(userInput, {});
  }

  parseVisualConcept(description, options) {
    const colorPalettes = {
      vibrant: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'],
      muted: ['#A8DADC', '#457B9D', '#1D3557', '#F1FAEE', '#E63946'],
      monochrome: ['#2C3E50', '#34495E', '#7F8C8D', '#BDC3C7', '#ECF0F1'],
      warm: ['#FF6F61', '#FFB347', '#FFDA77', '#F4A460', '#E97451'],
      cool: ['#4A90E2', '#50C9CE', '#7B68EE', '#87CEEB', '#B0E0E6']
    };

    const palette = colorPalettes[options.colorPalette] || colorPalettes.vibrant;

    return {
      description,
      colorPalette: palette,
      elements: [
        { type: 'foreground', description: 'Primary subject with strong presence' },
        { type: 'midground', description: 'Supporting elements that add depth' },
        { type: 'background', description: 'Atmospheric setting that establishes mood' }
      ],
      composition: {
        rule: 'rule-of-thirds',
        focalPoint: 'center-right',
        balance: options.composition
      },
      lighting: {
        type: options.mood === 'dramatic' ? 'high-contrast' : 'soft-diffused',
        direction: 'three-quarter',
        temperature: 'warm'
      },
      metadata: {
        style: options.style,
        mood: options.mood,
        generatedAt: new Date().toISOString(),
        model: 'ibm-granite-3-8b-instruct'
      }
    };
  }

  parseSceneData(sceneData, options) {
    return {
      title: `Interactive Scene`,
      description: sceneData.substring(0, 200),
      elements: [
        {
          id: 'element-1',
          type: 'character',
          name: 'Protagonist',
          description: 'The main character driving the narrative forward',
          interactions: ['dialogue', 'movement', 'decision']
        },
        {
          id: 'element-2',
          type: 'environment',
          name: 'Setting',
          description: 'A richly detailed world that responds to user actions',
          interactions: ['exploration', 'discovery', 'transformation']
        }
      ],
      branches: [
        {
          id: 'branch-1',
          condition: 'User chooses path A',
          outcome: 'Story progresses toward resolution',
          nextScene: 'scene-2a'
        },
        {
          id: 'branch-2',
          condition: 'User chooses path B',
          outcome: 'Story takes unexpected turn',
          nextScene: 'scene-2b'
        }
      ],
      interactivity: {
        level: options.interactivity,
        types: ['click', 'hover', 'drag', 'choice'],
        feedback: 'immediate'
      },
      metadata: {
        complexity: options.complexity,
        estimatedDuration: '5-10 minutes',
        generatedAt: new Date().toISOString(),
        model: 'ibm-granite-3-8b-instruct'
      }
    };
  }

  parseSuggestions(text, count) {
    const suggestions = [];
    const lines = text.split('\n').filter(line => line.trim());
    
    for (let i = 0; i < Math.min(count, lines.length); i++) {
      suggestions.push({
        id: `suggestion-${Date.now()}-${i}`,
        text: lines[i].replace(/^\d+\.\s*/, '').replace(/^-\s*/, ''),
        type: ['plot', 'character', 'setting', 'theme'][i % 4],
        confidence: 0.8 + Math.random() * 0.2
      });
    }
    
    return suggestions.length > 0 ? suggestions : this.mockSuggestions(count);
  }

  // Mock implementations for development and fallback

  mockConceptGeneration(userInput, options) {
    return {
      id: this.generateId(),
      title: `Creative Concept: ${userInput.substring(0, 30)}`,
      description: userInput,
      userInput: userInput,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      coreDescription: `A compelling creative concept exploring ${userInput}. This concept combines innovative visual elements with thoughtful design principles to create an engaging and memorable experience.`,
      visualStyle: options.stylePreferences?.[0] || 'Contemporary with cinematic influences',
      mood: 'Evocative and atmospheric',
      colorPalette: {
        primary: [
          { name: 'Deep Ocean', hex: '#004E89', usage: 'Primary backgrounds and headers' },
          { name: 'Midnight Blue', hex: '#1A1A2E', usage: 'Text and accents' }
        ],
        secondary: [
          { name: 'Soft Coral', hex: '#FF6B6B', usage: 'Call-to-action elements' },
          { name: 'Warm Sand', hex: '#F4A261', usage: 'Supporting elements' }
        ],
        accent: [
          { name: 'Electric Cyan', hex: '#00D9FF', usage: 'Highlights and interactive elements' }
        ]
      },
      composition: {
        layout: 'Asymmetric balance with strong focal points',
        focusPoints: ['Upper third intersection', 'Center-right golden ratio'],
        balance: 'Dynamic with intentional tension',
        rhythm: 'Varied pacing with moments of rest'
      },
      imagePrompts: [
        {
          prompt: `${userInput}, cinematic lighting, high detail, professional photography, 8k resolution`,
          style: 'Photorealistic',
          aspectRatio: '16:9',
          technicalParams: { quality: 'high', lighting: 'dramatic', camera: '85mm f/1.8' }
        }
      ],
      moodBoard: [
        { type: 'color', content: '#004E89', description: 'Primary brand color - trust and depth' },
        { type: 'texture', content: 'Brushed metal', description: 'Modern industrial aesthetic' }
      ],
      technicalNotes: [
        'Consider responsive design for mobile devices',
        'Ensure WCAG AA accessibility compliance',
        'Optimize assets for web performance'
      ],
      inspirationReferences: [
        { title: 'Bauhaus Movement', description: 'Form follows function', type: 'movement' },
        { title: 'Swiss Design', description: 'Clean typography and grid systems', type: 'movement' }
      ],
      metadata: {
        model: 'mock-creative-engine-v2',
        generatedAt: new Date().toISOString()
      }
    };
  }

  mockStoryGeneration(prompt, options) {
    const storyTemplates = {
      fantasy: `In a realm where magic intertwines with reality, ${prompt}. The ancient prophecy speaks of a chosen one who must navigate treacherous paths and face impossible choices. As shadows lengthen across the land, our hero discovers that true power lies not in magic, but in the courage to stand against darkness.`,
      
      scifi: `In the year 2157, ${prompt}. Advanced AI systems have transformed society, but at what cost? As humanity reaches for the stars, they must confront the fundamental question: what does it mean to be human in an age of artificial consciousness?`,
      
      mystery: `The case seemed straightforward until ${prompt}. Detective Morgan had seen countless investigations, but this one was different. Every clue led to more questions, and the truth was buried deeper than anyone imagined.`,
      
      romance: `When fate brought them together, ${prompt}. Against all odds and despite their differences, they discovered that love has a way of illuminating even the darkest corners of the heart.`,
      
      thriller: `Time was running out. ${prompt}. Every decision mattered, every second counted. The stakes had never been higher, and failure was not an option.`
    };

    const baseStory = storyTemplates[options.genre] || storyTemplates.fantasy;
    
    return {
      content: baseStory,
      metadata: {
        genre: options.genre,
        tone: options.tone,
        wordCount: baseStory.split(' ').length,
        generatedAt: new Date().toISOString(),
        model: 'mock-creative-engine-v2'
      },
      suggestions: this.mockSuggestions(3)
    };
  }

  mockVisualGeneration(prompt, options) {
    const colorPalettes = {
      vibrant: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'],
      muted: ['#A8DADC', '#457B9D', '#1D3557', '#F1FAEE', '#E63946'],
      monochrome: ['#2C3E50', '#34495E', '#7F8C8D', '#BDC3C7', '#ECF0F1'],
      warm: ['#FF6F61', '#FFB347', '#FFDA77', '#F4A460', '#E97451'],
      cool: ['#4A90E2', '#50C9CE', '#7B68EE', '#87CEEB', '#B0E0E6']
    };

    const palette = colorPalettes[options.colorPalette] || colorPalettes.vibrant;

    return {
      description: `A ${options.style} composition featuring ${prompt}. The scene is bathed in ${options.mood} lighting, creating a powerful emotional atmosphere. The ${options.composition} arrangement draws the eye naturally through the frame.`,
      colorPalette: palette,
      elements: [
        { type: 'foreground', description: 'Primary subject with strong presence' },
        { type: 'midground', description: 'Supporting elements that add depth' },
        { type: 'background', description: 'Atmospheric setting that establishes mood' }
      ],
      composition: {
        rule: 'rule-of-thirds',
        focalPoint: 'center-right',
        balance: options.composition
      },
      lighting: {
        type: options.mood === 'dramatic' ? 'high-contrast' : 'soft-diffused',
        direction: 'three-quarter',
        temperature: 'warm'
      },
      metadata: {
        style: options.style,
        mood: options.mood,
        generatedAt: new Date().toISOString(),
        model: 'mock-creative-engine-v2'
      }
    };
  }

  mockSceneGeneration(prompt, options) {
    return {
      title: `Interactive Scene: ${prompt.substring(0, 50)}`,
      description: `An immersive ${options.sceneType} experience that brings ${prompt} to life through interactive elements and dynamic storytelling.`,
      elements: [
        {
          id: 'element-1',
          type: 'character',
          name: 'Protagonist',
          description: 'The main character driving the narrative forward',
          interactions: ['dialogue', 'movement', 'decision']
        },
        {
          id: 'element-2',
          type: 'environment',
          name: 'Setting',
          description: 'A richly detailed world that responds to user actions',
          interactions: ['exploration', 'discovery', 'transformation']
        },
        {
          id: 'element-3',
          type: 'object',
          name: 'Key Item',
          description: 'A significant object that unlocks new possibilities',
          interactions: ['examine', 'use', 'combine']
        }
      ],
      branches: [
        {
          id: 'branch-1',
          condition: 'User chooses path A',
          outcome: 'Story progresses toward resolution',
          nextScene: 'scene-2a'
        },
        {
          id: 'branch-2',
          condition: 'User chooses path B',
          outcome: 'Story takes unexpected turn',
          nextScene: 'scene-2b'
        }
      ],
      interactivity: {
        level: options.interactivity,
        types: ['click', 'hover', 'drag', 'choice'],
        feedback: 'immediate'
      },
      metadata: {
        complexity: options.complexity,
        estimatedDuration: '5-10 minutes',
        generatedAt: new Date().toISOString(),
        model: 'mock-creative-engine-v2'
      }
    };
  }

  mockContentEnhancement(content, enhancementType) {
    const enhancements = {
      general: {
        improved: content + '\n\n[Enhanced with richer descriptions and improved flow]',
        changes: ['Added sensory details', 'Improved pacing', 'Strengthened transitions']
      },
      dialogue: {
        improved: content + '\n\n[Dialogue enhanced with natural speech patterns and subtext]',
        changes: ['Made dialogue more natural', 'Added character voice', 'Included subtext']
      },
      description: {
        improved: content + '\n\n[Descriptions enriched with vivid imagery and atmosphere]',
        changes: ['Added visual details', 'Enhanced atmosphere', 'Improved imagery']
      },
      pacing: {
        improved: content + '\n\n[Pacing optimized for better narrative flow]',
        changes: ['Adjusted sentence length', 'Improved rhythm', 'Enhanced tension']
      }
    };

    return enhancements[enhancementType] || enhancements.general;
  }

  mockSuggestions(count) {
    const templates = [
      'What if the protagonist discovers a hidden truth about their past?',
      'Consider adding a mysterious character who challenges the status quo',
      'Explore the emotional depth of the conflict through internal dialogue',
      'Introduce a time-sensitive element to increase tension',
      'Add a symbolic object that represents the theme',
      'Create a parallel storyline that mirrors the main narrative',
      'Develop a twist that recontextualizes earlier events',
      'Include sensory details to immerse the reader in the setting'
    ];

    const suggestions = [];
    for (let i = 0; i < count; i++) {
      suggestions.push({
        id: `suggestion-${Date.now()}-${i}`,
        text: templates[Math.floor(Math.random() * templates.length)],
        type: ['plot', 'character', 'setting', 'theme'][Math.floor(Math.random() * 4)],
        confidence: 0.7 + Math.random() * 0.3
      });
    }

    return suggestions;
  }

  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  getStatus() {
    return {
      mockMode: this.mockMode,
      watsonxConfigured: !!this.watsonxClient,
      ready: this.mockMode || !!this.watsonxClient,
      model: process.env.WATSONX_MODEL_ID || 'ibm/granite-3-8b-instruct'
    };
  }
}

export default new AIEngine();

// Made with Bob - Enhanced with IBM watsonx.ai and Granite models
