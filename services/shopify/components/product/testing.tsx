'use client';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { GridTileImage } from 'components/grid/tile';
import { Image as ImageType, Product } from 'lib/shopify/types';
import { createUrl } from 'lib/utils';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { TestingDescription } from './testing-description';

const db: { [productName: string]: { [modelName: string]: string[] } } = {
  'pique-oversized-fit-t-shirt': {
    base: ['ahh', 'baaa'],
    white: [
      'https://softgoat.centracdn.net/client/dynamic/images/2244_3c40f59723-mens_zip_hoodie_navy_325_2-size1024.jpg',
      'https://softgoat.centracdn.net/client/dynamic/images/2244_3d9811cdfc-mens_zip_hoodie_navy_2595_front-size1600.jpg',
      'https://softgoat.centracdn.net/client/dynamic/images/2244_17d78740ee-mens_zip_hoodie_navy_325_4-size1600.jpg',
    ],
    black: [],
    asian: [],
    latino: [],
    indian: [],
  },
  'metal-vent-tech-short-sleeve-shirt': {
    base: [],
    white: [],
    black: [],
    asian: [],
    latino: [],
    indian: [],
  },
  'balancer-short-sleeve-shirt': {
    base: [],
    white: [],
    black: [],
    asian: [],
    latino: [],
    indian: [],
  },
};

export function Testing({ product }: { product: Product }) {
  const [currentModel, setCurrentModel] = useState(
    useSearchParams().get('model') ?? 'base'
  );
  const [imgIndex, setImgIndex] = useState(
    parseInt(useSearchParams().get('image') ?? '0')
  );

  const images = useMemo(() => {
    if (currentModel === 'base') {
      return product.images.map((image: ImageType) => ({
        src: image.url,
        altText: image.altText,
      }));
    }

    return (
      db[product.handle]?.[currentModel]?.map((src) => ({
        src,
        altText: 'some alt text',
      })) ?? []
    );
  }, [currentModel, product, db]);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePreviousImage = () => {
    const previousSearchParams = new URLSearchParams(searchParams.toString());
    const previousImageIndex =
      imgIndex === 0 ? images.length - 1 : imgIndex - 1;
    previousSearchParams.set('image', previousImageIndex.toString());
    const previousUrl = createUrl(pathname, previousSearchParams);
    router.replace(previousUrl, { scroll: false });

    setImgIndex(previousImageIndex);
  };

  const handleNextImage = () => {
    // 1. change url
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    const nextImageIndex = imgIndex + 1 < images.length ? imgIndex + 1 : 0;
    nextSearchParams.set('image', nextImageIndex.toString());
    const nextUrl = createUrl(pathname, nextSearchParams);
    router.replace(nextUrl, { scroll: false });

    // 2. change state
    setImgIndex((imgIndex + 1) % images.length);
  };

  const buttonClassName =
    'h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white flex items-center justify-center';

  return (
    <>
      <div className="h-full w-full basis-full lg:basis-4/6">
        <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
          {images[imgIndex] && (
            <Image
              className="h-full w-full object-contain"
              fill
              sizes="(min-width: 1024px) 66vw, 100vw"
              alt={images[imgIndex]?.altText as string}
              src={images[imgIndex]?.src as string}
              priority={true}
            />
          )}

          {images.length > 1 ? (
            <div className="absolute bottom-[15%] flex w-full justify-center">
              <div className="mx-auto flex h-11 items-center rounded-full border border-white bg-neutral-50/80 text-neutral-500 backdrop-blur dark:border-black dark:bg-neutral-900/80">
                <button
                  aria-label="Previous product image"
                  className={buttonClassName}
                  onClick={handlePreviousImage}
                >
                  <ArrowLeftIcon className="h-5" />
                </button>
                <div className="mx-1 h-6 w-px bg-neutral-500"></div>
                <button
                  aria-label="Next product image"
                  className={buttonClassName}
                  onClick={handleNextImage}
                >
                  <ArrowRightIcon className="h-5" />
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {images.length > 1 ? (
          <ul className="my-12 flex items-center justify-center gap-2 overflow-auto py-1 lg:mb-0">
            {images.map((image, index) => {
              const isActive = index === imgIndex;
              const imageSearchParams = new URLSearchParams(
                searchParams.toString()
              );

              imageSearchParams.set('image', index.toString());

              return (
                <li key={image.src} className="h-20 w-20">
                  <button
                    aria-label="Enlarge product image"
                    className="h-full w-full"
                    onClick={() => {
                      setImgIndex(index);
                      router.replace(createUrl(pathname, imageSearchParams), {
                        scroll: false,
                      });
                    }}
                  >
                    <GridTileImage
                      alt={image.altText}
                      src={image.src}
                      width={80}
                      height={80}
                      active={isActive}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>

      <div className="basis-full lg:basis-2/6">
        <TestingDescription
          product={product}
          currentModel={currentModel}
          setCurrentModel={setCurrentModel}
        />
      </div>
    </>
  );
}
