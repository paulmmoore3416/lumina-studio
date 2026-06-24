import './styles/main.css';
import { StoryGenerator } from './modules/StoryGenerator.js';
import { VisualGenerator } from './modules/VisualGenerator.js';
import { SceneBuilder } from './modules/SceneBuilder.js';
import { CollaborationHub } from './modules/CollaborationHub.js';
import { ConceptGenerator } from './modules/ConceptGenerator.js';
import { VoiceGenerator } from './modules/VoiceGenerator.js';
import { VideoGenerator } from './modules/VideoGenerator.js';
import { TranslationHub } from './modules/TranslationHub.js';
import { UIManager } from './modules/UIManager.js';

/**
 * VividForge Studio - Main Application Entry Point
 * AI-powered creative ideation & multimodal platform
 * Powered by IBM watsonx.ai, Granite models, and ElevenLabs
 */

class VividForgeStudio {
  constructor() {
    this.modules = {
      concept: new ConceptGenerator(),
      story: new StoryGenerator(),
      visual: new VisualGenerator(),
      scene: new SceneBuilder(),
      voice: new VoiceGenerator(),
      video: new VideoGenerator(),
      translation: new TranslationHub(),
      collaboration: new CollaborationHub(),
      ui: new UIManager()
    };
    
    this.currentModule = null;
    this.init();
  }

  async init() {
    console.log('🎨 Initializing VividForge Studio...');
    
    // Check API health
    await this.checkAPIHealth();
    
    // Render the application
    this.render();
    
    // Set up event listeners
    this.setupEventListeners();
    
    console.log('✨ VividForge Studio ready!');
  }

