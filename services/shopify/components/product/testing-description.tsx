import { AddToCart } from 'components/cart/add-to-cart';
import Prose from 'components/prose';
import { Product } from 'lib/shopify/types';
import { Dispatch, SetStateAction } from 'react';
import { BasicSelector } from './basic-selector';
import { ModelSelector } from './model-selector';

const modelOption = {
  id: 'model-selector',
  name: 'Model',
  values: ['base', 'white', 'black', 'asian', 'latino', 'indian', 'me'],
};

const environmentOption = {
  id: 'environment-selector',
  name: 'Environment',
  values: ['base', 'restaurant', 'park', 'city', 'villa'],
};

type Props = {
  product: Product;
  currentModel: string;
  setCurrentModel: Dispatch<SetStateAction<string>>;
};

export function TestingDescription({
  product,
  currentModel,
  setCurrentModel,
}: Props) {
  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-5xl font-medium">{product.title}</h1>
      </div>
      {/* <ModelSelector /> */}
      <ModelSelector
        option={modelOption}
        currentModel={currentModel}
        setCurrentModel={setCurrentModel}
      />
      <BasicSelector option={environmentOption} />
      {/* <EnvironmentSelector options={product.options} variants={product.variants} /> */}
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
