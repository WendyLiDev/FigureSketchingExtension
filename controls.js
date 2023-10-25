
// Create a new div element
const draggableDiv = document.createElement('div');
draggableDiv.id = "figure-drawing-extension-controls";
draggableDiv.style.position = 'fixed';
draggableDiv.style.top = '20px';
draggableDiv.style.right = '20px';

const timeDisplay = document.createElement('div');
timeDisplay.id = "time-display";
timeDisplay.innerHTML = `
    <div id="vertical-center">
        <div id="clock-container">
            <div id="display-1" class="display-container display-size-12 display-no-0">
                <div class="segment-x segment-a"><span class="segment-border"></span></div>
                <div class="segment-y segment-b"><span class="segment-border"></span></div>
                <div class="segment-y segment-c"><span class="segment-border"></span></div>
                <div class="segment-x segment-d"><span class="segment-border"></span></div>
                <div class="segment-y segment-e"><span class="segment-border"></span></div>
                <div class="segment-y segment-f"><span class="segment-border"></span></div>
                <div class="segment-x segment-g"><span class="segment-border"></span></div>
            </div>
            <div id="display-2" class="display-container display-size-12 display-no-1">
                <div class="segment-x segment-a"><span class="segment-border"></span></div>
                <div class="segment-y segment-b"><span class="segment-border"></span></div>
                <div class="segment-y segment-c"><span class="segment-border"></span></div>
                <div class="segment-x segment-d"><span class="segment-border"></span></div>
                <div class="segment-y segment-e"><span class="segment-border"></span></div>
                <div class="segment-y segment-f"><span class="segment-border"></span></div>
                <div class="segment-x segment-g"><span class="segment-border"></span></div>
            </div>
            <div id="display-3" class="display-container display-size-12 display-no-2">
                <div class="segment-x segment-a"><span class="segment-border"></span></div>
                <div class="segment-y segment-b"><span class="segment-border"></span></div>
                <div class="segment-y segment-c"><span class="segment-border"></span></div>
                <div class="segment-x segment-d"><span class="segment-border"></span></div>
                <div class="segment-y segment-e"><span class="segment-border"></span></div>
                <div class="segment-y segment-f"><span class="segment-border"></span></div>
                <div class="segment-x segment-g"><span class="segment-border"></span></div>
            </div>
            <div id="display-4" class="display-container display-size-12 display-no-3">
                <div class="segment-x segment-a"><span class="segment-border"></span></div>
                <div class="segment-y segment-b"><span class="segment-border"></span></div>
                <div class="segment-y segment-c"><span class="segment-border"></span></div>
                <div class="segment-x segment-d"><span class="segment-border"></span></div>
                <div class="segment-y segment-e"><span class="segment-border"></span></div>
                <div class="segment-y segment-f"><span class="segment-border"></span></div>
                <div class="segment-x segment-g"><span class="segment-border"></span></div>
            </div>
            <div id="display-5" class="display-container display-size-12 display-no-4">
                <div class="segment-x segment-a"><span class="segment-border"></span></div>
                <div class="segment-y segment-b"><span class="segment-border"></span></div>
                <div class="segment-y segment-c"><span class="segment-border"></span></div>
                <div class="segment-x segment-d"><span class="segment-border"></span></div>
                <div class="segment-y segment-e"><span class="segment-border"></span></div>
                <div class="segment-y segment-f"><span class="segment-border"></span></div>
                <div class="segment-x segment-g"><span class="segment-border"></span></div>
            </div>
            <div id="display-6" class="display-container display-size-12 display-no-5">
                <div class="segment-x segment-a"><span class="segment-border"></span></div>
                <div class="segment-y segment-b"><span class="segment-border"></span></div>
                <div class="segment-y segment-c"><span class="segment-border"></span></div>
                <div class="segment-x segment-d"><span class="segment-border"></span></div>
                <div class="segment-y segment-e"><span class="segment-border"></span></div>
                <div class="segment-y segment-f"><span class="segment-border"></span></div>
                <div class="segment-x segment-g"><span class="segment-border"></span></div>
            </div>
        </div>
    </div>
`;
timeDisplay.style.position = 'relative';
timeDisplay.style.top = '20px';
timeDisplay.style.left = '20px';
draggableDiv.appendChild(timeDisplay);


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

//===
// https://codepen.io/0x04/pen/AEjQwB

var currentdisplayNo = 0;
var display1 = document.getElementById('display-1');
var display2 = document.getElementById('display-2');
var display3 = document.getElementById('display-3');
var display4 = document.getElementById('display-4');
var display5 = document.getElementById('display-5');
var display6 = document.getElementById('display-6');

function zeroFill(string, length) {
	for (var i=0, l=length-string.length; i<l; i++) {
		string = '0' + string;
	}
	return string;
}

function setdisplays() {
	var d = new Date();
	var h = zeroFill(d.getHours().toString(),   2);
	var m = zeroFill(d.getMinutes().toString(), 2);
	var s = zeroFill(d.getSeconds().toString(), 2);
	
	var baseClass = 'display-container display-size-12 display-no-';
	
	display1.className = baseClass + h[0];
	display2.className = baseClass + h[1];
	display3.className = baseClass + m[0];
	display4.className = baseClass + m[1];
	display5.className = baseClass + s[0];
	display6.className = baseClass + s[1];
	
	//document.body.style.backgroundColor = '#' + (s + m + h).toString(16);
}

setInterval(setdisplays, 1000);
setdisplays();