// background.js

let timerID;
let countdown = 0;
let backgroundTimerStarted = false;
let backgroundTimerPaused = false;
let triggerEndBackgroundTimer = false;

// TODO: Move constants to a shared constants file
// changes to this need to be updated in controls.js
const SKETCH_LENGTH_OPTIONS = [30, 60, 120, 180, 300, 600, 1800, 3600, 7200, -1];

/** ========================= SETUP =========================== */

function updateCountdown() {
  chrome.storage.sync.get("sketchLength", ({ sketchLength }) => {
    countdown = SKETCH_LENGTH_OPTIONS[sketchLength];
  });
}
updateCountdown();

/** ============== LISTEN IN BACKGROUND FOR CALLS ============== */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch(request.cmd) {
    case 'TRIGGER_START_TIMER':
      updateCountdown();
      start();
      backgroundTimerStarted = true;
      var countdownTime = setInterval(() => {
        if (triggerEndBackgroundTimer){
          clearInterval(countdownTime);
          resetTimer();
          triggerEndBackgroundTimer = false;
          backgroundTimerStarted = false;
        }
        else if(countdown === -1) {
          // No time limit - do nothing
        }
        else if (!backgroundTimerPaused && countdown > 0){
          countdown = countdown - 1;
        }
        else if (countdown === 0) {
          resetTimer();
          nextFrame();
        }
      }, 1000);
      break;
    case 'TRIGGER_BACK':
      resetTimer();
      previousFrame();
      break;
    case 'TRIGGER_NEXT':
      resetTimer();
      nextFrame();
      break;
    case 'TRIGGER_PAUSE_TIMER':
      backgroundTimerPaused = !backgroundTimerPaused;
      break;
    case 'TRIGGER_END_TIMER':
      triggerEndBackgroundTimer = true;
      backgroundTimerPaused = false;
      break;
    case 'TRIGGER_SKETCH_LENGTH_CHANGED':
      chrome.storage.sync.get("sketchLength", ({ sketchLength }) => {
        countdown = sketchLength;
      });
      break;
    case 'GET_TIME':
      sendResponse({ time: countdown });
      break;
    case 'UPDATE_TIME':
      updateCountdown();
      break;
    case 'GET_IF_TIME_STARTED': 
      sendResponse({ hasTimerStarted: backgroundTimerStarted });
      break;
    case 'GET_IF_TIME_PAUSED': 
      sendResponse({ hasTimerPaused: backgroundTimerPaused });
      break;
    case 'TRIGGER_SHOW_UI':
      showUI();
      break; 
  }
});

/** ======================== HELPERS ========================== */
function resetTimer() {
  chrome.storage.sync.get("sketchLength", ({ sketchLength }) => {
    countdown = SKETCH_LENGTH_OPTIONS[sketchLength];
  });
}

async function start() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['scripts/startScript.js'],
  });
}

async function nextFrame() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['scripts/nextScript.js'],
  });
}

async function previousFrame() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['scripts/backScript.js'],
  });
}

async function showUI() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['scripts/showUIScript.js'],
  });
}

/** TODO:
 * Add sleep and wake calls to prevent background script from being run constantly
 */
