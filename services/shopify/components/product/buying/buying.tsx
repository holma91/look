'use client';
import { Image, Product } from 'lib/shopify/types';
import { Gallery } from './buying-gallery';
import { ProductDescription } from './product-description';

export function Buying({ product }: { product: Product }) {
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
