// controls.js

var started = false;

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
timeDisplay.innerHTML = `
    <h1>00:00:00</h1>
`;
timeDisplay.style.position = 'relative';
lhsControls.appendChild(timeDisplay);

const frameIntervalPreview = Div("frame-interval-preview");
frameIntervalPreview.textContent = "3 seconds";
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

// TODO: Store this as a preference
// A boolean that holds true for light mode and false for dark mode
var currentTheme = true;
themeButton.addEventListener('mousedown', () => {
    const root = document.querySelector(':root');
    if (currentTheme) {
        root.style.setProperty('--fig-drawing-ext-background-color', '#2a2a2a');
        root.style.setProperty('--fig-drawing-ext-text-color', '#d9d9d9');
        root.style.setProperty('--fig-drawing-ext-button-hover-color', '#B8B9D5');
        root.style.setProperty('--fig-drawing-ext-accent-color', '#55566D');
        img.src = chrome.runtime.getURL("./images/theme_icon-light.png"); 
        currentTheme = false;
    } else {
        root.style.setProperty('--fig-drawing-ext-background-color', '#d9d9d9');
        root.style.setProperty('--fig-drawing-ext-text-color', '#2a2a2a');
        root.style.setProperty('--fig-drawing-ext-button-hover-color', '#353c5f');
        root.style.setProperty('--fig-drawing-ext-accent-color', '#889595');
        img.src = chrome.runtime.getURL("./images/theme_icon-dark.png");
        currentTheme = true;
    }
})

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
    const selectControl = Div("figure-drawing-extension-select-control-" + id);
    selectControl.innerHTML = `
        <h1>${title}</h1>
        <span class="figure-drawing-extension-select">
            <button class='figure-drawing-extension-select-button'>-</button>
            <div class='figure-drawing-extension-selection-level-bar'></div>
            <button class='figure-drawing-extension-select-button'>+</button>
        </span>
    `;

    selectionControls.appendChild(selectControl);
}

function createMainButton(id, title) {
    const button = Button("main-button-" + id, title);
    button.className = "figure-drawing-extension-main-button";
    button.addEventListener('mousedown', (e) => {
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
        } else {
            button.textContent = "start";
            frameIntervalPreview.hidden = false;
            themeButton.hidden = false;
            selectionControls.style.display = "block";
            controlButtons.style.display = "none";
            progressBar.hidden = true;
            started = false;
        }
    });

    rhsControls.appendChild(button);
}

function createControlButton(id, textContent) {
    const button = Button('control-button-' + id);
    button.className = "figure-drawing-extension-control-button";
    button.textContent = textContent;
    button.addEventListener('mousedown', (e) => {
        console.log("control button clicked!");
    })
    controlButtons.appendChild(button);
}

/* **************************************************************************  */
/* ***** Helpers *****  */
function Div(id) {
    const div = document.createElement('div');
    div.id = "figure-drawing-extension-" + id; 
    return div;
}

function Button(id, textContent) {
    const button = document.createElement('button'); 
    button.id = "figure-drawing-extension-" + id; 
    button.textContent = textContent;
    return button;
}

function GetElementById(id) {
    return document.getElementById('figure-drawing-extension-' + id);
}