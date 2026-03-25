# Chrome Setup Guide

Short version for teammates who can follow terminal + Chrome steps.

## 1) Clone the repo

Open PowerShell in the folder where you want the project, then run:

```powershell
git clone <REPO_URL>
cd CSE-170-Clock-Extension
```

If you already cloned it, just open that folder.

## 2) Load as unpacked extension

1. Open Chrome and go to chrome://extensions
2. Enable Developer mode (top right)
3. Click Load unpacked
4. Select the CSE-170-Clock-Extension folder (the one containing manifest.json)

You should now see FocusGuard in the extension list.

## 3) Run it

1. Pin FocusGuard from the Extensions menu (puzzle icon)
2. Click the FocusGuard icon to open the popup
3. Optional: open options from extension Details -> Extension options

## 4) Dev workflow (aka when you change something do this to see changes)

1. After saving your changes, go to chrome://extensions
2. Click Reload on FocusGuard
3. Reopen popup or refresh the page you are testing
