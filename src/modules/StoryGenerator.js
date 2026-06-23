/**
 * Story Generator Module
 * AI-powered story creation and enhancement
 */

export class StoryGenerator {
  constructor() {
    this.apiBase = '/api/story';
    this.currentStory = null;
  }

  render(container) {
    container.innerHTML = `
      <div class="glass-card" style="max-width: 1200px; margin: 2rem auto;">
        <h2 style="font-family: var(--font-display); font-size: 2rem; margin-bottom: 1.5rem; color: var(--color-accent-light);">
          📝 AI Story Architect
        </h2>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
          <div>
            <div class="input-group">
              <label class="input-label">Story Prompt</label>
              <textarea 
                id="story-prompt" 
                class="input-field" 
                placeholder="Describe your story idea... (e.g., 'A young inventor discovers a portal to another dimension')"
                rows="4"
              ></textarea>
            </div>

            <div class="input-group">
              <label class="input-label">Genre</label>
              <select id="story-genre" class="select-field">
                <option value="fantasy">Fantasy</option>
                <option value="scifi">Science Fiction</option>
                <option value="mystery">Mystery</option>
                <option value="romance">Romance</option>
                <option value="thriller">Thriller</option>
              </select>
            </div>

            <div class="input-group">
              <label class="input-label">Tone</label>
              <select id="story-tone" class="select-field">
                <option value="adventurous">Adventurous</option>
                <option value="dark">Dark</option>
                <option value="lighthearted">Lighthearted</option>
                <option value="dramatic">Dramatic</option>
                <option value="mysterious">Mysterious</option>
              </select>
            </div>

            <div class="input-group">
              <label class="input-label">Length</label>
              <select id="story-length" class="select-field">
                <option value="short">Short (100-200 words)</option>
                <option value="medium" selected>Medium (200-400 words)</option>
                <option value="long">Long (400-600 words)</option>
              </select>
            </div>

            <button id="generate-story-btn" class="btn btn-primary" style="width: 100%;">
              Generate Story
            </button>
          </div>

          <div>
            <div class="glass-card" style="background: var(--color-bg-secondary); padding: 1.5rem;">
              <h3 style="font-size: 1.25rem; margin-bottom: 1rem; color: var(--color-text-secondary);">
                💡 Story Templates
              </h3>
              <div id="story-templates"></div>
            </div>
          </div>
        </div>

        <div id="story-output" style="display: none;">
          <div style="border-top: 1px solid var(--color-surface); padding-top: 2rem; margin-top: 2rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <h3 style="font-size: 1.5rem; color: var(--color-accent-light);">Generated Story</h3>
              <div style="display: flex; gap: 0.5rem;">
                <button id="enhance-story-btn" class="btn btn-secondary">
                  ✨ Enhance
                </button>
                <button id="get-suggestions-btn" class="btn btn-secondary">
                  💡 Get Suggestions
                </button>
                <button id="export-story-btn" class="btn btn-secondary">
                  📤 Export
                </button>
              </div>
            </div>
            
            <div id="story-content" class="glass-card" style="background: var(--color-bg-secondary); padding: 2rem; line-height: 1.8; white-space: pre-wrap;">
            </div>

            <div id="story-metadata" style="margin-top: 1rem; padding: 1rem; background: var(--color-bg-secondary); border-radius: var(--radius-md); font-size: 0.875rem; color: var(--color-text-tertiary);">
            </div>

            <div id="story-suggestions" style="display: none; margin-top: 1.5rem;">
              <h4 style="color: var(--color-text-secondary); margin-bottom: 1rem;">AI Suggestions</h4>
              <div id="suggestions-list"></div>
            </div>
          </div>
        </div>

        <div id="loading" style="display: none; text-align: center; padding: 2rem;">
          <div class="spinner" style="width: 40px; height: 40px; margin: 0 auto 1rem;"></div>
          <p style="color: var(--color-text-secondary);">Generating your story...</p>
        </div>
      </div>
    `;

    this.setupEventListeners();
    this.loadTemplates();
  }

  setupEventListeners() {
    const generateBtn = document.getElementById('generate-story-btn');
    const enhanceBtn = document.getElementById('enhance-story-btn');
    const suggestionsBtn = document.getElementById('get-suggestions-btn');
    const exportBtn = document.getElementById('export-story-btn');

    generateBtn?.addEventListener('click', () => this.generateStory());
    enhanceBtn?.addEventListener('click', () => this.enhanceStory());
    suggestionsBtn?.addEventListener('click', () => this.getSuggestions());
    exportBtn?.addEventListener('click', () => this.exportStory());
  }

