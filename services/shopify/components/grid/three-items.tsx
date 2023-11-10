import { GridTileImage } from 'components/grid/tile';
import { getProducts } from 'lib/shopify/mystuff';
import type { Product } from 'lib/shopify/types';
import Link from 'next/link';

function ThreeItemGridItem({
  domain,
  item,
  size,
  priority,
}: {
  domain: string;
  item: Product;
  size: 'full' | 'half';
  priority?: boolean;
}) {
  return (
    <div
      className={
        size === 'full'
          ? 'md:col-span-4 md:row-span-2'
          : 'md:col-span-2 md:row-span-1'
      }
    >
      <Link
        className="relative block aspect-square h-full w-full"
        href={`/shops/${domain}/${item.handle}`}
      >
        <GridTileImage
          src={item.featuredImage.url}
          fill
          sizes={
            size === 'full'
              ? '(min-width: 768px) 66vw, 100vw'
              : '(min-width: 768px) 33vw, 100vw'
          }
          priority={priority}
          alt={item.title}
          label={{
            position: size === 'full' ? 'center' : 'bottom',
            title: item.title as string,
            amount: item.priceRange.maxVariantPrice.amount,
            currencyCode: item.priceRange.maxVariantPrice.currencyCode,
          }}
        />
      </Link>
    </div>
  );
}

export async function ThreeItemGrid({ domain }: { domain: string }) {
  // should probably configure this to only get the first 3 products (from a collection)
  const products = await getProducts({
    domain: domain,
  });

  if (!products[0] || !products[1] || !products[2]) return null;

  const [firstProduct, secondProduct, thirdProduct] = products;

  return (
    <div className="mt-4 mx-auto max-w-screen-2xl px-4 pb-4 ">
      <Link
        href={`/shops/${domain}`}
        className="mb-4 px-6 text-3xl font-medium"
      >
        {domain}
      </Link>
      <section className="mt-4 grid gap-4 md:grid-cols-6 md:grid-rows-1">
        <ThreeItemGridItem
          size="half"
          domain={domain}
          item={firstProduct}
          priority={true}
        />
        <ThreeItemGridItem
          size="half"
          domain={domain}
          item={secondProduct}
          priority={true}
        />
        <ThreeItemGridItem
          size="half"
          domain={domain}
          item={thirdProduct}
          priority={true}
        />
      </section>
    </div>
  );
}
