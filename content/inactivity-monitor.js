// content/inactivity-monitor.js
// Manages inactivity detection. Timeout and enabled state are configurable via configure().

class InactivityMonitor {
  constructor(onInactivityCallback, onResetCallback) {
    this.onInactivityCallback = onInactivityCallback;
    this.onResetCallback = onResetCallback;
    this.inactivityTimer = null;
    this.enabled = true;
    this.timeoutMs = 10 * 60 * 1000; // default 10 minutes
  }

  // Called by content.js when storage settings change
  configure(enabled, timeoutMinutes) {
    this.enabled = enabled;
    this.timeoutMs = (timeoutMinutes || 10) * 60 * 1000;
  }

  start() {
    this.reset();
  }

  reset() {
    this.clearTimer();
    if (!this.enabled) return;

    this.inactivityTimer = setTimeout(() => {
      this.onInactivityCallback();
    }, this.timeoutMs);

    if (this.onResetCallback) {
      this.onResetCallback();
    }
  }

  clearTimer() {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
  }

  stop() {
    this.clearTimer();
  }
}
