function getImageFilterFunction(domain) {
  switch (domain) {
    case 'softgoat.com':
      return (url) => true; //url.startsWith('https://softgoat');
    default:
      return (url) => true;
  }
}

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

  var allImages = Array.from(document.querySelectorAll('img'));
  var imagesWithoutLink = allImages
    .filter((img) => !hasLinkAncestor(img))
    .map((img) => img.src);

  // we have a list of images, choose the first one that fills a specific criteria for the domain
  let imagesFiltered = imagesWithoutLink; //imagesWithoutLink.filter(filterFunction);

  return [allImages, imagesWithoutLink, imagesFiltered];
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

let [allImages, imagesWithoutLink, imagesFiltered] = getProductImages();

console.log(allImages.length, imagesWithoutLink.length, imagesFiltered.length);
