import { useQuery } from '@tanstack/react-query';
import { Product, Image as ShopifyImageType } from 'lib/shopify/types';

type DbType = {
  [productName: string]: {
    [modelName: string]: {
      [env: string]: string[];
    };
  };
};

type ImageReturnType = {
  src: string;
  altText: string;
}[];

const db: DbType = {
  'pique-oversized-fit-t-shirt': {
    white: {
      base: [],
      restaurant: [],
      park: [],
      city: [],
      villa: [],
    },
    black: {
      base: [],
      restaurant: [],
      park: [],
      city: [],
      villa: [],
    },
    asian: {
      base: [],
      restaurant: [],
      park: [],
      city: [],
      villa: [],
    },
    latino: {
      base: [],
      restaurant: [],
      park: [],
      city: [],
      villa: [],
    },
    indian: {
      base: [],
      restaurant: [],
      park: [],
      city: [],
      villa: [],
    },
  },
  'metal-vent-tech-short-sleeve-shirt': {
    white: {
      base: ['/blonde2.png', '/brunette2.png'],
      restaurant: [],
      park: [],
      city: [],
      villa: [],
    },
    black: {
      base: ['/black2.png'],
      restaurant: ['/black-restaurant2.png'],
      park: [],
      city: [],
      villa: [],
    },
    asian: {
      base: ['/asian2.png'],
      restaurant: ['/asian-restaurant2.png'],
      park: [],
      city: [],
      villa: [],
    },
    latino: {
      base: [],
      restaurant: [],
      park: [],
      city: [],
      villa: [],
    },
    indian: {
      base: ['/indian2.png'],
      restaurant: [],
      park: [],
      city: [],
      villa: [],
    },
  },
  'balancer-short-sleeve-shirt': {
    white: {
      base: [],
      restaurant: [],
      park: [],
      city: [],
      villa: [],
    },
    black: {
      base: [],
      restaurant: [],
      park: [],
      city: [],
      villa: [],
    },
    asian: {
      base: [],
      restaurant: [],
      park: [],
      city: [],
      villa: [],
    },
    latino: {
      base: [],
      restaurant: [],
      park: [],
      city: [],
      villa: [],
    },
    indian: {
      base: [],
      restaurant: [],
      park: [],
      city: [],
      villa: [],
    },
  },
};

const getImages = (
  product: Product,
  currentModel: string,
  currentEnv: string
): ImageReturnType => {
  if (currentModel === 'base') {
    return product.images.map((image: ShopifyImageType) => ({
      src: image.url,
      altText: image.altText,
    }));
  }

  const modelImages = db[product.handle]?.[currentModel]?.[currentEnv] ?? [];

  return modelImages.map((src: any) => ({
    src,
    altText: 'some alt text',
  }));
};

export function useImages(
  product: Product,
  currentModel: string,
  currentEnv: string
) {
  const queryInfo = useQuery({
    queryKey: ['productImages', product.handle, currentModel, currentEnv],
    queryFn: () => getImages(product, currentModel, currentEnv),
  });

  return queryInfo;
}
