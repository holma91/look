'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { GridTileImage } from 'components/grid/tile';
import { createUrl } from 'lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

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

type Props = {
  baseImages: { src: string; altText: string }[];
  currentModel: string;
  productId: string;
};

export function TestingGallery({ baseImages, currentModel, productId }: Props) {
  const getImages = () => {
    if (currentModel === 'base') {
      return baseImages;
    }

    return (
      db[productId]?.[currentModel]?.map((src) => ({
        src,
        altText: 'some alt text',
      })) ?? []
    );
  };
  const images = getImages();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const imageSearchParam = searchParams.get('image');
  const imageIndex = imageSearchParam ? parseInt(imageSearchParam) : 0;

  const nextSearchParams = new URLSearchParams(searchParams.toString());
  const nextImageIndex = imageIndex + 1 < images.length ? imageIndex + 1 : 0;
  nextSearchParams.set('image', nextImageIndex.toString());
  const nextUrl = createUrl(pathname, nextSearchParams);

  const previousSearchParams = new URLSearchParams(searchParams.toString());
  const previousImageIndex =
    imageIndex === 0 ? images.length - 1 : imageIndex - 1;
  previousSearchParams.set('image', previousImageIndex.toString());
  const previousUrl = createUrl(pathname, previousSearchParams);

  const buttonClassName =
    'h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white flex items-center justify-center';

  console.log('images', images);

  return (
    <>
      <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
        {images[imageIndex] && (
          <Image
            className="h-full w-full object-contain"
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
            alt={images[imageIndex]?.altText as string}
            src={images[imageIndex]?.src as string}
            priority={true}
          />
        )}

        {images.length > 1 ? (
          <div className="absolute bottom-[15%] flex w-full justify-center">
            <div className="mx-auto flex h-11 items-center rounded-full border border-white bg-neutral-50/80 text-neutral-500 backdrop-blur dark:border-black dark:bg-neutral-900/80">
              <Link
                aria-label="Previous product image"
                href={previousUrl}
                className={buttonClassName}
                scroll={false}
              >
                <ArrowLeftIcon className="h-5" />
              </Link>
              <div className="mx-1 h-6 w-px bg-neutral-500"></div>
              <Link
                aria-label="Next product image"
                href={nextUrl}
                className={buttonClassName}
                scroll={false}
              >
                <ArrowRightIcon className="h-5" />
              </Link>
            </div>
          </div>
        ) : null}
      </div>

      {images.length > 1 ? (
        <ul className="my-12 flex items-center justify-center gap-2 overflow-auto py-1 lg:mb-0">
          {images.map((image, index) => {
            const isActive = index === imageIndex;
            const imageSearchParams = new URLSearchParams(
              searchParams.toString()
            );

            imageSearchParams.set('image', index.toString());

            return (
              <li key={image.src} className="h-20 w-20">
                <Link
                  aria-label="Enlarge product image"
                  href={createUrl(pathname, imageSearchParams)}
                  scroll={false}
                  className="h-full w-full"
                >
                  <GridTileImage
                    alt={image.altText}
                    src={image.src}
                    width={80}
                    height={80}
                    active={isActive}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </>
  );
}
