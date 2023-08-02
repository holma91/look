import { getDomain } from './helpers';
import { Product } from './types';

type IntermediaryProduct = {
  name: string;
  brand: string;
  price: string;
  currency: string;
  images: string[];
};

const baseParsers = {
  type1: (productData: any) => {
    return {
      name: productData['name'],
      brand: productData['brand']['name'],
      price: productData['offers']['price'],
      currency: productData['offers']['priceCurrency'],
      images: productData['image'],
    };
  },
  type2: (productData: any) => {
    return {
      name: productData['name'],
      brand: productData['brand']['name'],
      price: productData['offers']['price'],
      currency: productData['offers']['priceCurrency'],
      images: [productData['image']],
    };
  },
  type3: (productData: any) => {
    return {
      name: productData['name'],
      brand: productData['brand']['name'],
      price: productData['offers'][0]['price'],
      currency: productData['offers'][0]['priceCurrency'],
      images: productData['image'],
    };
  },
  type4: (productData: any) => {
    return {
      name: productData['name'],
      brand: productData['brand']['name'],
      price: productData['offers'][0]['price'],
      currency: productData['offers'][0]['priceCurrency'],
      images: [productData['image']],
    };
  },
};

const domainSpecificParsers: {
  [key: string]: (product: IntermediaryProduct) => IntermediaryProduct;
} = {
  'zalando.se': (product: IntermediaryProduct) => {
    return {
      ...product,
      images: product.images.map((image) =>
        image.substring(0, image.indexOf('?'))
      ),
    };
  },
  'hm.com': (product: IntermediaryProduct) => {
    return {
      ...product,
      images: product.images.map((image) => 'https://' + image.slice(2)),
    };
  },
};

const type1Domains = ['se.loropiana.com'];
const type2Domains = ['sellpy.se', 'boozt.com'];
const type3Domains = ['zalando.se', 'careofcarl.se'];
const type4Domains = ['hm.com'];

export function parseProductData(url: string, rawData: string): Product {
  const domain = getDomain(url);
  if (!domain) throw new Error('Could not parse domain');
  const parsedRawData = JSON.parse(rawData);
  const productData = JSON.parse(parsedRawData['data']);

  let product: IntermediaryProduct = {
    name: '',
    brand: '',
    price: '',
    currency: '',
    images: [],
  };

  let baseParse;
  if (type1Domains.includes(domain as string)) {
    baseParse = baseParsers['type1'];
  } else if (type2Domains.includes(domain as string)) {
    baseParse = baseParsers['type2'];
  } else if (type3Domains.includes(domain as string)) {
    baseParse = baseParsers['type3'];
  } else if (type4Domains.includes(domain as string)) {
    baseParse = baseParsers['type4'];
  } else {
    return { ...product, url: url };
  }

  try {
    product = baseParse(productData);
    if (domainSpecificParsers[domain]) {
      product = domainSpecificParsers[domain](product);
    }
  } catch (e) {
    console.log(`couldn't parse on domain:${domain} with error: ${e}`);
  }

  /*
  try {
    if (domain === 'zalando.se') {
      product = baseParse(productData);
    } else if (domain === 'boozt.com') {
      product['name'] = productData['name'];
      product['brand'] = productData['brand']['name'];
      product['price'] = productData['offers']['price'];
      product['currency'] = productData['offers']['priceCurrency'];
      product['images'] = [productData['image']];
    } else if (domain === 'hm.com' || domain === 'www2.hm.com') {
      product['name'] = productData['name'];
      product['brand'] = productData['brand']['name'];
      product['price'] = productData['offers'][0]['price'];
      product['currency'] = productData['offers'][0]['priceCurrency'];
      product['images'] = ['https://' + productData['image'].slice(2)];
    } else if (domain === 'softgoat.com') {
      product['name'] = productData['name'];
      product['brand'] = productData['brand']['name'];
      product['price'] = productData['offers']['price'].replace(/\s/g, '');
      product['currency'] = productData['offers']['priceCurrency'];
      product['images'] = [];
    } else if (domain === 'sellpy.se') {
      product['name'] = productData['name'];
      product['brand'] = productData['brand'] || '?';
      product['price'] = productData['offers']['price'];
      product['currency'] = productData['offers']['priceCurrency'];
      product['images'] = [productData['image']];
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
    } else if (domain === 'mytheresa.com') {
      product['name'] = productData['name'];
      product['brand'] = productData['brand']['name'];
      product['price'] = productData['offers']['PriceSpecification']['price'];
      product['currency'] = productData['offers']['priceCurrency'];
      product['images'] = [productData['image']];
    } else if (domain === 'valentino.com') {
      product['name'] = productData['name'];
      product['brand'] = productData['brand']['name'];
      product['price'] = productData['offers']['price'];
      product['currency'] = productData['offers']['priceCurrency'];
      product['images'] = [productData['image']];
    } else if (domain === 'farfetch.com') {
      product['name'] = productData['name'];
      product['brand'] = productData['brand']['name'];
      product['price'] = productData['offers']['price'];
      product['currency'] = productData['offers']['priceCurrency'];
      product['images'] = productData['image'].map(
        (image: any) => image.contentUrl
      );
    } else if (domain === 'louisvuitton.com') {
      product['name'] = productData['name'];
      product['brand'] = productData['brand']['name'];
      product['price'] = productData['offers']['price'];
      product['currency'] = productData['offers']['priceCurrency'];
      product['images'] = productData['image'].map(
        (image: any) => image.contentUrl
      );
    } else if (domain === 'ysl.com') {
      product['name'] = productData['name'];
      product['brand'] = productData['brand']['name'];
      product['price'] = productData['offers']['price'];
      product['currency'] = productData['offers']['priceCurrency'];
      product['images'] = [productData['image']];
    } else if (domain === 'careofcarl.se') {
      product['name'] = productData['name'];
      product['brand'] = productData['brand']['name'];
      product['price'] = productData['offers'][0]['price'];
      product['currency'] = productData['offers'][0]['priceCurrency'];
      product['images'] = productData['image'];
    } else if (domain === 'adaysmarch.com') {
      product['name'] = productData['name'];
      product['brand'] = productData['brand']['name'];
      product['price'] = productData['offers']['price'];
      product['currency'] = productData['offers']['priceCurrency'];
      product['images'] = productData['image'];
    } else if (domain === 'hermes.com') {
      product['name'] = productData['name'];
      product['brand'] = productData['brand']['name'];
      product['price'] = productData['offers']['price'];
      product['currency'] = productData['offers']['priceCurrency'];
      product['images'] = productData['image'];
    } else if (domain === 'na-kd.com') {
      product['name'] = productData['name'];
      product['brand'] = productData['brand']['name'];
      product['price'] = productData['offers'][0]['price'];
      product['currency'] = productData['offers'][0]['priceCurrency'];
      product['images'] = [];
    }
  } catch (e) {
    console.log(`couldn't parse on domain:${domain} with error: ${e}`);
  }
  */

  return { ...product, url: url };
}
