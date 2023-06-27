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
      document.addEventListener('click', function(e) {
        var element = e.target;
        
        if (element.tagName.toLowerCase() === 'img') {
          // call extract stuff again
          if (element.getAttribute('data-has-border') === 'true') {
            // The image already has a border, so remove it
            element.style.border = 'none';
            element.setAttribute('data-has-border', 'false');
          } else {
            // The image does not have a border, so add one
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
