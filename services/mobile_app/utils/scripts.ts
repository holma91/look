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
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'product', data: JSON.stringify(parsed[j]) }));
            return;
          }
        }
      } else {
        if (parsed['@type'] === 'Product') {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'product', data: elements[i].textContent }));
          return;
        }
      }
    }
  }

  try {
    setInterval(() => {
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
try {
  var elements = document.querySelectorAll(
    'script[type="application/ld+json"]'
  );

  for (let i = 0; i < elements.length; i++) {
    parsed = JSON.parse(elements[i].textContent);
    console.log(parsed);
    if (Array.isArray(parsed)) {
      for (let j = 0; j < parsed.length; j++) {
        if (parsed[j]['@type'] === 'Product') {
          console.log(JSON.stringify({ type: 'product', data: JSON.stringify(parsed[j]) }));
          break;
        }
      }
    } else {
      if (parsed['@type'] === 'Product') {
        console.log(JSON.stringify({ type: 'product', data: elements[i].textContent }));
        break;
      }
    }
  }
} catch (e) {
  alert(e);
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
