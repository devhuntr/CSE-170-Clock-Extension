// content/ui-manager.js
// Manages UI elements: blocked site overlays and inactivity banners

class UIManager {
  constructor() {
    this.blockedOverlay = null;
    this.inactivityBanner = null;
  }

  showBlockedSiteWarning() {
    if (this.blockedOverlay) return; // already visible

    this.blockedOverlay = document.createElement('div');
    this.blockedOverlay.id = 'focusguard-blocked-overlay';
    Object.assign(this.blockedOverlay.style, {
      position: 'fixed',
      inset: '0',
      width: '100%',
      height: '100%',
      zIndex: '2147483647',
      background: 'rgba(0, 0, 0, 0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    });

    const iframe = document.createElement('iframe');
    iframe.src = chrome.runtime.getURL('warning_popup.html');
    Object.assign(iframe.style, {
      width: '480px',
      height: '280px',
      border: 'none',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    });

    this.blockedOverlay.appendChild(iframe);
    document.documentElement.appendChild(this.blockedOverlay);
  }

  removeBlockedOverlay() {
    if (this.blockedOverlay) {
      this.blockedOverlay.remove();
      this.blockedOverlay = null;
    }
  }

  showInactivityBanner(onDismiss, timeoutMinutes) {
    if (this.inactivityBanner) return; // already visible

    this.inactivityBanner = document.createElement('div');
    this.inactivityBanner.id = 'focusguard-inactivity-banner';
    Object.assign(this.inactivityBanner.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      zIndex: '2147483646',
      background: '#d94f2a',
      color: '#fff',
      fontFamily: 'sans-serif',
      fontSize: '15px',
      padding: '14px 20px',
      boxSizing: 'border-box',
      textAlign: 'center',
      boxShadow: '0 2px 10px rgba(0,0,0,0.35)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
    });

    const msg = document.createElement('span');
    const minutes = timeoutMinutes || 10;
    msg.textContent = `FocusGuard: You've been inactive for ${minutes} minute${minutes === 1 ? '' : 's'} — still working?`;

    const btn = document.createElement('button');
    btn.textContent = "I'm here";
    Object.assign(btn.style, {
      background: '#fff',
      color: '#d94f2a',
      border: 'none',
      borderRadius: '6px',
      padding: '6px 16px',
      fontSize: '14px',
      fontWeight: 'bold',
      cursor: 'pointer',
    });
    btn.addEventListener('click', onDismiss);

    this.inactivityBanner.appendChild(msg);
    this.inactivityBanner.appendChild(btn);
    document.documentElement.appendChild(this.inactivityBanner);
  }

  removeInactivityBanner() {
    if (this.inactivityBanner) {
      this.inactivityBanner.remove();
      this.inactivityBanner = null;
    }
  }

  hideAll() {
    this.removeBlockedOverlay();
    this.removeInactivityBanner();
  }
}
