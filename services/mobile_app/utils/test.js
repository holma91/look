function getProductImages() {
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
    // Create an object to count occurrences of each dimension
    var dimensionCounts = imagesFiltered.reduce((counts, img) => {
      var dimension = img.naturalWidth + 'x' + img.naturalHeight;
      counts[dimension] = (counts[dimension] || 0) + 1;
      return counts;
    }, {});

    // Find the dimension with the most occurrences
    var maxCount = 0;
    var mostCommonDimension;
    for (var dimension in dimensionCounts) {
      if (dimensionCounts[dimension] > maxCount) {
        maxCount = dimensionCounts[dimension];
        mostCommonDimension = dimension;
      }
    }

    // Filter images to include only those with the most common dimension
    var mostCommonImages = imagesFiltered.filter((img) => {
      var dimension = img.naturalWidth + 'x' + img.naturalHeight;
      return dimension === mostCommonDimension;
    });

    return mostCommonImages;
  }

  var allImages = Array.from(document.querySelectorAll('img'));
  var imagesWithoutLink = allImages.filter((img) => !hasLinkAncestor(img));
  var imagesFiltered = imagesWithoutLink.filter(
    (img) => img.naturalHeight > 10 * img.height
  );
  var mostCommonImages = getMostCommonImages(imagesWithoutLink);

  return [allImages, imagesWithoutLink, imagesFiltered, mostCommonImages];
}

let [allImages, imagesWithoutLink, imagesFiltered, mostCommonImages] =
  getProductImages();

function logSizes(images) {
  images.forEach((img) => {
    console.log('nw:', img.naturalWidth, 'nh:', img.naturalHeight);
    console.log('w:', img.width, 'h:', img.height);
  });
}

function filterImagesBySize(images, minWidth, minHeight) {
  return new Promise((resolve) => {
    let filteredImages = [];

    images.forEach((src, index) => {
      let img = new Image();
      img.onload = function () {
        if (this.naturalWidth >= minWidth && this.naturalHeight >= minHeight) {
          filteredImages.push(src);
        }
        console.log('loaded', src, this.naturalWidth, this.naturalHeight);

        // If this is the last image, resolve the promise
        if (index === images.length - 1) {
          resolve(filteredImages);
        }
      };
      img.src = src;
    });
  });
}

console.log(allImages.length, imagesWithoutLink.length, imagesFiltered.length);

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
