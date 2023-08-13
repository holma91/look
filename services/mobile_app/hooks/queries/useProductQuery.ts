import { useQuery } from '@tanstack/react-query';

import { UserProduct } from '../../utils/types';
import { URL } from '../../api/index';
import { useFirebaseUser } from '../useFirebaseUser';

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
  const { user } = useFirebaseUser();

  const productQuery = useQuery({
    queryKey: ['product', initialProduct.url],
    queryFn: () => fetchProduct(user!.uid, initialProduct.url),
    initialData: initialProduct,
    enabled: !!user?.uid,
    onError: (err) => {
      console.log('error fetching individual product:', err);
    },
  });

  return productQuery;
};
