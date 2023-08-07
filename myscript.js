// const observer = new MutationObserver(function(mutations_list) {
// 	mutations_list.forEach(function(mutation) {
// 		mutation.addedNodes.forEach(function(added_node) {
// 			if(added_node.id == 'child') {
// 				console.log('#child has been added');
// 				observer.disconnect();
// 			}
// 		});
// 	});
// });

// observer.observe(document.querySelector("#parent"), { subtree: false, childList: true });
// while(document.getElementsByClassName("ytp-ad-skip-button ytp-button")){
//     console.log("This is called");
//     document.querySelector('video').play();
//     document.querySelector('video').currentTime + 30;
//     document.getElementsByClassName("ytp-ad-skip-button ytp-button").click();
// }