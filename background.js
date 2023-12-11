// background.js

let timerID;
let countdown;
let backgroundTimerStarted = false;
let backgroundTimerPaused = false;
let triggerEndBackgroundTimer = false;

const sketchLengthOptions = [30, 60, 120, 180, 300, 600, 1800, 3600, 7200, 0];

/**
 * ==========================================================
 * ========================= SETUP ==========================
 * ==========================================================
 */

function updateCountdown() {
  chrome.storage.sync.get("sketchLength", ({ sketchLength }) => {
    countdown = sketchLengthOptions[sketchLength];
  });
}
updateCountdown();

/**
 * ==========================================================
 * ======================= END SETUP ========================
 * ==========================================================
 */


function resetTimer() {
  chrome.storage.sync.get("sketchLength", ({ sketchLength }) => {
    countdown = sketchLengthOptions[sketchLength];
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.cmd === 'TRIGGER_START_TIMER') {
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
      else if (!backgroundTimerPaused && countdown > 0){
        countdown = countdown - 1;
      }
      else if (countdown === 0) {
        resetTimer();
        nextFrame();
      }
    }, 1000)
  } else if (request.cmd === 'TRIGGER_BACK')  {
    resetTimer();
    previousFrame();
  } else if (request.cmd === 'TRIGGER_NEXT') {
    resetTimer();
    nextFrame();
  } else if (request.cmd === 'TRIGGER_PAUSE_TIMER') {
    backgroundTimerPaused = !backgroundTimerPaused;
  } else if (request.cmd === 'TRIGGER_END_TIMER') {
    triggerEndBackgroundTimer = true;
    backgroundTimerPaused = false;
  } else if (request.cmd === 'TRIGGER_SKETCH_LENGTH_CHANGED') {
    chrome.storage.sync.get("sketchLength", ({ sketchLength }) => {
      countdown = sketchLength;
    });
  } else if (request.cmd === 'GET_TIME') {
    sendResponse({ time: countdown });
  } else if (request.cmd === 'UPDATE_TIME') {
    updateCountdown();
  } else if (request.cmd === 'GET_IF_TIME_STARTED') { 
    sendResponse({ hasTimerStarted: backgroundTimerStarted });
  } else if (request.cmd === 'GET_IF_TIME_PAUSED') { 
    sendResponse({ hasTimerPaused: backgroundTimerPaused });
  } else if (request.cmd === 'TRIGGER_SHOW_UI') {
    showUI();
  }
});

/** TODO:
 * Add sleep and wake calls to prevent background script from being run constantly
 */
