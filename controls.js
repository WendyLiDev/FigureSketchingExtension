// controls.js

var started = false;
var paused = false;

const sketchLengthKey = "sketchLength";
var sketchLengthSelected = 0;
const sketchLengthOptions = [30, 60, 120, 180, 300, 600, 1800, 3600, 7200, 0];

const frameIntervalKey = "frameInterval";
var frameIntervalSelected = 0;
const frameIntervalOptions = [1, 2, 3, 5, 10, 15, 30, 60, 120, 180];
const frameIntervalOptionNames = [
    "1 second",
    "2 seconds",
    "3 seconds",
    "5 seconds",
    "10 seconds",
    "15 seconds",
    "30 seconds",
    "1 minute",
    "2 minutes",
    "3 minutes"
];

// A boolean that holds true for light mode and false for dark mode
const themeKey = "theme";
var currentTheme = true;

/**
 * ==========================================================
 * ========================= SETUP ==========================
 * ==========================================================
 */

loadPrefs();

chrome.runtime.sendMessage({ cmd: 'GET_TIME' }, response => {
    if (response.time) {
        GetElementById('time').innerHTML = getTime(response.time);
    }
});

function updateTimerContent(){
    chrome.runtime.sendMessage({ cmd: 'GET_TIME' }, response => {
        if (response.time) {
            GetElementById('time').innerHTML = getTime(response.time);
        }
    });
    setTimeout(updateTimerContent, 100);
}


/* **************************************************************************  */

/* === Draggable element === */  
const draggableDiv = Div("controls");
draggableDiv.style.position = 'fixed';
draggableDiv.style.top = '20px';
draggableDiv.style.right = '20px';

// Add mousedown event listener to enable dragging
let isDragging = false;
let offsetX, offsetY;

draggableDiv.addEventListener('mousedown', (e) => {
    if (e.button !== 0) { return; }
    isDragging = true;
    offsetX = e.clientX - draggableDiv.getBoundingClientRect().left;
    offsetY = e.clientY - draggableDiv.getBoundingClientRect().top;
});

// Handle the dragging functionality
document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        draggableDiv.style.left = e.clientX - offsetX + 'px';
        draggableDiv.style.top = e.clientY - offsetY + 'px';
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

// Append the draggable div to the body
document.body.appendChild(draggableDiv);

/* ====== LHS - Time display ====== */
const lhsControls = Div("lhs-controls");
draggableDiv.appendChild(lhsControls);

const timeDisplay = Div("time-display");
lhsControls.appendChild(timeDisplay);

const time = H1("time", "00:00:00");
timeDisplay.appendChild(time);

const frameIntervalPreview = Div("frame-interval-preview");
frameIntervalPreview.textContent = frameIntervalOptionNames[frameIntervalSelected];
lhsControls.appendChild(frameIntervalPreview);

const progressBar = Div('progress-bar');
progressBar.hidden = true;
lhsControls.appendChild(progressBar);

const themeButton = Button("theme-button");
themeButton.innerHTML = `
    <img id="figure-drawing-extension-theme-button-icon" alt="An icon for a button that changes the theme for the figure drawing extension">
`;
lhsControls.appendChild(themeButton);
let img = GetElementById('theme-button-icon');
img.src = chrome.runtime.getURL("./images/theme_icon-dark.png");

themeButton.addEventListener('mouseup', (e) => {
    if (e.button !== 0) { return; }
    currentTheme = !currentTheme;
    updateDOMTheme();
    updatePref(themeKey, currentTheme);
})

function updateDOMTheme() {
    (currentTheme) ? changeLightTheme() : changeDarkTheme();
}

function changeLightTheme() {
    const root = document.querySelector(':root');
    root.style.setProperty('--fig-drawing-ext-background-color', '#d9d9d9');
    root.style.setProperty('--fig-drawing-ext-text-color', '#2a2a2a');
    root.style.setProperty('--fig-drawing-ext-button-hover-color', '#353c5f');
    root.style.setProperty('--fig-drawing-ext-accent-color', '#889595');
    img.src = chrome.runtime.getURL("./images/theme_icon-dark.png");
}

function changeDarkTheme() {
    const root = document.querySelector(':root');
    root.style.setProperty('--fig-drawing-ext-background-color', '#2a2a2a');
    root.style.setProperty('--fig-drawing-ext-text-color', '#d9d9d9');
    root.style.setProperty('--fig-drawing-ext-button-hover-color', '#B8B9D5');
    root.style.setProperty('--fig-drawing-ext-accent-color', '#55566D');
    img.src = chrome.runtime.getURL("./images/theme_icon-light.png"); 
}

/* ====== RHS - Selection controls ====== */
const rhsControls = Div("rhs-controls");
draggableDiv.appendChild(rhsControls);


// Selection controls
const selectionControls = Div("selection-controls");
rhsControls.appendChild(selectionControls);
createSelectionControl('sketch-time', 'sketch time');
createSelectionControl('frame-interval', 'frame interval');

