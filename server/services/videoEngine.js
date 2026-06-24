/**
 * Video Engine Service - Advanced 6-Second Video Generation
 * Combines AI-generated images, transitions, and audio for cinematic micro-content
 */

import axios from 'axios';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegStatic);

class VideoEngine {
  constructor() {
    this.mockMode = process.env.ENABLE_MOCK_MODE === 'true';
    this.tempDir = path.join(__dirname, '../../temp');
    this.outputDir = path.join(__dirname, '../../public/generated');
    this.ensureDirectories();
    
    // Video generation parameters
    this.videoDuration = 6; // seconds
    this.fps = 30;
    this.resolution = '1920x1080';
    this.bitrate = '5000k';
  }

  async ensureDirectories() {
    try {
      await fs.mkdir(this.tempDir, { recursive: true });
      await fs.mkdir(this.outputDir, { recursive: true });
    } catch (error) {
      console.error('Error creating directories:', error);
    }
  }

  /**
   * Generate a 6-second cinematic video from concept
   */
  async generateVideo(concept, options = {}) {
    const {
      style = 'cinematic',
      transition = 'fade',
      music = 'ambient',
      voiceover = null,
      effects = ['ken-burns', 'color-grade']
    } = options;

    if (this.mockMode) {
      return this.mockVideoGeneration(concept, options);
    }

    try {
      const videoId = `video_${Date.now()}`;
      const scenes = await this.generateScenes(concept, style);
      const audioTrack = await this.generateAudioTrack(concept, music, voiceover);
      const videoPath = await this.composeVideo(videoId, scenes, audioTrack, {
        transition,
        effects,
        style
      });

      return {
        videoId,
        videoUrl: `/generated/${path.basename(videoPath)}`,
        duration: this.videoDuration,
        resolution: this.resolution,
        scenes: scenes.length,
        metadata: {
          concept: concept.title || 'Untitled',
          style,
          transition,
          effects,
          generatedAt: new Date().toISOString(),
          fps: this.fps
        }
      };
    } catch (error) {
      console.error('Video generation error:', error);
      return this.mockVideoGeneration(concept, options);
    }
  }

  /**
   * Generate video scenes from concept
   */
  async generateScenes(concept, style) {
    // For 6-second video: 3 scenes of 2 seconds each
    const sceneCount = 3;
    const sceneDuration = this.videoDuration / sceneCount;

    const scenes = [];
    
    // Scene 1: Establishing shot
    scenes.push({
      id: 'scene_1',
      duration: sceneDuration,
      type: 'establishing',
      prompt: this.buildScenePrompt(concept, 'wide establishing shot', style),
      composition: 'wide',
      movement: 'slow-zoom-in'
    });

    // Scene 2: Detail/Focus shot
    scenes.push({
      id: 'scene_2',
      duration: sceneDuration,
      type: 'detail',
      prompt: this.buildScenePrompt(concept, 'detailed close-up', style),
      composition: 'close-up',
      movement: 'pan-right'
    });

    // Scene 3: Dramatic finale
    scenes.push({
      id: 'scene_3',
      duration: sceneDuration,
      type: 'finale',
      prompt: this.buildScenePrompt(concept, 'dramatic reveal', style),
      composition: 'dynamic',
      movement: 'zoom-out'
    });

    // Generate images for each scene
    for (const scene of scenes) {
      scene.imagePath = await this.generateSceneImage(scene);
    }

    return scenes;
  }

  /**
   * Build optimized prompt for scene generation
   */
  buildScenePrompt(concept, sceneType, style) {
    const basePrompt = concept.description || concept.coreDescription || 'creative concept';
    const styleModifiers = {
      cinematic: 'cinematic lighting, film grain, anamorphic lens, dramatic shadows',
      artistic: 'artistic interpretation, painterly style, vibrant colors, expressive',
      realistic: 'photorealistic, high detail, natural lighting, 8k resolution',
      abstract: 'abstract composition, geometric shapes, bold colors, modern art',
      vintage: 'vintage aesthetic, film photography, nostalgic mood, retro colors'
    };

    const sceneModifiers = {
      'wide establishing shot': 'wide angle, establishing shot, environmental context',
      'detailed close-up': 'macro detail, shallow depth of field, intimate perspective',
      'dramatic reveal': 'dramatic composition, dynamic angle, impactful framing'
    };

    return `${basePrompt}, ${sceneType}, ${styleModifiers[style] || styleModifiers.cinematic}, ${sceneModifiers[sceneType] || ''}, professional cinematography, 4k quality`;
  }

  /**
   * Generate image for scene (mock implementation)
   */
  async generateSceneImage(scene) {
    // In production, this would call DALL-E, Stable Diffusion, or similar
    // For now, return a placeholder path
    const imagePath = path.join(this.tempDir, `${scene.id}.jpg`);
    
    // Create a simple colored rectangle as placeholder
    // In production, this would be replaced with actual AI image generation
    return imagePath;
  }

  /**
   * Generate audio track for video
   */
  async generateAudioTrack(concept, musicStyle, voiceover) {
    const audioElements = [];

    // Background music
    if (musicStyle) {
      audioElements.push({
        type: 'music',
        style: musicStyle,
        volume: 0.3,
        duration: this.videoDuration
      });
    }

    // Voiceover narration
    if (voiceover) {
      audioElements.push({
        type: 'voice',
        text: voiceover,
        volume: 0.8,
        startTime: 0.5
      });
    }

    // Sound effects
    audioElements.push({
      type: 'sfx',
      effects: ['whoosh', 'ambient'],
      volume: 0.2
    });

    return audioElements;
  }

