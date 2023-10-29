'use client';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { GridTileImage } from 'components/grid/tile';
import { createUrl } from 'lib/utils';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';

type Props = {
  images: { src: string; altText: string }[];
  imgIndex: number;
  setImgIndex: Dispatch<SetStateAction<number>>;
  currentModel: string;
  currentEnv: string;
};

export function TestingGallery({
  images,
  imgIndex,
  setImgIndex,
  currentModel,
  currentEnv,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleImageChange = (index: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('image', index.toString());
    const imageUrl = createUrl(pathname, newSearchParams);
    router.replace(imageUrl, { scroll: false });

    setImgIndex(index);
  };

  const buttonClassName =
    'h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white flex items-center justify-center';

  return (
    <>
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
                onClick={() =>
                  handleImageChange(
                    imgIndex === 0 ? images.length - 1 : imgIndex - 1
                  )
                }
              >
                <ArrowLeftIcon className="h-5" />
              </button>
              <div className="mx-1 h-6 w-px bg-neutral-500"></div>
              <button
                aria-label="Next product image"
                className={buttonClassName}
                onClick={() =>
                  handleImageChange((imgIndex + 1) % images.length)
                }
              >
                <ArrowRightIcon className="h-5" />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {images.length > 1 ? (
        <ul className="my-12 flex items-center justify-center gap-2 py-1 lg:mb-0">
          {images.map((image, index) => {
            return (
              <li key={image.src} className="h-20 w-20">
                <button
                  aria-label="Enlarge product image"
                  className="h-full w-full"
                  onClick={() => handleImageChange(index)}
                >
                  <GridTileImage
                    alt={image.altText}
                    src={image.src}
                    width={80}
                    height={80}
                    active={index === imgIndex}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </>
  );
}
