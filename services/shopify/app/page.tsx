import { ThreeItemGrid } from 'components/grid/three-items';
import Footer from 'components/layout/footer';
import { Shop } from 'lib/shopify/types';
import { Suspense } from 'react';

export const runtime = 'edge';

export const metadata = {
  description:
    'High-performance ecommerce store built with Next.js, Vercel, and Shopify.',
  openGraph: {
    type: 'website',
  },
};

// get the shops here
async function getShops(): Promise<Shop[]> {
  // should we a also get 3 products here?
  const salesChannelDomain = process.env.SALES_CHANNEL_DOMAIN + '/api/shops';
  const result = await fetch(salesChannelDomain!, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const body = await result.json();

  if (body.errors) {
    throw body.errors[0];
  }

  return body.shops;
}

export default async function HomePage() {
  let shops = await getShops();
  // shops = [shops[0]!];

  return (
    <>
      {shops.map((shop) => (
        <ThreeItemGrid shop={shop} />
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
