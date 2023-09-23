'use client';

import { GridTileImage } from '../grid/tile';
import { createUrl } from '../../lib/utils';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

export function GalleryCanvas({
  images,
}: {
  images: { src: string; altText: string }[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const imageSearchParam = searchParams.get('image');
  const imageIndex = imageSearchParam ? parseInt(imageSearchParam) : 0;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = images[imageIndex]?.src;

    img.onload = () => {
      console.log('img loaded, width', img.width, 'height', img.height);

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
  }, [images, imageIndex]);

  return (
    <div className="flex flex-col lg:flex-row justify-between gap-4 lg:justify-center h-full">
      <div className="flex order-2 lg:order-1 items-center">
        {images.length > 1 ? (
          <ul className="mt-1 lg:my-0 flex flex-row lg:flex-col lg:w-24 items-end justify-end gap-2 overflow-auto pt-1 lg:mb-0">
            {images.map((image, index) => {
              const isActive = index === imageIndex;
              const imageSearchParams = new URLSearchParams(
                searchParams.toString()
              );

              imageSearchParams.set('image', index.toString());

              return (
                <li key={image.src} className="h-16 w-16">
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
      </div>
      <canvas
        ref={canvasRef}
        className="order-1 lg:order-2 flex max-w-[100%] md:max-w-[95%]  lg:max-w-[500px]"
      ></canvas>
    </div>
  );
}
