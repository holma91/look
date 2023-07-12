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

  // console.log('productData', productData);
  console.log('domain', domain);

  // plug in ML model here in future, go from productData to product

  try {
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
    } else if (domain === 'se.loropiana.com') {
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
    } else if (domain === 'shop.lululemon.com') {
      product['name'] = productData['name'];
      product['brand'] = productData['brand'];
      product['price'] = '218';
      product['currency'] = 'USD';
      product['images'] = productData['image'];
    } else if (domain === 'eu.lululemon.com') {
      product['name'] = productData['name'];
      product['brand'] = productData['brand'];
      product['price'] =
        productData['offers']['price'] ||
        productData['offers']['lowPrice'] ||
        '200';
      product['currency'] = productData['offers']['priceCurrency'];
      product['images'] = [productData['image']];
    }
  } catch (e) {
    console.log(`couldn't parse on domain:${domain} with error: ${e}`);
  }

  return product;
}

export function parseImageSrc(domain: string, imageSrc: string) {
  if (domain === 'hm.com') {
    return 'https://' + imageSrc.slice(2);
  }

  return imageSrc;
}
