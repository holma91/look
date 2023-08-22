import { getDomain } from '../helpers';
import { UserProduct } from '../types';

type IntermediaryProduct = {
  name: string;
  brand: string;
  price: string;
  currency: string;
  schemaUrl?: string;
  images: string[];
};

const baseParsers: {
  [key: string]: (productData: any) => IntermediaryProduct;
} = {
  type1: (productData: any) => {
    return {
      schemaUrl: productData['offers']['url'],
      name: productData['name'],
      brand: productData['brand']['name'],
      price: productData['offers']['price'],
      currency: productData['offers']['priceCurrency'],
      images: productData['image'],
    };
  },
  type2: (productData: any) => {
    return {
      schemaUrl: productData['offers']['url'],
      name: productData['name'],
      brand: productData['brand']['name'],
      price: productData['offers']['price'],
      currency: productData['offers']['priceCurrency'],
      images: [productData['image']],
    };
  },
  type3: (productData: any) => {
    return {
      schemaUrl: productData['offers'][0]['url'],
      name: productData['name'],
      brand: productData['brand']['name'],
      price: productData['offers'][0]['price'],
      currency: productData['offers'][0]['priceCurrency'],
      images: productData['image'],
    };
  },
  type4: (productData: any) => {
    return {
      schemaUrl: productData['offers'][0]['url'],
      name: productData['name'],
      brand: productData['brand']['name'],
      price: productData['offers'][0]['price'],
      currency: productData['offers'][0]['priceCurrency'],
      images: [productData['image']],
    };
  },
};

const domainSpecificParsers: {
  [key: string]: (productData: any) => IntermediaryProduct;
} = {
  'sellpy.com': (productData: any) => {
    return {
      name: productData['name'],
      brand: productData['brand'] || '?',
      price: productData['offers']['price'],
      currency: productData['offers']['priceCurrency'],
      images: [productData['image']],
    };
  },
  'shop.lululemon.com': (productData: any) => {
    // we have problems here with the isReady lock
    return {
      schemaUrl: productData['offers']['url'],
      name: productData['name'],
      brand: productData['brand'],
      price: '218', // unknown price
      currency: 'USD',
      images: productData['image'],
    };
  },
  'mytheresa.com': (productData: any) => {
    // we have a big problem with the isReady lock
    return {
      name: productData['name'],
      brand: productData['brand']['name'],
      price: productData['offers']['PriceSpecification']['price'],
      currency: productData['offers']['priceCurrency'],
      images: [productData['image']],
    };
  },
};

const postProcess: {
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
  'softgoat.com': (product: IntermediaryProduct) => {
    return {
      ...product,
      price: product.price.replace(/\s/g, ''),
      images: [],
    };
  },
  'farfetch.com': (product: IntermediaryProduct) => {
    return {
      ...product,
      images: product.images.map((image: any) => image.contentUrl),
    };
  },
};

const type1Domains = [
  'softgoat.com',
  'se.loropiana.com',
  'us.loropiana.com',
  'moncler.com',
  'farfetch.com',
  'adaysmarch.com',
  'hermes.com',
];
const type2Domains = ['boozt.com', 'eu.lululemon.com', 'valentino.com'];
const type3Domains = ['zalando.se', 'careofcarl.se', 'gucci.com'];
const type4Domains = ['hm.com'];

function getParser(domain: string) {
  let parser;
  if (type1Domains.includes(domain)) {
    parser = baseParsers['type1'];
  } else if (type2Domains.includes(domain)) {
    parser = baseParsers['type2'];
  } else if (type3Domains.includes(domain)) {
    parser = baseParsers['type3'];
  } else if (type4Domains.includes(domain)) {
    parser = baseParsers['type4'];
  } else if (domainSpecificParsers[domain]) {
    parser = domainSpecificParsers[domain];
  }

  return parser;
}

export function parseProductData(url: string, rawData: string): UserProduct {
  const domain = getDomain(url);
  if (!domain) throw new Error('Could not parse domain');

  let productData;
  try {
    const parsedRawData = JSON.parse(rawData);
    productData = JSON.parse(parsedRawData['data']);
  } catch (e) {
    throw new Error(`Couldn't parse raw JSON data: ${e}`);
  }

  let product: IntermediaryProduct = {
    name: '',
    brand: '',
    price: '',
    currency: '',
    images: [],
  };

  let parse = getParser(domain);
  if (!parse) {
    throw new Error(`No parser available for domain: ${domain}`);
  }

  try {
    product = parse!(productData);
    if (postProcess[domain]) {
      product = postProcess[domain](product);
    }
  } catch (e) {
    throw new Error(`couldn't parse on domain:${domain} with error: ${e}`);
  }

  return { ...product, url: url, domain: domain, liked: false };
}
