import { AddToCart } from 'components/cart/add-to-cart';
import Prose from 'components/prose';
import { Product } from 'lib/shopify/types';
import { ModelSelector } from './model-selector';

export function TestingDescription({ product }: { product: Product }) {
  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-5xl font-medium">{product.title}</h1>
      </div>
      <ModelSelector options={product.options} variants={product.variants} />

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
