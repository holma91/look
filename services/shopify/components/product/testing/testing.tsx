'use client';
import { Image as ImageType, Product } from 'lib/shopify/types';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { TestingDescription } from './testing-description';
import { TestingGallery } from './testing-gallery';

const db: { [productName: string]: { [modelName: string]: string[] } } = {
  'pique-oversized-fit-t-shirt': {
    base: ['ahh', 'baaa'],
    white: [
      'https://softgoat.centracdn.net/client/dynamic/images/2244_3c40f59723-mens_zip_hoodie_navy_325_2-size1024.jpg',
      'https://softgoat.centracdn.net/client/dynamic/images/2244_3d9811cdfc-mens_zip_hoodie_navy_2595_front-size1600.jpg',
      'https://softgoat.centracdn.net/client/dynamic/images/2244_17d78740ee-mens_zip_hoodie_navy_325_4-size1600.jpg',
    ],
    black: [],
    asian: [],
    latino: [],
    indian: [],
  },
  'metal-vent-tech-short-sleeve-shirt': {
    base: [],
    white: [],
    black: [],
    asian: [],
    latino: [],
    indian: [],
  },
  'balancer-short-sleeve-shirt': {
    base: [],
    white: [],
    black: [],
    asian: [],
    latino: [],
    indian: [],
  },
};

export function Testing({ product }: { product: Product }) {
  const [currentModel, setCurrentModel] = useState(
    useSearchParams().get('model') ?? 'base'
  );
  const [currentEnv, setCurrentEnv] = useState(
    useSearchParams().get('env') ?? 'base'
  );
  const [imgIndex, setImgIndex] = useState(
    parseInt(useSearchParams().get('image') ?? '0')
  );

  const images = useMemo(() => {
    if (currentModel === 'base') {
      return product.images.map((image: ImageType) => ({
        src: image.url,
        altText: image.altText,
      }));
    }

    return (
      db[product.handle]?.[currentModel]?.map((src) => ({
        src,
        altText: 'some alt text',
      })) ?? []
    );
  }, [currentModel, product, db]);

  console.log('currentModel', currentModel);
  console.log('currentImage', images[imgIndex]);
  console.log('currentEnv', currentEnv);

  return (
    <>
      <div className="h-full w-full basis-full lg:basis-4/6">
        <TestingGallery
          images={images}
          imgIndex={imgIndex}
          setImgIndex={setImgIndex}
        />
      </div>

      <div className="basis-full lg:basis-2/6">
        <TestingDescription
          product={product}
          currentModel={currentModel}
          setCurrentModel={setCurrentModel}
          currentEnv={currentEnv}
          setCurrentEnv={setCurrentEnv}
        />
      </div>
    </>
  );
}
