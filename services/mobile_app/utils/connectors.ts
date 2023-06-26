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

export const connectors: { [key: string]: any } = {
  'zalando.com': {
    extract: `
      function extract() {
        var elements = document.querySelectorAll(
          'script[type="application/ld+json"]'
        );
      
        var product = {};
        var productData = JSON.parse(elements[0].textContent);
        product['name'] = productData['name'];
        product['brand'] = productData['brand']['name'];
        product['price'] = productData['offers'][0]['price'];
        product['currency'] = productData['offers'][0]['priceCurrency'];
        product['images'] = productData['image'];

        if (product.images) {
          // remove query parameters from images
          for (let i = 0; i < product.images.length; i++) {
            product.images[i] = product.images[i].substring(
              0,
              product.images[i].indexOf('?')
            );
          }
        }

        return product;
      };


      try {
        var product = extract();
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'product', data: product }));
      } catch (e) {

      }
    `,
    interact: ``,
  },
  'hm.com': {
    extract: `
      function extract() {
        var elements = document.querySelectorAll(
          'script[type="application/ld+json"]'
        );

        var productData;
        for (let i = 0; i < elements.length; i++) {
          parsed = JSON.parse(elements[i].textContent);
          if (parsed['@type'] === 'Product') {
            productData = parsed;
          }
        }
      
        var product = {};
        product['name'] = productData['name'];
        product['brand'] = productData['brand']['name'];
        product['price'] = productData['offers'][0]['price'];
        product['currency'] = productData['offers'][0]['priceCurrency'];
        product['images'] = ['https://' + productData['image'].slice(2)];

        return product;
      };


      try {
        var product = extract();
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'product', data: product }));
      } catch (e) {

      }
      
    `,
    interact: ``,
  },
  'sellpy.com': {
    both: `
      function extract() {
        var elements = document.querySelectorAll(
          'script[type="application/ld+json"]'
        );

        var productData;
        for (let i = 0; i < elements.length; i++) {
          parsed = JSON.parse(elements[i].textContent);
          if (parsed['@type'] === 'Product') {
            productData = parsed;
          }
        }

      
        var product = {};
        product['name'] = productData['name'];
        product['brand'] = productData['brand'];
        product['price'] = productData['offers']['price'];
        product['currency'] = productData['offers']['priceCurrency'];
        product['images'] = [productData['image']];

        return product;
      };

      try {
        var product = extract();
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'product', data: product }));
      } catch (e) {
        // alert(e)
      }

      try {
        if (!window.hasInjectedClickListener) {
          document.addEventListener('click', function(e) {
            var element = e.target;
            
            if (element.tagName.toLowerCase() === 'img') {
              // call extract stuff again
              var product = extract();
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'product', data: product }));
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
    `,
    extract: `
      function extract() {
        var elements = document.querySelectorAll(
          'script[type="application/ld+json"]'
        );

        var productData;
        for (let i = 0; i < elements.length; i++) {
          parsed = JSON.parse(elements[i].textContent);
          if (parsed['@type'] === 'Product') {
            productData = parsed;
          }
        }

      
        var product = {};
        product['name'] = productData['name'];
        product['brand'] = productData['brand'];
        product['price'] = productData['offers']['price'];
        product['currency'] = productData['offers']['priceCurrency'];
        product['images'] = [productData['image']];

        return product;
      };

      try {
        var product = extract();
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'product', data: product }));
      } catch (e) {
        alert(e)
      }
      
    `,
    interact: `
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
  `,
  },
  'softgoat.com': {
    extract: `
      try {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'any', data: 'trying!' }));
        var product = {};
        
        var elements = document.querySelectorAll('script[type="application/ld+json"]');
        if (elements.length > 0) {
          var productData = JSON.parse(elements[0].textContent);
          if (productData && productData['@type'] === 'Product') {
            product['name'] = productData['name'];
            product['brand'] = productData['brand']['name'];
            product['price'] = productData['offers']['price'];
            product['currency'] = productData['offers']['priceCurrency'];
            product['images'] = [];
            
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'product', data: product }));
          }
        }

      } catch (e) {
        alert(e);
      }
  `,
    interact: `
      try {
        if (!window.hasInjectedClickListener) {
          document.addEventListener('click', function(e) {
            var element = e.target;
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'unknown', data: element.getAttribute('data-has-border') === 'true' }));
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'border', data: element.style.border }));
            
            if (element.tagName.toLowerCase() === 'img') {
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
  `,
  },
  'zara.com': `
    try {
      var elements = document.querySelectorAll('script[type="application/ld+json"]');

      var product = {};
      var productData = JSON.parse(elements[0].textContent);
      product['name'] = productData['name'];
      product['brand'] = productData['brand'];
      product['price'] = productData['offers']['price'];
      product['currency'] = productData['offers']['priceCurrency'];
      product['images'] = productData['image'];
      
      window.ReactNativeWebView.postMessage(JSON.stringify(product));
    } catch (e) {
      // alert(e);
    }
  `,
};
