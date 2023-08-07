// popup.js

let start = false;
let pause = false;

/**
 * ==========================================================
 * ========================= SETUP ==========================
 * ==========================================================
 */
chrome.runtime.sendMessage({ cmd: 'GET_IF_TIME_STARTED' }, response => {
    if (response.hasTimerStarted) {
        start = response.hasTimerStarted;
        if (response.hasTimerStarted){
            updateTimerContent();
            enableTimerControls();
        }
    }
});

chrome.runtime.sendMessage({ cmd: 'GET_IF_TIME_PAUSED' }, response => {
    if (response.hasTimerPaused) {
        pause = response.hasTimerPaused;
    }
});

chrome.runtime.sendMessage({ cmd: 'GET_TIME' }, response => {
    if (response.time) {
        document.getElementById('timer').innerHTML = getTime(response.time);
    }
});

/**  
 * ========== SKETCH LENGTH SELECT ==========
 * Initializing and handling event changes for the sketch length select element
 *  */

// Initialize select with user's preferred sketch length
const sketchLengthSelectElement = document.getElementById("sketchTime");
sketchLengthSelectElement.addEventListener("change", handleSketchLengthSelectChange)

chrome.storage.sync.get("sketchLength", ({ sketchLength }) => {
    sketchLengthSelectElement.value = sketchLength;
});

function handleSketchLengthSelectChange(event) {
    chrome.storage.sync.set({sketchLength: sketchLengthSelectElement.value});
    chrome.runtime.sendMessage({ cmd: 'TRIGGER_SKETCH_LENGTH_CHANGED' });
    document.getElementById('timer').innerHTML = getTime(sketchLengthSelectElement.value);
}

/** 
 * ========== SKIP SECONDS SELECT ==========
 * Initializing and handling event changes for the skip seconds select element
 * */

// Initialize select with user's preferred number of seconds to skip
const skipSecondsSelectElement = document.getElementById("skipTime");
skipSecondsSelectElement.addEventListener("change", handleSkipTimeSelectChange)

chrome.storage.sync.get("skipTime", ({ skipTime }) => {
    skipSecondsSelectElement.value = skipTime;
});

function handleSkipTimeSelectChange(event) {
    chrome.storage.sync.set({skipTime: skipSecondsSelectElement.value})
}

/**
 * ==========================================================
 * ======================= END SETUP ========================
 * ==========================================================
 */



/**
 * ========== TIMER ==========
 */
function updateTimerContent(){
    chrome.runtime.sendMessage({ cmd: 'GET_TIME' }, response => {
        if (response.time) {
            document.getElementById('timer').innerHTML = getTime(response.time);
        }
    });
    setTimeout(updateTimerContent, 100);
}

// {string} HELPER Format string as 00:00 or 00:00:00
function getTimerString (seconds, minutes, hours){
    let timerString = '';
    if (hours != 0){
        if (hours < 10){
            timerString += '0';
        }
        timerString += String(hours) + ':';
    }
    if(minutes < 10 ){
        timerString += '0';
    }
    timerString += String(minutes) + ':';
    if (seconds < 10) {
        timerString += '0';
    }
    timerString += String(seconds);
    return timerString;
}

// {string} HELPER Takes time given in seconds and returns formatted string
function getTime(seconds) {
    if(sketchLengthSelectElement.value == 'indefinite'){
        return '';
    }

    const sec = Number(seconds) % 60;
    const min = Math.floor(seconds / 60) % 60;
    const hrs = Math.floor(Math.floor(seconds / 60) / 60);

    return getTimerString(sec, min, hrs);
}

/**
 * ========== CONTROL BUTTONS ==========
 */
let controls = document.getElementById("controls");
const header = document.getElementById("header");

const startButton = document.getElementById("startButton");
const backButton = document.getElementById("backButton");
const pauseButton = document.getElementById("pauseButton");
const nextButton = document.getElementById("nextButton");
const endButton = document.getElementById("endButton");
startButton.addEventListener("click", handleStartButtonClick);
endButton.addEventListener("click", handleEndButtonClick);

