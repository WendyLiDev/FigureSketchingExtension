// showUIScript.js

if(!!draggableDiv) {
    draggableDiv.style.opacity = "100";
} else {
    let draggableDiv = document.getElementById("figure-drawing-extension-controls");
    if(draggableDiv) {
        draggableDiv.style.opacity = "100";
    }
}