export const baseExtractScript = `
  if (typeof lastProductInfo === 'undefined') {
    var lastProductInfo = { url: '', images: [] };
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'init', data: 'just initialized lastProductInfo'}));
  } else {
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'not init', data: 'did not just initialize lastProductInfo'}));
  }

  function isReady(parsed) {
    return window.location.href !== lastProductInfo.url && (parsed.image[0] !== lastProductInfo.images[0] || parsed.image.length === 0);
  }

  function sendProductData() {
    var elements = document.querySelectorAll(
      'script[type="application/ld+json"]'
    );

    let productFound = false;

    for (let i = 0; i < elements.length; i++) {
      var parsed = JSON.parse(elements[i].textContent);
      if (parsed['@type'] === 'Product') {
        productFound = true;
        if (isReady(parsed)) {
          lastProductInfo.url = window.location.href;
          lastProductInfo.images = parsed.image;
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'product', data: elements[i].textContent, url: window.location.href }));
          return;
        } 
      }
    }

    if (!productFound) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'no product', data: 'no product found' }));
    }
  }

  try {
    sendProductData();
    setInterval(() => {
      sendProductData();
    }, 2000);
  } catch (e) {
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', data: e }));
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'no product', data: 'no product found' }));
  }
`;

const baseExtractScriptCopy = `
if (typeof lastProductInfo === 'undefined') {
  var lastProductInfo = { url: '', images: [] };
  console.log(JSON.stringify({ type: 'init', data: 'just initialized lastProductInfo'}));
} else {
  console.log(JSON.stringify({ type: 'not init', data: 'did not just initialize lastProductInfo'}));
}

function isReady(parsed) {
  return window.location.href !== lastProductInfo.url && (parsed.image[0] !== lastProductInfo.images[0] || parsed.image.length === 0);
}

function sendProductData() {
  var elements = document.querySelectorAll(
    'script[type="application/ld+json"]'
  );

  let productFound = false;

  for (let i = 0; i < elements.length; i++) {
    var parsed = JSON.parse(elements[i].textContent);
    if (parsed['@type'] === 'Product') {
      productFound = true;
      console.log('window.location.href', window.location.href);
      console.log('lastProductInfo', lastProductInfo);
      console.log('lastProductInfo.images[0]', lastProductInfo.images[0]);
      console.log('parsed.image[0]', parsed.image[0]);
      if (isReady(parsed)) {
        lastProductInfo.url = window.location.href;
        lastProductInfo.images = parsed.image;
        console.log(JSON.stringify({ type: 'product', data: elements[i].textContent, url: window.location.href }));
        return;
      } 
    }
  }

  if (!productFound) {
    console.log(JSON.stringify({ type: 'no product', data: 'no product found' }));
  }
}

try {
  sendProductData();
  setInterval(() => {
    sendProductData();
  }, 2000);
} catch (e) {
  console.log(JSON.stringify({ type: 'error', data: e }));
  console.log(JSON.stringify({ type: 'no product', data: 'no product found' }));
}
`;

export const baseInteractScript = `
try {
  if (!window.hasInjectedClickListener) {
    function hasLinkAncestor(node) {
      while (node) {
        if (node.tagName && node.tagName.toLowerCase() === 'a') {
          return true;
        }
        node = node.parentNode;
      }
      return false;
    }
    document.addEventListener('mousedown', function(e) {
      var element = e.target;
      if (
        element.tagName.toLowerCase() === 'img' && 
        !hasLinkAncestor(element)
      ) {
        if (element.getAttribute('data-has-border') === 'true') {
          element.style.border = 'none';
          element.setAttribute('data-has-border', 'false');
        } else {
          element.style.boxSizing = 'border-box';
          element.style.border = '5px solid black';
          element.setAttribute('data-has-border', 'true');
        }
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'imageSrc', data: element.src }));
      }
    });
    window.hasInjectedClickListener = true;
  }
} catch (e) {
  alert(e);
}
`;

export const baseInteractScriptCopy = `
try {
  if (!window.hasInjectedClickListener) {
    function hasLinkAncestor(node) {
      while (node) {
        if (node.tagName && node.tagName.toLowerCase() === 'a') {
          return true;
        }
        node = node.parentNode;
      }
      return false;
    }
    document.addEventListener('mousedown', function(e) {
      var element = e.target;
      if (
        element.tagName.toLowerCase() === 'img' && 
        !hasLinkAncestor(element)
      ) {
        if (element.getAttribute('data-has-border') === 'true') {
          element.style.border = 'none';
          element.setAttribute('data-has-border', 'false');
        } else {
          element.style.boxSizing = 'border-box';
          element.style.border = '5px solid black';
          element.setAttribute('data-has-border', 'true');
        }
        console.log(JSON.stringify({ type: 'imageSrc', data: element.src }));
      }
    });
    window.hasInjectedClickListener = true;
  }
} catch (e) {
  alert(e);
}
`;
