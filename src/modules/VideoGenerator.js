/**
 * Video Generator Module
 * Advanced 6-second cinematic video generation
 */

export class VideoGenerator {
  constructor() {
    this.apiBase = '/api/video';
    this.currentVideo = null;
  }

  render(container) {
    container.innerHTML = `
      <div class="module-container">
        <div class="module-header">
          <h1 class="module-title">🎬 Video Generator</h1>
          <p class="module-description">
            Create stunning 6-second cinematic videos from your concepts. Perfect for social media,
            presentations, and creative showcases. Powered by advanced AI and video composition.
          </p>
        </div>

        <div class="glass-card">
          <h2 style="margin-bottom: 1.5rem; color: var(--color-accent-light);">Generate Video</h2>
          
          <div class="form-group">
            <label for="video-concept">Concept Description</label>
            <textarea 
              id="video-concept" 
              class="input-field" 
              rows="4"
              placeholder="Describe the visual concept for your video..."
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="video-style">Visual Style</label>
              <select id="video-style" class="input-field">
                <option value="cinematic">Cinematic - Film-like quality</option>
                <option value="artistic">Artistic - Painterly aesthetic</option>
                <option value="realistic">Realistic - Photorealistic</option>
                <option value="abstract">Abstract - Modern art style</option>
                <option value="vintage">Vintage - Retro film look</option>
              </select>
            </div>

            <div class="form-group">
              <label for="video-transition">Transition Style</label>
              <select id="video-transition" class="input-field">
                <option value="fade">Fade - Smooth crossfade</option>
                <option value="dissolve">Dissolve - Gradual blend</option>
                <option value="cut">Cut - Direct transition</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="video-music">Background Music</label>
              <select id="video-music" class="input-field">
                <option value="ambient">Ambient - Atmospheric</option>
                <option value="cinematic">Cinematic - Epic orchestral</option>
                <option value="electronic">Electronic - Modern beats</option>
                <option value="acoustic">Acoustic - Organic sounds</option>
                <option value="none">None - No music</option>
              </select>
            </div>

            <div class="form-group">
              <label>
                <input type="checkbox" id="ken-burns-effect" checked>
                Enable Ken Burns Effect (Zoom & Pan)
              </label>
              <label>
                <input type="checkbox" id="color-grade" checked>
                Apply Color Grading
              </label>
            </div>
          </div>

          <div class="form-group">
            <label for="video-voiceover">Voiceover Text (Optional)</label>
            <textarea 
              id="video-voiceover" 
              class="input-field" 
              rows="2"
              placeholder="Add narration text for your video..."
              maxlength="150"
            ></textarea>
            <small style="color: var(--color-text-tertiary);">Maximum 150 characters for 6-second video</small>
          </div>

          <div class="button-group">
            <button id="generate-video-btn" class="btn btn-primary">
              <span>🎬</span> Generate 6-Second Video
            </button>
            <button id="quick-video-btn" class="btn btn-secondary">
              <span>⚡</span> Quick Generate
            </button>
          </div>
        </div>

        <div id="video-result" style="display: none;">
          <div class="glass-card">
            <h2 style="color: var(--color-accent-light); margin-bottom: 1.5rem;">Generated Video</h2>
            
            <div id="video-player-container" style="margin-bottom: 1.5rem;">
              <video id="video-player" controls style="width: 100%; border-radius: var(--radius-lg); box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);"></video>
            </div>

            <div id="video-metadata" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
            </div>

            <div class="video-specs" style="background: rgba(0, 166, 81, 0.05); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
              <h3 style="color: var(--color-accent-light); margin-bottom: 0.5rem;">Technical Specifications</h3>
              <div id="video-specs-content"></div>
            </div>

            <div class="button-group">
              <button id="download-video-btn" class="btn btn-secondary">
                <span>💾</span> Download Video
              </button>
              <button id="share-video-btn" class="btn btn-secondary">
                <span>🔗</span> Copy Link
              </button>
              <button id="regenerate-video-btn" class="btn btn-secondary">
                <span>🔄</span> Regenerate
              </button>
            </div>
          </div>
        </div>

        <div id="loading-indicator" style="display: none;">
          <div class="glass-card text-center">
            <div class="spinner"></div>
            <p style="margin-top: 1rem; color: var(--color-text-secondary);">
              Generating your cinematic video...
            </p>
            <p style="margin-top: 0.5rem; color: var(--color-text-tertiary); font-size: 0.875rem;">
              This may take 30-60 seconds
            </p>
          </div>
        </div>

        <div class="glass-card" style="margin-top: 2rem;">
          <h3 style="color: var(--color-accent-light); margin-bottom: 1rem;">💡 Video Generation Tips</h3>
          <ul style="color: var(--color-text-secondary); line-height: 1.8;">
            <li>Be specific with your concept description for better results</li>
            <li>Cinematic style works best for dramatic, story-driven content</li>
            <li>Ken Burns effect adds professional motion to static scenes</li>
            <li>Keep voiceover text concise - aim for 10-15 words maximum</li>
            <li>Videos are optimized for social media (1920x1080, 30fps)</li>
            <li>Each video contains 3 scenes with smooth transitions</li>
          </ul>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    const generateBtn = document.getElementById('generate-video-btn');
    const quickBtn = document.getElementById('quick-video-btn');
    const downloadBtn = document.getElementById('download-video-btn');
    const shareBtn = document.getElementById('share-video-btn');
    const regenerateBtn = document.getElementById('regenerate-video-btn');

    if (generateBtn) {
      generateBtn.addEventListener('click', () => this.generateVideo());
    }

    if (quickBtn) {
      quickBtn.addEventListener('click', () => this.quickGenerate());
    }

    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => this.downloadVideo());
    }

    if (shareBtn) {
      shareBtn.addEventListener('click', () => this.shareVideo());
    }

    if (regenerateBtn) {
      regenerateBtn.addEventListener('click', () => this.generateVideo());
    }
  }

  async generateVideo() {
    const concept = document.getElementById('video-concept').value.trim();
    const style = document.getElementById('video-style').value;
    const transition = document.getElementById('video-transition').value;
    const music = document.getElementById('video-music').value;
    const voiceover = document.getElementById('video-voiceover').value.trim();
    const kenBurns = document.getElementById('ken-burns-effect').checked;
    const colorGrade = document.getElementById('color-grade').checked;

    if (!concept) {
      alert('Please describe your video concept');
      return;
    }

    const loadingIndicator = document.getElementById('loading-indicator');
    const resultContainer = document.getElementById('video-result');
    
    loadingIndicator.style.display = 'block';
    resultContainer.style.display = 'none';

    try {
      const effects = [];
      if (kenBurns) effects.push('ken-burns');
      if (colorGrade) effects.push('color-grade');

      const response = await fetch(`${this.apiBase}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concept: {
            title: 'Video Concept',
            description: concept,
            coreDescription: concept
          },
          options: {
            style,
            transition,
            music: music !== 'none' ? music : null,
            voiceover: voiceover || null,
            effects
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate video');
      }

      const data = await response.json();
      this.currentVideo = data;
      this.displayVideo(data);

      loadingIndicator.style.display = 'none';
      resultContainer.style.display = 'block';
      
      resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
      console.error('Error generating video:', error);
      loadingIndicator.style.display = 'none';
      alert('Failed to generate video. Please try again.');
    }
  }

  async quickGenerate() {
    const concept = document.getElementById('video-concept').value.trim();

    if (!concept) {
      alert('Please describe your video concept');
      return;
    }

    // Set quick defaults
    document.getElementById('video-style').value = 'cinematic';
    document.getElementById('video-transition').value = 'fade';
    document.getElementById('video-music').value = 'ambient';
    document.getElementById('ken-burns-effect').checked = true;
    document.getElementById('color-grade').checked = true;

    await this.generateVideo();
  }

  displayVideo(videoData) {
    const videoPlayer = document.getElementById('video-player');
    const metadataContainer = document.getElementById('video-metadata');
    const specsContainer = document.getElementById('video-specs-content');

    // Set video source
    videoPlayer.src = videoData.videoUrl;
    videoPlayer.load();

    // Display metadata
    metadataContainer.innerHTML = `
      <div class="metadata-item">
        <strong>Duration:</strong> ${videoData.duration} seconds
      </div>
      <div class="metadata-item">
        <strong>Resolution:</strong> ${videoData.resolution}
      </div>
      <div class="metadata-item">
        <strong>Scenes:</strong> ${videoData.scenes}
      </div>
      <div class="metadata-item">
        <strong>Style:</strong> ${videoData.metadata.style}
      </div>
      <div class="metadata-item">
        <strong>Transition:</strong> ${videoData.metadata.transition}
      </div>
      <div class="metadata-item">
        <strong>Generated:</strong> ${new Date(videoData.metadata.generatedAt).toLocaleString()}
      </div>
    `;

    // Display technical specs
    specsContainer.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 0.5rem; font-size: 0.875rem;">
        <div><strong>FPS:</strong> ${videoData.metadata.fps}</div>
        <div><strong>Format:</strong> MP4 (H.264)</div>
        <div><strong>Bitrate:</strong> 5000k</div>
        <div><strong>Effects:</strong> ${videoData.metadata.effects.join(', ')}</div>
      </div>
    `;
  }

  downloadVideo() {
    if (!this.currentVideo) {
      alert('No video to download');
      return;
    }

    const a = document.createElement('a');
    a.href = this.currentVideo.videoUrl;
    a.download = `vividforge-video-${Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  shareVideo() {
    if (!this.currentVideo) {
      alert('No video to share');
      return;
    }

    const fullUrl = window.location.origin + this.currentVideo.videoUrl;
    navigator.clipboard.writeText(fullUrl).then(() => {
      alert('Video link copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy link. URL: ' + fullUrl);
    });
  }
}

// Made with Bob - Advanced Video Generation UI