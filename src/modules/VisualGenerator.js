/**
 * Visual Generator Module
 * AI-powered visual concept and mood board creation
 */

export class VisualGenerator {
  constructor() {
    this.apiBase = '/api/visual';
    this.currentConcept = null;
  }

  render(container) {
    container.innerHTML = `
      <div class="glass-card" style="max-width: 1200px; margin: 2rem auto;">
        <h2 style="font-family: var(--font-display); font-size: 2rem; margin-bottom: 1.5rem; color: var(--color-accent-light);">
          🎨 Visual Concept Generator
        </h2>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
          <div>
            <div class="input-group">
              <label class="input-label">Visual Concept Description</label>
              <textarea 
                id="visual-prompt" 
                class="input-field" 
                placeholder="Describe your visual concept... (e.g., 'A futuristic cityscape at sunset with neon lights')"
                rows="4"
              ></textarea>
            </div>

            <div class="input-group">
              <label class="input-label">Visual Style</label>
              <select id="visual-style" class="select-field">
                <option value="cinematic">Cinematic</option>
                <option value="minimalist">Minimalist</option>
                <option value="surreal">Surreal</option>
                <option value="photorealistic">Photorealistic</option>
                <option value="abstract">Abstract</option>
                <option value="vintage">Vintage</option>
              </select>
            </div>

            <div class="input-group">
              <label class="input-label">Mood</label>
              <select id="visual-mood" class="select-field">
                <option value="dramatic">Dramatic</option>
                <option value="serene">Serene</option>
                <option value="mysterious">Mysterious</option>
                <option value="joyful">Joyful</option>
                <option value="melancholic">Melancholic</option>
                <option value="epic">Epic</option>
              </select>
            </div>

            <div class="input-group">
              <label class="input-label">Color Palette</label>
              <select id="visual-palette" class="select-field">
                <option value="vibrant">Vibrant</option>
                <option value="muted">Muted</option>
                <option value="monochrome">Monochrome</option>
                <option value="warm">Warm</option>
                <option value="cool">Cool</option>
                <option value="earth">Earth Tones</option>
              </select>
            </div>

            <button id="generate-visual-btn" class="btn btn-primary" style="width: 100%;">
              Generate Visual Concept
            </button>
          </div>

          <div>
            <div class="glass-card" style="background: var(--color-bg-secondary); padding: 1.5rem;">
              <h3 style="font-size: 1.25rem; margin-bottom: 1rem; color: var(--color-text-secondary);">
                🎭 Style Presets
              </h3>
              <div id="style-presets"></div>
            </div>
          </div>
        </div>

        <div id="visual-output" style="display: none;">
          <div style="border-top: 1px solid var(--color-surface); padding-top: 2rem; margin-top: 2rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <h3 style="font-size: 1.5rem; color: var(--color-accent-light);">Visual Concept</h3>
              <button id="export-visual-btn" class="btn btn-secondary">
                📤 Export Concept
              </button>
            </div>
            
            <div class="glass-card" style="background: var(--color-bg-secondary); padding: 2rem; margin-bottom: 1.5rem;">
              <h4 style="color: var(--color-text-secondary); margin-bottom: 1rem;">Description</h4>
              <p id="visual-description" style="line-height: 1.8; color: var(--color-text-primary);"></p>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
              <div class="glass-card" style="background: var(--color-bg-secondary); padding: 1.5rem;">
                <h4 style="color: var(--color-text-secondary); margin-bottom: 1rem;">Color Palette</h4>
                <div id="color-palette" style="display: flex; gap: 0.5rem; flex-wrap: wrap;"></div>
              </div>

              <div class="glass-card" style="background: var(--color-bg-secondary); padding: 1.5rem;">
                <h4 style="color: var(--color-text-secondary); margin-bottom: 1rem;">Composition</h4>
                <div id="composition-details"></div>
              </div>
            </div>

            <div class="glass-card" style="background: var(--color-bg-secondary); padding: 1.5rem; margin-top: 1.5rem;">
              <h4 style="color: var(--color-text-secondary); margin-bottom: 1rem;">Visual Elements</h4>
              <div id="visual-elements"></div>
            </div>

            <div class="glass-card" style="background: var(--color-bg-secondary); padding: 1.5rem; margin-top: 1.5rem;">
              <h4 style="color: var(--color-text-secondary); margin-bottom: 1rem;">Lighting</h4>
              <div id="lighting-details"></div>
            </div>
          </div>
        </div>

        <div id="loading" style="display: none; text-align: center; padding: 2rem;">
          <div class="spinner" style="width: 40px; height: 40px; margin: 0 auto 1rem;"></div>
          <p style="color: var(--color-text-secondary);">Generating visual concept...</p>
        </div>
      </div>
    `;

    this.setupEventListeners();
    this.loadStylePresets();
  }

  setupEventListeners() {
    const generateBtn = document.getElementById('generate-visual-btn');
    const exportBtn = document.getElementById('export-visual-btn');

    generateBtn?.addEventListener('click', () => this.generateVisual());
    exportBtn?.addEventListener('click', () => this.exportVisual());
  }

