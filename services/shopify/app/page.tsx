import { ThreeItemGrid } from 'components/grid/three-items';
import Footer from 'components/layout/footer';
import { getShops } from 'lib/shopify/mystuff';
import { Suspense } from 'react';

export const runtime = 'edge';

export const metadata = {
  description:
    'High-performance ecommerce store built with Next.js, Vercel, and Shopify.',
  openGraph: {
    type: 'website',
  },
};

export default async function HomePage() {
  let shops = await getShops();

  return (
    <>
      {shops.map((shop) => (
        <ThreeItemGrid key={shop.id} shop={shop} />
      ))}
      <Suspense>
        {/* <Carousel /> */}
        <Suspense>
          <Footer />
        </Suspense>
      </Suspense>
    </>
  );
}
