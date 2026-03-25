document.addEventListener('DOMContentLoaded', function () {
  const tabs = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');
  const themeButtons = document.querySelectorAll('.theme-toggle button');
  const addButton = document.querySelector('.add-btn');
  const urlInput = document.getElementById('urlInput');
  const listContent = document.querySelector('.list-content');
  const body = document.body;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  let autoMode = true;

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
      const isMatch = b.classList.contains(name);
      if (isMatch) {
        b.classList.add('selected');
      } else {
        b.classList.remove('selected');
      }
    });
  }

  tabs.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');

      // 1. Remove active class from all buttons and contents
      tabs.forEach(btn => btn.classList.remove('active'));
      contents.forEach(content => content.classList.remove('active'));

      // 2. Add active class to the clicked button and its target div
      button.classList.add('active');
      document.getElementById(targetId).classList.add('active');
    });
  });

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

  // React to system theme changes while in auto mode
  prefersDark.addEventListener('change', applySystemTheme);

  // Initial theme: auto (system default)
  setSelectedTheme('auto');
  applySystemTheme();

  function addUrlToList() {
    const urlValue = urlInput.value.trim();

    if (!urlValue) return;

    const listItem = document.createElement('li');
    const urlText = document.createElement('span');
    urlText.textContent = urlValue;

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.textContent = 'x';
    deleteButton.setAttribute('aria-label', `Delete ${urlValue}`);
    deleteButton.addEventListener('click', () => {
      listItem.remove();
    });

    listItem.appendChild(urlText);
    listItem.appendChild(deleteButton);
    listContent.appendChild(listItem);
    urlInput.value = '';
  }

  addButton.addEventListener('click', addUrlToList);

  urlInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addUrlToList();
    }
  });
});