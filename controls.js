
// Create a new div element
const draggableDiv = document.createElement('div');
draggableDiv.id = "figure-drawing-extension-controls";
draggableDiv.style.position = 'fixed';
draggableDiv.style.top = '20px';
draggableDiv.style.right = '20px';

const timeDisplay = document.createElement('div');
timeDisplay.id = "figure-drawing-extension-time-display";
timeDisplay.innerHTML = `
    <h1>00:00:00</h1>
`;
timeDisplay.style.position = 'relative';
// timeDisplay.style.top = '20px';
// timeDisplay.style.left = '20px';


const sketchTimeSelect = document.createElement('div');
sketchTimeSelect.id = "figure-drawing-extension-sketch-time-select"
sketchTimeSelect.innerHTML = `
    <h1>sketch time</h1>
    <span class="figure-drawing-extension-select">
        <button class='figure-drawing-extension-select-button'>-</button>
        <div class='figure-drawing-extension-selection-level-bar'></div>
        <button class='figure-drawing-extension-select-button'>+</button>
    </span>
`;

const frameIntervalSelect = document.createElement('div');
frameIntervalSelect.id = "figure-drawing-extension-frame-interval-select"
frameIntervalSelect.innerHTML = `
    <h1>frame interval</h1>
`;

const selectionControls = document.createElement('div');
selectionControls.id = "figure-drawing-extension-selection-controls"
selectionControls.appendChild(sketchTimeSelect);
selectionControls.appendChild(frameIntervalSelect);

draggableDiv.appendChild(timeDisplay);
draggableDiv.appendChild(selectionControls);

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
