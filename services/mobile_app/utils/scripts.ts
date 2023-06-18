// mapping from url to injection script

export const jsScripts: { [key: string]: string } = {
  'www.zalando.com': `
    try {
      var elements = document.querySelectorAll('script[type="application/ld+json"]');

      var product = {};
      var productData = JSON.parse(elements[0].textContent);
      product['name'] = productData['name'];
      product['brand'] = productData['brand']['name'];
      product['price'] = productData['offers'][0]['price'];
      product['currency'] = productData['offers'][0]['priceCurrency'];
      product['images'] = productData['image'];
      
      window.ReactNativeWebView.postMessage(JSON.stringify(product));
    } catch (e) {

    }
  `,
  'www.zara.com': `
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
