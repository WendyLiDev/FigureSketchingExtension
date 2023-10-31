var started = false;

function createSelectionControl(id, title) {
    const selectControl = document.createElement('div');
    selectControl.id = "figure-drawing-extension-select-control-" + id;
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
    const button = document.createElement('button');
    button.id = "figure-drawing-extension-main-button-" + id;
    button.className = "figure-drawing-extension-main-button";
    button.textContent = title;
    button.addEventListener('mousedown', (e) => {
        const frameIntervalPreview = document.getElementById('figure-drawing-extension-frame-interval-preview');
        const themeButton = document.getElementById('figure-drawing-extension-theme-button');
        const progressBar = document.getElementById('figure-drawing-extension-progress-bar');
        if(!started) {
            button.textContent = "end";
            frameIntervalPreview.hidden = true;
            themeButton.hidden = true;
            progressBar.hidden = false;
            started = true;
        } else {
            button.textContent = "start";
            frameIntervalPreview.hidden = false;
            themeButton.hidden = false;
            progressBar.hidden = true;
            started = false;
        }
    });

    rhsControls.appendChild(button);
}

/* === Draggable element === */  
const draggableDiv = document.createElement('div');
draggableDiv.id = "figure-drawing-extension-controls";
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

/* === LHS - Time display === */
const lhsControls = document.createElement('div');
lhsControls.id = "figure-drawing-extension-lhs-controls";
draggableDiv.appendChild(lhsControls);

const timeDisplay = document.createElement('div');
timeDisplay.id = "figure-drawing-extension-time-display";
timeDisplay.innerHTML = `
    <h1>00:00:00</h1>
`;
timeDisplay.style.position = 'relative';
lhsControls.appendChild(timeDisplay);

const frameIntervalPreview = document.createElement('div');
frameIntervalPreview.id = "figure-drawing-extension-frame-interval-preview";
frameIntervalPreview.textContent = "3 seconds";
lhsControls.appendChild(frameIntervalPreview);

const progressBar = document.createElement('div');
progressBar.id = 'figure-drawing-extension-progress-bar';
progressBar.hidden = true;
lhsControls.appendChild(progressBar);

const themeButton = document.createElement('button');
themeButton.id = "figure-drawing-extension-theme-button";
themeButton.innerHTML = `
    <img id="figure-drawing-extension-theme-button-icon" alt="An icon for a button that changes the theme for the figure drawing extension">
`;
lhsControls.appendChild(themeButton);
let img = document.getElementById('figure-drawing-extension-theme-button-icon');
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

/* === RHS - Selection controls === */
const rhsControls = document.createElement('div');
rhsControls.id = "figure-drawing-extension-rhs-controls";
draggableDiv.appendChild(rhsControls);

const selectionControls = document.createElement('div');
selectionControls.id = "figure-drawing-extension-selection-controls";
rhsControls.appendChild(selectionControls);
createSelectionControl('sketch-time', 'sketch time');
createSelectionControl('frame-interval', 'frame interval');

createMainButton("start", "start");
