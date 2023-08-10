export const freezeScript = `
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
`;

export const unFreezeScript = `
document.body.removeEventListener('click', document.body.freezeEventHandler, true);
`;

export const extractScriptV2 = `
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
`;
export const baseExtractScript = `
  if (typeof lastProductInfo === 'undefined') {
    var lastProductInfo = { url: '', firstImage: '' };
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'init', data: 'just initialized lastProductInfo'}));
  } else {
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'not init', data: 'did not just initialize lastProductInfo'}));
  }

  function isReady(parsed) {
    const currentFirstImage = Array.isArray(parsed.image) ? parsed.image[0] : parsed.image
    return window.location.href !== lastProductInfo.url && (currentFirstImage !== lastProductInfo.firstImage || parsed.image.length === 0);
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
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ready', data: 'is ready' }));
          lastProductInfo.url = window.location.href;
          lastProductInfo.firstImage = Array.isArray(parsed.image) ? parsed.image[0] : parsed.image;
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

export const baseImageExtractScript = `
function hasLinkAncestor(node) {
  while (node) {
    if (node.tagName && node.tagName.toLowerCase() === 'a') {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

function getMostCommonImages(images) {
  var dimensionCounts = images.reduce((counts, img) => {
    var dimension = img.naturalWidth + 'x' + img.naturalHeight;
    counts[dimension] = (counts[dimension] || 0) + 1;
    return counts;
  }, {});

  var maxCount = 0;
  var mostCommonDimension;
  for (var dimension in dimensionCounts) {
    if (dimensionCounts[dimension] > maxCount) {
      maxCount = dimensionCounts[dimension];
      mostCommonDimension = dimension;
    }
  }

  var mostCommonImages = images.filter((img) => {
    var dimension = img.naturalWidth + 'x' + img.naturalHeight;
    return dimension === mostCommonDimension;
  });

  return mostCommonImages;
}

function getProductImages() {
  var allImages = Array.from(document.querySelectorAll('img'));
  var imagesWithoutLink = allImages.filter((img) => !hasLinkAncestor(img));
  var mostCommonImages = getMostCommonImages(imagesWithoutLink);

  return imagesWithoutLink;
}

getProductImages();

window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'imagesWithoutLink', data: getProductImages().map(img => img.src) }));
// window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'allImages', data: allImages.map(img => img.src) }));
// window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'mostCommonImages', data: mostCommonImages.map(img => img.src) }));
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
