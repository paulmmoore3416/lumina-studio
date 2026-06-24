/**
 * VividForge Translation Hub
 * Multi-language translation with pronunciation guides and TTS
 */

export class TranslationHub {
  constructor() {
    this.container = null;
    this.languages = [];
    this.currentTranslation = null;
    this.history = this.loadHistory();
    this.audioPlayer = null;
  }

  async init(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Container ${containerId} not found`);
      return;
    }

    // Load supported languages
    await this.loadLanguages();

    this.render();
    this.attachEventListeners();
  }

  async loadLanguages() {
    try {
      const response = await fetch('/api/translation/languages');
      const data = await response.json();
      if (data.success) {
        this.languages = data.languages;
      }
    } catch (error) {
      console.error('Failed to load languages:', error);
      // Fallback languages
      this.languages = [
        { code: 'auto', name: 'Auto-detect', flag: '🌐' },
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'es', name: 'Spanish', flag: '🇪🇸' },
        { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
        { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
        { code: 'zh-CN', name: 'Chinese (Simplified)', flag: '🇨🇳' },
        { code: 'ko', name: 'Korean', flag: '🇰🇷' }
      ];
    }
  }

  render() {
    this.container.innerHTML = `
      <div class="translation-hub">
        <div class="translation-header">
          <h2 class="section-title">
            <span class="icon">🌍</span>
            Translation Hub
          </h2>
          <p class="section-subtitle">Translate between 12 languages with AI-powered precision</p>
        </div>

        <div class="translation-main">
          <!-- Language Selection -->
          <div class="language-selector">
            <div class="lang-select-group">
              <label>From</label>
              <select id="sourceLang" class="lang-select">
                ${this.languages.map(lang => `
                  <option value="${lang.code}">${lang.flag} ${lang.name}</option>
                `).join('')}
              </select>
            </div>

            <button class="swap-langs-btn" id="swapLangs" title="Swap languages">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16"/>
              </svg>
            </button>

            <div class="lang-select-group">
              <label>To</label>
              <select id="targetLang" class="lang-select">
                ${this.languages.filter(l => l.code !== 'auto').map(lang => `
                  <option value="${lang.code}" ${lang.code === 'es' ? 'selected' : ''}>${lang.flag} ${lang.name}</option>
                `).join('')}
              </select>
            </div>
          </div>

          <!-- Translation Options -->
          <div class="translation-options">
            <div class="option-group">
              <label>Formality</label>
              <select id="formality" class="option-select">
                <option value="neutral">Neutral</option>
                <option value="formal">Formal</option>
                <option value="casual">Casual</option>
              </select>
            </div>

            <div class="option-group">
              <label>Style</label>
              <select id="style" class="option-select">
                <option value="default">Default</option>
                <option value="literal">Literal</option>
                <option value="idiomatic">Idiomatic</option>
                <option value="business">Business</option>
                <option value="literary">Literary</option>
                <option value="technical">Technical</option>
                <option value="casual-chat">Casual Chat</option>
              </select>
            </div>

            <div class="option-group">
              <label>Length</label>
              <select id="length" class="option-select">
                <option value="auto">Auto</option>
                <option value="concise">Concise</option>
                <option value="detailed">Detailed</option>
              </select>
            </div>
          </div>

          <!-- Input/Output Area -->
          <div class="translation-panels">
            <div class="translation-panel input-panel">
              <div class="panel-header">
                <h3>Original Text</h3>
                <div class="panel-actions">
                  <button class="icon-btn" id="clearInput" title="Clear">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                    </svg>
                  </button>
                  <span class="char-count" id="charCount">0 / 4000</span>
                </div>
              </div>
              <textarea 
                id="inputText" 
                class="translation-textarea" 
                placeholder="Enter text to translate..."
                maxlength="4000"
              ></textarea>
            </div>

            <div class="translation-panel output-panel">
              <div class="panel-header">
                <h3>Translation</h3>
                <div class="panel-actions">
                  <button class="icon-btn" id="copyTranslation" title="Copy" style="display: none;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                    </svg>
                  </button>
                  <button class="icon-btn" id="speakTranslation" title="Speak" style="display: none;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                      <path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div id="outputText" class="translation-output">
                <div class="output-placeholder">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                  <p>Translation will appear here</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Translate Button -->
          <button class="btn-primary translate-btn" id="translateBtn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
            Translate
          </button>

          <!-- Results Section -->
          <div id="resultsSection" class="results-section" style="display: none;">
            <!-- Pronunciation Guide -->
            <div class="result-card pronunciation-card" id="pronunciationCard" style="display: none;">
              <h3 class="result-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z"/>
                  <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/>
                </svg>
                Pronunciation Guide
              </h3>
              <div id="pronunciationContent"></div>
            </div>

            <!-- Alternatives -->
            <div class="result-card alternatives-card" id="alternativesCard" style="display: none;">
              <h3 class="result-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                </svg>
                Alternative Translations
              </h3>
              <div id="alternativesContent"></div>
            </div>

            <!-- Notes -->
            <div class="result-card notes-card" id="notesCard" style="display: none;">
              <h3 class="result-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
                </svg>
                Cultural Notes
              </h3>
              <div id="notesContent"></div>
            </div>
          </div>
        </div>

        <!-- History Section -->
        <div class="translation-history" id="historySection">
          <h3 class="history-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            Recent Translations
          </h3>
          <div id="historyList" class="history-list"></div>
        </div>
      </div>
    `;

    this.renderHistory();
  }

  attachEventListeners() {
    // Input text
    const inputText = document.getElementById('inputText');
    const charCount = document.getElementById('charCount');
    inputText?.addEventListener('input', (e) => {
      charCount.textContent = `${e.target.value.length} / 4000`;
    });

    // Clear input
    document.getElementById('clearInput')?.addEventListener('click', () => {
      inputText.value = '';
      charCount.textContent = '0 / 4000';
    });

    // Swap languages
    document.getElementById('swapLangs')?.addEventListener('click', () => {
      const sourceLang = document.getElementById('sourceLang');
      const targetLang = document.getElementById('targetLang');
      if (sourceLang.value !== 'auto') {
        const temp = sourceLang.value;
        sourceLang.value = targetLang.value;
        targetLang.value = temp;
      }
    });

    // Translate button
    document.getElementById('translateBtn')?.addEventListener('click', () => {
      this.translate();
    });

    // Copy translation
    document.getElementById('copyTranslation')?.addEventListener('click', () => {
      if (this.currentTranslation) {
        navigator.clipboard.writeText(this.currentTranslation.translation);
        this.showToast('Translation copied to clipboard!');
      }
    });

    // Speak translation
    document.getElementById('speakTranslation')?.addEventListener('click', () => {
      this.speakTranslation();
    });
  }

  async translate() {
    const inputText = document.getElementById('inputText').value.trim();
    if (!inputText) {
      this.showToast('Please enter text to translate', 'error');
      return;
    }

    const sourceLang = document.getElementById('sourceLang').value;
    const targetLang = document.getElementById('targetLang').value;
    const formality = document.getElementById('formality').value;
    const style = document.getElementById('style').value;
    const length = document.getElementById('length').value;

    const translateBtn = document.getElementById('translateBtn');
    translateBtn.disabled = true;
    translateBtn.innerHTML = `
      <svg class="spinner" width="20" height="20" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="60" stroke-dashoffset="60">
          <animate attributeName="stroke-dashoffset" values="60;0" dur="1s" repeatCount="indefinite"/>
        </circle>
      </svg>
      Translating...
    `;

    try {
      const response = await fetch('/api/translation/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          sourceLang,
          targetLang,
          formality,
          style,
          length
        })
      });

      const data = await response.json();

      if (data.success) {
        this.currentTranslation = data.result;
        this.displayTranslation(data.result);
        this.addToHistory({
          input: inputText,
          output: data.result.translation,
          sourceLang,
          targetLang,
          timestamp: Date.now()
        });
        this.showToast('Translation complete!', 'success');
      } else {
        throw new Error(data.error || 'Translation failed');
      }
    } catch (error) {
      console.error('Translation error:', error);
      this.showToast(error.message || 'Translation failed', 'error');
    } finally {
      translateBtn.disabled = false;
      translateBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
        Translate
      `;
    }
  }

  displayTranslation(result) {
    const outputText = document.getElementById('outputText');
    const resultsSection = document.getElementById('resultsSection');
    
    // Display main translation
    outputText.innerHTML = `
      <div class="translation-result">
        <p class="translation-text">${this.escapeHtml(result.translation)}</p>
        ${result.transliteration ? `
          <p class="transliteration">${this.escapeHtml(result.transliteration)}</p>
        ` : ''}
      </div>
    `;

    // Show action buttons
    document.getElementById('copyTranslation').style.display = 'block';
    document.getElementById('speakTranslation').style.display = 'block';

    // Show results section
    resultsSection.style.display = 'block';

    // Display pronunciation
    if (result.pronunciation) {
      this.displayPronunciation(result.pronunciation);
    }

    // Display alternatives
    if (result.alternatives && result.alternatives.length > 0) {
      this.displayAlternatives(result.alternatives);
    }

    // Display notes
    if (result.notes) {
      this.displayNotes(result.notes);
    }
  }

  displayPronunciation(pronunciation) {
    const card = document.getElementById('pronunciationCard');
    const content = document.getElementById('pronunciationContent');
    
    content.innerHTML = `
      <div class="pronunciation-guide">
        <div class="pronunciation-item">
          <strong>IPA:</strong> <span class="ipa-text">${this.escapeHtml(pronunciation.ipa)}</span>
        </div>
        <div class="pronunciation-item">
          <strong>Guide:</strong> <span class="guide-text">${this.escapeHtml(pronunciation.guide)}</span>
        </div>
        ${pronunciation.tips ? `
          <div class="pronunciation-item">
            <strong>Tip:</strong> <span class="tips-text">${this.escapeHtml(pronunciation.tips)}</span>
          </div>
        ` : ''}
        ${pronunciation.syllables && pronunciation.syllables.length > 0 ? `
          <div class="syllables">
            ${pronunciation.syllables.map(s => `
              <span class="syllable ${s.stress !== 'none' ? 'stress-' + s.stress : ''}">
                ${this.escapeHtml(s.text)}
                <span class="phonetic">${this.escapeHtml(s.phonetic)}</span>
              </span>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
    
    card.style.display = 'block';
  }

  displayAlternatives(alternatives) {
    const card = document.getElementById('alternativesCard');
    const content = document.getElementById('alternativesContent');
    
    content.innerHTML = alternatives.map(alt => `
      <div class="alternative-item">
        <p class="alt-text">${this.escapeHtml(alt.text)}</p>
        <p class="alt-note">${this.escapeHtml(alt.note)}</p>
      </div>
    `).join('');
    
    card.style.display = 'block';
  }

  displayNotes(notes) {
    const card = document.getElementById('notesCard');
    const content = document.getElementById('notesContent');
    
    content.innerHTML = `<p class="notes-text">${this.escapeHtml(notes)}</p>`;
    card.style.display = 'block';
  }

  async speakTranslation() {
    if (!this.currentTranslation) return;

    const targetLang = document.getElementById('targetLang').value;
    const text = this.currentTranslation.translation;

    try {
      const response = await fetch('/api/voice/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          language: targetLang
        })
      });

      const data = await response.json();
      
      if (data.success && data.audio) {
        // Play audio
        if (this.audioPlayer) {
          this.audioPlayer.pause();
        }
        this.audioPlayer = new Audio(`data:audio/mp3;base64,${data.audio}`);
        this.audioPlayer.play();
      }
    } catch (error) {
      console.error('TTS error:', error);
      this.showToast('Text-to-speech failed', 'error');
    }
  }

  addToHistory(item) {
    this.history.unshift(item);
    if (this.history.length > 10) {
      this.history = this.history.slice(0, 10);
    }
    this.saveHistory();
    this.renderHistory();
  }

  renderHistory() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;

    if (this.history.length === 0) {
      historyList.innerHTML = '<p class="history-empty">No translation history yet</p>';
      return;
    }

    historyList.innerHTML = this.history.map((item, index) => `
      <div class="history-item" data-index="${index}">
        <div class="history-langs">
          <span class="history-lang">${this.getLanguageName(item.sourceLang)}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
          <span class="history-lang">${this.getLanguageName(item.targetLang)}</span>
        </div>
        <p class="history-text">${this.escapeHtml(item.input.slice(0, 50))}${item.input.length > 50 ? '...' : ''}</p>
        <p class="history-translation">${this.escapeHtml(item.output.slice(0, 50))}${item.output.length > 50 ? '...' : ''}</p>
      </div>
    `).join('');

    // Add click handlers
    historyList.querySelectorAll('.history-item').forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.dataset.index);
        this.loadFromHistory(index);
      });
    });
  }

  loadFromHistory(index) {
    const item = this.history[index];
    if (!item) return;

    document.getElementById('inputText').value = item.input;
    document.getElementById('sourceLang').value = item.sourceLang;
    document.getElementById('targetLang').value = item.targetLang;
    document.getElementById('charCount').textContent = `${item.input.length} / 4000`;
  }

  getLanguageName(code) {
    const lang = this.languages.find(l => l.code === code);
    return lang ? `${lang.flag} ${lang.name}` : code;
  }

  loadHistory() {
    try {
      const saved = localStorage.getItem('vividforge_translation_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  saveHistory() {
    try {
      localStorage.setItem('vividforge_translation_history', JSON.stringify(this.history));
    } catch (error) {
      console.error('Failed to save history:', error);
    }
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Made with Bob
