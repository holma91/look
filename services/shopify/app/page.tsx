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
const salesChannelDomain = process.env.SALES_CHANNEL_DOMAIN + '/api/shops';
async function getShops(): Promise<Shop[]> {
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
  const shops = await getShops();

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
