/**
 * Concept Generator Module
 * Advanced creative concept generation powered by IBM watsonx.ai
 * Integrated from VividForge's sophisticated concept generation system
 */

export class ConceptGenerator {
  constructor() {
    this.apiBase = '/api';
    this.currentConcept = null;
  }

  render(container) {
    container.innerHTML = `
      <div class="module-container">
        <div class="module-header">
          <h1 class="module-title">🎨 Creative Concept Generator</h1>
          <p class="module-description">
            Transform your creative ideas into detailed, actionable concepts with AI-powered insights.
            Generate comprehensive visual concepts, color palettes, composition guidelines, and image prompts.
          </p>
        </div>

        <div class="glass-card">
          <h2 style="margin-bottom: 1.5rem; color: var(--color-accent-light);">Generate New Concept</h2>
          
          <div class="form-group">
            <label for="concept-input">Describe Your Creative Vision</label>
            <textarea 
              id="concept-input" 
              class="input-field" 
              rows="4"
              placeholder="Example: A futuristic cityscape at sunset with neon lights reflecting on wet streets, cyberpunk aesthetic with warm color tones..."
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="concept-style">Visual Style</label>
              <select id="concept-style" class="input-field">
                <option value="">Select style...</option>
                <option value="cinematic">Cinematic</option>
                <option value="minimalist">Minimalist</option>
                <option value="surreal">Surreal</option>
                <option value="photorealistic">Photorealistic</option>
                <option value="abstract">Abstract</option>
                <option value="vintage">Vintage</option>
                <option value="modern">Modern</option>
                <option value="fantasy">Fantasy</option>
              </select>
            </div>

            <div class="form-group">
              <label for="concept-mood">Mood</label>
              <select id="concept-mood" class="input-field">
                <option value="">Select mood...</option>
                <option value="dramatic">Dramatic</option>
                <option value="serene">Serene</option>
                <option value="energetic">Energetic</option>
                <option value="mysterious">Mysterious</option>
                <option value="uplifting">Uplifting</option>
                <option value="melancholic">Melancholic</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="concept-context">Additional Context (Optional)</label>
            <textarea 
              id="concept-context" 
              class="input-field" 
              rows="2"
              placeholder="Any specific requirements, target audience, or technical constraints..."
            ></textarea>
          </div>

          <div class="button-group">
            <button id="generate-concept-btn" class="btn btn-primary">
              <span>✨</span> Generate Concept
            </button>
          </div>
        </div>

        <div id="concept-result" style="display: none;">
          <div class="glass-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
              <h2 style="color: var(--color-accent-light); margin: 0;">Generated Concept</h2>
              <div class="button-group" style="margin: 0;">
                <button id="export-concept-btn" class="btn btn-secondary">
                  <span>📥</span> Export
                </button>
                <button id="iterate-concept-btn" class="btn btn-secondary">
                  <span>🔄</span> Refine
                </button>
              </div>
            </div>

            <div id="concept-content"></div>
          </div>
        </div>

        <div id="loading-indicator" style="display: none;">
          <div class="glass-card text-center">
            <div class="spinner"></div>
            <p style="margin-top: 1rem; color: var(--color-text-secondary);">
              Generating your creative concept with IBM Granite AI...
            </p>
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    const generateBtn = document.getElementById('generate-concept-btn');
    const exportBtn = document.getElementById('export-concept-btn');
    const iterateBtn = document.getElementById('iterate-concept-btn');

    if (generateBtn) {
      generateBtn.addEventListener('click', () => this.generateConcept());
    }

    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportConcept());
    }

    if (iterateBtn) {
      iterateBtn.addEventListener('click', () => this.showIterationDialog());
    }
  }

  async generateConcept() {
    const input = document.getElementById('concept-input').value.trim();
    const style = document.getElementById('concept-style').value;
    const mood = document.getElementById('concept-mood').value;
    const context = document.getElementById('concept-context').value.trim();

    if (!input) {
      alert('Please describe your creative vision');
      return;
    }

    const loadingIndicator = document.getElementById('loading-indicator');
    const resultContainer = document.getElementById('concept-result');
    
    loadingIndicator.style.display = 'block';
    resultContainer.style.display = 'none';

    try {
      const stylePreferences = [];
      if (style) stylePreferences.push(style);
      if (mood) stylePreferences.push(mood);

      const response = await fetch(`${this.apiBase}/visual/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: input,
          style: style || 'cinematic',
          mood: mood || 'dramatic',
          colorPalette: 'vibrant',
          composition: 'balanced',
          stylePreferences,
          additionalContext: context
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate concept');
      }

      const data = await response.json();
      this.currentConcept = data;
      this.displayConcept(data);

      loadingIndicator.style.display = 'none';
      resultContainer.style.display = 'block';
      
