'use client';
import { PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Prose from 'components/prose';
import { Product } from 'lib/shopify/types';
import { Dispatch, SetStateAction } from 'react';
import { BasicSelector } from '../basic-selector';
import { ModelSelector } from '../model-selector';

const modelOption = {
  id: 'model',
  name: 'Model',
  values: ['base', 'white', 'black', 'asian', 'latino', 'indian', 'me'],
};

const environmentOption = {
  id: 'env',
  name: 'Environment',
  values: ['base', 'restaurant', 'park', 'city', 'villa'],
};

type Props = {
  product: Product;
  currentModel: string;
  setCurrentModel: Dispatch<SetStateAction<string>>;
  currentEnv: string;
  setCurrentEnv: Dispatch<SetStateAction<string>>;
};

export function TestingDescription({
  product,
  currentModel,
  setCurrentModel,
  currentEnv,
  setCurrentEnv,
}: Props) {
  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-5xl font-medium">{product.title}</h1>
      </div>
      <ModelSelector
        option={modelOption}
        currentModel={currentModel}
        setCurrentModel={setCurrentModel}
      />
      <BasicSelector
        option={environmentOption}
        currentOption={currentEnv}
        setCurrentOption={setCurrentEnv}
      />
      {product.descriptionHtml ? (
        <Prose
          className="mb-6 text-sm leading-tight dark:text-white/[60%]"
          html={product.descriptionHtml}
        />
      ) : null}
      <AddToFavorites />
    </>
  );
}

function AddToFavorites() {
  return (
    <button
      aria-label="Add item to cart"
      title={'Add to Favorites'}
      onClick={() => {
        console.log('added to favorites!');
      }}
      className={clsx(
        'relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white hover:opacity-90'
      )}
    >
      <div className="absolute left-0 ml-4">
        <PlusIcon className="h-5" />
      </div>
      <span>Add to Favorites</span>
    </button>
  );
}
