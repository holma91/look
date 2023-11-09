// here we have the shop id
// can retrieve the access token

import { getCollectionProducts } from 'lib/shopify';

// with the access token, we can retrieve the stores products
export default async function Shop({ params }: { params: { name: string } }) {
  const homepageItems = await getCollectionProducts({
    collection: 'hidden-homepage-featured-items',
  });

  // console.log('params', params);

  // console.log('homepageItems', homepageItems);

  return (
    <div>
      <h1>{params.name}</h1>
    </div>
  );
}
