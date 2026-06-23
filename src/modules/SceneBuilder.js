/**
 * Scene Builder Module
 * Interactive scene creation with AI assistance
 */

export class SceneBuilder {
  constructor() {
    this.apiBase = '/api/scene';
    this.currentScene = null;
  }

  render(container) {
    container.innerHTML = `
      <div class="glass-card" style="max-width: 1200px; margin: 2rem auto;">
        <h2 style="font-family: var(--font-display); font-size: 2rem; margin-bottom: 1.5rem; color: var(--color-accent-light);">
          🎬 Interactive Scene Builder
        </h2>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
          <div>
            <div class="input-group">
              <label class="input-label">Scene Description</label>
              <textarea 
                id="scene-prompt" 
                class="input-field" 
                placeholder="Describe your scene... (e.g., 'A tense negotiation in a dimly lit warehouse')"
                rows="4"
              ></textarea>
            </div>

            <div class="input-group">
              <label class="input-label">Scene Type</label>
              <select id="scene-type" class="select-field">
                <option value="interactive">Interactive</option>
                <option value="dialogue">Dialogue</option>
                <option value="exploration">Exploration</option>
                <option value="action">Action</option>
                <option value="puzzle">Puzzle</option>
              </select>
            </div>

            <div class="input-group">
              <label class="input-label">Complexity</label>
              <select id="scene-complexity" class="select-field">
                <option value="simple">Simple</option>
                <option value="medium" selected>Medium</option>
                <option value="complex">Complex</option>
              </select>
            </div>

            <div class="input-group">
              <label class="input-label">Interactivity Level</label>
              <select id="scene-interactivity" class="select-field">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high" selected>High</option>
              </select>
            </div>

            <button id="generate-scene-btn" class="btn btn-primary" style="width: 100%;">
              Generate Scene
            </button>
          </div>

          <div>
            <div class="glass-card" style="background: var(--color-bg-secondary); padding: 1.5rem;">
              <h3 style="font-size: 1.25rem; margin-bottom: 1rem; color: var(--color-text-secondary);">
                🎭 Scene Templates
              </h3>
              <div id="scene-templates"></div>
            </div>
          </div>
        </div>

        <div id="scene-output" style="display: none;">
          <div style="border-top: 1px solid var(--color-surface); padding-top: 2rem; margin-top: 2rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <h3 style="font-size: 1.5rem; color: var(--color-accent-light);" id="scene-title"></h3>
              <button id="export-scene-btn" class="btn btn-secondary">
                📤 Export Scene
              </button>
            </div>
            
            <div class="glass-card" style="background: var(--color-bg-secondary); padding: 2rem; margin-bottom: 1.5rem;">
              <p id="scene-description" style="line-height: 1.8; color: var(--color-text-primary);"></p>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
              <div class="glass-card" style="background: var(--color-bg-secondary); padding: 1.5rem;">
                <h4 style="color: var(--color-text-secondary); margin-bottom: 1rem;">Scene Elements</h4>
                <div id="scene-elements"></div>
              </div>

              <div class="glass-card" style="background: var(--color-bg-secondary); padding: 1.5rem;">
                <h4 style="color: var(--color-text-secondary); margin-bottom: 1rem;">Interactivity</h4>
                <div id="scene-interactivity-details"></div>
              </div>
            </div>

            <div class="glass-card" style="background: var(--color-bg-secondary); padding: 1.5rem;">
              <h4 style="color: var(--color-text-secondary); margin-bottom: 1rem;">Story Branches</h4>
              <div id="scene-branches"></div>
            </div>
          </div>
        </div>

        <div id="loading" style="display: none; text-align: center; padding: 2rem;">
          <div class="spinner" style="width: 40px; height: 40px; margin: 0 auto 1rem;"></div>
          <p style="color: var(--color-text-secondary);">Building your scene...</p>
        </div>
      </div>
    `;

    this.setupEventListeners();
    this.loadTemplates();
  }

  setupEventListeners() {
    const generateBtn = document.getElementById('generate-scene-btn');
    const exportBtn = document.getElementById('export-scene-btn');

    generateBtn?.addEventListener('click', () => this.generateScene());
    exportBtn?.addEventListener('click', () => this.exportScene());
  }

