export const baseExtractScript = `
  try {
    var elements = document.querySelectorAll(
      'script[type="application/ld+json"]'
    );

    for (let i = 0; i < elements.length; i++) {
      parsed = JSON.parse(elements[i].textContent);
      if (parsed['@type'] === 'Product') {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'product', data: elements[i].textContent }));
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
