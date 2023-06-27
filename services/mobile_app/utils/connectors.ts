function getImageFilterFunction(domain: string) {
  switch (domain) {
    case 'hm.com':
      return (url: string) => url.startsWith('https://lp2.hm.com');
    default:
      return (url: string) => true;
  }
}

function getProductImages() {
  function hasLinkAncestor(node: any) {
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
/*
handleLoadEnd inject a script into the webview (in intervals)
the script extracts the schema.org data from the webview and sends it back to the app
onMessage will call the handleMessage function
map the schema.org data to our product data type
set the current product to update the UI
send the product to the backend
// APPROACH
// 1. Inject a script into the page that will extract the product data
// if image is provided, use it
// if not, use the first image in the list we get from getProductImages()

// More scalable approach:
// 1. Inject a script into the page that will extract the schema.org data
// 2. use LLM to map the schema.org data to our product data
*/

export const connectors: { [key: string]: any } = {};
