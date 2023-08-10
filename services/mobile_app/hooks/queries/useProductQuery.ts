import { useUser } from '@clerk/clerk-expo';
import { useQuery } from '@tanstack/react-query';

import { UserProduct } from '../../utils/types';
import { URL } from '../../api/index';

async function fetchProduct(id: string, url: string) {
  const completeUrl = `${URL}/users/${id}/product?product_url=${url}`;
  const response = await fetch(completeUrl);

  if (!response.ok) {
    throw new Error(
      `Network response was not ok. Status code: ${response.status}`
    );
  }
  return response.json();
}

export const useProductQuery = (initialProduct: UserProduct) => {
  const { user } = useUser();

  const productQuery = useQuery({
    queryKey: ['product', initialProduct.url],
    queryFn: () => fetchProduct(user!.id, initialProduct.url),
    initialData: initialProduct,
    enabled: !!user?.id,
    onError: (err) => {
      console.log('error fetching individual product:', err);
    },
  });

  return productQuery;
};
