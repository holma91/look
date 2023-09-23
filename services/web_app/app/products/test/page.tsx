'use client';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { createUrl } from '@/lib/utils';
import { ProductDescription } from '@/components/product/product-description';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { GridTileImage } from '@/components/grid/tile';
import { usePathname, useSearchParams } from 'next/navigation';
import { useProductContext } from '@/context/Product';
import { Gallery } from '@/components/product/gallery';
import { GalleryCanvas } from '@/components/product/gallery-canvas';

export default function ProductPage({
  params,
}: {
  params: { handle: string };
}) {
  const searchParams = useSearchParams();
  const imageSearchParam = searchParams.get('image');
  const currentImageIndex = imageSearchParam ? parseInt(imageSearchParam) : 0;
  console.log('currentImageIndex', currentImageIndex);

  const [okImageIndexes, setOkImageIndexes] = useState<number[]>([]);
  let { product } = useProductContext();
  if (!product) {
    product = {
      uid: '2000',
      title: 'Ribbed Turtleneck',
      brand: 'Softgoat',
      price: 2700,
      currency: 'SEK',
      files: [
        'https://softgoat.centracdn.net/client/dynamic/images/2297_2bd35d0b27-1sf-23072w23gg_2-size1024.jpg',
        'https://softgoat.centracdn.net/client/dynamic/images/2297_dcf0e89ba6-ribbed_turtleneck_515_greige_front-size1600.jpg',
        'https://softgoat.centracdn.net/client/dynamic/images/2297_0043d63f55-1sf-23072w23gg_1-size1600.jpg',
      ],
    };
    // redirect('/');
  }

  const handleTestProduct = () => {
    console.log('test product clicked');
  };

  useEffect(() => {
    // start tf.js models
    // mark which images are ok to use
    setOkImageIndexes([0, 2]);

    // send to server to compute embeddings
  }, [setOkImageIndexes]);

  return (
    <div className="mx-auto max-w-screen-2xl px-4">
      <div className="flex flex-col gap-4 md:flex-row md:gap-8 p-8 md:p-12 rounded-md border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black">
        <div className="md:basis-4/7 lg:basis-4/6">
          <GalleryCanvas
            images={product.files.map((file: File | string) => ({
              src: typeof file === 'string' ? file : URL.createObjectURL(file),
              altText: 'some alt text',
            }))}
          />
        </div>

        <div className="md:basis-3/7 lg:basis-2/6">
          <ProductDescription
            product={product}
            okImageIndexes={okImageIndexes}
            currentImageIndex={currentImageIndex}
            handleTestProduct={handleTestProduct}
          />
        </div>
      </div>
    </div>
  );
}
