'use client';
import { Product } from 'lib/shopify/types';
import { createUrl } from 'lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Buying } from './buying/buying';
import { Testing } from './testing/testing';

export function Product({ product }: { product: Product }) {
  const [currentMode, setCurrentMode] = useState(
    useSearchParams().get('mode') ?? 'testing'
  );
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleModeChange = (mode: string) => {
    const updatedSearchParams = new URLSearchParams(searchParams.toString());
    updatedSearchParams.set('mode', mode);
    const updatedUrl = createUrl(pathname, updatedSearchParams);
    router.replace(updatedUrl, { scroll: false });

    setCurrentMode(mode);
  };

  return (
    <>
      <div className="flex flex-col items-center mb-4">
        <div className="flex">
          <button
            className={`py-2 px-4 border-b-2 ${
              currentMode === 'buying'
                ? 'border-blue-500'
                : 'border-neutral-50 dark:border-neutral-900'
            }`}
            onClick={() => handleModeChange('buying')}
          >
            Buying
          </button>
          <button
            className={`py-2 px-4 border-b-2 ${
              currentMode === 'testing'
                ? 'border-blue-500'
                : 'border-neutral-50 dark:border-neutral-900'
            }`}
            onClick={() => handleModeChange('testing')}
          >
            Testing
          </button>
        </div>
      </div>
      <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-black md:p-12 lg:flex-row lg:gap-8">
        {currentMode === 'buying' ? (
          <Buying product={product} />
        ) : (
          <Testing product={product} />
        )}
      </div>
    </>
  );
}
