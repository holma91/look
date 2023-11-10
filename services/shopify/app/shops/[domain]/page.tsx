import Grid from 'components/grid';
import { GridTileImage } from 'components/grid/tile';
import { getProducts } from 'lib/shopify/mystuff';
import { Product } from 'lib/shopify/types';
import Link from 'next/link';

export default async function Shop({ params }: { params: { domain: string } }) {
  const products = await getProducts({
    domain: params.domain,
  });

  return (
    <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <ProductGridItems domain={params.domain} products={products} />
    </Grid>
  );
}

function ProductGridItems({
  domain,
  products,
}: {
  domain: string;
  products: Product[];
}) {
  return (
    <>
      {products.map((product) => (
        <Grid.Item key={product.handle} className="animate-fadeIn">
          <Link
            className="relative inline-block h-full w-full"
            href={`/shops/${domain}/${product.handle}`}
          >
            <GridTileImage
              alt={product.title}
              label={{
                title: product.title,
                amount: product.priceRange.maxVariantPrice.amount,
                currencyCode: product.priceRange.maxVariantPrice.currencyCode,
              }}
              src={product.featuredImage?.url}
              fill
              sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </Link>
        </Grid.Item>
      ))}
    </>
  );
}
