function logSizes(images) {
  images.forEach((img) => {
    console.log(
      'nw:',
      img.naturalWidth,
      'nh:',
      img.naturalHeight,
      'w:',
      img.width,
      'h:',
      img.height
    );
  });
}

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

  return [allImages, imagesWithoutLink, mostCommonImages];
}

let [allImages, imagesWithoutLink, mostCommonImages] = getProductImages();

console.log(
  allImages.length,
  imagesWithoutLink.length,
  mostCommonImages.length
);

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
          window.ReactNativeWebView.postMessage(
            JSON.stringify({ type: 'product', data: JSON.stringify(parsed[j]) })
          );
          return;
        }
      }
    } else {
      if (parsed['@type'] === 'Product') {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ type: 'product', data: elements[i].textContent })
        );
        return;
      }
    }
  }
}

try {
  setInterval(() => {
    sendProductData();
  }, 1000);
} catch (e) {
  alert(e);
}

// lululemon
// nh: 1317, h: 36, 1317/36 ~= 37
// imagesWithoutLink with a certain natural quality?

/*

*/