  async loadTemplates() {
    try {
      const response = await fetch(`${this.apiBase}/templates`);
      const data = await response.json();
      
      const templatesContainer = document.getElementById('scene-templates');
      if (templatesContainer && data.success) {
        templatesContainer.innerHTML = data.data.map(template => `
          <div class="glass-card" style="padding: 1rem; margin-bottom: 0.75rem; cursor: pointer; transition: all 0.2s;" 
               data-template="${template.id}"
               onmouseover="this.style.borderColor='var(--color-accent-light)'"
               onmouseout="this.style.borderColor='var(--glass-border)'">
            <h4 style="font-size: 1rem; color: var(--color-accent-light); margin-bottom: 0.25rem;">
              ${template.name}
            </h4>
            <p style="font-size: 0.875rem; color: var(--color-text-tertiary); margin-bottom: 0.5rem;">
              ${template.description}
            </p>
            <div style="font-size: 0.75rem; color: var(--color-text-tertiary);">
              Elements: ${template.elements.join(', ')}
            </div>
          </div>
        `).join('');

        // Add click handlers
        templatesContainer.querySelectorAll('[data-template]').forEach(el => {
          el.addEventListener('click', (e) => {
            const templateId = e.currentTarget.dataset.template;
            const template = data.data.find(t => t.id === templateId);
            if (template) {
              document.getElementById('scene-type').value = templateId.replace('-scene', '');
              document.getElementById('scene-prompt').value = `Create a ${template.name.toLowerCase()}`;
            }
          });
        });
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  }

  async generateScene() {
    const prompt = document.getElementById('scene-prompt').value.trim();
    const sceneType = document.getElementById('scene-type').value;
    const complexity = document.getElementById('scene-complexity').value;
    const interactivity = document.getElementById('scene-interactivity').value;

    if (!prompt) {
      alert('Please enter a scene description');
      return;
    }

    const loading = document.getElementById('loading');
    const output = document.getElementById('scene-output');
    
    loading.style.display = 'block';
    output.style.display = 'none';

    try {
      const response = await fetch(`${this.apiBase}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, sceneType, complexity, interactivity })
      });

      const data = await response.json();

      if (data.success) {
        this.currentScene = data.data;
        this.displayScene(data.data);
      } else {
        throw new Error(data.error || 'Failed to generate scene');
      }
    } catch (error) {
      console.error('Scene generation error:', error);
      alert('Failed to generate scene. Please try again.');
    } finally {
      loading.style.display = 'none';
    }
  }

  displayScene(sceneData) {
    const output = document.getElementById('scene-output');
    const title = document.getElementById('scene-title');
    const description = document.getElementById('scene-description');
    const elements = document.getElementById('scene-elements');
    const interactivity = document.getElementById('scene-interactivity-details');
    const branches = document.getElementById('scene-branches');

    title.textContent = sceneData.title;
    description.textContent = sceneData.description;

    // Elements
    elements.innerHTML = sceneData.elements.map(element => `
      <div style="padding: 1rem; background: var(--color-bg-primary); border-radius: var(--radius-md); margin-bottom: 0.75rem; border-left: 3px solid var(--color-accent-light);">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
          <strong style="color: var(--color-accent-light);">${element.name}</strong>
          <span style="background: var(--color-surface); padding: 0.25rem 0.5rem; border-radius: var(--radius-sm); font-size: 0.75rem; color: var(--color-text-tertiary);">
            ${element.type}
          </span>
        </div>
        <p style="color: var(--color-text-secondary); font-size: 0.875rem; margin-bottom: 0.5rem;">
          ${element.description}
        </p>
        <div style="font-size: 0.75rem; color: var(--color-text-tertiary);">
          Interactions: ${element.interactions.join(', ')}
        </div>
      </div>
    `).join('');

    // Interactivity
    interactivity.innerHTML = `
      <div style="color: var(--color-text-primary); line-height: 1.8;">
        <p><strong>Level:</strong> ${sceneData.interactivity.level}</p>
        <p><strong>Types:</strong> ${sceneData.interactivity.types.join(', ')}</p>
        <p><strong>Feedback:</strong> ${sceneData.interactivity.feedback}</p>
      </div>
    `;

    // Branches
    branches.innerHTML = sceneData.branches.map((branch, index) => `
      <div style="padding: 1rem; background: var(--color-bg-primary); border-radius: var(--radius-md); margin-bottom: 0.75rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
          <span style="background: var(--color-accent-glow); color: var(--color-accent-light); padding: 0.25rem 0.5rem; border-radius: var(--radius-sm); font-size: 0.75rem; font-weight: 600;">
            Branch ${index + 1}
          </span>
        </div>
        <p style="color: var(--color-text-secondary); margin-bottom: 0.5rem;">
          <strong>Condition:</strong> ${branch.condition}
        </p>
        <p style="color: var(--color-text-secondary); margin-bottom: 0.5rem;">
          <strong>Outcome:</strong> ${branch.outcome}
        </p>
        <p style="color: var(--color-text-tertiary); font-size: 0.875rem;">
          <strong>Next:</strong> ${branch.nextScene}
        </p>
      </div>
    `).join('');

    output.style.display = 'block';
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  exportScene() {
    if (!this.currentScene) return;

    const content = `# ${this.currentScene.title}

## Description
${this.currentScene.description}

## Scene Elements
${this.currentScene.elements.map(el => `
### ${el.name} (${el.type})
${el.description}

**Interactions:** ${el.interactions.join(', ')}
`).join('\n')}

## Interactivity
- Level: ${this.currentScene.interactivity.level}
- Types: ${this.currentScene.interactivity.types.join(', ')}
- Feedback: ${this.currentScene.interactivity.feedback}

## Story Branches
${this.currentScene.branches.map((branch, i) => `
### Branch ${i + 1}
- **Condition:** ${branch.condition}
- **Outcome:** ${branch.outcome}
- **Next Scene:** ${branch.nextScene}
`).join('\n')}

---

**Metadata:**
- Complexity: ${this.currentScene.metadata.complexity}
- Estimated Duration: ${this.currentScene.metadata.estimatedDuration}
- Generated: ${new Date(this.currentScene.metadata.generatedAt).toLocaleString()}

---

Generated by Lumina Studio
`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lumina-scene-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Made with Bob
