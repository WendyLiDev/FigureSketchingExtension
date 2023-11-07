// nextScript.js

chrome.storage.sync.get("frameInterval", ({ frameInterval }) => {
    if (document.querySelector('video')){
        document.querySelector('video').currentTime =
            document.querySelector('video').currentTime +
            Number(frameIntervalOptions[frameInterval]);
        document.querySelector('video').pause();
    }
});

