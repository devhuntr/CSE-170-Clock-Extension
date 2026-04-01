// content/content.js
// FocusGuard — Main content script orchestrating activity monitoring, inactivity detection, and site enforcement.
//
// Dependencies: activity-tracker.js, inactivity-monitor.js, website-monitor.js, ui-manager.js
//
// Reads from chrome.storage.sync:
//   isSessionActive    {boolean}  — whether a focus session is currently running
//   allowedSites       {string[]} — hostnames the user is allowed to visit
//   inactivityEnabled  {boolean}  — whether inactivity alerts are on
//   inactivityTimeout  {number}   — minutes before inactivity alert fires

let isSessionActive = false;
let activityTracker = null;
let inactivityMonitor = null;
let websiteMonitor = null;
let uiManager = null;
let currentInactivityTimeout = 10; // minutes, kept in sync with storage

// ---------------------------------------------------------------------------
// Initialization
// ---------------------------------------------------------------------------

function initializeModules() {
  websiteMonitor = new WebsiteMonitor();
  uiManager = new UIManager();

  inactivityMonitor = new InactivityMonitor(
    () => onInactivityTriggered(),
    () => onInactivityReset()
  );

  activityTracker = new ActivityTracker(
    () => onUserActivity()
  );
}

// ---------------------------------------------------------------------------
// Inactivity and Activity Handlers
// ---------------------------------------------------------------------------

function onInactivityTriggered() {
  uiManager.showInactivityBanner(() => onDismissInactivityBanner(), currentInactivityTimeout);
}

function onDismissInactivityBanner() {
  uiManager.removeInactivityBanner();
  inactivityMonitor.reset();
}

function onInactivityReset() {
  uiManager.removeInactivityBanner();
}

function onUserActivity() {
  if (inactivityMonitor) {
    inactivityMonitor.reset();
  }
}

// ---------------------------------------------------------------------------
// Site Monitoring
// ---------------------------------------------------------------------------

function startMonitoring(allowedSites, inactivityEnabled, inactivityTimeout) {
  currentInactivityTimeout = inactivityTimeout;
  if (!websiteMonitor.isSiteAllowed(allowedSites)) {
    uiManager.showBlockedSiteWarning();
  }

  inactivityMonitor.configure(inactivityEnabled, inactivityTimeout);
  activityTracker.start();
  inactivityMonitor.start();
}

function stopMonitoring() {
  if (activityTracker) activityTracker.stop();
  if (inactivityMonitor) inactivityMonitor.stop();
  if (uiManager) uiManager.hideAll();
}

// ---------------------------------------------------------------------------
// Storage Listeners
// ---------------------------------------------------------------------------

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'sync') return;

  // Session toggled
  if (changes.isSessionActive !== undefined) {
    const wasActive = isSessionActive;
    isSessionActive = !!changes.isSessionActive.newValue;

    if (isSessionActive && !wasActive) {
      chrome.storage.sync.get(
        ['allowedSites', 'inactivityEnabled', 'inactivityTimeout'],
        (data) => {
          startMonitoring(
            data.allowedSites || [],
            data.inactivityEnabled !== false,
            data.inactivityTimeout || 10
          );
        }
      );
    } else if (!isSessionActive && wasActive) {
      stopMonitoring();
    }
  }

  // Allowed-sites list updated while session is running
  if (changes.allowedSites !== undefined && isSessionActive) {
    const updatedList = changes.allowedSites.newValue || [];
    if (!websiteMonitor.isSiteAllowed(updatedList)) {
      uiManager.showBlockedSiteWarning();
    } else {
      uiManager.removeBlockedOverlay();
    }
  }

  // Inactivity settings changed while session is running
  if ((changes.inactivityEnabled !== undefined || changes.inactivityTimeout !== undefined) && isSessionActive) {
    chrome.storage.sync.get(['inactivityEnabled', 'inactivityTimeout'], (data) => {
      currentInactivityTimeout = data.inactivityTimeout || 10;
      inactivityMonitor.configure(data.inactivityEnabled !== false, currentInactivityTimeout);
      inactivityMonitor.reset();
    });
  }
});

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

function initSession() {
  initializeModules();

  chrome.storage.sync.get(
    ['isSessionActive', 'allowedSites', 'inactivityEnabled', 'inactivityTimeout'],
    (data) => {
      isSessionActive = !!data.isSessionActive;
      if (!isSessionActive) return;
      startMonitoring(
        data.allowedSites || [],
        data.inactivityEnabled !== false,
        data.inactivityTimeout || 10
      );
    }
  );
}

initSession();