// Go forward, Pause, and Go back buttons
const controlButtons = Div('control-buttons');
controlButtons.style.display = "none";
rhsControls.appendChild(controlButtons);
createControlButton('go-back', "<<");
createControlButton('pause', "||");
createControlButton('go-forward', ">>");

// Main Start & End button
createMainButton("start", "start");

/* **************************************************************************  */
/* ***** Create Components *****  */
function createSelectionControl(id, title) {
    const selectControl = Div("select-control-" + id);
    selectionControls.appendChild(selectControl);

    const selectTitle = H1("select-title", title);
    const select = document.createElement('span');
    select.className = "figure-drawing-extension-select";
    selectControl.appendChild(selectTitle);
    selectControl.appendChild(select);
    
    const minusButton = Button(id + '-select-minus-button', '-', 'select-button');
    const levelBar = Div(id + '-selection-level-bar', 'selection-level-bar');
    const plusButton = Button(id + '-select-plus-button', '+', 'select-button');
    select.appendChild(minusButton);
    select.appendChild(levelBar);
    select.appendChild(plusButton);

    setupLevelBar(id);

    switch(id) {
        case 'sketch-time':
            minusButton.addEventListener("mouseup", (e) => {
                if(sketchLengthSelected > 0) {
                    sketchLengthSelected--;
                    levelBar.removeChild(levelBar.lastChild);
                    updateSketchTimePreview();
                    updatePref(sketchLengthKey, sketchLengthSelected);
                    chrome.runtime.sendMessage({ cmd: 'UPDATE_TIME' });
                }
            });
            plusButton.addEventListener("mouseup", (e) => {
                if(sketchLengthSelected < 9) {
                    sketchLengthSelected++;
                    levelBar.appendChild(Div('', 'selection-level-bar-square'));
                    updateSketchTimePreview();
                    updatePref(sketchLengthKey, sketchLengthSelected);
                    chrome.runtime.sendMessage({ cmd: 'UPDATE_TIME' });
                }
            });
            break;
        case 'frame-interval':
            minusButton.addEventListener("mouseup", (e) => {
                if(frameIntervalSelected > 0) {
                    frameIntervalSelected--;
                    levelBar.removeChild(levelBar.lastChild);
                    updateFrameIntervalPreview();
                    updatePref(frameIntervalKey, frameIntervalSelected);
                }
            });
            plusButton.addEventListener("mouseup", (e) => {
                if(frameIntervalSelected < 9) {
                    frameIntervalSelected++;
                    levelBar.appendChild(Div('', 'selection-level-bar-square'));
                    updateFrameIntervalPreview();
                    updatePref(frameIntervalKey, frameIntervalSelected);
                }
            });
            break;
    }
}

function updateSketchTimePreview() {
    if(sketchLengthSelected === 9) {
        GetElementById('time').innerHTML = 'no limit';
        return;
    }
    GetElementById('time').innerHTML = getTime(sketchLengthOptions[sketchLengthSelected]);
}

function updateFrameIntervalPreview() {
    GetElementById('frame-interval-preview').textContent = frameIntervalOptionNames[frameIntervalSelected];
}

function setupLevelBar(id) {
    const levelBar = GetElementById(id + '-selection-level-bar');
    let lvl = ((id === 'frame-interval') ? frameIntervalSelected : sketchLengthSelected) + 1;
    while (levelBar.children.length > 0) {
        levelBar.removeChild(levelBar.lastChild);
    }
    for(let i = 0; i < lvl; ++i) {
        levelBar.appendChild(Div('', 'selection-level-bar-square'));
    }
}

function createMainButton(id, title) {
    const button = Button("main-button-" + id, title);
    button.className = "figure-drawing-extension-main-button";
    button.addEventListener('mouseup', (e) => {
        if (e.button !== 0) { return; }
        const frameIntervalPreview = GetElementById('frame-interval-preview');
        const themeButton = GetElementById('theme-button');
        const progressBar = GetElementById('progress-bar');
        const selectionControls = GetElementById('selection-controls');
        const controlButtons = GetElementById('control-buttons');
        if(!started) {
            button.textContent = "end";
            frameIntervalPreview.hidden = true;
            themeButton.hidden = true;
            selectionControls.style.display = "none";
            controlButtons.style.display = "block";
            progressBar.hidden = false;
            started = true;
            chrome.runtime.sendMessage({ cmd: 'TRIGGER_START_TIMER',
                when: sketchLengthOptions[sketchLengthSelected] });
            updateTimerContent();
        } else {
            button.textContent = "start";
            frameIntervalPreview.hidden = false;
            themeButton.hidden = false;
            selectionControls.style.display = "block";
            controlButtons.style.display = "none";
            progressBar.hidden = true;
            started = false;
            chrome.runtime.sendMessage({ cmd: 'TRIGGER_END_TIMER' });
            GetElementById('time').innerHTML = getTime(sketchLengthOptions[sketchLengthSelected]);
        }
    });

    rhsControls.appendChild(button);
}