      // Scroll to results
      resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
      console.error('Error generating concept:', error);
      loadingIndicator.style.display = 'none';
      alert('Failed to generate concept. Please try again.');
    }
  }

  displayConcept(concept) {
    const contentDiv = document.getElementById('concept-content');
    
    let html = `
      <div class="concept-display">
        ${concept.title ? `<h3 style="color: var(--color-accent-light); margin-bottom: 1rem;">${concept.title}</h3>` : ''}
        
        <div class="concept-section">
          <h4>📝 Core Description</h4>
          <p>${concept.description || concept.coreDescription || 'No description available'}</p>
        </div>

        ${concept.visualStyle ? `
          <div class="concept-section">
            <h4>🎨 Visual Style</h4>
            <p>${concept.visualStyle}</p>
          </div>
        ` : ''}

        ${concept.mood ? `
          <div class="concept-section">
            <h4>🌟 Mood & Atmosphere</h4>
            <p>${concept.mood}</p>
          </div>
        ` : ''}

        ${concept.colorPalette && concept.colorPalette.length > 0 ? `
          <div class="concept-section">
            <h4>🎨 Color Palette</h4>
            <div class="color-palette">
              ${concept.colorPalette.map(color => `
                <div class="color-swatch" style="background-color: ${color};" title="${color}">
                  <span class="color-hex">${color}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${concept.composition ? `
          <div class="concept-section">
            <h4>📐 Composition Guidelines</h4>
            <div class="composition-details">
              ${concept.composition.rule ? `<p><strong>Rule:</strong> ${concept.composition.rule}</p>` : ''}
              ${concept.composition.focalPoint ? `<p><strong>Focal Point:</strong> ${concept.composition.focalPoint}</p>` : ''}
              ${concept.composition.balance ? `<p><strong>Balance:</strong> ${concept.composition.balance}</p>` : ''}
            </div>
          </div>
        ` : ''}

        ${concept.lighting ? `
          <div class="concept-section">
            <h4>💡 Lighting</h4>
            <div class="lighting-details">
              ${concept.lighting.type ? `<p><strong>Type:</strong> ${concept.lighting.type}</p>` : ''}
              ${concept.lighting.direction ? `<p><strong>Direction:</strong> ${concept.lighting.direction}</p>` : ''}
              ${concept.lighting.temperature ? `<p><strong>Temperature:</strong> ${concept.lighting.temperature}</p>` : ''}
            </div>
          </div>
        ` : ''}

        ${concept.elements && concept.elements.length > 0 ? `
          <div class="concept-section">
            <h4>🎬 Visual Elements</h4>
            <div class="elements-list">
              ${concept.elements.map(element => `
                <div class="element-item">
                  <strong>${element.type}:</strong> ${element.description}
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${concept.imagePrompts && concept.imagePrompts.length > 0 ? `
          <div class="concept-section">
            <h4>🖼️ AI Image Generation Prompts</h4>
            ${concept.imagePrompts.map((prompt, index) => `
              <div class="prompt-card">
                <p><strong>Prompt ${index + 1}:</strong></p>
                <p class="prompt-text">${prompt.prompt || prompt}</p>
                ${prompt.style ? `<p class="prompt-meta"><strong>Style:</strong> ${prompt.style}</p>` : ''}
                ${prompt.aspectRatio ? `<p class="prompt-meta"><strong>Aspect Ratio:</strong> ${prompt.aspectRatio}</p>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${concept.technicalNotes && concept.technicalNotes.length > 0 ? `
          <div class="concept-section">
            <h4>⚙️ Technical Notes</h4>
            <ul>
              ${concept.technicalNotes.map(note => `<li>${note}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${concept.inspirationReferences && concept.inspirationReferences.length > 0 ? `
          <div class="concept-section">
            <h4>💫 Inspiration References</h4>
            <div class="references-list">
              ${concept.inspirationReferences.map(ref => `
                <div class="reference-item">
                  <strong>${ref.title}:</strong> ${ref.description}
                  ${ref.type ? `<span class="reference-type">(${ref.type})</span>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${concept.metadata ? `
          <div class="concept-section" style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--color-surface);">
            <p style="font-size: 0.875rem; color: var(--color-text-tertiary);">
              Generated with ${concept.metadata.model || 'AI'} at ${new Date(concept.metadata.generatedAt).toLocaleString()}
            </p>
          </div>
        ` : ''}
      </div>
    `;

    contentDiv.innerHTML = html;
  }

  showIterationDialog() {
    const feedback = prompt('How would you like to refine this concept?\n\nDescribe the changes you want to make:');
    
    if (feedback && feedback.trim()) {
      this.iterateConcept(feedback.trim());
    }
  }

  async iterateConcept(feedback) {
    if (!this.currentConcept) {
      alert('No concept to iterate on');
      return;
    }

    const loadingIndicator = document.getElementById('loading-indicator');
    loadingIndicator.style.display = 'block';

    try {
      // For now, regenerate with the feedback as additional context
      const originalInput = document.getElementById('concept-input').value;
      const style = document.getElementById('concept-style').value;
      const mood = document.getElementById('concept-mood').value;

      const response = await fetch(`${this.apiBase}/visual/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: originalInput,
          style: style || 'cinematic',
          mood: mood || 'dramatic',
          colorPalette: 'vibrant',
          composition: 'balanced',
          additionalContext: `Previous concept feedback: ${feedback}`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to iterate concept');
      }

      const data = await response.json();
      this.currentConcept = data;
      this.displayConcept(data);

      loadingIndicator.style.display = 'none';
    } catch (error) {
      console.error('Error iterating concept:', error);
      loadingIndicator.style.display = 'none';
      alert('Failed to refine concept. Please try again.');
    }
  }

  exportConcept() {
    if (!this.currentConcept) {
      alert('No concept to export');
      return;
    }

    const exportData = JSON.stringify(this.currentConcept, null, 2);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `concept-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Made with Bob - VividForge Concept Generation Integration