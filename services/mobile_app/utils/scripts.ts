export const jsScripts: { [key: string]: any } = {
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
        var productData = JSON.parse(elements[0].textContent);
        product['name'] = productData['name'];
        product['brand'] = productData['brand']['name'];
        product['price'] = productData['offers'][0]['price'];
        product['currency'] = productData['offers'][0]['priceCurrency'];
        product['images'] = productData['image'];

        return product;
      };


      try {
        var product = extract();
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'product', data: product }));
      } catch (e) {

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
      
      function extract() {
        var images = Array.from(document.querySelectorAll('img'))
          .filter((img) => !hasLinkAncestor(img))
          .map((img) => img.src);
      
        return images;
      }
      
      try {
        var images = extract();
      } catch (e) {
      
      }
    `,
    interact: ``,
  },
  'sellpy.com': {
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

      }
      
    `,
    interact: ``,
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
  'zara.com': {
    extract: ``,
    interact: ``,
  },
};
