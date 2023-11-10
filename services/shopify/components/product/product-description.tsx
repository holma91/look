import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { AddToCart } from 'components/cart/add-to-cart';
import Price from 'components/price';
import Prose from 'components/prose';
import { Product } from 'lib/shopify/types';
import { Dispatch, SetStateAction, useState } from 'react';
import { BasicSelector } from './basic-selector';
import { ModelSelector } from './model-selector';
import { VariantSelector } from './variant-selector';

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
  setImgIndex: Dispatch<SetStateAction<number>>;
};

export function ProductDescription({
  product,
  currentModel,
  setCurrentModel,
  currentEnv,
  setCurrentEnv,
  setImgIndex,
}: Props) {
  const [virtualFitting, setVirtualFitting] = useState(false);

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
      <div className="flex flex-col gap-6 border p-4 mb-6 rounded-lg dark:border-neutral-700">
        <div className="flex justify-between items-center">
          <h1>Virtual Fitting</h1>
          <ChevronDownIcon
            className="h-4 w-4"
            onClick={() => setVirtualFitting(!virtualFitting)}
          />
        </div>
        {virtualFitting ? (
          <>
            <ModelSelector
              option={modelOption}
              currentModel={currentModel}
              setCurrentModel={setCurrentModel}
              setImgIndex={setImgIndex}
            />
            <BasicSelector
              option={environmentOption}
              currentOption={currentEnv}
              setCurrentOption={setCurrentEnv}
              setImgIndex={setImgIndex}
            />
          </>
        ) : null}
      </div>
      <VariantSelector options={product.options} variants={product.variants} />

      {product.descriptionHtml ? (
        <Prose
          className="mb-6 text-sm leading-tight dark:text-white/[60%]"
          html={product.descriptionHtml}
        />
      ) : null}
      <AddToCart
        variants={product.variants}
        availableForSale={product.availableForSale}
      />
    </>
  );
}
