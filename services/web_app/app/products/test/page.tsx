'use client';
import { Gallery } from '@/components/product/gallery';
import { ProductDescription } from '@/components/product/product-description';
import { useProductContext } from '@/context/Product';
import { redirect } from 'next/navigation';

export default async function ProductPage({
  params,
}: {
  params: { handle: string };
}) {
  const { product } = useProductContext();
  console.log('product', product);

  if (!product) {
    redirect('/');
  }

  return (
    <div className="mx-auto max-w-screen-2xl px-4">
      <div className="flex flex-col rounded-md border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-black md:p-12 lg:flex-row lg:gap-8">
        <div className="h-full w-full basis-full lg:basis-4/6">
          <Gallery
            images={product.files.map((file: File) => ({
              src: URL.createObjectURL(file),
              altText: 'some alt text',
            }))}
          />
        </div>

        <div className="basis-full lg:basis-2/6">
          <ProductDescription product={product} />
        </div>
      </div>
    </div>
  );
}
