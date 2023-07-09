import { Product } from '../utils/types';

export function parseProduct(
  domain: string,
  product_url: string,
  productData: any
): Product {
  let product: Product = {
    url: product_url,
    name: '',
    brand: '',
    price: '',
    currency: '',
    images: [],
  };

  // plug in ML model here in future, go from productData to product

  if (domain === 'zalando.com' || domain === 'zalando.se') {
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
  } else if (domain === 'hm.com' || domain === 'www2.hm.com') {
    product['name'] = productData['name'];
    product['brand'] = productData['brand']['name'];
    product['price'] = productData['offers'][0]['price'];
    product['currency'] = productData['offers'][0]['priceCurrency'];
    product['images'] = ['https://' + productData['image'].slice(2)];
  } else if (domain === 'sellpy.se') {
    product['name'] = productData['name'];
    product['brand'] = productData['brand'] || '?';
    product['price'] = productData['offers']['price'];
    product['currency'] = productData['offers']['priceCurrency'];
    product['images'] = [productData['image']];
  } else if (domain === 'softgoat.com') {
    product['name'] = productData['name'];
    product['brand'] = productData['brand']['name'];
    product['price'] = productData['offers']['price'].replace(/\s/g, '');
    product['currency'] = productData['offers']['priceCurrency'];
    product['images'] = [];
  } else if (domain === 'zara.com') {
    product['name'] = productData['name'];
    product['brand'] = productData['brand'];
    product['price'] = productData['offers']['price'];
    product['currency'] = productData['offers']['priceCurrency'];
    product['images'] = productData['image'];
  } else if (domain === 'loropiana.com') {
    product['name'] = productData['name'];
    product['brand'] = productData['brand']['name'];
    product['price'] = productData['offers']['price'];
    product['currency'] = productData['offers']['priceCurrency'];
    product['images'] = productData['image'];
  } else if (domain === 'gucci.com') {
    product['name'] = productData['name'];
    product['brand'] = productData['brand']['name'];
    product['price'] = productData['offers'][0]['price'];
    product['currency'] = productData['offers'][0]['priceCurrency'];
    product['images'] = productData['image'];
  } else if (domain === 'moncler.com') {
    product['name'] = productData['name'];
    product['brand'] = productData['brand']['name'];
    product['price'] = productData['offers']['price'];
    product['currency'] = productData['offers']['priceCurrency'];
    product['images'] = productData['image'];
  } else if (
    domain === 'lululemon.com' ||
    domain === 'shop.lululemon.com' ||
    domain === 'eu.lululemon.com'
  ) {
    product['name'] = productData['name'];
    product['brand'] = productData['brand'];
    product['price'] = '218';
    product['currency'] = 'USD';
    product['images'] = productData['image'];
  }

  return product;
}

export function parseImageSrc(domain: string, imageSrc: string) {
  if (domain === 'hm.com') {
    return 'https://' + imageSrc.slice(2);
  }

  return imageSrc;
}
