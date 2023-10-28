'use client';
import { Image, Product } from 'lib/shopify/types';
import { useState } from 'react';
import { Gallery } from './gallery';
import { ProductDescription } from './product-description';
import { TestingDescription } from './testing-description';
import { TestingGallery } from './testing-gallery';

export function Product({ product }: { product: Product }) {
  const [currentMode, setCurrentMode] = useState('Buying');

  return (
    <>
      <div className="flex flex-col items-center mb-4">
        <div className="flex">
          <button
            className={`py-2 px-4 border-b-2 ${
              currentMode === 'Buying'
                ? 'border-blue-500'
                : 'border-neutral-50 dark:border-neutral-900'
            }`}
            onClick={() => setCurrentMode('Buying')}
          >
            Buying
          </button>
          <button
            className={`py-2 px-4 border-b-2 ${
              currentMode === 'Testing'
                ? 'border-blue-500'
                : 'border-neutral-50 dark:border-neutral-900'
            }`}
            onClick={() => setCurrentMode('Testing')}
          >
            Testing
          </button>
        </div>
      </div>
      <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-black md:p-12 lg:flex-row lg:gap-8">
        {currentMode === 'Buying' ? (
          <BuyingMode product={product} />
        ) : (
          <TestingMode product={product} />
        )}
      </div>
    </>
  );
}

function BuyingMode({ product }: { product: Product }) {
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
        <ProductDescription product={product} />
      </div>
    </>
  );
}

function TestingMode({ product }: { product: Product }) {
  const [currentModel, setCurrentModel] = useState('base');
  console.log('product.images', product.images);
  console.log('product', product);

  // maybe move Gallery and Description to one component
  // reason being, they are sharing a bunch of state

  return (
    <>
      <div className="h-full w-full basis-full lg:basis-4/6">
        <TestingGallery
          baseImages={product.images.map((image: Image) => ({
            src: image.url,
            altText: image.altText,
          }))}
          currentModel={currentModel}
          productId={product.handle}
        />
      </div>

      <div className="basis-full lg:basis-2/6">
        <TestingDescription
          product={product}
          currentModel={currentModel}
          setCurrentModel={setCurrentModel}
        />
      </div>
    </>
  );
}
