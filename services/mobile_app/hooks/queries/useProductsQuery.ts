import { useUser } from '@clerk/clerk-expo';
import { useQuery } from '@tanstack/react-query';

import { FilterType, UserProduct } from '../../utils/types';

import { URL } from '../../api/index';
import { useFirebaseUser } from '../useFirebaseUser';

export async function fetchProducts(
  id: string,
  filter: FilterType
): Promise<UserProduct[]> {
  let completeUrl = '';
  try {
    const queryString = Object.entries(filter)
      .flatMap(([key, values]) =>
        values?.map(
          (value) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
      )
      .join('&');
    completeUrl = `${URL}/users/${id}/products?${queryString}`;
  } catch (e) {
    console.log('error:', e);
  }

  const response = await fetch(completeUrl);

  if (!response.ok) {
    console.log('response:', response);

    throw new Error(
      `Network response was not ok. Status code: ${response.status}`
    );
  }
  return response.json();
}

export const useProductsQuery = (filter: FilterType) => {
  // const { user } = useUser();
  const { user } = useFirebaseUser();

  const productsQuery = useQuery({
    queryKey: ['products', user?.uid, filter],
    queryFn: () => fetchProducts(user?.uid as string, filter),
    enabled: !!user?.uid,
    onError: (err) => {
      console.log('error fetching products:', err);
    },
  });

  return productsQuery;
};