function createControlButton(id, textContent) {
    const button = Button('control-button-' + id);
    button.className = "figure-drawing-extension-control-button";
    button.textContent = textContent;
    switch (id){
        case "go-back":
            button.addEventListener('mouseup', (e) => {
                if (e.button !== 0) { return; }
                chrome.runtime.sendMessage({ cmd: 'TRIGGER_BACK' });
            })
            break;
        case "pause":
            button.addEventListener('mouseup', (e) => {
                if (e.button !== 0) { return; }
                chrome.runtime.sendMessage({ cmd: 'TRIGGER_PAUSE_TIMER' });
                paused = !paused;
                updatePauseButton();
            })
            break;
        case "go-forward":
            button.addEventListener('mouseup', (e) => {
                if (e.button !== 0) { return; }
                chrome.runtime.sendMessage({ cmd: 'TRIGGER_NEXT' });
            })
            break;
    }

    controlButtons.appendChild(button);
}

/* **************************************************************************  */
/* ========== TIMER ========== */
function updateTimerContent(){
    if(started){
        chrome.runtime.sendMessage({ cmd: 'GET_TIME' }, response => {
            if (response.time) {
                GetElementById('time').innerHTML = getTime(response.time);
            }
        });
        setTimeout(updateTimerContent, 100);
    }
}

/* ========== Pause Button ========== */
function updatePauseButton(){
    const pauseButton = GetElementById('control-button-pause');
    pauseButton.textContent = paused ? '>' : '||';
}

/* **************************************************************************  */
/* ***** Helpers *****  */
function Div(id, className) {
    const div = document.createElement('div');
    if(id !== ''){
        div.id = "figure-drawing-extension-" + id;
    }
    if(className !== '') {
        div.className = "figure-drawing-extension-" + className;
    }
    return div;
}

function Button(id, textContent, className) {
    const button = document.createElement('button'); 
    if(id !== '') {
        button.id = "figure-drawing-extension-" + id; 
    }
    if(className !== '') {
        button.className = "figure-drawing-extension-" + className;
    }
    button.textContent = textContent;
    button.addEventListener('mousedown', (e) => {
        e.stopPropagation();
    })
    return button;
}

function H1(id, textContent) {
    const h1 = document.createElement('h1'); 
    h1.id = "figure-drawing-extension-" + id; 
    h1.textContent = textContent;
    return h1;
}

function GetElementById(id) {
    return document.getElementById('figure-drawing-extension-' + id);
}

// {string} Format string as 00:00 or 00:00:00
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

// {string} Takes the time in seconds and returns a formatted string
function getTime(seconds) {
    if(GetElementById("time")){
        // when sketchLengthSelected is 9, the timer is set to infinite time 
        if(sketchLengthSelected === 9){
            return '';
        }

        const sec = Number(seconds) % 60;
        const min = Math.floor(seconds / 60) % 60;
        const hrs = Math.floor(Math.floor(seconds / 60) / 60);

        return getTimerString(sec, min, hrs);
    }

    return '';
}

function updatePref(key, value) {
    switch(key) {
        case sketchLengthKey:
            chrome.storage.sync.set({ sketchLength: value }, function() {
                if (chrome.runtime.lastError) {
                    console.error('Error setting value: ' + chrome.runtime.lastError);
                }
            });
            break;
        case frameIntervalKey:
            chrome.storage.sync.set({ frameInterval: value }, function() {
                if (chrome.runtime.lastError) {
                    console.error('Error setting value: ' + chrome.runtime.lastError);
                }
            });
            break;
        case themeKey:
            chrome.storage.sync.set({ theme: value }, function() {
                if (chrome.runtime.lastError) {
                    console.error('Error setting value: ' + chrome.runtime.lastError);
                }
            });
            break;
    }
}

function getPref(key) {
    switch (key) {
        case sketchLengthKey:
            return new Promise((resolve, reject) => {
                chrome.storage.sync.get([sketchLengthKey], function(result) {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve(result.sketchLength);
                    }
                });
            }) 
        case frameIntervalKey:
            return new Promise((resolve, reject) => {
                chrome.storage.sync.get([frameIntervalKey], function(result) {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve(result.frameInterval);
                    }
                });
            })
        case themeKey:
            return new Promise((resolve, reject) => {
                chrome.storage.sync.get([themeKey], function(result) {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve(result.theme);
                    }
                });
            })
    }
}

async function loadPrefs() {
    try {
      const sketchLengthData = await getPref(sketchLengthKey);
      sketchLengthSelected = sketchLengthData;
      setupLevelBar('sketch-time');
      
      const frameIntervalData = await getPref(frameIntervalKey);
      frameIntervalSelected = frameIntervalData;
      setupLevelBar('frame-interval');
      updateFrameIntervalPreview();

      const themeData = await getPref(themeKey);
      currentTheme = themeData;
      updateDOMTheme();
    } catch (error) {
      console.error(error);
    }
}
