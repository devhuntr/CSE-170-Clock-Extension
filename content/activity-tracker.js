// content/activity-tracker.js
// Detects mouse and keyboard activity on the page

const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'scroll', 'click', 'touchstart'];

class ActivityTracker {
  constructor(onActivityCallback) {
    this.onActivityCallback = onActivityCallback;
    this.isTracking = false;
    this._handler = () => this.onActivityCallback();
  }

  start() {
    if (this.isTracking) return;
    this.isTracking = true;

    ACTIVITY_EVENTS.forEach(event => {
      document.addEventListener(event, this._handler, { passive: true });
    });
  }

  stop() {
    if (!this.isTracking) return;
    this.isTracking = false;

    ACTIVITY_EVENTS.forEach(event => {
      document.removeEventListener(event, this._handler);
    });
  }
}
