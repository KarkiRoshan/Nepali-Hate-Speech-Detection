chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
  if (req.contentScriptQuery == "postData") {
    console.log(req.data);
    fetch("http://127.0.0.1:5000/detect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hello: "parse" }),
    })
      .then((response) => response.text())
      .then((response) => sendResponse(response))
      .catch((error) => console.log(error));
    return true;
  }
});