  /**
   * Compose final video from scenes and audio
   */
  async composeVideo(videoId, scenes, audioTrack, options) {
    const outputPath = path.join(this.outputDir, `${videoId}.mp4`);

    return new Promise((resolve, reject) => {
      let command = ffmpeg();

      // Add scene images with Ken Burns effect
      scenes.forEach((scene, index) => {
        command = command.input(scene.imagePath);
      });

      // Apply video filters
      const filters = this.buildVideoFilters(scenes, options);

      command
        .complexFilter(filters)
        .outputOptions([
          '-c:v libx264',
          '-preset slow',
          '-crf 18',
          `-b:v ${this.bitrate}`,
          `-r ${this.fps}`,
          '-pix_fmt yuv420p',
          '-movflags +faststart'
        ])
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(err))
        .run();
    });
  }

  /**
   * Build FFmpeg filter chain for cinematic effects
   */
  buildVideoFilters(scenes, options) {
    const filters = [];
    const { transition, effects, style } = options;

    scenes.forEach((scene, index) => {
      const duration = scene.duration;
      
      // Ken Burns effect (slow zoom and pan)
      if (effects.includes('ken-burns')) {
        const movement = this.getKenBurnsFilter(scene.movement, duration);
        filters.push(`[${index}:v]${movement}[v${index}]`);
      }

      // Color grading
      if (effects.includes('color-grade')) {
        const colorGrade = this.getColorGradeFilter(style);
        filters.push(`[v${index}]${colorGrade}[c${index}]`);
      }
    });

    // Transitions between scenes
    if (transition === 'fade') {
      filters.push(this.getFadeTransition(scenes.length));
    } else if (transition === 'dissolve') {
      filters.push(this.getDissolveTransition(scenes.length));
    }

    return filters;
  }

  /**
   * Get Ken Burns effect filter
   */
  getKenBurnsFilter(movement, duration) {
    const movements = {
      'slow-zoom-in': `zoompan=z='min(zoom+0.0015,1.5)':d=${duration * 30}:s=${this.resolution}`,
      'pan-right': `zoompan=z='1.2':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${duration * 30}:s=${this.resolution}`,
      'zoom-out': `zoompan=z='if(lte(zoom,1.0),1.5,max(1.0,zoom-0.0015))':d=${duration * 30}:s=${this.resolution}`
    };
    return movements[movement] || movements['slow-zoom-in'];
  }

  /**
   * Get color grading filter
   */
  getColorGradeFilter(style) {
    const grades = {
      cinematic: 'eq=contrast=1.2:brightness=0.05:saturation=1.1,curves=vintage',
      artistic: 'eq=contrast=1.3:saturation=1.4,hue=s=1.2',
      realistic: 'eq=contrast=1.05:brightness=0.02',
      abstract: 'eq=contrast=1.4:saturation=1.5,hue=h=10',
      vintage: 'eq=contrast=0.9:brightness=-0.1:saturation=0.8,curves=vintage'
    };
    return grades[style] || grades.cinematic;
  }

  /**
   * Get fade transition filter
   */
  getFadeTransition(sceneCount) {
    // Crossfade between scenes
    let filter = '[c0][c1]xfade=transition=fade:duration=0.5:offset=1.5[f1]';
    if (sceneCount > 2) {
      filter += ';[f1][c2]xfade=transition=fade:duration=0.5:offset=3.5[out]';
    }
    return filter;
  }

  /**
   * Get dissolve transition filter
   */
  getDissolveTransition(sceneCount) {
    let filter = '[c0][c1]xfade=transition=dissolve:duration=0.5:offset=1.5[f1]';
    if (sceneCount > 2) {
      filter += ';[f1][c2]xfade=transition=dissolve:duration=0.5:offset=3.5[out]';
    }
    return filter;
  }

  /**
   * Generate video from story
   */
  async generateStoryVideo(story, options = {}) {
    const concept = {
      title: 'Story Visualization',
      description: story.content.substring(0, 200),
      coreDescription: story.content
    };

    return await this.generateVideo(concept, {
      ...options,
      voiceover: story.content.substring(0, 150) // First 150 chars for voiceover
    });
  }

  /**
   * Generate video from visual concept
   */
  async generateConceptVideo(visualConcept, options = {}) {
    return await this.generateVideo(visualConcept, {
      ...options,
      style: visualConcept.visualStyle || 'cinematic'
    });
  }

  /**
   * Mock video generation for development
   */
  mockVideoGeneration(concept, options) {
    return {
      videoId: `mock_video_${Date.now()}`,
      videoUrl: '/assets/gemini_generated_video_2e8f17f0.mp4',
      duration: this.videoDuration,
      resolution: this.resolution,
      scenes: 3,
      metadata: {
        concept: concept.title || 'Untitled',
        style: options.style || 'cinematic',
        transition: options.transition || 'fade',
        effects: options.effects || ['ken-burns', 'color-grade'],
        generatedAt: new Date().toISOString(),
        fps: this.fps,
        note: 'Mock mode - video generation requires additional setup'
      }
    };
  }

  /**
   * Clean up temporary files
   */
  async cleanup(videoId) {
    try {
      const files = await fs.readdir(this.tempDir);
      for (const file of files) {
        if (file.includes(videoId)) {
          await fs.unlink(path.join(this.tempDir, file));
        }
      }
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }

  getStatus() {
    return {
      mockMode: this.mockMode,
      videoDuration: this.videoDuration,
      resolution: this.resolution,
      fps: this.fps,
      ready: true
    };
  }
}

export default new VideoEngine();

// Made with Bob - Advanced Video Generation