console.log("Extension Working!");

setTimeout(() => {
  //selecting all the youtube comment as an object
  const commentObjects = document.querySelectorAll(
    "yt-formatted-string#content-text.style-scope.ytd-comment-renderer"
  );

  //converting object into array
  const commentArray = Object.values(commentObjects);

  //manipulating array to obtain the comment text
  const comments = commentArray.map((el) => el.innerText);

  const data = { data: comments };

  console.log(data);
  chrome.runtime.sendMessage(
    {
      contentScriptQuery: "postData",
      data: JSON.stringify(data),
    },
    function(res) {
      console.log(res);
    }
  );

  const editComment = (res) => {
    console.log(res);
    // const resJson = JSON.parse(res);
    // const hateComments = resJson.indices;
    // console.log(hateComments);
    // hateComments.map(
    //   (comment) => (commentObjects[comment].innerText = "i edited this")
    // );
  };
}, 10000);

// yt-formatted-string#content-text.style-scope.ytd-comment-renderer
// //*[@id="content-text"]
// /html/body/ytd-app/div[1]/ytd-page-manager/ytd-watch-flexy/div[5]/div[1]/div/div[2]/ytd-comments/ytd-item-section-renderer/div[3]/ytd-comment-thread-renderer[1]/ytd-comment-renderer/div[3]/div[2]/div[2]/ytd-expander/div/yt-formatted-string
