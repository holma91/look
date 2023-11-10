// here we have the shop id
// can retrieve the access token
// can retrieve the products

import { getProducts, getStorefrontAccessToken } from 'lib/shopify/mystuff';

// with the access token, we can retrieve the stores products
export default async function Shop({ params }: { params: { domain: string } }) {
  const storefrontAccessToken = await getStorefrontAccessToken(params.domain);
  const products = await getProducts({
    domain: params.domain,
    key: storefrontAccessToken,
  });
  console.log('products', products);

  // console.log('homepageItems', homepageItems);

  return (
    <div>
      <h1>{params.domain}</h1>
      <p>{storefrontAccessToken}</p>
      <p>products.length: {products.length}</p>
    </div>
  );
}
