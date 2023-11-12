'use client';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { AddToCart } from 'components/cart/add-to-cart';
import Price from 'components/price';
import Prose from 'components/prose';
import { Product } from 'lib/shopify/types';
import { Dispatch, SetStateAction, useState } from 'react';
import { ModelSelector } from './model-selector';
import { VariantSelector } from './variant-selector';

const modelOption = {
  id: 'model',
  name: 'Model',
  values: ['base', 'white', 'black', 'asian', 'latin', 'me']
};

type Props = {
  product: Product;
  currentModel: string;
  setCurrentModel: Dispatch<SetStateAction<string>>;
  currentEnv: string;
  setCurrentEnv: Dispatch<SetStateAction<string>>;
  setImgIndex: Dispatch<SetStateAction<number>>;
};

export function ProductDescription({
  product,
  currentModel,
  setCurrentModel,
  currentEnv,
  setCurrentEnv,
  setImgIndex
}: Props) {
  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-5xl font-medium">{product.title}</h1>
        <div className="mr-auto w-auto rounded-full bg-blue-600 p-2 text-sm text-white">
          <Price
            amount={product.priceRange.maxVariantPrice.amount}
            currencyCode={product.priceRange.maxVariantPrice.currencyCode}
          />
        </div>
      </div>
      <VirtualFitting
        currentModel={currentModel}
        setCurrentModel={setCurrentModel}
        setImgIndex={setImgIndex}
      />
      <VariantSelector options={product.options} variants={product.variants} />

      {product.descriptionHtml ? (
        <Prose
          className="mb-6 text-sm leading-tight dark:text-white/[60%]"
          html={product.descriptionHtml}
        />
      ) : null}
      <AddToCart variants={product.variants} availableForSale={product.availableForSale} />
    </>
  );
}

type VirtualFittingProps = {
  currentModel: string;
  setCurrentModel: Dispatch<SetStateAction<string>>;
  setImgIndex: Dispatch<SetStateAction<number>>;
};

function VirtualFitting({ currentModel, setCurrentModel, setImgIndex }: VirtualFittingProps) {
  const [virtualFitting, setVirtualFitting] = useState(false);
  return (
    <div className="mb-6 flex flex-col gap-3 rounded-lg border bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900">
      <div
        className="flex cursor-pointer items-center justify-between p-4"
        onClick={() => setVirtualFitting(!virtualFitting)}
      >
        <h1>Virtual Fitting</h1>
        <ChevronDownIcon className="h-4 w-4" />
      </div>
      {virtualFitting ? (
        <div className="p-4 pt-0">
          <ModelSelector
            option={modelOption}
            currentModel={currentModel}
            setCurrentModel={setCurrentModel}
            setImgIndex={setImgIndex}
          />
        </div>
      ) : null}
    </div>
  );
}
