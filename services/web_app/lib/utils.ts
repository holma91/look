import { ReadonlyURLSearchParams } from 'next/navigation';
import { Product } from './shopify/types';

export const createUrl = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams
) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? '?' : ''}${paramsString}`;

  return `${pathname}${queryString}`;
};

export const ensureStartsWith = (stringToCheck: string, startsWith: string) =>
  stringToCheck.startsWith(startsWith)
    ? stringToCheck
    : `${startsWith}${stringToCheck}`;

export function getProduct(imageNumber: number): Product {
  const products = [];
  const baseProduct = {
    id: 'dummy-id',
    handle: 'handle',
    availableForSale: true,
    title: 'dummy-title',
    description: 'dummy-description',
    descriptionHtml: '<p>dummy-description-html</p>',
    options: [
      {
        id: 'dummy-option-id',
        name: 'dummy-option-name',
        values: ['dummy-value1', 'dummy-value2'],
      },
    ],
    priceRange: {
      maxVariantPrice: {
        amount: '100',
        currencyCode: 'USD',
      },
      minVariantPrice: {
        amount: '50',
        currencyCode: 'USD',
      },
    },
    featuredImage: {
      url: 'https://demo.vercel.store/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0754%2F3727%2F7491%2Ffiles%2Ft-shirt-1.png%3Fv%3D1689798965&w=2048&q=75',
      altText: 'dummy-alt-text',
      width: 200,
      height: 200,
    },
    seo: {
      title: 'dummy-seo-title',
      description: 'dummy-seo-description',
    },
    tags: ['dummy-tag1', 'dummy-tag2'],
    updatedAt: '2023-09-21T00:00:00Z',

    // Your variants and images as previously defined:
    variants: [
      {
        id: 'dummy-variant-id',
        title: 'dummy-variant-title',
        availableForSale: true,
        selectedOptions: [
          {
            name: 'dummy-selected-option-name',
            value: 'dummy-selected-option-value',
          },
        ],
        price: {
          amount: '0',
          currencyCode: 'USD',
        },
      },
    ],
  };
  const product0: Product = {
    ...baseProduct,
    images: [
      {
        url: 'https://demo.vercel.store/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0754%2F3727%2F7491%2Ffiles%2Ft-shirt-1.png%3Fv%3D1689798965&w=2048&q=75',
        altText: 'black shirt',
        width: 200,
        height: 200,
      },
      {
        url: 'https://demo.vercel.store/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0754%2F3727%2F7491%2Ffiles%2Ft-shirt-2.png%3Fv%3D1689798965&w=1920&q=75',
        altText: 'red shirt',
        width: 200,
        height: 200,
      },
      {
        url: 'https://demo.vercel.store/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0754%2F3727%2F7491%2Ffiles%2Ft-shirt-circles-blue.png%3Fv%3D1690003396&w=1920&q=75',
        altText: 'blue shirt',
        width: 200,
        height: 200,
      },
    ],
  };
  const product1: Product = {
    ...baseProduct,
    images: [
      {
        url: 'https://demo.vercel.store/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0754%2F3727%2F7491%2Ffiles%2Ft-shirt-1.png%3Fv%3D1689798965&w=2048&q=75',
        altText: 'black shirt',
        width: 200,
        height: 200,
      },
      {
        url: 'https://demo.vercel.store/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0754%2F3727%2F7491%2Ffiles%2Ft-shirt-2.png%3Fv%3D1689798965&w=1920&q=75',
        altText: 'red shirt',
        width: 200,
        height: 200,
      },
      {
        url: 'https://demo.vercel.store/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0754%2F3727%2F7491%2Ffiles%2Ft-shirt-circles-blue.png%3Fv%3D1690003396&w=1920&q=75',
        altText: 'blue shirt',
        width: 200,
        height: 200,
      },
    ],
  };
  const product2: Product = {
    ...baseProduct,
    title: 'Ribbed Turtleneck',
    priceRange: {
      maxVariantPrice: {
        amount: '4295',
        currencyCode: 'SEK',
      },
      minVariantPrice: {
        amount: '4295',
        currencyCode: 'SEK',
      },
    },
    images: [
      {
        url: 'https://softgoat.centracdn.net/client/dynamic/images/2297_2bd35d0b27-1sf-23072w23gg_2-size1024.jpg',
        altText: 'black shirt',
        width: 200,
        height: 200,
      },
      {
        url: 'https://softgoat.centracdn.net/client/dynamic/images/2297_dcf0e89ba6-ribbed_turtleneck_515_greige_front-size1024.jpg',
        altText: 'red shirt',
        width: 200,
        height: 200,
      },
      {
        url: 'https://softgoat.centracdn.net/client/dynamic/images/2297_ce37621189-1sf-23072w23gg_3-size1024.jpg',
        altText: 'red shirt',
        width: 200,
        height: 200,
      },
      {
        url: 'https://softgoat.centracdn.net/client/dynamic/images/2297_0043d63f55-1sf-23072w23gg_1-size1024.jpg',
        altText: 'blue shirt',
        width: 200,
        height: 200,
      },
      {
        url: 'https://softgoat.centracdn.net/client/dynamic/images/2297_3e1c93fbe7-1sf-23072w23gg_4-size1024.jpg',
        altText: 'blue shirt',
        width: 200,
        height: 200,
      },
    ],
  };
  products.push(product0);
  products.push(product1);
  products.push(product2);

  return products[imageNumber];
}
