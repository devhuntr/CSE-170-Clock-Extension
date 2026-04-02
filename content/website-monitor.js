// content/website-monitor.js
// Monitors current website and checks against allowed website list

class WebsiteMonitor {
  constructor() {
    this.currentHostname = window.location.hostname;
  }

  normalizeHost(host) {
    return host.replace(/^www\./, '').toLowerCase();
  }

  isSiteAllowed(allowedSites) {
    if (!allowedSites || allowedSites.length === 0) {
      return true; // no list = no restriction
    }

    const current = this.normalizeHost(this.currentHostname);
    return allowedSites.some(site => {
      const normalized = this.normalizeHost(site);
      return current === normalized || current.endsWith('.' + normalized);
    });
  }

  getCurrentHostname() {
    return this.currentHostname;
  }
}
