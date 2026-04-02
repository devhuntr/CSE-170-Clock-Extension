document.addEventListener('DOMContentLoaded', function () {
  const themeButtons = document.querySelectorAll('.theme-toggle button');
  const addButton = document.querySelector('.add-btn');
  const urlInput = document.getElementById('urlInput');
  const listContent = document.querySelector('.list-content');
  const sessionBtn = document.getElementById('sessionBtn');
  const inactivityToggle = document.getElementById('inactivityToggle');
  const inactivityTimeoutInput = document.getElementById('inactivityTimeout');
  const body = document.body;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  let autoMode = true;
  let allowedSites = [];

  // ---------------------------------------------------------------------------
  // Theme
  // ---------------------------------------------------------------------------

  function applySystemTheme() {
    if (!autoMode) return;
    if (prefersDark.matches) {
      body.classList.add('theme-dark');
      body.classList.remove('theme-light');
    } else {
      body.classList.add('theme-light');
      body.classList.remove('theme-dark');
    }
  }

  function setSelectedTheme(name) {
    themeButtons.forEach(b => {
      b.classList.toggle('selected', b.classList.contains(name));
    });
  }

  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('light')) {
        autoMode = false;
        body.classList.add('theme-light');
        body.classList.remove('theme-dark');
        setSelectedTheme('light');
      } else if (btn.classList.contains('dark')) {
        autoMode = false;
        body.classList.add('theme-dark');
        body.classList.remove('theme-light');
        setSelectedTheme('dark');
      } else if (btn.classList.contains('auto')) {
        autoMode = true;
        setSelectedTheme('auto');
        applySystemTheme();
      }
    });
  });

  prefersDark.addEventListener('change', applySystemTheme);
  setSelectedTheme('auto');
  applySystemTheme();

  // ---------------------------------------------------------------------------
  // Session toggle
  // ---------------------------------------------------------------------------

  function updateSessionBtn(isActive) {
    sessionBtn.textContent = isActive ? 'Stop Focus Session' : 'Start Focus Session';
    sessionBtn.classList.toggle('session-active', isActive);
  }

  chrome.storage.sync.get(['isSessionActive'], (data) => {
    updateSessionBtn(!!data.isSessionActive);
  });

  sessionBtn.addEventListener('click', () => {
    chrome.storage.sync.get(['isSessionActive'], (data) => {
      const newValue = !data.isSessionActive;
      chrome.runtime.sendMessage({ action: 'SET_SESSION', isActive: newValue }, () => {
        updateSessionBtn(newValue);
      });
    });
  });

  // ---------------------------------------------------------------------------
  // Inactivity settings
  // ---------------------------------------------------------------------------

  chrome.storage.sync.get(['inactivityEnabled', 'inactivityTimeout'], (data) => {
    inactivityToggle.checked = data.inactivityEnabled !== false;
    inactivityTimeoutInput.value = data.inactivityTimeout || 10;
  });

  inactivityToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ inactivityEnabled: inactivityToggle.checked });
  });

  inactivityTimeoutInput.addEventListener('change', () => {
    const value = parseInt(inactivityTimeoutInput.value);
    if (value > 0) chrome.storage.sync.set({ inactivityTimeout: value });
  });

  // ---------------------------------------------------------------------------
  // Allowed sites
  // ---------------------------------------------------------------------------

  function loadAllowedSites() {
    chrome.storage.sync.get(['allowedSites'], (data) => {
      allowedSites = data.allowedSites || [];
      renderAllowedSitesList();
    });
  }

  function renderAllowedSitesList() {
    listContent.innerHTML = '';
    allowedSites.forEach(site => {
      const listItem = document.createElement('li');
      const urlText = document.createElement('span');
      urlText.textContent = site;

      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.textContent = 'x';
      deleteButton.setAttribute('aria-label', `Delete ${site}`);
      deleteButton.addEventListener('click', () => {
        removeUrlFromList(site);
      });

      listItem.appendChild(urlText);
      listItem.appendChild(deleteButton);
      listContent.appendChild(listItem);
    });
  }

  function addUrlToList() {
    const urlValue = urlInput.value.trim();
    if (!urlValue) return;

    let hostname = urlValue;
    try {
      const url = new URL(urlValue.startsWith('http') ? urlValue : `https://${urlValue}`);
      hostname = url.hostname;
    } catch (e) {
      hostname = urlValue;
    }

    if (allowedSites.includes(hostname)) {
      urlInput.value = '';
      return;
    }

    allowedSites.push(hostname);
    chrome.storage.sync.set({ allowedSites });
    renderAllowedSitesList();
    urlInput.value = '';
  }

  function removeUrlFromList(site) {
    allowedSites = allowedSites.filter(s => s !== site);
    chrome.storage.sync.set({ allowedSites });
    renderAllowedSitesList();
  }

  addButton.addEventListener('click', addUrlToList);

  urlInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addUrlToList();
    }
  });

  loadAllowedSites();
});