  async loadTemplates() {
    try {
      const response = await fetch(`${this.apiBase}/templates`);
      const data = await response.json();
      
      const templatesContainer = document.getElementById('story-templates');
      if (templatesContainer && data.success) {
        templatesContainer.innerHTML = data.data.map(template => `
          <div class="glass-card" style="padding: 1rem; margin-bottom: 0.75rem; cursor: pointer; transition: all 0.2s;" 
               data-template="${template.id}"
               onmouseover="this.style.borderColor='var(--color-accent-light)'"
               onmouseout="this.style.borderColor='var(--glass-border)'">
            <h4 style="font-size: 1rem; color: var(--color-accent-light); margin-bottom: 0.25rem;">
              ${template.name}
            </h4>
            <p style="font-size: 0.875rem; color: var(--color-text-tertiary);">
              ${template.description}
            </p>
          </div>
        `).join('');

        // Add click handlers to templates
        templatesContainer.querySelectorAll('[data-template]').forEach(el => {
          el.addEventListener('click', (e) => {
            const templateId = e.currentTarget.dataset.template;
            const template = data.data.find(t => t.id === templateId);
            if (template) {
              document.getElementById('story-genre').value = template.genre;
              document.getElementById('story-prompt').value = `Create a story following the ${template.name} structure`;
            }
          });
        });
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  }

  async generateStory() {
    const prompt = document.getElementById('story-prompt').value.trim();
    const genre = document.getElementById('story-genre').value;
    const tone = document.getElementById('story-tone').value;
    const length = document.getElementById('story-length').value;

    if (!prompt) {
      alert('Please enter a story prompt');
      return;
    }

    const loading = document.getElementById('loading');
    const output = document.getElementById('story-output');
    
    loading.style.display = 'block';
    output.style.display = 'none';

    try {
      const response = await fetch(`${this.apiBase}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, genre, tone, length })
      });

      const data = await response.json();

      if (data.success) {
        this.currentStory = data.data;
        this.displayStory(data.data);
      } else {
        throw new Error(data.error || 'Failed to generate story');
      }
    } catch (error) {
      console.error('Story generation error:', error);
      alert('Failed to generate story. Please try again.');
    } finally {
      loading.style.display = 'none';
    }
  }

  displayStory(storyData) {
    const output = document.getElementById('story-output');
    const content = document.getElementById('story-content');
    const metadata = document.getElementById('story-metadata');

    content.textContent = storyData.content;
    
    metadata.innerHTML = `
      <strong>Genre:</strong> ${storyData.metadata.genre} | 
      <strong>Tone:</strong> ${storyData.metadata.tone || 'N/A'} | 
      <strong>Word Count:</strong> ${storyData.metadata.wordCount} | 
      <strong>Generated:</strong> ${new Date(storyData.metadata.generatedAt).toLocaleString()}
    `;

    output.style.display = 'block';
    
    // Scroll to output
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async enhanceStory() {
    if (!this.currentStory) return;

    const loading = document.getElementById('loading');
    loading.style.display = 'block';

    try {
      const response = await fetch(`${this.apiBase}/enhance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: this.currentStory.content,
          enhancementType: 'general'
        })
      });

      const data = await response.json();

      if (data.success) {
        this.currentStory.content = data.data.improved;
        this.displayStory(this.currentStory);
      }
    } catch (error) {
      console.error('Enhancement error:', error);
      alert('Failed to enhance story. Please try again.');
    } finally {
      loading.style.display = 'none';
    }
  }

  async getSuggestions() {
    if (!this.currentStory) return;

    try {
      const response = await fetch(`${this.apiBase}/suggestions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          context: this.currentStory.content,
          count: 5
        })
      });

      const data = await response.json();

      if (data.success) {
        this.displaySuggestions(data.data);
      }
    } catch (error) {
      console.error('Suggestions error:', error);
      alert('Failed to get suggestions. Please try again.');
    }
  }

  displaySuggestions(suggestions) {
    const container = document.getElementById('story-suggestions');
    const list = document.getElementById('suggestions-list');

    list.innerHTML = suggestions.map(suggestion => `
      <div class="glass-card" style="padding: 1rem; margin-bottom: 0.75rem;">
        <div style="display: flex; justify-content: space-between; align-items: start;">
          <p style="color: var(--color-text-primary); flex: 1;">${suggestion.text}</p>
          <span style="background: var(--color-accent-glow); color: var(--color-accent-light); padding: 0.25rem 0.5rem; border-radius: var(--radius-sm); font-size: 0.75rem; margin-left: 1rem;">
            ${suggestion.type}
          </span>
        </div>
      </div>
    `).join('');

    container.style.display = 'block';
  }

  exportStory() {
    if (!this.currentStory) return;

    const content = `# Generated Story

${this.currentStory.content}

---

**Metadata:**
- Genre: ${this.currentStory.metadata.genre}
- Word Count: ${this.currentStory.metadata.wordCount}
- Generated: ${new Date(this.currentStory.metadata.generatedAt).toLocaleString()}

---

Generated by Lumina Studio
`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lumina-story-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Made with Bob
