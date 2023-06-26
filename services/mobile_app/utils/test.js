function getImageFilterFunction(domain) {
  switch (domain) {
    case 'hm.com':
      return (url) => url.startsWith('https://lp2.hm.com');
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

  var images = Array.from(document.querySelectorAll('img'))
    .filter((img) => !hasLinkAncestor(img))
    .map((img) => img.src);

  // we have a list of images, choose the first one that fills a specific criteria for the domain
  let filterFunction = getImageFilterFunction('hm.com');
  images = images.filter(filterFunction);

  return images;
}
