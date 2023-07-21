export const newBaseExtractScript2 = `
  if (typeof lastProductInfo === 'undefined') {
    var lastProductInfo = { url: '', images: [] };
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'init', data: 'just initialized lastProductInfo'}));
  } else {
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'not init', data: 'did not just initialize lastProductInfo'}));
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
        if (window.location.href !== lastProductInfo.url && parsed.image[0] !== lastProductInfo.images[0]) {
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

export const newBaseExtractScript = `
  function sendProductData() {
    var elements = document.querySelectorAll(
      'script[type="application/ld+json"]'
    );

    for (let i = 0; i < elements.length; i++) {
      var parsed = JSON.parse(elements[i].textContent);
      if (Array.isArray(parsed)) {
        // for zara
        for (let j = 0; j < parsed.length; j++) {
          if (parsed[j]['@type'] === 'Product') {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'product', data: JSON.stringify(parsed[j]), url: window.location.href  }));
            return;
          }
        }
      } else {
        if (parsed['@type'] === 'Product') {
          // elements[i] should be cached here
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'product', data: elements[i].textContent, url: window.location.href  }));
          return;
        }
      }
    }
  }

  try {
    sendProductData();
    setTimeout(() => {
      sendProductData();
    }, 5000);
  } catch (e) {
    alert(e);
  }
`;

export const baseExtractScript = `
  try {
    var elements = document.querySelectorAll(
      'script[type="application/ld+json"]'
    );

    for (let i = 0; i < elements.length; i++) {
      parsed = JSON.parse(elements[i].textContent);
      if (Array.isArray(parsed)) {
        // for zara
        for (let j = 0; j < parsed.length; j++) {
          if (parsed[j]['@type'] === 'Product') {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'product', data: JSON.stringify(parsed[j]) }));
            break;
          }
        }
      } else {
        if (parsed['@type'] === 'Product') {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'product', data: elements[i].textContent }));
          break;
        }
      }
    }
  } catch (e) {
    alert(e);
  }
`;

const copyPasteScript = `
if (typeof lastProductInfo === 'undefined') {
  var lastProductInfo = { url: '', images: [] };
}

function sendProductData() {
  var elements = document.querySelectorAll(
    'script[type="application/ld+json"]'
  );

  for (let i = 0; i < elements.length; i++) {
    var parsed = JSON.parse(elements[i].textContent);
    if (parsed['@type'] === 'Product') {
      if (window.location.href !== lastProductInfo.url && parsed.image[0] !== lastProductInfo.images[0]) {
        lastProductInfo.url = window.location.href;
        lastProductInfo.images = parsed.image;
        console.log(JSON.stringify({ type: 'product', data: elements[i].textContent, url: window.location.href }));
        return;
      }
    }
  }
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
