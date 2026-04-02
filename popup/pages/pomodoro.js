// popup/pages/pomodoro.js
// Pomodoro timer UI — communicates with background.js via POMODORO_* messages.

const timeDisplay = document.getElementById('timeDisplay');
const phaseDisplay = document.getElementById('phaseDisplay');
const workHours = document.getElementById('workHours');
const workMins = document.getElementById('workMins');
const breakHours = document.getElementById('breakHours');
const breakMins = document.getElementById('breakMins');
const startBtn = document.getElementById('startBtn');

let localDisplayInterval = null;

function formatTime(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function syncDisplay() {
  chrome.runtime.sendMessage({ action: 'POMODORO_GET_STATE' }, (state) => {
    if (!state) return;
    timeDisplay.innerText = formatTime(state.remainingSeconds);
    phaseDisplay.innerText = state.phase + ' PHASE';

    if (state.isRunning) {
      startBtn.textContent = 'Running...';
      startBtn.disabled = true;
      if (!localDisplayInterval) {
        localDisplayInterval = setInterval(syncDisplay, 1000);
      }
    } else {
      startBtn.textContent = state.remainingSeconds > 0 ? 'Resume' : 'Start';
      startBtn.disabled = false;
      clearInterval(localDisplayInterval);
      localDisplayInterval = null;
    }
  });
}

startBtn.addEventListener('click', () => {
  const wTime = (parseInt(workHours.value) || 0) * 3600 + (parseInt(workMins.value) || 0) * 60;
  const bTime = (parseInt(breakHours.value) || 0) * 3600 + (parseInt(breakMins.value) || 0) * 60;
  if (wTime <= 0) return;
  chrome.runtime.sendMessage({ action: 'POMODORO_START', workTime: wTime, breakTime: bTime }, () => {
    syncDisplay();
  });
});

document.getElementById('pauseBtn').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'POMODORO_PAUSE' }, () => {
    syncDisplay();
  });
});

document.getElementById('resetBtn').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'POMODORO_RESET' }, () => {
    timeDisplay.innerText = '00:00:00';
    phaseDisplay.innerText = 'WORK PHASE';
    startBtn.textContent = 'Start';
    startBtn.disabled = false;
    clearInterval(localDisplayInterval);
    localDisplayInterval = null;
  });
});

syncDisplay();
