import './styles/main.css';
import { StoryGenerator } from './modules/StoryGenerator.js';
import { VisualGenerator } from './modules/VisualGenerator.js';
import { SceneBuilder } from './modules/SceneBuilder.js';
import { CollaborationHub } from './modules/CollaborationHub.js';
import { UIManager } from './modules/UIManager.js';

/**
 * Lumina Studio - Main Application Entry Point
 * AI-powered multimodal creative platform
 */

class LuminaStudio {
  constructor() {
    this.modules = {
      story: new StoryGenerator(),
      visual: new VisualGenerator(),
      scene: new SceneBuilder(),
      collaboration: new CollaborationHub(),
      ui: new UIManager()
    };
    
    this.currentModule = null;
    this.init();
  }

  async init() {
    console.log('🎨 Initializing Lumina Studio...');
    
    // Check API health
    await this.checkAPIHealth();
    
    // Render the application
    this.render();
    
    // Set up event listeners
    this.setupEventListeners();
    
    console.log('✨ Lumina Studio ready!');
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
          <h1 class="hero-title">Lumina Studio</h1>
          <p class="hero-subtitle">Where Ideas Illuminate Reality</p>
          <p class="hero-description">
            AI-powered multimodal creative platform for storytelling, design, and interactive experiences.
            Transform your imagination into immersive narratives with the power of artificial intelligence.
          </p>
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <button class="btn btn-primary" data-module="story">
              <span>📝</span> Story Architect
            </button>
            <button class="btn btn-primary" data-module="visual">
              <span>🎨</span> Visual Concepts
            </button>
            <button class="btn btn-primary" data-module="scene">
              <span>🎬</span> Scene Builder
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
            Creative Tools Powered by AI
          </h2>
          
          <div class="bento-grid">
            <div class="glass-card bento-item featured">
              <div>
                <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: var(--color-accent-light);">
                  🎭 AI Story Architect
                </h3>
                <p style="color: var(--color-text-secondary); line-height: 1.8;">
                  Generate compelling narratives with branching storylines. Choose from multiple genres,
                  tones, and styles. Let AI help you craft stories that captivate and inspire.
                </p>
              </div>
              <button class="btn btn-secondary mt-md" data-module="story">Explore Stories</button>
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
              <h4 style="color: var(--color-accent-light); margin-bottom: 0.5rem;">🤖 IBM Bob</h4>
              <p style="color: var(--color-text-secondary); font-size: 0.9rem;">
                Primary development tool for AI-assisted coding and rapid prototyping
              </p>
            </div>
            
            <div class="glass-card bento-item">
              <h4 style="color: var(--color-accent-light); margin-bottom: 0.5rem;">🧠 AI Models</h4>
              <p style="color: var(--color-text-secondary); font-size: 0.9rem;">
                Powered by IBM watsonx and compatible with multiple AI providers
              </p>
            </div>
            
            <div class="glass-card bento-item">
              <h4 style="color: var(--color-accent-light); margin-bottom: 0.5rem;">⚡ Modern Stack</h4>
              <p style="color: var(--color-text-secondary); font-size: 0.9rem;">
                Built with Node.js, Express, and Vite for optimal performance
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Workspace Container (Hidden by default) -->
      <div id="workspace" style="display: none;"></div>

      <!-- Footer -->
      <footer style="padding: 2rem; text-align: center; color: var(--color-text-tertiary); border-top: 1px solid var(--color-surface);">
        <p>Lumina Studio - July 2024 AI Builders Challenge</p>
        <p style="margin-top: 0.5rem; font-size: 0.875rem;">
          Built with IBM Bob | Powered by AI | Created for Creative Industries
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
      case 'story':
        this.modules.story.render(moduleContainer);
        break;
      case 'visual':
        this.modules.visual.render(moduleContainer);
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
  document.addEventListener('DOMContentLoaded', () => new LuminaStudio());
} else {
  new LuminaStudio();
}

// Made with Bob
