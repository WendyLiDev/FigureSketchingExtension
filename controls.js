// controls.js

var started = false;
var paused = false;

/** ================ STORED USER PREFERENCES ================ */

// {number} The index of user's preference for how many seconds for each sketch
var sketchLengthSelected = 0;
const SKETCH_LENGTH_KEY = "sketchLength";
// TODO: Move constants to a shared constants file
// changes to this need to be updated in background.js
const SKETCH_LENGTH_OPTIONS = [30, 60, 120, 180, 300, 600, 1800, 3600, 7200, -1];

// {number} The index of user's preference for how many seconds to skip over between sketches
var frameIntervalSelected = 0;
const FRAME_INTERVAL_KEY = "frameInterval";
const FRAME_INTERVAL_OPTIONS = [1, 2, 3, 5, 10, 15, 30, 60, 120, 180];
const FRAME_INTERVAL_OPTION_NAMES = [
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

// {boolean} The current theme which is true for light mode and false for dark mode
var currentTheme = true;
const THEME_KEY = "theme";

/** ========================= SETUP =========================== */

loadPrefs();

chrome.runtime.sendMessage({ cmd: 'GET_TIME' }, response => {
    if (response.time) {
        GetElementById('time').innerHTML = getTime(response.time);
    }
});

/** ================ RENDER ELEMENTS TO DOM =================== */

/* ============ Draggable element ============ */  
const draggableDiv = Div("controls");
draggableDiv.style.position = 'fixed';
draggableDiv.style.top = '20px';
draggableDiv.style.right = '20px';
draggableDiv.style.opacity = "0";

// Add mousedown event listener to enable dragging
let isDragging = false;
let offsetX, offsetY;

draggableDiv.addEventListener('mousedown', (e) => {
    if (e.button !== 0) { return; }
    isDragging = true;
    offsetX = e.clientX - draggableDiv.getBoundingClientRect().left;
    offsetY = e.clientY - draggableDiv.getBoundingClientRect().top;
    // Don't propogate the event to the document
    if (!!e.stopPropagation) {
        e.stopPropagation();   // W3C model
    } else {
        e.cancelBubble = true; // IE model
    }
});

// Handle the dragging functionality
document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        draggableDiv.style.left = e.clientX - offsetX + 'px';
        draggableDiv.style.top = e.clientY - offsetY + 'px';
    }
    // Don't propogate the event to the document
    if (!!e.stopPropagation) {
        e.stopPropagation();   // W3C model
    } else {
        e.cancelBubble = true; // IE model
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

document.body.appendChild(draggableDiv);

/* ============ LHS - Time display ============ */
const lhsControls = Div("lhs-controls");
draggableDiv.appendChild(lhsControls);

// Time display
const timeDisplay = Div("time-display");
lhsControls.appendChild(timeDisplay);
const time = H1("time", "30:00");
timeDisplay.appendChild(time);

// Frame interval preview
const frameIntervalPreview = Div("frame-interval-preview", "frame-interval-preview-no-animation");
frameIntervalPreview.textContent = FRAME_INTERVAL_OPTION_NAMES[frameIntervalSelected];
lhsControls.appendChild(frameIntervalPreview);

// Progress Bar
const progressBar = Div('progress-bar');
progressBar.hidden = true;
lhsControls.appendChild(progressBar);
const progress = Div('progress');
progressBar.appendChild(progress);

function updateProgressBarWidth(timeLeft) {
    let remainingRatio = timeLeft / SKETCH_LENGTH_OPTIONS[sketchLengthSelected];
    let calculatedWidth = 360 - (360 * remainingRatio);
    progress.style.width = `${calculatedWidth}px`;
    progress.style.backgroundColor = (remainingRatio < 0.2) ?
        '#D94C4C' :
        'var(--fig-drawing-ext-text-color)'; 
}

// Theme toggle button
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
    updatePref(THEME_KEY, currentTheme);
})

