chrome.tabs.onUpdated.addListener(async (tabId, changes, tab) => {
  if (tab.url !== undefined && changes.status == "complete") {
    console.log(tabId);
    chrome.tabs.sendMessage(tabId, { message: "new video" }, (res) =>
      console.log(res)
    );
  }
});

chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
  if (req.contentScriptQuery == "postData") {
    console.log(req.data);
    fetch("http://127.0.0.1:5000/detect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: req.data,
    })
      .then((response) => response.text())
      .then((response) => sendResponse(response))
      .catch((error) => console.log(error));
    return true;
  }
});