function handleStartButtonClick(event) {
    start = true;
    enableTimerControls();
    startBackgroundTimer(sketchLengthSelectElement.value);
    updateTimerContent();
}

function handleEndButtonClick(event) {
    start = false;
    enableStartingControls();
    endBackgroundTimer();
}

// When the start button is clicked, trigger timer to begin
function startBackgroundTimer(time) {
    chrome.runtime.sendMessage({ cmd: 'TRIGGER_START_TIMER', when: time });
}

// When next button is clicked, trigger video to move to the next frame
nextButton.addEventListener("click", async () => {
    chrome.runtime.sendMessage({ cmd: 'TRIGGER_NEXT' });
});

// When pause button is clicked, pause background timer
pauseButton.addEventListener("click", async () => {
    chrome.runtime.sendMessage({ cmd: 'TRIGGER_PAUSE_TIMER' });
});

// When back button is clicked, trigger video to move to the previous frame
backButton.addEventListener("click", async () => {
    chrome.runtime.sendMessage({ cmd: 'TRIGGER_BACK' });
});

// When end button is clicked, reset and end timer
function endBackgroundTimer() {
    chrome.runtime.sendMessage({ cmd: 'TRIGGER_END_TIMER' });
}

// {void} HELPER Show back, pause, skip and end buttons
function enableTimerControls() {
    /** Show back, next, and end buttons, hide start button */
    startButton.hidden = true;
    backButton.hidden = false;
    pauseButton.hidden = false;
    nextButton.hidden = false;
    endButton.hidden = false;

    /** Disable controls when sketching has begun */
    const sketchTimeSelect = document.getElementById("sketchTime");
    sketchTimeSelect.disabled = true;
    sketchTimeSelect.ariaDisabled = true;

    const skipTimeSelect = document.getElementById("skipTime");
    skipTimeSelect.disabled = true;
    skipTimeSelect.ariaDisabled = true;
}

// {void} HELPER Show start button
function enableStartingControls() {
    /** Show start button, remove back, next, and end buttons */
    backButton.hidden = true;
    pauseButton.hidden = true;
    nextButton.hidden = true;
    endButton.hidden = true;
    startButton.hidden = false;

    /** Enable controls when sketching has begun */
    const sketchTimeSelect = document.getElementById("sketchTime");
    sketchTimeSelect.disabled = false;
    sketchTimeSelect.ariaDisabled = false;

    const skipTimeSelect = document.getElementById("skipTime");
    skipTimeSelect.disabled = false;
    skipTimeSelect.ariaDisabled = false;
}

/** 
 * ========== MINIMIZE BUTTONS ==========
 * */
let minimized = false;
const minimizeButton = document.getElementById("minimizeButton");

function handleMinimizeButtonClick() {
    const ui = document.getElementById("UI");
    if(!minimized){
        ui.hidden = true;
        header.hidden = true;
        document.getElementById("minimizeButton").innerHTML = "Expand";
    }
    else{
        ui.hidden = false;
        header.hidden = false;
        document.getElementById("minimizeButton").innerHTML = "Minimize";
    }
    minimized = !minimized;
}

minimizeButton.addEventListener("click", handleMinimizeButtonClick);







/** ***** Demo button code to be removed: ***** */
// Initialize button with user's preferred color
let changeColor = document.getElementById("changeColor");
changeColor.hidden = true;

chrome.storage.sync.get("color", ({ color }) => {
  changeColor.style.backgroundColor = color;
});

// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: setPageBackgroundColor,
    });
  });
  
  // The body of this function will be executed as a content script inside the
  // current page
  function setPageBackgroundColor() {
    chrome.storage.sync.get("color", ({ color }) => {
      document.body.style.backgroundColor = color;
    });
}