function updateDOMTheme() {
    (currentTheme) ? changeLightTheme() : changeDarkTheme();

    // Update pause, play, forward, and back button images
    const currTheme = currentTheme ? "light" : "dark";
    const backButton = GetElementById('control-button-go-back');
    var backButtonImg = document.createElement("img");
    backButtonImg.src =  chrome.runtime.getURL(`./images/button_icons_back_${currTheme}.png`);
    backButton.removeChild(backButton.firstChild);
    backButton.appendChild(backButtonImg);

    const nextButton = GetElementById('control-button-go-forward');
    var nextButtonImg = document.createElement("img");
    nextButtonImg.src =  chrome.runtime.getURL(`./images/button_icons_next_${currTheme}.png`);
    nextButton.removeChild(nextButton.firstChild);
    nextButton.appendChild(nextButtonImg);
    
    const pauseButton = GetElementById('control-button-pause');
    var pauseButtonImg = document.createElement("img");
    pauseButtonImg.src =  chrome.runtime.getURL(`./images/button_icons_pause_${currTheme}.png`);
    pauseButton.removeChild(pauseButton.firstChild);
    pauseButton.appendChild(pauseButtonImg);
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

function updateSketchTimePreview() {
    if(sketchLengthSelected === 9) {
        GetElementById('time').innerHTML = 'no limit';
        return;
    }
    GetElementById('time').innerHTML = getTime(SKETCH_LENGTH_OPTIONS[sketchLengthSelected]);
}

function updateFrameIntervalPreview() {
    GetElementById('frame-interval-preview').textContent = FRAME_INTERVAL_OPTION_NAMES[frameIntervalSelected];
}

function triggerFrameIntervalAnimation() {
    frameIntervalPreview.className = 'figure-drawing-extension-frame-interval-animation';
    setTimeout(() => {
        frameIntervalPreview.className = 'figure-drawing-extension-frame-interval-preview-no-animation';
    }, 330);
}

function updateTimerContent(){
    if(started){
        chrome.runtime.sendMessage({ cmd: 'GET_TIME' }, response => {
            if (response.time) {
                GetElementById('time').innerHTML = getTime(response.time);
                updateProgressBarWidth(response.time);
            }
        });
        setTimeout(updateTimerContent, 100);
    }
}

/* ============ RHS - Selection controls ============ */
const rhsControls = Div("rhs-controls");
draggableDiv.appendChild(rhsControls);

// Close button
const closeButton = Button('close', 'x');
draggableDiv.appendChild(closeButton);
closeButton.addEventListener("mouseup", (e) => {
    draggableDiv.style.opacity = "0";
    if (started) {
        endTimer();
    }
});

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

function createSelectionControl(id, title) {
    const selectControl = Div("select-control-" + id);
    selectionControls.appendChild(selectControl);

    const selectTitle = H1("select-title-" + id, title);
    selectTitle.classList.add("figure-drawing-extension-select-title");
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
                    updatePref(SKETCH_LENGTH_KEY, sketchLengthSelected);
                    chrome.runtime.sendMessage({ cmd: 'UPDATE_TIME' });
                }
            });
            plusButton.addEventListener("mouseup", (e) => {
                if(sketchLengthSelected < 9) {
                    sketchLengthSelected++;
                    levelBar.appendChild(Div('', 'selection-level-bar-square'));
                    updateSketchTimePreview();
                    updatePref(SKETCH_LENGTH_KEY, sketchLengthSelected);
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
                    updatePref(FRAME_INTERVAL_KEY, frameIntervalSelected);
                    triggerFrameIntervalAnimation();
                }
            });
            plusButton.addEventListener("mouseup", (e) => {
                if(frameIntervalSelected < 9) {
                    frameIntervalSelected++;
                    levelBar.appendChild(Div('', 'selection-level-bar-square'));
                    updateFrameIntervalPreview();
                    updatePref(FRAME_INTERVAL_KEY, frameIntervalSelected);
                    triggerFrameIntervalAnimation();
                }
            });
            break;
    }
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

function createControlButton(id, textContent) {
    const button = Button('control-button-' + id);
    button.className = "figure-drawing-extension-control-button";
    const currTheme = currentTheme ? "light" : "dark";
    var img = document.createElement("img");
    switch (id){
        case "go-back":
            img.src = chrome.runtime.getURL(`./images/button_icons_back_${currTheme}.png`);
            button.addEventListener('mouseup', (e) => {
                if (e.button !== 0) { return; }
                chrome.runtime.sendMessage({ cmd: 'TRIGGER_BACK' });
            })
            break;
        case "pause":
            img.src = chrome.runtime.getURL(`./images/button_icons_pause_${currTheme}.png`);
            button.addEventListener('mouseup', (e) => {
                if (e.button !== 0) { return; }
                chrome.runtime.sendMessage({ cmd: 'TRIGGER_PAUSE_TIMER' });
                paused = !paused;
                updatePauseButton();
            })
            break;
        case "go-forward":
            img.src = chrome.runtime.getURL(`./images/button_icons_next_${currTheme}.png`);
            button.addEventListener('mouseup', (e) => {
                if (e.button !== 0) { return; }
                chrome.runtime.sendMessage({ cmd: 'TRIGGER_NEXT' });
            })
            break;
    }

    button.appendChild(img);
    controlButtons.appendChild(button);
}

