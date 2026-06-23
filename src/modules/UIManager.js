/**
 * UI Manager Module
 * Handles global UI state and utilities
 */

export class UIManager {
  constructor() {
    this.notifications = [];
  }

  showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
      position: fixed;
      top: 2rem;
      right: 2rem;
      padding: 1rem 1.5rem;
      background: var(--glass-bg);
      backdrop-filter: blur(10px);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-md);
      color: var(--color-text-primary);
      box-shadow: var(--glass-shadow);
      z-index: 10000;
      animation: slideIn 0.3s ease;
      max-width: 400px;
    `;

    const icon = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    }[type] || 'ℹ️';

    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <span style="font-size: 1.25rem;">${icon}</span>
        <span>${message}</span>
      </div>
    `;

    document.body.appendChild(notification);
    this.notifications.push(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        notification.remove();
        this.notifications = this.notifications.filter(n => n !== notification);
      }, 300);
    }, duration);
  }

  showLoading(message = 'Loading...') {
    const overlay = document.createElement('div');
    overlay.id = 'global-loading';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(13, 17, 23, 0.8);
      backdrop-filter: blur(5px);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    `;

    overlay.innerHTML = `
      <div class="spinner" style="width: 50px; height: 50px; margin-bottom: 1rem;"></div>
      <p style="color: var(--color-text-secondary); font-size: 1.125rem;">${message}</p>
    `;

    document.body.appendChild(overlay);
  }

  hideLoading() {
    const overlay = document.getElementById('global-loading');
    if (overlay) {
      overlay.remove();
    }
  }

  confirmDialog(message, onConfirm, onCancel) {
    const dialog = document.createElement('div');
    dialog.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(13, 17, 23, 0.9);
      backdrop-filter: blur(5px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
    `;

    dialog.innerHTML = `
      <div class="glass-card" style="max-width: 500px; padding: 2rem;">
        <h3 style="color: var(--color-text-primary); margin-bottom: 1rem; font-size: 1.25rem;">
          Confirm Action
        </h3>
        <p style="color: var(--color-text-secondary); margin-bottom: 2rem; line-height: 1.6;">
          ${message}
        </p>
        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
          <button class="btn btn-secondary" id="dialog-cancel">Cancel</button>
          <button class="btn btn-primary" id="dialog-confirm">Confirm</button>
        </div>
      </div>
    `;

    document.body.appendChild(dialog);

    dialog.querySelector('#dialog-confirm').addEventListener('click', () => {
      dialog.remove();
      if (onConfirm) onConfirm();
    });

    dialog.querySelector('#dialog-cancel').addEventListener('click', () => {
      dialog.remove();
      if (onCancel) onCancel();
    });

    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) {
        dialog.remove();
        if (onCancel) onCancel();
      }
    });
  }
}

// Add animation keyframes to document
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Made with Bob
