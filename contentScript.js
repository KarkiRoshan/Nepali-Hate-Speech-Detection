console.log("content script loaded");

setTimeout(() => {
  //selecting all the youtube comment as an object
  const commentObjects = document.querySelectorAll(
    "yt-formatted-string#content-text.style-scope.ytd-comment-renderer"
  );
  //converting object into array
  const commentArray = Object.values(commentObjects);
  //manipulating array to obtain the comment text
  const comments = commentArray.map((el) => el.innerText);
  //   fetch("http://localhost:5000/yt", {
  //     method: "POST",
  //     mode: "cors",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(comments),
  //   });
  commentObjects[0].innerText = "i edited this";
}, 10000);

// document.getElementById("content-text").backgroundColor = "red";

// yt-formatted-string#content-text.style-scope.ytd-comment-renderer
// //*[@id="content-text"]
// /html/body/ytd-app/div[1]/ytd-page-manager/ytd-watch-flexy/div[5]/div[1]/div/div[2]/ytd-comments/ytd-item-section-renderer/div[3]/ytd-comment-thread-renderer[1]/ytd-comment-renderer/div[3]/div[2]/div[2]/ytd-expander/div/yt-formatted-string
