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
      data: product,
      url: window.location.href,
    })
  );
} else {
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: 'product-not-found',
      data: '',
      url: window.location.href,
    })
  );
}