function updatePauseButton(){
    const pauseButton = GetElementById('control-button-pause');
    const currTheme = currentTheme ? "light" : "dark";
    var img = document.createElement("img");
    img.src = paused ? chrome.runtime.getURL(`./images/button_icons_play_${currTheme}.png`) :
                       chrome.runtime.getURL(`./images/button_icons_pause_${currTheme}.png`);
    pauseButton.removeChild(pauseButton.firstChild);
    pauseButton.appendChild(img);
}

function createMainButton(id, title) {
    const button = Button("main-button-" + id, title);
    button.className = "figure-drawing-extension-main-button";
    button.addEventListener('mouseup', (e) => {
        if (e.button !== 0) { return; }
        paused = false;
        updatePauseButton();
        if(!started) {
            startTimer();
        } else {
            endTimer();
        }
    });

    rhsControls.appendChild(button);
}

const button = GetElementById('main-button-start');

function startTimer() {
    button.textContent = "end";
    frameIntervalPreview.hidden = true;
    themeButton.hidden = true;
    selectionControls.style.display = "none";
    controlButtons.style.display = "block";
    progressBar.hidden = false;
    started = true;
    chrome.runtime.sendMessage({ cmd: 'TRIGGER_START_TIMER' });
    updateTimerContent();
}

function endTimer() {
    button.textContent = "start";
    frameIntervalPreview.hidden = false;
    themeButton.hidden = false;
    selectionControls.style.display = "block";
    controlButtons.style.display = "none";
    progressBar.hidden = true;
    started = false;
    chrome.runtime.sendMessage({ cmd: 'TRIGGER_END_TIMER' });
    GetElementById('time').innerHTML = getTime(SKETCH_LENGTH_OPTIONS[sketchLengthSelected]);
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
        if(SKETCH_LENGTH_OPTIONS[sketchLengthSelected] === -1){
            return 'no limit';
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
        case SKETCH_LENGTH_KEY:
            chrome.storage.sync.set({ sketchLength: value }, function() {
                if (chrome.runtime.lastError) {
                    console.error('Error setting value: ' + chrome.runtime.lastError);
                }
            });
            break;
        case FRAME_INTERVAL_KEY:
            chrome.storage.sync.set({ frameInterval: value }, function() {
                if (chrome.runtime.lastError) {
                    console.error('Error setting value: ' + chrome.runtime.lastError);
                }
            });
            break;
        case THEME_KEY:
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
        case SKETCH_LENGTH_KEY:
            return new Promise((resolve, reject) => {
                chrome.storage.sync.get([SKETCH_LENGTH_KEY], function(result) {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve(result.sketchLength);
                    }
                });
            }) 
        case FRAME_INTERVAL_KEY:
            return new Promise((resolve, reject) => {
                chrome.storage.sync.get([FRAME_INTERVAL_KEY], function(result) {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve(result.frameInterval);
                    }
                });
            })
        case THEME_KEY:
            return new Promise((resolve, reject) => {
                chrome.storage.sync.get([THEME_KEY], function(result) {
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
      const sketchLengthData = await getPref(SKETCH_LENGTH_KEY);
      if(!sketchLengthData) {
        sketchLengthSelected = 0; // Set default sketch length if it doesnt exist
      } else {
        sketchLengthSelected = sketchLengthData;
      }
      setupLevelBar('sketch-time');
      
      const frameIntervalData = await getPref(FRAME_INTERVAL_KEY);
      if(!frameIntervalData) {
        frameIntervalSelected = 0; // Set default frame interval if it doesnt exist
      } else {
        frameIntervalSelected = frameIntervalData;
      }
      setupLevelBar('frame-interval');
      updateFrameIntervalPreview();

      const themeData = await getPref(THEME_KEY);
      currentTheme = themeData;
      updateDOMTheme();
    } catch (error) {
      console.error(error);
    }
}
