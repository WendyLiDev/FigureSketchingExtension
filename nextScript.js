chrome.storage.sync.get("skipTime", ({ skipTime }) => {
    if (document.querySelector('video')){
        document.querySelector('video').currentTime =
            document.querySelector('video').currentTime + Number(skipTime);
        document.querySelector('video').pause();
        // while(document.getElementsByClassName("ytp-ad-skip-button ytp-button")){
        //     console.log("This is called");
        //     document.querySelector('video').play();
        //     document.querySelector('video').currentTime + 30;
        //     document.getElementsByClassName("ytp-ad-skip-button ytp-button").click();
        // }
    }
});

