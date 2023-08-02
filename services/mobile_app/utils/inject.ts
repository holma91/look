import { getDomain } from './helpers';
import { baseExtractScript, baseInteractScript } from './scripts';
import { Product } from './types';

export function getInjectScripts(domain: string) {
  let scripts = [extractScript];
  if (domain === 'softgoat.com') {
    scripts.push(baseInteractScript);
  }

  return scripts;
}

const extractScript = `
(function() {
  function getProduct() {
    let elements = document.querySelectorAll(
      'script[type="application/ld+json"]'
    );

    for (let i = 0; i < elements.length; i++) {
      let parsed = JSON.parse(elements[i].textContent);
      if (parsed['@type'] === 'Product') {
        return elements[i].textContent;
      }
    }
  }

  const product = getProduct();
  if (product) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        type: 'product',
        data: product
      })
    );
  } else {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        type: 'product-not-found',
        data: ''
      })
    );
  }
})();
`;
