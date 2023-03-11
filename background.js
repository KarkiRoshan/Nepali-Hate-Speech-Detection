let url;

const sendMessageToContentScript = (changes) => {
  return chrome.tabs.sendMessage(changes.tabId, { url: changes.url }, (res) => {
    console.log("response from content script", res);
  });
};
chrome.webNavigation.onHistoryStateUpdated.addListener(function(changes) {
  if (
    changes.frameId == 0 &&
    changes.url.includes("youtube.com/watch") &&
    url !== changes.url
  ) {
    sendMessageToContentScript(changes);
  }
});

//reload
chrome.webNavigation.onCompleted.addListener(function(changes) {
  setTimeout(() => {
    if (changes.frameId == 0 && changes.url.includes("youtube.com/watch")) {
      url = changes.url;
      sendMessageToContentScript(changes);
    }
  }, 1000);
});

// chrome.tabs.onUpdated.addListener(async (tabId, changeInfos, tab) => {
//   // if (tab.url) {
//   //   console.log(tab.url);
//   //   chrome.tabs.sendMessage(tabId, { url: tab.url }, (res) => {
//   //     console.log("response");
//   //   });
//   // }

//   if (tab.url.includes("youtube.com/watch")) {
//     if (changeInfos.url == undefined && changeInfos.title == undefined) {
//       if (tab.url !== undefined && tab.status == "complete") {
//         return chrome.tabs.sendMessage(tabId, { url: tab.url }, (res) => {
//           console.log("response1", res);
//           console.log(changeInfos.title);
//         });
//       }
//     } else if (changeInfos.url !== undefined) {
//       console.log("inside");
//       return chrome.tabs.sendMessage(tabId, { url: tab.url }, (res) => {
//         console.log("response2", res);
//       });
//     }
//   }
// });

chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
  if (req.contentScriptQuery == "postData") {
    // console.log("to post:", req.data);
    fetch("http://127.0.0.1:5000/detect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: req.data,
    })
      .then((response) => response.json())
      .then((data) => sendResponse(data))
      .catch((error) => console.log(error));
    return true;
  }
});
