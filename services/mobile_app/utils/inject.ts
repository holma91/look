import { getDomain } from './helpers';
import { baseExtractScript, baseInteractScript } from './scripts';
import { Product } from './types';

export function getInjectScripts(domain: string) {
  let scripts = [extractScript];
  if (domain === 'softgoat.com') {
    scripts.push(baseInteractScript);
  }

  return scripts;
}

export function parseProductData(url: string, rawData: string) {
  const domain = getDomain(url);
  const parsedRawData = JSON.parse(rawData);
  const productData = JSON.parse(parsedRawData['data']);

  let product: Product = {
    url: url,
    name: '',
    brand: '',
    price: '',
    currency: '',
    images: [],
  };

  if (domain === 'zalando.se') {
    product['name'] = productData['name'];
    product['brand'] = productData['brand']['name'];
    product['price'] = productData['offers'][0]['price'];
    product['currency'] = productData['offers'][0]['priceCurrency'];
    product['images'] = productData['image'];
    if (product.images) {
      // remove query parameters from images to get high quality
      for (let i = 0; i < product.images.length; i++) {
        product.images[i] = product.images[i].substring(
          0,
          product.images[i].indexOf('?')
        );
      }
    }
  } else if (domain === 'se.loropiana.com') {
    product['name'] = productData['name'];
    product['brand'] = productData['brand']['name'];
    product['price'] = productData['offers']['price'];
    product['currency'] = productData['offers']['priceCurrency'];
    product['images'] = productData['image'];
  }

  return product;
}

const extractScript = `
(function() {
  function getProduct() {
    let elements = document.querySelectorAll(
      'script[type="application/ld+json"]'
    );

    for (let i = 0; i < elements.length; i++) {
      let parsed = JSON.parse(elements[i].textContent);
      if (parsed['@type'] === 'Product') {
        return elements[i].textContent;
      }
    }
  }

  const product = getProduct();
  if (product) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        type: 'product',
        data: product
      })
    );
  } else {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        type: 'product-not-found',
        data: ''
      })
    );
  }
})();
`;
