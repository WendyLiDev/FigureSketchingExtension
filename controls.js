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

