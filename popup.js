// popup.js

import { getTime } from './scripts/helpers.js'

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
