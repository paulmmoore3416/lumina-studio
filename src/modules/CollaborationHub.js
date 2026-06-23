/**
 * Collaboration Hub Module
 * Real-time collaboration and AI-powered brainstorming
 */

export class CollaborationHub {
  constructor() {
    this.apiBase = '/api/collaboration';
    this.currentSession = null;
  }

  render(container) {
    container.innerHTML = `
      <div class="glass-card" style="max-width: 1200px; margin: 2rem auto;">
        <h2 style="font-family: var(--font-display); font-size: 2rem; margin-bottom: 1.5rem; color: var(--color-accent-light);">
          🤝 Collaboration Hub
        </h2>
        
        <div id="session-setup" style="display: block;">
          <div style="max-width: 600px; margin: 0 auto;">
            <div class="glass-card" style="background: var(--color-bg-secondary); padding: 2rem; text-align: center;">
              <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: var(--color-text-primary);">
                Start a Collaboration Session
              </h3>
              <p style="color: var(--color-text-secondary); margin-bottom: 2rem;">
                Create a shared workspace for real-time creative collaboration with AI assistance
              </p>

              <div class="input-group" style="text-align: left;">
                <label class="input-label">Project Name</label>
                <input 
                  type="text" 
                  id="project-name" 
                  class="input-field" 
                  placeholder="Enter your project name"
                />
              </div>

              <div class="input-group" style="text-align: left;">
                <label class="input-label">Your Name</label>
                <input 
                  type="text" 
                  id="creator-name" 
                  class="input-field" 
                  placeholder="Enter your name"
                />
              </div>

              <button id="create-session-btn" class="btn btn-primary" style="width: 100%;">
                Create Session
              </button>

              <div style="margin: 2rem 0; color: var(--color-text-tertiary); font-size: 0.875rem;">
                — or —
              </div>

              <button id="view-sessions-btn" class="btn btn-secondary" style="width: 100%;">
                View Active Sessions
              </button>
            </div>
          </div>
        </div>

        <div id="session-workspace" style="display: none;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid var(--color-surface);">
            <div>
              <h3 id="session-project-name" style="font-size: 1.5rem; color: var(--color-accent-light); margin-bottom: 0.5rem;"></h3>
              <p id="session-info" style="color: var(--color-text-tertiary); font-size: 0.875rem;"></p>
            </div>
            <button id="leave-session-btn" class="btn btn-secondary">
              ← Leave Session
            </button>
          </div>

          <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
            <div>
              <div class="glass-card" style="background: var(--color-bg-secondary); padding: 1.5rem; margin-bottom: 1.5rem;">
                <h4 style="color: var(--color-text-secondary); margin-bottom: 1rem;">Collaborative Content</h4>
                <textarea 
                  id="collab-content" 
                  class="input-field" 
                  placeholder="Start writing together..."
                  rows="10"
                  style="font-family: 'Courier New', monospace;"
                ></textarea>
                <button id="save-content-btn" class="btn btn-primary mt-md" style="width: 100%;">
                  💾 Save Changes
                </button>
              </div>

              <div class="glass-card" style="background: var(--color-bg-secondary); padding: 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                  <h4 style="color: var(--color-text-secondary);">AI Brainstorming</h4>
                  <button id="brainstorm-btn" class="btn btn-secondary">
                    🧠 Get Ideas
                  </button>
                </div>
                <div id="brainstorm-results"></div>
              </div>
            </div>

            <div>
              <div class="glass-card" style="background: var(--color-bg-secondary); padding: 1.5rem; margin-bottom: 1.5rem;">
                <h4 style="color: var(--color-text-secondary); margin-bottom: 1rem;">Participants</h4>
                <div id="participants-list"></div>
              </div>

              <div class="glass-card" style="background: var(--color-bg-secondary); padding: 1.5rem;">
                <h4 style="color: var(--color-text-secondary); margin-bottom: 1rem;">Activity Log</h4>
                <div id="activity-log" style="max-height: 300px; overflow-y: auto;"></div>
              </div>
            </div>
          </div>
        </div>

        <div id="sessions-list" style="display: none;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <h3 style="font-size: 1.5rem; color: var(--color-accent-light);">Active Sessions</h3>
            <button id="back-to-setup-btn" class="btn btn-secondary">
              ← Back
            </button>
          </div>
          <div id="sessions-container"></div>
        </div>

        <div id="loading" style="display: none; text-align: center; padding: 2rem;">
          <div class="spinner" style="width: 40px; height: 40px; margin: 0 auto 1rem;"></div>
          <p style="color: var(--color-text-secondary);">Loading...</p>
        </div>
      </div>
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    const createBtn = document.getElementById('create-session-btn');
    const viewSessionsBtn = document.getElementById('view-sessions-btn');
    const leaveBtn = document.getElementById('leave-session-btn');
    const saveBtn = document.getElementById('save-content-btn');
    const brainstormBtn = document.getElementById('brainstorm-btn');
    const backBtn = document.getElementById('back-to-setup-btn');

    createBtn?.addEventListener('click', () => this.createSession());
    viewSessionsBtn?.addEventListener('click', () => this.viewSessions());
    leaveBtn?.addEventListener('click', () => this.leaveSession());
    saveBtn?.addEventListener('click', () => this.saveContent());
    brainstormBtn?.addEventListener('click', () => this.brainstorm());
    backBtn?.addEventListener('click', () => this.showSetup());
  }

  async createSession() {
    const projectName = document.getElementById('project-name').value.trim();
    const creatorName = document.getElementById('creator-name').value.trim();

    if (!projectName) {
      alert('Please enter a project name');
      return;
    }

    const loading = document.getElementById('loading');
    loading.style.display = 'block';

    try {
      const response = await fetch(`${this.apiBase}/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectName, creatorName: creatorName || 'Anonymous' })
      });

      const data = await response.json();

      if (data.success) {
        this.currentSession = data.data;
        this.showWorkspace();
      } else {
        throw new Error(data.error || 'Failed to create session');
      }
    } catch (error) {
      console.error('Session creation error:', error);
      alert('Failed to create session. Please try again.');
    } finally {
      loading.style.display = 'none';
    }
  }

  async viewSessions() {
    const loading = document.getElementById('loading');
    loading.style.display = 'block';

    try {
      const response = await fetch(`${this.apiBase}/sessions`);
      const data = await response.json();

      if (data.success) {
        this.displaySessions(data.data);
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
      alert('Failed to load sessions. Please try again.');
    } finally {
      loading.style.display = 'none';
    }
  }

  displaySessions(sessions) {
    const setup = document.getElementById('session-setup');
    const list = document.getElementById('sessions-list');
    const container = document.getElementById('sessions-container');

    setup.style.display = 'none';
    list.style.display = 'block';

    if (sessions.length === 0) {
      container.innerHTML = `
        <div class="glass-card" style="padding: 2rem; text-align: center;">
          <p style="color: var(--color-text-secondary);">No active sessions found</p>
        </div>
      `;
      return;
    }

    container.innerHTML = sessions.map(session => `
      <div class="glass-card" style="padding: 1.5rem; margin-bottom: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: start;">
          <div>
            <h4 style="font-size: 1.25rem; color: var(--color-accent-light); margin-bottom: 0.5rem;">
              ${session.projectName}
            </h4>
            <p style="color: var(--color-text-secondary); font-size: 0.875rem;">
              Created by ${session.creatorName} • ${session.participantCount} participant(s)
            </p>
            <p style="color: var(--color-text-tertiary); font-size: 0.75rem; margin-top: 0.25rem;">
              ${new Date(session.createdAt).toLocaleString()}
            </p>
          </div>
          <button class="btn btn-secondary" onclick="alert('Join functionality would be implemented here')">
            Join Session
          </button>
        </div>
      </div>
    `).join('');
  }

  showSetup() {
    document.getElementById('session-setup').style.display = 'block';
    document.getElementById('session-workspace').style.display = 'none';
    document.getElementById('sessions-list').style.display = 'none';
  }

  showWorkspace() {
    const setup = document.getElementById('session-setup');
    const workspace = document.getElementById('session-workspace');
    const projectName = document.getElementById('session-project-name');
    const sessionInfo = document.getElementById('session-info');

    setup.style.display = 'none';
    workspace.style.display = 'block';

    projectName.textContent = this.currentSession.projectName;
    sessionInfo.textContent = `Session ID: ${this.currentSession.id} • Created ${new Date(this.currentSession.createdAt).toLocaleString()}`;

    this.updateParticipants();
    this.updateActivityLog();
  }

  updateParticipants() {
    const list = document.getElementById('participants-list');
    if (!this.currentSession) return;

    list.innerHTML = this.currentSession.participants.map(participant => `
      <div style="padding: 0.75rem; background: var(--color-bg-primary); border-radius: var(--radius-md); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
        <div style="width: 8px; height: 8px; background: var(--color-accent-light); border-radius: 50%;"></div>
        <span style="color: var(--color-text-primary);">${participant}</span>
      </div>
    `).join('');
  }

  updateActivityLog() {
    const log = document.getElementById('activity-log');
    if (!this.currentSession || !this.currentSession.activity) return;

    if (this.currentSession.activity.length === 0) {
      log.innerHTML = '<p style="color: var(--color-text-tertiary); font-size: 0.875rem;">No activity yet</p>';
      return;
    }

    log.innerHTML = this.currentSession.activity.map(activity => `
      <div style="padding: 0.5rem; border-bottom: 1px solid var(--color-surface); font-size: 0.875rem;">
        <span style="color: var(--color-text-secondary);">${activity.participant}</span>
        <span style="color: var(--color-text-tertiary);"> ${activity.action}</span>
        <div style="color: var(--color-text-tertiary); font-size: 0.75rem; margin-top: 0.25rem;">
          ${new Date(activity.timestamp).toLocaleTimeString()}
        </div>
      </div>
    `).join('');
  }

  async saveContent() {
    if (!this.currentSession) return;

    const content = document.getElementById('collab-content').value;

    try {
      const response = await fetch(`${this.apiBase}/session/${this.currentSession.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: { story: content },
          participantName: this.currentSession.creatorName
        })
      });

      const data = await response.json();

      if (data.success) {
        this.currentSession = data.data;
        this.updateActivityLog();
        
        // Show success feedback
        const btn = document.getElementById('save-content-btn');
        const originalText = btn.textContent;
        btn.textContent = '✓ Saved!';
        btn.style.background = 'var(--color-accent-secondary)';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
        }, 2000);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save content. Please try again.');
    }
  }

  async brainstorm() {
    const content = document.getElementById('collab-content').value;
    const resultsContainer = document.getElementById('brainstorm-results');

    resultsContainer.innerHTML = '<div class="spinner" style="margin: 1rem auto;"></div>';

    try {
      const response = await fetch(`${this.apiBase}/brainstorm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: content })
      });

      const data = await response.json();

      if (data.success) {
        this.displayBrainstormResults(data.data);
      }
    } catch (error) {
      console.error('Brainstorm error:', error);
      resultsContainer.innerHTML = '<p style="color: var(--color-text-tertiary);">Failed to generate ideas</p>';
    }
  }

  displayBrainstormResults(data) {
    const container = document.getElementById('brainstorm-results');
    
    const allSuggestions = [
      ...data.aiSuggestions.map(s => ({ ...s, source: 'AI' })),
      ...data.collaborationTips.map(s => ({ ...s, source: 'Collaboration' }))
    ];

    container.innerHTML = `
      <div style="max-height: 400px; overflow-y: auto;">
        ${allSuggestions.map(suggestion => `
          <div class="glass-card" style="padding: 1rem; margin-bottom: 0.75rem; background: var(--color-bg-primary);">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
              <span style="background: var(--color-accent-glow); color: var(--color-accent-light); padding: 0.25rem 0.5rem; border-radius: var(--radius-sm); font-size: 0.75rem;">
                ${suggestion.type}
              </span>
              <span style="color: var(--color-text-tertiary); font-size: 0.75rem;">
                ${suggestion.source}
              </span>
            </div>
            <p style="color: var(--color-text-primary); font-size: 0.875rem;">
              ${suggestion.text}
            </p>
          </div>
        `).join('')}
      </div>
    `;
  }

  leaveSession() {
    this.currentSession = null;
    this.showSetup();
    document.getElementById('project-name').value = '';
    document.getElementById('creator-name').value = '';
    document.getElementById('collab-content').value = '';
  }
}

// Made with Bob
