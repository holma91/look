if (typeof lastProductInfo === 'undefined') {
  var lastProductInfo = { url: '', firstImage: '' };
  window.ReactNativeWebView.postMessage(
    JSON.stringify({ type: 'init', data: 'just initialized lastProductInfo' })
  );
} else {
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: 'not init',
      data: 'did not just initialize lastProductInfo',
    })
  );
}

function isReady(parsed) {
  const currentFirstImage = Array.isArray(parsed.image)
    ? parsed.image[0]
    : parsed.image;
  return (
    window.location.href !== lastProductInfo.url &&
    (currentFirstImage !== lastProductInfo.firstImage ||
      parsed.image.length === 0)
  );
}

function getProductData() {
  var elements = document.querySelectorAll(
    'script[type="application/ld+json"]'
  );

  for (let i = 0; i < elements.length; i++) {
    var parsed = JSON.parse(elements[i].textContent);
    if (parsed['@type'] === 'Product') {
      return elements[i].textContent;
    }
  }
}

try {
  let rawProductData = getProductData();
  if (rawProductData) {
    // save rawProductData in cache
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        type: 'product',
        data: rawProductData,
        url: window.location.href,
      })
    );
  } else {
    // did not find product data
    window.ReactNativeWebView.postMessage(
      JSON.stringify({ type: 'no product', data: '' })
    );
  }
} catch (e) {
  window.ReactNativeWebView.postMessage(
    JSON.stringify({ type: 'error', data: e })
  );
}
