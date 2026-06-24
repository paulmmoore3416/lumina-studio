/**
 * Voice Generator Module
 * Advanced text-to-speech with ElevenLabs integration
 */

export class VoiceGenerator {
  constructor() {
    this.apiBase = '/api/voice';
    this.currentAudio = null;
    this.audioPlayer = null;
  }

  render(container) {
    container.innerHTML = `
      <div class="module-container">
        <div class="module-header">
          <h1 class="module-title">🎙️ Voice Generator</h1>
          <p class="module-description">
            Transform text into professional voiceovers with ElevenLabs AI. Choose from multiple voices,
            control emotions, and generate narration for your creative projects.
          </p>
        </div>

        <div class="glass-card">
          <h2 style="margin-bottom: 1.5rem; color: var(--color-accent-light);">Generate Voice</h2>
          
          <div class="form-group">
            <label for="voice-text">Text to Speak</label>
            <textarea 
              id="voice-text" 
              class="input-field" 
              rows="6"
              placeholder="Enter the text you want to convert to speech..."
              maxlength="5000"
            ></textarea>
            <small style="color: var(--color-text-tertiary);">Maximum 5000 characters</small>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="voice-select">Voice</label>
              <select id="voice-select" class="input-field">
                <option value="rachel">Rachel - Calm, Professional Female</option>
                <option value="adam">Adam - Deep, Authoritative Male</option>
                <option value="bella">Bella - Warm, Friendly Female</option>
                <option value="josh">Josh - Young, Energetic Male</option>
                <option value="sam">Sam - Neutral, Versatile</option>
                <option value="antoni">Antoni - Articulate, Clear (Best for Narration)</option>
                <option value="elli">Elli - Youthful, Expressive</option>
                <option value="domi">Domi - Strong, Confident</option>
                <option value="nicole">Nicole - Smooth, Sophisticated</option>
                <option value="glinda">Glinda - Ethereal, Mystical</option>
              </select>
            </div>

            <div class="form-group">
              <label for="emotion-select">Emotion</label>
              <select id="emotion-select" class="input-field">
                <option value="neutral">Neutral</option>
                <option value="excited">Excited</option>
                <option value="calm">Calm</option>
                <option value="dramatic">Dramatic</option>
                <option value="mysterious">Mysterious</option>
                <option value="energetic">Energetic</option>
                <option value="sad">Sad</option>
                <option value="angry">Angry</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="stability-slider">Stability: <span id="stability-value">0.5</span></label>
              <input 
                type="range" 
                id="stability-slider" 
                class="slider" 
                min="0" 
                max="1" 
                step="0.1" 
                value="0.5"
              >
              <small style="color: var(--color-text-tertiary);">Higher = more consistent, Lower = more variable</small>
            </div>

            <div class="form-group">
              <label for="similarity-slider">Similarity Boost: <span id="similarity-value">0.75</span></label>
              <input 
                type="range" 
                id="similarity-slider" 
                class="slider" 
                min="0" 
                max="1" 
                step="0.05" 
                value="0.75"
              >
              <small style="color: var(--color-text-tertiary);">Higher = closer to original voice</small>
            </div>
          </div>

          <div class="button-group">
            <button id="generate-voice-btn" class="btn btn-primary">
              <span>🎙️</span> Generate Voice
            </button>
            <button id="generate-narration-btn" class="btn btn-secondary">
              <span>📖</span> Generate Narration
            </button>
          </div>
        </div>

        <div id="voice-result" style="display: none;">
          <div class="glass-card">
            <h2 style="color: var(--color-accent-light); margin-bottom: 1.5rem;">Generated Audio</h2>
            
            <div id="audio-player-container" style="margin-bottom: 1.5rem;">
              <audio id="audio-player" controls style="width: 100%; border-radius: var(--radius-md);"></audio>
            </div>

            <div id="audio-metadata" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
            </div>

            <div class="button-group">
              <button id="download-audio-btn" class="btn btn-secondary">
                <span>💾</span> Download Audio
              </button>
              <button id="regenerate-btn" class="btn btn-secondary">
                <span>🔄</span> Regenerate
              </button>
            </div>
          </div>
        </div>

        <div id="loading-indicator" style="display: none;">
          <div class="glass-card text-center">
            <div class="spinner"></div>
            <p style="margin-top: 1rem; color: var(--color-text-secondary);">
              Generating voice with ElevenLabs AI...
            </p>
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners();
    this.initializeSliders();
  }

  attachEventListeners() {
    const generateBtn = document.getElementById('generate-voice-btn');
    const narrationBtn = document.getElementById('generate-narration-btn');
    const downloadBtn = document.getElementById('download-audio-btn');
    const regenerateBtn = document.getElementById('regenerate-btn');

    if (generateBtn) {
      generateBtn.addEventListener('click', () => this.generateVoice());
    }

    if (narrationBtn) {
      narrationBtn.addEventListener('click', () => this.generateNarration());
    }

    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => this.downloadAudio());
    }

    if (regenerateBtn) {
      regenerateBtn.addEventListener('click', () => this.generateVoice());
    }
  }

  initializeSliders() {
    const stabilitySlider = document.getElementById('stability-slider');
    const similaritySlider = document.getElementById('similarity-slider');
    const stabilityValue = document.getElementById('stability-value');
    const similarityValue = document.getElementById('similarity-value');

    if (stabilitySlider) {
      stabilitySlider.addEventListener('input', (e) => {
        stabilityValue.textContent = e.target.value;
      });
    }

    if (similaritySlider) {
      similaritySlider.addEventListener('input', (e) => {
        similarityValue.textContent = e.target.value;
      });
    }
  }

  async generateVoice() {
    const text = document.getElementById('voice-text').value.trim();
    const voice = document.getElementById('voice-select').value;
    const emotion = document.getElementById('emotion-select').value;
    const stability = parseFloat(document.getElementById('stability-slider').value);
    const similarityBoost = parseFloat(document.getElementById('similarity-slider').value);

    if (!text) {
      alert('Please enter text to convert to speech');
      return;
    }

    const loadingIndicator = document.getElementById('loading-indicator');
    const resultContainer = document.getElementById('voice-result');
    
    loadingIndicator.style.display = 'block';
    resultContainer.style.display = 'none';

    try {
      const response = await fetch(`${this.apiBase}/emotional`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice,
          emotion,
          options: {
            stability,
            similarityBoost
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate voice');
      }

      const data = await response.json();
      this.currentAudio = data;
      this.displayAudio(data);

      loadingIndicator.style.display = 'none';
      resultContainer.style.display = 'block';
      
      resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
      console.error('Error generating voice:', error);
      loadingIndicator.style.display = 'none';
      alert('Failed to generate voice. Please try again.');
    }
  }

  async generateNarration() {
    const text = document.getElementById('voice-text').value.trim();
    const voice = document.getElementById('voice-select').value;

    if (!text) {
      alert('Please enter text for narration');
      return;
    }

    const loadingIndicator = document.getElementById('loading-indicator');
    const resultContainer = document.getElementById('voice-result');
    
    loadingIndicator.style.display = 'block';
    resultContainer.style.display = 'none';

    try {
      const response = await fetch(`${this.apiBase}/narration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice,
          options: {
            chapterize: true,
            addPauses: true
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate narration');
      }

      const data = await response.json();
      this.currentAudio = data;
      this.displayAudio(data);

      loadingIndicator.style.display = 'none';
      resultContainer.style.display = 'block';
      
      resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
      console.error('Error generating narration:', error);
      loadingIndicator.style.display = 'none';
      alert('Failed to generate narration. Please try again.');
    }
  }

  displayAudio(audioData) {
    const audioPlayer = document.getElementById('audio-player');
    const metadataContainer = document.getElementById('audio-metadata');

    // Convert base64 to blob and create URL
    const audioBlob = this.base64ToBlob(audioData.audio, 'audio/mpeg');
    const audioUrl = URL.createObjectURL(audioBlob);
    
    audioPlayer.src = audioUrl;
    this.audioPlayer = audioPlayer;

    // Display metadata
    metadataContainer.innerHTML = `
      <div class="metadata-item">
        <strong>Voice:</strong> ${audioData.voice}
      </div>
      <div class="metadata-item">
        <strong>Duration:</strong> ~${audioData.duration} seconds
      </div>
      <div class="metadata-item">
        <strong>Format:</strong> ${audioData.format.toUpperCase()}
      </div>
      <div class="metadata-item">
        <strong>Emotion:</strong> ${audioData.metadata.emotion}
      </div>
      <div class="metadata-item">
        <strong>Model:</strong> ${audioData.metadata.model}
      </div>
      <div class="metadata-item">
        <strong>Generated:</strong> ${new Date(audioData.metadata.generatedAt).toLocaleString()}
      </div>
    `;
  }

  base64ToBlob(base64, mimeType) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  downloadAudio() {
    if (!this.currentAudio) {
      alert('No audio to download');
      return;
    }

    const audioBlob = this.base64ToBlob(this.currentAudio.audio, 'audio/mpeg');
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voice-${Date.now()}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Made with Bob - Advanced Voice Generation UI