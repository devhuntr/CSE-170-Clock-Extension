// background.js

let timerState = {
  isRunning: false,
  phase: 'WORK', // 'WORK' or 'BREAK'
  timeRemaining: 0,
  workDuration: 60 * 60, // Default 1 hour in seconds
  breakDuration: 20 * 60, // Default 20 mins in seconds
};

let timerInterval = null;

// The heartbeat function
function tick() {
  if (timerState.timeRemaining > 0) {
    timerState.timeRemaining--;
  } else {
    switchPhase();
  }
}

function switchPhase() {
  if (timerState.phase === 'WORK') {
    timerState.phase = 'BREAK';
    timerState.timeRemaining = timerState.breakDuration;
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png', // Requires this icon in your folder
      title: 'FocusGuard',
      message: 'Great job! Time for a break.'
    });
  } else {
    timerState.phase = 'WORK';
    timerState.timeRemaining = timerState.workDuration;
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'FocusGuard',
      message: 'Break is over. Time to focus!'
    });
  }
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'GET_STATE') {
    sendResponse(timerState);
  } 
  
  else if (message.action === 'START') {
    if (!timerState.isRunning) {
      // Update durations based on user input
      timerState.workDuration = message.workTime;
      timerState.breakDuration = message.breakTime;
      
      // Only reset the timeRemaining if we are starting fresh
      if (timerState.timeRemaining === 0) {
        timerState.timeRemaining = timerState.workDuration;
        timerState.phase = 'WORK';
      }
      
      timerState.isRunning = true;
      timerInterval = setInterval(tick, 1000);
      sendResponse({ status: "started" });
    }
  } 
  
  else if (message.action === 'STOP') {
    timerState.isRunning = false;
    clearInterval(timerInterval);
    timerInterval = null;
    sendResponse({ status: "stopped" });
  }

  else if (message.action === 'RESET') {
    timerState.isRunning = false;
    clearInterval(timerInterval);
    timerInterval = null;
    timerState.timeRemaining = 0;
    timerState.phase = 'WORK';
    sendResponse(timerState);
  }

  // Keep the message channel open for async responses
  return true; 
});