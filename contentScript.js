console.log("Extension Working!");

// Options for the observer (which mutations to observe)
const config = { attributes: false, childList: true, subtree: true };

// Callback function to execute when mutations are observed
const cb = (mutationList, observer) => {
  if (mutationList[0].target.className === "style-scope ytd-comment-renderer") {
    console.log("from server");
  } else if (
    mutationList[0].target.className ===
    "style-scope ytd-comment-replies-renderer"
  ) {
    console.log("comment replies");
    observer.disconnect();
    fetchComments();
  } else if (
    mutationList[0].target.className === "style-scope ytd-item-section-renderer"
  ) {
    console.log("new comments");
    observer.disconnect();
    fetchComments();
  }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(cb);

const commentListener = () => {
  // Select the node that will be observed for mutations
  const targetNode = document.querySelectorAll(
    "div#contents.style-scope.ytd-item-section-renderer"
  )[0];

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
};

const fetchComments = () => {
  //selecting all the youtube comment as an object
  const commentObjects = document.querySelectorAll(
    "yt-formatted-string#content-text.style-scope.ytd-comment-renderer"
  );

  //converting object into array
  const commentArray = Object.values(commentObjects);

  const commentArrayLength = commentArray.length;

  if (commentArrayLength > 0) {
    //manipulating array to obtain the comment text
    const comments = commentArray.map((el) => el.innerText);

    const data = { data: comments };

    console.log(data);
    sendToBackend(data);
  } else {
    console.log("no comments");
  }
};

const sendToBackend = (data) => {
  chrome.runtime.sendMessage(
    {
      contentScriptQuery: "postData",
      data: JSON.stringify(data),
    },
    function(res) {
      res ? editComment(res) : console.log("backend not working");
    }
  );
};

const editComment = (res) => {
  console.log(res);
  const commentObjects = document.querySelectorAll(
    "yt-formatted-string#content-text.style-scope.ytd-comment-renderer"
  );
  const resJson = JSON.parse(res);
  const hateComments = resJson.indices;
  console.log(hateComments);
  hateComments.map(
    (comment) => (commentObjects[comment].innerText = "i edited this")
  );
  // Select the node that will be observed for mutations
  const targetNode = document.querySelectorAll(
    "div#contents.style-scope.ytd-item-section-renderer"
  )[0];

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
};

// chrome.runtime.onConnect.addListener(function(port) {
//   console.assert(port.name === "hsd");
//   port.onMessage.addListener(function(msg) {
//     console.log(msg);
//     port.postMessage({ message: "from cs" });
//   });
// });

chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
  console.log(data);
  setTimeout(() => {
    fetchComments();
    commentListener();
  }, 10000);
  sendResponse({ from: " cs" });
});

// yt-formatted-string#content-text.style-scope.ytd-comment-renderer
// //*[@id="content-text"]
// /html/body/ytd-app/div[1]/ytd-page-manager/ytd-watch-flexy/div[5]/div[1]/div/div[2]/ytd-comments/ytd-item-section-renderer/div[3]/ytd-comment-thread-renderer[1]/ytd-comment-renderer/div[3]/div[2]/div[2]/ytd-expander/div/yt-formatted-string
