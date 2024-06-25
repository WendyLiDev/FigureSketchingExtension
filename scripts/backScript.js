// scripts/backScript.js

chrome.storage.sync.get("frameInterval", ({ frameInterval }) => {
    if (document.querySelector('video')){
        document.querySelector('video').currentTime =
            document.querySelector('video').currentTime -
            Number(FRAME_INTERVAL_OPTIONS[frameInterval]);
        document.querySelector('video').pause();
    }
});

