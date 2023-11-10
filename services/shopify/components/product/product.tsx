'use client';
import { Image, Product } from 'lib/shopify/types';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Gallery } from './gallery';
import { ProductDescription } from './product-description';

export function Product({ product }: { product: Product }) {
  const [currentModel, setCurrentModel] = useState(
    useSearchParams().get('model') ?? 'base'
  );
  const [currentEnv, setCurrentEnv] = useState(
    useSearchParams().get('env') ?? 'base'
  );
  return (
    <>
      <div className="h-full w-full basis-full lg:basis-4/6">
        <Gallery
          images={product.images.map((image: Image) => ({
            src: image.url,
            altText: image.altText,
          }))}
        />
      </div>

      <div className="basis-full lg:basis-2/6">
        <ProductDescription
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
