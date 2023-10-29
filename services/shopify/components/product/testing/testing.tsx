'use client';
import { useImages } from 'hooks/useImages';
import { Product } from 'lib/shopify/types';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { TestingDescription } from './testing-description';
import { TestingGallery } from './testing-gallery';

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

  const { data: images } = useImages(product, currentModel, currentEnv);

  return (
    <>
      <div className="h-full w-full basis-full lg:basis-4/6">
        <TestingGallery
          images={images ?? []}
          imgIndex={imgIndex}
          setImgIndex={setImgIndex}
          currentModel={currentModel}
          currentEnv={currentEnv}
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
