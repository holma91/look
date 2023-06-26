const extract = () => {
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
};

export const connectors = {
  zalando: {
    extract: `
      const extract = () => {
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
};
