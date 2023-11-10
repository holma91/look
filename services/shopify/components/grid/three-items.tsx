import { GridTileImage } from 'components/grid/tile';
import { getProducts } from 'lib/shopify/mystuff';
import type { Product, Shop } from 'lib/shopify/types';
import Link from 'next/link';

function ThreeItemGridItem({
  item,
  size,
  priority,
}: {
  item: Product;
  size: 'full' | 'half';
  priority?: boolean;
}) {
  // console.log('item', item);

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
        href={`/product/${item.handle}`}
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

export async function ThreeItemGrid({ shop }: { shop: Shop }) {
  // now every instance of this is for a shop
  // Collections that start with `hidden-*` are hidden from the search page.

  const products = await getProducts({
    domain: shop.domain,
    key: shop.storefrontAccessToken,
  }); // this now works with configurable domain and key

  if (!products[0]) return null;

  const [firstProduct, secondProduct, thirdProduct] = products;

  return (
    <>
      <Link
        href={`/shop/${shop.domain}`}
        className="mb-4 px-6 text-3xl font-medium"
      >
        {shop.domain}
      </Link>
      <section className="mt-4 mx-auto grid max-w-screen-2xl gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2">
        <ThreeItemGridItem size="full" item={firstProduct} priority={true} />
        {products[1] ? (
          <ThreeItemGridItem size="half" item={secondProduct!} />
        ) : null}
        {products[2] ? (
          <ThreeItemGridItem size="half" item={thirdProduct!} />
        ) : null}
      </section>
    </>
  );
}
