console.log("Extension Working!");

let commentRendererLength = 0;
let count = 0;
let hateComments;
let commentsCount = 0;

const scrollListener = () => {
  window.onscroll = function() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      const commentObjects = document.querySelectorAll(
        "yt-formatted-string#content-text.style-scope.ytd-comment-renderer"
      );

      const commentsLen = commentObjects.length;
      if (commentsCount < commentsLen) {
        commentsCount = commentsLen;
        blurComments();
      }
      // editComment(hateComments);
    }
  };
};

const blurComments = () => {
  const commentObjects = document.querySelectorAll(
    "yt-formatted-string#content-text.style-scope.ytd-comment-renderer"
  );
  for (let comment of commentObjects) {
    comment.style.filter = "none";
  }
  //converting object into array
  const commentArray = Object.keys(commentObjects).map((comment) =>
    parseInt(comment)
  );

  const commentArrayLength = commentArray.length;

  if (commentArrayLength > 0) {
    //manipulating array to obtain the comment text
    // const comments = commentArray.map((el) => el.innerText);

    const toBeEditedArray = hateComments.filter((hateComment) =>
      commentArray.includes(hateComment)
    );
    console.log("working");
    toBeEditedArray.forEach((comment) => {
      console.log(commentObjects[comment], comment);

      commentObjects[comment].style.filter = "blur(5px)";
      commentObjects[comment].classList.add("edited");

      // commentObjects[comment].innerText = <div><div/>;
    });
  }
};

const sendUrl = (data) => {
  // console.log("send url");
  chrome.runtime.sendMessage(
    {
      contentScriptQuery: "postData",
      data: JSON.stringify({ url: data }),
    },
    async (response) => {
      if (response) {
        hateComments = response.indices;

        editComment(response.indices);
      } else {
        console.log("backend not working");
      }
    }
  );
};

const editComment = (hateComments) => {
  // console.log("editComment");

  console.log(hateComments);
  const commentRenderer = document.querySelectorAll(
    "div#contents.style-scope.ytd-item-section-renderer"
  );

  //comment objects
  const commentObjects = document.querySelectorAll(
    "yt-formatted-string#content-text.style-scope.ytd-comment-renderer"
  );

  commentsCount = commentObjects.length;
  console.log(commentObjects);

  blurComments();

  scrollListener();

  commentRenderer[0].removeAttribute("hidden");
  // hateComments.map(
  //   (comment) => (commentObjects[comment].innerText = "i edited this")
  // );
};

const checkForComments = (interval) => {
  console.log(count);
  if (count < 10) {
    count = count + 1;
    // Select the comment element and hide it
    const commentRenderer = document.querySelectorAll(
      "div#contents.style-scope.ytd-item-section-renderer"
    );

    commentRendererLength = commentRenderer.length;
    // console.log(commentRendererLength);
    if (commentRendererLength == 2) {
      commentRenderer[0].setAttribute("hidden", "hidden");
      clearInterval(interval);
    }
  } else {
    console.log("comments disabled");
    clearInterval(interval);
  }
};

chrome.runtime.onMessage.addListener(async (data, sender, sendResponse) => {
  // document.location.reload();
  // console.log(data.url.split("=")[1]);
  console.log(data.url);
  commentRendererLength = 0;
  count = 0;

  const interval = setInterval(() => checkForComments(interval), 3000);

  sendUrl(data.url);
  // editComment();
  sendResponse({ from: " content script" });
});

// yt-formatted-string#content-text.style-scope.ytd-comment-renderer
// //*[@id="content-text"]
// /html/body/ytd-app/div[1]/ytd-page-manager/ytd-watch-flexy/div[5]/div[1]/div/div[2]/ytd-comments/ytd-item-section-renderer/div[3]/ytd-comment-thread-renderer[1]/ytd-comment-renderer/div[3]/div[2]/div[2]/ytd-expander/div/yt-formatted-string
