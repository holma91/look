'use client';
import { useImages } from 'hooks/useImages';
import { Product } from 'lib/shopify/types';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { ProductDescription } from './product-description';
import { TestingGallery } from './testing/testing-gallery';

export function Product({ product }: { product: Product }) {
  const [currentModel, setCurrentModel] = useState(
    useSearchParams().get('model') ?? 'base'
  );
  const [currentEnv, setCurrentEnv] = useState(
    useSearchParams().get('env') ?? 'base'
  );
  const [imgIndex, setImgIndex] = useState(
    parseInt(useSearchParams().get('image') ?? '0')
  );

  let { data: images } = useImages(product, currentModel, currentEnv);

  return (
    <>
      <div className="h-full w-full basis-full lg:basis-4/6">
        <TestingGallery
          images={images ?? []}
          imgIndex={imgIndex}
          setImgIndex={setImgIndex}
        />
      </div>

      <div className="basis-full lg:basis-2/6">
        <ProductDescription
          product={product}
          currentModel={currentModel}
          setCurrentModel={setCurrentModel}
          currentEnv={currentEnv}
          setCurrentEnv={setCurrentEnv}
          setImgIndex={setImgIndex}
        />
      </div>
    </>
  );
}
