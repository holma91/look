import { useQuery } from '@tanstack/react-query';
import { Product, Image as ShopifyImageType } from 'lib/shopify/types';

type DbType = {
  [productName: string]: {
    [modelName: string]: {
      [env: string]: string[];
    };
  };
};

export type ImageReturnType = {
  src: string;
  altText: string;
}[];

const db: { [key: string]: { [key: string]: string[] } } = {
  'white-hoodie': {
    white: ['white1.png', 'white2.png'],
    black: ['black1.png', 'black2.png', 'black3.png'],
    asian: ['asian1.png', 'asian2.png'],
    latin: ['latin1.png', 'latin2.png', 'latin3.png']
  },
  'white-t-shirt': {
    white: [],
    black: ['black1.png', 'black2.png', 'black3.png'],
    asian: ['asian1.png', 'asian2.png'],
    latin: ['latin1.png', 'latin2.png']
  },
  'black-sweatshirt': {
    white: ['white1.png', 'white2.png'],
    black: ['black1.png', 'black2.png'],
    asian: ['asian1.png', 'asian2.png'],
    latin: ['latin1.png', 'latin2.png']
  },
  'black-long-sleeve-shirt': {
    white: ['white1.png', 'white2.png'],
    black: ['black1.png', 'black2.png'],
    asian: ['asian1.png', 'asian2.png'],
    latin: ['latin1.png']
  }
};

const getImages = (product: Product, currentModel: string, currentEnv: string): ImageReturnType => {
  if (currentModel === 'base') {
    return product.images.map((image: ShopifyImageType) => ({
      src: image.url,
      altText: image.altText
    }));
  }
  const modelImages = db[product.handle]?.[currentModel] ?? [];

  return modelImages.map((src: any) => ({
    src: `/${product.handle}/${src}`,
    altText: 'some alt text'
  }));
};

export function useImages(product: Product, currentModel: string, currentEnv: string) {
  const queryInfo = useQuery({
    queryKey: ['productImages', product.handle, currentModel, currentEnv],
    queryFn: () => getImages(product, currentModel, currentEnv)
  });

  return queryInfo;
}
