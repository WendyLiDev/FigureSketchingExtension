chrome.storage.sync.get("skipTime", ({ skipTime }) => {
    if (document.querySelector('video')){
        document.querySelector('video').currentTime =
            document.querySelector('video').currentTime - Number(skipTime);
        document.querySelector('video').pause();
    }
});

