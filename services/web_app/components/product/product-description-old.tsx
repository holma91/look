'use client';
import clsx from 'clsx';
import { PlusIcon } from '@heroicons/react/24/outline';
import LoadingDots from '@/components/loading-dots';
import Price from '@/components/price';
import { Product } from '@/lib/shopify/types';
import { useState } from 'react';

const models = [
  'base model',
  'white guy',
  'black guy',
  'white woman',
  'black woman',
];

const environments = [
  'studio',
  'restaurant',
  'kitchen',
  'city',
  'beach',
  'park',
  'varied',
];

const numberOfImagesChoices = [1, 2, 3, 4, 5, 6];

export function ProductDescriptionOld({ product }: { product: Product }) {
  const [activeModel, setActiveModel] = useState('base model');
  const [activeEnvironment, setActiveEnvironment] = useState('studio');
  const [numberOfImages, setNumberOfImages] = useState(1);

  const isPending = false;

  const handleTestProduct = () => {
    console.log('test product clicked');
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-1 text-5xl font-medium">{product.title}</h1>
        <h1 className="mb-3 text-xl font-medium">Softgoat</h1>
        <div className="mr-auto w-auto rounded-md bg-blue-600 p-2 text-sm text-white">
          <Price
            amount={product.priceRange.maxVariantPrice.amount}
            currencyCode={product.priceRange.maxVariantPrice.currencyCode}
          />
        </div>
      </div>
      <div>
        <dl className="mb-8">
          <dt className="mb-4 text-sm uppercase tracking-wide">Model</dt>
          <dd className="flex flex-wrap gap-3">
            {models.map((value) => {
              const isActive = value === activeModel;
              return (
                <button
                  key={value}
                  onClick={() => setActiveModel(value)}
                  className={clsx(
                    'flex min-w-[48px] items-center justify-center rounded-md border bg-neutral-100 px-2 py-1 text-sm dark:border-neutral-800 dark:bg-neutral-900',
                    {
                      'cursor-default ring-2 ring-blue-600': isActive,
                      'ring-1 ring-transparent transition duration-300 ease-in-out hover:scale-110 hover:ring-blue-600 ':
                        !isActive,
                    }
                  )}
                >
                  {value}
                </button>
              );
            })}
          </dd>
        </dl>
        <dl className="mb-8">
          <dt className="mb-4 text-sm uppercase tracking-wide">Environment</dt>
          <dd className="flex flex-wrap gap-3">
            {environments.map((value) => {
              const isActive = value === activeEnvironment;
              return (
                <button
                  key={value}
                  onClick={() => setActiveEnvironment(value)}
                  className={clsx(
                    'flex min-w-[48px] items-center justify-center rounded-md border bg-neutral-100 px-2 py-1 text-sm dark:border-neutral-800 dark:bg-neutral-900',
                    {
                      'cursor-default ring-2 ring-blue-600': isActive,
                      'ring-1 ring-transparent transition duration-300 ease-in-out hover:scale-110 hover:ring-blue-600 ':
                        !isActive,
                    }
                  )}
                >
                  {value}
                </button>
              );
            })}
          </dd>
        </dl>
        <dl className="mb-8">
          <dt className="mb-4 text-sm uppercase tracking-wide">
            Number of images
          </dt>
          <dd className="flex flex-wrap gap-3">
            {numberOfImagesChoices.map((value) => {
              const isActive = value === numberOfImages;
              return (
                <button
                  key={value}
                  onClick={() => setNumberOfImages(value)}
                  className={clsx(
                    'flex min-w-[48px] items-center justify-center rounded-md border bg-neutral-100 px-2 py-1 text-sm dark:border-neutral-800 dark:bg-neutral-900',
                    {
                      'cursor-default ring-2 ring-blue-600': isActive,
                      'ring-1 ring-transparent transition duration-300 ease-in-out hover:scale-110 hover:ring-blue-600 ':
                        !isActive,
                    }
                  )}
                >
                  {value}
                </button>
              );
            })}
          </dd>
        </dl>

        <button
          aria-label="Add item to cart"
          disabled={isPending}
          title={'Test product'}
          onClick={handleTestProduct}
          className={clsx(
            'relative flex w-full items-center justify-center rounded-md bg-blue-600 p-4 tracking-wide text-white hover:opacity-90'
          )}
        >
          <div className="absolute left-0 ml-4">
            {!isPending ? (
              <PlusIcon className="h-5" />
            ) : (
              <LoadingDots className="mb-3 bg-white" />
            )}
          </div>
          <span>{!isPending ? 'Test product' : 'Generating...'}</span>
        </button>
      </div>
    </div>
  );
}
