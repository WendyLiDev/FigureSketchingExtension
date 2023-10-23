// helpers.js

/**
 * ========== TIMER ==========
 */

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
export function getTime(seconds) {
    const sketchLengthSelectElement = document.getElementById("sketchTime");
    if(sketchLengthSelectElement.value == 'indefinite'){
        return '';
    }

    const sec = Number(seconds) % 60;
    const min = Math.floor(seconds / 60) % 60;
    const hrs = Math.floor(Math.floor(seconds / 60) / 60);

    return getTimerString(sec, min, hrs);
}