  async loadStylePresets() {
    try {
      const response = await fetch(`${this.apiBase}/styles`);
      const data = await response.json();
      
      const presetsContainer = document.getElementById('style-presets');
      if (presetsContainer && data.success) {
        presetsContainer.innerHTML = data.data.slice(0, 4).map(style => `
          <div class="glass-card" style="padding: 1rem; margin-bottom: 0.75rem; cursor: pointer; transition: all 0.2s;" 
               data-style="${style.id}"
               onmouseover="this.style.borderColor='var(--color-accent-light)'"
               onmouseout="this.style.borderColor='var(--glass-border)'">
            <h4 style="font-size: 1rem; color: var(--color-accent-light); margin-bottom: 0.25rem;">
              ${style.name}
            </h4>
            <p style="font-size: 0.875rem; color: var(--color-text-tertiary); margin-bottom: 0.5rem;">
              ${style.description}
            </p>
            <div style="font-size: 0.75rem; color: var(--color-text-tertiary);">
              ${style.characteristics.join(' • ')}
            </div>
          </div>
        `).join('');

        // Add click handlers
        presetsContainer.querySelectorAll('[data-style]').forEach(el => {
          el.addEventListener('click', (e) => {
            const styleId = e.currentTarget.dataset.style;
            document.getElementById('visual-style').value = styleId;
          });
        });
      }
    } catch (error) {
      console.error('Failed to load style presets:', error);
    }
  }

  async generateVisual() {
    const prompt = document.getElementById('visual-prompt').value.trim();
    const style = document.getElementById('visual-style').value;
    const mood = document.getElementById('visual-mood').value;
    const colorPalette = document.getElementById('visual-palette').value;

    if (!prompt) {
      alert('Please enter a visual concept description');
      return;
    }

    const loading = document.getElementById('loading');
    const output = document.getElementById('visual-output');
    
    loading.style.display = 'block';
    output.style.display = 'none';

    try {
      const response = await fetch(`${this.apiBase}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style, mood, colorPalette })
      });

      const data = await response.json();

      if (data.success) {
        this.currentConcept = data.data;
        this.displayVisual(data.data);
      } else {
        throw new Error(data.error || 'Failed to generate visual concept');
      }
    } catch (error) {
      console.error('Visual generation error:', error);
      alert('Failed to generate visual concept. Please try again.');
    } finally {
      loading.style.display = 'none';
    }
  }

  displayVisual(visualData) {
    const output = document.getElementById('visual-output');
    const description = document.getElementById('visual-description');
    const palette = document.getElementById('color-palette');
    const composition = document.getElementById('composition-details');
    const elements = document.getElementById('visual-elements');
    const lighting = document.getElementById('lighting-details');

    description.textContent = visualData.description;

    // Color palette
    palette.innerHTML = visualData.colorPalette.map(color => `
      <div style="position: relative; cursor: pointer;" title="${color}">
        <div style="width: 60px; height: 60px; background: ${color}; border-radius: var(--radius-md); border: 2px solid var(--glass-border);"></div>
        <div style="text-align: center; font-size: 0.75rem; color: var(--color-text-tertiary); margin-top: 0.25rem;">
          ${color}
        </div>
      </div>
    `).join('');

    // Composition
    composition.innerHTML = `
      <div style="color: var(--color-text-primary); line-height: 1.8;">
        <p><strong>Rule:</strong> ${visualData.composition.rule}</p>
        <p><strong>Focal Point:</strong> ${visualData.composition.focalPoint}</p>
        <p><strong>Balance:</strong> ${visualData.composition.balance}</p>
      </div>
    `;

    // Elements
    elements.innerHTML = visualData.elements.map(element => `
      <div style="padding: 0.75rem; background: var(--color-bg-primary); border-radius: var(--radius-md); margin-bottom: 0.5rem;">
        <strong style="color: var(--color-accent-light);">${element.type}:</strong>
        <span style="color: var(--color-text-primary);"> ${element.description}</span>
      </div>
    `).join('');

    // Lighting
    lighting.innerHTML = `
      <div style="color: var(--color-text-primary); line-height: 1.8;">
        <p><strong>Type:</strong> ${visualData.lighting.type}</p>
        <p><strong>Direction:</strong> ${visualData.lighting.direction}</p>
        <p><strong>Temperature:</strong> ${visualData.lighting.temperature}</p>
      </div>
    `;

    output.style.display = 'block';
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  exportVisual() {
    if (!this.currentConcept) return;

    const content = `# Visual Concept

## Description
${this.currentConcept.description}

## Color Palette
${this.currentConcept.colorPalette.map(color => `- ${color}`).join('\n')}

## Composition
- Rule: ${this.currentConcept.composition.rule}
- Focal Point: ${this.currentConcept.composition.focalPoint}
- Balance: ${this.currentConcept.composition.balance}

## Visual Elements
${this.currentConcept.elements.map(el => `- **${el.type}**: ${el.description}`).join('\n')}

## Lighting
- Type: ${this.currentConcept.lighting.type}
- Direction: ${this.currentConcept.lighting.direction}
- Temperature: ${this.currentConcept.lighting.temperature}

---

**Metadata:**
- Style: ${this.currentConcept.metadata.style}
- Mood: ${this.currentConcept.metadata.mood}
- Generated: ${new Date(this.currentConcept.metadata.generatedAt).toLocaleString()}

---

Generated by Lumina Studio
`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lumina-visual-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Made with Bob
