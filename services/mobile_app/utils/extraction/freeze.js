document.body.freezeEventHandler = function (event) {
  event.stopPropagation();
  event.preventDefault();

  if (event.target.tagName.toLowerCase() === 'img') {
    if (event.target.style.border === '5px solid red') {
      event.target.style.border = '';
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type: 'imageRemove',
          data: event.target.src,
          url: window.location.href,
        })
      );
    } else {
      event.target.style.border = '5px solid red';
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type: 'imageAdd',
          data: event.target.src,
          url: window.location.href,
        })
      );
    }
  }
};
document.body.addEventListener('click', document.body.freezeEventHandler, true);