  async checkAPIHealth() {
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      console.log('✅ API Status:', data.status);
    } catch (error) {
      console.warn('⚠️ API not available, running in offline mode');
    }
  }

  render() {
    const app = document.getElementById('app');
    
    app.innerHTML = `
      <div class="animated-bg"></div>
      
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h1 class="hero-title">VividForge Studio</h1>
          <p class="hero-subtitle">Where AI Meets Creativity</p>
          <p class="hero-description">
            Transform creative sparks into detailed concepts with IBM watsonx.ai and Granite models.
            Professional-grade AI tools for visual artists, designers, storytellers, and creative professionals.
          </p>
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <button class="btn btn-primary" data-module="concept">
              <span>✨</span> Concept Generator
            </button>
            <button class="btn btn-primary" data-module="story">
              <span>📝</span> Story Architect
            </button>
            <button class="btn btn-primary" data-module="visual">
              <span>🎨</span> Visual Design
            </button>
            <button class="btn btn-primary" data-module="voice">
              <span>🎙️</span> Voice Generator
            </button>
            <button class="btn btn-primary" data-module="video">
              <span>🎬</span> Video Generator
            </button>
            <button class="btn btn-primary" data-module="translation">
              <span>🌍</span> Translation Hub
            </button>
            <button class="btn btn-primary" data-module="scene">
              <span>🎭</span> Scene Builder
            </button>
            <button class="btn btn-secondary" data-module="collaboration">
              <span>🤝</span> Collaborate
            </button>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="section">
        <div class="container">
          <h2 class="text-center mb-xl" style="font-family: var(--font-display); font-size: 2.5rem; color: var(--color-text-primary);">
            Professional Creative Tools Powered by IBM Granite
          </h2>
          
          <div class="bento-grid">
            <div class="glass-card bento-item featured">
              <div>
                <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: var(--color-accent-light);">
                  ✨ Advanced Concept Generator
                </h3>
                <p style="color: var(--color-text-secondary); line-height: 1.8;">
                  Transform 1-sentence ideas into comprehensive creative briefs with color palettes,
                  composition guidelines, and AI-ready image prompts. Powered by IBM Granite.
                </p>
              </div>
              <button class="btn btn-secondary mt-md" data-module="concept">Generate Concepts</button>
            </div>

            <div class="glass-card bento-item">
              <div>
                <h3 style="font-size: 1.25rem; margin-bottom: 0.75rem; color: var(--color-accent-light);">
                  🎙️ Voice Generator
                </h3>
                <p style="color: var(--color-text-secondary);">
                  Professional text-to-speech with ElevenLabs AI. Multiple voices and emotion control.
                </p>
              </div>
              <button class="btn btn-secondary mt-md" data-module="voice">Generate Voice</button>
            </div>

            <div class="glass-card bento-item">
              <div>
                <h3 style="font-size: 1.25rem; margin-bottom: 0.75rem; color: var(--color-accent-light);">
                  🎬 Video Generator
                </h3>
                <p style="color: var(--color-text-secondary);">
                  Create stunning 6-second cinematic videos with AI-powered scene composition.
                </p>
              </div>
              <button class="btn btn-secondary mt-md" data-module="video">Generate Video</button>
            </div>

            <div class="glass-card bento-item">
              <div>
                <h3 style="font-size: 1.25rem; margin-bottom: 0.75rem; color: var(--color-accent-light);">
                  🌍 Translation Hub
                </h3>
                <p style="color: var(--color-text-secondary);">
                  Translate between 12 languages with pronunciation guides and cultural localization.
                </p>
              </div>
              <button class="btn btn-secondary mt-md" data-module="translation">Translate Now</button>
            </div>

            <div class="glass-card bento-item">
              <div>
                <h3 style="font-size: 1.25rem; margin-bottom: 0.75rem; color: var(--color-accent-light);">
                  📝 AI Story Architect
                </h3>
                <p style="color: var(--color-text-secondary);">
                  Generate compelling narratives across multiple genres with intelligent plot development.
                </p>
              </div>
              <button class="btn btn-secondary mt-md" data-module="story">Create Stories</button>
            </div>

            <div class="glass-card bento-item">
              <div>
                <h3 style="font-size: 1.25rem; margin-bottom: 0.75rem; color: var(--color-accent-light);">
                  🎨 Visual Concept Generator
                </h3>
                <p style="color: var(--color-text-secondary);">
                  Create mood boards, color palettes, and visual descriptions for your creative projects.
                </p>
              </div>
              <button class="btn btn-secondary mt-md" data-module="visual">Generate Visuals</button>
            </div>

            <div class="glass-card bento-item">
              <div>
                <h3 style="font-size: 1.25rem; margin-bottom: 0.75rem; color: var(--color-accent-light);">
                  🎬 Interactive Scene Builder
                </h3>
                <p style="color: var(--color-text-secondary);">
                  Build immersive interactive scenes with dynamic elements and user choices.
                </p>
              </div>
              <button class="btn btn-secondary mt-md" data-module="scene">Build Scenes</button>
            </div>

            <div class="glass-card bento-item">
              <div>
                <h3 style="font-size: 1.25rem; margin-bottom: 0.75rem; color: var(--color-accent-light);">
                  🤝 Collaboration Hub
                </h3>
                <p style="color: var(--color-text-secondary);">
                  Work together in real-time with AI-powered brainstorming and creative suggestions.
                </p>
              </div>
              <button class="btn btn-secondary mt-md" data-module="collaboration">Start Collaborating</button>
            </div>

            <div class="glass-card bento-item">
              <div>
                <h3 style="font-size: 1.25rem; margin-bottom: 0.75rem; color: var(--color-accent-light);">
                  ✨ AI Enhancement
                </h3>
                <p style="color: var(--color-text-secondary);">
                  Refine and improve your content with intelligent suggestions and enhancements.
                </p>
              </div>
            </div>

            <div class="glass-card bento-item">
              <div>
                <h3 style="font-size: 1.25rem; margin-bottom: 0.75rem; color: var(--color-accent-light);">
                  📤 Multi-format Export
                </h3>
                <p style="color: var(--color-text-secondary);">
                  Export your creations in various formats: stories, scripts, storyboards, and more.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Technology Stack Section -->
      <section class="section" style="background: var(--color-bg-secondary);">
        <div class="container">
          <h2 class="text-center mb-xl" style="font-family: var(--font-display); font-size: 2.5rem; color: var(--color-text-primary);">
            Built with Cutting-Edge Technology
          </h2>
          
          <div class="bento-grid">
            <div class="glass-card bento-item">
              <h4 style="color: var(--color-accent-light); margin-bottom: 0.5rem;">🤖 IBM watsonx.ai</h4>
              <p style="color: var(--color-text-secondary); font-size: 0.9rem;">
                Enterprise-grade AI platform powering all creative generation features
              </p>
            </div>
            
            <div class="glass-card bento-item">
              <h4 style="color: var(--color-accent-light); margin-bottom: 0.5rem;">🧠 Granite Models</h4>
              <p style="color: var(--color-text-secondary); font-size: 0.9rem;">
                IBM's advanced language models optimized for creative and technical tasks
              </p>
            </div>
            
            <div class="glass-card bento-item">
              <h4 style="color: var(--color-accent-light); margin-bottom: 0.5rem;">⚡ Built with IBM Bob</h4>
              <p style="color: var(--color-text-secondary); font-size: 0.9rem;">
                Developed entirely using IBM Bob for AI-assisted rapid prototyping
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Workspace Container (Hidden by default) -->
      <div id="workspace" style="display: none;"></div>

      <!-- Footer -->
      <footer style="padding: 2rem; text-align: center; color: var(--color-text-tertiary); border-top: 1px solid var(--color-surface);">
        <p>VividForge Studio - July 2026 AI Builders Challenge</p>
        <p style="margin-top: 0.5rem; font-size: 0.875rem;">
          Built with IBM Bob | Powered by IBM watsonx.ai & Granite | Created for Creative Industries
        </p>
      </footer>
    `;
  }

  setupEventListeners() {
    // Module navigation buttons
    document.querySelectorAll('[data-module]').forEach(button => {
      button.addEventListener('click', (e) => {
        const moduleName = e.currentTarget.dataset.module;
        this.loadModule(moduleName);
      });
    });
  }

  loadModule(moduleName) {
    console.log(`Loading module: ${moduleName}`);
    
    const workspace = document.getElementById('workspace');
    const hero = document.querySelector('.hero');
    const sections = document.querySelectorAll('.section');
    
    // Hide hero and feature sections
    hero.style.display = 'none';
    sections.forEach(section => section.style.display = 'none');
    
    // Show workspace
    workspace.style.display = 'block';
    workspace.innerHTML = '';
    
    // Add back button
    const backButton = document.createElement('button');
    backButton.className = 'btn btn-secondary';
    backButton.innerHTML = '← Back to Home';
    backButton.style.margin = '2rem';
    backButton.addEventListener('click', () => this.returnHome());
    workspace.appendChild(backButton);
    
    // Load the appropriate module
    const moduleContainer = document.createElement('div');
    moduleContainer.className = 'container';
    moduleContainer.style.paddingBottom = '4rem';
    workspace.appendChild(moduleContainer);
    
    switch(moduleName) {
      case 'concept':
        this.modules.concept.render(moduleContainer);
        break;
      case 'story':
        this.modules.story.render(moduleContainer);
        break;
      case 'visual':
        this.modules.visual.render(moduleContainer);
        break;
      case 'voice':
        this.modules.voice.render(moduleContainer);
        break;
      case 'video':
        this.modules.video.render(moduleContainer);
        break;
      case 'scene':
        this.modules.scene.render(moduleContainer);
        break;
      case 'collaboration':
        this.modules.collaboration.render(moduleContainer);
        break;
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  returnHome() {
    const workspace = document.getElementById('workspace');
    const hero = document.querySelector('.hero');
    const sections = document.querySelectorAll('.section');
    
    workspace.style.display = 'none';
    hero.style.display = 'flex';
    sections.forEach(section => section.style.display = 'block');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Initialize the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new VividForgeStudio());
} else {
  new VividForgeStudio();
}

// Made with Bob - VividForge Studio with Advanced Voice & Video Generation
